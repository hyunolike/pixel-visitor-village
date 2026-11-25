import {createHash} from 'node:crypto';
import {readdir, readFile, lstat} from 'node:fs/promises';
import {join, resolve} from 'node:path';

export const project = 'pixel-visitor-village';
export const repository = 'hyunolike/pixel-visitor-village';
export const production = `https://${project}.pages.dev`;
export const assetNames = ['site.tar.gz','visitor-village.js','manifest.json','SHA256SUMS'];
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const assert = (value, message) => {if(!value) throw new Error(message);};

export function metadata(env) {
  const {GITHUB_SHA:commit,GITHUB_RUN_NUMBER:number,GITHUB_RUN_ID:id,GITHUB_REPOSITORY:repo}=env;
  assert(/^[a-f0-9]{40}$/.test(commit??''),'Expected a full source commit SHA');
  assert(/^\d+$/.test(number??'')&&/^\d+$/.test(id??''),'Expected GitHub run identifiers');
  assert(repo===repository,'Unexpected repository');
  return {project,commit,releaseTag:`deploy-${number}-${commit.slice(0,7)}`,runUrl:`https://github.com/${repo}/actions/runs/${id}`};
}

export function safePath(path) {
  assert(typeof path==='string'&&path.length>0&&!path.startsWith('/')&&!/[\\\x00-\x1f?#%]/.test(path)&&path.split('/').every(part=>part&&part!=='.'&&part!=='..'),'Unsafe artifact path');
  return path;
}

export async function fileManifest(directory) {
  const files={};
  async function walk(relative='') {
    for(const entry of (await readdir(join(directory,relative),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
      const path=relative?`${relative}/${entry.name}`:entry.name;
      assert(!entry.isSymbolicLink(),'Symbolic links are not deployable');
      if(entry.isDirectory()) await walk(path);
      else {assert(entry.isFile(),'Unsupported artifact entry');const bytes=await readFile(join(directory,path));files[safePath(path)]={bytes:bytes.length,sha256:sha256(bytes)};}
    }
  }
  await walk();return files;
}

export async function verifyLocal(directory,manifest) {
  assert(manifest?.metadata?.commit&&manifest?.files,'Invalid manifest');
  const actual=await fileManifest(directory);
  for(const [path,entry] of Object.entries(manifest.files)) {
    safePath(path);assert(Number.isSafeInteger(entry.bytes)&&entry.bytes>=0&&/^[a-f0-9]{64}$/.test(entry.sha256),'Invalid file record');
    const full=resolve(directory,path);assert(full.startsWith(resolve(directory)+'/'),'Artifact escaped directory');
    assert((await lstat(full)).isFile(),'Artifact is not a regular file');
    const bytes=await readFile(full);assert(bytes.length===entry.bytes&&sha256(bytes)===entry.sha256,`Artifact mismatch: ${path}`);
  }
  assert(JSON.stringify(Object.keys(actual).sort())===JSON.stringify(Object.keys(manifest.files).sort()),'Unexpected or missing deployment files');
  assert(JSON.stringify(JSON.parse(await readFile(join(directory,'deployment.json'),'utf8')))===JSON.stringify(manifest.metadata),'Deployment metadata mismatch');
}

export async function verifyChecksums(directory) {
  const seen=new Set();
  for(const line of (await readFile(join(directory,'SHA256SUMS'),'utf8')).trim().split('\n')) {
    const match=/^([a-f0-9]{64})  (site\.tar\.gz|visitor-village\.js|manifest\.json)$/.exec(line);
    assert(match&&!seen.has(match[2]),'Invalid or duplicate checksum record');seen.add(match[2]);
    assert(sha256(await readFile(join(directory,match[2])))===match[1],'Release archive checksum mismatch');
  }
  assert(seen.size===3,'Incomplete release checksums');
}

export async function verifyRemote(origin,manifest,fetcher=fetch) {
  const base=new URL(origin);assert(base.protocol==='https:'||base.hostname==='127.0.0.1','Expected HTTPS origin');
  const suffix=`?release=${manifest.metadata.commit}`;
  const paths=Object.keys(manifest.files).filter(path=>path!=='_headers');
  // Bounded batches avoid flooding the host while covering every deployed file.
  for(let i=0;i<paths.length;i+=4) await Promise.all(paths.slice(i,i+4).map(async path=>{
    safePath(path);const response=await fetcher(new URL('/'+path+suffix,base),{cache:'no-store',signal:AbortSignal.timeout(30000)});
    assert(response.ok,`Public HTTP ${response.status}: ${path}`);
    const bytes=Buffer.from(await response.arrayBuffer()),entry=manifest.files[path];
    assert(bytes.length===entry.bytes&&sha256(bytes)===entry.sha256,`Public file mismatch: ${path}`);
  }));
  const widget=await fetcher(new URL('/widget/visitor-village.js'+suffix,base));
  assert(widget.headers.get('access-control-allow-origin')==='*','Missing widget CORS');
  assert(widget.headers.get('x-content-type-options')==='nosniff','Missing widget nosniff');
  assert(/javascript/.test(widget.headers.get('content-type')??''),'Invalid widget MIME');
  assert((await fetcher(new URL('/widget/missing-release-file.js'+suffix,base))).status===404,'Missing widget must return404');
  return paths.length;
}
