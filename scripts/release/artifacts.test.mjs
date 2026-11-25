import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {metadata,repository,fileManifest,safePath,sha256,verifyLocal,verifyRemote,verifyChecksums} from './artifacts.mjs';
import {releaseDecision,tagCommit,assertTagSource} from './github.mjs';

const env={GITHUB_SHA:'a'.repeat(40),GITHUB_RUN_NUMBER:'12',GITHUB_RUN_ID:'12345',GITHUB_REPOSITORY:repository};
const info=metadata(env);
async function fixture(t) {
 const dir=await mkdtemp(join(tmpdir(),'pvv-release-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 await mkdir(join(dir,'widget'));await writeFile(join(dir,'index.html'),'hello');await writeFile(join(dir,'widget/visitor-village.js'),'export{}');await writeFile(join(dir,'_headers'),'headers');await writeFile(join(dir,'deployment.json'),JSON.stringify(info));
 return {dir,manifest:{metadata:info,files:await fileManifest(dir)}};
}

test('metadata identifies the exact commit and deterministic rerun tag',()=>{
 assert.equal(info.releaseTag,'deploy-12-aaaaaaa');assert.equal(info.runUrl,`https://github.com/${repository}/actions/runs/12345`);assert.deepEqual(metadata({...env}),info);
});
test('metadata rejects invalid source, run identifiers and unrelated repositories',()=>{
 for(const change of [{GITHUB_SHA:'main'},{GITHUB_RUN_ID:'1\nX=evil'},{GITHUB_REPOSITORY:'someone/else'}])assert.throws(()=>metadata({...env,...change}));
});
test('artifact paths reject traversal, URL injection and separators',()=>{
 for(const path of ['../secret','/absolute','x/../y','x\\y','x?query','x#hash','%2e%2e/x','x\n'])assert.throws(()=>safePath(path));
 assert.equal(safePath('assets/tree-summer.png'),'assets/tree-summer.png');
});
test('local manifest covers nested files and verifies unchanged bytes',async t=>{
 const {dir,manifest}=await fixture(t);assert.deepEqual(await fileManifest(dir),manifest.files);await verifyLocal(dir,manifest);
});
test('local verification rejects changed, extra and missing files',async t=>{
 for(const mode of ['changed','extra','missing']) {
  const {dir,manifest}=await fixture(t);
  if(mode==='missing')await rm(join(dir,'index.html'));else await writeFile(join(dir,mode==='extra'?'extra.js':'index.html'),'other');
  await assert.rejects(verifyLocal(dir,manifest));
 }
});
test('local verification rejects symbolic links instead of packaging private files',async t=>{
 const {dir}=await fixture(t);await symlink('/etc/hosts',join(dir,'unexpected'));await assert.rejects(fileManifest(dir),/Symbolic links/);
});
test('local verification refuses metadata belonging to another build',async t=>{
 const {dir,manifest}=await fixture(t);await writeFile(join(dir,'deployment.json'),JSON.stringify({...info,commit:'b'.repeat(40)}));manifest.files=await fileManifest(dir);await assert.rejects(verifyLocal(dir,manifest),/metadata mismatch/);
});
async function remoteFixture(t,options={}) {
 const {dir,manifest}=await fixture(t),{readFile}=await import('node:fs/promises');let calls=[];
 const fetcher=async url=>{
  const path=new URL(url).pathname.slice(1);calls.push(path);
  if(path==='widget/missing-release-file.js')return new Response('',{status:options.bad404?200:404});
  if(options.httpError&&path==='index.html')return new Response('',{status:503});
  const headers=path==='widget/visitor-village.js'?{'access-control-allow-origin':'*','x-content-type-options':'nosniff','content-type':'text/javascript'}:{};
  if(options.badHeaders)delete headers['access-control-allow-origin'];
  return new Response(options.corrupt&&path==='index.html'?'tampered':await readFile(join(dir,path)),{headers});
 };return {manifest,fetcher,calls};
}
test('public verification hashes every served file and checks widget headers/404',async t=>{
 const {manifest,fetcher,calls}=await remoteFixture(t);assert.equal(await verifyRemote('https://example.pages.dev',manifest,fetcher),3);assert.ok(!calls.includes('_headers'));assert.ok(calls.includes('deployment.json'));
});
test('public verification rejects HTTP failure, changed bytes, wrong CORS and false404',async t=>{
 for(const option of ['httpError','corrupt','badHeaders','bad404']){
  const {manifest,fetcher}=await remoteFixture(t,{[option]:true});await assert.rejects(verifyRemote('https://example.pages.dev',manifest,fetcher));
 }
});
test('release checksums require all three unique files and exact archive bytes',async t=>{
 const {dir}=await fixture(t);const files=['site.tar.gz','visitor-village.js','manifest.json'];for(const f of files)await writeFile(join(dir,f),f);
 const lines=files.map(f=>`${sha256(Buffer.from(f))}  ${f}`);
 await writeFile(join(dir,'SHA256SUMS'),lines.join('\n'));await verifyChecksums(dir);
 await writeFile(join(dir,'SHA256SUMS'),lines.slice(0,2).join('\n'));await assert.rejects(verifyChecksums(dir),/Incomplete/);
 await writeFile(join(dir,'SHA256SUMS'),[...lines,lines[0]].join('\n'));await assert.rejects(verifyChecksums(dir),/duplicate/);
 await writeFile(join(dir,'SHA256SUMS'),lines.join('\n'));await writeFile(join(dir,'site.tar.gz'),'changed');await assert.rejects(verifyChecksums(dir),/mismatch/);
});
test('release guard skips older main commits and already published reruns',()=>{
 assert.equal(releaseDecision(info,'b'.repeat(40),null).publish,false);
 assert.equal(releaseDecision(info,info.commit,{target_commitish:info.commit,draft:false}).publish,false);
});
test('release guard resumes a draft but rejects conflicting release metadata',()=>{
 assert.deepEqual(releaseDecision(info,info.commit,{id:8,target_commitish:info.commit,draft:true}),{publish:true,draftId:8});
 assert.throws(()=>releaseDecision(info,info.commit,{target_commitish:'b'.repeat(40),draft:false}),/different source/);
});
test('actual tag resolution handles missing, lightweight and annotated refs',async()=>{
 assert.equal(await tagCommit('deploy-test',async()=>null),null);
 assert.equal(await tagCommit('deploy-test',async()=>({object:{type:'commit',sha:info.commit}})),info.commit);
 const annotation='b'.repeat(40),calls=[];
 const actual=await tagCommit('deploy-test',async path=>{calls.push(path);return {object:path.startsWith('git/ref/')?{type:'tag',sha:annotation}:{type:'commit',sha:info.commit}}});
 assert.equal(actual,info.commit);assert.ok(calls.includes('git/tags/'+annotation));
});
test('tag integrity refuses an unrelated orphan or retargeted release tag',async()=>{
 assertTagSource(info.commit,null);assertTagSource(info.commit,info.commit);
 assert.throws(()=>assertTagSource(info.commit,'b'.repeat(40)),/different source/);
 await assert.rejects(tagCommit('deploy-test',async()=>({object:{type:'tag',sha:info.commit}})),/cyclic/);
});
