# Goalfinity Assessment (GitHub Pages + Apps Script + Google Sheets)
## Setup (you must do these steps; they need your Google/GitHub login)
1. Open your Sheet (ID already set in `google-apps-script/Code.gs`) → **Extensions → Apps Script**. Paste `Code.gs`; in Project Settings tick "Show appsscript.json" and paste `appsscript.json`.
2. Select function **setup** → Run → authorize (Review permissions → your account → Allow). It creates `Students_Assessments`, `Assessment_Responses`, `Configuration`.
3. **Deploy → New deployment → Web app**: Execute as **Me**, Who has access **Anyone**. Copy the `/exec` URL.
4. Paste that URL into `assets/js/config.js` (`ENDPOINT`).
5. GitHub: create repo, upload all files, **Settings → Pages → Deploy from branch → main / (root)**. Site: `https://USER.github.io/REPO/` (all paths are relative).
6. Optional: run `testSubmission` once, check the TEST row, delete it.
7. After editing Code.gs: **Deploy → Manage deployments → Edit → New version**.
## Notes / limits
- Frontend posts `text/plain` (no CORS preflight) and reads the JSON reply; if the reply is not `ok`, the report shows **NOT SAVED** with Retry (retries are idempotent by Assessment ID).
- Public endpoint: validation, a script lock, per-email throttle and duplicate checks reduce abuse but cannot make it private. If abused, redeploy with a new URL.
- Draft answers (no contact details) are kept in localStorage until submit or "Clear saved draft".
- Corrections/deletion: operator edits or deletes rows directly in the Sheet. Keep the Sheet private.
- Tests: `node tests/scoring-tests.js`.
