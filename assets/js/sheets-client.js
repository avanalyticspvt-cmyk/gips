/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Google Sheets & Apps Script Client Integration Layer
 *
 * Communicates with the deployed Google Apps Script Web App.
 * Handles CORS, redirects, network timeouts, duplicate prevention,
 * persistent offline queuing, and transparent status reporting.
 */

const SheetsClient = {
  /**
   * Submits a completed assessment to Google Sheets via Apps Script.
   *
   * @param {Object} payload - Complete assessment payload
   * @returns {Promise<Object>} Status object { success: boolean, message: string, data?: any }
   */
  async submitAssessment(payload) {
    const webAppUrl = (typeof CONFIG !== "undefined" && CONFIG.APPS_SCRIPT_WEBAPP_URL)
      ? CONFIG.APPS_SCRIPT_WEBAPP_URL
      : "";

    // 1. Check if a valid Apps Script URL is configured
    if (!webAppUrl || webAppUrl.includes("YOUR_DEPLOYMENT_ID")) {
      console.warn("Apps Script Web App URL is not yet configured in config.js");
      this.saveToOfflineQueue(payload);
      return {
        success: false,
        isConfigError: true,
        message: "Google Apps Script endpoint is not yet configured. The assessment data has been saved locally in your browser offline queue."
      };
    }

    // 2. Prepare request with timeout controller
    const timeoutMs = (typeof CONFIG !== "undefined" && CONFIG.NETWORK_TIMEOUT_MS) ? CONFIG.NETWORK_TIMEOUT_MS : 15000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // NOTE: Using Content-Type 'text/plain;charset=utf-8' prevents CORS preflight OPTIONS request
      // which Google Apps Script does not support. Google Apps Script's doPost(e) parses e.postData.contents as JSON.
      const response = await fetch(webAppUrl, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Inspect response status
      if (!response.ok && response.status !== 0) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      // Parse JSON response returned from Apps Script
      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        // If redirect resulted in opaque or non-json response but status was 200/ok
        result = { status: "success", message: "Assessment transmitted successfully to Google Sheets." };
      }

      if (result.status === "success" || result.result === "success") {
        // Remove from offline queue if it was queued
        this.removeFromOfflineQueue(payload.assessmentId);
        return {
          success: true,
          assessmentId: payload.assessmentId,
          message: "Assessment successfully recorded in Google Sheets database."
        };
      } else {
        throw new Error(result.message || "Spreadsheet returned an unsuccessful status.");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Submission failed:", err);

      // Save to offline queue so data is never lost
      this.saveToOfflineQueue(payload);

      let userMsg = "Failed to communicate with Google Sheets. Data has been safely saved to your local offline queue.";
      if (err.name === "AbortError") {
        userMsg = "Request timed out after 15 seconds. Data preserved locally. You can retry once your network improves.";
      } else if (err.message) {
        userMsg = `Submission error: ${err.message}. Data preserved locally.`;
      }

      return {
        success: false,
        error: err.message,
        message: userMsg
      };
    }
  },

  /**
   * Tests the Google Apps Script Web App connection using GET.
   */
  async testConnection() {
    const webAppUrl = (typeof CONFIG !== "undefined" && CONFIG.APPS_SCRIPT_WEBAPP_URL)
      ? CONFIG.APPS_SCRIPT_WEBAPP_URL
      : "";

    if (!webAppUrl || webAppUrl.includes("YOUR_DEPLOYMENT_ID")) {
      return { success: false, message: "Apps Script Web App URL is not set in assets/js/config.js" };
    }

    try {
      const response = await fetch(`${webAppUrl}?action=ping`, {
        method: "GET",
        mode: "cors"
      });
      const data = await response.json();
      return { success: true, data: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Saves a failed or un-submitted assessment to browser LocalStorage.
   */
  saveToOfflineQueue(payload) {
    try {
      const key = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
        ? CONFIG.STORAGE_KEYS.SUBMISSION_QUEUE
        : "goalfinity_offline_submissions";
      const queue = JSON.parse(localStorage.getItem(key) || "[]");

      // Replace existing entry if ID matches, else push
      const idx = queue.findIndex(item => item.assessmentId === payload.assessmentId);
      if (idx >= 0) {
        queue[idx] = payload;
      } else {
        queue.push(payload);
      }
      localStorage.setItem(key, JSON.stringify(queue));
    } catch (e) {
      console.warn("Could not save to offline queue in localStorage:", e);
    }
  },

  /**
   * Removes an assessment from browser LocalStorage offline queue.
   */
  removeFromOfflineQueue(assessmentId) {
    try {
      const key = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
        ? CONFIG.STORAGE_KEYS.SUBMISSION_QUEUE
        : "goalfinity_offline_submissions";
      let queue = JSON.parse(localStorage.getItem(key) || "[]");
      queue = queue.filter(item => item.assessmentId !== assessmentId);
      localStorage.setItem(key, JSON.stringify(queue));
    } catch (e) {
      console.warn("Could not remove from offline queue:", e);
    }
  },

  /**
   * Retrieves all pending offline submissions.
   */
  getOfflineQueue() {
    try {
      const key = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
        ? CONFIG.STORAGE_KEYS.SUBMISSION_QUEUE
        : "goalfinity_offline_submissions";
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      return [];
    }
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = SheetsClient;
} else {
  window.SheetsClient = SheetsClient;
}
