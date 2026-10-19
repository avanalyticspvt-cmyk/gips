/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Transparent Assessment & Scoring Engine
 *
 * Weightings:
 * - Foundational Knowledge: 30%
 * - Practical Skills: 30%
 * - Career Goal Clarity: 15%
 * - Learning Readiness: 15%
 * - Professional Readiness: 10%
 *
 * Guidance Bands:
 * - 0–39: Foundation-Building Stage
 * - 40–59: Developing
 * - 60–79: Progressing
 * - 80–100: Strong Assessed Readiness
 */

// Handle Node/browser environments
const _CONFIG = (typeof CONFIG !== "undefined") ? CONFIG : (typeof require !== "undefined" ? require("./config.js") : null);

const Scoring = {
  /**
   * Calculates scores, bands, strengths, and gaps from all assessment responses.
   *
   * @param {Object} responses - Key-value map of question IDs to answer values.
   * @param {string} courseId - 'ai' | 'digital_marketing' | 'cloud_computing'
   * @param {Object} practicalQuizAnswers - Key-value map of practical quiz question IDs to selected option index.
   * @param {number} rubricScore - Counsellor-assigned score (1-5) for practical scenario.
   * @param {string} counsellorNotes - Free-form counsellor notes.
   * @returns {Object} Comprehensive calculation result.
   */
  calculateAssessment(responses = {}, courseId, practicalQuizAnswers = {}, rubricScore = 3, counsellorNotes = "") {
    const weights = _CONFIG ? _CONFIG.SCORING_WEIGHTS : {
      foundational: 0.30,
      practical: 0.30,
      careerClarity: 0.15,
      learningReadiness: 0.15,
      professionalReadiness: 0.10
    };

    // Category tally accumulators: earned and max points
    const categoryTotals = {
      foundational: { earned: 0, max: 0, items: [] },
      practical: { earned: 0, max: 0, items: [] },
      careerClarity: { earned: 0, max: 0, items: [] },
      learningReadiness: { earned: 0, max: 0, items: [] },
      professionalReadiness: { earned: 0, max: 0, items: [] }
    };

    const auditTrail = [];
    const strengths = [];
    const skillGaps = [];

    // Helper to record an evaluated question item
    const recordItem = (category, qId, qText, answerValue, answerDisplay, earned, max, method, evidence) => {
      if (max <= 0) return; // Skip non-scored or omitted optional questions
      categoryTotals[category].earned += earned;
      categoryTotals[category].max += max;
      categoryTotals[category].items.push({ qId, earned, max });

      auditTrail.push({
        questionId: qId,
        category: category,
        questionText: qText,
        studentResponse: answerDisplay || String(answerValue),
        score: earned,
        maxScore: max,
        scoringMethod: method,
        evidenceNotes: evidence || ""
      });

      // Classify as strength or skill gap based on performance ratio
      const ratio = earned / max;
      if (ratio >= 0.8) {
        strengths.push({
          category,
          questionId: qId,
          area: qText,
          evidence: evidence || `Demonstrated strong aptitude (${earned}/${max} points) in ${answerDisplay || answerValue}.`
        });
      } else if (ratio <= 0.4 || answerValue === "not_sure" || answerValue === "none") {
        skillGaps.push({
          category,
          questionId: qId,
          area: qText,
          priority: ratio <= 0.25 ? "High" : "Medium",
          evidence: evidence || `Opportunity for skill development (${earned}/${max} points). Response: ${answerDisplay || answerValue}.`
        });
      }
    };

    // 1. Process Common Background Questions
    if (responses.cb_motivation) {
      const val = responses.cb_motivation;
      const weightMap = {
        upskilling_current: 5,
        career_switch: 4,
        first_job: 4,
        freelancing_agency: 4,
        curiosity_exploration: 3
      };
      const earned = weightMap[val] || 3;
      recordItem(
        "careerClarity",
        "cb_motivation",
        "Course Motivation",
        val,
        val.replace(/_/g, " "),
        earned,
        5,
        "weighted_select",
        `Clear motivation identified: ${val.replace(/_/g, " ")}.`
      );
    }

    if (responses.cb_prior_experience) {
      const val = responses.cb_prior_experience;
      const weightMap = { substantial: 5, moderate: 3, minimal: 2, none: 1 };
      const earned = weightMap[val] || 1;
      recordItem(
        "professionalReadiness",
        "cb_prior_experience",
        "Prior Relevant Work & Projects",
        val,
        val,
        earned,
        5,
        "rubric_tier",
        earned >= 3 ? "Has prior exposure through projects or coursework." : "Requires initial foundational orientation."
      );
    }

    if (responses.cb_primary_goal) {
      const val = responses.cb_primary_goal;
      const weightMap = { first_job: 5, career_switch: 5, promotion: 4, freelancing: 4, business: 4, exploring: 3 };
      const earned = weightMap[val] || 3;
      recordItem(
        "careerClarity",
        "cb_primary_goal",
        "Primary Career Goal",
        val,
        val.replace(/_/g, " "),
        earned,
        5,
        "weighted_select",
        `Targeting ${val.replace(/_/g, " ")} within 6-12 months.`
      );
    }

    if (responses.cb_target_role) {
      const val = String(responses.cb_target_role).trim();
      const earned = val.length > 2 ? 4 : 2;
      recordItem(
        "careerClarity",
        "cb_target_role",
        "Target Job Role",
        val,
        val,
        earned,
        5,
        "free_text_clarity",
        val.length > 2 ? `Specific role targeted: "${val}".` : "Role target is broad or undefined."
      );
    }

    if (responses.cb_target_timeline) {
      const val = responses.cb_target_timeline;
      const weightMap = { "3_months": 5, "6_months": 5, immediate: 4, flexible: 3 };
      const earned = weightMap[val] || 3;
      recordItem(
        "careerClarity",
        "cb_target_timeline",
        "Target Timeline",
        val,
        val,
        earned,
        5,
        "weighted_select",
        `Job search timeline: ${val}.`
      );
    }

    // Optional salary question: only scored if candidate disclosed; skips without penalty if prefer not to say
    if (responses.cb_salary_expectation && responses.cb_salary_expectation !== "prefer_not_to_say") {
      recordItem(
        "careerClarity",
        "cb_salary_expectation",
        "Salary Expectation Realism",
        responses.cb_salary_expectation,
        responses.cb_salary_expectation,
        4,
        4,
        "optional_context",
        "Disclosed salary expectations for counselling alignment."
      );
    }

    if (responses.cb_internship_openness) {
      const val = responses.cb_internship_openness;
      const weightMap = { highly_open: 5, fulltime_preferred: 4, fulltime_only: 3, freelance_remote: 3 };
      const earned = weightMap[val] || 3;
      recordItem(
        "professionalReadiness",
        "cb_internship_openness",
        "Role Type Flexibility",
        val,
        val.replace(/_/g, " "),
        earned,
        5,
        "weighted_select",
        `Flexibility level: ${val.replace(/_/g, " ")}.`
      );
    }

    // 2. Process Common Learning Readiness (Likert Scale + Hours)
    const processLikert = (category, qId, qText, val) => {
      if (val === undefined || val === null || val === "") return;
      if (val === "not_sure") {
        recordItem(
          category,
          qId,
          qText,
          "not_sure",
          "Not Sure (Needs Evaluation)",
          2,
          5,
          "likert_notsure",
          "Candidate expressed uncertainty on self-rating; requires counsellor verification."
        );
      } else {
        const numVal = Math.min(5, Math.max(1, parseInt(val, 10) || 1));
        recordItem(
          category,
          qId,
          qText,
          numVal,
          `${numVal}/5`,
          numVal,
          5,
          "likert_scale",
          `Self-assessed comfort level: ${numVal} out of 5.`
        );
      }
    };

    processLikert("learningReadiness", "cr_digital_literacy", "Computer & Digital Literacy", responses.cr_digital_literacy);
    processLikert("professionalReadiness", "cr_english_communication", "Professional English Communication", responses.cr_english_communication);
    processLikert("learningReadiness", "cr_problem_solving", "Logical Thinking & Problem Solving", responses.cr_problem_solving);

    if (responses.cr_practical_work) {
      const val = responses.cr_practical_work;
      const weightMap = { yes_independent: 5, yes_guided: 3, in_progress: 2, no_projects: 1, not_sure: 2 };
      const earned = weightMap[val] || 1;
      recordItem(
        "practical",
        "cr_practical_work",
        "Independent Practical Project Experience",
        val,
        val.replace(/_/g, " "),
        earned,
        5,
        "rubric_tier",
        earned >= 3 ? "Has completed hands-on project deliverables." : "Needs step-by-step guidance to build first portfolio piece."
      );
    }

    if (responses.cr_weekly_hours) {
      const val = responses.cr_weekly_hours;
      const weightMap = { more_than_20: 5, "15_to_20": 5, "10_to_15": 4, "5_to_10": 3, less_than_5: 1 };
      const earned = weightMap[val] || 2;
      recordItem(
        "learningReadiness",
        "cr_weekly_hours",
        "Weekly Study Time Commitment",
        val,
        val.replace(/_/g, " "),
        earned,
        5,
        "time_commitment",
        `Committed to ${val.replace(/_/g, " ")} hours weekly.`
      );
    }

    // 3. Process Course-Specific Questions
    if (courseId === "ai") {
      // AI Q1: ChatGPT tool usage
      if (responses.ai_q1_chatgpt) {
        const map = { advanced: 5, intermediate: 4, basic: 2, none: 1 };
        const e = map[responses.ai_q1_chatgpt] || 1;
        recordItem("foundational", "ai_q1_chatgpt", "AI Tool Usage & Prompting", responses.ai_q1_chatgpt, responses.ai_q1_chatgpt, e, 5, "rubric_tier", "Evaluation of current Generative AI tooling experience.");
      }
      // AI Q2: Python code
      if (responses.ai_q2_python) {
        const map = { advanced: 5, intermediate: 4, beginner: 2, none: 1 };
        const e = map[responses.ai_q2_python] || 1;
        recordItem("foundational", "ai_q2_python", "Python & Programming Foundations", responses.ai_q2_python, responses.ai_q2_python, e, 5, "rubric_tier", "Assessment of coding fluency and readiness for ML development.");
      }
      // AI Q3: Math
      processLikert("foundational", "ai_q3_math", "Mathematics & Statistics Readiness", responses.ai_q3_math);
      // AI Q4: Data experience
      if (responses.ai_q4_data) {
        const map = { advanced: 5, intermediate: 4, basic: 2, none: 1 };
        const e = map[responses.ai_q4_data] || 1;
        recordItem("foundational", "ai_q4_data", "Data Literacy & Datasets", responses.ai_q4_data, responses.ai_q4_data, e, 5, "rubric_tier", "Data manipulation skills in Excel, SQL, or Pandas.");
      }
      // AI Q5: ML concept
      if (responses.ai_q5_ml_concept) {
        const isCorrect = responses.ai_q5_ml_concept === "correct";
        recordItem("foundational", "ai_q5_ml_concept", "Programming vs Machine Learning Concept", responses.ai_q5_ml_concept, responses.ai_q5_ml_concept, isCorrect ? 5 : 1, 5, "objective_mcq", isCorrect ? "Understands that ML algorithms induce rules from data." : "Conceptual gap in how ML differs from explicit rule-based code.");
      }
      // AI Q6: Prior AI Project
      if (responses.ai_q6_prior_project) {
        const map = { deployed: 5, guided_lab: 3, planned: 2, none: 1 };
        const e = map[responses.ai_q6_prior_project] || 1;
        recordItem("practical", "ai_q6_prior_project", "Prior AI Project Build", responses.ai_q6_prior_project, responses.ai_q6_prior_project, e, 5, "rubric_tier", "Hands-on model building experience.");
      }
      // AI Q7: Churn scenario
      if (responses.ai_q7_churn_scenario) {
        const isCorrect = responses.ai_q7_churn_scenario === "comprehensive";
        recordItem("practical", "ai_q7_churn_scenario", "Customer Churn Feature Engineering Scenario", responses.ai_q7_churn_scenario, responses.ai_q7_churn_scenario, isCorrect ? 5 : 2, 5, "objective_mcq", isCorrect ? "Correctly identified behavioral frequency and support signals for predictive modeling." : "Partial understanding of machine learning feature selection.");
      }
      // AI Q8: Track preference
      if (responses.ai_q8_specialization) {
        recordItem("careerClarity", "ai_q8_specialization", "AI Track Selection", responses.ai_q8_specialization, responses.ai_q8_specialization.replace(/_/g, " "), 5, 5, "interest_mapping", `Preferred AI specialization: ${responses.ai_q8_specialization}.`);
      }
      // AI Practical Scenario Rubric (Evaluated by Counsellor)
      const rubricVal = Math.min(5, Math.max(1, parseInt(rubricScore, 10) || 3));
      recordItem("practical", "ai_practical_scenario", "House Price Prediction Analytical Rubric", rubricVal, `${rubricVal}/5`, rubricVal, 5, "counsellor_rubric", "Counsellor-evaluated analytical reasoning on regression features and algorithmic prediction.");

    } else if (courseId === "digital_marketing") {
      // DM Q1: Social Presence
      if (responses.dm_q1_social_presence) {
        const map = { business_brand: 5, personal_creator: 3, casual_user: 2, none: 1 };
        const e = map[responses.dm_q1_social_presence] || 1;
        recordItem("foundational", "dm_q1_social_presence", "Social & Web Channel Experience", responses.dm_q1_social_presence, responses.dm_q1_social_presence, e, 5, "rubric_tier", "Experience in managing audience-facing digital channels.");
      }
      // DM Q2: Organic vs Paid
      if (responses.dm_q2_organic_vs_paid) {
        const isCorrect = responses.dm_q2_organic_vs_paid === "correct";
        recordItem("foundational", "dm_q2_organic_vs_paid", "Organic vs Paid Marketing Distinction", responses.dm_q2_organic_vs_paid, responses.dm_q2_organic_vs_paid, isCorrect ? 5 : 1, 5, "objective_mcq", isCorrect ? "Clear grasp of compounding inbound reach vs paid media acquisition." : "Needs clarity on the distinction between organic and paid marketing channels.");
      }
      // DM Q3: Channel awareness
      if (responses.dm_q3_channel_awareness) {
        const map = { all_core: 5, social_meta: 3, seo_content: 3, beginner_general: 2 };
        const e = map[responses.dm_q3_channel_awareness] || 2;
        recordItem("foundational", "dm_q3_channel_awareness", "Channel Familiarity (SEO/Ads/Email)", responses.dm_q3_channel_awareness, responses.dm_q3_channel_awareness, e, 5, "rubric_tier", "Breadth of core digital acquisition channel awareness.");
      }
      // DM Q4: Copywriting
      processLikert("foundational", "dm_q4_copywriting", "Copywriting & Content Creation Comfort", responses.dm_q4_copywriting);
      // DM Q5: Local Cafe Scenario
      if (responses.dm_q5_local_cafe_scenario) {
        const isCorrect = responses.dm_q5_local_cafe_scenario === "multichannel_local";
        recordItem("practical", "dm_q5_local_cafe_scenario", "Local Business Geo-Promotion Strategy", responses.dm_q5_local_cafe_scenario, responses.dm_q5_local_cafe_scenario, isCorrect ? 5 : 1, 5, "objective_mcq", isCorrect ? "Accurately applied local SEO, radius-targeted ads, and community partnerships." : "Incorrect marketing distribution tactics for localized retail business.");
      }
      // DM Q6: Ad Click Psychology
      if (responses.dm_q6_click_psychology) {
        const isCorrect = responses.dm_q6_click_psychology === "relevance_value";
        recordItem("foundational", "dm_q6_click_psychology", "Ad Engagement & Hook Psychology", responses.dm_q6_click_psychology, responses.dm_q6_click_psychology, isCorrect ? 5 : 1, 5, "objective_mcq", isCorrect ? "Understands hook, consumer pain points, and call-to-action dynamics." : "Misses psychological triggers behind digital advertising click rates.");
      }
      // DM Q7: Analytics
      if (responses.dm_q7_analytics) {
        const map = { performance_metrics: 5, basic_engagement: 3, theoretical: 2, none: 1 };
        const e = map[responses.dm_q7_analytics] || 1;
        recordItem("practical", "dm_q7_analytics", "Marketing Analytics & Conversion Metrics", responses.dm_q7_analytics, responses.dm_q7_analytics, e, 5, "rubric_tier", "Practical familiarity with ROAS, CAC, CTR, and conversion tracking.");
      }
      // DM Q8: Specialization
      if (responses.dm_q8_specialization) {
        recordItem("careerClarity", "dm_q8_specialization", "Marketing Track Preference", responses.dm_q8_specialization, responses.dm_q8_specialization.replace(/_/g, " "), 5, 5, "interest_mapping", `Preferred marketing focus: ${responses.dm_q8_specialization}.`);
      }
      // DM Practical Scenario Rubric
      const rubricVal = Math.min(5, Math.max(1, parseInt(rubricScore, 10) || 3));
      recordItem("practical", "dm_practical_scenario", "Ad Campaign ROI & Lead Evaluation Rubric", rubricVal, `${rubricVal}/5`, rubricVal, 5, "counsellor_rubric", "Counsellor evaluation of candidate's commercial analysis of CAC, conversion rate, and net ROI.");

    } else if (courseId === "cloud_computing") {
      // Cloud Q1: Background
      if (responses.cloud_q1_academic_background) {
        const map = { cs_degree_pro: 5, tech_diploma: 4, self_taught: 3, complete_beginner: 1 };
        const e = map[responses.cloud_q1_academic_background] || 1;
        recordItem("foundational", "cloud_q1_academic_background", "IT & Networking Foundation", responses.cloud_q1_academic_background, responses.cloud_q1_academic_background, e, 5, "rubric_tier", "Educational and practical IT background.");
      }
      // Cloud Q2: Server concept
      if (responses.cloud_q2_server_concept) {
        const isCorrect = responses.cloud_q2_server_concept === "correct";
        recordItem("foundational", "cloud_q2_server_concept", "Server Fundamentals Concept", responses.cloud_q2_server_concept, responses.cloud_q2_server_concept, isCorrect ? 5 : 1, 5, "objective_mcq", isCorrect ? "Understands client-server computing model and service listening." : "Conceptual gap in server functions and client-server communication.");
      }
      // Cloud Q3: Linux
      if (responses.cloud_q3_linux) {
        const map = { advanced: 5, intermediate: 3, beginner: 2, none: 1 };
        const e = map[responses.cloud_q3_linux] || 1;
        recordItem("foundational", "cloud_q3_linux", "Linux & Terminal Fluency", responses.cloud_q3_linux, responses.cloud_q3_linux, e, 5, "rubric_tier", "Command line proficiency essential for cloud infrastructure operations.");
      }
      // Cloud Q4: IP Networking
      if (responses.cloud_q4_ip_networking) {
        const isCorrect = responses.cloud_q4_ip_networking === "correct";
        recordItem("foundational", "cloud_q4_ip_networking", "Public vs Private IP Routing", responses.cloud_q4_ip_networking, responses.cloud_q4_ip_networking, isCorrect ? 5 : 1, 5, "objective_mcq", isCorrect ? "Clear understanding of internet-routable vs internal VPC addressing." : "Confusion regarding networking IP allocations.");
      }
      // Cloud Q5: Cloud Providers
      if (responses.cloud_q5_cloud_providers) {
        const map = { provisioned_infra: 5, free_tier_toured: 3, read_overview: 2, none: 1 };
        const e = map[responses.cloud_q5_cloud_providers] || 1;
        recordItem("foundational", "cloud_q5_cloud_providers", "AWS / Azure / GCP Exposure", responses.cloud_q5_cloud_providers, responses.cloud_q5_cloud_providers, e, 5, "rubric_tier", "Direct hands-on experience inside major cloud management consoles.");
      }
      // Cloud Q6: Storage
      if (responses.cloud_q6_storage_types) {
        const isCorrect = responses.cloud_q6_storage_types === "correct";
        recordItem("foundational", "cloud_q6_storage_types", "Object Storage & Cloud Durability", responses.cloud_q6_storage_types, responses.cloud_q6_storage_types, isCorrect ? 5 : 1, 5, "objective_mcq", isCorrect ? "Understands elastic scale, cross-AZ durability, and decoupled storage." : "Unfamiliar with benefits of cloud object storage (S3/Blob).");
      }
      // Cloud Q7: Deployments
      if (responses.cloud_q7_deployments) {
        const map = { automated_cloud: 5, managed_hosting: 3, local_only: 2, never: 1 };
        const e = map[responses.cloud_q7_deployments] || 1;
        recordItem("practical", "cloud_q7_deployments", "Server & Application Deployment", responses.cloud_q7_deployments, responses.cloud_q7_deployments, e, 5, "rubric_tier", "Practical deployment experience on remote systems.");
      }
      // Cloud Q8: Specialization
      if (responses.cloud_q8_specialization) {
        recordItem("careerClarity", "cloud_q8_specialization", "Cloud Role Specialization", responses.cloud_q8_specialization, responses.cloud_q8_specialization.replace(/_/g, " "), 5, 5, "interest_mapping", `Preferred cloud career track: ${responses.cloud_q8_specialization}.`);
      }
      // Cloud Practical Scenario Rubric
      const rubricVal = Math.min(5, Math.max(1, parseInt(rubricScore, 10) || 3));
      recordItem("practical", "cloud_practical_scenario", "Server Outage Troubleshooting Sequence Rubric", rubricVal, `${rubricVal}/5`, rubricVal, 5, "counsellor_rubric", "Counsellor evaluation of systematic network, firewall port 80/443, service daemon, and DNS diagnostics.");
    }

    // 4. Process Practical Adaptive Quiz MCQs
    let practicalQuizCorrect = 0;
    let practicalQuizTotal = 0;
    const practicalBank = (_CONFIG && typeof QUESTION_BANK !== "undefined") ? QUESTION_BANK.practicalQuiz[courseId] || [] : [];

    practicalBank.forEach((q) => {
      practicalQuizTotal++;
      const userSelected = practicalQuizAnswers[q.id];
      const isCorrect = userSelected !== undefined && q.options[userSelected] && q.options[userSelected].correct === true;
      const earned = isCorrect ? 5 : 1;
      if (isCorrect) practicalQuizCorrect++;

      recordItem(
        "practical",
        q.id,
        q.questionText,
        userSelected !== undefined ? q.options[userSelected].text : "Unanswered",
        userSelected !== undefined ? q.options[userSelected].text : "Unanswered",
        earned,
        5,
        "practical_mcq_timed",
        isCorrect ? `Correct practical reasoning. ${q.explanation}` : `Incorrect answer selected. ${q.explanation}`
      );
    });

    // 5. Compute Normalized Category Percentages & Weighted Overall Score
    const categoryResults = {};
    let overallScoreWeightedSum = 0;

    for (const [catKey, data] of Object.entries(categoryTotals)) {
      const percentage = data.max > 0 ? Math.round((data.earned / data.max) * 100) : 50;
      const weight = weights[catKey] || 0.2;
      const weightedScore = (percentage * weight);

      categoryResults[catKey] = {
        earned: data.earned,
        max: data.max,
        percentage: percentage,
        weight: weight,
        weightedScore: Math.round(weightedScore * 10) / 10
      };

      overallScoreWeightedSum += weightedScore;
    }

    // Round overall score to clean integer (0-100)
    const overallScore = Math.max(0, Math.min(100, Math.round(overallScoreWeightedSum)));

    // 6. Match Readiness Band
    const bands = _CONFIG ? _CONFIG.READINESS_BANDS : [
      { min: 80, max: 100, key: "strong", label: "Strong Assessed Readiness", color: "#2a9d8f" },
      { min: 60, max: 79, key: "progressing", label: "Progressing Readiness", color: "#3a86ff" },
      { min: 40, max: 59, key: "developing", label: "Developing Readiness", color: "#f4a261" },
      { min: 0, max: 39, key: "foundation", label: "Foundation-Building Stage", color: "#e76f51" }
    ];

    const matchedBand = bands.find(b => overallScore >= b.min && overallScore <= b.max) || bands[bands.length - 1];

    // Deduplicate strengths and gaps
    const uniqueStrengths = [];
    const seenStrengths = new Set();
    strengths.forEach(s => {
      if (!seenStrengths.has(s.area)) {
        seenStrengths.add(s.area);
        uniqueStrengths.push(s);
      }
    });

    const uniqueGaps = [];
    const seenGaps = new Set();
    skillGaps.forEach(g => {
      if (!seenGaps.has(g.area)) {
        seenGaps.add(g.area);
        uniqueGaps.push(g);
      }
    });

    return {
      overallScore: overallScore,
      band: matchedBand,
      categoryScores: categoryResults,
      strengths: uniqueStrengths.slice(0, 5), // Top 5 verified strengths
      skillGaps: uniqueGaps.slice(0, 5),     // Top 5 priority skill gaps
      practicalQuiz: {
        correct: practicalQuizCorrect,
        total: practicalQuizTotal,
        percentage: practicalQuizTotal > 0 ? Math.round((practicalQuizCorrect / practicalQuizTotal) * 100) : 0
      },
      auditTrail: auditTrail,
      counsellorNotes: counsellorNotes,
      calculatedAt: new Date().toISOString()
    };
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = Scoring;
} else {
  window.Scoring = Scoring;
}
