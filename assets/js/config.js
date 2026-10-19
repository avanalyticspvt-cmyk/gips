/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Configuration File
 *
 * Centralized settings for the frontend application, Apps Script endpoint,
 * scoring weightings, readiness bands, and branding metadata.
 */

const CONFIG = {
  // Brand & Institution Metadata
  INSTITUTION_NAME: "Goalfinity Institute",
  TAGLINE: "Discover Your Skills. Build Your Future.",
  APP_VERSION: "1.0.0",
  SCHEMA_VERSION: "1.0.0",
  SUPPORT_EMAIL: "admissions@goalfinity.in",
  COUNSELLING_HOTLINE: "+91 (0) 800-GOAL-EDU",

  // Google Apps Script Web App Deployment URL
  // Replace this URL after deploying google-apps-script/Code.gs as a Web App
  APPS_SCRIPT_WEBAPP_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",

  // Submission timeouts & retries
  NETWORK_TIMEOUT_MS: 15000,
  MAX_RETRY_ATTEMPTS: 2,

  // LocalStorage Keys
  STORAGE_KEYS: {
    DRAFT_ASSESSMENT: "goalfinity_assessment_draft",
    SUBMISSION_QUEUE: "goalfinity_offline_submissions",
    COMPLETED_HISTORY: "goalfinity_completed_assessments"
  },

  // Target Courses
  COURSES: {
    AI: {
      id: "ai",
      title: "Artificial Intelligence (AI)",
      badge: "AI & Machine Learning",
      description: "Foundational & applied AI, Python programming, data analytics, predictive modeling, and generative AI systems.",
      accentColor: "#028090"
    },
    DIGITAL_MARKETING: {
      id: "digital_marketing",
      title: "Digital Marketing",
      badge: "Performance & Growth",
      description: "Modern organic & paid marketing, SEO, Meta & Google Ads, content strategy, campaign analytics, and conversion optimization.",
      accentColor: "#e07a5f"
    },
    CLOUD_COMPUTING: {
      id: "cloud_computing",
      title: "Cloud Computing",
      badge: "Cloud & Infrastructure",
      description: "Cloud architecture, Linux & networking, AWS/Azure administration, virtual compute, storage, security, and DevOps foundations.",
      accentColor: "#3d5a80"
    }
  },

  // Scoring Weights (Total = 100%)
  SCORING_WEIGHTS: {
    foundational: 0.30,   // 30% Foundational knowledge
    practical: 0.30,      // 30% Practical reasoning & hands-on application
    careerClarity: 0.15,  // 15% Career goal clarity & direction
    learningReadiness: 0.15, // 15% Digital comfort, hours & study discipline
    professionalReadiness: 0.10 // 10% Communication, project experience & problem solving
  },

  // Readiness Interpretation Guidance Bands
  // Internal counselling guidance bands, not scientifically validated cutoffs
  READINESS_BANDS: [
    {
      min: 80,
      max: 100,
      key: "strong",
      label: "Strong Assessed Readiness",
      color: "#2a9d8f",
      description: "Demonstrates solid foundational understanding and strong self-direction. Well-positioned for an accelerated, project-intensive learning track."
    },
    {
      min: 60,
      max: 79,
      key: "progressing",
      label: "Progressing Readiness",
      color: "#3a86ff",
      description: "Possesses meaningful baseline aptitude with targeted concept gaps. Recommended for guided pathway with structured hands-on lab mentoring."
    },
    {
      min: 40,
      max: 59,
      key: "developing",
      label: "Developing Readiness",
      color: "#f4a261",
      description: "Clear interest and emerging capabilities, but requires foundational reinforcement in core domain skills before advanced topics."
    },
    {
      min: 0,
      max: 39,
      key: "foundation",
      label: "Foundation-Building Stage",
      color: "#e76f51",
      description: "Early-stage learner or career explorer. Best served by dedicated preparatory bridge modules focusing on fundamental concepts."
    }
  ],

  // 5-Point Likert Scale Reference
  LIKERT_SCALE: {
    1: { label: "Beginner", description: "Needs substantial guidance" },
    2: { label: "Basic", description: "Can perform simple tasks with assistance" },
    3: { label: "Intermediate", description: "Can complete familiar tasks independently" },
    4: { label: "Advanced", description: "Can manage complex tasks with limited assistance" },
    5: { label: "Highly Confident", description: "Can solve unfamiliar problems and explain the approach" }
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
