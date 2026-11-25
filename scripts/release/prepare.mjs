import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {metadata,fileManifest,verifyLocal,sha256,assetNames} from './artifacts.mjs';

const info=metadata(process.env);
await mkdir('release',{recursive:true});
await writeFile('dist/deployment.json',JSON.stringify(info,null,2)+'\n');
const manifest={metadata:info,files:await fileManifest('dist')};
for(const path of ['index.html','install.html','docs/index.html','widget/visitor-village.js','_headers']) {
  if(!manifest.files[path])throw new Error(`Missing required distribution file: ${path}`);
}
await verifyLocal('dist',manifest);
await writeFile('release/manifest.json',JSON.stringify(manifest,null,2)+'\n');
execFileSync('tar',['-czf','release/site.tar.gz','-C','dist','.']);
await copyFile('dist/widget/visitor-village.js','release/visitor-village.js');
await writeFile('release/SHA256SUMS',(await Promise.all(assetNames.filter(x=>x!=='SHA256SUMS').map(async name=>`${sha256(await readFile('release/'+name))}  ${name}`))).join('\n')+'\n');
if(process.env.GITHUB_OUTPUT)await writeFile(process.env.GITHUB_OUTPUT,`release_tag=${info.releaseTag}\n`,{flag:'a'});
console.log(`Prepared ${Object.keys(manifest.files).length} files for ${info.releaseTag}`);
