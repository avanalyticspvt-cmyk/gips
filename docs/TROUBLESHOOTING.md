# Goalfinity Institute — Troubleshooting & Diagnostic Guide

This guide addresses common setup issues, network errors, printing quirks, and Google Apps Script integration scenarios.

---

## 1. Google Sheets Submission Issues

### Issue 1: "Google Apps Script endpoint is not yet configured"
- **Cause**: The placeholder URL `YOUR_DEPLOYMENT_ID` in `assets/js/config.js` has not been replaced with your real deployed Apps Script Web App URL.
- **Solution**:
  1. Deploy `google-apps-script/Code.gs` as a Web App (see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)).
  2. Copy the resulting URL (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).
  3. Open `assets/js/config.js` and paste it into `APPS_SCRIPT_WEBAPP_URL`.

### Issue 2: "Request timed out after 15 seconds" or Network Error
- **Cause**: Poor network connectivity or temporary Google service latency.
- **Safeguard**: The assessment payload has been automatically preserved in your browser's local **Offline Queue**.
- **Solution**:
  1. Click **"Retry Submission"** once network connection is stable.
  2. Alternatively, click **"View / Print Report Offline"** to continue reviewing and printing the report with the student immediately.
  3. When back online, click **"Sync Offline Queue"** on the home screen banner.

### Issue 3: Submissions succeed, but no rows appear in Google Sheet
- **Cause**: Code was deployed under a different Google account or spreadsheet, or `initializeSpreadsheet` was never run.
- **Solution**:
  1. In Apps Script, verify the active spreadsheet by running `testSubmission()`.
  2. Confirm the spreadsheet title matches the intended database.
  3. If you created a new version of `Code.gs`, you must create a new deployment version: **Deploy** &gt; **Manage deployments** &gt; **Edit** &gt; **Version: New version** &gt; **Deploy**.

### Issue 4: "CORS error" or 302 Redirect Failure in Browser Console
- **Cause**: The Web App deployment was configured with restrictive access (e.g., *"Only myself"* or *"Anyone within organization"*).
- **Solution**:
  1. In Apps Script, click **Deploy** &gt; **Manage deployments**.
  2. Click the pencil icon to edit.
  3. Change **"Who has access"** to: **`Anyone`**.
  4. Save and deploy a new version.

---

## 2. Print & PDF Export Formatting

### Issue: Page breaks occur in the middle of a card or table
- **Cause**: Browser print zoom or non-standard margins.
- **Solution**:
  1. In the browser print dialog:
     - Set **Destination**: *Save as PDF*.
     - Set **Paper size**: *A4*.
     - Set **Margins**: *Default* or *None*.
     - Ensure **Background graphics**: *Checked / Enabled* (required so skill bars and colored dials render in full color).
     - Set **Scale**: *Default (100%)*.

---

## 3. Form Validation Quirks

### Issue: Mobile number rejected for international candidate
- **Cause**: User omitted country code or included invalid characters.
- **Solution**:
  The system accepts all international numbers following the E.164 standard (7 to 15 digits with leading country code).
  Examples of valid formats:
  - India: `+91 9876543210` or `+919876543210`
  - USA / Canada: `+1 (415) 555-2671` or `+14155552671`
  - UK: `+44 7911 123456`
  - UAE: `+971 50 123 4567`
  - Singapore: `+65 9123 4567`

---

## 4. Resetting and Clearing State

### How to completely clear a student's session:
- Click the **"Clear Draft"** button in the top right of the website header.
- Confirm the dialog. All in-progress inputs and cached answers will be removed from local storage.
