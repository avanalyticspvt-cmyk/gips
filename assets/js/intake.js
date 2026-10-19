/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Step 1: Student Intake Controller
 */

const IntakeController = {
  currentProfile: null,

  /**
   * Initializes the intake form elements and event listeners.
   */
  init() {
    this.bindEvents();
    this.loadDraftOrCreateNew();
  },

  /**
   * Generates a new assessment ID and populates the UI badge.
   */
  loadDraftOrCreateNew() {
    const draftKey = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
      ? CONFIG.STORAGE_KEYS.DRAFT_ASSESSMENT
      : "goalfinity_assessment_draft";

    const savedDraft = localStorage.getItem(draftKey);
    let assessmentId = "";

    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.studentProfile && parsed.studentProfile.assessmentId) {
          assessmentId = parsed.studentProfile.assessmentId;
          this.populateForm(parsed.studentProfile);
          this.showDraftAlert(true);
        }
      } catch (e) {
        console.warn("Could not parse saved draft:", e);
      }
    }

    if (!assessmentId) {
      assessmentId = (typeof Validation !== "undefined")
        ? Validation.generateAssessmentId()
        : "GF-" + Date.now();
    }

    const idDisplay = document.getElementById("display-assessment-id");
    if (idDisplay) idDisplay.textContent = assessmentId;

    const idInput = document.getElementById("intake-assessment-id");
    if (idInput) idInput.value = assessmentId;
  },

  /**
   * Shows or hides the "Draft Restored" alert.
   */
  showDraftAlert(show) {
    const banner = document.getElementById("draft-notice-banner");
    if (banner) {
      banner.style.display = show ? "flex" : "none";
    }
  },

  /**
   * Populates form fields from a saved draft profile.
   */
  populateForm(profile) {
    if (!profile) return;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };

    setVal("student-name", profile.studentName);
    setVal("student-email", profile.studentEmail);
    setVal("student-mobile", profile.studentMobile);
    setVal("course-interest", profile.courseInterest);
    setVal("student-education", profile.education);
    setVal("student-specialization", profile.specialization);
    setVal("student-status", profile.currentStatus);
    setVal("student-job-title", profile.currentJobTitle);
    setVal("student-experience", profile.experienceYears);
    setVal("learning-mode", profile.preferredLearningMode);

    const consentEl = document.getElementById("student-consent");
    if (consentEl) consentEl.checked = Boolean(profile.consent);
  },

  /**
   * Binds UI events: inline validation, draft autosave, clear draft button.
   */
  bindEvents() {
    const form = document.getElementById("intake-form");
    if (!form) return;

    // Real-time input validation on blur
    const nameInput = document.getElementById("student-name");
    if (nameInput) {
      nameInput.addEventListener("blur", () => this.validateField("student-name"));
      nameInput.addEventListener("input", () => this.autoSave());
    }

    const emailInput = document.getElementById("student-email");
    if (emailInput) {
      emailInput.addEventListener("blur", () => this.validateField("student-email"));
      emailInput.addEventListener("input", () => this.autoSave());
    }

    const mobileInput = document.getElementById("student-mobile");
    if (mobileInput) {
      mobileInput.addEventListener("blur", () => this.validateField("student-mobile"));
      mobileInput.addEventListener("input", () => this.autoSave());
    }

    const courseSelect = document.getElementById("course-interest");
    if (courseSelect) {
      courseSelect.addEventListener("change", () => {
        this.validateField("course-interest");
        this.autoSave();
      });
    }

    // Clear draft button
    const clearDraftBtn = document.getElementById("btn-clear-draft");
    if (clearDraftBtn) {
      clearDraftBtn.addEventListener("click", () => this.clearDraft());
    }
  },

  /**
   * Validates an individual field and toggles error message.
   */
  validateField(fieldId) {
    const el = document.getElementById(fieldId);
    const errEl = document.getElementById(`${fieldId}-error`);
    if (!el) return true;

    let res = { valid: true };
    if (fieldId === "student-name") {
      res = Validation.validateFullName(el.value);
    } else if (fieldId === "student-email") {
      res = Validation.validateEmail(el.value);
    } else if (fieldId === "student-mobile") {
      res = Validation.validateMobile(el.value);
    } else if (fieldId === "course-interest") {
      res = Validation.validateCourse(el.value);
    }

    if (errEl) {
      if (!res.valid) {
        errEl.textContent = res.error;
        errEl.style.display = "block";
        el.classList.add("input-invalid");
      } else {
        errEl.textContent = "";
        errEl.style.display = "none";
        el.classList.remove("input-invalid");
      }
    }
    return res.valid;
  },

  /**
   * Collects current data from the intake form.
   */
  getFormData() {
    const val = id => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    const consentEl = document.getElementById("student-consent");
    const assessmentIdEl = document.getElementById("intake-assessment-id");

    return {
      assessmentId: assessmentIdEl ? assessmentIdEl.value : Validation.generateAssessmentId(),
      studentName: val("student-name"),
      studentEmail: val("student-email"),
      studentMobile: val("student-mobile"),
      courseInterest: val("course-interest"),
      education: val("student-education"),
      specialization: val("student-specialization"),
      currentStatus: val("student-status"),
      currentJobTitle: val("student-job-title"),
      experienceYears: val("student-experience"),
      preferredLearningMode: val("learning-mode"),
      consent: consentEl ? consentEl.checked : false,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Validates the entire intake form and returns sanitized data.
   */
  validateAndSubmit() {
    const rawData = this.getFormData();
    const result = Validation.validateIntakeForm(rawData);

    // Display all field errors
    ["studentName", "studentEmail", "studentMobile", "courseInterest", "education", "currentStatus", "consent"].forEach(field => {
      const fieldIdMap = {
        studentName: "student-name",
        studentEmail: "student-email",
        studentMobile: "student-mobile",
        courseInterest: "course-interest",
        education: "student-education",
        currentStatus: "student-status",
        consent: "student-consent"
      };
      const elementId = fieldIdMap[field];
      const errEl = document.getElementById(`${elementId}-error`);
      const inputEl = document.getElementById(elementId);

      if (errEl) {
        if (result.errors[field]) {
          errEl.textContent = result.errors[field];
          errEl.style.display = "block";
          if (inputEl) inputEl.classList.add("input-invalid");
        } else {
          errEl.textContent = "";
          errEl.style.display = "none";
          if (inputEl) inputEl.classList.remove("input-invalid");
        }
      }
    });

    if (!result.isValid) {
      return { valid: false, errors: result.errors };
    }

    this.currentProfile = {
      ...result.sanitized,
      assessmentId: rawData.assessmentId,
      timestamp: rawData.timestamp
    };

    this.autoSave();
    return { valid: true, profile: this.currentProfile };
  },

  /**
   * Autosaves in-progress draft to LocalStorage.
   */
  autoSave() {
    try {
      const key = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
        ? CONFIG.STORAGE_KEYS.DRAFT_ASSESSMENT
        : "goalfinity_assessment_draft";

      const current = this.getFormData();
      const existingDraft = JSON.parse(localStorage.getItem(key) || "{}");
      existingDraft.studentProfile = current;
      existingDraft.lastSavedAt = new Date().toISOString();

      localStorage.setItem(key, JSON.stringify(existingDraft));
    } catch (e) {
      // Storage unavailable or disabled
    }
  },

  /**
   * Clears saved draft and resets intake form.
   */
  clearDraft() {
    if (confirm("Are you sure you want to clear this student's draft? All entered responses will be cleared.")) {
      const key = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
        ? CONFIG.STORAGE_KEYS.DRAFT_ASSESSMENT
        : "goalfinity_assessment_draft";
      localStorage.removeItem(key);

      const form = document.getElementById("intake-form");
      if (form) form.reset();

      this.loadDraftOrCreateNew();
      this.showDraftAlert(false);

      if (typeof App !== "undefined" && App.resetAssessmentState) {
        App.resetAssessmentState();
      }
    }
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = IntakeController;
} else {
  window.IntakeController = IntakeController;
}
