/**
 * Goalfinity Institute — Assessment Platform
 * Unit Test Suite: Scoring Engine & Guidance Bands
 */

const ScoringModule = (typeof Scoring !== "undefined")
  ? Scoring
  : (typeof require !== "undefined" ? require("../assets/js/scoring.js") : null);

const ConfigModule = (typeof CONFIG !== "undefined")
  ? CONFIG
  : (typeof require !== "undefined" ? require("../assets/js/config.js") : null);

function runScoringTests(assert) {
  assert.suite("Scoring Engine & Math Verification");

  // 1. Scoring Weights Verification
  assert.test("Category weights sum exactly to 1.0 (100%)", () => {
    const weights = ConfigModule.SCORING_WEIGHTS;
    const sum = weights.foundational + weights.practical + weights.careerClarity + weights.learningReadiness + weights.professionalReadiness;
    assert.ok(Math.abs(sum - 1.0) < 0.0001, `Weights sum must equal 1.0, got ${sum}`);
  });

  // 2. High-Performance Candidate Evaluation (Strong Readiness: 80-100)
  assert.test("Calculates Strong Readiness band for high-aptitude AI candidate", () => {
    const aiResponses = {
      cb_motivation: "upskilling_current",
      cb_prior_experience: "substantial",
      cb_primary_goal: "career_switch",
      cb_target_role: "Machine Learning Engineer",
      cb_target_timeline: "3_months",
      cb_internship_openness: "highly_open",
      cr_digital_literacy: "5",
      cr_english_communication: "5",
      cr_problem_solving: "5",
      cr_practical_work: "yes_independent",
      cr_weekly_hours: "15_to_20",
      ai_q1_chatgpt: "advanced",
      ai_q2_python: "advanced",
      ai_q3_math: "5",
      ai_q4_data: "advanced",
      ai_q5_ml_concept: "correct",
      ai_q6_prior_project: "deployed",
      ai_q7_churn_scenario: "comprehensive",
      ai_q8_specialization: "ml_data_science"
    };

    const practicalQuizAnswers = { pq_ai_1: 1, pq_ai_2: 1, pq_ai_3: 1 }; // All correct
    const result = ScoringModule.calculateAssessment(aiResponses, "ai", practicalQuizAnswers, 5, "Strong candidate");

    assert.ok(result.overallScore >= 80, `Expected score >= 80, got ${result.overallScore}`);
    assert.strictEqual(result.band.key, "strong");
    assert.strictEqual(result.band.label, "Strong Assessed Readiness");
    assert.ok(result.strengths.length > 0, "Must identify candidate strengths");
  });

  // 3. Beginner Candidate Evaluation (Foundation-Building: 0-39)
  assert.test("Calculates Foundation-Building band for complete beginner candidate", () => {
    const beginnerResponses = {
      cb_motivation: "curiosity_exploration",
      cb_prior_experience: "none",
      cb_primary_goal: "exploring",
      cb_target_role: "Explorer",
      cb_target_timeline: "flexible",
      cb_internship_openness: "freelance_remote",
      cr_digital_literacy: "1",
      cr_english_communication: "2",
      cr_problem_solving: "2",
      cr_practical_work: "no_projects",
      cr_weekly_hours: "less_than_5",
      cloud_q1_academic_background: "complete_beginner",
      cloud_q2_server_concept: "incorrect",
      cloud_q3_linux: "none",
      cloud_q4_ip_networking: "incorrect",
      cloud_q5_cloud_providers: "none",
      cloud_q6_storage_types: "incorrect",
      cloud_q7_deployments: "never",
      cloud_q8_specialization: "cloud_support"
    };

    const practicalQuizAnswers = { pq_cloud_1: 0, pq_cloud_2: 0, pq_cloud_3: 0 }; // Incorrect
    const result = ScoringModule.calculateAssessment(beginnerResponses, "cloud_computing", practicalQuizAnswers, 1, "Early stage beginner");

    assert.ok(result.overallScore <= 39, `Expected score <= 39, got ${result.overallScore}`);
    assert.strictEqual(result.band.key, "foundation");
    assert.strictEqual(result.band.label, "Foundation-Building Stage");
    assert.ok(result.skillGaps.length > 0, "Must identify priority skill gaps");
  });

  // 4. "Not Sure" Handling
  assert.test("Handles 'Not sure' responses explicitly without crashing or zero-faulting", () => {
    const mixedResponses = {
      cb_motivation: "career_switch",
      cb_prior_experience: "moderate",
      cb_primary_goal: "first_job",
      cb_target_role: "SEO Associate",
      cb_target_timeline: "6_months",
      cb_internship_openness: "fulltime_preferred",
      cr_digital_literacy: "not_sure",
      cr_english_communication: "3",
      cr_problem_solving: "not_sure",
      cr_practical_work: "not_sure",
      cr_weekly_hours: "10_to_15",
      dm_q1_social_presence: "personal_creator",
      dm_q2_organic_vs_paid: "correct",
      dm_q3_channel_awareness: "social_meta",
      dm_q4_copywriting: "not_sure",
      dm_q5_local_cafe_scenario: "multichannel_local",
      dm_q6_click_psychology: "relevance_value",
      dm_q7_analytics: "theoretical",
      dm_q8_specialization: "performance_paid"
    };

    const result = ScoringModule.calculateAssessment(mixedResponses, "digital_marketing", {}, 3, "Mixed candidate");

    assert.ok(result.overallScore > 0, "Score should be calculated fairly");
    // Check that skill gaps include the 'not_sure' items
    const hasNotSureGaps = result.skillGaps.some(g => g.evidence.includes("uncertainty") || g.evidence.includes("Opportunity"));
    assert.ok(hasNotSureGaps, "Should flag uncertainty items as opportunities for development");
  });

  // 5. Optional Question Handling (No penalty if skipped)
  assert.test("Omitted optional salary expectation does not penalize score", () => {
    const baseResponses = {
      cb_motivation: "first_job",
      cb_prior_experience: "moderate",
      cb_primary_goal: "first_job",
      cb_target_role: "Associate",
      cb_target_timeline: "3_months",
      cb_internship_openness: "highly_open",
      cr_digital_literacy: "3",
      cr_english_communication: "3",
      cr_problem_solving: "3",
      cr_practical_work: "yes_guided",
      cr_weekly_hours: "10_to_15"
    };

    const resWithoutSalary = ScoringModule.calculateAssessment({ ...baseResponses, cb_salary_expectation: "prefer_not_to_say" }, "ai", {}, 3);
    const resWithoutField = ScoringModule.calculateAssessment(baseResponses, "ai", {}, 3);

    assert.strictEqual(resWithoutSalary.overallScore, resWithoutField.overallScore, "Score must remain equal whether prefer_not_to_say or omitted");
  });
}

// Export for Node/Browser runners
if (typeof module !== "undefined" && module.exports) {
  module.exports = runScoringTests;
}
