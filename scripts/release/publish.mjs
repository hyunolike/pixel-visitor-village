import {readFile,writeFile} from 'node:fs/promises';
import {assert,metadata,assetNames,repository} from './artifacts.mjs';
import {github,tagCommit,assertTagSource} from './github.mjs';

const expected=metadata(process.env),receipt=JSON.parse(await readFile('release/deployment-receipt.json','utf8'));
assert(JSON.stringify(receipt.metadata)===JSON.stringify(expected),'Cannot release an unverified source');
const currentTag=await tagCommit(expected.releaseTag);assertTagSource(expected.commit,currentTag);
if(currentTag===null)await github('git/refs',{method:'POST',body:{ref:`refs/tags/${expected.releaseTag}`,sha:expected.commit}});
assert((await tagCommit(expected.releaseTag))===expected.commit,'Release tag creation did not match source');
let release=await github(`releases/tags/${expected.releaseTag}`,{allow404:true});
if(release){assert(release.target_commitish===expected.commit,'Release source does not match');assert(release.draft,'Refusing to overwrite a published release');}
const notes=await github('releases/generate-notes',{method:'POST',body:{tag_name:expected.releaseTag,target_commitish:expected.commit}});
const body=`서비스 배포를 확인했습니다.\n\n- 소스: ${expected.commit}\n- 서비스: ${receipt.production}\n- 고유 배포: ${receipt.url}\n- 검증: 공개 파일 ${receipt.verifiedFiles}개 SHA-256, 위젯 CORS/MIME/404\n- 실행: ${expected.runUrl}\n\n${notes.body}`;
const fields={tag_name:expected.releaseTag,target_commitish:expected.commit,name:`배포 #${process.env.GITHUB_RUN_NUMBER} (${expected.commit.slice(0,7)})`,body,draft:true,prerelease:false};
release=release?await github(`releases/${release.id}`,{method:'PATCH',body:fields}):await github('releases',{method:'POST',body:fields});
for(const name of [...assetNames,'deployment-receipt.json']) {
  const existing=release.assets?.find(a=>a.name===name);
  if(existing)await github(`releases/assets/${existing.id}`,{method:'DELETE'});
  const bytes=await readFile('release/'+name),url=`https://uploads.github.com/repos/${repository}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`;
  const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${process.env.GH_TOKEN}`,'Content-Type':'application/octet-stream'},body:bytes,signal:AbortSignal.timeout(60000)});
  assert(response.ok,`Release upload ${name}: HTTP ${response.status}`);
}
assert((await tagCommit(expected.releaseTag))===expected.commit,'Release tag changed before publication');
const published=await github(`releases/${release.id}`,{method:'PATCH',body:{draft:false,make_latest:'true'}});
if(process.env.GITHUB_STEP_SUMMARY)await writeFile(process.env.GITHUB_STEP_SUMMARY,`## Production deployed\n\n[서비스](${receipt.production}) · [릴리즈](${published.html_url}) · [고유 배포](${receipt.url})\n\n소스: \`${expected.commit}\`\n`,{flag:'a'});
console.log(`Published ${published.html_url}`);
