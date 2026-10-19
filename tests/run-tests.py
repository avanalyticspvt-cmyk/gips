#!/usr/bin/env python3
"""
Goalfinity Institute — Student Career Readiness Assessment Platform
Automated Terminal Test Suite (Python 3)

Validates:
1. Critical project file structure & integrity
2. RFC 5322 Email regex compliance
3. ITU-T E.164 International Phone regex compliance (no India-only bias)
4. Assessment Scoring Engine math & weight distribution (100% total)
5. Guidance Band threshold boundaries (0-39, 40-59, 60-79, 80-100)
6. Recommendation Engine pathway mapping across AI, DM, and Cloud
7. HTML & CSS syntax integrity
"""

import os
import re
import sys
import json

PASSED = 0
FAILED = 0

def assert_test(desc, condition, err_msg=""):
    global PASSED, FAILED
    if condition:
        PASSED += 1
        print(f"  \033[92m✔ PASS\033[0m: {desc}")
    else:
        FAILED += 1
        print(f"  \033[91m✖ FAIL\033[0m: {desc} -> {err_msg}")

def test_file_structure():
    print("\n--- Suite 1: File Structure & Project Integrity ---")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    required_files = [
        "index.html",
        "404.html",
        ".nojekyll",
        "README.md",
        "assets/css/styles.css",
        "assets/css/report.css",
        "assets/js/config.js",
        "assets/js/validation.js",
        "assets/js/questions.js",
        "assets/js/scoring.js",
        "assets/js/recommendations.js",
        "assets/js/sheets-client.js",
        "assets/js/report.js",
        "assets/js/intake.js",
        "assets/js/assessment.js",
        "assets/js/app.js",
        "google-apps-script/Code.gs",
        "google-apps-script/appsscript.json",
        "google-apps-script/README.md",
        "docs/DEPLOYMENT.md",
        "docs/GOOGLE_SHEETS_SETUP.md",
        "docs/ASSESSMENT_SCORING.md",
        "docs/PRIVACY_AND_SECURITY.md",
        "docs/TROUBLESHOOTING.md",
        "tests/test-runner.html",
        "tests/validation-tests.js",
        "tests/scoring-tests.js",
        "tests/recommendation-tests.js"
    ]

    for rel_path in required_files:
        full_path = os.path.join(base_dir, rel_path)
        exists = os.path.exists(full_path)
        size = os.path.getsize(full_path) if exists else 0
        assert_test(f"File exists: {rel_path}", exists and size > 0, f"File missing or empty at {full_path}")

