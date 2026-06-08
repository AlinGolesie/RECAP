const admin = require("firebase-admin");

let credential;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
} else {
  try {
    const serviceAccount = require("./serviceAccountKey.json");
    credential = admin.credential.cert(serviceAccount);
  } catch {
    console.error(
      "Firebase credentials not found.\n" +
      "Either set the FIREBASE_SERVICE_ACCOUNT environment variable (JSON string),\n" +
      "or place serviceAccountKey.json in the backend/ directory.\n" +
      "Download it from Firebase Console → Project Settings → Service Accounts."
    );
    process.exit(1);
  }
}

admin.initializeApp({ credential });

const db = admin.firestore();

module.exports = { admin, db };
