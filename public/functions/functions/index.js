
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

// Backend health check
exports.healthCheck = onCall(
  { cors: true },
  async (request) => {
    return {
      success: true,
      service: "SONDARIA",
      message: "Backend is running successfully."
    };
  }
);
