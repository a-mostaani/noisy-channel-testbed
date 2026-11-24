{
// ================= EDIT HERE =================
// When a segment ships: set its blocks' `st` to "live", add `page` if it has a page,
// bump UPDATED, and add a line to changelog.qmd.
// Status values: "live" | "building" | "planned"
const UPDATED = "24 Nov 2026";

const N = [
 {id:"controller",t:"toc",st:"planned",x:300,y:40,w:300,h:92,title:"Adaptive controller",sub:"Adapts agent and link to protect task success",
  what:"Watches how the link and the conversation are going, and decides how the call should respond. It learns over many calls which responses keep bookings correct under which conditions.",
  when:"Dec 2026 – Jan 2027",
  list:[["Observes","link statistics and signs of trouble in the conversation"],["Acts on","how the agent talks and, where the transport allows it, how the link is configured"],["Optimizes for","a correct booking, at the lowest cost in extra turns, call time and bandwidth"]],
  note:"The research question: protect whether the task succeeds, not how good the audio sounds. Method details follow with the preprint."},
 {id:"caller",t:"eval",st:"planned",x:20,y:250,w:170,h:92,title:"Caller simulator",sub:"LLM caller with a goal",
  what:"An LLM-driven caller that is given a booking goal, speaks it through text-to-speech and listens through speech-to-text, like a real passenger.",
  when:"13 Dec 2026",
  list:[["Built from","an LLM, text-to-speech and speech-to-text"],["Why","scripted goals make every run reproducible and scoreable"]],
  note:"Its goal comes from the task suite, so the evaluator knows the right answer."},
 {id:"channel",t:"toc",st:"planned",x:230,y:250,w:170,h:92,title:"Impaired link",sub:"loss · jitter · bitrate",
  what:"The real-time audio link between caller and agent, degraded in a controlled, repeatable way.",
  when:"13 Dec 2026",
  list:[["Impairments","packet loss, jitter, bandwidth limits, codec bitrate"],["Version 1","network emulation (Linux tc netem) on the caller's side of a hosted voice call"],["Version 2","a self-hosted voice pipeline, where the transport itself can be tuned"]],
  note:"Existing voice-agent benchmarks vary background noise and accents, and existing testbeds compare network types. Neither degrades the link itself in a controlled way."},
 {id:"agent",t:"voice",st:"building",x:440,y:250,w:180,h:92,title:"Voice booking agent",sub:"STT → LLM → TTS",
  what:"A ride-booking voice agent: transcribes the caller, works out intent and booking details, calls the booking API and speaks back.",
  when:"text path 29 Nov; voice 13 Dec 2026",
  list:[["Logic","intent classification, slot filling and confirmation loops"],["Version 1","a hosted voice stack"],["Version 2","a self-hosted, vendor-neutral baseline"]],
  note:"Closed source. It is one system under test; any agent that can call the API can be tested the same way."},
 {id:"api",t:"opt",st:"building",x:660,y:250,w:170,h:92,title:"Booking API",sub:"request · confirm · cancel",page:"segments/booking-api.html",
  what:"A lightweight backend the agent calls as its tools. It keeps bookings consistent and asks the route optimizer whether a trip fits.",
  when:"29 Nov 2026",
  list:[["Endpoints","request trip, check feasibility, confirm, modify, cancel"],["Design","pluggable solver: a simple one now, a stronger one later"]],
  note:"Open, as part of the benchmark."},
 {id:"optimizer",t:"opt",st:"building",x:860,y:250,w:160,h:92,title:"Route optimizer",sub:"insertion → ALNS",page:"segments/booking-api.html",
  what:"Decides whether a requested trip can be inserted into a vehicle's schedule, and where.",
  when:"simple solver 29 Nov; ALNS later",
  list:[["Version 1","simple insertion heuristic or OR-Tools"],["Later","adaptive large neighbourhood search with learned operator selection"]],
  note:"Swappable behind the API without changing the benchmark."},
 {id:"data",t:"opt",st:"building",x:860,y:430,w:160,h:92,title:"Public data",sub:"TTC GTFS · DARP instances",page:"segments/booking-api.html",
  what:"Open data that makes the domain realistic and the benchmark shareable.",
  when:"29 Nov 2026",
  list:[["Transit","TTC GTFS and GTFS-Realtime from Toronto Open Data"],["Demand","public dial-a-ride benchmark instances, such as Cordeau's"]],
  note:"Everything the benchmark runs on is public."},
 {id:"tasks",t:"eval",st:"planned",x:20,y:430,w:260,h:92,title:"Task suite and evaluator",sub:"Goals in, task success out",
  what:"Defines what each simulated caller wants, then checks whether the final booking matches it.",
  when:"Dec 2026",
  list:[["Tasks","scripted ride-booking goals, plus established agent-benchmark domains for comparison with published results"],["Metrics","task success probability and task completion time"],["Feeds","the controller's reward and the measurement study"]],
  note:"A multilingual task set (French, German, English) may follow."},
 {id:"results",t:"eval",st:"planned",x:330,y:450,w:220,h:80,title:"Measurement study",sub:"success vs impairment",
  what:"How task success changes with each impairment, and how much the controller recovers.",
  when:"preprint March 2027",
  list:[["Analysis","confidence intervals, ablations, controller against fixed baselines"],["Output","a preprint, then a conference submission"]],
  note:"Designed as a controlled benchmark that teams can run on their own traffic."}
];
// ============== END OF EDIT HERE ==============

const TRACK={opt:{name:"Route optimization",c:"var(--tb-opt)"},voice:{name:"Voice AI",c:"var(--tb-voice)"},toc:{name:"Task-oriented comms",c:"var(--tb-toc)"},eval:{name:"Evaluation",c:"var(--tb-eval)"}};
const STATUS={live:"Live",building:"Building",planned:"Planned"};
const E=[
 {id:"goal",d:"M100 430 V342",from:"tasks",to:"caller",lab:"goal",lx:106,ly:390,end:1},
 {id:"a1",d:"M190 296 H230",from:"caller",to:"channel",both:1},
 {id:"a2",d:"M400 296 H440",from:"channel",to:"agent",both:1},
 {id:"tool",d:"M620 296 H660",from:"agent",to:"api",lab:"tools",lx:622,ly:288,both:1},
 {id:"solve",d:"M830 296 H860",from:"api",to:"optimizer",both:1},
 {id:"data",d:"M940 430 V342",from:"data",to:"optimizer",lab:"trips, stops",lx:946,ly:392,end:1},
 {id:"obs1",d:"M315 250 V132",from:"channel",to:"controller",lab:"link stats",lx:244,ly:172,end:1},
 {id:"act2",d:"M375 132 V250",from:"controller",to:"channel",lab:"act",lx:380,ly:214,end:1},
 {id:"obs2",d:"M500 250 V132",from:"agent",to:"controller",lab:"call signals",lx:420,ly:172,end:1},
 {id:"act1",d:"M570 132 V250",from:"controller",to:"agent",lab:"act",lx:575,ly:214,end:1},
 {id:"final",d:"M745 342 V395 H250 V430",from:"api",to:"tasks",lab:"final booking",lx:600,ly:389,end:1},
 {id:"reward",d:"M210 430 V91 H300",from:"tasks",to:"controller",lab:"reward",lx:228,ly:84,end:1},
 {id:"res",d:"M280 490 H330",from:"tasks",to:"results",end:1}
];
const STEPS=[
 {n:["tasks","caller"],e:["goal"],t:"The task suite gives the caller a goal: <b>pick-up at Union Station at 08:30, to Toronto General Hospital, 2 passengers</b>."},
 {n:["caller","channel","agent"],e:["a1","a2"],t:"The caller speaks. The audio crosses the impaired link, here with <b>8% packet loss</b> and jitter."},
 {n:["channel","agent","controller"],e:["obs1","obs2"],t:"The controller sees heavy loss and signs that the pickup address was not understood."},
 {n:["controller","agent","channel"],e:["act1","act2"],t:"It changes how the call proceeds, for example by having the agent <b>confirm each detail</b> back."},
 {n:["agent","api"],e:["tool"],t:"The agent fills the booking details and calls the booking API: <b>request trip</b>."},
 {n:["api","optimizer","data"],e:["solve","data"],t:"The API asks the route optimizer whether the trip fits a vehicle schedule built from public data."},
 {n:["agent","channel","caller"],e:["a1","a2","tool"],t:"The agent reads the details back, the caller agrees, and the API <b>confirms the booking</b>."},
 {n:["api","tasks"],e:["final"],t:"The evaluator compares the final booking with the caller's goal. Right pickup, destination, time and passengers means <b>task success</b>."},
 {n:["tasks","controller","results"],e:["reward","res"],t:"Success, minus the cost of extra turns, becomes the controller's reward, and the call is logged for the measurement study."}
];
const NS="http://www.w3.org/2000/svg",svg=document.getElementById("tbMap"),gN=document.getElementById("tbNodes"),gE=document.getElementById("tbEdges");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const stCol={live:"var(--tb-live)",building:"var(--tb-build)",planned:"var(--tb-plan)"};
function el(tag,attrs,parent){const x=document.createElementNS(NS,tag);for(const k in attrs)x.setAttribute(k,attrs[k]);if(parent)parent.appendChild(x);return x}
document.getElementById("tbUpdated").textContent="Updated "+UPDATED;
for(const e of E){const g=el("g",{class:"tb-edge","data-id":e.id},gE);const p=el("path",{d:e.d},g);if(e.end||e.both)p.setAttribute("marker-end","url(#tbArrow)");if(e.both)p.setAttribute("marker-start","url(#tbArrow)");if(e.lab){const t=el("text",{x:e.lx,y:e.ly},g);t.textContent=e.lab}}
for(const n of N){const tr=TRACK[n.t];const g=el("g",{class:"tb-node "+n.st,"data-id":n.id,tabindex:"0",role:"button","aria-label":n.title+", "+STATUS[n.st]},gN);
 el("rect",{class:"tb-box",x:n.x,y:n.y,width:n.w,height:n.h,rx:8},g);
 const b=el("rect",{x:n.x+1,y:n.y+1,width:n.w-2,height:4,rx:2},g);b.style.fill=tr.c;b.style.opacity=n.st==="planned"?.45:1;
 const t1=el("text",{class:"trk",x:n.x+12,y:n.y+24},g);t1.textContent=tr.name;t1.style.fill=tr.c;
 const lab=STATUS[n.st],pw=lab.length*5.6+14,px=n.x+n.w-pw-8,py=n.y+n.h-22;
 const pr=el("rect",{x:px,y:py,width:pw,height:15,rx:7.5,fill:"none","stroke-width":1},g);pr.style.stroke=stCol[n.st];if(n.st==="planned")pr.setAttribute("stroke-dasharray","3 2");
 const pt=el("text",{class:"st",x:px+pw/2,y:py+10.8,"text-anchor":"middle"},g);pt.textContent=lab;pt.style.fill=stCol[n.st];
 const t2=el("text",{class:"ttl",x:n.x+12,y:n.y+46},g);t2.textContent=n.title;
 const t3=el("text",{class:"sub",x:n.x+12,y:n.y+64},g);t3.textContent=n.sub;
 g.addEventListener("click",()=>select(n.id));g.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();select(n.id)}})}
