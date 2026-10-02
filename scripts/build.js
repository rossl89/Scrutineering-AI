import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});
await cp('index.html','dist/index.html');await cp('src','dist/src',{recursive:true});await cp('public','dist',{recursive:true});
for(const name of ['pdf.mjs','pdf.worker.mjs'])await cp('node_modules/pdfjs-dist/build/'+name,'dist/vendor/'+name);
console.log('Built app and local PDF parser');
