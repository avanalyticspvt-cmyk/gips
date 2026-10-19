/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Dynamic 4-Page Student Career Readiness Report Generator
 */

const Report = {
  /**
   * Generates and renders the complete 4-page report into the DOM container.
   *
   * @param {Object} studentProfile - Intake fields (name, email, phone, etc.)
   * @param {string} courseId - 'ai' | 'digital_marketing' | 'cloud_computing'
   * @param {Object} scoringResults - Output from Scoring.calculateAssessment()
   * @param {Object} recommendations - Output from Recommendations.generate()
   * @param {boolean} includeCounsellorNotes - Whether to display counsellor notes on report
   * @returns {string} Complete HTML string for the 4-page report
   */
  renderReportHTML(studentProfile, courseId, scoringResults, recommendations, includeCounsellorNotes = false) {
    const brand = typeof CONFIG !== "undefined" ? CONFIG.INSTITUTION_NAME : "Goalfinity Institute";
    const tagline = typeof CONFIG !== "undefined" ? CONFIG.TAGLINE : "Discover Your Skills. Build Your Future.";
    const courseConfig = (typeof CONFIG !== "undefined" && CONFIG.COURSES && CONFIG.COURSES[courseId.toUpperCase()])
      ? CONFIG.COURSES[courseId.toUpperCase()]
      : { title: recommendations.courseTitle || courseId, accentColor: "#028090" };

    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const overallScore = scoringResults.overallScore || 0;
    const band = scoringResults.band || { label: "Developing", color: "#3a86ff", description: "" };

    // Format category bars
    const catScores = scoringResults.categoryScores || {};
    const categoriesMeta = [
      { key: "foundational", label: "Foundational Knowledge", weight: "30%" },
      { key: "practical", label: "Practical Reasoning & Application", weight: "30%" },
      { key: "careerClarity", label: "Career Goal Clarity & Direction", weight: "15%" },
      { key: "learningReadiness", label: "Learning Readiness & Discipline", weight: "15%" },
      { key: "professionalReadiness", label: "Professional & Communication Readiness", weight: "10%" }
    ];

    const categoryBarsHTML = categoriesMeta.map(cat => {
      const data = catScores[cat.key] || { percentage: 0, earned: 0, max: 0 };
      const pct = data.percentage || 0;
      let barColor = "#028090";
      if (pct < 40) barColor = "#e76f51";
      else if (pct < 70) barColor = "#f4a261";
      else barColor = "#2a9d8f";

      return `
        <div class="report-metric-row">
          <div class="metric-header">
            <span class="metric-name"><strong>${cat.label}</strong> <small class="text-muted">(Weight: ${cat.weight})</small></span>
            <span class="metric-val"><strong>${pct}%</strong></span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%; background-color: ${barColor};"></div>
          </div>
        </div>
      `;
    }).join("");

    // Strengths HTML
    const strengthsHTML = (scoringResults.strengths && scoringResults.strengths.length > 0)
      ? scoringResults.strengths.map(s => `
        <li class="strength-item">
          <strong>${s.area}:</strong> ${s.evidence}
        </li>
      `).join("")
      : `<li class="text-muted">Assessment indicated foundational readiness across tested concepts.</li>`;

    // Skill Gaps HTML
    const gapsHTML = (scoringResults.skillGaps && scoringResults.skillGaps.length > 0)
      ? scoringResults.skillGaps.map(g => `
        <li class="gap-item">
          <span class="priority-tag priority-${g.priority ? g.priority.toLowerCase() : 'medium'}">${g.priority || 'Priority'}</span>
          <strong>${g.area}:</strong> ${g.evidence}
        </li>
      `).join("")
      : `<li class="text-muted">No significant concept gaps identified in initial evaluation.</li>`;

    // Priority Modules HTML
    const modulesHTML = (recommendations.startingModules || []).map(m => `
      <div class="module-card">
        <span class="module-code">${m.code}</span>
        <div class="module-content">
          <h4>${m.title}</h4>
          <span class="module-duration"><i class="icon-clock"></i> Est. Duration: ${m.duration}</span>
        </div>
      </div>
    `).join("");

    // Learning Sequence HTML
    const sequenceHTML = (recommendations.learningSequence || []).map((step, idx) => `
      <div class="sequence-step">
        <div class="sequence-num">${idx + 1}</div>
        <div class="sequence-info">
          <h5>${step.phase}</h5>
          <p>${step.focus}</p>
        </div>
      </div>
    `).join("");

    // Portfolio Projects HTML
    const projectsHTML = (recommendations.portfolioProjects || []).map(p => `
      <div class="project-card">
        <h4>${p.title}</h4>
        <p class="project-desc">${p.description}</p>
        <p class="project-skills"><strong>Competencies Demonstrated:</strong> ${p.skillsDemonstrated}</p>
      </div>
    `).join("");

    // Target Job Roles HTML
    const rolesHTML = (recommendations.targetJobRoles || []).map(r => `
      <div class="job-role-badge">
        <div class="role-title"><strong>${r.title}</strong></div>
        <div class="role-meta">Indicative Range: ${r.salaryIndicative} &bull; Market Demand: <span class="demand-pill">${r.demand}</span></div>
      </div>
    `).join("");

    // Support Pillars HTML
    const supportHTML = (recommendations.goalfinitySupport || []).map(sup => `
      <div class="support-pillar">
        <h4>&check; ${sup.pillar}</h4>
        <p>${sup.description}</p>
      </div>
    `).join("");

    // Optional Counsellor Notes
    const counsellorNotesSection = (includeCounsellorNotes && scoringResults.counsellorNotes) ? `
      <div class="report-box counsellor-notes-box">
        <h3>Academic Counsellor Observations</h3>
        <p class="counsellor-text">${scoringResults.counsellorNotes}</p>
      </div>
    ` : "";

    return `
      <div class="report-document" id="printable-report">

        <!-- ========================================================= -->
        <!-- PAGE 1: STUDENT OVERVIEW & READINESS SUMMARY              -->
        <!-- ========================================================= -->
        <section class="report-page page-1">
          <header class="report-header">
            <div class="brand-block">
              <h1 class="brand-title">${brand}</h1>
              <p class="brand-tagline">${tagline}</p>
            </div>
            <div class="report-meta-block">
              <span class="report-badge">STUDENT CAREER READINESS REPORT</span>
              <p class="meta-line"><strong>Assessment ID:</strong> ${studentProfile.assessmentId || "GF-ASSESSMENT"}</p>
              <p class="meta-line"><strong>Evaluation Date:</strong> ${formattedDate}</p>
            </div>
          </header>

          <div class="report-student-card">
            <div class="student-info-grid">
              <div>
                <span class="info-label">Candidate Full Name</span>
                <span class="info-val candidate-name">${studentProfile.studentName || "Prospective Student"}</span>
              </div>
              <div>
                <span class="info-label">Email Address</span>
                <span class="info-val">${studentProfile.studentEmail || "—"}</span>
              </div>
              <div>
                <span class="info-label">Contact Number</span>
                <span class="info-val">${studentProfile.studentMobile || "—"}</span>
              </div>
              <div>
                <span class="info-label">Assessed Course Track</span>
                <span class="info-val course-highlight">${courseConfig.title || recommendations.courseTitle}</span>
              </div>
              <div>
                <span class="info-label">Current Academic / Career Status</span>
                <span class="info-val">${(studentProfile.currentStatus || "Studying").replace(/_/g, " ")} (${studentProfile.experienceYears || "0"} yrs exp)</span>
              </div>
              <div>
                <span class="info-label">Educational Qualification</span>
                <span class="info-val">${studentProfile.education || "Bachelor's"} ${studentProfile.specialization ? '— ' + studentProfile.specialization : ''}</span>
              </div>
            </div>
          </div>

          <div class="score-summary-container">
            <div class="overall-score-card" style="border-top-color: ${band.color};">
              <div class="score-dial">
                <span class="score-number">${overallScore}</span>
                <span class="score-max">/ 100</span>
              </div>
              <div class="score-badge-wrap">
                <span class="readiness-pill" style="background-color: ${band.color}; color: #ffffff;">
                  ${band.label}
                </span>
                <p class="band-description">${band.description}</p>
              </div>
            </div>

            <div class="level-recommendation-card">
              <h3>Recommended Curriculum Onboarding</h3>
              <div class="starting-level-badge">
                <span class="level-tag">${recommendations.startingLevel.badge}</span>
                <h4>${recommendations.startingLevel.title}</h4>
              </div>
              <p class="level-desc">${recommendations.startingLevel.description}</p>
              <div class="timeline-meta">
                <strong>Projected Completion:</strong> ${recommendations.paceDescription}
              </div>
            </div>
          </div>

          <div class="executive-summary-box">
            <h3>Executive Evaluation Summary</h3>
            <p>
              This Career Readiness Assessment evaluates <strong>${studentProfile.studentName}</strong>'s current foundational knowledge, practical analytical reasoning, and career preparedness for the <strong>${courseConfig.title}</strong> curriculum. Based on the assessed score of <strong>${overallScore}/100</strong>, the candidate is classified in the <strong>${band.label}</strong> guidance band.
            </p>
          </div>

          <footer class="report-footer">
            <span>Goalfinity Institute &bull; Career Readiness Evaluation</span>
            <span class="page-number">Page 1 of 4</span>
          </footer>
        </section>

        <!-- ========================================================= -->
        <!-- PAGE 2: SKILLS ASSESSMENT & GAP ANALYSIS                  -->
        <!-- ========================================================= -->
        <section class="report-page page-2">
          <header class="report-header-sub">
            <span class="header-brand">${brand}</span>
            <span class="header-doc">Skills Diagnostic & Gap Analysis &bull; ${studentProfile.assessmentId}</span>
          </header>

          <h2 class="section-title">Comprehensive Skills Assessment</h2>
          <p class="section-subtitle">Evaluated breakdown across the 5 core career readiness dimensions:</p>

          <div class="category-bars-container">
            ${categoryBarsHTML}
          </div>

          <div class="competency-columns">
            <div class="competency-box strengths-box">
              <h3><span class="check-icon">&check;</span> Verified Strengths & Aptitudes</h3>
              <ul class="evidence-list">
                ${strengthsHTML}
              </ul>
            </div>

            <div class="competency-box gaps-box">
              <h3><span class="gap-icon">&excl;</span> Priority Skill Gaps to Bridge</h3>
              <ul class="evidence-list">
                ${gapsHTML}
              </ul>
            </div>
          </div>

          <div class="practical-results-box">
            <h3>Practical Aptitude & Reasoning Performance</h3>
            <div class="practical-stats-row">
              <div class="stat-item">
                <span class="stat-number">${scoringResults.practicalQuiz.correct} / ${scoringResults.practicalQuiz.total}</span>
                <span class="stat-label">MCQ Benchmark Questions Correct</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${scoringResults.practicalQuiz.percentage}%</span>
                <span class="stat-label">Scenario Accuracy Rate</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">Verified</span>
                <span class="stat-label">Analytical Rubric Evaluated</span>
              </div>
            </div>
          </div>

          <footer class="report-footer">
            <span>Goalfinity Institute &bull; Skills Diagnostic</span>
            <span class="page-number">Page 2 of 4</span>
          </footer>
        </section>

        <!-- ========================================================= -->
        <!-- PAGE 3: PERSONALIZED LEARNING ROADMAP                     -->
        <!-- ========================================================= -->
        <section class="report-page page-3">
          <header class="report-header-sub">
            <span class="header-brand">${brand}</span>
            <span class="header-doc">Personalized Learning Roadmap &bull; ${studentProfile.assessmentId}</span>
          </header>

          <h2 class="section-title">Personalized Learning Pathway</h2>
          <p class="section-subtitle">Customized progression tailored to ${studentProfile.studentName}'s diagnosed starting point and learning commitment (${recommendations.paceDescription}):</p>

          <div class="roadmap-section">
            <h3>Priority Starting Modules</h3>
            <div class="modules-grid">
              ${modulesHTML}
            </div>
          </div>

          <div class="roadmap-section">
            <h3>Curriculum Learning Sequence</h3>
            <div class="sequence-list">
              ${sequenceHTML}
            </div>
          </div>

          <div class="roadmap-section">
            <h3>Curated Capstone Portfolio Projects</h3>
            <p class="roadmap-note">These projects will form the core verifiable evidence for prospective employer reviews:</p>
            <div class="projects-container">
              ${projectsHTML}
            </div>
          </div>

          <footer class="report-footer">
            <span>Goalfinity Institute &bull; Learning Roadmap</span>
            <span class="page-number">Page 3 of 4</span>
          </footer>
        </section>

        <!-- ========================================================= -->
        <!-- PAGE 4: CAREER PATHWAY & GOALFINITY SUPPORT               -->
        <!-- ========================================================= -->
        <section class="report-page page-4">
          <header class="report-header-sub">
            <span class="header-brand">${brand}</span>
            <span class="header-doc">Career Pathway & Academic Support &bull; ${studentProfile.assessmentId}</span>
          </header>

          <h2 class="section-title">Career Pathway & Industry Alignment</h2>
          <p class="section-subtitle">Target roles, career preparation milestones, and structured institutional support:</p>

          <div class="roles-section">
            <h3>Target Job Roles to Explore</h3>
            <div class="job-roles-grid">
              ${rolesHTML}
            </div>
          </div>

          <div class="support-section">
            <h3>How Goalfinity Institute Supports Your Journey</h3>
            <div class="support-pillars-grid">
              ${supportHTML}
            </div>
          </div>

          <div class="action-plan-box">
            <h3>Recommended Academic Counselling Next Step</h3>
            <p class="action-highlight"><strong>${recommendations.nextAction}</strong></p>
          </div>

          ${counsellorNotesSection}

          <div class="disclaimer-box">
            <h4>Institutional & Legal Advisory Notice</h4>
            <p>${recommendations.disclaimer}</p>
          </div>

          <footer class="report-footer">
            <span>Goalfinity Institute &bull; Official Student Career Diagnostic</span>
            <span class="page-number">Page 4 of 4</span>
          </footer>
        </section>

      </div>
    `;
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = Report;
} else {
  window.Report = Report;
}
