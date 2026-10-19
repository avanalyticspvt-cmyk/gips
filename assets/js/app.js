const $ = s => document.querySelector(s), app = $("#app");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const STEPS = ["intake","common","course","practical","review","report"], LABEL = ["Register","Career assessment","Course questions","Practical","Review","Report"];
const COURSES = ["Artificial Intelligence","Digital Marketing","Cloud Computing"], CKEY = { "Artificial Intelligence":"AI" };
const MODS = {
 AI:["Digital & computational foundations","Python programming","Data analysis & visualization","Statistics & data preparation","Machine learning","Generative AI applications","Portfolio projects & interview prep"],
 "Digital Marketing":["Marketing fundamentals","Content strategy & copywriting","SEO","Social media management","Paid advertising","Campaign measurement & analytics","Portfolio campaigns & interview prep"],
 "Cloud Computing":["IT & networking fundamentals","Linux & command line","Cloud architecture basics","AWS/Azure practical labs","Security fundamentals","Deployment & monitoring","Portfolio projects & interview prep"]};
const ROLES = { AI:["AI/ML trainee","Junior data analyst","Prompt/AI tools associate"], "Digital Marketing":["Digital marketing executive","SEO/content associate","Social media executive"], "Cloud Computing":["Cloud support associate","Junior cloud administrator","DevOps trainee"] };
const PROJ = { AI:["Spreadsheet-to-Python data analysis","House-price prediction model","Simple chatbot"], "Digital Marketing":["Local-business campaign plan","SEO audit of a small site","Ad performance report"], "Cloud Computing":["Host a static site on a cloud VM","Linux server hardening checklist","Monitoring dashboard"] };
const HPW = { "<3":2,"3-5":4,"6-10":8,"10+":12 };
const S = { step:0, intake:{}, ans:{}, notes:"", id:null, saved:null, busy:false, errs:{} };
const newId = () => "GF-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase();
const ck = () => CKEY[S.intake.course] || S.intake.course;
const qs = sec => QB.filter(q => q.sec === sec && (!q.course || q.course === ck()));
// Draft: answers only, never contact details
const saveDraft = () => { try { localStorage.setItem("gf_draft", JSON.stringify({ course:S.intake.course, ans:S.ans, notes:S.notes })); } catch(e){} };
const clearDraft = () => { try { localStorage.removeItem("gf_draft"); } catch(e){} };
function validate(i) {
  const e = {}, p = String(i.mobile||"").replace(/[\s\-().]/g,"");
  if (!i.name || i.name.trim().length < 2) e.name = "Enter the student's full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.email||"")) e.email = "Enter a valid email address.";
  if (!/^\+[1-9]\d{6,14}$/.test(p)) e.mobile = "Enter the mobile number with country code, e.g. +91 98xxxxxxxx.";
  if (!COURSES.includes(i.course)) e.course = "Select a course.";
  if (!i.consent) e.consent = "Consent is required to continue.";
  return e;
}
function recommend() {
  const c = ck(), r = score(QB, S.ans, c), mods = MODS[c], lvl = r.overall === null ? 0 : r.overall < 40 ? 0 : r.overall < 60 ? 1 : r.overall < 80 ? 2 : 3;
  const ev = Object.entries(r.cats).filter(([,v]) => v !== null);
  const strengths = ev.filter(([,v]) => v >= 70).map(([k,v]) => `${CAT_NAMES[k]} (${v}%)`), gaps = ev.filter(([,v]) => v < 50).map(([k,v]) => `${CAT_NAMES[k]} (${v}%)`);
  const seq = mods.slice(lvl), hrs = HPW[S.ans.c15], weeks = hrs ? Math.ceil(seq.length * 30 / hrs) : null;
  const goalOk = S.ans.c6 && S.ans.c6 !== "Exploring career options";
  return { r, level:r.band, strengths, gaps, start:seq[0], seq, projects:PROJ[c], roles:ROLES[c], weeks,
    next: goalOk ? "Book a counselling session to review this roadmap and confirm the starting module." : "Goal is still exploratory: hold a further career-counselling conversation before recommending a course." };
}
function nav() { return `<div class="prog no-print"><i style="width:${S.step/5*100}%"></i></div><p class="no-print"><b>Step ${S.step+1} of 6:</b> ${LABEL[S.step]}</p>`; }
function fld(id,l,t="text",extra="") { return `<label for="${id}">${l}${extra.includes("req")?' <span class="req">*</span>':""}</label><input id="${id}" type="${t}" value="${esc(S.intake[id])}" aria-describedby="e_${id}"><div class="err" id="e_${id}" role="alert">${esc(S.errs[id])}</div>`; }
function intakeView() {
  const i = S.intake, ops = (a,v) => a.map(x => `<option ${x===v?"selected":""}>${esc(x)}</option>`).join("");
  app.innerHTML = `<div class="card"><h1>Student Career Readiness Assessment</h1>${nav()}
  <p>Fields marked <span class="req">*</span> are required.</p>${fld("name","Full name","text","req")}${fld("email","Email address","email","req")}${fld("mobile","Mobile number (with country code)","tel","req")}
  <label for="course">Preferred course <span class="req">*</span></label><select id="course"><option value="">Select…</option>${ops(COURSES,i.course)}</select><div class="err" role="alert">${esc(S.errs.course)}</div>
  ${fld("education","Highest qualification")}${fld("specialization","Specialization / degree subject")}
  <label for="status">Current status</label><select id="status">${ops(["Studying","Employed","Unemployed","Career transition"],i.status||"Studying")}</select>
  ${fld("jobTitle","Current job title (if applicable)")}${fld("experience","Years of experience (if applicable)","number")}
  <label for="mode">Preferred learning mode</label><select id="mode">${ops(["Not specified","Classroom","Online","Hybrid"],i.mode)}</select>
  <p class="guide">Privacy notice: Goalfinity Institute uses these details for counselling, assessment reporting and relevant follow-up. Data is stored in a private Google Sheet.</p>
  <label><input type="checkbox" id="consent" style="width:auto" ${i.consent?"checked":""}> The student consents to the collection and storage of this information. <span class="req">*</span></label><div class="err" role="alert">${esc(S.errs.consent)}</div>
  <button id="next">Start assessment</button><button class="alt" id="clr">Clear saved draft</button></div>`;
  $("#clr").onclick = () => { clearDraft(); S.ans = {}; S.notes = ""; alert("Saved draft answers cleared."); };
  $("#next").onclick = () => {
    ["name","email","mobile","education","specialization","jobTitle","experience"].forEach(k => S.intake[k] = $("#"+k).value.trim());
    Object.assign(S.intake, { course:$("#course").value, status:$("#status").value, mode:$("#mode").value, consent:$("#consent").checked });
    S.errs = validate(S.intake); if (Object.keys(S.errs).length) return intakeView();
    S.intake.mobile = S.intake.mobile.replace(/[\s\-().]/g,""); S.id = S.id || newId();
    try { const d = JSON.parse(localStorage.getItem("gf_draft")||"null"); if (d && d.course === S.intake.course && !Object.keys(S.ans).length) { S.ans = d.ans; S.notes = d.notes; } } catch(e){}
    S.step = 1; render();
  };
}
function qView(q) {
  const v = S.ans[q.id] ?? "", n = `a_${q.id}`;
  let inp;
  if (q.type === "rating") inp = `<div class="opts">${SCALE.map(([k,l]) => `<label><input type="radio" name="${n}" value="${k}" ${String(v)===String(k)?"checked":""}> ${l}</label>`).join("")}</div>`;
  else if (q.type === "yn") inp = `<div class="opts">${["Yes","No","Not sure"].map(k => `<label><input type="radio" name="${n}" value="${k}" ${v===k?"checked":""}> ${k}</label>`).join("")}</div>`;
  else if (q.o) inp = `<div class="opts">${q.o.map((k,ix) => { const val = q.type==="mcq"?ix:k; return `<label><input type="radio" name="${n}" value="${esc(val)}" ${String(v)===String(val)?"checked":""}> ${esc(k)}</label>`; }).join("")}</div>`;
  else inp = `<textarea name="${n}" rows="2" aria-label="${esc(q.t)}">${esc(v)}</textarea>`;
  const rub = q.type === "rubric" ? `<p class="guide">Counsellor rubric: ${esc(q.guide)}</p><label>Counsellor score <select name="r_${q.id}"><option value="">Not assessed</option>${[0,1,2,3].map(x => `<option ${String(S.ans[q.id+"_r"])===String(x)?"selected":""}>${x}</option>`).join("")}</select></label>` : "";
  return `<div class="q"><p><b>${esc(q.t)}</b></p>${inp}${rub}</div>`;
}
function collect() {
  app.querySelectorAll("input[type=radio]:checked,textarea,select[name^=r_]").forEach(el => {
    const nm = el.name; if (!nm) return;
    if (nm.startsWith("a_")) S.ans[nm.slice(2)] = el.value; else if (nm.startsWith("r_")) S.ans[nm.slice(2)+"_r"] = el.value;
  }); const n = $("#notes"); if (n) S.notes = n.value; saveDraft();
}
function sectionView(sec, title) {
  app.innerHTML = `<div class="card">${nav()}<h2>${title}</h2><p class="guide">Optional questions may be skipped; skipped or “Not sure” answers are not scored as zero. Self-ratings are not verified skills.</p>${qs(sec).map(qView).join("")}
  ${sec==="practical"?`<label for="notes">Counsellor observations (internal – not printed in the student report)</label><textarea id="notes" rows="3">${esc(S.notes)}</textarea>`:""}
  <button class="alt" id="prev">Previous</button><button id="next">Next</button></div>`;
  $("#prev").onclick = () => { collect(); S.step--; render(); }; $("#next").onclick = () => { collect(); S.step++; render(); };
}
function reviewView() {
  const all = [...qs("common"),...qs("course"),...qs("practical")];
  app.innerHTML = `<div class="card">${nav()}<h2>Review</h2><p><b>${esc(S.intake.name)}</b> · ${esc(S.intake.email)} · ${esc(S.intake.mobile)} · ${esc(S.intake.course)}</p>
  <p>Answered ${all.filter(q => S.ans[q.id]!==undefined && S.ans[q.id]!=="").length} of ${all.length} questions. Unanswered questions are excluded from scoring.</p>
  <button class="alt" id="prev">Previous</button><button id="next">Calculate, save & generate report</button></div>`;
  $("#prev").onclick = () => { S.step--; render(); }; $("#next").onclick = async () => { S.step = 5; await submit(); };
}
function payload() {
  const R = recommend(), i = S.intake, c = ck(), r = R.r, now = new Date().toISOString();
  const rec = { Assessment_ID:S.id, Assessment_Date:now, Schema_Version:CONFIG.SCHEMA_VERSION, Student_Name:i.name, Student_Email:i.email, Student_Mobile:i.mobile, Consent_Status:"Given", Course_Interest:i.course,
   Education:i.education, Specialization:i.specialization, Current_Status:i.status, Current_Job_Title:i.jobTitle, Experience_Years:i.experience, Motivation:S.ans.c4, Primary_Career_Goal:S.ans.c6, Target_Job_Role:S.ans.c7, Salary_Expectation:S.ans.c8, Target_Timeline:S.ans.c9, Internship_Flexibility:S.ans.c10,
   Digital_Skills_Score:S.ans.c11, Communication_Score:S.ans.c12, Problem_Solving_Score:S.ans.c13, Project_Experience:S.ans.c14, Weekly_Learning_Hours:S.ans.c15,
   Foundational_Knowledge_Score:r.cats.found, Practical_Skills_Score:r.cats.prac, Career_Clarity_Score:r.cats.goal, Learning_Readiness_Score:r.cats.learn, Professional_Readiness_Score:r.cats.prof, Overall_Readiness_Score:r.overall, Readiness_Band:r.band,
   Strengths:R.strengths.join("; "), Skill_Gaps:R.gaps.join("; "), Recommended_Course_Path:R.seq.join(" > "), Recommended_Modules:R.seq.slice(0,3).join("; "), Recommended_Projects:R.projects.join("; "), Suggested_Job_Roles:R.roles.join("; "), Career_Action_Plan:R.next,
   Practical_Assessment_Score:r.cats.prac, Question_Responses_JSON:JSON.stringify(S.ans), Counsellor_Notes:S.notes };
  const rows = QB.filter(q => q.sec==="common" || q.course===c).map(q => { const s = itemScore(q, S.ans[q.id], S.ans[q.id+"_r"]); const a = S.ans[q.id];
    return { Assessment_ID:S.id, Question_ID:q.id, Course:i.course, Question_Category:q.cat||"info", Question_Text:q.t, Student_Response:q.type==="mcq"&&a!==undefined&&a!==""?q.o[a]:(a??""), Score:s===null?"":+s.toFixed(2), Maximum_Score:q.cat?1:"", Scoring_Method:q.type, Evidence_Notes:q.type==="rubric"?"Counsellor rubric 0-3: "+(S.ans[q.id+"_r"]??"not assessed"):"" }; });
  return { action:"submit", rec, rows };
}
async function submit() {
  if (S.busy) return; S.busy = true; S.saved = { state:"pending" }; render();
  try {
    if (!CONFIG.ENDPOINT) throw new Error("Apps Script endpoint is not configured (assets/js/config.js). The assessment was NOT saved.");
    const res = await fetch(CONFIG.ENDPOINT, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body:JSON.stringify(payload()) });
    const j = await res.json(); if (!j.ok) throw new Error(j.error || "Server rejected the submission.");
    S.saved = { state:"ok", dup:j.duplicate }; clearDraft();
  } catch (e) { S.saved = { state:"fail", msg:e.message }; }
  S.busy = false; render();
}
function reportView() {
  const R = recommend(), i = S.intake, r = R.r, d = new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
  const st = S.saved || {}, ban = st.state==="ok" ? `<div class="banner ok">Saved to Google Sheets${st.dup?" (already recorded earlier)":""}.</div>` : st.state==="pending" ? `<div class="banner">Saving…</div>` : `<div class="banner bad" role="alert">NOT SAVED: ${esc(st.msg)} <button id="retry">Retry save</button></div>`;
  const bars = Object.entries(r.cats).map(([k,v]) => `<p><b>${CAT_NAMES[k]}</b>: ${v===null?"Insufficient evidence":v+"%"}</p><div class="bar" role="img" aria-label="${CAT_NAMES[k]} ${v===null?"no evidence":v+" percent"}"><i style="width:${v||0}%"></i></div>`).join("");
  const li = a => a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "<p>None identified from the available evidence.</p>";
  const pr = QB.filter(q => q.sec==="practical" && (!q.course||q.course===ck())).map(q => { const s = itemScore(q,S.ans[q.id],S.ans[q.id+"_r"]); return `<li>${esc(q.t)} — ${s===null?"not assessed":Math.round(s*100)+"%"}</li>`; }).join("");
  app.innerHTML = `<div class="no-print">${ban}<button onclick="window.print()">Print Report</button><button onclick="window.print()">Download / Save as PDF</button><button class="alt" id="newa">New Assessment</button><p class="guide">“Save as PDF” opens the browser print dialog; choose “Save as PDF” as the destination.</p></div>
  <section class="page"><h1>GOALFINITY INSTITUTE</h1><h2>Student Career Readiness Report</h2><p>Discover Your Skills. Build Your Future.</p>
   <p><b>${esc(i.name)}</b><br>${esc(i.email)} · ${esc(i.mobile)}<br>Assessment ID: ${esc(S.id)} · ${d}</p><p>Course: ${esc(i.course)}<br>Education: ${esc([i.education,i.specialization].filter(Boolean).join(", ")||"Not provided")}<br>Career goal: ${esc(S.ans.c6||"Not provided")}${S.ans.c7?" – "+esc(S.ans.c7):""}</p>
   <h2>Overall readiness: ${r.overall===null?"Insufficient evidence":r.overall+" / 100"}</h2><p><b>${esc(r.band)}</b> (internal guidance band, not a validated cutoff). Evidence coverage: ${r.coverage}% of weighting.</p></section>
  <section class="page"><h2>Skills assessment</h2>${bars}<h3>Demonstrated strengths</h3>${li(R.strengths)}<h3>Areas to develop</h3>${li(R.gaps)}<h3>Practical assessment</h3><ul>${pr}</ul></section>
  <section class="page"><h2>Personalized learning roadmap</h2><p>Recommended starting point: <b>${esc(R.start)}</b></p><ol>${R.seq.map(m=>`<li>${esc(m)}</li>`).join("")}</ol><h3>Suggested portfolio projects</h3>${li(R.projects)}<p>Indicative timeline: ${R.weeks?`about ${R.weeks} weeks at ${esc(S.ans.c15)} hrs/week (assumes ~30 hrs per module; an estimate only)`:"not estimated (study hours not provided)"}.</p></section>
  <section class="page"><h2>Career pathway & Goalfinity support</h2><h3>Entry-level roles to explore</h3>${li(R.roles)}<p>Proposed support: structured learning, guided practical projects, skill-gap reviews and career preparation.</p><p><b>Next counselling step:</b> ${esc(R.next)}</p>
   <p class="guide">This is an indicative educational assessment, not a validated aptitude or employability test. It does not predict or guarantee employment, salary or placement.</p></section>`;
  const nb = $("#newa"); if (nb) nb.onclick = () => { if (confirm("Start a new assessment? This clears the current report.")) { Object.assign(S,{step:0,intake:{},ans:{},notes:"",id:null,saved:null,errs:{}}); render(); } };
  const rb = $("#retry"); if (rb) rb.onclick = submit;
}
function render() { window.scrollTo(0,0); [intakeView,()=>sectionView("common","Common career assessment"),()=>sectionView("course",S.intake.course+" – course questions"),()=>sectionView("practical","Practical assessment"),reviewView,reportView][S.step](); }
render();
