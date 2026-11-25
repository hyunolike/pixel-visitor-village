import {readFile,writeFile} from 'node:fs/promises';
import {metadata,assert} from './artifacts.mjs';
import {github,releaseDecision,tagCommit,assertTagSource} from './github.mjs';

const expected=metadata(process.env),manifest=JSON.parse(await readFile('release/manifest.json','utf8'));
assert(JSON.stringify(expected)===JSON.stringify(manifest.metadata),'Downloaded artifact belongs to a different run');
const main=await github('git/ref/heads/main');
assertTagSource(expected.commit,await tagCommit(expected.releaseTag));
const release=await github(`releases/tags/${expected.releaseTag}`,{allow404:true});
const decision=releaseDecision(expected,main.object.sha,release);
await writeFile(process.env.GITHUB_OUTPUT,`publish=${decision.publish}\n`,{flag:'a'});
console.log(decision.reason??`Publishing ${expected.releaseTag}`);
