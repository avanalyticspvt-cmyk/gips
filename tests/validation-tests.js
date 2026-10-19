/**
 * Goalfinity Institute — Assessment Platform
 * Unit Test Suite: Input Validation & Sanitization
 */

const ValidationModule = (typeof Validation !== "undefined")
  ? Validation
  : (typeof require !== "undefined" ? require("../assets/js/validation.js") : null);

function runValidationTests(assert) {
  assert.suite("Validation & Sanitization Tests");

  // 1. Full Name Validation
  assert.test("Validates proper full name", () => {
    const res = ValidationModule.validateFullName("Ananya Sharma");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.value, "Ananya Sharma");
  });

  assert.test("Rejects name with less than 2 characters", () => {
    const res = ValidationModule.validateFullName("A");
    assert.strictEqual(res.valid, false);
    assert.ok(res.error.includes("at least 2 characters"));
  });

  assert.test("Rejects name containing numeric digits or symbols", () => {
    const res = ValidationModule.validateFullName("John123 Doe!");
    assert.strictEqual(res.valid, false);
  });

  // 2. Email Validation
  assert.test("Validates standard email address", () => {
    const res = ValidationModule.validateEmail("student.career@goalfinity.in");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.value, "student.career@goalfinity.in");
  });

  assert.test("Rejects email missing domain", () => {
    const res = ValidationModule.validateEmail("student@");
    assert.strictEqual(res.valid, false);
  });

  assert.test("Rejects email missing @ symbol", () => {
    const res = ValidationModule.validateEmail("studentgoalfinity.in");
    assert.strictEqual(res.valid, false);
  });

  // 3. International Mobile Phone Validation (E.164 compliance)
  assert.test("Accepts valid Indian mobile with country code", () => {
    const res = ValidationModule.validateMobile("+91 9876543210");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.value, "+919876543210");
  });

  assert.test("Accepts valid US/Canada mobile with country code", () => {
    const res = ValidationModule.validateMobile("+1 (415) 555-2671");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.value, "+14155552671");
  });

  assert.test("Accepts valid UK mobile with country code", () => {
    const res = ValidationModule.validateMobile("+44 7911 123456");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.value, "+447911123456");
  });

  assert.test("Accepts valid UAE mobile with country code", () => {
    const res = ValidationModule.validateMobile("+971 50 123 4567");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.value, "+971501234567");
  });

  assert.test("Rejects mobile with fewer than 7 digits", () => {
    const res = ValidationModule.validateMobile("+1 555");
    assert.strictEqual(res.valid, false);
  });

  assert.test("Rejects mobile with alphabetical characters", () => {
    const res = ValidationModule.validateMobile("+91 98765CALLME");
    assert.strictEqual(res.valid, false);
  });

  // 4. Course Selection Validation
  assert.test("Validates supported courses", () => {
    assert.strictEqual(ValidationModule.validateCourse("ai").valid, true);
    assert.strictEqual(ValidationModule.validateCourse("digital_marketing").valid, true);
    assert.strictEqual(ValidationModule.validateCourse("cloud_computing").valid, true);
    assert.strictEqual(ValidationModule.validateCourse("unsupported_course").valid, false);
  });

  // 5. Assessment ID Generation
  assert.test("Generates properly formatted Assessment ID", () => {
    const id = ValidationModule.generateAssessmentId();
    assert.ok(/^GF-\d{8}-[A-F0-9]{4}$/.test(id), `Expected format GF-YYYYMMDD-XXXX, got ${id}`);
  });

  // 6. Text Sanitization (XSS Prevention)
  assert.test("Sanitizes HTML injection tags", () => {
    const raw = '<script>alert("XSS")</script>';
    const sanitized = ValidationModule.sanitizeText(raw);
    assert.strictEqual(sanitized, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });
}

// Export for Node/Browser runners
if (typeof module !== "undefined" && module.exports) {
  module.exports = runValidationTests;
}
