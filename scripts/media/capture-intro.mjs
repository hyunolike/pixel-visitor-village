// Capture the built production Web Component, not a reimplementation of its renderer.
// Run pnpm build and a Vite preview at MEDIA_ORIGIN (default :5208) first.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin=process.env.MEDIA_ORIGIN??'http://127.0.0.1:5208';
const folder='brag-output/intro-refresh';
await mkdir(`${folder}/assets`,{recursive:true});
await mkdir(`${folder}/work`,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1728,height:720},deviceScaleFactor:1});
await page.addInitScript(()=>{Math.random=()=>.25;});
const observations=[];
const capturedBundle=await readFile('dist/widget/visitor-village.js');
const bundleSha256=createHash('sha256').update(capturedBundle).digest('hex');
await writeFile(`${folder}/work/captured-visitor-village.js`,capturedBundle);
async function encoder(name,frames,step){
  const proc=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-vcodec','png','-i','pipe:0','-an','-c:v','libx264','-crf','18','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart',`${folder}/assets/${name}.mp4`],{stdio:['pipe','inherit','inherit']});
  const done=once(proc,'close');
  for(let f=0;f<frames;f++){
    await step(f);
    const png=await page.screenshot({animations:'allow'});
    if(f%45===0)await writeFile(`${folder}/work/${name}-${f}.png`,png);
    if(!proc.stdin.write(png))await once(proc.stdin,'drain');
    if(f%60===0)console.log(name,f,'/',frames);
  }
  proc.stdin.end();
  if((await done)[0]!==0)throw new Error('ffmpeg capture failed');
}
try{
  await page.route(`${origin}/media-fixture`,route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html lang="ko"><style>html,body{margin:0;background:#152c36}visitor-village{display:block;width:1728px;height:720px}</style><visitor-village count="0" season="christmas" paused></visitor-village><script type="module" src="/widget/visitor-village.js"></script></html>`}));
  await page.goto(`${origin}/media-fixture`);
  await page.waitForFunction(()=>document.querySelector('visitor-village')?.ready);
  await page.clock.install({time:new Date('2026-11-25T03:00:00Z')});
  await page.clock.pauseAt(new Date('2026-11-25T03:00:00.001Z'));
  await page.evaluate(()=>{const el=document.querySelector('visitor-village');el.view.app.ticker.maxFPS=0;window.captureTime=el.view.app.ticker.lastTime;});
  await encoder('widget-current',420,async f=>{
    const season=f<240?'christmas':f<285?'spring':f<330?'summer':f<375?'autumn':'winter';
    const count=Math.min(24,Math.floor(f/2.5));
    await page.clock.runFor(f%3===0?34:33);
    const state=await page.evaluate(({season,count})=>{
      const el=document.querySelector('visitor-village');
      if(el.getAttribute('count')!==String(count))el.setAttribute('count',String(count));
      if(el.season!==season)el.setAttribute('season',season);
      window.captureTime+=1000/30;el.view.app.ticker.update(window.captureTime);el.view.renderOnce();
      return {count:el.visitorCount,season:el.season,elapsed:el.model.elapsed,pairs:el.model.social.pairs.length,guest:el.view.cameo.guest?.kind??null,notice:el.shadowRoot.querySelector('.notice').textContent};
    },{season,count});
    if(f%30===0)observations.push({frame:f,...state});
  });
  if(!observations.some(s=>s.pairs>0)||!observations.some(s=>s.guest))throw new Error('Actual social/holiday behavior absent');
  await page.clock.resume();
  await page.setViewportSize({width:1728,height:960});
  // Preserve the public origin for its generated module URL while serving local bytes.
  await page.route('https://pixel-visitor-village.pages.dev/**',async route=>{
    const url=new URL(route.request().url());
    const response=await route.fetch({url:`${origin}${url.pathname}${url.search}`});
    await route.fulfill({response});
  });
  await page.goto('https://pixel-visitor-village.pages.dev/install.html?lang=ko');
  await page.waitForFunction(()=>document.querySelector('visitor-village')?.ready);
  // Fit the real workshop, including the generated code, without mock UI.
  await encoder('installer-current',120,async f=>{
    if(f===12)await page.locator('#blog-url').fill('example.tistory.com');
    if(f===30)await page.locator('input[name="season"][value="autumn"]').check();
    if(f===45){await page.locator('#create-code').click();await page.locator('#install-code').scrollIntoViewIfNeeded();}
  });
  const code=await page.locator('#install-code').inputValue();
  if(!code.includes('[##_count_today_##]')||!code.includes('pixel-visitor-village.pages.dev'))throw new Error('Incorrect generated installation code');
  if(createHash('sha256').update(await readFile('dist/widget/visitor-village.js')).digest('hex')!==bundleSha256)throw new Error('Bundle changed while capturing; rebuild and capture again');
  await writeFile(`${folder}/work/capture-manifest.json`,JSON.stringify({bundleSha256,fps:30,seed:.25,description:'Built Web Component; paused ticker stepped at 30fps. Synthetic count 0–24. Actual workshop actions.',observations,code},null,2));
}finally{await browser.close();}
