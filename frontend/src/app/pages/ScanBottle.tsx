import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Camera, Loader2, Info, Wifi } from "lucide-react";
import { useApp } from "../../context/AppContext";

const PI_SNAPSHOT_URL = "http://192.168.1.103:8080/snapshot";

export default function ScanBottle() {
  const navigate = useNavigate();
  const { scans, user } = useApp();
  const [waiting, setWaiting] = useState(false);
  const [streamOk, setStreamOk] = useState(false);
  const [snapshotSrc, setSnapshotSrc] = useState("");
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; points?: number } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnapshotSrc(`${PI_SNAPSHOT_URL}?t=${Date.now()}`);
    }, 150);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (!waiting || !user) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`http://192.168.1.236:3000/api/scan-result/${user.uid}`);
        const data = await res.json();
        if (data.ready) {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setWaiting(false);
          setFeedback({
            success: data.success,
            message: data.message,
            points: data.points ?? undefined,
          });
          if (data.success) {
            const currentScan = scans[0];
            if (currentScan) {
              localStorage.setItem('lastScanResult', JSON.stringify({
                bottleType: currentScan.bottleType,
                weight: currentScan.weight,
                points: currentScan.points,
              }));
            }
          }
        }
      } catch {
        // network hiccup — keep polling
      }
    }, 1500);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [waiting, user, scans]);

  const handleStartWaiting = async () => {
    if (!user) return;
    setFeedback(null);
    setWaiting(true);
    await fetch("http://192.168.1.236:3000/api/request-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid }),
    }).catch(() => {});
  };

  const handleCancel = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setWaiting(false);
    setFeedback(null);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Scan Bottle</h2>
          <p className="text-gray-400">Use your RECAP device to scan a plastic bottle</p>
        </div>

        <Card className="mb-6">
          <div className="aspect-video bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6 relative">
            {snapshotSrc && (
              <img
                src={snapshotSrc}
                className="w-full h-full object-cover"
                onLoad={() => setStreamOk(true)}
                onError={() => setStreamOk(false)}
              />
            )}
            {!streamOk && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="w-20 h-20 text-gray-600 mb-4" />
                <p className="text-lg text-gray-100">RECAP Device Camera</p>
                <p className="text-sm text-gray-400 mt-2">Connecting to stream...</p>
              </div>
            )}
            {waiting && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-green-500 animate-spin mb-4" />
                <p className="text-lg text-white font-semibold">Scanning bottle...</p>
              </div>
            )}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <Wifi className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                <strong className="text-blue-400">How it works:</strong> The Raspberry Pi device captures an image, runs the Edge Impulse model locally to identify the bottle type, then sends the result to RECAP automatically.
              </p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                <strong className="text-green-400">Instructions:</strong> Place the plastic bottle in front of the device camera with the label visible, then click Scan.
              </p>
            </div>
          </div>

          {feedback && (
            <div className={`rounded-lg p-4 mb-4 border ${feedback.success ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <p className={`text-sm font-semibold ${feedback.success ? "text-green-400" : "text-red-400"}`}>
                {feedback.message}
                {feedback.success && feedback.points != null && ` (+${feedback.points} pts)`}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {!waiting ? (
              <Button onClick={handleStartWaiting} className="flex-1">
                Scan Bottle
              </Button>
            ) : (
              <Button onClick={handleCancel} variant="secondary" className="flex-1">
                Cancel
              </Button>
            )}
            {!waiting && (
              <Button onClick={() => navigate("/dashboard")} variant="secondary">
                Back
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
