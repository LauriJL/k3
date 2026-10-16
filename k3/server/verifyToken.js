const admin = require("firebase-admin");
const VERIFY_TIMEOUT_MS = 30000;

// Initialize the Admin SDK
admin.initializeApp();

async function verifyFirebaseToken(idToken) {
  let timeoutId;

  try {
    return await Promise.race([
      admin.auth().verifyIdToken(idToken),
      new Promise((_, reject) => {
        timeoutId = setTimeout(
          () =>
            reject(
              new Error(
                "Firebase ID token verification timed out after 30 seconds.",
              ),
            ),
          VERIFY_TIMEOUT_MS,
        );
      }),
    ]);
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
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = { verifyFirebaseToken };
