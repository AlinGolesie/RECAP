#!/usr/bin/env python3

import os
import sys
import time
import signal
import logging
import threading
import requests 
import cv2
from http.server import BaseHTTPRequestHandler, HTTPServer
from dotenv import load_dotenv 
from picamera2 import Picamera2
from edge_impulse_linux.image import ImageImpulseRunner

# loads values from the .env file into environment variables
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("recap")

# all configuration is read from environment variables so nothing sensitive is hardcoded
USER_ID     = os.environ["RECAP_USER_ID"]
BACKEND_URL = os.environ.get("RECAP_BACKEND_URL", "http://localhost:3000")
MODEL_PATH  = os.environ.get("EIM_MODEL_PATH", "./model.eim")
DEVICE_ID   = os.environ.get("DEVICE_ID", "raspberry-pi-01")
CONFIDENCE  = float(os.environ.get("MIN_CONFIDENCE", "0.80"))
STREAM_PORT = int(os.environ.get("STREAM_PORT", "8080"))

# these are set later in main() once the hardware is initialised
picam  = None
runner = None

# the latest camera frame is stored here so the stream server and the scan logic share the same image
latest_frame = None
frame_lock   = threading.Lock()


# this class handles incoming HTTP requests for the live camera stream and snapshots
class MJPEGHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    # converts a raw RGB frame from the camera into a JPEG byte string
    def _jpeg_from_frame(self, frame):
        bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        _, jpeg = cv2.imencode(".jpg", bgr, [cv2.IMWRITE_JPEG_QUALITY, 75])
        return jpeg.tobytes()

    def do_GET(self):
        # /stream sends a continuous multipart response, one JPEG per frame
        if self.path == "/stream":
            self.send_response(200)
            self.send_header("Content-Type", "multipart/x-mixed-replace; boundary=--jpgboundary")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            try:
                while True:
                    with frame_lock:
                        frame = latest_frame
                    if frame is not None:
                        data = self._jpeg_from_frame(frame)
                        self.wfile.write(b"--jpgboundary\r\nContent-Type: image/jpeg\r\n\r\n")
                        self.wfile.write(data)
                        self.wfile.write(b"\r\n")
                    time.sleep(0.1)
            except (BrokenPipeError, ConnectionResetError, OSError):
                pass

        # /snapshot returns a single JPEG, used by the frontend to show a still image
        elif self.path.startswith("/snapshot"):
            with frame_lock:
                frame = latest_frame
            if frame is not None:
                data = self._jpeg_from_frame(frame)
                self.send_response(200)
                self.send_header("Content-Type", "image/jpeg")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Cache-Control", "no-cache, no-store")
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_response(503)
                self.end_headers()

        else:
            self.send_response(404)
            self.end_headers()


def start_stream_server():
    server = HTTPServer(("0.0.0.0", STREAM_PORT), MJPEGHandler)
    log.info("MJPEG stream available at http://<pi-ip>:%d/stream", STREAM_PORT)
    server.serve_forever()


# runs in a background thread and keeps latest_frame updated at roughly 20fps
def frame_capture_loop():
    global latest_frame
    while True:
        try:
            frame = picam.capture_array()
            with frame_lock:
                latest_frame = frame
            time.sleep(0.05)
        except Exception as exc:
            log.error("Frame capture error: %s", exc)
            time.sleep(1)


def init_camera() -> Picamera2:
    cam = Picamera2()
    config = cam.create_preview_configuration(main={"size": (640, 480), "format": "RGB888"})
    cam.configure(config)
    cam.start()
    time.sleep(1.5)
    log.info("Camera Module 3 ready.")
    return cam


def init_runner(model_path: str) -> ImageImpulseRunner:
    if not os.path.isfile(model_path):
        log.error("Model file not found: %s", model_path)
        log.error("Export your Edge Impulse project as 'Linux (AARCH64)' and place the .eim here.")
        sys.exit(1)
    r = ImageImpulseRunner(model_path)
    info = r.init()
    log.info(
        "Edge Impulse model loaded: %s v%s | input %dx%d",
        info["project"]["name"],
        info["project"]["deploy_version"],
        info["model_parameters"]["image_input_width"],
        info["model_parameters"]["image_input_height"],
    )
    return r


