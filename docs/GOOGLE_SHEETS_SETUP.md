# Goalfinity Institute — Google Sheets & Apps Script Setup Guide

This guide provides exhaustive, step-by-step instructions for creating the database spreadsheet, deploying the serverless integration script, authorizing permissions, and linking the frontend.

---

## 1. Why Google Apps Script & Google Sheets?

- **Zero Hosting Fees**: Operates entirely within the free Google Cloud / Google Workspace tier.
- **Immediate Spreadsheet UI**: Sales counsellors and admissions managers can filter, search, sort, and export student enquiries directly in familiar Google Sheets without custom database dashboards.
- **Enterprise Concurrency**: Script uses `LockService` to handle simultaneous student submissions safely.
- **Permanent Audit Trail**: Stores both a high-level candidate row and an item-by-item question audit log.

---

## 2. Complete Step-by-Step Setup

### Step 1: Create the Master Spreadsheet
1. Go to [Google Sheets](https://sheets.new).
2. Set the sheet title to:  
   **`Goalfinity Institute — Student Career Assessments Database`**

### Step 2: Open the Apps Script Editor
1. In the top Google Sheets menu, click **Extensions** &gt; **Apps Script**.
2. A new tab opens with the Apps Script developer console.
3. In the top-left corner, rename the project to:  
   **`Goalfinity Assessment Webhook`**

### Step 3: Insert Backend Code
1. In the left file tree, click on `Code.gs`.
2. Select all existing text (`function myFunction() {}`) and delete it.
3. Open [`google-apps-script/Code.gs`](../google-apps-script/Code.gs) in this repository, copy its entire contents, and paste it into the editor.
4. Press `Cmd + S` (Mac) or `Ctrl + S` (Windows) to save.

### Step 4: Run the One-Click Spreadsheet Initialization
1. In the Apps Script toolbar dropdown (next to the *Debug* button), select:  
   **`initializeSpreadsheet`**
2. Click the **Run** button.
3. An **Authorization Required** modal will appear:
   - Click **Review permissions**.
   - Choose your Google account.
   - Click **Advanced** (small link in bottom left).
   - Click **Go to Goalfinity Assessment Webhook (unsafe)**.
   - Click **Allow**.
4. Check your Google Sheet tab. You will find 3 newly created, formatted worksheets:
   - **`Students_Assessments`**: Main assessment master table with 43 columns styled in Goalfinity Navy (`#0B2545`) with white text and frozen row 1.
   - **`Assessment_Responses`**: Auditable row-per-question log recording question text, student answer, score, max score, and evidence notes.
   - **`Configuration`**: Editable settings storing institution metadata, scoring weights, and readiness guidance bands.

### Step 5: Verify with a Test Record
1. In the Apps Script function dropdown, select: **`testSubmission`**.
2. Click **Run**.
3. View the *Execution log* at the bottom. It should report:
   ```json
   Test submission response: {"status":"success","assessmentId":"GF-TEST-XXXX","message":"Assessment successfully recorded."}
   ```
4. Verify that `Students_Assessments` now contains a clearly labeled test student row (`Test Verification Candidate`). You may leave or delete this row.

### Step 6: Deploy as a Web App
1. In the top-right corner of the Apps Script editor, click **Deploy** &gt; **New deployment**.
2. Click the **Gear icon** next to *Select type* and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Goalfinity Assessment Webhook v1.0.0`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(Must be 'Anyone' so that prospective students and counsellors can submit without logging into Google).*
4. Click **Deploy**.
5. Copy the generated **Web app URL**:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

### Step 7: Update the Frontend Configuration
1. Open [`assets/js/config.js`](../assets/js/config.js) in your local codebase.
2. Locate line 18:
   ```javascript
   APPS_SCRIPT_WEBAPP_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
   ```
3. Replace the placeholder with your actual copied Web App URL:
   ```javascript
   APPS_SCRIPT_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbx.../exec",
   ```
4. Save the file and commit to Git.

---

## 3. Database Schema Reference

### Worksheet 1: `Students_Assessments` (43 Columns)
| Column Name | Type | Description |
|---|---|---|
| `Assessment_ID` | String | Unique ID, e.g. `GF-20261019-A3F8` |
| `Assessment_Date` | ISO 8601 | Timestamp of evaluation |
| `Schema_Version` | String | Schema version, e.g. `1.0.0` |
| `Student_Name` | String | Candidate full name |
| `Student_Email` | String | Validated email address |
| `Student_Mobile` | String | International mobile number with country code |
| `Consent_Status` | String | `Granted` or `Withheld` |
| `Course_Interest` | String | `ai`, `digital_marketing`, or `cloud_computing` |
| `Education` | String | Highest educational qualification |
| `Specialization` | String | Academic major or degree subject |
| `Current_Status` | String | Studying, Employed, Unemployed, or Career Transition |
| `Current_Job_Title` | String | Job title if employed |
| `Experience_Years` | String | Total professional experience |
| `Motivation` | String | Candidate core driver for undertaking course |
| `Primary_Career_Goal` | String | Target career objective |
| `Target_Job_Role` | String | Desired job role within 6–12 months |
| `Salary_Expectation` | String | Optional target compensation bracket |
| `Target_Timeline` | String | Desired timeline to interview/start |
| `Internship_Flexibility` | String | Openness to apprentice / internship roles |
| `Foundational_Knowledge_Score`| Integer | Scaled 0–100% |
| `Practical_Skills_Score` | Integer | Scaled 0–100% |
| `Career_Clarity_Score` | Integer | Scaled 0–100% |
| `Learning_Readiness_Score` | Integer | Scaled 0–100% |
| `Professional_Readiness_Score`| Integer | Scaled 0–100% |
| `Overall_Readiness_Score` | Integer | Weighted 0–100 score |
| `Readiness_Band` | String | Strong, Progressing, Developing, or Foundation |
| `Strengths` | String | Pipe-delimited list of verified aptitudes |
| `Skill_Gaps` | String | Pipe-delimited list of priority gaps |
| `Recommended_Course_Path` | String | Recommended track name |
| `Recommended_Modules` | String | Starting modules |
| `Recommended_Projects` | String | Curated capstone portfolio projects |
| `Suggested_Job_Roles` | String | Industry job roles to pursue |
| `Career_Action_Plan` | String | Next academic counselling action |
| `Practical_Assessment_Score` | String | Ratio of correct practical questions |
| `Question_Responses_JSON` | JSON | Raw serialized response object |
| `Counsellor_Notes` | String | Free-form notes recorded by counsellor |
| `Submission_Status` | String | `COMPLETED` |
| `Created_At` | ISO 8601 | Record creation timestamp |
| `Updated_At` | ISO 8601 | Last record update timestamp |

### Worksheet 2: `Assessment_Responses` (11 Columns)
Contains one row per question response for full auditability and verification:
- `Assessment_ID`, `Question_ID`, `Course`, `Question_Category`, `Question_Text`, `Student_Response`, `Score`, `Maximum_Score`, `Scoring_Method`, `Evidence_Notes`, `Recorded_At`.

### Worksheet 3: `Configuration` (4 Columns)
Stores editable parameters:
- `Setting_Key`, `Setting_Value`, `Description`, `Last_Updated`.

---

## 4. Troubleshooting Web App Deployments

- **Changes in `Code.gs` not taking effect?**  
  When you edit `Code.gs`, you must create a new deployment version: click **Deploy** &gt; **Manage deployments** &gt; Click the pencil icon &gt; Select **New version** &gt; Click **Deploy**.
- **CORS or Redirect Error in Browser?**  
  The frontend uses `fetch` with `Content-Type: text/plain;charset=utf-8`. This bypasses preflight `OPTIONS` requests which Apps Script does not support. Verify that your deployment has **"Who has access"** set to **"Anyone"**.
