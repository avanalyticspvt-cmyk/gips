/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Google Apps Script Integration Layer
 *
 * Provides:
 * - doPost(e): Webhook accepting assessment submissions, with concurrency locking & idempotency
 * - doGet(e): Service health check & metadata query
 * - initializeSpreadsheet(): One-click worksheet initialization, schema creation & styling
 * - testSubmission(): End-to-end verification with a safe, marked test record
 *
 * Worksheets:
 * 1. Students_Assessments (Master record per completed assessment)
 * 2. Assessment_Responses (Auditable row-per-question responses)
 * 3. Configuration (Editable institution metadata, bands, weights)
 */

// Schema Version
var SCHEMA_VERSION = "1.0.0";

// Sheet Names
var SHEETS = {
  ASSESSMENTS: "Students_Assessments",
  RESPONSES: "Assessment_Responses",
  CONFIG: "Configuration"
};

// Defined Schema for Worksheet 1: Students_Assessments
var ASSESSMENTS_HEADER_SCHEMA = [
  "Assessment_ID",
  "Assessment_Date",
  "Schema_Version",
  "Student_Name",
  "Student_Email",
  "Student_Mobile",
  "Consent_Status",
  "Course_Interest",
  "Education",
  "Specialization",
  "Current_Status",
  "Current_Job_Title",
  "Experience_Years",
  "Motivation",
  "Primary_Career_Goal",
  "Target_Job_Role",
  "Salary_Expectation",
  "Target_Timeline",
  "Internship_Flexibility",
  "Digital_Skills_Score",
  "Communication_Score",
  "Problem_Solving_Score",
  "Project_Experience",
  "Weekly_Learning_Hours",
  "Foundational_Knowledge_Score",
  "Practical_Skills_Score",
  "Career_Clarity_Score",
  "Learning_Readiness_Score",
  "Professional_Readiness_Score",
  "Overall_Readiness_Score",
  "Readiness_Band",
  "Strengths",
  "Skill_Gaps",
  "Recommended_Course_Path",
  "Recommended_Modules",
  "Recommended_Projects",
  "Suggested_Job_Roles",
  "Career_Action_Plan",
  "Practical_Assessment_Score",
  "Question_Responses_JSON",
  "Counsellor_Notes",
  "Submission_Status",
  "Created_At",
  "Updated_At"
];

// Defined Schema for Worksheet 2: Assessment_Responses
var RESPONSES_HEADER_SCHEMA = [
  "Assessment_ID",
  "Question_ID",
  "Course",
  "Question_Category",
  "Question_Text",
  "Student_Response",
  "Score",
  "Maximum_Score",
  "Scoring_Method",
  "Evidence_Notes",
  "Recorded_At"
];

/**
 * HTTP POST Handler — Accepts assessment submissions from the frontend.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    // Acquire concurrency lock (30 seconds maximum wait)
    lockAcquired = lock.tryLock(30000);
    if (!lockAcquired) {
      return createJsonResponse({
        status: "error",
        code: "CONCURRENCY_TIMEOUT",
        message: "Server is currently processing concurrent submissions. Please retry in a few moments."
      });
    }

    // Parse incoming payload
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        status: "error",
        code: "EMPTY_PAYLOAD",
        message: "No request body received."
      });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({
        status: "error",
        code: "INVALID_JSON",
        message: "Malformed JSON payload: " + parseErr.message
      });
    }

    // Server-Side Input Validation
    var validationResult = validateSubmissionPayload(payload);
    if (!validationResult.valid) {
      return createJsonResponse({
        status: "error",
        code: "VALIDATION_FAILED",
        message: validationResult.error
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Ensure all 3 worksheets exist and have correct schemas
    var assessmentsSheet = getOrCreateSheet(ss, SHEETS.ASSESSMENTS, ASSESSMENTS_HEADER_SCHEMA);
    var responsesSheet = getOrCreateSheet(ss, SHEETS.RESPONSES, RESPONSES_HEADER_SCHEMA);

    // Dynamic Schema Management: Ensure missing columns are appended without breaking existing
    syncSheetHeaders(assessmentsSheet, ASSESSMENTS_HEADER_SCHEMA);
    syncSheetHeaders(responsesSheet, RESPONSES_HEADER_SCHEMA);

    // Idempotency & Duplicate Check
    var assessmentId = String(payload.assessmentId).trim();
    var existingRow = findRowByAssessmentId(assessmentsSheet, assessmentId);

    if (existingRow > 0) {
      // Record already exists: return idempotent success
      return createJsonResponse({
        status: "success",
        duplicate: true,
        assessmentId: assessmentId,
        message: "Assessment with ID " + assessmentId + " is already recorded."
      });
    }

    // Map payload into the Students_Assessments sheet columns dynamically by header name
    var nowTimestamp = new Date().toISOString();
    var rowData = mapPayloadToRow(assessmentsSheet, payload, nowTimestamp);
    assessmentsSheet.appendRow(rowData);

    // Record individual question responses in Assessment_Responses sheet for full auditability
    if (payload.auditTrail && Array.isArray(payload.auditTrail)) {
      var auditRows = [];
      for (var i = 0; i < payload.auditTrail.length; i++) {
        var item = payload.auditTrail[i];
        auditRows.push([
          assessmentId,
          item.questionId || "",
          payload.courseInterest || "",
          item.category || "",
          item.questionText || "",
          item.studentResponse || "",
          item.score !== undefined ? item.score : 0,
          item.maxScore !== undefined ? item.maxScore : 0,
          item.scoringMethod || "",
          item.evidenceNotes || "",
          nowTimestamp
        ]);
      }
      if (auditRows.length > 0) {
        var lastRow = responsesSheet.getLastRow();
        responsesSheet.getRange(lastRow + 1, 1, auditRows.length, RESPONSES_HEADER_SCHEMA.length).setValues(auditRows);
      }
    }

    return createJsonResponse({
      status: "success",
      assessmentId: assessmentId,
      message: "Assessment successfully recorded."
    });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Server exception: " + err.message
    });
  } finally {
    if (lockAcquired) {
      lock.releaseLock();
    }
  }
}

/**
 * HTTP GET Handler — Health check & status endpoint.
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";

  if (action === "ping") {
    return createJsonResponse({
      status: "ok",
      service: "Goalfinity Career Readiness Webhook",
      institution: "Goalfinity Institute",
      version: SCHEMA_VERSION,
      timestamp: new Date().toISOString()
    });
  }

  return createJsonResponse({
    status: "ok",
    message: "Goalfinity Apps Script Web App is active and healthy."
  });
}

/**
 * Validates incoming submission payload on server side.
 */
