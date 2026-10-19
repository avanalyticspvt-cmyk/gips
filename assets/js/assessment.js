/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Step Navigation & Assessment Questionnaire Controller
 */

const AssessmentController = {
  currentStep: 1,
  totalSteps: 10,
  selectedCourse: "ai",
  studentProfile: null,
  answers: {},
  practicalQuizAnswers: {},
  rubricScore: 3,
  counsellorNotes: "",
  includeNotesInReport: false,
  scoringResults: null,
  recommendations: null,
  isSubmitting: false,

  /**
   * Initializes the assessment wizard.
   */
  init() {
    this.bindNavigationEvents();
    this.loadSavedAnswers();
  },

  /**
   * Loads saved answers from LocalStorage draft.
   */
  loadSavedAnswers() {
    try {
      const key = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
        ? CONFIG.STORAGE_KEYS.DRAFT_ASSESSMENT
        : "goalfinity_assessment_draft";

      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      if (saved.answers) this.answers = saved.answers;
      if (saved.practicalQuizAnswers) this.practicalQuizAnswers = saved.practicalQuizAnswers;
      if (saved.rubricScore) this.rubricScore = saved.rubricScore;
      if (saved.counsellorNotes) this.counsellorNotes = saved.counsellorNotes;
      if (saved.selectedCourse) this.selectedCourse = saved.selectedCourse;
      if (saved.currentStep && saved.currentStep > 1) {
        // We will allow navigating to step if intake was completed
        if (saved.studentProfile && saved.studentProfile.studentName) {
          this.studentProfile = saved.studentProfile;
        }
      }
    } catch (e) {
      console.warn("Could not load saved assessment answers:", e);
    }
  },

  /**
   * Binds wizard navigation buttons (Next, Previous, Submit, Print).
   */
  bindNavigationEvents() {
    // Step 1 to Step 2
    const btnToIntakeNext = document.getElementById("btn-intake-next");
    if (btnToIntakeNext) {
      btnToIntakeNext.addEventListener("click", () => {
        const res = IntakeController.validateAndSubmit();
        if (res.valid) {
          this.studentProfile = res.profile;
          this.selectedCourse = res.profile.courseInterest;
          this.goToStep(2);
        }
      });
    }

    // Step 2 Confirm Course
    const btnCourseConfirm = document.getElementById("btn-course-confirm");
    if (btnCourseConfirm) {
      btnCourseConfirm.addEventListener("click", () => {
        this.renderStepQuestions();
        this.goToStep(3);
      });
    }

    // Previous buttons
    document.querySelectorAll(".btn-prev-step").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetStep = parseInt(e.currentTarget.dataset.target, 10);
        this.goToStep(targetStep || this.currentStep - 1);
      });
    });

    // Next buttons
    document.querySelectorAll(".btn-next-step").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetStep = parseInt(e.currentTarget.dataset.target, 10);
        if (this.validateCurrentStep()) {
          this.saveState();
          this.goToStep(targetStep || this.currentStep + 1);
        }
      });
    });

    // Step 6 Calculate & Review
    const btnCalculate = document.getElementById("btn-calculate-score");
    if (btnCalculate) {
      btnCalculate.addEventListener("click", () => {
        this.calculateAndProceed();
      });
    }

    // Step 8 Sync to Sheets
    const btnSyncSheets = document.getElementById("btn-sync-sheets");
    if (btnSyncSheets) {
      btnSyncSheets.addEventListener("click", () => {
        this.submitToGoogleSheets();
      });
    }

    const btnRetrySync = document.getElementById("btn-retry-sync");
    if (btnRetrySync) {
      btnRetrySync.addEventListener("click", () => {
        this.submitToGoogleSheets();
      });
    }

    // Skip Sync to view report (offline mode)
    const btnViewReportOffline = document.getElementById("btn-view-report-offline");
    if (btnViewReportOffline) {
      btnViewReportOffline.addEventListener("click", () => {
        this.goToStep(9);
      });
    }

    // Step 9 Print & PDF Buttons
    const btnPrintReport = document.getElementById("btn-print-report");
    if (btnPrintReport) {
      btnPrintReport.addEventListener("click", () => {
        window.print();
      });
    }

    const btnDownloadPDF = document.getElementById("btn-download-pdf");
    if (btnDownloadPDF) {
      btnDownloadPDF.addEventListener("click", () => {
        window.print();
      });
    }

    const btnToStep10 = document.getElementById("btn-to-step-10");
    if (btnToStep10) {
      btnToStep10.addEventListener("click", () => {
        this.goToStep(10);
      });
    }

    // Step 10 New Assessment
    const btnNewAssessment = document.getElementById("btn-new-assessment");
    if (btnNewAssessment) {
      btnNewAssessment.addEventListener("click", () => {
        if (confirm("Start a new assessment? The current assessment is completed.")) {
          this.resetWizard();
        }
      });
    }
  },

  /**
   * Navigates to a specific step index (1-10) and updates the step progress indicators.
   */
  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;

    // Hide all step sections
    for (let i = 1; i <= this.totalSteps; i++) {
      const sec = document.getElementById(`step-section-${i}`);
      if (sec) sec.style.display = "none";
    }

    // Show active step section
    const activeSec = document.getElementById(`step-section-${stepNumber}`);
    if (activeSec) {
      activeSec.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    this.currentStep = stepNumber;
    this.updateProgressUI(stepNumber);

    // Dynamic hooks per step
    if (stepNumber === 2) {
      this.populateCourseConfirmStep();
    } else if (stepNumber === 3) {
      this.renderCommonQuestions();
    } else if (stepNumber === 4) {
      this.renderCourseSpecificQuestions();
    } else if (stepNumber === 5) {
      this.renderPracticalQuestions();
    } else if (stepNumber === 6) {
      this.renderReviewSummary();
    } else if (stepNumber === 9) {
      this.renderReportView();
    } else if (stepNumber === 10) {
      this.renderActionPlanStep();
    }

    this.saveState();
  },

  /**
   * Updates top progress bar and step indicator dots.
   */
  updateProgressUI(stepNumber) {
    const progressPct = Math.round(((stepNumber - 1) / (this.totalSteps - 1)) * 100);
    const progressBar = document.getElementById("main-progress-bar");
    if (progressBar) progressBar.style.width = `${progressPct}%`;

    const progressLabel = document.getElementById("progress-step-label");
    if (progressLabel) progressLabel.textContent = `Step ${stepNumber} of ${this.totalSteps}`;

    // Update active pill classes
    document.querySelectorAll(".step-indicator-pill").forEach(pill => {
      const s = parseInt(pill.dataset.step, 10);
      pill.classList.remove("step-active", "step-completed");
      if (s === stepNumber) {
        pill.classList.add("step-active");
      } else if (s < stepNumber) {
        pill.classList.add("step-completed");
      }
    });
  },

  /**
   * Populates Step 2 Course Confirmation cards.
   */
  populateCourseConfirmStep() {
    const courseId = this.selectedCourse || "ai";
    const course = (typeof CONFIG !== "undefined" && CONFIG.COURSES && CONFIG.COURSES[courseId.toUpperCase()])
      ? CONFIG.COURSES[courseId.toUpperCase()]
      : { title: "Artificial Intelligence", description: "AI & ML", badge: "AI" };

    const titleEl = document.getElementById("course-confirm-title");
    if (titleEl) titleEl.textContent = course.title;

    const descEl = document.getElementById("course-confirm-desc");
    if (descEl) descEl.textContent = course.description;

    const studentNameEl = document.getElementById("course-confirm-student");
    if (studentNameEl && this.studentProfile) {
      studentNameEl.textContent = this.studentProfile.studentName;
    }
  },

  /**
   * Renders questions for Step 3: Common Career & Learning Readiness Assessment.
   */
  renderCommonQuestions() {
    const container = document.getElementById("common-questions-container");
    if (!container || container.innerHTML.trim() !== "") return; // Already rendered

    const qBank = typeof QUESTION_BANK !== "undefined" ? QUESTION_BANK : null;
    if (!qBank) return;

    let html = `
      <div class="assessment-section-group">
        <h3 class="group-title"><span class="group-num">A</span> Educational & Professional Motivation</h3>
    `;

    qBank.commonBackground.forEach(q => {
      html += this.renderQuestionMarkup(q);
    });

    html += `
      </div>
      <div class="assessment-section-group">
        <h3 class="group-title"><span class="group-num">B</span> Learning Readiness & Practical Discipline</h3>
        <p class="group-hint">Rated on a 5-point scale (1: Beginner to 5: Highly confident), plus 'Not sure'.</p>
    `;

    qBank.commonReadiness.forEach(q => {
      html += this.renderQuestionMarkup(q);
    });

    html += `</div>`;
    container.innerHTML = html;
    this.restoreQuestionValues(container);
    this.bindQuestionInputListeners(container);
  },

  /**
   * Renders questions for Step 4: Course-Specific Assessment.
   */
  renderCourseSpecificQuestions() {
    const container = document.getElementById("technical-questions-container");
    if (!container) return;

    const qBank = typeof QUESTION_BANK !== "undefined" ? QUESTION_BANK : null;
    if (!qBank) return;

    const courseData = qBank[this.selectedCourse] || qBank.ai;
    let html = `
      <div class="assessment-section-group">
        <h3 class="group-title">${courseData.title} — Conceptual & Technical Diagnostic</h3>
        <p class="group-hint">Conversational questions to gauge real domain familiarity, analytical logic, and depth.</p>
    `;

    courseData.questions.forEach(q => {
      html += this.renderQuestionMarkup(q);
    });

    html += `</div>`;
    container.innerHTML = html;
    this.restoreQuestionValues(container);
    this.bindQuestionInputListeners(container);
  },

  /**
   * Renders questions for Step 5: Practical Skill Assessment (Adaptive MCQs + Scenario Rubric).
   */
  renderPracticalQuestions() {
    const container = document.getElementById("practical-quiz-container");
    if (!container) return;

    const qBank = typeof QUESTION_BANK !== "undefined" ? QUESTION_BANK : null;
    if (!qBank) return;

    const quizList = (qBank.practicalQuiz && qBank.practicalQuiz[this.selectedCourse])
      ? qBank.practicalQuiz[this.selectedCourse]
      : [];

    let html = `
      <div class="assessment-section-group">
        <h3 class="group-title">Practical Knowledge & Reasoning Check</h3>
        <p class="group-hint">Objective 5–10 minute practical knowledge questions. Answered conversationally or independently.</p>
    `;

    quizList.forEach((q, idx) => {
      const selected = this.practicalQuizAnswers[q.id];
      html += `
        <div class="question-card" id="qcard-${q.id}">
          <div class="question-header">
            <span class="q-difficulty diff-${q.difficulty}">${q.difficulty.toUpperCase()}</span>
            <label class="q-label"><strong>Q${idx + 1}: ${q.questionText}</strong></label>
          </div>
          <div class="quiz-options-group">
            ${q.options.map((opt, optIdx) => `
              <label class="quiz-option-label">
                <input type="radio" name="pq_${q.id}" value="${optIdx}" ${selected === optIdx ? "checked" : ""}>
                <span>${opt.text}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `;
    });

    // Counsellor Practical Scenario Evaluation Rubric
    html += `
      <div class="rubric-card">
        <div class="rubric-header">
          <span class="q-difficulty diff-rubric">COUNSELLOR RUBRIC</span>
          <h4>Practical Scenario Evaluated Score (1–5)</h4>
        </div>
        <p class="rubric-guidance">Rate the candidate's analytical reasoning, problem structuring, and practical scenario response:</p>
        <div class="likert-buttons">
          ${[1, 2, 3, 4, 5].map(v => `
            <button type="button" class="btn-likert ${this.rubricScore === v ? 'selected' : ''}" data-rubric-val="${v}">
              <span class="likert-num">${v}</span>
              <span class="likert-text">${v === 1 ? 'Needs Guidance' : v === 3 ? 'Independent' : v === 5 ? 'Exceptional' : ''}</span>
            </button>
          `).join("")}
        </div>
      </div>
      </div>
    `;

    container.innerHTML = html;

    // Bind Quiz radio events
    container.querySelectorAll("input[type='radio']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        const qId = e.target.name.replace("pq_", "");
        this.practicalQuizAnswers[qId] = parseInt(e.target.value, 10);
        this.saveState();
      });
    });

    // Bind Rubric buttons
    container.querySelectorAll(".btn-likert[data-rubric-val]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        container.querySelectorAll(".btn-likert[data-rubric-val]").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        this.rubricScore = parseInt(btn.dataset.rubricVal, 10);
        this.saveState();
      });
    });
  },

  /**
   * Helper to render generic question markup for radio, select, text, and Likert scale.
   */
  renderQuestionMarkup(q) {
    let inputHTML = "";

    if (q.type === "select") {
      inputHTML = `
        <select class="form-select q-input" name="${q.id}" id="input-${q.id}">
          <option value="">— Select an option —</option>
          ${q.options.map(o => `<option value="${o.value}">${o.text}</option>`).join("")}
        </select>
      `;
    } else if (q.type === "radio") {
      inputHTML = `
        <div class="radio-options-grid">
          ${q.options.map(o => `
            <label class="radio-card">
              <input type="radio" name="${q.id}" value="${o.value}">
              <span class="radio-text">${o.text}</span>
            </label>
          `).join("")}
        </div>
      `;
    } else if (q.type === "likert_scale") {
      inputHTML = `
        <div class="likert-scale-wrap">
          <div class="likert-scale-options">
            ${[1, 2, 3, 4, 5].map(v => `
              <label class="likert-option">
                <input type="radio" name="${q.id}" value="${v}">
                <span class="likert-bubble">${v}</span>
                <span class="likert-sub">${CONFIG.LIKERT_SCALE[v].label}</span>
              </label>
            `).join("")}
            ${q.allowNotSure ? `
              <label class="likert-option not-sure-option">
                <input type="radio" name="${q.id}" value="not_sure">
                <span class="likert-bubble not-sure-bubble">?</span>
                <span class="likert-sub">Not Sure</span>
              </label>
            ` : ""}
          </div>
        </div>
      `;
    } else if (q.type === "text") {
      inputHTML = `
        <input type="text" class="form-input q-input" name="${q.id}" id="input-${q.id}" placeholder="${q.placeholder || ''}">
      `;
    } else if (q.type === "rubric_eval") {
      inputHTML = `
        <div class="rubric-scenario-box">
          <p class="rubric-scenario-prompt"><strong>Evaluation Rubric:</strong> ${q.rubricPrompt}</p>
          <div class="counsellor-rubric-rating">
            <span class="rubric-label">Counsellor Scenario Rating (1–5):</span>
            <div class="rating-radios">
              ${[1, 2, 3, 4, 5].map(v => `
                <label class="rating-radio">
                  <input type="radio" name="${q.id}" value="${v}">
                  <span class="rating-pill">${v}</span>
                </label>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="question-card" id="qcard-${q.id}">
        <div class="question-header">
          <span class="q-category-tag">${q.label || 'Question'}</span>
          <label class="q-label" for="input-${q.id}">
            <strong>${q.question}</strong>
            ${q.required ? '<span class="required-star">*</span>' : '<span class="optional-tag">(Optional)</span>'}
          </label>
        </div>
        <div class="question-body">
          ${inputHTML}
        </div>
        <div class="field-error" id="error-${q.id}" style="display:none;"></div>
      </div>
    `;
  },

  /**
   * Binds real-time answer change listeners.
   */
  bindQuestionInputListeners(container) {
    container.querySelectorAll("input, select, textarea").forEach(input => {
      const handler = () => {
        if (input.type === "radio") {
          if (input.checked) {
            this.answers[input.name] = input.value;
          }
        } else {
          this.answers[input.name] = input.value;
        }
        this.saveState();
      };

      input.addEventListener("change", handler);
      if (input.type === "text") {
        input.addEventListener("input", handler);
      }
    });
  },

  /**
   * Restores answers previously saved in state into rendered inputs.
   */
  restoreQuestionValues(container) {
    for (const [key, val] of Object.entries(this.answers)) {
      const radios = container.querySelectorAll(`input[name="${key}"][type="radio"]`);
      if (radios.length > 0) {
        radios.forEach(r => {
          if (String(r.value) === String(val)) r.checked = true;
        });
      } else {
        const input = container.querySelector(`[name="${key}"]`);
        if (input && val !== undefined) input.value = val;
      }
    }
  },

  /**
   * Validates mandatory questions in the current step before advancing.
   */
  validateCurrentStep() {
    // Current step validation logic
    if (this.currentStep === 3) {
      // Validate common background requirements
      const required = ["cb_motivation", "cb_prior_experience", "cb_primary_goal", "cb_target_role", "cb_target_timeline", "cr_digital_literacy", "cr_english_communication", "cr_problem_solving", "cr_practical_work", "cr_weekly_hours"];
      let allValid = true;
      required.forEach(qId => {
        if (!this.answers[qId]) {
          allValid = false;
          const card = document.getElementById(`qcard-${qId}`);
          if (card) card.classList.add("card-error");
        } else {
          const card = document.getElementById(`qcard-${qId}`);
          if (card) card.classList.remove("card-error");
        }
      });

      if (!allValid) {
        alert("Please answer all mandatory questions in this section before continuing.");
        return false;
      }
    }
    return true;
  },

  /**
   * Renders Step 6 Review & Counsellor Observations summary.
   */
  renderReviewSummary() {
    const summaryContainer = document.getElementById("review-summary-container");
    if (!summaryContainer) return;

    const profile = this.studentProfile || {};
    const notesInput = document.getElementById("counsellor-notes-input");
    if (notesInput) notesInput.value = this.counsellorNotes || "";

    const includeNotesCheckbox = document.getElementById("include-counsellor-notes");
    if (includeNotesCheckbox) includeNotesCheckbox.checked = this.includeNotesInReport;

    summaryContainer.innerHTML = `
      <div class="review-card">
        <h4>Student Details</h4>
        <div class="review-grid">
          <div><strong>Name:</strong> ${profile.studentName || "—"}</div>
          <div><strong>Email:</strong> ${profile.studentEmail || "—"}</div>
          <div><strong>Mobile:</strong> ${profile.studentMobile || "—"}</div>
          <div><strong>Course:</strong> ${(profile.courseInterest || "").toUpperCase()}</div>
          <div><strong>Education:</strong> ${profile.education || "—"} (${profile.specialization || "General"})</div>
          <div><strong>Status:</strong> ${profile.currentStatus || "—"}</div>
        </div>
      </div>
      <div class="review-card">
        <h4>Assessment Answers Summary</h4>
        <p class="text-muted">Total verified question responses recorded: ${Object.keys(this.answers).length} items.</p>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-edit-answers">Review / Edit Answers</button>
      </div>
    `;

    const editBtn = document.getElementById("btn-edit-answers");
    if (editBtn) {
      editBtn.addEventListener("click", () => this.goToStep(3));
    }
  },

  /**
   * Step 6 to Step 7: Calculate scores and recommendations.
   */
  calculateAndProceed() {
    const notesInput = document.getElementById("counsellor-notes-input");
    this.counsellorNotes = notesInput ? notesInput.value.trim() : "";

    const includeNotesCheckbox = document.getElementById("include-counsellor-notes");
    this.includeNotesInReport = includeNotesCheckbox ? includeNotesCheckbox.checked : false;

    // Run transparent scoring engine
    this.scoringResults = Scoring.calculateAssessment(
      this.answers,
      this.selectedCourse,
      this.practicalQuizAnswers,
      this.rubricScore,
      this.counsellorNotes
    );

    // Run personalized recommendation engine
    this.recommendations = Recommendations.generate(
      {
        ...this.studentProfile,
        weeklyHours: this.answers.cr_weekly_hours || "10_to_15"
      },
      this.selectedCourse,
      this.scoringResults
    );

    this.saveState();

    // Render Step 7 score preview
    this.renderScorePreviewStep();
    this.goToStep(7);
  },

  /**
   * Renders Step 7 calculated score preview.
   */
  renderScorePreviewStep() {
    const scoreContainer = document.getElementById("score-preview-container");
    if (!scoreContainer || !this.scoringResults) return;

    const s = this.scoringResults;
    const band = s.band;

    scoreContainer.innerHTML = `
      <div class="score-calculation-card">
        <div class="score-dial-large">
          <span class="score-dial-number">${s.overallScore}</span>
          <span class="score-dial-sub">Overall Readiness Score / 100</span>
        </div>
        <div class="score-band-banner" style="background-color: ${band.color}; color: #ffffff;">
          <h3>${band.label}</h3>
          <p>${band.description}</p>
        </div>
        <div class="category-breakdown-table">
          <h4>Category Score Contribution</h4>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Earned</th>
                <th>Max</th>
                <th>Score</th>
                <th>Weight</th>
                <th>Contribution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Foundational Knowledge</td>
                <td>${s.categoryScores.foundational.earned}</td>
                <td>${s.categoryScores.foundational.max}</td>
                <td>${s.categoryScores.foundational.percentage}%</td>
                <td>30%</td>
                <td><strong>${s.categoryScores.foundational.weightedScore} pts</strong></td>
              </tr>
              <tr>
                <td>Practical Skills & Application</td>
                <td>${s.categoryScores.practical.earned}</td>
                <td>${s.categoryScores.practical.max}</td>
                <td>${s.categoryScores.practical.percentage}%</td>
                <td>30%</td>
                <td><strong>${s.categoryScores.practical.weightedScore} pts</strong></td>
              </tr>
              <tr>
                <td>Career Goal Clarity</td>
                <td>${s.categoryScores.careerClarity.earned}</td>
                <td>${s.categoryScores.careerClarity.max}</td>
                <td>${s.categoryScores.careerClarity.percentage}%</td>
                <td>15%</td>
                <td><strong>${s.categoryScores.careerClarity.weightedScore} pts</strong></td>
              </tr>
              <tr>
                <td>Learning Readiness & Study Hours</td>
                <td>${s.categoryScores.learningReadiness.earned}</td>
                <td>${s.categoryScores.learningReadiness.max}</td>
                <td>${s.categoryScores.learningReadiness.percentage}%</td>
                <td>15%</td>
                <td><strong>${s.categoryScores.learningReadiness.weightedScore} pts</strong></td>
              </tr>
              <tr>
                <td>Professional & Communication Readiness</td>
                <td>${s.categoryScores.professionalReadiness.earned}</td>
                <td>${s.categoryScores.professionalReadiness.max}</td>
                <td>${s.categoryScores.professionalReadiness.percentage}%</td>
                <td>10%</td>
                <td><strong>${s.categoryScores.professionalReadiness.weightedScore} pts</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    const btnToStep8 = document.getElementById("btn-proceed-to-save");
    if (btnToStep8) {
      btnToStep8.onclick = () => this.goToStep(8);
    }
  },

  /**
   * Prepares and submits completed assessment payload to Google Sheets.
   */
  async submitToGoogleSheets() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const statusEl = document.getElementById("sheets-sync-status");
    const spinner = document.getElementById("sync-spinner");
    const retryBtn = document.getElementById("btn-retry-sync");
    const proceedBtn = document.getElementById("btn-proceed-to-report");

    if (statusEl) {
      statusEl.className = "sync-status-box status-loading";
      statusEl.innerHTML = `<span class="spinner"></span> Transmitting assessment data to Google Sheets...`;
      statusEl.style.display = "block";
    }
    if (spinner) spinner.style.display = "inline-block";
    if (retryBtn) retryBtn.style.display = "none";

    const payload = this.buildSpreadsheetPayload();

    const result = await SheetsClient.submitAssessment(payload);
    this.isSubmitting = false;
    if (spinner) spinner.style.display = "none";

    if (result.success) {
      if (statusEl) {
        statusEl.className = "sync-status-box status-success";
        statusEl.innerHTML = `<strong>&check; Success!</strong> ${result.message}`;
      }
      if (proceedBtn) proceedBtn.style.display = "inline-block";
      // Auto-advance to report after 1.5 seconds on success
      setTimeout(() => this.goToStep(9), 1500);
    } else {
      if (statusEl) {
        statusEl.className = "sync-status-box status-error";
        statusEl.innerHTML = `<strong>&excl; Sync Warning:</strong> ${result.message}`;
      }
      if (retryBtn) retryBtn.style.display = "inline-block";
      if (proceedBtn) {
        proceedBtn.textContent = "View Report Offline &bull; Next &rarr;";
        proceedBtn.style.display = "inline-block";
      }
    }
  },

  /**
   * Formats the payload according to Google Sheets schema.
   */
  buildSpreadsheetPayload() {
    const profile = this.studentProfile || {};
    const scores = this.scoringResults || {};
    const recs = this.recommendations || {};
    const cats = scores.categoryScores || {};

    return {
      action: "SUBMIT_ASSESSMENT",
      schemaVersion: (typeof CONFIG !== "undefined") ? CONFIG.SCHEMA_VERSION : "1.0.0",
      assessmentId: profile.assessmentId,
      assessmentDate: new Date().toISOString(),
      studentName: profile.studentName,
      studentEmail: profile.studentEmail,
      studentMobile: profile.studentMobile,
      consentStatus: profile.consent ? "Granted" : "Withheld",
      courseInterest: profile.courseInterest,
      education: profile.education,
      specialization: profile.specialization,
      currentStatus: profile.currentStatus,
      currentJobTitle: profile.currentJobTitle,
      experienceYears: profile.experienceYears,
      motivation: this.answers.cb_motivation || "",
      primaryCareerGoal: this.answers.cb_primary_goal || "",
      targetJobRole: this.answers.cb_target_role || "",
      salaryExpectation: this.answers.cb_salary_expectation || "prefer_not_to_say",
      targetTimeline: this.answers.cb_target_timeline || "",
      internshipFlexibility: this.answers.cb_internship_openness || "",
      digitalSkillsScore: cats.learningReadiness ? cats.learningReadiness.percentage : 0,
      communicationScore: cats.professionalReadiness ? cats.professionalReadiness.percentage : 0,
      problemSolvingScore: cats.learningReadiness ? cats.learningReadiness.percentage : 0,
      projectExperience: this.answers.cr_practical_work || "",
      weeklyLearningHours: this.answers.cr_weekly_hours || "",
      foundationalKnowledgeScore: cats.foundational ? cats.foundational.percentage : 0,
      practicalSkillsScore: cats.practical ? cats.practical.percentage : 0,
      careerClarityScore: cats.careerClarity ? cats.careerClarity.percentage : 0,
      learningReadinessScore: cats.learningReadiness ? cats.learningReadiness.percentage : 0,
      professionalReadinessScore: cats.professionalReadiness ? cats.professionalReadiness.percentage : 0,
      overallReadinessScore: scores.overallScore || 0,
      readinessBand: scores.band ? scores.band.label : "Developing",
      strengths: (scores.strengths || []).map(s => `${s.area}: ${s.evidence}`).join(" | "),
      skillGaps: (scores.skillGaps || []).map(g => `${g.area}: ${g.evidence}`).join(" | "),
      recommendedCoursePath: recs.courseTitle || "",
      recommendedModules: (recs.startingModules || []).map(m => m.title).join(", "),
      recommendedProjects: (recs.portfolioProjects || []).map(p => p.title).join(", "),
      suggestedJobRoles: (recs.targetJobRoles || []).map(r => r.title).join(", "),
      careerActionPlan: recs.nextAction || "",
      practicalAssessmentScore: scores.practicalQuiz ? `${scores.practicalQuiz.correct}/${scores.practicalQuiz.total}` : "0/0",
      questionResponsesJSON: JSON.stringify(this.answers),
      counsellorNotes: this.counsellorNotes || "",
      submissionStatus: "COMPLETED",
      auditTrail: scores.auditTrail || []
    };
  },

  /**
   * Renders the 4-Page dynamic report into Step 9 container.
   */
  renderReportView() {
    const reportContainer = document.getElementById("report-view-container");
    if (!reportContainer) return;

    if (!this.scoringResults || !this.recommendations) {
      this.scoringResults = Scoring.calculateAssessment(this.answers, this.selectedCourse, this.practicalQuizAnswers, this.rubricScore, this.counsellorNotes);
      this.recommendations = Recommendations.generate(this.studentProfile, this.selectedCourse, this.scoringResults);
    }

    const reportHTML = Report.renderReportHTML(
      this.studentProfile,
      this.selectedCourse,
      this.scoringResults,
      this.recommendations,
      this.includeNotesInReport
    );

    reportContainer.innerHTML = reportHTML;
  },

  /**
   * Renders Step 10 Counsellor Action Checklist.
   */
  renderActionPlanStep() {
    const nameEl = document.getElementById("action-plan-student-name");
    if (nameEl && this.studentProfile) {
      nameEl.textContent = this.studentProfile.studentName;
    }

    const nextActionEl = document.getElementById("action-plan-recommended-action");
    if (nextActionEl && this.recommendations) {
      nextActionEl.textContent = this.recommendations.nextAction;
    }
  },

  /**
   * Saves current wizard state to LocalStorage draft.
   */
  saveState() {
    try {
      const key = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
        ? CONFIG.STORAGE_KEYS.DRAFT_ASSESSMENT
        : "goalfinity_assessment_draft";

      const data = {
        currentStep: this.currentStep,
        selectedCourse: this.selectedCourse,
        studentProfile: this.studentProfile,
        answers: this.answers,
        practicalQuizAnswers: this.practicalQuizAnswers,
        rubricScore: this.rubricScore,
        counsellorNotes: this.counsellorNotes,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // Storage unavailable
    }
  },

  /**
   * Resets wizard to start a fresh assessment.
   */
  resetWizard() {
    const key = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS)
      ? CONFIG.STORAGE_KEYS.DRAFT_ASSESSMENT
      : "goalfinity_assessment_draft";
    localStorage.removeItem(key);

    this.currentStep = 1;
    this.studentProfile = null;
    this.answers = {};
    this.practicalQuizAnswers = {};
    this.rubricScore = 3;
    this.counsellorNotes = "";
    this.scoringResults = null;
    this.recommendations = null;

    window.location.reload();
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = AssessmentController;
} else {
  window.AssessmentController = AssessmentController;
}
