/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Personalized Learning Roadmap & Course Recommendation Engine
 */

const Recommendations = {
  /**
   * Generates a personalized course roadmap and career recommendation.
   *
   * @param {Object} studentProfile - Intake details (name, education, hours, etc.)
   * @param {string} courseId - 'ai' | 'digital_marketing' | 'cloud_computing'
   * @param {Object} scoringResults - Output of Scoring.calculateAssessment()
   * @returns {Object} Structured recommendation object
   */
  generate(studentProfile = {}, courseId = "ai", scoringResults = {}) {
    const overallScore = scoringResults.overallScore || 50;
    const weeklyHours = studentProfile.weeklyHours || "10_to_15";

    // 1. Determine Recommended Starting Level
    let startingLevel = {
      key: "core",
      title: "Core Curriculum Track",
      badge: "Standard Track",
      description: "Balanced pathway starting from core domain principles and progressing through guided practical labs."
    };

    if (overallScore < 40) {
      startingLevel = {
        key: "foundation",
        title: "Foundation Bridge + Core Track",
        badge: "Guided Foundation",
        description: "Includes a 2–3 week structured preparatory bridge module to establish confident computing, syntax, and conceptual foundations before core coursework."
      };
    } else if (overallScore >= 80) {
      startingLevel = {
        key: "accelerated",
        title: "Accelerated Project Track",
        badge: "Advanced Fast-Track",
        description: "Fast-tracked foundational review with immediate emphasis on advanced capstones, architectural design, and production deployment."
      };
    }

    // 2. Calculate Indicative Timeline based on committed weekly hours
    let timelineWeeks = 20;
    let paceDescription = "Standard pace (20 weeks)";

    switch (weeklyHours) {
      case "more_than_20":
      case "15_to_20":
        timelineWeeks = 14;
        paceDescription = "14 Weeks (Fast-Track Intensive / 15–20+ hrs/wk)";
        break;
      case "10_to_15":
        timelineWeeks = 20;
        paceDescription = "20 Weeks (Balanced Professional Pace / 10–15 hrs/wk)";
        break;
      case "5_to_10":
        timelineWeeks = 28;
        paceDescription = "28 Weeks (Extended Weekend Pace / 5–10 hrs/wk)";
        break;
      default:
        timelineWeeks = 24;
        paceDescription = "24 Weeks (Flexible Schedule)";
    }

    // 3. Course-Specific Curriculum, Modules, Projects, and Job Roles
    let courseData = {};

    if (courseId === "ai") {
      courseData = {
        courseTitle: "Artificial Intelligence (AI) & Machine Learning",
        prioritySkills: [
          "Python programming for data engineering & mathematical manipulation",
          "Exploratory data analysis & feature engineering with Pandas",
          "Supervised & unsupervised machine learning model training",
          "Generative AI, LangChain/LlamaIndex, and LLM application development",
          "Model evaluation, hyperparameter tuning, and API deployment"
        ],
        startingModules: startingLevel.key === "foundation" ? [
          { code: "MOD-00", title: "Bridge: Computational Logic, Git & Python Environment Setup", duration: "2 Weeks" },
          { code: "MOD-01", title: "Python Essentials: Data Structures, Functions & OOP", duration: "3 Weeks" },
          { code: "MOD-02", title: "Applied Mathematics, Linear Algebra & Statistics for AI", duration: "3 Weeks" }
        ] : [
          { code: "MOD-01", title: "Python for Data Science (NumPy, Pandas, Matplotlib)", duration: "2 Weeks" },
          { code: "MOD-02", title: "Applied Statistics, Probability & Feature Engineering", duration: "2 Weeks" },
          { code: "MOD-03", title: "Supervised Learning: Regression, Trees & Ensembles", duration: "3 Weeks" }
        ],
        learningSequence: [
          { phase: "Phase 1: Foundations", focus: "Python syntax, virtual environments, data structures, and statistical intuition." },
          { phase: "Phase 2: Data Wrangling", focus: "Real-world dataset cleaning, exploratory data analysis, and SQL integration." },
          { phase: "Phase 3: Machine Learning", focus: "Scikit-Learn algorithms, cross-validation, feature importance, and metrics." },
          { phase: "Phase 4: Generative AI & Agents", focus: "Prompt chaining, OpenAI/Claude APIs, vector databases, RAG architecture." },
          { phase: "Phase 5: Capstone & MLOps", focus: "Building, containerizing (Docker), and deploying an end-to-end AI application." }
        ],
        portfolioProjects: [
          {
            title: "Predictive Customer Churn Intelligence System",
            description: "Train, evaluate, and tune a gradient boosting model (XGBoost) on telecom user behavior to identify churn risks with an interactive Streamlit dashboard.",
            skillsDemonstrated: "Python, Pandas, Scikit-Learn, Feature Importance, Model Explainability (SHAP)"
          },
          {
            title: "Enterprise Knowledge Base RAG Assistant",
            description: "Build an AI chatbot capable of answering complex inquiries from internal PDFs and manuals using vector embeddings, semantic search, and OpenAI APIs.",
            skillsDemonstrated: "Generative AI, LangChain, ChromaDB/Pinecone, Prompt Engineering, FastAPI"
          },
          {
            title: "Real Estate Valuation & Trend Forecasting Model",
            description: "End-to-end regression pipeline ingesting multi-city property listings, normalizing geographic features, and predicting pricing with statistical error bounds.",
            skillsDemonstrated: "Data Scraping, Feature Engineering, Regression, Docker, REST API Deployment"
          }
        ],
        targetJobRoles: [
          { title: "Junior AI / ML Engineer", salaryIndicative: "₹4.5 – ₹7.5 LPA (~$6K–$10K USD)", demand: "High" },
          { title: "Data Analyst / Associate Data Scientist", salaryIndicative: "₹4.0 – ₹7.0 LPA (~$5K–$9K USD)", demand: "Very High" },
          { title: "Generative AI Solutions Associate", salaryIndicative: "₹5.0 – ₹8.5 LPA (~$7K–$12K USD)", demand: "Emerging" },
          { title: "AI Prompt & Workflow Engineer", salaryIndicative: "₹3.5 – ₹6.0 LPA (~$4.5K–$8K USD)", demand: "Moderate" }
        ]
      };
    } else if (courseId === "digital_marketing") {
      courseData = {
        courseTitle: "Digital Marketing & Performance Growth",
        prioritySkills: [
          "Inbound marketing strategy & buyer persona creation",
          "Technical & On-Page Search Engine Optimization (SEO)",
          "Meta Ads Manager (Facebook/Instagram) media buying & testing frameworks",
          "Google Ads (Search, Performance Max) bidding & intent capture",
          "Web Analytics (GA4), conversion tracking, and CAC/ROAS optimization"
        ],
        startingModules: startingLevel.key === "foundation" ? [
          { code: "MOD-00", title: "Bridge: Marketing Fundamentals, Consumer Psychology & Funnels", duration: "2 Weeks" },
          { code: "MOD-01", title: "High-Converting Copywriting, Visual Creatives & Messaging", duration: "3 Weeks" },
          { code: "MOD-02", title: "Social Media Platform Algorithms & Organic Community Building", duration: "2 Weeks" }
        ] : [
          { code: "MOD-01", title: "Comprehensive SEO: Keyword Architecture, Technical Audits & Backlinks", duration: "3 Weeks" },
          { code: "MOD-02", title: "Meta Ads Mastery: Campaign Structure, Audience Targeting & Retargeting", duration: "3 Weeks" },
          { code: "MOD-03", title: "Google Ads: Search, Negative Keywords & Quality Score Optimization", duration: "3 Weeks" }
        ],
        learningSequence: [
          { phase: "Phase 1: Brand & Inbound", focus: "Buyer journey mapping, messaging hierarchy, high-impact copywriting, and landing page wireframing." },
          { phase: "Phase 2: Search Optimization", focus: "SEO technical audits, keyword research, on-page optimization, and authoritative backlink strategies." },
          { phase: "Phase 3: Paid Media Buying", focus: "Meta Ads Manager, Google Ads bidding, ad creative variation testing, and audience exclusions." },
          { phase: "Phase 4: Analytics & CRO", focus: "Google Analytics 4 event setup, UTM tracking, tag management, and A/B split testing." },
          { phase: "Phase 5: Growth Capstone", focus: "Executing a real-world multi-channel campaign with measurable ROAS and lead attribution." }
        ],
        portfolioProjects: [
          {
            title: "Multi-Channel Paid Acquisition Campaign & ROAS Dashboard",
            description: "Design and execute an end-to-end Meta & Google Ads campaign strategy for a direct-to-consumer brand, complete with ad variants, UTM tracking, and an automated Looker Studio report.",
            skillsDemonstrated: "Meta Ads, Google Search Ads, Budget Pacing, Looker Studio, ROAS Analysis"
          },
          {
            title: "Comprehensive Technical & Content SEO Audit",
            description: "Perform an in-depth audit of an existing web domain, diagnosing crawl errors, core web vitals, content gaps, and crafting a 6-month organic keyword growth blueprint.",
            skillsDemonstrated: "Ahrefs/SEMrush concepts, Google Search Console, Schema Markup, Content Strategy"
          },
          {
            title: "Automated Lead Generation & Email Nurturing Funnel",
            description: "Build an automated lead magnet funnel featuring a high-converting landing page, automated email sequence, and CRM lead scoring system.",
            skillsDemonstrated: "Landing Page CRO, Email Automation, Copywriting, Lead Scoring, Mailchimp/HubSpot"
          }
        ],
        targetJobRoles: [
          { title: "Performance Marketing Executive", salaryIndicative: "₹3.5 – ₹6.5 LPA (~$4.5K–$8.5K USD)", demand: "Very High" },
          { title: "SEO Specialist / Organic Strategist", salaryIndicative: "₹3.0 – ₹5.5 LPA (~$4K–$7.5K USD)", demand: "High" },
          { title: "Social Media & Content Growth Lead", salaryIndicative: "₹3.0 – ₹5.0 LPA (~$4K–$6.5K USD)", demand: "High" },
          { title: "Digital Marketing Account Manager", salaryIndicative: "₹4.5 – ₹7.5 LPA (~$6K–$10K USD)", demand: "Moderate" }
        ]
      };
    } else if (courseId === "cloud_computing") {
      courseData = {
        courseTitle: "Cloud Computing & DevOps Infrastructure",
        prioritySkills: [
          "Linux operating system administration & command-line automation",
          "Networking foundations (IP addressing, CIDR, DNS, VPC routing)",
          "Core AWS / Azure compute, storage, and serverless architectures",
          "Cloud security, IAM role policies, and compliance best practices",
          "Containerization with Docker and deployment automation with GitHub Actions"
        ],
        startingModules: startingLevel.key === "foundation" ? [
          { code: "MOD-00", title: "Bridge: Operating System Architecture & Terminal Foundations", duration: "2 Weeks" },
          { code: "MOD-01", title: "Linux SysAdmin: File Systems, Users, Permissions & Bash Scripting", duration: "3 Weeks" },
          { code: "MOD-02", title: "Computer Networking: OSI Model, TCP/IP, Ports & Subnets", duration: "2 Weeks" }
        ] : [
          { code: "MOD-01", title: "Cloud Architecture: AWS/Azure Global Infrastructure & Core Services", duration: "3 Weeks" },
          { code: "MOD-02", title: "Virtual Private Cloud (VPC), Subnets, Gateways & Security Groups", duration: "3 Weeks" },
          { code: "MOD-03", title: "Scalable Compute: Elastic Load Balancing (ELB) & Auto Scaling", duration: "3 Weeks" }
        ],
        learningSequence: [
          { phase: "Phase 1: Systems & Shell", focus: "Mastering the Linux terminal, server security basics, SSH keys, and shell script automation." },
          { phase: "Phase 2: Networking & VPCs", focus: "Designing isolated virtual networks, public/private subnets, NAT gateways, and routing tables." },
          { phase: "Phase 3: Core Cloud Services", focus: "Hands-on provisioning of virtual machines (EC2), object storage (S3), and relational databases (RDS)." },
          { phase: "Phase 4: Security & High Availability", focus: "IAM least-privilege policies, security auditing, multi-AZ deployment, and disaster recovery." },
          { phase: "Phase 5: Containers & DevOps", focus: "Dockerizing microservices, orchestrating with ECS/EKS, and setting up automated CI/CD pipelines." }
        ],
        portfolioProjects: [
          {
            title: "Multi-Tier High-Availability Web Application Architecture",
            description: "Deploy a resilient 3-tier web application on AWS with an Application Load Balancer, EC2 Auto-Scaling in private subnets, and an RDS Multi-AZ database.",
            skillsDemonstrated: "AWS VPC, EC2, Auto-Scaling, ALB, RDS, Security Groups, CloudWatch Monitoring"
          },
          {
            title: "Serverless Microservice & Static Website Hosting",
            description: "Build an event-driven serverless architecture using AWS S3, CloudFront CDN, API Gateway, and AWS Lambda functions with DynamoDB storage.",
            skillsDemonstrated: "Serverless, S3, CloudFront, Lambda, API Gateway, DynamoDB, IAM"
          },
          {
            title: "Automated Containerized CI/CD Deployment Pipeline",
            description: "Containerize a web app with Docker and construct a GitHub Actions workflow that automatically tests and deploys updates to a cloud container registry and runner.",
            skillsDemonstrated: "Docker, Linux, GitHub Actions, CI/CD, Container Registries, SSH Deployment"
          }
        ],
        targetJobRoles: [
          { title: "Associate Cloud Engineer / SysOps Administrator", salaryIndicative: "₹4.5 – ₹7.5 LPA (~$6K–$10K USD)", demand: "Very High" },
          { title: "Junior DevOps / Cloud Operations Engineer", salaryIndicative: "₹5.0 – ₹8.5 LPA (~$7K–$12K USD)", demand: "High" },
          { title: "Cloud Support Associate (AWS / Azure)", salaryIndicative: "₹3.5 – ₹6.0 LPA (~$4.5K–$8K USD)", demand: "High" },
          { title: "Infrastructure & Network Administrator", salaryIndicative: "₹3.5 – ₹6.0 LPA (~$4.5K–$8K USD)", demand: "Moderate" }
        ]
      };
    }

    // 4. Goalfinity Institute Structured Support Blueprint
    const goalfinitySupport = [
      {
        pillar: "Structured Hands-On Labs",
        description: "Weekly mentor-led code-along and infrastructure labs ensuring concepts are immediately practiced in real-world environments."
      },
      {
        pillar: "1-on-1 Milestone Code & Strategy Reviews",
        description: "Scheduled code and portfolio reviews by industry practitioners to identify bugs, refine architecture, and verify production standards."
      },
      {
        pillar: "Verified Portfolio Building",
        description: "Curated capstone projects deployed to live public URLs and GitHub repositories, serving as verifiable proof of capability for employer evaluations."
      },
      {
        pillar: "Career Readiness & Interview Coaching",
        description: "Targeted resume restructuring, technical interview simulations, case study presentations, and LinkedIn portfolio visibility guidance."
      }
    ];

    // 5. Recommended Next Counselling Action
    let nextAction = "Schedule an academic roadmap counselling session to finalize course track and lab schedule.";
    if (startingLevel.key === "foundation") {
      nextAction = "Assign the pre-course preparatory bridge packet and schedule a 1-on-1 orientation call with an academic advisor.";
    } else if (startingLevel.key === "accelerated") {
      nextAction = "Conduct an advanced capstone specialization consultation and reserve a seat in the upcoming intensive cohort.";
    }

    return {
      startingLevel: startingLevel,
      timelineWeeks: timelineWeeks,
      paceDescription: paceDescription,
      courseTitle: courseData.courseTitle,
      prioritySkills: courseData.prioritySkills,
      startingModules: courseData.startingModules,
      learningSequence: courseData.learningSequence,
      portfolioProjects: courseData.portfolioProjects,
      targetJobRoles: courseData.targetJobRoles,
      goalfinitySupport: goalfinitySupport,
      nextAction: nextAction,
      disclaimer: "This learning pathway and readiness assessment is an indicative educational counselling diagnostic designed to assist in curriculum planning. Goalfinity Institute provides structured training, guided portfolio mentoring, and career preparation support. Completion of coursework does not guarantee specific employment offers, third-party placements, or fixed salary packages."
    };
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = Recommendations;
} else {
  window.Recommendations = Recommendations;
}