function validateSubmissionPayload(p) {
  if (!p.assessmentId || typeof p.assessmentId !== "string" || p.assessmentId.trim().length < 5) {
    return { valid: false, error: "A valid unique assessmentId is required." };
  }
  if (!p.studentName || typeof p.studentName !== "string" || p.studentName.trim().length < 2) {
    return { valid: false, error: "Student name is required (minimum 2 characters)." };
  }
  if (!p.studentEmail || typeof p.studentEmail !== "string" || !p.studentEmail.includes("@")) {
    return { valid: false, error: "A valid student email address is required." };
  }
  if (!p.studentMobile || typeof p.studentMobile !== "string" || p.studentMobile.trim().length < 7) {
    return { valid: false, error: "A valid mobile phone number is required." };
  }
  if (!p.courseInterest || typeof p.courseInterest !== "string") {
    return { valid: false, error: "Course interest is required." };
  }
  return { valid: true };
}

/**
 * Helper to get existing sheet or create with initial headers.
 */
function getOrCreateSheet(ss, sheetName, defaultHeaders) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(defaultHeaders);
    formatHeaderRow(sheet);
  }
  return sheet;
}

/**
 * Formats header row with Goalfinity Deep Navy background & white bold text.
 */
function formatHeaderRow(sheet) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1);
  range.setBackground("#0B2545");
  range.setFontColor("#FFFFFF");
  range.setFontWeight("bold");
  range.setFontSize(10);
  range.setWrap(false);
  sheet.setFrozenRows(1);
}

/**
 * Dynamic Schema Sync: Checks existing headers, appends missing columns without moving or deleting data.
 */
function syncSheetHeaders(sheet, expectedHeaders) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.appendRow(expectedHeaders);
    formatHeaderRow(sheet);
    return;
  }

  var existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var missing = [];

  for (var i = 0; i < expectedHeaders.length; i++) {
    var header = expectedHeaders[i];
    if (existingHeaders.indexOf(header) === -1) {
      missing.push(header);
    }
  }

  if (missing.length > 0) {
    sheet.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
    formatHeaderRow(sheet);
  }
}

/**
 * Finds row index for an existing Assessment_ID (returns -1 if not found).
 */
function findRowByAssessmentId(sheet, assessmentId) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  var idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var r = 0; r < idValues.length; r++) {
    if (String(idValues[r][0]).trim() === assessmentId) {
      return r + 2; // 1-based row index accounting for header
    }
  }
  return -1;
}

/**
 * Maps incoming JSON payload to sheet columns based on column header names.
 */
