const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{value:'',innerHTML:'',textContent:'',hidden:false,disabled:false,open:false,dataset:{},events:{},classList:{add(){},remove(){},toggle(){}},addEventListener(n,f){this.events[n]=f;},setAttribute(){},removeAttribute(){},focus(){},click(){},showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(id);}
const memory=new Map();
const ctx=vm.createContext({console,Intl,Math,Date,Number,String,JSON,Object,Array,Boolean,Error,Map,Set,document:{querySelector:node,querySelectorAll:()=>[],title:''},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},location:{hash:''},window:{addEventListener(){}},scrollTo(){},setTimeout(){},clearTimeout(){}});
vm.runInContext(fs.readFileSync('docs/data.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('docs/app.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('BANK.length'),73);
assert.equal(run('new Set(BANK.map(e=>e.id)).size'),73);
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
for(let id=1;id<=73;id++){
 run(`location.hash='#exercici/${id}';render();`);
 const e=run(`BANK[${id-1}]`);
 e.fields.forEach((f,i)=>{node('#answer-'+i).value=String(f.value);});
 node('#answer-form').events.submit({preventDefault(){}});
 assert.equal(run(`state.records[${id}].status`),'done',`exercise ${id}`);
 assert.ok(node('#feedback').textContent.startsWith(`${e.fields.length} de ${e.fields.length}`));
}
for(const route of ['#inici','#dossier','#dossier/3','#entrena','#progres','#exercici/999'])run(`location.hash='${route}';render();`);
assert.equal(run('counts().done'),73);
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
console.log('Passed: 73 exercise flows, 1,400 generated problems, arithmetic parser, corrected physics, progress and import validation.');
