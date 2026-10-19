// Question bank. Edit here only. type: rating|choice|text|clarity|hours|yn|mcq|rubric
// cat: found|prac|goal|learn|prof. rubric = counsellor scores the answer 0-3 (guide in q.guide).
const SCALE = [[1,"1 — Beginner"],[2,"2 — Basic"],[3,"3 — Intermediate"],[4,"4 — Advanced"],[5,"5 — Highly confident"],["ns","Not sure"]];
const QB = [
 {id:"c4",sec:"common",type:"clarity",cat:"goal",t:"What motivated you to explore this course?"},
 {id:"c5",sec:"common",type:"text",t:"Any relevant certifications, internships, courses or projects? (optional)"},
 {id:"c6",sec:"common",type:"clarity",cat:"goal",t:"Primary goal",o:["First job","Career switch","Promotion or advancement","Freelancing","Starting a business","Upskilling in current role","Exploring career options"],low:["Exploring career options"]},
 {id:"c7",sec:"common",type:"clarity",cat:"goal",t:"Job role you want in the next 6–12 months"},
 {id:"c8",sec:"common",type:"text",t:"Salary range targeted (optional – never required)"},
 {id:"c9",sec:"common",type:"clarity",cat:"goal",t:"When would you like to start working in the field?",o:["Immediately","Within 3 months","3–6 months","6–12 months","Not sure"],low:["Not sure"]},
 {id:"c10",sec:"common",type:"choice",t:"Open to internships / entry-level / project-based experience?",o:["Internships","Entry-level roles","Project-based work","Not open","Not sure"]},
 {id:"c11",sec:"common",type:"rating",cat:"learn",t:"Comfort with computers and common digital tools"},
 {id:"c12",sec:"common",type:"rating",cat:"prof",t:"Comfort with professional English communication and interviews"},
 {id:"c13",sec:"common",type:"rating",cat:"found",t:"Logical thinking and problem-solving"},
 {id:"c14",sec:"common",type:"yn",cat:"prof",t:"Has the student independently completed a practical project (campaign, dashboard, website, app, etc.)?"},
 {id:"c15",sec:"common",type:"hours",cat:"learn",t:"Hours per week the student can realistically dedicate",o:["<3","3-5","6-10","10+"]},
 {id:"ai1",course:"AI",sec:"course",type:"rating",cat:"found",t:"Programming (Python or other)"},
 {id:"ai2",course:"AI",sec:"course",type:"rating",cat:"found",t:"Basic maths, percentages, graphs, statistics"},
 {id:"ai3",course:"AI",sec:"course",type:"choice",t:"Most interesting area",o:["AI tools","AI application development","Machine learning","Generative AI"]},
 {id:"ai4",course:"AI",sec:"practical",type:"mcq",cat:"found",t:"Which best describes machine learning?",o:["Rules written explicitly by a programmer","A system that learns patterns from data to make predictions","A faster type of computer","A kind of database"],key:1},
 {id:"ai5",course:"AI",sec:"practical",type:"mcq",cat:"found",t:"Which information would best help predict customer churn?",o:["Favourite colour","Usage history, complaints, subscription length","Company logo","Office address"],key:1},
 {id:"ai6",course:"AI",sec:"practical",type:"rubric",cat:"prac",t:"A company wants to predict house prices from location, area and bedrooms. What data would you need and how might AI help?",guide:"0 none/off-topic; 1 names features only; 2 + historical price data & learning patterns; 3 + training/testing, accuracy or data quality."},
 {id:"dm1",course:"Digital Marketing",sec:"course",type:"rating",cat:"found",t:"Writing captions, ads or promotional content"},
 {id:"dm2",course:"Digital Marketing",sec:"course",type:"choice",t:"Most interesting area",o:["Content creation","SEO","Paid ads","Social media","Marketing analytics"]},
 {id:"dm3",course:"Digital Marketing",sec:"practical",type:"mcq",cat:"found",t:"Organic vs paid marketing?",o:["They are the same","Organic grows reach without paying for placement; paid buys reach","Paid is only for TV","Organic needs ad budgets"],key:1},
 {id:"dm4",course:"Digital Marketing",sec:"practical",type:"mcq",cat:"found",t:"To judge ad ROI, which is most useful?",o:["Follower count","Cost per lead and how many leads became sales","Number of posts","Colour of the ad"],key:1},
 {id:"dm5",course:"Digital Marketing",sec:"practical",type:"rubric",cat:"prac",t:"How would you promote a new café to people within 5 km?",guide:"0 none; 1 generic ('use Instagram'); 2 + local targeting/offers; 3 + audience, channels, budget, measurement."},
 {id:"dm6",course:"Digital Marketing",sec:"practical",type:"rubric",cat:"prac",t:"₹10,000 ad spend gave 50 enquiries. What else would you need to know to judge success?",guide:"0 none; 1 'sales'; 2 + conversion / cost per enquiry; 3 + margin, customer value, lead quality."},
 {id:"cl1",course:"Cloud Computing",sec:"course",type:"rating",cat:"found",t:"Linux / command-line use"},
 {id:"cl2",course:"Cloud Computing",sec:"course",type:"choice",t:"Most interesting area",o:["Cloud support","Cloud administration","Cloud engineering","DevOps"]},
 {id:"cl3",course:"Cloud Computing",sec:"practical",type:"mcq",cat:"found",t:"Public vs private IP address?",o:["No difference","Public is reachable on the internet; private is used inside a local network","Private is faster","Public is only for email"],key:1},
 {id:"cl4",course:"Cloud Computing",sec:"practical",type:"yn",cat:"prac",t:"Has the student used AWS, Azure or Google Cloud hands-on?"},
 {id:"cl5",course:"Cloud Computing",sec:"practical",type:"rubric",cat:"prac",t:"A cloud-hosted website is unreachable. What would you check first?",guide:"0 none; 1 'restart it'; 2 + server running, DNS/IP; 3 + firewall/security group, ports, logs, systematic order."}
];
if (typeof module !== "undefined") module.exports = { QB, SCALE };
