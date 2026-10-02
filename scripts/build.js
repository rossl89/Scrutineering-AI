import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});
await cp('index.html','dist/index.html');await cp('src','dist/src',{recursive:true});await cp('public','dist',{recursive:true});
for(const name of ['pdf.mjs','pdf.worker.mjs'])await cp('node_modules/pdfjs-dist/build/'+name,'dist/vendor/'+name);
for(const name of ['standard_fonts','cmaps'])await cp('node_modules/pdfjs-dist/'+name,'dist/vendor/'+name,{recursive:true});
console.log('Built app and local PDF parser');

await import('./bundle-sources.js');
