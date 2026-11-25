import {readFile,writeFile} from 'node:fs/promises';
import {assert,metadata,project,production,verifyChecksums,verifyLocal,verifyRemote} from './artifacts.mjs';

const manifest=JSON.parse(await readFile('release/manifest.json','utf8'));
assert(JSON.stringify(manifest.metadata)===JSON.stringify(metadata(process.env)),'Unexpected artifact source');
await verifyChecksums('release');
await verifyLocal('dist',manifest);
if(process.argv.includes('--local')){console.log('Verified downloaded distribution');process.exit(0);}
assert(process.env.CLOUDFLARE_API_TOKEN&&process.env.CLOUDFLARE_ACCOUNT_ID,'Cloudflare deployment credentials are missing');
const endpoint=`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/${project}/deployments`;
let receipt,lastError;
for(let attempt=0;attempt<12;attempt++) {
  try {
    const response=await fetch(endpoint,{headers:{Authorization:`Bearer ${process.env.CLOUDFLARE_API_TOKEN}`},signal:AbortSignal.timeout(30000)});
    assert(response.ok,`Cloudflare receipt HTTP ${response.status}`);
    const data=await response.json();assert(data.success&&Array.isArray(data.result),'Cloudflare receipt unavailable');
    const candidates=data.result.filter(d=>d.environment==='production'&&d.deployment_trigger?.metadata?.commit_hash===manifest.metadata.commit&&d.latest_stage?.status==='success').sort((a,b)=>Date.parse(b.created_on)-Date.parse(a.created_on));
    assert(candidates.length,'Successful production deployment has not appeared');
    const deployed=candidates[0];assert(new RegExp(`^https://[a-z0-9-]+\\.${project}\\.pages\\.dev$`).test(deployed.url),'Unexpected Cloudflare deployment origin');
    const files=await verifyRemote(deployed.url,manifest);
    const current=await fetch(`${production}/deployment.json?release=${manifest.metadata.commit}`,{cache:'no-store'});
    assert(current.ok,'Production alias metadata unavailable');assert(JSON.stringify(await current.json())===JSON.stringify(manifest.metadata),'Production alias has a different source');
    receipt={id:deployed.id,url:deployed.url,production,metadata:manifest.metadata,verifiedFiles:files};break;
  }catch(error){lastError=error;if(attempt<11)await new Promise(r=>setTimeout(r,2000));}
}
assert(receipt,lastError?.message??'Public verification failed');
await writeFile('release/deployment-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(`Verified ${receipt.verifiedFiles} public files at ${receipt.url}`);