const panel=document.getElementById("tbPanel");
function select(id){const n=N.find(x=>x.id===id),tr=TRACK[n.t];
 document.querySelectorAll(".tb-node").forEach(g=>g.classList.toggle("sel",g.dataset.id===id));
 panel.style.setProperty("--c",tr.c);
 const link=n.page?`<a class="tb-go" href="${esc(n.page)}">Open the segment page</a>`:`<p class="tb-hint">A segment page arrives when this block ships.</p>`;
 panel.innerHTML=`<span class="trk">${tr.name}</span><h2>${esc(n.title)}</h2><div><span class="pill ${n.st}">${STATUS[n.st]}</span> <span class="tb-hint">${esc(n.when)}</span></div><p>${esc(n.what)}</p><dl>${n.list.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl><p class="tb-hint">${esc(n.note)}</p>${link}`}
function highlight(nodes,edges){const on=nodes&&nodes.length;svg.classList.toggle("dim",!!on);
 document.querySelectorAll(".tb-node").forEach(g=>g.classList.toggle("on",!!on&&nodes.includes(g.dataset.id)));
 document.querySelectorAll(".tb-edge").forEach(g=>g.classList.toggle("on",!!on&&edges.includes(g.dataset.id)))}
const chips=[...document.querySelectorAll(".tb-chip")];
chips.forEach(c=>c.addEventListener("click",()=>{stopPlay();setStep(-1);chips.forEach(x=>x.setAttribute("aria-pressed",x===c?"true":"false"));const t=c.dataset.track;
 if(t==="all"){highlight(null,null);return}
 const ns=N.filter(n=>n.t===t).map(n=>n.id);const es=E.filter(e=>ns.includes(e.from)&&ns.includes(e.to)).map(e=>e.id);highlight(ns,es);select(ns[0])}));