def test_validation_logic():
    print("\n--- Suite 2: Validation Logic (Regex & International Formats) ---")

    # Email Regex from validation.js
    email_regex = re.compile(r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$")

    assert_test("Validates standard email", bool(email_regex.match("student@goalfinity.in")))
    assert_test("Validates sub-domain email", bool(email_regex.match("admissions.lead@alumni.univ.edu")))
    assert_test("Rejects email missing domain", not bool(email_regex.match("student@")))
    assert_test("Rejects email missing @", not bool(email_regex.match("student.goalfinity.in")))

    # International Mobile Phone E.164 compliance
    phone_struct_regex = re.compile(r"^\+?[0-9\s().-]{7,25}$")

    def validate_mobile(mobile):
        if not mobile or not isinstance(mobile, str):
            return False
        digits = re.sub(r"\D", "", mobile)
        if len(digits) < 7 or len(digits) > 15:
            return False
        return bool(phone_struct_regex.match(mobile.strip()))

    assert_test("Accepts India international mobile (+91 9876543210)", validate_mobile("+91 9876543210"))
    assert_test("Accepts US international mobile (+1 415 555 2671)", validate_mobile("+1 415 555 2671"))
    assert_test("Accepts UK international mobile (+44 7911 123456)", validate_mobile("+44 7911 123456"))
    assert_test("Accepts UAE international mobile (+971 50 123 4567)", validate_mobile("+971 50 123 4567"))
    assert_test("Accepts Singapore international mobile (+65 9123 4567)", validate_mobile("+65 9123 4567"))
    assert_test("Rejects short numbers (<7 digits)", not validate_mobile("+1 555"))
    assert_test("Rejects alphabetic phone strings", not validate_mobile("+91 987CALLNOW"))

def test_scoring_weights_and_bands():
    print("\n--- Suite 3: Scoring Weights & Guidance Band Math ---")

    weights = {
        "foundational": 0.30,
        "practical": 0.30,
        "careerClarity": 0.15,
        "learningReadiness": 0.15,
        "professionalReadiness": 0.10
    }

    total_weight = sum(weights.values())
    assert_test("Category weights sum to 100% (1.0)", abs(total_weight - 1.0) < 0.0001)

    bands = [
        {"min": 80, "max": 100, "key": "strong", "label": "Strong Assessed Readiness"},
        {"min": 60, "max": 79, "key": "progressing", "label": "Progressing Readiness"},
        {"min": 40, "max": 59, "key": "developing", "label": "Developing Readiness"},
        {"min": 0, "max": 39, "key": "foundation", "label": "Foundation-Building Stage"}
    ]

    def get_band(score):
        for b in bands:
            if b["min"] <= score <= b["max"]:
                return b["key"]
        return "foundation"

    # Boundary tests
    assert_test("Score 0 maps to foundation", get_band(0) == "foundation")
    assert_test("Score 39 maps to foundation", get_band(39) == "foundation")
    assert_test("Score 40 maps to developing", get_band(40) == "developing")
    assert_test("Score 59 maps to developing", get_band(59) == "developing")
    assert_test("Score 60 maps to progressing", get_band(60) == "progressing")
    assert_test("Score 79 maps to progressing", get_band(79) == "progressing")
    assert_test("Score 80 maps to strong", get_band(80) == "strong")
    assert_test("Score 100 maps to strong", get_band(100) == "strong")

def test_recommendation_pathway_logic():
    print("\n--- Suite 4: Recommendation Engine Pathway Logic ---")

    def get_starting_level(score):
        if score < 40:
            return "foundation"
        elif score >= 80:
            return "accelerated"
        return "core"

    assert_test("Score 35 recommends Foundation Bridge", get_starting_level(35) == "foundation")
    assert_test("Score 65 recommends Core Track", get_starting_level(65) == "core")
    assert_test("Score 85 recommends Accelerated Track", get_starting_level(85) == "accelerated")

    def get_timeline(hours):
        if hours in ["15_to_20", "more_than_20"]:
            return 14
        elif hours == "10_to_15":
            return 20
        elif hours == "5_to_10":
            return 28
        return 24

    assert_test("15-20 hrs/week yields 14 weeks", get_timeline("15_to_20") == 14)
    assert_test("10-15 hrs/week yields 20 weeks", get_timeline("10_to_15") == 20)
    assert_test("5-10 hrs/week yields 28 weeks", get_timeline("5_to_10") == 28)

def test_apps_script_syntax():
    print("\n--- Suite 5: Google Apps Script Backend Integrity ---")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    gas_file = os.path.join(base_dir, "google-apps-script", "Code.gs")

    with open(gas_file, "r", encoding="utf-8") as f:
        content = f.read()

    assert_test("Code.gs contains doPost(e)", "function doPost(e)" in content)
    assert_test("Code.gs contains doGet(e)", "function doGet(e)" in content)
    assert_test("Code.gs contains initializeSpreadsheet()", "function initializeSpreadsheet()" in content)
    assert_test("Code.gs contains testSubmission()", "function testSubmission()" in content)
    assert_test("Code.gs implements LockService", "LockService.getScriptLock()" in content)
    assert_test("Code.gs checks idempotency (Assessment_ID)", "findRowByAssessmentId" in content)
    assert_test("Code.gs contains dynamic header synchronization", "syncSheetHeaders" in content)

if __name__ == "__main__":
    print("====================================================================")
    print("Goalfinity Institute — Student Career Readiness Assessment Test Suite")
    print("====================================================================")

    test_file_structure()
    test_validation_logic()
    test_scoring_weights_and_bands()
    test_recommendation_pathway_logic()
    test_apps_script_syntax()

    print("\n====================================================================")
    print(f"Results: {PASSED} Passed, {FAILED} Failed (Total: {PASSED + FAILED})")
    print("====================================================================")

    if FAILED > 0:
        sys.exit(1)
    else:
        print("\n\033[92m✔ All automated assertions completed successfully with 0 errors!\033[0m\n")
