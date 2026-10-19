const assert = require("assert"); const { score, band } = require("../assets/js/scoring.js"); const { QB } = require("../assets/js/questions.js");
assert.strictEqual(band(39),"Foundation-building stage"); assert.strictEqual(band(40),"Developing");
assert.strictEqual(band(59),"Developing"); assert.strictEqual(band(60),"Progressing"); assert.strictEqual(band(80),"Strong assessed readiness");
assert.strictEqual(score(QB,{},"AI").overall,null);                       // empty => no evidence, not zero
assert.strictEqual(score(QB,{c11:"ns"},"AI").cats.learn,null);           // Not sure excluded
assert.strictEqual(score(QB,{c11:5,c15:"10+"},"AI").cats.learn,100);
assert.strictEqual(score(QB,{c11:1},"AI").cats.learn,0);
const full={}; QB.forEach(q=>{full[q.id]=q.type==="rating"?5:q.type==="mcq"?q.key:q.type==="yn"?"Yes":q.type==="hours"?"10+":q.o?q.o[0]:"clear target role here"; if(q.type==="rubric")full[q.id+"_r"]=3;});
assert.strictEqual(score(QB,full,"Cloud Computing").overall,100);
console.log("scoring tests passed");