# takes the current frame, runs it through the Edge Impulse model and returns the top label and confidence
def capture_and_classify() -> dict | None:
    with frame_lock:
        frame = latest_frame

    if frame is None:
        log.warning("No frame available yet.")
        return None

    features, _ = runner.get_features_from_image(frame)
    result = runner.classify(features)

    if "classification" not in result.get("result", {}):
        log.warning("No classification result in model output.")
        return None

    classification = result["result"]["classification"]
    top_label = max(classification, key=classification.get)
    top_conf  = classification[top_label]

    log.info("Classification: %s", {k: f"{v:.2f}" for k, v in classification.items()})
    log.info("Top: %s (%.2f)", top_label, top_conf)

    return {"label": top_label, "confidence": top_conf, "all": classification}


# sends the scan outcome back to the backend so the frontend can show the result to the user
def report_result(user_id: str, success: bool, bottle_type: str = None, points: int = None, message: str = None):
    payload = {
        "userId":     user_id,
        "success":    success,
        "bottleType": bottle_type,
        "points":     points,
        "message":    message,
    }
    try:
        requests.post(f"{BACKEND_URL}/api/scan-result", json=payload, timeout=5)
    except Exception:
        pass


# sends the detected bottle to the backend which validates it and awards points
def post_scan(user_id: str, label: str, confidence: float):
    payload = {
        "userId":        user_id,
        "detectedLabel": label,
        "confidence":    confidence,
        "deviceId":      DEVICE_ID,
    }
    try:
        resp = requests.post(f"{BACKEND_URL}/api/scan", json=payload, timeout=10)
        data = resp.json()
        if resp.ok and data.get("success"):
            pts = data.get("pointsAwarded")
            weight = data.get("weight")
            log.info("Scan accepted: %s +%s pts", data["bottleType"], pts)
            return True, pts, weight
        else:
            log.warning("Backend rejected scan: %s", data.get("message", resp.text))
            return False, None, None
    except requests.exceptions.ConnectionError:
        log.error("Cannot reach backend at %s — is it running?", BACKEND_URL)
        return False, None, None
    except Exception as exc:
        log.error("POST failed: %s", exc)
        return False, None, None


# this is called whenever the web app queues a scan for a user
def on_scan_triggered(user_id: str):
    log.info("Scanning for user: %s", user_id)
    result = capture_and_classify()

    # if the model couldn't produce a result at all, we reject immediately
    if result is None:
        log.warning("Scan skipped: no classification result.")
        report_result(user_id, False, message="Bottle type not recognised, please remove")
        return

    # "unknown" means no bottle was detected in the frame
    if result["label"].lower() == "unknown":
        log.warning("No bottle detected (unknown). Move bottle into frame and try again.")
        report_result(user_id, False, message="Bottle type not recognised, please remove")
        return

    # if the model is not confident enough we don't accept the scan to avoid false positives
    if result["confidence"] < CONFIDENCE:
        log.warning(
            "Confidence %.2f < %.2f — rejected. Improve lighting or move bottle closer.",
            result["confidence"], CONFIDENCE,
        )
        report_result(user_id, False, message="Bottle type not recognised, please remove")
        return

    success, pts, weight = post_scan(user_id, result["label"], result["confidence"])
    if success:
        report_result(user_id, True, bottle_type=result["label"].upper(), points=pts, message=f"Bottle scanned successfully! Weight: {weight}g")
    else:
        report_result(user_id, False, message="Bottle type not recognised, please remove")


# cleans up hardware resources when the script is stopped with Ctrl+C or a kill signal
def shutdown(sig, frame):
    log.info("Shutting down...")
    if picam:
        picam.stop()
    if runner:
        runner.stop()
    sys.exit(0)


def main():
    global picam, runner

    signal.signal(signal.SIGINT,  shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    log.info("RECAP device starting | user: %s | backend: %s", USER_ID, BACKEND_URL)

    picam  = init_camera()
    runner = init_runner(MODEL_PATH)

    # frame capture and stream server run in the background so the main loop stays free for scan logic
    threading.Thread(target=frame_capture_loop, daemon=True).start()
    threading.Thread(target=start_stream_server, daemon=True).start()

    log.info("Ready. Stream: http://<pi-ip>:%d/stream", STREAM_PORT)

    while True:
        scan_user_id = None

        # checks whether the web app queued a scan for any user
        try:
            resp = requests.get(f"{BACKEND_URL}/api/next-pending-scan/{DEVICE_ID}", timeout=3)
            data = resp.json()
            if data.get("pending"):
                scan_user_id = data["userId"]
                log.info("Scan requested from web app for user: %s", scan_user_id)
        except Exception:
            pass

        if scan_user_id:
            on_scan_triggered(scan_user_id)
            time.sleep(1.0)
        else:
            time.sleep(2.0)


if __name__ == "__main__":
    main()
