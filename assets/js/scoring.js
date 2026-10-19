// Transparent scoring. Unanswered / "Not sure" => null (excluded, never zero).
const WEIGHTS = { found:.30, prac:.30, goal:.15, learn:.15, prof:.10 };
const CAT_NAMES = { found:"Foundational knowledge", prac:"Practical skills", goal:"Career goal clarity", learn:"Learning readiness", prof:"Professional readiness" };
const BANDS = [[80,"Strong assessed readiness"],[60,"Progressing"],[40,"Developing"],[0,"Foundation-building stage"]];
const HRS = { "<3":.25, "3-5":.5, "6-10":.75, "10+":1 };
function itemScore(q, v, r) {
  const blank = v === undefined || v === null || String(v).trim() === "";
  if (q.type === "rubric") return (r === undefined || r === "" || r === "na") ? null : Number(r) / 3;
  if (blank || v === "ns") return null;
  switch (q.type) {
    case "rating": return (Number(v) - 1) / 4;
    case "mcq": return Number(v) === q.key ? 1 : 0;
    case "yn": return v === "Yes" ? 1 : v === "No" ? 0 : null;
    case "hours": return HRS[v] ?? null;
    case "clarity": return q.o ? ((q.low || []).includes(v) ? .5 : 1) : (String(v).trim().split(/\s+/).length >= 3 ? 1 : .5);
    default: return null;
  }
}
function band(n) { return n === null ? "Insufficient evidence" : BANDS.find(b => n >= b[0])[1]; }
function score(QB, ans, course) {
  const qs = QB.filter(q => q.cat && (q.sec === "common" || q.course === course));
  const acc = {}, items = [];
  qs.forEach(q => {
    const s = itemScore(q, ans[q.id], ans[q.id + "_r"]);
    items.push({ id: q.id, cat: q.cat, score: s === null ? null : +s.toFixed(3) });
    if (s !== null) { acc[q.cat] = acc[q.cat] || { s: 0, n: 0 }; acc[q.cat].s += s; acc[q.cat].n++; }
  });
  const cats = {}; let ws = 0, tot = 0;
  Object.keys(WEIGHTS).forEach(k => {
    cats[k] = acc[k] ? Math.round(acc[k].s / acc[k].n * 100) : null;
    if (cats[k] !== null) { ws += WEIGHTS[k]; tot += WEIGHTS[k] * cats[k]; }
  });
  const overall = ws ? Math.round(tot / ws) : null;
  return { cats, overall, band: band(overall), coverage: Math.round(ws * 100), items };
}
if (typeof module !== "undefined") module.exports = { score, band, itemScore, WEIGHTS };
