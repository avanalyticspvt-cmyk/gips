# Goalfinity Institute — Privacy & Security Documentation

This document describes the privacy controls, data protection architecture, credential safeguards, and compliance guidelines governing the Goalfinity Institute Student Career Readiness Assessment Platform.

---

## 1. Personally Identifiable Information (PII) Captured

To generate legitimate career guidance and enable admissions follow-up, the platform collects:
- **Student Full Name**: For report personalization.
- **Email Address**: For report delivery and counselling communications.
- **Mobile Number (with Country Code)**: For counselling follow-up calls or SMS/WhatsApp advisories.
- **Educational & Professional Profile**: Degree, specialization, current employment status, job title, years of experience, and target career goals.

The platform explicitly **does not** collect:
- Passwords or credentials.
- Financial details, credit card numbers, or bank account numbers.
- National ID numbers (e.g., Aadhaar, SSN, PAN, Passport).
- Sensitive health, genetic, or biometric data.

---

## 2. Consent & Transparency Notice

Before initiating an assessment:
1. **Explicit Consent Checkbox**: Candidates (or counsellors on their behalf) must affirm:  
   *"I consent to Goalfinity Institute collecting and processing the above contact and assessment information for academic counselling and personalized reporting."*
2. **Prominent Privacy Notice**: Explains in plain language that data is used exclusively for educational counselling and diagnostic reporting by Goalfinity Institute, and is never sold or shared with third-party advertisers.

---

## 3. GitHub Pages Static Security Model

### Zero Secret Exposure
GitHub Pages is a static hosting environment. Client-side source code (HTML, CSS, JavaScript) is public and inspectable by any visitor.

**Security Architecture**:
- **No Google Service Account Keys**: No JSON private keys, Google API tokens, or OAuth secrets are stored in the frontend codebase.
- **Apps Script as Isolation Layer**: The Google Apps Script Web App acts as a serverless integration gateway. Frontend code only communicates with the published Apps Script webhook URL.
- **Least-Privilege Authorization**: The Google Apps Script only requests the single OAuth scope required: `https://www.googleapis.com/auth/spreadsheets`. It has no access to Google Drive, Gmail, or other Google services.

---

## 4. Server-Side Validation & Abuse Mitigation

Publicly accessible webhooks cannot rely solely on client-side checks. The deployed `Code.gs` script implements:
1. **Server-Side Validation**:
   - Re-validates mandatory presence of `assessmentId`, `studentName`, `studentEmail`, and `studentMobile`.
   - Verifies email structure (`@` presence) and mobile length before appending rows.
2. **Idempotency & Duplicate Protection**:
   - Every submission contains a unique `assessmentId`.
   - `findRowByAssessmentId()` inspects existing spreadsheet records. Submissions with existing IDs are acknowledged idempotently without creating duplicate rows or corrupting data.
3. **Concurrency Locking (`LockService`)**:
   - Submissions acquire a script lock with a 30-second timeout, preventing simultaneous writes from corrupting row indexes.

---

## 5. Local Storage Lifecycle & Draft Protection

- **Draft Retention**: When a counsellor enters student data, it is saved in browser `localStorage` (`goalfinity_assessment_draft`) to prevent loss on accidental reloads.
- **Immediate Draft Clearing**: A prominent **"Clear Draft"** button in the header allows the sales counsellor to wipe all stored student draft data immediately after finishing a call or when switching to a different candidate.
- **No Indefinite PII Lingering**: Successfully completed submissions remove the record from the offline queue.

---

## 6. Data Subject Rights & Administrative Corrections

If a student requests access to their data, corrections, or deletion:
1. An authorized Goalfinity Institute administrator opens the Master Google Spreadsheet.
2. Filter the `Students_Assessments` worksheet by `Student_Email` or `Assessment_ID`.
3. To update or correct contact details, edit the corresponding cell directly.
4. To fulfill a GDPR/DPDP "Right to be Forgotten" deletion request, select the candidate's row in `Students_Assessments` and associated rows in `Assessment_Responses` and click **Delete Row**.
