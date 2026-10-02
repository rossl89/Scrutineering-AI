import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import {indexPages} from '../src/engine.js';
const sources=JSON.parse(await readFile('sources.json','utf8'));
await mkdir('.source-cache',{recursive:true});await mkdir('dist/sources',{recursive:true});
const registry=[];
for(const s of sources){
 const path='.source-cache/'+s.file;let bytes;try{bytes=await readFile(path);}catch{const r=await fetch(s.url,{signal:AbortSignal.timeout(120000)});if(!r.ok)throw Error('Source download failed: '+s.name);bytes=Buffer.from(await r.arrayBuffer());await writeFile(path,bytes);}
 const hash=createHash('sha256').update(bytes).digest('hex');if(hash!==s.sha256)throw Error('Official source changed; review sources.json before rebuilding: '+s.name);
 let doc;try{doc=JSON.parse(await readFile(path+'.json','utf8'));if(doc.hash!==hash||doc.indexVersion!==1)doc=null;}catch{}
 if(!doc){const pdf=await pdfjs.getDocument({data:new Uint8Array(bytes),standardFontDataUrl:'node_modules/pdfjs-dist/standard_fonts/',cMapUrl:'node_modules/pdfjs-dist/cmaps/',cMapPacked:true,isEvalSupported:false}).promise;const pages=[];for(let n=1;n<=pdf.numPages;n++){const p=await pdf.getPage(n),t=await p.getTextContent();let lines=[],line='',lastY=null;for(const it of t.items){if(!('str'in it))continue;const y=Math.round(it.transform[5]);if(lastY!==null&&Math.abs(y-lastY)>3&&line){lines.push(line);line='';}line+=it.str+' ';lastY=y;if(it.hasEOL){lines.push(line);line='';lastY=null;}}if(line)lines.push(line);pages.push({page:n,text:lines.join('\n')});p.cleanup();}await pdf.destroy();if(pages.length!==s.pages)throw Error('Unexpected source page count');doc={id:hash,hash,indexVersion:1,name:s.name,kind:s.kind,url:s.url,effectiveFrom:null,importedAt:'2026-10-02',bundled:true,file:s.file,pages};doc.chunks=indexPages(pages,doc);await writeFile(path+'.json',JSON.stringify(doc));}
 await cp(path,'dist/sources/'+s.file);await writeFile('dist/sources/'+s.file+'.json',JSON.stringify(doc));registry.push({id:doc.id,name:doc.name,index:s.file+'.json',file:s.file,pages:doc.pages.length,hash});console.log('Bundled '+doc.name+': '+doc.pages.length+' pages');
}
await writeFile('dist/sources/registry.json',JSON.stringify(registry));
