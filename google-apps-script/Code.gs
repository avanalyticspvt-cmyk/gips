// Goalfinity Assessment backend. Schema v1.0. Run setup() once from the editor.
var SPREADSHEET_ID = '19KUG9B3xAT-RlEd8jpyprBEepXnO0q_VjIJFA313NNQ';
var SCHEMA_VERSION = '1.0';
var MAIN = 'Students_Assessments', RESP = 'Assessment_Responses', CONF = 'Configuration';
var MAIN_HEADERS = ['Assessment_ID','Assessment_Date','Schema_Version','Student_Name','Student_Email','Student_Mobile','Consent_Status','Course_Interest','Education','Specialization','Current_Status','Current_Job_Title','Experience_Years','Motivation','Primary_Career_Goal','Target_Job_Role','Salary_Expectation','Target_Timeline','Internship_Flexibility','Digital_Skills_Score','Communication_Score','Problem_Solving_Score','Project_Experience','Weekly_Learning_Hours','Foundational_Knowledge_Score','Practical_Skills_Score','Career_Clarity_Score','Learning_Readiness_Score','Professional_Readiness_Score','Overall_Readiness_Score','Readiness_Band','Strengths','Skill_Gaps','Recommended_Course_Path','Recommended_Modules','Recommended_Projects','Suggested_Job_Roles','Career_Action_Plan','Practical_Assessment_Score','Question_Responses_JSON','Counsellor_Notes','Submission_Status','Created_At','Updated_At'];
var RESP_HEADERS = ['Assessment_ID','Question_ID','Course','Question_Category','Question_Text','Student_Response','Score','Maximum_Score','Scoring_Method','Evidence_Notes'];
var COURSES = ['Artificial Intelligence','Digital Marketing','Cloud Computing'];

function setup() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureHeaders_(sheet_(ss, MAIN), MAIN_HEADERS); ensureHeaders_(sheet_(ss, RESP), RESP_HEADERS);
  var c = sheet_(ss, CONF);
  if (c.getLastRow() === 0) c.getRange(1,1,6,2).setValues([['Key','Value'],['Institution','Goalfinity Institute'],['Schema_Version',SCHEMA_VERSION],['Assessment_Version','2026.1'],['Readiness_Bands','0-39 Foundation-building; 40-59 Developing; 60-79 Progressing; 80-100 Strong assessed readiness (internal guidance)'],['Data_Retention','Set your retention period here (documentation only)']]);
  return 'Setup complete';
}
function sheet_(ss, name) { return ss.getSheetByName(name) || ss.insertSheet(name); }
// Adds missing headers at the END; never reorders or deletes existing columns.
function ensureHeaders_(sh, wanted) {
  var last = sh.getLastColumn(), have = last ? sh.getRange(1,1,1,last).getValues()[0].map(String) : [];
  wanted.forEach(function (h) { if (have.indexOf(h) < 0) { have.push(h); sh.getRange(1, have.length).setValue(h); } });
  return have;
}
function safe_(v) { if (v === null || v === undefined) return ''; if (typeof v === 'number') return v; var s = String(v).slice(0, 5000); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function validate_(r) {
  if (!r || !r.Assessment_ID || !/^GF-[A-Z0-9\-]{6,40}$/.test(r.Assessment_ID)) return 'Invalid assessment ID';
  if (!r.Student_Name || String(r.Student_Name).length < 2 || String(r.Student_Name).length > 120) return 'Invalid name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(r.Student_Email || '')) return 'Invalid email';
  if (!/^\+[1-9]\d{6,14}$/.test(r.Student_Mobile || '')) return 'Invalid mobile number';
  if (COURSES.indexOf(r.Course_Interest) < 0) return 'Invalid course';
  if (r.Consent_Status !== 'Given') return 'Consent missing';
  return null;
}
function doGet(e) { // health / status check: ?action=status&id=GF-...
  if (e && e.parameter && e.parameter.action === 'status' && e.parameter.id) {
    var sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MAIN);
    return json_({ ok: true, exists: !!(sh && sh.createTextFinder(e.parameter.id).matchEntireCell(true).findNext()) });
  }
  return json_({ ok: true, service: 'goalfinity-assessment', schema: SCHEMA_VERSION });
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(20000)) return json_({ ok: false, error: 'Server busy, please retry' });
    if (!e.postData || e.postData.length > 200000) return json_({ ok: false, error: 'Invalid payload size' });
    var p = JSON.parse(e.postData.contents);
    if (p.action !== 'submit') return json_({ ok: false, error: 'Unknown action' });
    var err = validate_(p.rec); if (err) return json_({ ok: false, error: err });
    var cache = CacheService.getScriptCache(), rk = 'rl_' + Utilities.base64EncodeWebSafe(p.rec.Student_Email.toLowerCase()).slice(0, 80);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID), main = sheet_(ss, MAIN), resp = sheet_(ss, RESP);
    var hdr = ensureHeaders_(main, MAIN_HEADERS), rhdr = ensureHeaders_(resp, RESP_HEADERS);
    if (main.getLastRow() > 1 && main.createTextFinder(p.rec.Assessment_ID).matchEntireCell(true).findNext()) return json_({ ok: true, duplicate: true, id: p.rec.Assessment_ID }); // idempotent
    if (cache.get(rk)) return json_({ ok: false, error: 'Too many submissions for this email, try later' });
    cache.put(rk, '1', 15);
    var now = new Date().toISOString(); p.rec.Submission_Status = 'Saved'; p.rec.Created_At = now; p.rec.Updated_At = now;
    main.appendRow(hdr.map(function (h) { return safe_(p.rec[h]); }));
    var rows = (p.rows || []).slice(0, 80).map(function (r) { return rhdr.map(function (h) { return safe_(r[h]); }); });
    if (rows.length) resp.getRange(resp.getLastRow() + 1, 1, rows.length, rhdr.length).setValues(rows);
    SpreadsheetApp.flush();
    return json_({ ok: true, duplicate: false, id: p.rec.Assessment_ID });
  } catch (x) { console.error(x); return json_({ ok: false, error: 'Could not save the assessment' }); }
  finally { try { lock.releaseLock(); } catch (y) {} }
}
// Manual integration test: writes one clearly labelled TEST row. Run only with operator approval.
function testSubmission() {
  var id = 'GF-TEST-' + Date.now();
  return doPost({ postData: { length: 10, contents: JSON.stringify({ action: 'submit', rec: { Assessment_ID: id, Student_Name: 'TEST RECORD', Student_Email: 'test@example.com', Student_Mobile: '+10000000000', Consent_Status: 'Given', Course_Interest: COURSES[0], Counsellor_Notes: 'TEST – delete' }, rows: [] }) } }).getContent();
}
