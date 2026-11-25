import {assert,repository} from './artifacts.mjs';

export async function github(path,{method='GET',body,allow404=false}={}) {
  assert(process.env.GH_TOKEN,'GitHub workflow token is missing');
  const response=await fetch(`https://api.github.com/repos/${repository}/${path}`,{method,headers:{Authorization:`Bearer ${process.env.GH_TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});
  if(response.status===404&&allow404)return null;
  assert(response.ok,`GitHub ${method} ${path}: HTTP ${response.status}`);
  return response.status===204?null:response.json();
}

export function releaseDecision(expected,main,release) {
  if(main!==expected.commit)return {publish:false,reason:'Superseded by a newer main commit'};
  if(release) {
    assert(release.target_commitish===expected.commit,'Existing release has a different source commit');
    if(!release.draft)return {publish:false,reason:'This run already has a published release'};
  }
  return {publish:true,draftId:release?.id??null};
}

export async function tagCommit(tag,api=github) {
  const ref=await api(`git/ref/tags/${encodeURIComponent(tag)}`,{allow404:true});
  if(!ref)return null;
  let object=ref.object;const seen=new Set();
  for(let depth=0;depth<8;depth++) {
    assert(object&&/^[a-f0-9]{40}$/.test(object.sha),'Invalid release tag object');
    if(object.type==='commit')return object.sha;
    assert(object.type==='tag'&&!seen.has(object.sha),'Invalid or cyclic release tag');seen.add(object.sha);
    object=(await api(`git/tags/${object.sha}`)).object;
  }
  throw new Error('Release tag annotation depth exceeded');
}

export function assertTagSource(expected,actual) {
  assert(actual===null||actual===expected,'Existing git tag points to a different source commit');
}