function mapPayloadToRow(sheet, p, nowIso) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = [];

  for (var i = 0; i < headers.length; i++) {
    var h = headers[i];
    switch (h) {
      case "Assessment_ID": row.push(p.assessmentId || ""); break;
      case "Assessment_Date": row.push(p.assessmentDate || nowIso); break;
      case "Schema_Version": row.push(p.schemaVersion || SCHEMA_VERSION); break;
      case "Student_Name": row.push(p.studentName || ""); break;
      case "Student_Email": row.push(p.studentEmail || ""); break;
      case "Student_Mobile": row.push(p.studentMobile || ""); break;
      case "Consent_Status": row.push(p.consentStatus || "Granted"); break;
      case "Course_Interest": row.push(p.courseInterest || ""); break;
      case "Education": row.push(p.education || ""); break;
      case "Specialization": row.push(p.specialization || ""); break;
      case "Current_Status": row.push(p.currentStatus || ""); break;
      case "Current_Job_Title": row.push(p.currentJobTitle || ""); break;
      case "Experience_Years": row.push(p.experienceYears || "0"); break;
      case "Motivation": row.push(p.motivation || ""); break;
      case "Primary_Career_Goal": row.push(p.primaryCareerGoal || ""); break;
      case "Target_Job_Role": row.push(p.targetJobRole || ""); break;
      case "Salary_Expectation": row.push(p.salaryExpectation || ""); break;
      case "Target_Timeline": row.push(p.targetTimeline || ""); break;
      case "Internship_Flexibility": row.push(p.internshipFlexibility || ""); break;
      case "Digital_Skills_Score": row.push(p.digitalSkillsScore !== undefined ? p.digitalSkillsScore : ""); break;
      case "Communication_Score": row.push(p.communicationScore !== undefined ? p.communicationScore : ""); break;
      case "Problem_Solving_Score": row.push(p.problemSolvingScore !== undefined ? p.problemSolvingScore : ""); break;
      case "Project_Experience": row.push(p.projectExperience || ""); break;
      case "Weekly_Learning_Hours": row.push(p.weeklyLearningHours || ""); break;
      case "Foundational_Knowledge_Score": row.push(p.foundationalKnowledgeScore !== undefined ? p.foundationalKnowledgeScore : ""); break;
      case "Practical_Skills_Score": row.push(p.practicalSkillsScore !== undefined ? p.practicalSkillsScore : ""); break;
      case "Career_Clarity_Score": row.push(p.careerClarityScore !== undefined ? p.careerClarityScore : ""); break;
      case "Learning_Readiness_Score": row.push(p.learningReadinessScore !== undefined ? p.learningReadinessScore : ""); break;
      case "Professional_Readiness_Score": row.push(p.professionalReadinessScore !== undefined ? p.professionalReadinessScore : ""); break;
      case "Overall_Readiness_Score": row.push(p.overallReadinessScore !== undefined ? p.overallReadinessScore : 0); break;
      case "Readiness_Band": row.push(p.readinessBand || ""); break;
      case "Strengths": row.push(p.strengths || ""); break;
      case "Skill_Gaps": row.push(p.skillGaps || ""); break;
      case "Recommended_Course_Path": row.push(p.recommendedCoursePath || ""); break;
      case "Recommended_Modules": row.push(p.recommendedModules || ""); break;
      case "Recommended_Projects": row.push(p.recommendedProjects || ""); break;
      case "Suggested_Job_Roles": row.push(p.suggestedJobRoles || ""); break;
      case "Career_Action_Plan": row.push(p.careerActionPlan || ""); break;
      case "Practical_Assessment_Score": row.push(p.practicalAssessmentScore || ""); break;
      case "Question_Responses_JSON": row.push(p.questionResponsesJSON || ""); break;
      case "Counsellor_Notes": row.push(p.counsellorNotes || ""); break;
      case "Submission_Status": row.push(p.submissionStatus || "COMPLETED"); break;
      case "Created_At": row.push(nowIso); break;
      case "Updated_At": row.push(nowIso); break;
      default:
        // Handle any extra dynamic field from payload
        row.push(p[h] !== undefined ? p[h] : "");
        break;
    }
  }
  return row;
}

/**
 * Creates formatted JSON response.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * =========================================================================
 * INITIALIZATION FUNCTION: Run once from the Apps Script Editor
 * =========================================================================
 */
function initializeSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Worksheet: Students_Assessments
  var sheet1 = getOrCreateSheet(ss, SHEETS.ASSESSMENTS, ASSESSMENTS_HEADER_SCHEMA);
  syncSheetHeaders(sheet1, ASSESSMENTS_HEADER_SCHEMA);

  // 2. Worksheet: Assessment_Responses
  var sheet2 = getOrCreateSheet(ss, SHEETS.RESPONSES, RESPONSES_HEADER_SCHEMA);
  syncSheetHeaders(sheet2, RESPONSES_HEADER_SCHEMA);

  // 3. Worksheet: Configuration
  var configSheet = ss.getSheetByName(SHEETS.CONFIG);
  if (!configSheet) {
    configSheet = ss.insertSheet(SHEETS.CONFIG);
    configSheet.appendRow(["Setting_Key", "Setting_Value", "Description", "Last_Updated"]);
    formatHeaderRow(configSheet);

    var now = new Date().toISOString();
    var defaultConfigs = [
      ["INSTITUTION_NAME", "Goalfinity Institute", "Official institution brand name", now],
      ["TAGLINE", "Discover Your Skills. Build Your Future.", "Brand tagline", now],
      ["SCHEMA_VERSION", SCHEMA_VERSION, "Active assessment data schema version", now],
      ["SCORING_FOUNDATIONAL_WEIGHT", "0.30", "Weight for Foundational Knowledge (30%)", now],
      ["SCORING_PRACTICAL_WEIGHT", "0.30", "Weight for Practical Skills (30%)", now],
      ["SCORING_CAREER_CLARITY_WEIGHT", "0.15", "Weight for Career Goal Clarity (15%)", now],
      ["SCORING_LEARNING_READINESS_WEIGHT", "0.15", "Weight for Learning Readiness (15%)", now],
      ["SCORING_PROFESSIONAL_WEIGHT", "0.10", "Weight for Professional Readiness (10%)", now],
      ["READINESS_BAND_STRONG", "80-100", "Strong Assessed Readiness guidance band", now],
      ["READINESS_BAND_PROGRESSING", "60-79", "Progressing Readiness guidance band", now],
      ["READINESS_BAND_DEVELOPING", "40-59", "Developing Readiness guidance band", now],
      ["READINESS_BAND_FOUNDATION", "0-39", "Foundation-Building Stage guidance band", now]
    ];
    configSheet.getRange(2, 1, defaultConfigs.length, 4).setValues(defaultConfigs);
  }

  Logger.log("Goalfinity Institute Spreadsheet successfully initialized with 3 worksheets.");
}

/**
 * =========================================================================
 * TEST FUNCTION: Verifies the backend with a safe, marked test record
 * =========================================================================
 */
function testSubmission() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        action: "SUBMIT_ASSESSMENT",
        schemaVersion: SCHEMA_VERSION,
        assessmentId: "GF-TEST-" + Math.floor(Math.random() * 9000 + 1000),
        assessmentDate: new Date().toISOString(),
        studentName: "Test Verification Candidate",
        studentEmail: "test.candidate@example.com",
        studentMobile: "+91 9876543210",
        consentStatus: "Granted",
        courseInterest: "ai",
        education: "Bachelor's Degree",
        specialization: "Computer Science",
        currentStatus: "studying",
        currentJobTitle: "Student",
        experienceYears: "0",
        motivation: "upskilling_current",
        primaryCareerGoal: "first_job",
        targetJobRole: "Junior AI Engineer",
        salaryExpectation: "entry_3_5",
        targetTimeline: "3_months",
        internshipFlexibility: "highly_open",
        digitalSkillsScore: 80,
        communicationScore: 80,
        problemSolvingScore: 80,
        projectExperience: "yes_guided",
        weeklyLearningHours: "15_to_20",
        foundationalKnowledgeScore: 85,
        practicalSkillsScore: 75,
        careerClarityScore: 90,
        learningReadinessScore: 80,
        professionalReadinessScore: 80,
        overallReadinessScore: 82,
        readinessBand: "Strong Assessed Readiness",
        strengths: "Python foundations: 5/5 | Problem solving: 4/5",
        skillGaps: "Object storage: 2/5",
        recommendedCoursePath: "Artificial Intelligence (AI) & Machine Learning",
        recommendedModules: "MOD-01, MOD-02, MOD-03",
        recommendedProjects: "Predictive Churn System, Knowledge Base RAG Assistant",
        suggestedJobRoles: "Junior AI Engineer, Data Analyst",
        careerActionPlan: "Schedule academic counselling session.",
        practicalAssessmentScore: "3/3",
        questionResponsesJSON: '{"test":true}',
        counsellorNotes: "TEST RECORD - Automated test execution from Apps Script Editor.",
        submissionStatus: "TEST_VERIFIED",
        auditTrail: [
          {
            questionId: "test_q1",
            category: "foundational",
            questionText: "Sample Test Question",
            studentResponse: "Verified response",
            score: 5,
            maxScore: 5,
            scoringMethod: "test_harness",
            evidenceNotes: "Automated test verification record"
          }
        ]
      })
    }
  };

  var res = doPost(mockEvent);
  Logger.log("Test submission response: " + res.getContent());
}
