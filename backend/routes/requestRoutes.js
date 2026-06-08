const express = require("express");
const router = express.Router();

// holds pending scan requests in memory, mapped by userId to the time the request came in
const pendingScans = new Map();

// holds the result of each scan attempt, mapped by userId until the frontend picks it up
const scanResults = new Map();

// the frontend calls this when the user presses the scan button, it just queues the request
router.post("/request-scan", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }
  pendingScans.set(userId, Date.now());
  console.log(`Scan requested for user: ${userId}`);
  return res.json({ success: true });
});

// older endpoint that was used before the device polling approach, still here so nothing breaks
router.get("/pending-scan/:userId", (req, res) => {
  const { userId } = req.params;
  if (pendingScans.has(userId)) {
    pendingScans.delete(userId);
    return res.json({ pending: true });
  }
  return res.json({ pending: false });
});

// the raspberry pi polls this every few seconds to check if any user is waiting for a scan
router.get("/next-pending-scan/:deviceId", (req, res) => {
  if (pendingScans.size === 0) {
    return res.json({ pending: false });
  }
  // oldest request goes first so nobody waits longer than needed
  const [userId] = [...pendingScans.entries()].sort((a, b) => a[1] - b[1])[0];
  pendingScans.delete(userId);
  console.log(`Scan dispatched to device for user: ${userId}`);
  return res.json({ pending: true, userId });
});

// the raspberry pi sends the scan result here after it finishes classifying the bottle
router.post("/scan-result", (req, res) => {
  const { userId, success, bottleType, points, message } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }
  scanResults.set(userId, { success, bottleType, points, message, ts: Date.now() });
  return res.json({ success: true });
});

// the frontend polls this while showing the loading screen, waiting for the pi to finish
router.get("/scan-result/:userId", (req, res) => {
  const { userId } = req.params;
  if (scanResults.has(userId)) {
    const result = scanResults.get(userId);
    scanResults.delete(userId);
    return res.json({ ready: true, ...result });
  }
  return res.json({ ready: false });
});

module.exports = router;
