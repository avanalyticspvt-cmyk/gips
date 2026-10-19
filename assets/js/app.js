/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Main Application Orchestrator
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Intake controller
  if (typeof IntakeController !== "undefined") {
    IntakeController.init();
  }

  // Initialize Assessment wizard controller
  if (typeof AssessmentController !== "undefined") {
    AssessmentController.init();
  }

  // Check offline queue on load and notify counsellor if unsynced items exist
  checkOfflineQueueStatus();
});

/**
 * Checks if unsynced assessments exist in LocalStorage and displays an alert indicator.
 */
function checkOfflineQueueStatus() {
  if (typeof SheetsClient === "undefined") return;

  const queue = SheetsClient.getOfflineQueue();
  const alertEl = document.getElementById("offline-queue-alert");
  const countEl = document.getElementById("offline-queue-count");

  if (queue.length > 0 && alertEl && countEl) {
    countEl.textContent = queue.length;
    alertEl.style.display = "flex";

    const syncBtn = document.getElementById("btn-sync-offline-queue");
    if (syncBtn) {
      syncBtn.onclick = async () => {
        syncBtn.disabled = true;
        syncBtn.textContent = "Syncing...";
        let successCount = 0;
        for (const item of queue) {
          const res = await SheetsClient.submitAssessment(item);
          if (res.success) successCount++;
        }
        alert(`Successfully synced ${successCount} of ${queue.length} offline assessment records.`);
        checkOfflineQueueStatus();
        syncBtn.disabled = false;
        syncBtn.textContent = "Sync Offline Queue";
      };
    }
  } else if (alertEl) {
    alertEl.style.display = "none";
  }
}

// Global App reset helper
window.App = {
  resetAssessmentState() {
    if (typeof AssessmentController !== "undefined") {
      AssessmentController.resetWizard();
    }
  }
};
