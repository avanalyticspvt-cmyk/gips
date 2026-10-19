/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Input Validation & Data Sanitization Library
 */

const Validation = {
  /**
   * Sanitizes text to prevent HTML injection / XSS.
   * Encodes &, <, >, ", '
   */
  sanitizeText(input) {
    if (typeof input !== "string") return input;
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  /**
   * Validates student full name.
   * Requires at least 2 characters, permits letters, spaces, hyphens, and apostrophes.
   */
  validateFullName(name) {
    if (!name || typeof name !== "string") {
      return { valid: false, error: "Student's full name is required." };
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return { valid: false, error: "Full name must be at least 2 characters long." };
    }
    if (trimmed.length > 100) {
      return { valid: false, error: "Full name cannot exceed 100 characters." };
    }
    // Unicode letters, spaces, periods, hyphens, apostrophes
    const nameRegex = /^[\p{L}\s.'-]+$/u;
    if (!nameRegex.test(trimmed)) {
      return { valid: false, error: "Name should only contain letters, spaces, and hyphens." };
    }
    return { valid: true, value: trimmed };
  },

  /**
   * Validates email address using standard RFC-5322 compliant regex.
   */
  validateEmail(email) {
    if (!email || typeof email !== "string") {
      return { valid: false, error: "Email address is required." };
    }
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, error: "Please enter a valid email address (e.g., student@example.com)." };
    }
    return { valid: true, value: trimmed };
  },

  /**
   * Validates international mobile numbers.
   * Complies with ITU-T E.164:
   * - Supports leading + followed by country code (1 to 3 digits) and national number.
   * - Total digits between 7 and 15.
   * - Accepts spaces, parentheses, hyphens during user typing, normalizes to E.164.
   * - Does NOT assume or hardcode an India-only 10-digit rule.
   */
  validateMobile(mobile) {
    if (!mobile || typeof mobile !== "string") {
      return { valid: false, error: "Mobile number is required." };
    }
    const trimmed = mobile.trim();

    // Check for presence of country code or leading '+'
    // If user enters without '+', check if it's at least 7 to 15 digits
    const digitsOnly = trimmed.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return {
        valid: false,
        error: "Please enter a valid international mobile number with country code (e.g., +91 9876543210 or +1 415 555 2671)."
      };
    }

    // Must have a valid structure: optional '+' followed by digits, spaces, hyphens, parens
    const phoneRegex = /^\+?[0-9\s().-]{7,25}$/;
    if (!phoneRegex.test(trimmed)) {
      return {
        valid: false,
        error: "Mobile number contains invalid characters. Use digits and an optional '+' prefix."
      };
    }

    // Normalized format: ensure leading '+' if user provided it or format as +<digits>
    const normalized = trimmed.startsWith("+") ? `+${digitsOnly}` : `+${digitsOnly}`;

    return { valid: true, value: normalized, display: trimmed };
  },

  /**
   * Validates course selection against supported list.
   */
  validateCourse(courseId) {
    const validCourses = ["ai", "digital_marketing", "cloud_computing"];
    if (!courseId || !validCourses.includes(courseId)) {
      return { valid: false, error: "Please select a valid course of interest." };
    }
    return { valid: true, value: courseId };
  },

  /**
   * Validates user consent checkbox.
   */
  validateConsent(hasConsent) {
    if (!hasConsent) {
      return {
        valid: false,
        error: "Consent is required to proceed with career assessment and report generation."
      };
    }
    return { valid: true, value: true };
  },

  /**
   * Generates a collision-resistant, professional Assessment ID.
   * Format: GF-YYYYMMDD-XXXX (e.g., GF-20261019-A3F8)
   */
  generateAssessmentId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const randomHex = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");
    return `GF-${year}${month}${day}-${randomHex}`;
  },

  /**
   * Validates the complete student intake form.
   */
  validateIntakeForm(data) {
    const errors = {};

    const nameRes = this.validateFullName(data.studentName);
    if (!nameRes.valid) errors.studentName = nameRes.error;

    const emailRes = this.validateEmail(data.studentEmail);
    if (!emailRes.valid) errors.studentEmail = emailRes.error;

    const mobileRes = this.validateMobile(data.studentMobile);
    if (!mobileRes.valid) errors.studentMobile = mobileRes.error;

    const courseRes = this.validateCourse(data.courseInterest);
    if (!courseRes.valid) errors.courseInterest = courseRes.error;

    if (!data.education || data.education.trim() === "") {
      errors.education = "Please select highest educational qualification.";
    }

    if (!data.currentStatus || data.currentStatus.trim() === "") {
      errors.currentStatus = "Please select current employment or study status.";
    }

    const consentRes = this.validateConsent(data.consent);
    if (!consentRes.valid) errors.consent = consentRes.error;

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
      sanitized: {
        studentName: nameRes.valid ? nameRes.value : data.studentName,
        studentEmail: emailRes.valid ? emailRes.value : data.studentEmail,
        studentMobile: mobileRes.valid ? mobileRes.value : data.studentMobile,
        courseInterest: courseRes.valid ? courseRes.value : data.courseInterest,
        education: this.sanitizeText(data.education || ""),
        specialization: this.sanitizeText(data.specialization || ""),
        currentStatus: this.sanitizeText(data.currentStatus || ""),
        currentJobTitle: this.sanitizeText(data.currentJobTitle || ""),
        experienceYears: this.sanitizeText(data.experienceYears || "0"),
        preferredLearningMode: this.sanitizeText(data.preferredLearningMode || "Online Live"),
        consent: Boolean(data.consent)
      }
    };
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = Validation;
} else {
  window.Validation = Validation;
}
