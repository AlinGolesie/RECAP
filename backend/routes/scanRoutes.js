const express = require("express");
const router = express.Router();
const { admin, db } = require("../firebase");

// Maps Edge Impulse label (uppercased) → Firestore bottleShapeTypes document ID
const LABEL_TO_DOC_ID = {
  "500ML": "0.5 ml bottles",
  "750ML": "0.75 ml bottle",
};

let bottleTypesCache = null;

async function loadBottleTypes() {
  const snapshot = await db.collection("bottleShapeTypes").get();
  const cache = {};
  snapshot.forEach(doc => {
    cache[doc.id] = { id: doc.id, ...doc.data() };
  });
  console.log(`Loaded ${Object.keys(cache).length} bottle types from Firestore:`, Object.keys(cache));
  return cache;
}

async function getBottleType(docId) {
  if (!bottleTypesCache) {
    bottleTypesCache = await loadBottleTypes();
  }
  return bottleTypesCache[docId] || null;
}

// POST /api/scan  — called by the Raspberry Pi after Edge Impulse classification
router.post("/scan", async (req, res) => {
  try {
    const { userId, detectedLabel, confidence, deviceId } = req.body;

    if (!userId || !detectedLabel || confidence === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields: userId, detectedLabel, confidence" });
    }

    if (confidence < 0.80) {
      return res.status(400).json({ success: false, message: "Confidence too low", confidence });
    }

    const label = detectedLabel.toUpperCase();
    const docId = LABEL_TO_DOC_ID[label];

    if (!docId) {
      return res.status(404).json({ success: false, message: `Unknown bottle type: ${detectedLabel}` });
    }

    const bottleType = await getBottleType(docId);

    if (!bottleType) {
      return res.status(404).json({ success: false, message: `Bottle type not found in database: ${docId}` });
    }

    if (bottleType.active === false) {
      return res.status(400).json({ success: false, message: "Bottle type not currently accepted" });
    }

    const userRef = db.collection("users").doc(userId);
    const scanRef = db.collection("scans").doc();

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        transaction.set(userRef, {
          totalPoints: bottleType.points,
          totalBottles: 1,
          totalWeight: bottleType.weight,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        transaction.update(userRef, {
          totalPoints: admin.firestore.FieldValue.increment(bottleType.points),
          totalBottles: admin.firestore.FieldValue.increment(1),
          totalWeight: admin.firestore.FieldValue.increment(bottleType.weight),
        });
      }

      transaction.set(scanRef, {
        userId,
        bottleType: label,
        shapeType: bottleType.shapeType || docId,
        bottleLabel: bottleType.label || label,
        material: bottleType.material || "PET",
        weight: bottleType.weight,
        points: bottleType.points,
        confidence,
        deviceId: deviceId || "raspberry-pi-01",
        success: true,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return res.json({
      success: true,
      message: "Bottle accepted",
      bottleType: label,
      pointsAwarded: bottleType.points,
      weight: bottleType.weight,
      material: bottleType.material,
      bottleLabel: bottleType.label,
    });

  } catch (error) {
    console.error("Scan error:", error);
    return res.status(500).json({ success: false, message: "Server error during scan" });
  }
});

module.exports = router;
