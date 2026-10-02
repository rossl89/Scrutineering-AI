export const PDF_URL='https://images.engagecdn.net/motorsport-uk-website/production/knowledge-hub/National-competition-rules/2026/Edition-4/Motorsport_UK_NCR_2026_Edition_4.pdf';
export const CHANGES_URL='https://motorsportuk.org/the-sport/regulations/approved-changes/';
const stop=new Set('a an the and or to of for in is it does do must need what how which can should are be i my on with requirements rules'.split(' '));
const aliases={tow:['towing','eye'],hook:['towing'],extinguisher:['extinguishers'],mount:['mountings','mounting'],battery:['batteries'],harness:['harnesses'],helmet:['helmets'],rollcage:['rops','roll','cage'],cutoff:['circuit','breaker'],scrutineer:['scrutineers','scrutiny','scrutineering']};
export function tokens(s){return (s.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(t=>t.length>1&&!stop.has(t));}
export function indexPages(pages,doc){let ch='',app='',part='',title='';const chunks=[];for(const page of pages){const text=page.text;const cm=text.match(/CHAPTER\s+(\d+)\s+([^\n]+)/i);if(cm){if(ch!==cm[1]){app='';part='';}ch=cm[1];title=cm[2].trim();}const footer=text.match(/Chapter\s+(\d+)\s+(?:Part\s+([AB])\s+)?Appendix\s+(\d+)\s*-\s*([^\n]+)/i);if(footer){ch=footer[1];part=footer[2]||'';app=footer[3];title=footer[4].trim();}const am=text.match(/^\s*Appendix\s+(\d+)\s*-\s*([^\n]+)/im);if(am){app=am[1];title=am[2].trim();}const pm=text.match(/^\s*Part\s+([AB])\s*[-–]/im);if(pm)part=pm[1];
const lines=text.split('\n');let buf=[],article='';const flush=()=>{const raw=buf.join('\n').trim();if(raw.length>50)chunks.push({id:`${doc.id}:p${page.page}:${chunks.length}`,docId:doc.id,page:page.page,chapter:ch,appendix:app,part,article,title,text:raw,kind:doc.kind,future:ch==='22'||doc.kind==='future',reference:doc.kind==='base'?`Ch.${ch||'?'}${part?' Part '+part:''}${app?' App.'+app:''}${article?' Art.'+article:''}`:`${doc.name} · PDF page ${page.page}`,effectiveFrom:doc.effectiveFrom||null});};for(const line of lines){if(/Motorsport UK National Competition Rules 2026|^\s*Edition 4\s*$/.test(line))continue;const m=line.match(/^\s*(\d+(?:\.\d+){1,4})\.\s+/);if(m){flush();buf=[];article=m[1];}buf.push(line);if(buf.join('\n').length>2400){flush();buf=[];}}flush();}return chunks;}
function lexicalSearch(chunks,question,{chapter='',date='',includeFuture=false}={}){const base=tokens(question);if(!base.length)return [];const expanded=[...new Set(base.flatMap(t=>[t,...(aliases[t]||[])]))];const pool=chunks.filter(c=>(!chapter||c.chapter===chapter)&& (includeFuture||!c.future)&&(!date||!c.effectiveFrom||c.effectiveFrom<=date));const df=new Map();const rows=pool.map(c=>{const ts=tokens(c.text+' '+c.title);const f=new Map();for(const t of ts)f.set(t,(f.get(t)||0)+1);for(const t of f.keys())df.set(t,(df.get(t)||0)+1);return {c,f,len:ts.length};});const avg=rows.reduce((a,r)=>a+r.len,0)/(rows.length||1);return rows.map(({c,f,len})=>{let score=0,hits=0;for(const t of expanded){const n=f.get(t)||0;if(!n)continue;hits++;const idf=Math.log(1+(rows.length-(df.get(t)||0)+.5)/((df.get(t)||0)+.5));score+=idf*n*2.2/(n+1.2*(.25+.75*len/(avg||1)));}if(question.length>8&&c.text.toLowerCase().includes(question.toLowerCase()))score+=8;return {...c,score,hits};}).filter(r=>r.score>0&&r.hits>=Math.min(2,base.length)).sort((a,b)=>b.score-a.score).slice(0,12);}
export function validateAnswer(answer,sources){if(!answer||!['supported','context_needed','not_established'].includes(answer.status)||typeof answer.answer!=='string'||!Array.isArray(answer.citations))throw Error('Invalid answer format');const ids=new Set(sources.map(s=>s.id));if(answer.citations.some(id=>!ids.has(id)))throw Error('Answer cited an unavailable source');if(answer.status==='supported'&&!answer.citations.length)throw Error('Answer has no citations');return answer;}

export function isSafetyOverview(question){
 const q=question.toLowerCase();
 if(/\bsafety[ -]?car\b/.test(q))return false;
 return /\b(safety|scrutineering|scrutineer|inspection|inspect)\b/.test(q)&&/\b(check|checks|checking|checklist|inspect|inspection|look|pre[ -]?(event|session)|before|initial)\b/.test(q)&&!/\b(extinguisher|harness|helmet|battery|seat|roll[ -]?cage|fuel|tyre|tire)\b/.test(q);
}
const safetyTopics=[
 {label:'Vehicle condition, controls and running gear',chapter:'7',appendix:'2',queries:['brakes operative stopping','steering movement fouling','tyres adequate rating','throttle closing spring','compartment isolated engine batteries']},
 {label:'Seats and harnesses',chapter:'7',appendix:'7',queries:['seat securely anchored movement','seat safety belts complete manufacturer instructions','harness homologated label','belt release mechanism wearer seated','belts oil acid heat']},
 {label:'Roll-over protection',chapter:'7',appendix:'3',queries:['protective padding helmet contact','mounting feet bolts welded']},
 {label:'Fire extinguishers and systems',chapter:'7',appendix:'6',queries:['mountings withstand metal straps','extinguisher servicing date','armed system competing','nozzles installed']},
 {label:'Electrical safety',chapter:'7',appendix:'5',queries:['battery secured terminals short circuit','circuit breaker isolate','external circuit breaker marked']},
 {label:'Fuel and fluid protection',chapter:'7',appendix:'4',queries:['fuel lines protected','fuel tank securely','fuel leakage']},
 {label:'Driver personal safety equipment',chapter:'9',queries:['helmet fits secured serviceable','FHR satisfactory condition','overalls damage wear','overalls cover ankle wrist neck']},
 {label:'Scrutineering scope and event-specific requirements',chapter:'7',appendix:'12',queries:['pre event scrutineering safety','re examination accident damage']}
];
export function safetyOverview(chunks,question,options={}){
 const pool=chunks.filter(c=>(!options.chapter||c.chapter===options.chapter)&&(!c.future||options.includeFuture)&&(!options.date||!c.effectiveFrom||c.effectiveFrom<=options.date));
 const result=[];
 for(const topic of safetyTopics){
  const candidates=pool.filter(c=>c.kind==='base'&&c.chapter===topic.chapter&&(!topic.appendix||c.appendix===topic.appendix)&&c.article);
  const selected=[];let length=0;
  for(const query of topic.queries){
   const best=lexicalSearch(candidates,query,options).find(c=>!selected.some(s=>s.id===c.id));
   if(!best)continue;
   // Keep complete extracted passages and their references, never truncate a rule mid-sentence.
   const block=best.reference+' · PDF page '+best.page+'\n'+best.text;
   if(length+block.length+2>3900)continue;
   selected.push(best);length+=block.length+2;
  }
  if(!selected.length)continue;
  const first=selected[0],pages=[...new Set(selected.map(c=>c.page))];
  result.push({...first,id:first.docId+':overview:'+topic.chapter+':'+(topic.appendix||'personal'),reference:topic.label+' · selected NCR passages',text:selected.map(c=>c.reference+' · PDF page '+c.page+'\n'+c.text).join('\n\n'),pages,components:selected.map(c=>({id:c.id,reference:c.reference,page:c.page})),topic:topic.label,overview:true});
 }
 // Respect the existing eight-source Worker protocol. Surface event requirements when known.
 const disciplineChapter=options.discipline==='race'?'12':options.discipline==='rally'?'13':options.discipline==='speed'?'14':'';
 if(disciplineChapter&&(!options.chapter||options.chapter===disciplineChapter)){
  const discipline=lexicalSearch(pool.filter(c=>c.kind==='base'&&c.chapter===disciplineChapter&&c.article&&!/safety car/i.test(c.title+' '+c.text)), 'towing eyes safety equipment scrutineering', {...options,chapter:disciplineChapter}).slice(0,2);
  if(discipline.length){const first=discipline[0];const packet={...first,id:first.docId+':overview:discipline:'+disciplineChapter,reference:'Discipline-specific provisions · selected NCR passages',text:discipline.map(c=>c.reference+' · PDF page '+c.page+'\n'+c.text).join('\n\n'),pages:[...new Set(discipline.map(c=>c.page))],components:discipline.map(c=>({id:c.id,reference:c.reference,page:c.page})),overview:true,topic:'Discipline-specific provisions'};if(packet.text.length<=3900){if(result.length===8)result[7]=packet;else result.push(packet);}}
 }
 return result.slice(0,8);
}
export function search(chunks,question,options={}){
 if(isSafetyOverview(question)){if(options.discipline==='kart')return lexicalSearch(chunks.filter(c=>['18','9'].includes(c.chapter)),question,options);return safetyOverview(chunks,question,options);}
 return lexicalSearch(chunks,question,options);
}