const stepsEl=document.getElementById("tbSteps"),stepText=document.getElementById("tbStepText");let cur=-1,timer=null;
STEPS.forEach((s,i)=>{const li=document.createElement("li");const b=document.createElement("button");b.className="tb-step";b.textContent=String(i+1);b.setAttribute("aria-label","Step "+(i+1));b.addEventListener("click",()=>{stopPlay();setStep(i)});li.appendChild(b);stepsEl.appendChild(li)});
const idle="Press Play, or pick a step, to follow one ride booking through the system.";
function setStep(i){cur=i;[...stepsEl.querySelectorAll(".tb-step")].forEach((b,j)=>{if(j===i)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current")});
 if(i<0){stepText.textContent=idle;highlight(null,null);return}
 chips.forEach(x=>x.setAttribute("aria-pressed",x.dataset.track==="all"?"true":"false"));
 const s=STEPS[i];stepText.innerHTML=`<b>Step ${i+1} of ${STEPS.length}.</b> `+s.t;highlight(s.n,s.e)}
const playBtn=document.getElementById("tbPlay");
function stopPlay(){if(timer){clearInterval(timer);timer=null}playBtn.textContent="Play"}
playBtn.addEventListener("click",()=>{if(timer){stopPlay();return}if(cur>=STEPS.length-1||cur<0)setStep(0);else setStep(cur+1);playBtn.textContent="Pause";timer=setInterval(()=>{if(cur>=STEPS.length-1){stopPlay();return}setStep(cur+1)},2600)});
document.getElementById("tbNext").addEventListener("click",()=>{stopPlay();setStep(Math.min(cur+1,STEPS.length-1))});
document.getElementById("tbPrev").addEventListener("click",()=>{stopPlay();setStep(Math.max(cur-1,0))});
document.getElementById("tbClear").addEventListener("click",()=>{stopPlay();setStep(-1)});
select("api");setStep(-1);
}
