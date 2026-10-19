# Goalfinity Institute — Student Career Readiness Assessment Platform

[![GitHub Pages Compatible](https://img.shields.io/badge/Hosting-GitHub%20Pages-blue.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-green.svg)](#)
[![Backend](https://img.shields.io/badge/Database-Google%20Sheets%20%2B%20Apps%20Script-brightgreen.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> **"Discover Your Skills. Build Your Future."**  
> A production-minded, client-side web application designed for Goalfinity Institute academic advisors and sales counsellors to conduct structured, conversational career readiness assessments for prospective students, identify skill gaps, recommend personalized learning pathways, generate a 4-page dynamic print/PDF report, and synchronize records with Google Sheets.

---

## 🌟 Key Capabilities

- **Multi-Course Assessment Flows**:
  - **Artificial Intelligence (AI)**: Math/statistics readiness, Python coding, data literacy, predictive churn modeling, and LLM/Generative AI applications.
  - **Digital Marketing**: Organic vs. paid strategy, SEO, copywriting, local geo-promotion, conversion psychology, and campaign analytics (ROAS/CAC).
  - **Cloud Computing**: IT/networking foundations, Linux terminal skills, server architecture, IP routing, cloud storage, and troubleshooting inaccessible cloud instances.
- **Robust Student Intake**:
  - Validates international mobile numbers (E.164 standard, no India-only limitation).
  - Validates RFC-5322 email formatting, education, specialization, and employment status.
  - Generates collision-resistant Assessment IDs (`GF-YYYYMMDD-XXXX`).
  - Collects explicit GDPR/privacy consent with clear institutional notice.
- **Transparent Scoring Engine**:
  - Foundational Knowledge (30%), Practical Skills (30%), Career Goal Clarity (15%), Learning Readiness (15%), Professional Readiness (10%).
  - Guidance bands: *Foundation-Building (0–39)*, *Developing (40–59)*, *Progressing (60–79)*, and *Strong Readiness (80–100)*.
  - Separates self-reported confidence from verified reasoning. Explicitly accommodates "Not sure" responses and optional questions without arbitrary zero penalties.
- **Dynamic 4-Page Student Career Readiness Report**:
  - **Page 1**: Student overview, Goalfinity branding, readiness dial, level recommendation, executive evaluation.
  - **Page 2**: Category progress bars, verified strengths, priority skill gaps with evidence, practical score.
  - **Page 3**: Personalized learning roadmap, starting modules, 5-phase sequence, curated portfolio projects.
  - **Page 4**: Target job roles with compensation context, 4 Goalfinity support pillars, next counselling step, legal advisory disclaimer.
  - **Browser Native Print / PDF Export**: Precision A4 CSS rules, page-break management, and automatic exclusion of interactive controls during print.
- **Serverless Google Sheets Database**:
  - Zero-cost serverless backend using Google Apps Script (`google-apps-script/Code.gs`).
  - Automated 3-sheet initialization: `Students_Assessments` (43+ columns), `Assessment_Responses` (per-question audit trail), and `Configuration`.
  - Idempotency guards, concurrency locking (`LockService`), and dynamic schema evolution.
  - Built-in LocalStorage offline queue for zero data loss during network interruptions.

---

## 📁 Repository Structure

```
.
├── .nojekyll                          # Disables Jekyll processing on GitHub Pages
├── 404.html                           # Custom 404 error page and redirect
├── index.html                         # Multi-step assessment wizard & report shell
├── README.md                          # Primary project documentation
├── assets/
│   ├── css/
│   │   ├── styles.css                 # Goalfinity design system, responsive UI, cards
│   │   └── report.css                 # 4-page dynamic report styles and A4 print media queries
│   └── js/
│       ├── app.js                     # Main entry orchestrator and offline sync checker
│       ├── assessment.js              # Wizard navigation controller (Steps 1–10)
│       ├── config.js                  # Central configuration (Apps Script URL, weights, bands)
│       ├── intake.js                  # Step 1 intake controller, validation & autosave
│       ├── questions.js               # Comprehensive question bank, rubrics & practical MCQs
│       ├── recommendations.js         # Course pathways, modules, projects & job roles
│       ├── report.js                  # 4-page dynamic report generator
│       ├── scoring.js                 # Transparent scoring algorithm & gap analysis
│       ├── sheets-client.js           # Google Apps Script client, CORS fetch & offline queue
│       └── validation.js              # International phone, email, and input sanitization
├── docs/
│   ├── ASSESSMENT_SCORING.md          # In-depth scoring formulas and guidance bands
│   ├── DEPLOYMENT.md                  # GitHub Pages step-by-step deployment guide
│   ├── GOOGLE_SHEETS_SETUP.md         # Google Sheets & Apps Script deployment guide
│   ├── PRIVACY_AND_SECURITY.md        # Data protection, consent and endpoint security
│   └── TROUBLESHOOTING.md             # Common issues and diagnostic checklist
├── google-apps-script/
│   ├── Code.gs                        # Apps Script source (doPost, doGet, init, test)
│   ├── appsscript.json                # Project manifest with OAuth scopes
│   └── README.md                      # Apps script setup walkthrough
└── tests/
    ├── recommendation-tests.js        # Recommendation engine test suite
    ├── run-tests.py                   # Terminal test runner (Python 3.13)
    ├── scoring-tests.js               # Scoring engine math & boundary test suite
    ├── test-runner.html               # Interactive in-browser test runner
    └── validation-tests.js            # Input validation & sanitization test suite
```

---

## 🚀 Quick Start (Local Development)

Because this application is built with vanilla web standards, it requires no build steps, bundlers, or Node.js packages to run.

### Running Locally with Python
```bash
# Navigate to the repository root
cd goalfinity-assessment

# Start a local static HTTP server (Python 3)
python3 -m http.server 8080
```
Open your browser and navigate to:
```
http://localhost:8080/index.html
```

---

## 🧪 Running Automated Tests

### 1. Terminal Runner (Python)
Run the automated test runner in your command line:
```bash
python3 tests/run-tests.py
```
This executes all unit tests covering:
- Phone & email validation rules (including international phone formats).
- Scoring calculations across boundary values (39, 40, 59, 60, 79, 80).
- Category weights, Likert scaling, and "Not sure" handling.
- Course pathway recommendations and module assignments.

### 2. In-Browser Test Suite
Open [`tests/test-runner.html`](file:///Users/sagarbhilare/Desktop/GIPS/tests/test-runner.html) in your browser:
```
http://localhost:8080/tests/test-runner.html
```
Displays interactive pass/fail badges, assertion counts, and execution metrics.

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In your repository on GitHub, navigate to: **Settings** &rarr; **Pages**.
3. Under **Build and deployment** &rarr; **Source**, select:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
4. Click **Save**.
5. Within 1–2 minutes, your platform will be live at:
   `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY-NAME/`

*For comprehensive details on repository subpaths, custom domains, and Apps Script connections, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).*

---

## 📊 Google Sheets Setup Summary

1. Create a new Google Spreadsheet at [sheets.new](https://sheets.new).
2. Open **Extensions** &rarr; **Apps Script**.
3. Paste the contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. Select `initializeSpreadsheet` in the top toolbar and click **Run**.
5. Deploy as Web App: **Deploy** &rarr; **New deployment** &rarr; Select **Web app** &rarr; Execute as: **Me** &rarr; Who has access: **Anyone**.
6. Copy the Web App URL and update `APPS_SCRIPT_WEBAPP_URL` in [`assets/js/config.js`](assets/js/config.js).

*See [docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md) for full instructions with screenshots and error resolutions.*

---

## ⚖️ License & Attribution

&copy; Goalfinity Institute. All Rights Reserved.  
Designed for educational diagnostics and student counselling.
