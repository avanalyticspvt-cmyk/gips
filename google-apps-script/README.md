# Goalfinity Institute — Google Apps Script Backend Setup

This directory contains the server-side integration code connecting the **Goalfinity Career Readiness Assessment Platform** frontend to a Google Spreadsheet database.

---

## 1. Quick Setup Instructions

### Step 1: Create a New Google Spreadsheet
1. Go to [Google Sheets](https://sheets.new) in your web browser.
2. Title the spreadsheet: **"Goalfinity Institute — Student Career Assessments Database"**.

### Step 2: Open Google Apps Script Editor
1. In your new Google Sheet, click on the top menu: **Extensions** &rarr; **Apps Script**.
2. A new tab will open with the Apps Script code editor.
3. Rename the project from *"Untitled project"* to **"Goalfinity Assessment Webhook"**.

### Step 3: Copy Code into Apps Script
1. Delete any default code inside `Code.gs`.
2. Copy the entire contents of [`Code.gs`](./Code.gs) and paste it into the editor.
3. Click the **Save** icon (Floppy disk icon or `Ctrl + S` / `Cmd + S`).

*(Optional: If you want to enable manifest editing, go to Project Settings (Gear icon) &rarr; Check "Show 'appsscript.json' manifest file in editor", and paste [`appsscript.json`](./appsscript.json)).*

### Step 4: Run Spreadsheet Initialization
1. In the top toolbar dropdown (next to *Debug*), select the function: **`initializeSpreadsheet`**.
2. Click **Run**.
3. Google will show an **"Authorization required"** dialog:
   - Click **Review permissions**.
   - Select your Google account.
   - Click **Advanced** &rarr; **Go to Goalfinity Assessment Webhook (unsafe)**.
   - Click **Allow** (Grants permission to read/write to your own active spreadsheet).
4. Return to your Google Spreadsheet tab. You will see 3 beautifully styled worksheets created:
   - **`Students_Assessments`**: Formatted with Navy blue headers (`#0B2545`), frozen row 1, containing all 43 assessment columns.
   - **`Assessment_Responses`**: Formatted audit trail worksheet recording per-question responses.
   - **`Configuration`**: Metadata, scoring weights, and readiness band settings.

### Step 5: Test Backend with a Test Record
1. In the Apps Script toolbar dropdown, select: **`testSubmission`**.
2. Click **Run**.
3. View the **Execution log** at the bottom — it will output:
   ```json
   {"status":"success","assessmentId":"GF-TEST-XXXX","message":"Assessment successfully recorded."}
   ```
4. Check the `Students_Assessments` worksheet — you will see the test candidate record appended! You can safely delete this test row whenever you wish.

---

## 2. Deploy as a Web App

To allow the frontend hosted on GitHub Pages to send assessments to this spreadsheet, deploy it as a public Web App:

1. In the top right of the Apps Script editor, click the blue **Deploy** button &rarr; **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure the deployment settings:
   - **Description**: `Goalfinity Assessment API v1`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: This allows the static frontend on GitHub Pages to submit data without requiring students/counsellors to log into Google)*.
4. Click **Deploy**.
5. Copy the generated **Web App URL**. It will look like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## 3. Connect Web App URL to Frontend

1. Open [`assets/js/config.js`](../assets/js/config.js).
2. Locate the line:
   ```javascript
   APPS_SCRIPT_WEBAPP_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
   ```
3. Replace the placeholder with your actual copied Web App URL:
   ```javascript
   APPS_SCRIPT_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbx.../exec",
   ```
4. Save the file and commit to your GitHub repository. That's it! Every assessment completed on your website will now automatically record into your Google Spreadsheet.

---

## 4. Key Architectural Features

- **Concurrency Protection**: Uses `LockService.getScriptLock()` with a 30-second timeout to prevent simultaneous submissions from corrupting row indexes.
- **Idempotency & Deduplication**: Checks `Assessment_ID` before appending. Accidental double-clicks or retries will not create duplicate student rows.
- **Dynamic Schema Evolution**: The script checks existing headers before inserting data. If new columns are added in future versions, `syncSheetHeaders()` automatically appends them to the right without modifying or erasing existing student data.
- **CORS Compatibility**: Supports standard browser `POST` requests without triggering browser CORS preflight blocks.
