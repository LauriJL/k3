const admin = require("firebase-admin");

// Initialize the Admin SDK
admin.initializeApp();

async function verifyFirebaseToken(idToken) {
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    const invalidTokenErrors = new Set([
      "auth/argument-error",
      "auth/id-token-expired",
      "auth/id-token-revoked",
      "auth/invalid-id-token",
    ]);

    if (invalidTokenErrors.has(error.code)) {
      console.error("Error verifying ID token:", error.code);
      return null;
    }
    throw error;
  }
}

module.exports = { verifyFirebaseToken };
