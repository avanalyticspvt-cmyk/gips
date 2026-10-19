# Goalfinity Institute — Career Readiness Assessment & Scoring Engine

This document provides transparent, exhaustive documentation of the assessment methodology, category weighting, mathematical formulas, guidance bands, and evidence extraction algorithms implemented in the Goalfinity Institute platform.

---

## 1. Core Evaluation Philosophy

1. **Indicative Educational Counselling Diagnostic**: The platform is an educational diagnostic designed to recommend curriculum starting levels and identify concept gaps. It does **not** purport to be a scientifically validated psychometric aptitude test or an employment guarantee.
2. **Separation of Confidence vs. Verified Reasoning**:
   - *Self-Assessed Confidence*: Gauged via 5-point Likert questions (Learning Readiness).
   - *Verified Performance*: Gauged via objective multiple-choice checks, scenario feature engineering questions, and rubric-evaluated problem solving (Foundational & Practical).
3. **Explicit Handling of "Not Sure" and Optional Items**:
   - "Not sure" is treated as an explicit learning signal (awarded baseline orientation points and marked as a developmental priority), rather than penalized as a zero.
   - Unanswered optional questions (such as target salary) do not reduce candidate scores.

---

## 2. Category Weighting Distribution

The overall score (0–100) is a weighted sum of 5 core career readiness dimensions:

$$\text{Overall Score} = \sum_{i=1}^{5} \left( \text{Category Percentage}_i \times \text{Weight}_i \right)$$

| Dimension | Weight | Questions Assessed | Objective |
|---|---|---|---|
| **Foundational Knowledge** | **30%** | Course Q1–Q6, Concepts, Tools, Math/Stats | Domain literacy, syntax, tool familiarity, and foundational principles |
| **Practical Skills & Reasoning** | **30%** | Course Q7, Practical Scenario Rubric, Adaptive MCQs | Analytical feature reasoning, troubleshooting logic, and hands-on application |
| **Career Goal Clarity** | **15%** | Common Q1, Q3, Q4, Target Role & Timeline, Specialization | Directional focus, realistic expectations, and commitment to field |
| **Learning Readiness** | **15%** | Common Q8, Q10, Weekly Study Hours | Computer comfort, problem solving, and study discipline (hours/week) |
| **Professional Readiness** | **10%** | English communication, prior projects, role flexibility | Workplace communication, project persistence, and interview open-mindedness |

---

## 3. 5-Point Likert Scale Normalization

For self-assessed readiness questions:
- **1 — Beginner**: Needs substantial guidance (Earns 1 / 5 = 20%)
- **2 — Basic**: Can perform simple tasks with assistance (Earns 2 / 5 = 40%)
- **3 — Intermediate**: Can complete familiar tasks independently (Earns 3 / 5 = 60%)
- **4 — Advanced**: Can manage complex tasks with limited assistance (Earns 4 / 5 = 80%)
- **5 — Highly Confident**: Can solve unfamiliar problems and explain the approach (Earns 5 / 5 = 100%)
- **Not Sure**: Candidate expresses uncertainty (Earns 2 / 5 = 40% with high-priority gap flag)

---

## 4. Internal Readiness Guidance Bands

The calculated overall score maps to one of four internal counselling guidance bands:

| Band Range | Guidance Band Name | Visual Color | Interpretation & Action |
|---|---|---|---|
| **80 – 100** | **Strong Assessed Readiness** | Teal (`#2A9D8F`) | Demonstrates solid baseline foundation. Well-positioned for the **Accelerated Project Track** with immediate emphasis on advanced capstones and production deployments. |
| **60 – 79** | **Progressing Readiness** | Royal Blue (`#3A86FF`) | Demonstrates meaningful aptitude with specific targeted concept gaps. Recommended for the **Core Curriculum Track** with guided lab mentorship. |
| **40 – 59** | **Developing Readiness** | Amber (`#F4A261`) | Clear interest and emerging capabilities, but requires foundational reinforcement in core domain skills before advanced topics. |
| **0 – 39** | **Foundation-Building Stage** | Coral (`#E76F51`) | Early-stage learner or career explorer. Best served by the **Foundation Bridge + Core Track** with preparatory modules in computer logic and basics. |

---

## 5. Course-Specific Diagnostics

### 1. Artificial Intelligence (AI)
- **Foundational**: Generative AI tools (ChatGPT/Claude), Python coding fluency, mathematics & statistics readiness, data literacy (Excel/SQL/Pandas), programming vs. ML distinction.
- **Practical & Analytical**: Customer churn feature selection scenario, house price regression scenario evaluated by rubric (1–5), adaptive AI MCQs (Python lists, train/test split rationale, LLM temperature).

### 2. Digital Marketing
- **Foundational**: Social media channel management, organic reach vs. paid ads distinction, core channel breadth (SEO/Ads/Email), copywriting confidence, click psychology.
- **Practical & Analytical**: 5km café promotion geo-strategy, ad campaign profitability analysis (₹10,000 spend for 50 leads: assessing CAC, conversion rate, AOV, and margin), adaptive marketing MCQs (CTR calculation, tracking pixel attribution, SEO backlinks).

### 3. Cloud Computing
- **Foundational**: IT/academic background, server computing model, Linux CLI fluency, public vs. private IP addressing, major cloud provider console exposure, local vs. cloud object storage.
- **Practical & Analytical**: Inaccessible cloud server diagnostic sequence (DNS &rarr; Security Group Port 80/443 &rarr; Nginx service status &rarr; Local curl), adaptive cloud MCQs (HTTPS port 443, Availability Zones, Cloud elasticity).

---

## 6. Strength & Skill Gap Extraction Logic

During scoring, every audited question is classified:
- **Verified Strength**: If the earned-to-max ratio is $\ge 80\%$ ($4/5$ or $5/5$).
- **Priority Skill Gap**: If the earned-to-max ratio is $\le 40\%$ ($1/5$ or $2/5$), or if candidate chose *"none"* or *"not sure"*.
  - *High Priority Gap*: Ratio $\le 25\%$ (Zero exposure or critical error on essential concept).
  - *Medium Priority Gap*: Ratio between $26\%$ and $40\%$.

The top 5 strengths and top 5 skill gaps are dynamically rendered on Page 2 of the student report, complete with supporting evidence derived directly from the candidate's answers.
