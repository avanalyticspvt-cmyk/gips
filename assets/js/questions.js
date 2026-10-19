/**
 * Goalfinity Institute — Career Readiness Assessment Platform
 * Comprehensive Question Bank & Rubrics
 *
 * Contains:
 * - Common Background & Career Assessment
 * - Common Learning Readiness (5-point Likert + Not Sure)
 * - Course-Specific Technical Assessments (AI, Digital Marketing, Cloud Computing)
 * - Adaptive Practical Skill Assessment Bank (Beginner, Intermediate, Advanced)
 */

const QUESTION_BANK = {
  // ==========================================
  // 1. COMMON CAREER & BACKGROUND QUESTIONS
  // ==========================================
  commonBackground: [
    {
      id: "cb_motivation",
      category: "careerClarity",
      label: "Course Motivation",
      question: "What motivated you to explore this course at this point in your journey?",
      type: "select",
      required: true,
      options: [
        { value: "career_switch", text: "Planning a career transition from a non-technical / different field", weight: 4 },
        { value: "first_job", text: "Seeking job-ready skills for my first professional role / graduation", weight: 4 },
        { value: "upskilling_current", text: "Upskilling to advance in my current company or secure a promotion", weight: 5 },
        { value: "freelancing_agency", text: "Aiming to launch a freelance career, agency, or independent consultancy", weight: 4 },
        { value: "curiosity_exploration", text: "Exploring the subject out of interest and industry demand", weight: 3 }
      ]
    },
    {
      id: "cb_prior_experience",
      category: "professionalReadiness",
      label: "Prior Relevant Work & Projects",
      question: "Have you completed any relevant certifications, internships, courses, or self-directed projects?",
      type: "radio",
      required: true,
      options: [
        { value: "substantial", text: "Yes, completed professional certifications / internships / live projects", weight: 5 },
        { value: "moderate", text: "Completed online tutorials, college coursework, or guided practice exercises", weight: 3 },
        { value: "minimal", text: "Read articles or watched overview videos, but have not built projects yet", weight: 2 },
        { value: "none", text: "Complete beginner with no prior related coursework or projects", weight: 1 }
      ]
    },
    {
      id: "cb_primary_goal",
      category: "careerClarity",
      label: "Primary Career Goal",
      question: "What is your primary career goal for undertaking this program?",
      type: "select",
      required: true,
      options: [
        { value: "first_job", text: "Securing my first entry-level industry role", weight: 5 },
        { value: "career_switch", text: "Successfully transitioning into a new industry/specialization", weight: 5 },
        { value: "promotion", text: "Earning a promotion or salary increment in my current domain", weight: 4 },
        { value: "freelancing", text: "Building a sustainable freelance / client consulting practice", weight: 4 },
        { value: "business", text: "Starting or growing a tech/digital business or startup", weight: 4 },
        { value: "exploring", text: "Exploring options before making a long-term commitment", weight: 3 }
      ]
    },
    {
      id: "cb_target_role",
      category: "careerClarity",
      label: "Target Job Role (6–12 Months)",
      question: "Which job role would you like to pursue in the next 6–12 months?",
      type: "text",
      placeholder: "e.g., Junior AI Engineer, SEO Specialist, Cloud Operations Associate",
      required: true,
      weight: 4
    },
    {
      id: "cb_target_timeline",
      category: "careerClarity",
      label: "Target Job Search Timeline",
      question: "When would you ideally like to start working or interviewing in this field?",
      type: "select",
      required: true,
      options: [
        { value: "immediate", text: "Immediately / within 1–2 months (Urgent)", weight: 4 },
        { value: "3_months", text: "In 3–4 months (After intensive learning)", weight: 5 },
        { value: "6_months", text: "In 5–6 months (After completing projects & portfolio)", weight: 5 },
        { value: "flexible", text: "Within 6–12 months / Flexible timeline", weight: 3 }
      ]
    },
    {
      id: "cb_salary_expectation",
      category: "careerClarity",
      label: "Target Salary Expectation (Optional)",
      question: "What annual salary range are you targeting? (Optional — for counselling orientation only; Goalfinity does not guarantee salaries)",
      type: "select",
      required: false,
      options: [
        { value: "prefer_not_to_say", text: "Prefer not to disclose at this stage", weight: 3 },
        { value: "entry_3_5", text: "Entry Level (₹3.0 – ₹5.0 LPA / ~$4K–$7K USD)", weight: 4 },
        { value: "mid_5_8", text: "Mid Level (₹5.0 – ₹8.5 LPA / ~$7K–$12K USD)", weight: 4 },
        { value: "senior_8_plus", text: "Experienced / Lateral (₹8.5+ LPA / ~$12K+ USD)", weight: 4 },
        { value: "flexible", text: "Open to market standard for relevant skills", weight: 4 }
      ]
    },
    {
      id: "cb_internship_openness",
      category: "professionalReadiness",
      label: "Role Type Flexibility",
      question: "Are you open to internships, entry-level apprentice roles, or project-based practical experience?",
      type: "select",
      required: true,
      options: [
        { value: "highly_open", text: "Yes, fully open to paid internships and apprentice roles leading to full-time", weight: 5 },
        { value: "fulltime_preferred", text: "Prefer full-time employment, but will consider strong internship opportunities", weight: 4 },
        { value: "fulltime_only", text: "Only interested in direct full-time permanent positions", weight: 3 },
        { value: "freelance_remote", text: "Interested exclusively in remote or contract/freelance work", weight: 3 }
      ]
    }
  ],

  // ==========================================
  // 2. COMMON LEARNING READINESS QUESTIONS
  // ==========================================
  commonReadiness: [
    {
      id: "cr_digital_literacy",
      category: "learningReadiness",
      label: "Digital & Computer Literacy",
      question: "How comfortable are you using computers, modern operating systems, web applications, and digital tools?",
      type: "likert_scale",
      required: true,
      scaleMax: 5,
      allowNotSure: true
    },
    {
      id: "cr_english_communication",
      category: "professionalReadiness",
      label: "Professional English Communication",
      question: "How comfortable are you with professional English communication, reading technical documentation, and interview discussions?",
      type: "likert_scale",
      required: true,
      scaleMax: 5,
      allowNotSure: true
    },
    {
      id: "cr_problem_solving",
      category: "learningReadiness",
      label: "Logical Thinking & Problem Solving",
      question: "How would you rate your logical thinking, structured problem solving, and ability to break down complex tasks?",
      type: "likert_scale",
      required: true,
      scaleMax: 5,
      allowNotSure: true
    },
    {
      id: "cr_practical_work",
      category: "practical",
      label: "Independent Practical Work",
      question: "Have you independently completed a project, campaign, dashboard, website, application, or similar practical deliverable?",
      type: "radio",
      required: true,
      options: [
        { value: "yes_independent", text: "Yes, conceptualized and built an end-to-end practical project independently", weight: 5 },
        { value: "yes_guided", text: "Yes, built projects by following step-by-step tutorials or team assignments", weight: 3 },
        { value: "in_progress", text: "Started personal projects but have not yet completed a finished version", weight: 2 },
        { value: "no_projects", text: "Have not built an independent project yet", weight: 1 },
        { value: "not_sure", text: "Not sure / need guidance on what qualifies as a project", weight: 2 }
      ]
    },
    {
      id: "cr_weekly_hours",
      category: "learningReadiness",
      label: "Weekly Study Commitment",
      question: "How many hours per week can you realistically dedicate to structured lectures, hands-on labs, and self-study?",
      type: "select",
      required: true,
      options: [
        { value: "less_than_5", text: "Less than 5 hours/week (Constrained schedule)", weight: 1 },
        { value: "5_to_10", text: "5 – 10 hours/week (Working professional / Part-time)", weight: 3 },
        { value: "10_to_15", text: "10 – 15 hours/week (Balanced commitment)", weight: 4 },
        { value: "15_to_20", text: "15 – 20 hours/week (Dedicated fast-track)", weight: 5 },
        { value: "more_than_20", text: "20+ hours/week (Full-time immersive learner)", weight: 5 }
      ]
    }
  ],

  // ==========================================
  // 3. ARTIFICIAL INTELLIGENCE ASSESSMENT
  // ==========================================
  ai: {
    title: "Artificial Intelligence (AI)",
    questions: [
      {
        id: "ai_q1_chatgpt",
        category: "foundational",
        label: "AI Tool Usage & Depth",
        question: "Have you used ChatGPT, Claude, Gemini, or other modern AI tools? In what capacity?",
        type: "radio",
        required: true,
        options: [
          { value: "advanced", text: "Use daily for programming, prompt chaining, API automation, or custom GPT creation", weight: 5 },
          { value: "intermediate", text: "Use regularly for drafting content, debugging code snippets, or research synthesis", weight: 4 },
          { value: "basic", text: "Tried casual prompts or occasional search queries", weight: 2 },
          { value: "none", text: "Have never used generative AI tools", weight: 1 }
        ]
      },
      {
        id: "ai_q2_python",
        category: "foundational",
        label: "Programming / Python Experience",
        question: "Have you written code in Python or any other programming language?",
        type: "radio",
        required: true,
        options: [
          { value: "advanced", text: "Comfortable with OOP, data structures, libraries (Pandas/NumPy), and debugging", weight: 5 },
          { value: "intermediate", text: "Write scripts with functions, loops, lists, and basic file handling", weight: 4 },
          { value: "beginner", text: "Know basic syntax (variables, if-else, print statements) but struggle with standalone code", weight: 2 },
          { value: "none", text: "Never written code before / zero programming experience", weight: 1 }
        ]
      },
      {
        id: "ai_q3_math",
        category: "foundational",
        label: "Mathematical & Statistical Readiness",
        question: "How comfortable are you with basic mathematics, percentages, graphs, algebra, and statistics?",
        type: "likert_scale",
        required: true,
        scaleMax: 5,
        allowNotSure: true
      },
      {
        id: "ai_q4_data",
        category: "foundational",
        label: "Data & Spreadsheet Experience",
        question: "Have you worked with Excel, datasets, charts, SQL, or relational databases?",
        type: "radio",
        required: true,
        options: [
          { value: "advanced", text: "Proficient in SQL queries (JOINs, aggregations) or Python Pandas data manipulation", weight: 5 },
          { value: "intermediate", text: "Use Excel formulas (VLOOKUP, Pivot tables), charts, and structured tables regularly", weight: 4 },
          { value: "basic", text: "Can enter data and create basic bar/pie charts in Excel or Google Sheets", weight: 2 },
          { value: "none", text: "Minimal or no spreadsheet and database experience", weight: 1 }
        ]
      },
      {
        id: "ai_q5_ml_concept",
        category: "foundational",
        label: "Programming vs. Machine Learning",
        question: "How would you explain the fundamental difference between traditional programming and machine learning?",
        type: "radio",
        required: true,
        options: [
          { value: "correct", text: "Traditional programming uses explicit rules + data to generate answers; ML uses data + answers to discover underlying rules and patterns", weight: 5, correct: true },
          { value: "partial", text: "Traditional programming is manual typing; machine learning is automated code written by an AI assistant", weight: 2 },
          { value: "incorrect", text: "Machine learning only works with hardware robotics, while programming only works with software", weight: 1 },
          { value: "not_sure", text: "Not sure / have not learned the distinction yet", weight: 1 }
        ]
      },
      {
        id: "ai_q6_prior_project",
        category: "practical",
        label: "AI / ML Project Experience",
        question: "Have you built or experimented with a chatbot, prediction model, automation, or AI-based project?",
        type: "radio",
        required: true,
        options: [
          { value: "deployed", text: "Yes, built and deployed an end-to-end model, web app, or workflow", weight: 5 },
          { value: "guided_lab", text: "Completed tutorial labs (e.g., Iris classification, basic LangChain chatbot)", weight: 3 },
          { value: "planned", text: "Have ideas and started reading tutorials, but haven't executed code", weight: 2 },
          { value: "none", text: "Have not built any AI or ML project yet", weight: 1 }
        ]
      },
      {
        id: "ai_q7_churn_scenario",
        category: "practical",
        label: "Customer Churn Prediction Scenario",
        question: "A subscription business wants to predict which customers are likely to cancel. Which data points are most valuable to train an AI model?",
        type: "select",
        required: true,
        options: [
          { value: "comprehensive", text: "Login frequency trends, customer support ticket volume, billing issues, usage drop-off, and subscription tenure", weight: 5, correct: true },
          { value: "partial", text: "Only customer email address, age, and payment method", weight: 2 },
          { value: "aesthetic", text: "The color theme of the website and marketing brochure style", weight: 1 },
          { value: "not_sure", text: "Not sure what data features are required", weight: 1 }
        ]
      },
      {
        id: "ai_q8_specialization",
        category: "careerClarity",
        label: "Preferred AI Track",
        question: "Which aspect of Artificial Intelligence interests you most?",
        type: "select",
        required: true,
        options: [
          { value: "generative_ai", text: "Generative AI applications, Prompt Engineering & LLM Agents", weight: 4 },
          { value: "ml_data_science", text: "Core Machine Learning, Predictive Modeling & Data Science", weight: 5 },
          { value: "ai_engineering", text: "Full-Stack AI Application Engineering & System Integration", weight: 5 },
          { value: "ai_automation", text: "No-Code / Low-Code AI Tools & Business Automation", weight: 3 }
        ]
      },
      {
        id: "ai_practical_scenario",
        category: "practical",
        label: "Practical House Price Prediction Scenario",
        question: "Scenario: 'A real estate platform wants to predict house prices based on location, area, and number of bedrooms. What additional data would help, and how might an AI algorithm assist?' (Counsellor evaluates candidate's analytical reasoning)",
        type: "rubric_eval",
        required: true,
        rubricPrompt: "Assess student's understanding of features (e.g., age of property, nearby amenities, historical sale prices) and how a regression model learns relationships to predict continuous values.",
        scaleMax: 5
      }
    ]
  },

  // ==========================================
  // 4. DIGITAL MARKETING ASSESSMENT
  // ==========================================
  digital_marketing: {
    title: "Digital Marketing",
    questions: [
      {
        id: "dm_q1_social_presence",
        category: "foundational",
        label: "Social / Web Channel Experience",
        question: "Have you managed a social media page, blog, YouTube channel, website, or online brand?",
        type: "radio",
        required: true,
        options: [
          { value: "business_brand", text: "Yes, managed an active brand, creator account, or e-commerce presence with steady followers", weight: 5 },
          { value: "personal_creator", text: "Created personal content (Reels, TikTok, blog posts) with basic engagement", weight: 3 },
          { value: "casual_user", text: "Active personal user of social networks, but never managed promotional content", weight: 2 },
          { value: "none", text: "Rarely use social media or digital publishing platforms", weight: 1 }
        ]
      },
      {
        id: "dm_q2_organic_vs_paid",
        category: "foundational",
        label: "Organic vs. Paid Marketing",
        question: "What is the key difference between organic marketing and paid digital advertising?",
        type: "radio",
        required: true,
        options: [
          { value: "correct", text: "Organic builds compounding reach through content, community, and SEO without ad spend; Paid buys immediate targeted impressions through ad platforms", weight: 5, correct: true },
          { value: "partial", text: "Organic is for small businesses, while paid marketing is only used by Fortune 500 corporations", weight: 2 },
          { value: "incorrect", text: "Organic marketing involves paper posters; paid marketing is online only", weight: 1 },
          { value: "not_sure", text: "Not sure about the fundamental differences", weight: 1 }
        ]
      },
      {
        id: "dm_q3_channel_awareness",
        category: "foundational",
        label: "Marketing Channel Familiarity",
        question: "Which of these core digital marketing channels are you familiar with?",
        type: "select",
        required: true,
        options: [
          { value: "all_core", text: "Familiar with SEO, Google Search Ads, Meta Ads (Facebook/Instagram), and Email workflows", weight: 5 },
          { value: "social_meta", text: "Familiar primarily with Instagram/Facebook Ads and social media posting", weight: 3 },
          { value: "seo_content", text: "Familiar with blogging, keywords, and organic content writing", weight: 3 },
          { value: "beginner_general", text: "Heard the terms, but have not configured ad campaigns or SEO strategies", weight: 2 }
        ]
      },
      {
        id: "dm_q4_copywriting",
        category: "foundational",
        label: "Copywriting & Content Creation Comfort",
        question: "How comfortable are you writing persuasive headlines, ad captions, email subject lines, or promotional copy?",
        type: "likert_scale",
        required: true,
        scaleMax: 5,
        allowNotSure: true
      },
      {
        id: "dm_q5_local_cafe_scenario",
        category: "practical",
        label: "Local Business Promotion Scenario",
        question: "How would you promote a newly opened café to residents and office workers within a 5 km radius?",
        type: "select",
        required: true,
        options: [
          { value: "multichannel_local", text: "Set up Google Business Profile for local SEO, run Instagram geo-targeted ads within 5km radius, offer local launch discounts, and partner with nearby food influencers", weight: 5, correct: true },
          { value: "global_seo", text: "Run national TV ads and target global keywords on Google Search", weight: 1 },
          { value: "spam_dm", text: "Direct message random Instagram accounts requesting follow-backs", weight: 1 },
          { value: "not_sure", text: "Not sure how local geotargeting and local SEO work", weight: 1 }
        ]
      },
      {
        id: "dm_q6_click_psychology",
        category: "foundational",
        label: "Ad Engagement Psychology",
        question: "What primarily drives a prospective customer to click on a digital advertisement?",
        type: "radio",
        required: true,
        options: [
          { value: "relevance_value", text: "Immediate relevance to an urgent pain point, strong hook, clear value proposition, and compelling Call to Action (CTA)", weight: 5, correct: true },
          { value: "flashing_colors", text: "Flashing bright neon graphics and random celebrity images", weight: 1 },
          { value: "lengthy_text", text: "Long paragraphs with detailed technical specifications in the image", weight: 1 },
          { value: "not_sure", text: "Not sure what causes users to click", weight: 1 }
        ]
      },
      {
        id: "dm_q7_analytics",
        category: "practical",
        label: "Marketing Analytics & Metrics",
        question: "Have you monitored or interpreted marketing metrics (e.g., CTR, CPC, Conversion Rate, ROAS, CAC)?",
        type: "radio",
        required: true,
        options: [
          { value: "performance_metrics", text: "Yes, regularly analyze ROAS, conversion funnels, CAC, and attribution in GA4 or Ads Manager", weight: 5 },
          { value: "basic_engagement", text: "Tracked likes, shares, comments, video views, and website visitor counts", weight: 3 },
          { value: "theoretical", text: "Know the acronyms in theory, but haven't run live dashboards or reports", weight: 2 },
          { value: "none", text: "Never worked with digital marketing metrics", weight: 1 }
        ]
      },
      {
        id: "dm_q8_specialization",
        category: "careerClarity",
        label: "Preferred Digital Marketing Focus",
        question: "Which specialization within digital marketing excites you the most?",
        type: "select",
        required: true,
        options: [
          { value: "performance_paid", text: "Performance Marketing (Meta Ads, Google Ads, Media Buying, ROAS)", weight: 5 },
          { value: "seo_content", text: "Organic Growth & SEO (Search Engine Optimization, Inbound Content Strategy)", weight: 4 },
          { value: "social_brand", text: "Social Media Strategy, Community Building & Influencer Marketing", weight: 4 },
          { value: "growth_analytics", text: "Marketing Analytics, Conversion Rate Optimization (CRO) & Automation", weight: 5 }
        ]
      },
      {
        id: "dm_practical_scenario",
        category: "practical",
        label: "Ad Campaign ROI Evaluation Scenario",
        question: "Scenario: 'A business spends ₹10,000 on ads and generates 50 enquiries. What additional information is needed to determine whether this campaign was truly profitable and successful?' (Counsellor evaluates candidate's business conversion thinking)",
        type: "rubric_eval",
        required: true,
        rubricPrompt: "Assess student's understanding of Cost Per Lead (₹200), conversion rate from enquiry to paying customer, average order value/customer lifetime value, gross margins, and net profit versus pure vanity lead counts.",
        scaleMax: 5
      }
    ]
  },

  // ==========================================
  // 5. CLOUD COMPUTING ASSESSMENT
  // ==========================================
  cloud_computing: {
    title: "Cloud Computing",
    questions: [
      {
        id: "cloud_q1_academic_background",
        category: "foundational",
        label: "IT / Networking Background",
        question: "What is your formal background or self-study experience in IT, computer hardware, or networking?",
        type: "radio",
        required: true,
        options: [
          { value: "cs_degree_pro", text: "Degree in CS/IT or working in IT support / system administration", weight: 5 },
          { value: "tech_diploma", text: "Diploma or academic coursework in engineering / computer applications", weight: 4 },
          { value: "self_taught", text: "Non-tech degree, but actively self-studying computing and operating systems", weight: 3 },
          { value: "complete_beginner", text: "Non-technical background with no prior networking or computer systems training", weight: 1 }
        ]
      },
      {
        id: "cloud_q2_server_concept",
        category: "foundational",
        label: "Server Fundamentals",
        question: "How would you describe what a server is and does in a computing network?",
        type: "radio",
        required: true,
        options: [
          { value: "correct", text: "A dedicated physical or virtual computer configured to listen for client requests, process logic, and deliver resources (webpages, files, data) over a network", weight: 5, correct: true },
          { value: "partial", text: "A large external hard drive used exclusively for backing up personal photos", weight: 2 },
          { value: "incorrect", text: "An internet service provider's physical office building", weight: 1 },
          { value: "not_sure", text: "Not completely sure how a server works", weight: 1 }
        ]
      },
      {
        id: "cloud_q3_linux",
        category: "foundational",
        label: "Linux & Command Line Exposure",
        question: "Have you used Linux or the command line terminal (CLI)?",
        type: "radio",
        required: true,
        options: [
          { value: "advanced", text: "Comfortable with SSH, file permissions (chmod), bash scripting, process management (ps/top), and package managers", weight: 5 },
          { value: "intermediate", text: "Can navigate directories, create files, and run basic commands (cd, ls, mkdir, cat, rm)", weight: 3 },
          { value: "beginner", text: "Used terminal once or twice following an exact copy-paste guide", weight: 2 },
          { value: "none", text: "Never opened a command prompt or terminal window", weight: 1 }
        ]
      },
      {
        id: "cloud_q4_ip_networking",
        category: "foundational",
        label: "Public IP vs. Private IP",
        question: "What is the difference between a Public IP address and a Private IP address?",
        type: "radio",
        required: true,
        options: [
          { value: "correct", text: "Public IP addresses are globally routable across the public internet; Private IP addresses are reserved for internal isolated local networks / VPCs and cannot be reached directly from the internet", weight: 5, correct: true },
          { value: "partial", text: "Public IP addresses are free; Private IP addresses cost money each month", weight: 2 },
          { value: "incorrect", text: "Public IP addresses are only for government websites", weight: 1 },
          { value: "not_sure", text: "Not sure how IP addressing operates", weight: 1 }
        ]
      },
      {
        id: "cloud_q5_cloud_providers",
        category: "foundational",
        label: "Major Cloud Provider Exposure",
        question: "Have you logged into or experimented with AWS, Microsoft Azure, or Google Cloud Platform (GCP)?",
        type: "radio",
        required: true,
        options: [
          { value: "provisioned_infra", text: "Yes, launched virtual machines (EC2/Azure VM), managed S3 buckets, or configured VPCs/security groups", weight: 5 },
          { value: "free_tier_toured", text: "Created a free-tier account and clicked around the console", weight: 3 },
          { value: "read_overview", text: "Read articles or watched architectural diagrams, but no hands-on console access", weight: 2 },
          { value: "none", text: "Never accessed a cloud console", weight: 1 }
        ]
      },
      {
        id: "cloud_q6_storage_types",
        category: "foundational",
        label: "Local Storage vs. Cloud Storage",
        question: "Why do enterprises transition from local disk storage to cloud object storage (e.g., AWS S3)?",
        type: "radio",
        required: true,
        options: [
          { value: "correct", text: "Virtually unlimited elastic scaling, 99.999999999% durability across multiple availability zones, pay-per-use economics, and global API accessibility", weight: 5, correct: true },
          { value: "partial", text: "Because local hard drives are illegal for enterprise use", weight: 1 },
          { value: "incorrect", text: "Cloud storage is always 100% free with zero bandwidth charges", weight: 1 },
          { value: "not_sure", text: "Not sure why cloud storage is preferred", weight: 1 }
        ]
      },
      {
        id: "cloud_q7_deployments",
        category: "practical",
        label: "Deployment & Server Configuration",
        question: "Have you ever deployed a website, web app, or database to a remote server or cloud environment?",
        type: "radio",
        required: true,
        options: [
          { value: "automated_cloud", text: "Deployed web applications to cloud instances, configured web servers (Nginx/Apache), or used CI/CD pipelines", weight: 5 },
          { value: "managed_hosting", text: "Deployed to shared hosting (cPanel), Heroku, Netlify, or Vercel", weight: 3 },
          { value: "local_only", text: "Ran localhost servers on my own laptop only", weight: 2 },
          { value: "never", text: "Have never hosted or deployed a web application", weight: 1 }
        ]
      },
      {
        id: "cloud_q8_specialization",
        category: "careerClarity",
        label: "Preferred Cloud Career Direction",
        question: "Which cloud career pathway aligns best with your professional objectives?",
        type: "select",
        required: true,
        options: [
          { value: "cloud_engineer", text: "Cloud Solutions Engineering (Architecture, Migration, AWS/Azure SysOps)", weight: 5 },
          { value: "devops_automation", text: "Cloud DevOps & Automation (Docker, Kubernetes, CI/CD, Terraform)", weight: 5 },
          { value: "cloud_support", text: "Cloud Support / Operations Associate (Monitoring, Troubleshooting, Client Support)", weight: 4 },
          { value: "cloud_security", text: "Cloud Security & Compliance (IAM, Firewalls, Threat Detection)", weight: 4 }
        ]
      },
      {
        id: "cloud_practical_scenario",
        category: "practical",
        label: "Troubleshooting Inaccessible Web Server Scenario",
        question: "Scenario: 'A company web application is hosted on a cloud VM instance, but external users report \"Connection Timed Out\". What diagnostic steps would you perform in order?' (Counsellor evaluates candidate's troubleshooting logic)",
        type: "rubric_eval",
        required: true,
        rubricPrompt: "Assess student's systematic troubleshooting: 1) Verify VM status (running vs stopped), 2) Check Cloud Firewall / Security Group (inbound rules for Port 80/443), 3) Verify web service process (systemctl status nginx), 4) Test local curl inside VM, 5) Check DNS/Elastic IP mapping.",
        scaleMax: 5
      }
    ]
  },

  // ==========================================
  // 6. ADAPTIVE PRACTICAL SKILL ASSESSMENT
  // ==========================================
  // 5-10 minute practical knowledge check for each track
  practicalQuiz: {
    ai: [
      {
        id: "pq_ai_1",
        difficulty: "beginner",
        questionText: "In Python, which built-in data type is ordered, mutable, and written with square brackets []?",
        options: [
          { text: "Dictionary", correct: false },
          { text: "List", correct: true },
          { text: "Tuple", correct: false },
          { text: "Set", correct: false }
        ],
        explanation: "Lists in Python are ordered collections that are mutable (can be altered) and use square brackets []."
      },
      {
        id: "pq_ai_2",
        difficulty: "intermediate",
        questionText: "When training a predictive model, why is dataset splitting (e.g., 80% Train, 20% Test) critical?",
        options: [
          { text: "To make the file size smaller for cloud storage", correct: false },
          { text: "To evaluate how well the model generalizes to unseen data and prevent overfitting", correct: true },
          { text: "Because computers cannot process more than 1,000 rows at a time", correct: false },
          { text: "It is an optional step that only applies to computer vision models", correct: false }
        ],
        explanation: "Evaluating on an isolated test set confirms the model learned generalizable patterns rather than simply memorizing training records (overfitting)."
      },
      {
        id: "pq_ai_3",
        difficulty: "intermediate",
        questionText: "What is the primary role of 'Temperature' in Large Language Model (LLM) text generation?",
        options: [
          { text: "Regulates the physical heat of the GPU processor", correct: false },
          { text: "Controls the randomness/creativity of token selection (lower = more deterministic, higher = more diverse)", correct: true },
          { text: "Measures the internet download speed of the AI request", correct: false },
          { text: "Determines the total number of words allowed in the prompt", correct: false }
        ],
        explanation: "Temperature scales the probability distribution of generated tokens: lower values yield focused, predictable outputs; higher values produce more creative variations."
      }
    ],

    digital_marketing: [
      {
        id: "pq_dm_1",
        difficulty: "beginner",
        questionText: "If an ad campaign registers 10,000 impressions and receives 250 clicks, what is the Click-Through Rate (CTR)?",
        options: [
          { text: "0.25%", correct: false },
          { text: "2.5%", correct: true },
          { text: "25%", correct: false },
          { text: "40%", correct: false }
        ],
        explanation: "CTR = (Total Clicks / Total Impressions) * 100 = (250 / 10,000) * 100 = 2.5%."
      },
      {
        id: "pq_dm_2",
        difficulty: "intermediate",
        questionText: "What is the primary purpose of a Meta Pixel or Google Tag on an e-commerce website?",
        options: [
          { text: "To compress image file sizes for faster page loading", correct: false },
          { text: "To track visitor actions (page views, add to cart, purchases) for campaign attribution and retargeting", correct: true },
          { text: "To design graphic banners automatically without human input", correct: false },
          { text: "To block competitors from visiting the store", correct: false }
        ],
        explanation: "Tracking tags record on-site conversion events, feeding attribution data back to ad algorithms for targeted remarketing and budget optimization."
      },
      {
        id: "pq_dm_3",
        difficulty: "intermediate",
        questionText: "In SEO, why are high-quality backlinks from authoritative websites considered valuable?",
        options: [
          { text: "They act as digital votes of credibility and trust, boosting search engine domain authority and ranking potential", correct: true },
          { text: "They guarantee immediate pay-per-click revenue from Google", correct: false },
          { text: "They automatically double the website's server RAM", correct: false },
          { text: "They prevent website hackers from accessing the database", correct: false }
        ],
        explanation: "Search engines view contextual inbound links from authoritative websites as signals of credibility and editorial endorsement."
      }
    ],

    cloud_computing: [
      {
        id: "pq_cloud_1",
        difficulty: "beginner",
        questionText: "Which standard networking port is utilized for secure, encrypted web traffic (HTTPS)?",
        options: [
          { text: "Port 21", correct: false },
          { text: "Port 80", correct: false },
          { text: "Port 443", correct: true },
          { text: "Port 3389", correct: false }
        ],
        explanation: "Port 443 is the standard default port for encrypted HTTPS web communication (Port 80 is unencrypted HTTP, Port 21 is FTP)."
      },
      {
        id: "pq_cloud_2",
        difficulty: "intermediate",
        questionText: "In cloud infrastructure, what is an 'Availability Zone' (AZ)?",
        options: [
          { text: "A physical retail store where cloud servers are purchased", correct: false },
          { text: "One or more discrete, physically separated data centers within a region with redundant power, networking, and connectivity", correct: true },
          { text: "A time zone used for automated employee billing", correct: false },
          { text: "A software plugin for Google Chrome", correct: false }
        ],
        explanation: "An Availability Zone consists of one or more isolated data centers engineered to be fault-tolerant against local disasters affecting other zones."
      },
      {
        id: "pq_cloud_3",
        difficulty: "intermediate",
        questionText: "What does the cloud concept of 'Elasticity' mean?",
        options: [
          { text: "The physical flexibility of server cables inside the rack", correct: false },
          { text: "The ability of computing resources to dynamically scale up or down automatically in response to real-time workload demand", correct: true },
          { text: "A guaranteed discount that grows every year you stay with a cloud provider", correct: false },
          { text: "Storing data in multiple compressed file formats simultaneously", correct: false }
        ],
        explanation: "Elasticity allows systems to acquire compute and memory resources dynamically when traffic spikes, and de-provision them when traffic subsides to optimize costs."
      }
    ]
  }
};

// Export for Node/CommonJS test runners if available, else attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = QUESTION_BANK;
} else {
  window.QUESTION_BANK = QUESTION_BANK;
}
