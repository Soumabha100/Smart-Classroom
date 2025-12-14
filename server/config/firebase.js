const admin = require("firebase-admin");
require('dotenv').config(); // Ensure env vars are loaded

let serviceAccount;

// 1. Check if we have the credentials in an Environment Variable (Render/Production)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    // Parse the JSON string from the environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", error);
  }
} 
// 2. If not, try to load the local file (Local Development)
else {
  try {
    serviceAccount = require("./serviceAccountKey.json");
  } catch (error) {
    console.error("❌ serviceAccountKey.json not found and FIREBASE_SERVICE_ACCOUNT not set.");
  }
}

// 3. Initialize Firebase
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin Initialized successfully.");
} else {
  console.error("❌ Firebase Admin could not be initialized. Missing credentials.");
}

module.exports = admin;