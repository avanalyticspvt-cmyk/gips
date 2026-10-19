/**
 * Goalfinity Institute — Assessment Platform
 * Unit Test Suite: Recommendation Engine & Learning Pathways
 */

const RecommendationsModule = (typeof Recommendations !== "undefined")
  ? Recommendations
  : (typeof require !== "undefined" ? require("../assets/js/recommendations.js") : null);

function runRecommendationTests(assert) {
  assert.suite("Course Recommendation & Pathway Tests");

  // 1. Starting Level Assignment Logic
  assert.test("Recommends Foundation Bridge Track for low scores (<40)", () => {
    const studentProfile = { studentName: "Rohan Kumar", weeklyHours: "10_to_15" };
    const scoringResults = { overallScore: 32 };
    const rec = RecommendationsModule.generate(studentProfile, "ai", scoringResults);

    assert.strictEqual(rec.startingLevel.key, "foundation");
    assert.strictEqual(rec.startingLevel.badge, "Guided Foundation");
    assert.ok(rec.startingModules.some(m => m.code === "MOD-00"), "Must include Bridge Module MOD-00");
  });

  assert.test("Recommends Core Curriculum Track for mid scores (40–79)", () => {
    const studentProfile = { studentName: "Pooja Verma", weeklyHours: "10_to_15" };
    const scoringResults = { overallScore: 68 };
    const rec = RecommendationsModule.generate(studentProfile, "digital_marketing", scoringResults);

    assert.strictEqual(rec.startingLevel.key, "core");
    assert.strictEqual(rec.startingLevel.badge, "Standard Track");
  });

  assert.test("Recommends Accelerated Project Track for high scores (>=80)", () => {
    const studentProfile = { studentName: "Vikram Mehta", weeklyHours: "15_to_20" };
    const scoringResults = { overallScore: 88 };
    const rec = RecommendationsModule.generate(studentProfile, "cloud_computing", scoringResults);

    assert.strictEqual(rec.startingLevel.key, "accelerated");
    assert.strictEqual(rec.startingLevel.badge, "Advanced Fast-Track");
  });

  // 2. Study Pace & Timeline Calculation
  assert.test("Calculates fast-track timeline (14 weeks) for 15–20 hours/week commitment", () => {
    const studentProfile = { studentName: "Alex", weeklyHours: "15_to_20" };
    const rec = RecommendationsModule.generate(studentProfile, "ai", { overallScore: 70 });

    assert.strictEqual(rec.timelineWeeks, 14);
    assert.ok(rec.paceDescription.includes("14 Weeks"));
  });

  assert.test("Calculates extended timeline (28 weeks) for 5–10 hours/week commitment", () => {
    const studentProfile = { studentName: "Sara", weeklyHours: "5_to_10" };
    const rec = RecommendationsModule.generate(studentProfile, "digital_marketing", { overallScore: 60 });

    assert.strictEqual(rec.timelineWeeks, 28);
    assert.ok(rec.paceDescription.includes("28 Weeks"));
  });

  // 3. Course Specific Content Mapping
  assert.test("Generates 3 curated capstone projects and target job roles for Cloud Computing", () => {
    const rec = RecommendationsModule.generate({ studentName: "David" }, "cloud_computing", { overallScore: 65 });

    assert.strictEqual(rec.portfolioProjects.length, 3);
    assert.ok(rec.portfolioProjects[0].title.includes("Multi-Tier"));
    assert.ok(rec.targetJobRoles.length >= 3);
    assert.ok(rec.targetJobRoles.some(r => r.title.includes("Cloud Engineer")));
  });

  assert.test("Includes mandatory educational disclaimer disclaiming job placement guarantee", () => {
    const rec = RecommendationsModule.generate({ studentName: "David" }, "ai", { overallScore: 65 });

    assert.ok(rec.disclaimer.includes("indicative educational counselling diagnostic"));
    assert.ok(rec.disclaimer.includes("does not guarantee specific employment offers"));
  });
}

// Export for Node/Browser runners
if (typeof module !== "undefined" && module.exports) {
  module.exports = runRecommendationTests;
}
