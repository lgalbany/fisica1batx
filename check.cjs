const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{value:'',innerHTML:'',textContent:'',hidden:false,disabled:false,open:false,dataset:{},events:{},classList:{add(){},remove(){},toggle(){}},addEventListener(n,f){this.events[n]=f;},setAttribute(){},removeAttribute(){},focus(){},click(){},showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(id);}
const memory=new Map();
const ctx=vm.createContext({console,Intl,Math,Date,Number,String,JSON,Object,Array,Boolean,Error,Map,Set,document:{querySelector:node,querySelectorAll:()=>[],title:''},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},location:{hash:''},window:{addEventListener(){}},scrollTo(){},setTimeout(){},clearTimeout(){}});
vm.runInContext(fs.readFileSync('docs/data.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('docs/exam.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('docs/app.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('BANK.length'),90);
assert.equal(run('new Set(BANK.map(e=>e.id)).size'),90);
assert.equal(run('BANK.every((e,i)=>e.id===i+1&&e.hints.length>=2&&e.steps.length>=1&&e.fields.length>0)'),true);
assert.equal(run('BANK.every(e=>e.fields.every(f=>f.options?f.options.includes(f.value):Number.isFinite(f.value)))'),true);
for(const [raw,v] of [['1,25',1.25],['2*pi',2*Math.PI],['sqrt(5)',Math.sqrt(5)],['1/18',1/18],['−2^2',-4],['2^-2',.25],['1E3',1000],['(2+3)*4',20],['2^3^2',512]])assert.ok(Math.abs(run(`parseNumber(${JSON.stringify(raw)})`)-v)<1e-10,raw);
for(const raw of ['','1/0','sqrt(-1)','alert(1)','NaN','2+','1;2','Infinity','<script>'])assert.throws(()=>run(`parseNumber(${JSON.stringify(raw)})`),raw);
assert.equal(run('isCorrect({value:0},"0,1")'),false);
assert.equal(run('isCorrect({value:-10},"10")'),false);
assert.equal(run('isCorrect({value:100},"100,5")'),true);
assert.equal(run('isCorrect({value:100},"102")'),false);
// Verify independent physical invariants on corrected source exercises.
assert.equal(run('BANK[13].fields.find(f=>f.label==="A").value'),1/18);
assert.equal(run('BANK[20].fields[0].value'),(4-2)/2);
assert.ok(Math.abs(run('BANK[37].fields[2].value')-((120/3.6)**2/(2*((120-90)/3.6/5))))<1e-10);
assert.equal(run('BANK[39].fields[1].value'),80-5*3.5**2);
// Exercise all routes and answer interactions without browser infrastructure.
for(let id=1;id<=90;id++){
 run(`location.hash='#exercici/${id}';render();`);
 const e=run(`BANK[${id-1}]`);
 e.fields.forEach((f,i)=>{node('#answer-'+i).value=String(f.value);});
 node('#answer-form').events.submit({preventDefault(){}});
 assert.equal(run(`state.records[${id}].status`),'done',`exercise ${id}`);
 assert.ok(node('#feedback').textContent.startsWith(`${e.fields.length} de ${e.fields.length}`));
}
for(const route of ['#examen','#simulacre/74','#simulacre/90','#simulacre/999','#inici','#dossier','#dossier/3','#entrena','#progres','#exercici/999'])run(`location.hash='${route}';render();`);
assert.equal(run('counts().done'),90);
// Two hundred random problems of each model must match independent equations.
for(let type=0;type<7;type++)for(let i=0;i<200;i++){
 const e=run(`makeTraining(${type})`);
 assert.ok(e.fields.every(f=>Number.isFinite(f.value)));
 if(type===0)assert.ok(Math.abs(e.fields[2].value-Math.hypot(e.fields[0].value,e.fields[1].value))<1e-8);
 if(type===3)assert.ok(Math.abs(e.fields[1].value+9.8*e.fields[0].value)<1e-8);
 if(type===4)assert.ok(Math.abs(e.fields[1].value-e.graph.v*e.fields[0].value)<1e-8);
 if(type===5){const [T,R,H]=e.fields.map(f=>f.value);assert.ok(Math.abs(H-9.8*T*T/8)<1e-8);assert.ok(Math.abs(R-e.graph.v*Math.cos(e.graph.angle*Math.PI/180)*T)<1e-8);}
}
// Revealing a solution must not later be counted as an unaided resolution.
run("delete state.records[9];location.hash='#exercici/9';render();");
node('#solution').open=true;node('#solution').events.toggle();
node('#answer-0').value='2';node('#answer-form').events.submit({preventDefault(){}});
assert.equal(run('state.records[9].status'),'consulted');
// State restoration must reject unknown records and strip HTML from rendering.
assert.equal(run('Object.keys(sanitize({records:{999:{status:"done"}}}).records).length'),0);
assert.equal(run('esc("<img onerror=alert(1)>")'),'&lt;img onerror=alert(1)&gt;');
assert.ok(fs.readFileSync('docs/index.html','utf8').includes('lang="ca"'));
console.log('Passed: 90 exercise flows, 1,400 generated problems, arithmetic parser, corrected physics, progress and import validation.');

// Independent checks against kinematics, including delayed-start domains.
const exam=letter=>run(`BANK.find(e=>e.label===${JSON.stringify(letter)})`);
const field=(e,label)=>e.fields.find(f=>f.label===label).value;
let a=exam('A'),t=field(a,'d) Instant de trobada des de t = 0');
assert.ok(t>=2&&t<32);assert.ok(Math.abs((t-2)**2-25*t)<1e-9);
let c=exam('C');for(const label of ['d) Instant de pujada a 3,05 m','d) Instant de baixada a 3,05 m']){const t=field(c,label);assert.ok(Math.abs(2.05+15*Math.sin(52*Math.PI/180)*t-5*t*t-3.05)<1e-10);}
let d=exam('D'),v=field(d,'d) Velocitat inicial límit'),dt=20/(.8*v);assert.ok(Math.abs(1.5+.6*v*dt-5*dt*dt-4)<1e-10);
let f=exam('F'),ft=field(f,'e) Temps d’impacte al terreny exterior');assert.ok(ft>0&&15*ft>12);assert.ok(Math.abs(-8+20*ft-5*ft*ft)<1e-10);
for(let n=0;n<6;n++){const e=exam('V'+(n+1));assert.equal(e.fields[6].value,e.fields[4].value/2);assert.equal(e.fields[7].value,e.fields[5].value/2);}
// New exports retain both original and exam records, old exports still restore.
assert.equal(run('Object.keys(sanitize({records:{1:{status:"done"},74:{status:"done"},90:{status:"started"}}}).records).length'),3);
assert.equal(run('Object.keys(sanitize({records:{1:{status:"done"}}}).records).length'),1);
// Exam answers start independently of practice; solutions unlock only on submission.
run("location.hash='#simulacre/74';render();");
assert.equal(node('#solution').hidden,true);assert.equal(node('#hint-button').hidden,true);
const attempt=exam('A');attempt.fields.forEach((f,i)=>node('#answer-'+i).value=String(f.value));
node('#answer-form').events.submit({preventDefault(){}});
assert.equal(node('#solution').hidden,false);assert.equal(run('current.record.status'),'done');
const trainingBefore=run('state.trainingCount');
assert.equal(trainingBefore,0);
run("location.hash='#simulacre/74';render();");
assert.equal(run('current.record.submitted'),true);
node('#new-exam-attempt').onclick();
assert.equal(run('current.record.values.length'),0);assert.equal(node('#solution').hidden,true);
console.log('Passed: exam isolation, submission, restart, persistence, backward-compatible progress, and independent physical invariants.');

run("current.record.note='Notes de prova';persist();");
assert.equal(run('sanitize(JSON.parse(localStorage.getItem(KEY))).attempts[74].note'),'Notes de prova');
run("$('#reset-confirm').onclick();");
assert.equal(run('Object.keys(state.attempts||{}).length'),0);
run("location.hash='#simulacre/74';render();");
assert.equal(run('current.record.values.length'),0);
assert.equal(run('current.record.note'),'');
console.log('Passed: exam drafts survive export/import and reset removes all attempts.');
