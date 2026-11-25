import { expect, test, type Page } from '@playwright/test';
import { createServer } from 'node:http';
const appOrigin=()=>new URL(test.info().project.use.baseURL!).origin;
const waitReady=async(page:Page)=> {
  await page.goto('/');
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  // Legacy widget-contract tests use their original embedded fixture explicitly.
  await page.locator('visitor-village').first().evaluate(el=>{el.removeAttribute('interactive');el.removeAttribute('repository-link');el.setAttribute('count','24');el.setAttribute('season','christmas');});
};
const state=async(page:Page)=>page.locator('visitor-village').first().evaluate((el:any)=>({count:el.visitorCount,season:el.season,people:el.getVisitors()}));

test('unified village chrome connects home, installation and static guide',async({page,browser,request})=>{
  const headers=[];
  for(const path of ['/','/install.html?lang=ko','/docs/']){
    await page.goto(path);await page.evaluate(()=>document.fonts.ready);
    await expect(page.locator('.service-header .brand-mark')).toHaveAttribute('src',/tree-summer/);
    headers.push(await page.locator('.service-header').evaluate(el=>({color:getComputedStyle(el).backgroundColor,brand:getComputedStyle(el.querySelector('.brand-title')!).fontFamily})));
    const icon=await page.locator('link[rel=icon]').getAttribute('href');expect((await request.get(new URL(icon!,page.url()).href)).status()).toBe(200);
    expect(await page.locator('.service-header .install-action').evaluate(el=>getComputedStyle(el).borderRadius)).toBe('0px');
    expect(await page.locator('.service-header .install-action').evaluate(el=>{
      const style=getComputedStyle(el),luminance=(color:string)=>{
        const rgb=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
        return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
      };
      const pair=[luminance(style.color),luminance(style.backgroundColor)].sort((a,b)=>a-b);return (pair[1]+.05)/(pair[0]+.05);
    })).toBeGreaterThanOrEqual(4.5);
  }
  expect(headers[0].color).toBe('rgb(18, 59, 62)');expect(headers[1]).toEqual(headers[0]);expect(headers[2]).toEqual(headers[0]);
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:850}});
  try{
    const docs=await context.newPage();await docs.goto(`${appOrigin()}/docs/`);
    await expect(docs.locator('.service-header')).toBeVisible();await expect(docs.locator('#quick-start')).toContainText('시연');
    await docs.locator('.docs-toc a[href="#credits"]').click();await expect(docs.locator('#credits')).toBeInViewport();
    expect(await docs.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
  }finally{await context.close();}
});

test.describe('interactive homepage',()=>{
  const home=async(page:Page)=>{await page.goto('/');await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));};
  // Compositor pixels, excluding HTML feedback, prove that the sprites themselves react.
  const scenePixels=(page:Page)=>page.locator('visitor-village canvas').screenshot({style:'.scene-bottom { visibility:hidden !important; }'});
  test('puts the real scene first and carries selected season into localized installation',async({page})=>{
    await page.setViewportSize({width:1440,height:1024});await home(page);
    expect(await state(page)).toMatchObject({count:12,season:'summer'});
    const stage=await page.locator('.stage').boundingBox();expect(stage!.y).toBeLessThan(100);expect(stage!.width).toBe(1440);
    await expect(page.locator('#invite')).toBeInViewport();
    await page.getByRole('button',{name:'가을',exact:true}).click();
    expect((await state(page)).season).toBe('autumn');
    await page.locator('#home-install').click();await expect(page).toHaveURL(/install.html\?season=autumn$/);
    await expect(page.locator('input[name=season][value=autumn]')).toBeChecked();
    await page.locator('#locale-select').selectOption('en');
    await page.locator('#blog-url').fill('example.tistory.com');await page.locator('#create-code').click();
    expect(await page.locator('#install-code').inputValue()).toContain('season="autumn"');
    expect(await page.locator('#install-code').inputValue()).not.toContain('count="12"');
  });
  test('invites a real guest and lets pointer and keyboard greetings change the paused canvas',async({page})=>{
    await home(page);await page.locator('#pause').click();
    const before=await state(page);await page.locator('#invite').click();
    const after=await state(page);expect(after.count).toBe(13);expect(after.people.slice(0,12)).toEqual(before.people);
    expect(after.people[12]).toMatchObject({id:12,x:.5,y:.94});
    const canvas=page.locator('visitor-village canvas'),box=(await canvas.boundingBox())!;
    const snapshot=await scenePixels(page);
    let popups=0;page.on('popup',()=>popups++);
    await canvas.click({position:{x:box.width*.5,y:box.height*.94-12}});
    await expect(page.locator('#interaction-status')).toContainText('인사');
    expect((await scenePixels(page)).equals(snapshot)).toBe(false);expect(popups).toBe(0);
    await page.locator('#greet').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#interaction-status')).toContainText('인사');
    await canvas.click({position:{x:25,y:25}});expect(popups).toBe(0);
    const link=await page.locator('visitor-village .repository').boundingBox();expect(link!.width).toBeLessThan(box.width/2);
  });
  test('keeps reduced-motion feedback usable, rejects empty greetings and respects the population cap',async({page})=>{
    await page.emulateMedia({reducedMotion:'reduce'});await home(page);
    const before=await scenePixels(page);
    await page.locator('#greet').click();expect((await scenePixels(page)).equals(before)).toBe(false);
    await expect(page.locator('#pause')).toBeDisabled();
    await page.locator('visitor-village').evaluate(el=>el.setAttribute('count','0'));await expect(page.locator('#greet')).toBeDisabled();
    expect(await page.locator('visitor-village').evaluate((el:any)=>el.greetVisitor())).toBe(false);
    await page.locator('#invite').click();expect((await state(page)).count).toBe(1);
    await page.locator('visitor-village').evaluate(el=>el.setAttribute('count','5000'));await expect(page.locator('#invite')).toBeDisabled();
    expect(await page.locator('visitor-village').evaluate((el:any)=>el.inviteVisitor())).toBe(false);
  });
  test('keeps all controls reachable at 320px and rejects an invalid installer season',async({page})=>{
    await page.setViewportSize({width:320,height:850});await home(page);
    for(const season of ['봄','여름','가을','겨울','크리스마스'])await page.getByRole('button',{name:season,exact:true}).click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
    await page.locator('#invite').click();expect((await state(page)).count).toBe(13);
    await page.goto('/install.html?season=%3Cscript%3E');await expect(page.locator('input[name=season][value=christmas]')).toBeChecked();
  });
  test('clears explicit greetings across opt-out, seasons, count removal and reconnect',async({page})=>{
    await page.emulateMedia({reducedMotion:'reduce'});await home(page);
    const village=page.locator('visitor-village');
    expect(await village.evaluate((el:any)=>el.greetVisitor(99))).toBe(false);
    const plain=await scenePixels(page);await village.evaluate((el:any)=>el.greetVisitor(0));
    expect((await scenePixels(page)).equals(plain)).toBe(false);
    await village.evaluate(el=>el.removeAttribute('interactive'));
    expect(await village.evaluate((el:any)=>el.greetVisitor())).toBe(false);
    // Compare the same presentation; opting out also restores embedded labels.
    await village.evaluate(el=>el.setAttribute('interactive',''));
    expect((await scenePixels(page)).equals(plain)).toBe(true);
    await village.evaluate((el:any)=>{el.setAttribute('interactive','');el.greetVisitor(0);el.setAttribute('season','spring');el.setAttribute('season','summer');});
    expect((await scenePixels(page)).equals(plain)).toBe(true);
    await village.evaluate((el:any)=>{el.greetVisitor(11);el.setAttribute('count','11');el.setAttribute('count','12');});
    expect((await scenePixels(page)).equals(plain)).toBe(true);
    expect(await village.evaluate((el:any)=>{el.greetVisitor(0);el.remove();const result=el.greetVisitor();document.querySelector('.stage')!.append(el);return result;})).toBe(false);
    await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
    expect((await scenePixels(page)).equals(plain)).toBe(true);
  });
});

test('site pages connect the product explanation, live demo, installer and usage docs',async({page})=>{
  await waitReady(page);
  await expect(page.locator('#home-install')).toHaveAttribute('href','./install.html?season=christmas');
  await expect(page.locator('.hero-description')).toContainText('오늘 방문자 수');
  await page.locator('.project-nav a[href="#demo"]').click();await expect(page).toHaveURL(/#demo$/);
  await expect(page.locator('visitor-village').first()).toBeInViewport();
  await page.locator('#season').selectOption('spring');expect((await state(page)).season).toBe('spring');
  await page.locator('#home-install').click();await expect(page).toHaveURL(/install.html\?season=spring$/);
  await page.locator('#usage-docs-link').click();await expect(page).toHaveURL(/\/docs\/$/);
  await expect(page.getByRole('heading',{name:'마을 사용 문서',exact:true})).toBeVisible();
  await page.locator('.docs-toc a[href="#troubleshooting"]').click();
  await expect(page.locator('#troubleshooting')).toBeInViewport();
  await page.locator('.project-nav a[href="../index.html#demo"]').click();
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  await expect(page.locator('visitor-village').first()).toBeInViewport();
  await page.locator('.project-nav a[href="./docs/"]').click();
  await page.locator('.project-nav a[href="../install.html"]').click();await expect(page.locator('#blog-url')).toBeVisible();
});

test('usage docs serve readable HTML without JavaScript and expose the real widget contract',async({browser,request})=>{
  const response=await request.get(`${appOrigin()}/docs/`);expect(response.status()).toBe(200);
  const context=await browser.newContext({javaScriptEnabled:false});
  try{
    const page=await context.newPage();await page.goto(`${appOrigin()}/docs/`);
    await expect(page.getByRole('heading',{name:'마을 사용 문서',exact:true})).toBeVisible();
    const options=page.getByRole('table',{name:'위젯 속성'});
    await expect(options).toContainText('0~5,000');await expect(options).toContainText('60~3600');
    await expect(options).toContainText('paused="false"');
    await expect(page.locator('#visitor-count')).toContainText('동시 접속자');
    await page.locator('.docs-toc a[href="#credits"]').click();await expect(page.locator('#credits')).toBeInViewport();
    expect(await page.locator('.brand-mark').evaluate(el=>getComputedStyle(el).width)).not.toBe('auto');
  }finally{await context.close();}
});

test('installer docs navigation stays translated and preserves generated code',async({page})=>{
  await page.setViewportSize({width:320,height:850});
  await page.goto('/install.html?lang=ko');await page.locator('#blog-url').fill('example.tistory.com');await page.locator('#create-code').click();
  const code=await page.locator('#install-code').inputValue();
  for(const [locale,label] of [['en','Docs (Korean)'],['ja','使い方（韓国語）'],['zh-CN','文档（韩语）'],['ko','사용 문서']]){
    await page.locator('#locale-select').selectOption(locale);
    if(await page.locator('#project-navigation').isHidden()) await page.locator('#navigation-toggle').click();
    await expect(page.locator('#usage-docs-link')).toHaveText(label);
    await expect(page.locator('#usage-docs-link')).toHaveAttribute('href','./docs/');
    await expect(page.locator('#install-code')).toHaveValue(code);
    await expect(page.locator('#check-docs-link')).toHaveAttribute('href','./docs/#troubleshooting');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const link of await page.locator('.project-nav a, #locale-select').all()){
      const box=await link.boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(320);
    }
  }
});

test('home and usage docs keep their navigation, tables and code within 320px',async({page},testInfo)=>{
  await page.setViewportSize({width:320,height:850});
  for(const [path,name] of [['/','home-mobile'],['/docs/','docs-mobile']]){
    await page.goto(path);await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const link of await page.locator('.project-nav a').all()){
      const box=await link.boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(320);
    }
    await page.screenshot({path:testInfo.outputPath(`${name}.png`),fullPage:true});
  }
});

test('automatic greetings pause, show icon balloons and release deleted or disconnected partners',async({page},testInfo)=>{
  await page.clock.install();await waitReady(page);
  const village=page.locator('visitor-village').first(),canvas=village.locator('canvas');
  await expect(village).toBeInViewport();
  await village.evaluate(el=>{el.setAttribute('season','summer');el.setAttribute('count','80');});
  await page.clock.runFor(2300);
  await expect(canvas).toHaveAttribute('aria-label',/손 인사/);
  await village.evaluate(el=>el.setAttribute('paused',''));
  // Locator screenshots also capture the wooden notice over the canvas; mask its independent timer.
  const capture=()=>canvas.screenshot({style:'.notice{visibility:hidden!important}',animations:'disabled'});
  const before=await state(page),label=await canvas.getAttribute('aria-label'),image=await capture();
  await page.clock.runFor(20_000);
  expect(await canvas.getAttribute('aria-label')).toBe(label);
  expect((await state(page)).people).toEqual(before.people);
  expect((await capture()).equals(image)).toBe(true);
  await village.evaluate(el=>el.removeAttribute('paused'));
  await page.clock.runFor(1200);
  await expect(canvas).toHaveAttribute('aria-label',/말풍선 반응/);
  await village.screenshot({path:testInfo.outputPath('social-balloons.png'),animations:'disabled'});
  await page.clock.runFor(1900);
  // Other visitors may start a new pair as the original participants finish.
  expect((await state(page)).people).not.toEqual(before.people);
  expect((await state(page)).count).toBe(80);
  await village.evaluate(el=>{el.setAttribute('paused','');el.setAttribute('count','0');el.setAttribute('count','80');});
  await expect(canvas).not.toHaveAttribute('aria-label',/손 인사|말풍선 반응/);
  await village.evaluate(el=>el.removeAttribute('paused'));await page.clock.runFor(2500);
  await expect(canvas).toHaveAttribute('aria-label',/손 인사|말풍선 반응/);
  await village.evaluate(el=>{const parent=el.parentElement!;el.remove();parent.append(el);});
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  await expect(canvas).not.toHaveAttribute('aria-label',/손 인사|말풍선 반응/);
  expect((await state(page)).count).toBe(80);
});

test('small-screen automatic greetings use one pair and clear for reduced motion',async({page},testInfo)=>{
  await page.setViewportSize({width:320,height:850});await page.clock.install();await waitReady(page);
  const village=page.locator('visitor-village').first(),canvas=village.locator('canvas');
  await expect(village).toBeInViewport();await village.evaluate(el=>el.setAttribute('count','80'));
  await page.clock.runFor(3500);
  await expect(canvas).toHaveAttribute('aria-label',/1쌍 말풍선 반응/);
  await village.screenshot({path:testInfo.outputPath('social-mobile.png'),animations:'disabled'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(canvas).not.toHaveAttribute('aria-label',/손 인사|말풍선 반응/);
  const before=await state(page);await page.clock.runFor(30_000);
  expect((await state(page)).people).toEqual(before.people);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.clock.runFor(1000);
  await expect(canvas).not.toHaveAttribute('aria-label',/손 인사|말풍선 반응/);
  expect((await state(page)).count).toBe(80);
});

test('automatic greetings restart after reconnecting with reduced motion turned off',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.clock.install();await waitReady(page);
  const village=page.locator('visitor-village').first(),canvas=village.locator('canvas');
  await village.evaluate((el:any)=>{(window as any).detachedVillage=el;el.remove();});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>document.body.append((window as any).detachedVillage));
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  await village.scrollIntoViewIfNeeded();await expect(village).toBeInViewport();
  await village.evaluate(el=>el.setAttribute('count','80'));await page.clock.runFor(2500);
  await expect(canvas).toHaveAttribute('aria-label',/손 인사|말풍선 반응/);
});

test('automatic greeting descriptions follow the installation preview language',async({page})=>{
  await page.clock.install();await page.goto('/install.html?lang=en');
  const village=page.locator('visitor-village').first(),canvas=village.locator('canvas');
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  await village.scrollIntoViewIfNeeded();await expect(village).toBeInViewport();
  await village.evaluate(el=>el.setAttribute('count','80'));await page.clock.runFor(2300);
  await village.evaluate(el=>el.setAttribute('paused',''));
  for(const [locale,text] of [['en','waving'],['ja','手を振る'],['zh-CN','挥手'],['ko','손 인사']]){
    await page.locator('#locale-select').selectOption(locale);
    await expect(canvas).toHaveAttribute('aria-label',new RegExp(text));
  }
});

test('the village and demo use square corners throughout their frames and controls',async({page})=>{
  await waitReady(page);
  for(const selector of ['visitor-village .village','visitor-village .name','visitor-village .status','visitor-village .repository','.page','.actions button','#visitors']){
    expect(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).borderRadius)).toBe('0px');
  }
});

for(const [seed,name] of [[.1,'산타'],[.9,'루돌프']] as const) {
  test(`${name} appears temporarily as decoration without changing the visitor count`,async({page},testInfo)=>{
    await page.addInitScript(seed=>{Math.random=()=>seed;},seed);
    await page.clock.install();await waitReady(page);
    const village=page.locator('visitor-village').first(),canvas=village.locator('canvas');
    const ids=(await state(page)).people.map((person:any)=>person.id);
    await expect(canvas).not.toHaveAttribute('aria-label',/산타|루돌프/);
    await page.clock.runFor(8500);
    await expect(canvas).toHaveAttribute('aria-label',new RegExp(name));
    expect((await state(page)).count).toBe(24);
    expect((await state(page)).people.map((person:any)=>person.id)).toEqual(ids);
    await village.screenshot({path:testInfo.outputPath(name==='산타'?'santa.png':'rudolph.png'),animations:'disabled'});
    await page.clock.runFor(11_000);
    await expect(canvas).not.toHaveAttribute('aria-label',/산타|루돌프/);
    expect((await state(page)).count).toBe(24);
  });
}

test('Christmas guests freeze offscreen and disappear for reduced motion or another season',async({page})=>{
  await page.addInitScript(()=>{Math.random=()=>.25;});
  await page.clock.install();await waitReady(page);
  const village=page.locator('visitor-village').first(),canvas=village.locator('canvas');
  await page.clock.runFor(8500);await expect(canvas).toHaveAttribute('aria-label',/산타/);
  await village.evaluate(el=>el.style.marginTop='2200px');
  await expect(village).not.toBeInViewport();await page.clock.runFor(40_000);
  await expect(canvas).toHaveAttribute('aria-label',/산타/);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(canvas).not.toHaveAttribute('aria-label',/산타|루돌프/);
  await page.clock.runFor(20_000);await expect(canvas).not.toHaveAttribute('aria-label',/산타|루돌프/);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await village.evaluate(el=>el.style.marginTop='0');
  await expect(village).toBeInViewport();
  // Wait for visibility observers before advancing active animation time.
  await expect(village).toBeInViewport();
  await page.clock.runFor(8500);await expect(canvas).toHaveAttribute('aria-label',/산타/);
  await village.evaluate(el=>el.setAttribute('paused',''));
  const before=await state(page);
  await village.evaluate(el=>{el.setAttribute('count','37');el.style.width='320px';});
  await expect(canvas).toHaveAttribute('width','160');await page.clock.runFor(40_000);
  await expect(canvas).toHaveAttribute('aria-label',/산타/);
  expect((await state(page)).count).toBe(37);
  expect((await state(page)).people.slice(0,before.people.length)).toEqual(before.people);
  await village.evaluate(el=>el.removeAttribute('paused'));
  await page.clock.runFor(3000);await expect(canvas).not.toHaveAttribute('aria-label',/산타|루돌프/);
  await village.evaluate(el=>el.setAttribute('paused',''));
  const beforeSeason=await state(page);
  await village.evaluate(el=>el.setAttribute('season','summer'));
  await expect(canvas).not.toHaveAttribute('aria-label',/산타|루돌프/);
  expect((await state(page)).people).toEqual(beforeSeason.people);
});

test('renders the Christmas tree and exact visitor counts, including zero',async({page})=>{
  await waitReady(page);
  await expect(page.locator('visitor-village canvas')).toBeVisible();
  expect(await state(page)).toMatchObject({count:24,season:'christmas'});
  for(const count of [0,1,37,1000,5000]) {
    await page.locator('visitor-village').evaluate((el,count)=>el.setAttribute('count',String(count)),count);
    expect((await state(page)).people).toHaveLength(count);
  }
});
test('theme changes preserve characters and return immutable snapshots',async({page})=>{
  await waitReady(page);
  await page.locator('visitor-village').evaluate(el=>el.setAttribute('paused',''));
  const before=await state(page);
  for(const season of ['spring','summer','autumn','winter','christmas']) {
    await page.locator('visitor-village').evaluate((el,season)=>el.setAttribute('season',season),season);
    const after=await state(page);expect(after.season).toBe(season);expect(after.people).toEqual(before.people);
  }
  await page.locator('visitor-village').evaluate((el:any)=>{const visitors=el.getVisitors();visitors[0].x=-99;visitors.pop();});
  expect((await state(page)).people).toEqual(before.people);
});
test('invalid values report errors without replacing the valid village, then recover',async({page})=>{
  await waitReady(page);
  for(const value of ['[##_count_today_##]','-1','NaN','5001']) {
    await page.locator('visitor-village').evaluate((el,value)=>el.setAttribute('count',value),value);
    await expect(page.locator('visitor-village [role=status]')).not.toBeEmpty();
    expect((await state(page)).count).toBe(24);
  }
  await page.locator('visitor-village').evaluate(el=>el.setAttribute('count','37'));
  await expect(page.locator('visitor-village [role=status]')).toBeEmpty();expect((await state(page)).count).toBe(37);
  await page.locator('visitor-village').evaluate(el=>el.setAttribute('season','unknown'));
  expect((await state(page)).season).toBe('christmas');
});
test('public events have documented details and bubble through the host',async({page})=>{
  await waitReady(page);
  const details=await page.evaluate(()=>new Promise(resolve=>{
    document.addEventListener('village-change',(event:any)=>resolve(event.detail),{once:true});
    document.querySelector('visitor-village')!.setAttribute('count','37');
  }));
  expect(details).toMatchObject({count:37,season:'christmas',paused:false});
});
test('reduced motion stops autonomous walking',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await waitReady(page);
  const before=await state(page);await page.waitForTimeout(180);
  expect((await state(page)).people).toEqual(before.people);
});
test('multiple instances and reconnecting during initialization remain independent',async({page})=>{
  const failures:string[]=[];page.on('pageerror',error=>failures.push(error.message));
  await waitReady(page);
  await page.evaluate(()=>{
    const second=document.createElement('visitor-village');second.id='second';second.setAttribute('count','1');
    second.style.height='300px';document.body.append(second);second.remove();document.body.append(second);
  });
  await page.waitForFunction(()=>Boolean((document.querySelector('#second') as any)?.ready));
  await expect(page.locator('#second canvas')).toHaveCount(1);
  expect((await state(page)).count).toBe(24);
  expect(await page.locator('#second').evaluate((el:any)=>el.visitorCount)).toBe(1);
  await page.locator('#second').evaluate(el=>el.remove());
  await expect(page.locator('visitor-village')).toHaveCount(1);
  await page.waitForTimeout(150);expect(failures).toEqual([]);
});
test('the demo remains within a 320px screen and controls change real state',async({page})=>{
  await page.setViewportSize({width:320,height:850});await waitReady(page);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const canvas=await page.locator('visitor-village canvas').boundingBox();expect(canvas!.width).toBeLessThanOrEqual(320);
  await page.getByLabel('나무 꾸미기',{exact:true}).selectOption('autumn');
  expect((await state(page)).season).toBe('autumn');
  await page.getByLabel('시연 방문자 수',{exact:true}).fill('37');
  expect((await state(page)).count).toBe(37);
});
test('the built module embeds independently and resists hostile host CSS',async({page})=>{
  await page.goto('/embed-example.html');
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  expect((await state(page)).count).toBe(37);
  await expect(page.locator('visitor-village canvas')).toBeVisible();
  expect(await page.locator('visitor-village canvas').evaluate(el=>getComputedStyle(el).display)).not.toBe('none');
});

test('removing attributes restores defaults without stale errors',async({page})=>{
  await waitReady(page);
  await page.locator('visitor-village').evaluate(el=>{el.setAttribute('count','invalid');el.setAttribute('season','unknown');});
  await page.locator('visitor-village').evaluate(el=>{el.removeAttribute('count');el.removeAttribute('season');});
  expect(await state(page)).toMatchObject({count:0,season:'christmas'});
  await expect(page.locator('visitor-village [role=status]')).toBeEmpty();
});
test('offscreen widgets sleep and resume without recreating visitors',async({page})=>{
  await waitReady(page);
  await page.locator('visitor-village').evaluate(el=>{el.style.visibility='hidden';el.style.marginTop='2200px';});
  await page.waitForTimeout(200);const resting=await state(page);
  await page.waitForTimeout(200);expect((await state(page)).people).toEqual(resting.people);
  await page.locator('visitor-village').evaluate(el=>{el.style.visibility='visible';el.style.marginTop='0';});
  await expect.poll(async()=>JSON.stringify((await state(page)).people)).not.toBe(JSON.stringify(resting.people));
});
test('renderer failure stays inside the widget and leaves blog content usable',async({page})=>{
  await page.addInitScript(()=>{
    HTMLCanvasElement.prototype.getContext=(()=>null) as any;
  });
  await page.goto('/embed-example.html');
  await expect(page.locator('visitor-village [role=status]')).toContainText('마을 그래픽을 시작하지 못했어요');
  await expect(page.getByText('위젯 아래 본문과 링크도 독립적으로 사용할 수 있습니다.')).toBeVisible();
});

test('unfinished numeric text preserves the last valid visitors',async({page})=>{
  await waitReady(page);
  const input=page.getByLabel('시연 방문자 수',{exact:true});
  await input.focus();await input.press('ControlOrMeta+A');await input.press('-');
  expect((await state(page)).count).toBe(24);
  await expect(page.locator('visitor-village [role=status]')).not.toBeEmpty();
  await input.fill('37');expect((await state(page)).count).toBe(37);
});
test('rapid reconnect cancels stale generations before GPU creation',async({page})=>{
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext,seen=new WeakSet<HTMLCanvasElement>();
    (window as any).__webglCreations=0;
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:any,...args:any[]){
      const context=(original as any).call(this,type,...args);
      if((type==='webgl'||type==='webgl2')&&context&&!seen.has(this)){seen.add(this);(window as any).__webglCreations++;}
      return context;
    } as any;
  });
  await waitReady(page);
  await page.evaluate(()=>{
    (window as any).__webglCreations=0;
    const el=document.querySelector('visitor-village')!;
    for(let i=0;i<20;i++){el.remove();document.querySelector('.stage')!.append(el);}
  });
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  expect(await page.evaluate(()=>(window as any).__webglCreations)).toBeLessThanOrEqual(1);
  await expect(page.locator('visitor-village canvas')).toHaveCount(1);
});
test('missing Christmas image falls back to a basic tree without breaking other seasons',async({page})=>{
  await page.route('**/tree-christmas-*.png',route=>route.abort());
  await waitReady(page);
  await expect(page.locator('visitor-village canvas')).toBeVisible();
  await expect(page.locator('visitor-village [role=status]')).toContainText('기본 그림');
  await page.locator('visitor-village').evaluate(el=>el.setAttribute('season','summer'));
  expect(await state(page)).toMatchObject({count:24,season:'summer'});
  await expect(page.locator('visitor-village [role=status]')).toBeEmpty();
});
test('short host height uses the same height for the rendered village',async({page})=>{
  await waitReady(page);
  await page.locator('visitor-village').evaluate(el=>{el.style.height='60px';el.setAttribute('paused','');});
  expect(await page.locator('visitor-village canvas').evaluate(el=>el.getBoundingClientRect().height)).toBe(60);
});
test('a touch drag starting on the village scrolls the blog page',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:780},isMobile:true,hasTouch:true});
  const page=await context.newPage();await page.goto(`${appOrigin()}/`);
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  const canvas=await page.locator('visitor-village canvas').boundingBox();
  const cdp=await context.newCDPSession(page),x=canvas!.x+canvas!.width/2,y=canvas!.y+canvas!.height*.65;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*20}]});await page.waitForTimeout(20);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(20);
  expect(context.pages()).toHaveLength(1);await context.close();
});

test('wooden visitor notices show initial totals and only replay for real count changes',async({page},testInfo)=>{
  await page.clock.install();await waitReady(page);
  const village=page.locator('visitor-village').first(),notice=village.locator('.notice');
  await expect(notice).toHaveAttribute('data-open','true');
  await expect(notice).toContainText('오늘 방문 24');
  await page.clock.fastForward(3100);await expect(notice).toHaveAttribute('data-open','false');
  await village.evaluate(el=>{el.setAttribute('paused','');el.setAttribute('count','37');});
  await expect(notice).toContainText('오늘 방문 37 (+13)');
  await expect(notice).toHaveAttribute('data-open','true');
  await village.screenshot({path:testInfo.outputPath('notice-desktop.png'),animations:'disabled'});
  await page.clock.fastForward(3100);
  await village.evaluate(el=>{el.setAttribute('count','37');el.setAttribute('season','summer');});
  await expect(notice).toHaveAttribute('data-open','false');
  await village.evaluate(el=>el.setAttribute('count','10'));
  await expect(notice).toHaveAttribute('data-open','false');
  await village.evaluate(el=>el.setAttribute('count','12'));
  await expect(notice).toContainText('오늘 방문 12 (+2)');
});

test('the village links to its repository with keyboard access and a safe new tab',async({page,context})=>{
  await context.route('https://github.com/hyunolike/pixel-visitor-village',route=>route.fulfill({body:'Repository test destination',contentType:'text/html'}));
  await waitReady(page);
  const link=page.getByRole('link',{name:'Pixel Visitor Village 저장소 보기 (새 탭)'});
  await expect(link).toHaveAttribute('href','https://github.com/hyunolike/pixel-visitor-village');
  await expect(link).toHaveAttribute('rel','noopener noreferrer');
  await expect(link).toContainText('GitHub에서 보기');
  await link.focus();await expect(link).toBeFocused();
  const opened=page.waitForEvent('popup');await link.press('Enter');
  const popup=await opened;await popup.waitForLoadState();
  expect(popup.url()).toBe('https://github.com/hyunolike/pixel-visitor-village');
  expect(await popup.evaluate(()=>window.opener)).toBeNull();
  expect(page.url()).toBe(`${appOrigin()}/`);await popup.close();
});

test('optional refresh shares one inert HTML read and preserves valid state on conflicting counts',async({page})=>{
  await page.clock.install();
  await page.goto('/embed-example.html');
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  let reads=0,unexpected=0;
  await page.route('**/must-not-load*',route=>{unexpected++;return route.fulfill({body:''});});
  await page.route(`${appOrigin()}/`,route=>{
    reads++;
    return route.fulfill({contentType:'text/html',body:reads===2
      ?'<visitor-village count="40"></visitor-village><visitor-village count="41"></visitor-village>'
      :'<img src="/must-not-load.png"><iframe src="/must-not-load-frame"></iframe><script src="/must-not-load.js"></script><visitor-village count="40"></visitor-village>'});
  });
  await page.clock.fastForward(60_000);expect(reads).toBe(0);
  await page.locator('visitor-village').evaluate(el=>{
    el.setAttribute('paused','');el.setAttribute('refresh-interval','60');
    const second=document.createElement('visitor-village');second.id='refresh-second';
    second.setAttribute('count','37');second.setAttribute('paused','');second.setAttribute('refresh-interval','60');
    second.style.height='100px';el.after(second);
  });
  await page.waitForFunction(()=>Boolean((document.querySelector('#refresh-second') as any)?.ready));
  // Exact 59,999ms boundary is covered by fake-timer unit tests; browser setup also advances time.
  await page.clock.fastForward(30_000);expect(reads).toBe(0);
  await page.clock.fastForward(30_000);
  await expect.poll(async()=>(await state(page)).count).toBe(40);
  expect(reads).toBe(1);expect(unexpected).toBe(0);
  expect(await page.locator('#refresh-second').evaluate((el:any)=>el.visitorCount)).toBe(40);
  await page.clock.fastForward(60_000);
  await expect(page.locator('visitor-village').first().locator('[role=status]')).toContainText('마지막 숫자');
  expect((await state(page)).count).toBe(40);
  await page.clock.fastForward(120_000);
  await expect(page.locator('visitor-village').first().locator('[role=status]')).toBeEmpty();
  await page.locator('visitor-village').evaluateAll(elements=>elements.forEach(el=>el.remove()));
  const stopped=reads;await page.clock.fastForward(300_000);expect(reads).toBe(stopped);
});

test('reduced motion disables notice transitions and narrow hosts keep notices inside the village',async({page},testInfo)=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:850});
  await waitReady(page);
  const village=page.locator('visitor-village').first(),notice=village.locator('.notice');
  await expect(notice).toContainText('오늘 방문 24');
  expect(await notice.evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  const outer=await village.boundingBox(),inner=await notice.boundingBox();
  expect(inner!.x).toBeGreaterThanOrEqual(outer!.x);
  expect(inner!.x+inner!.width).toBeLessThanOrEqual(outer!.x+outer!.width);
  await village.screenshot({path:testInfo.outputPath('notice-mobile.png'),animations:'disabled'});
});

test('an unresolved initial count never announces a fabricated zero and recovers with the first valid total',async({page})=>{
  await waitReady(page);
  await page.evaluate(()=>{
    const second=document.createElement('visitor-village');
    second.id='invalid-initial';second.setAttribute('count','[##_count_today_##]');
    second.style.cssText='position:fixed;top:0;left:0;width:320px;height:120px';
    document.body.append(second);
  });
  const village=page.locator('#invalid-initial');
  await page.waitForFunction(()=>Boolean((document.querySelector('#invalid-initial') as any)?.ready));
  await expect(village.locator('[role=status]')).not.toBeEmpty();
  await expect(village.locator('.notice')).toBeEmpty();
  await village.evaluate(el=>el.setAttribute('count','5'));
  await expect(village.locator('.notice')).toHaveText('오늘 방문 5');
});

test('offscreen notices combine changes since the last visible announcement without polling',async({page})=>{
  await page.clock.install();await waitReady(page);
  const village=page.locator('visitor-village').first(),notice=village.locator('.notice');
  await expect(notice).toHaveAttribute('data-open','true');
  let reads=0;
  await page.route(`${appOrigin()}/`,route=>{reads++;return route.fulfill({body:'',contentType:'text/html'});});
  await village.evaluate(el=>{el.setAttribute('refresh-interval','60');el.style.marginTop='2200px';});
  await expect(notice).toHaveAttribute('data-open','false');
  await village.evaluate(el=>{el.setAttribute('count','25');el.setAttribute('count','28');});
  await page.clock.fastForward(120_000);expect(reads).toBe(0);
  await expect(notice).toHaveAttribute('data-open','false');
  await village.evaluate(el=>el.style.marginTop='0');
  await expect(notice).toHaveAttribute('data-open','true');
  await expect(notice).toHaveText('오늘 방문 28 (+4)');
});

test('an in-flight refresh cannot overwrite a newer external count',async({page})=>{
  await page.clock.install();await page.goto('/embed-example.html');
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  let complete!:(()=>Promise<void>);
  await page.route(`${appOrigin()}/`,route=>{
    complete=()=>route.fulfill({contentType:'text/html',body:'<visitor-village count="38"></visitor-village>'});
  });
  await page.locator('visitor-village').evaluate(el=>el.setAttribute('refresh-interval','60'));
  await page.clock.fastForward(60_000);await expect.poll(()=>Boolean(complete)).toBe(true);
  await page.locator('visitor-village').evaluate(el=>el.setAttribute('count','50'));
  const response=page.waitForResponse(`${appOrigin()}/`);await complete();await response;
  await page.waitForTimeout(100);expect((await state(page)).count).toBe(50);
});

test('the installer only adds automatic refresh after an explicit choice',async({page})=>{
  await page.goto('/install.html?lang=ko');
  const option=page.locator('#install-refresh');
  await expect(option).not.toBeChecked();
  await page.getByLabel('티스토리 주소',{exact:true}).fill('hyunolike.tistory.com');
  await page.locator('#create-code').click();
  expect(await page.getByLabel('티스토리 설치 코드',{exact:true}).inputValue()).not.toContain('refresh-interval');
  await page.locator('#advanced-settings summary').click();
  await option.check();
  await expect(page.getByLabel('티스토리 설치 코드',{exact:true})).toBeHidden();
  await page.locator('#create-code').click();
  expect(await page.getByLabel('티스토리 설치 코드',{exact:true}).inputValue()).toContain('refresh-interval="60"');
});

test('an initially invalid placeholder recovers to a genuine zero total',async({page})=>{
  await page.goto('/embed-example.html');
  await page.locator('visitor-village').evaluate(el=>{
    const replacement=document.createElement('visitor-village');
    replacement.id='zero-recovery';replacement.setAttribute('count','[##_count_today_##]');
    replacement.style.height='420px';el.replaceWith(replacement);
  });
  const village=page.locator('#zero-recovery');
  await page.waitForFunction(()=>Boolean((document.querySelector('#zero-recovery') as any)?.ready));
  await expect(village.locator('[role=status]')).not.toBeEmpty();
  await village.evaluate(el=>el.setAttribute('count','0'));
  await expect(village.locator('[role=status]')).toBeEmpty();
  await expect(village.locator('.notice')).toHaveText('오늘 방문 0');
});

test('a decrease while hidden clears pending arrivals and establishes a new baseline',async({page})=>{
  await page.clock.install();await waitReady(page);
  const village=page.locator('visitor-village').first(),notice=village.locator('.notice');
  await expect(notice).toHaveAttribute('data-open','true');
  await village.evaluate(el=>el.style.marginTop='2200px');
  await expect(notice).toHaveAttribute('data-open','false');
  await village.evaluate(el=>{el.setAttribute('count','40');el.setAttribute('count','30');el.style.marginTop='0';});
  await page.waitForTimeout(100);
  expect(await notice.getAttribute('data-open')).toBe('false');
  await village.evaluate(el=>el.setAttribute('count','32'));
  await expect(notice).toHaveText('오늘 방문 32 (+2)');
});

test('resuming a notice after Korean midnight never replays yesterday arrival delta',async({page})=>{
  await page.clock.install({time:new Date('2026-11-24T14:59:00Z')});await waitReady(page);
  const village=page.locator('visitor-village').first(),notice=village.locator('.notice');
  await expect(notice).toHaveAttribute('data-open','true');
  await village.evaluate(el=>el.setAttribute('count','25'));
  await expect(notice).toHaveText('오늘 방문 25 (+1)');
  await village.evaluate(el=>el.style.marginTop='2200px');
  await expect(notice).toHaveAttribute('data-open','false');
  await page.clock.setSystemTime(new Date('2026-11-24T15:01:00Z'));
  await village.evaluate(el=>el.style.marginTop='0');
  await expect(notice).toHaveAttribute('data-open','true');
  await expect(notice).toHaveText('최근 확인 25');
  await village.evaluate(el=>el.setAttribute('count','25'));
  await expect(notice).toHaveText('오늘 방문 25');
});

for(const reading of ['pending','expired','updated while detached'] as const){
  test(`reconnecting after Korean midnight preserves the reading date: ${reading}`,async({page})=>{
    await page.clock.install({time:new Date('2026-11-24T14:59:00Z')});await waitReady(page);
    const village=page.locator('visitor-village').first(),notice=village.locator('.notice');
    await village.evaluate(el=>el.setAttribute('count','25'));
    await expect(notice).toHaveText('오늘 방문 25 (+1)');
    if(reading==='expired'){
      await page.clock.fastForward(3100);await expect(notice).toHaveAttribute('data-open','false');
    }
    await village.evaluate(el=>{
      (window as any).__detachedVillage=el;(window as any).__detachedVillageParent=el.parentElement;el.remove();
    });
    await page.clock.setSystemTime(new Date('2026-11-24T15:01:00Z'));
    await page.evaluate(updated=>{
      const el=(window as any).__detachedVillage;
      if(updated)el.setAttribute('count','3');
      (window as any).__detachedVillageParent.append(el);
    },reading==='updated while detached');
    await page.waitForFunction(()=>Boolean((document.querySelector('#demo visitor-village') as any)?.ready));
    if(reading==='expired')await expect(notice).toHaveAttribute('data-open','false');
    else{
      await expect(notice).toHaveAttribute('data-open','true');
      await expect(notice).toHaveText(reading==='pending'?'최근 확인 25':'오늘 방문 3');
    }
    if(reading!=='updated while detached'){
      await village.evaluate(el=>el.setAttribute('count','25'));
      await expect(notice).toHaveText('오늘 방문 25');
      await expect(notice).toHaveAttribute('data-open','true');
    }
  });
}

test('short hosts keep actual input error text inside the visible village',async({page})=>{
  await waitReady(page);
  const village=page.locator('visitor-village').first(),status=village.locator('[role=status]');
  await village.evaluate(el=>{el.style.width='320px';el.style.height='60px';el.setAttribute('count','5001');});
  await expect(status).not.toBeEmpty();
  await expect.poll(async()=>{
    const outer=await village.boundingBox(),inner=await status.boundingBox();
    return Boolean(outer&&inner&&inner.y>=outer.y&&inner.y+inner.height<=outer.y+outer.height);
  }).toBe(true);
  expect(await status.evaluate(el=>el.scrollHeight<=el.clientHeight)).toBe(true);
});

test('the distribution module loads from a different blog origin',async({page})=>{
  const server=createServer((_request,response)=>{
    response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    response.end(`<!doctype html><html lang="ko"><head><meta charset="utf-8"></head><body><h1>다른 출처의 블로그</h1><script type="module" src="${appOrigin()}/widget/visitor-village.js"></script><visitor-village count="1,234" season="christmas" style="display:block;height:420px"></visitor-village></body></html>`);
  });
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const address=server.address();if(!address||typeof address==='string')throw new Error('Test server address missing');
    const blogOrigin=`http://127.0.0.1:${address.port}`;
    await page.goto(blogOrigin);
    await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
    expect(new URL(page.url()).origin).toBe(blogOrigin);
    expect(await state(page)).toMatchObject({count:1234,season:'christmas'});
    await expect(page.locator('visitor-village canvas')).toBeVisible();
  } finally {await new Promise<void>(resolve=>server.close(()=>resolve()));}
});

test('the installer generates deployed code and an owner admin link without claiming installation',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/install.html?lang=ko');
  await page.getByLabel('티스토리 주소',{exact:true}).fill('example.tistory.com/entry/hello');
  await page.locator('#create-code').click();
  const code=await page.getByLabel('티스토리 설치 코드',{exact:true}).inputValue();
  expect(code).toContain(`src="${appOrigin()}/widget/visitor-village.js"`);
  expect(code).toContain('count="[##_count_today_##]"');
  await expect(page.getByRole('link',{name:'내 블로그 관리자 열기'})).toHaveAttribute('href','https://example.tistory.com/manage');
  await expect(page.getByText('주소 입력만으로 설치되지는 않습니다.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'코드 복사',exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(code);
  await page.getByLabel('티스토리 주소',{exact:true}).fill('javascript:alert(1)');
  await expect(page.getByLabel('티스토리 설치 코드',{exact:true})).toBeHidden();
  await page.locator('#create-code').click();
  await expect(page.getByRole('alert')).not.toBeEmpty();
});

test('installation languages preserve the generated code, selected season and focus', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/install.html?lang=en&from=blog#setup');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('#blog-url').fill('example.tistory.com/entry/welcome');
  await page.locator('input[name="season"][value="spring"]').check();
  await page.locator('#advanced-settings summary').click();
  await page.locator('#install-refresh').check();
  await page.locator('#create-code').click();
  const snippet = await page.locator('#install-code').inputValue();
  expect(snippet).toContain('count="[##_count_today_##]"');
  expect(snippet).toContain('season="spring"');
  expect(snippet).toContain('refresh-interval="60"');
  for (const lang of ['ja', 'zh-CN', 'ko', 'en']) {
    await page.locator('#locale-select').focus();
    await page.locator('#locale-select').selectOption(lang);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('#locale-select')).toBeFocused();
    await expect(page.locator('#blog-url')).toHaveValue('example.tistory.com/entry/welcome');
    await expect(page.locator('input[name="season"][value="spring"]')).toBeChecked();
    await expect(page.locator('#install-refresh')).toBeChecked();
    await expect(page.locator('#install-code')).toHaveValue(snippet);
    await expect(page.locator('#admin-link')).toHaveAttribute('href', 'https://example.tistory.com/manage');
    expect(page.url()).toContain('from=blog');
    expect(page.url()).toContain('#setup');
  }
  await page.locator('#copy-code').click();
  await expect(page.locator('#copy-state')).toHaveText('Code copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(snippet);
  await page.locator('#locale-select').selectOption('ja');
  await expect(page.locator('#copy-state')).toHaveText('コードをコピーしました。');
  await page.goto('/install.html');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
});

for (const [lang, heading, emptyError] of [
  ['ko', '내 블로그에, 작은 마을 하나.', '티스토리 주소를 입력해 주세요.'],
  ['en', 'A little village, at home on your blog.', 'Enter your Tistory blog address.'],
  ['ja', 'あなたのブログに、小さな村を。', 'Tistoryのブログアドレスを入力してください。'],
  ['zh-CN', '给你的博客，添一座小村庄。', '请输入 Tistory 博客地址。'],
] as const) {
  test(`installer ${lang} translates validation and fits a 320px screen`, async ({page}) => {
    await page.setViewportSize({width: 320, height: 780});
    await page.goto(`/install.html?lang=${lang}`);
    await expect(page.getByRole('heading', {level: 1})).toHaveText(heading);
    await page.locator('#create-code').click();
    await expect(page.locator('#install-error')).toHaveText(emptyError);
    await expect(page.locator('#blog-url')).toBeFocused();
    await expect(page.locator('#blog-url')).toHaveAttribute('aria-invalid', 'true');
    await page.locator('#blog-url').fill('example.tistory.com');
    await page.locator('#create-code').click();
    await expect(page.locator('#copy-title')).toBeFocused();
    expect(await page.locator('#install-code').inputValue()).toContain('count="[##_count_today_##]"');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (lang !== 'ko') await expect(page.locator('#menu-original')).toBeVisible();
  });
}

test('installer preview changes all five seasons without recreating characters and localizes notices', async ({page}, testInfo) => {
  await page.setViewportSize({width: 1440, height: 1100});
  await page.goto('/install.html?lang=en');
  await page.waitForFunction(() => (document.querySelector('#preview-village') as any)?.ready);
  await page.locator('#preview-pause').click();
  await expect(page.locator('#preview-pause')).toHaveAttribute('aria-pressed', 'true');
  const people = await page.locator('#preview-village').evaluate(el => (el as any).getVisitors());
  for (const season of ['spring', 'summer', 'autumn', 'winter', 'christmas']) {
    await page.locator(`input[name="season"][value="${season}"]`).check();
    await expect.poll(() => page.locator('#preview-village').evaluate(el => (el as any).season)).toBe(season);
    expect(await page.locator('#preview-village').evaluate(el => (el as any).getVisitors())).toEqual(people);
  }
  await page.locator('#preview-village').evaluate(el => el.setAttribute('count', '25'));
  await expect(page.locator('#preview-village .notice')).toContainText('Today’s visitors: 25');
  await page.locator('#locale-select').selectOption('ja');
  await expect(page.locator('#preview-village .notice')).toContainText('今日の訪問者 25人');
  await expect(page.locator('#preview-village .repository')).toHaveAttribute('aria-label', /新しいタブ/);
  await page.locator('#locale-select').selectOption('ko');
  await page.locator('#preview-village').evaluate(el => el.setAttribute('count', '24'));
  await page.locator('#preview-pause').click();
  await expect(page.locator('#preview-village .notice')).toHaveCSS('opacity', '0');
  await page.screenshot({path: testInfo.outputPath('install-desktop.png'), fullPage: true});
  await page.setViewportSize({width: 390, height: 844});
  await page.locator('#locale-select').selectOption('en');
  await page.screenshot({path: testInfo.outputPath('install-mobile.png'), fullPage: true});
});

test('installer translates existing errors and survives blocked storage', async ({page}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
  });
  await page.goto('/install.html?lang=en');
  await page.locator('#create-code').click();
  await page.locator('#locale-select').selectOption('zh-CN');
  await expect(page.locator('#install-error')).toHaveText('请输入 Tistory 博客地址。');
  await page.locator('#blog-url').fill('https://user:secret@example.com');
  await page.locator('#create-code').click();
  await expect(page.locator('#install-error')).toHaveText('请使用不含账号信息或端口号的 HTTP 或 HTTPS 博客地址。');
  await expect(page.locator('#install-result')).toBeHidden();
});

test('installer clipboard fallback is translated and stale copy completion is ignored', async ({page}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.reject(new Error('denied'))}});
  });
  await page.goto('/install.html?lang=en');
  await page.locator('#blog-url').fill('example.tistory.com');
  await page.locator('#create-code').click();
  await page.locator('#copy-code').click();
  await expect(page.locator('#copy-state')).toHaveText('Code selected. Use your keyboard’s copy shortcut.');
  expect(await page.locator('#install-code').evaluate(el => (el as HTMLTextAreaElement).selectionEnd - (el as HTMLTextAreaElement).selectionStart)).toBeGreaterThan(20);
  await page.locator('#locale-select').selectOption('ja');
  await expect(page.locator('#copy-state')).toHaveText('コードを選択しました。キーボードのコピー操作を行ってください。');
  await page.evaluate(() => {
    (navigator.clipboard as any).writeText = () => new Promise<void>(resolve => { (window as any).completeCopy = resolve; });
  });
  await page.locator('#copy-code').click();
  await page.locator('#advanced-settings summary').click();
  await page.locator('#install-refresh').check();
  await page.evaluate(() => (window as any).completeCopy());
  await expect(page.locator('#install-result')).toBeHidden();
  await expect(page.locator('#copy-state')).toBeEmpty();
});

test('installer renderer failure leaves code creation usable and offers a localized retry', async ({page}) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as any; });
  await page.goto('/install.html?lang=en');
  await expect(page.locator('#preview-retry')).toBeVisible();
  await expect(page.locator('#preview-message')).toContainText('You can still create your install code.');
  await page.locator('#blog-url').fill('example.tistory.com');
  await page.locator('#create-code').click();
  const snippet = await page.locator('#install-code').inputValue();
  await page.locator('#locale-select').selectOption('ja');
  await page.locator('#preview-retry').click();
  await expect(page.locator('#preview-message')).toContainText('設置コードは引き続き作成できます。');
  await expect(page.locator('#install-code')).toHaveValue(snippet);
});

test('installer respects reduced motion in its live preview', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/install.html?lang=en');
  await page.waitForFunction(() => (document.querySelector('#preview-village') as any)?.ready);
  await expect(page.locator('#preview-pause')).toBeDisabled();
  const people = await page.locator('#preview-village').evaluate(el => (el as any).getVisitors());
  await page.waitForTimeout(150);
  expect(await page.locator('#preview-village').evaluate(el => (el as any).getVisitors())).toEqual(people);
  await expect(page.locator('#preview-tip')).toContainText('reduced motion');
});

test('installer retries a failed graphics module without losing form values', async ({page}) => {
  let blocked = false;
  await page.route('**/assets/visitor-village-*.js', route => {
    if (!blocked) { blocked = true; return route.abort('failed'); }
    return route.continue();
  });
  await page.goto('/install.html?lang=en');
  await expect(page.locator('#preview-retry')).toBeVisible();
  await page.locator('#blog-url').fill('example.tistory.com');
  await page.locator('input[name="season"][value="winter"]').check();
  await page.locator('#create-code').click();
  const snippet = await page.locator('#install-code').inputValue();
  await page.locator('#preview-retry').click();
  await expect.poll(() => page.locator('#preview-village').evaluateAll(elements => Boolean((elements[0] as any)?.ready))).toBe(true);
  await expect(page.locator('#install-code')).toHaveValue(snippet);
  await expect(page.locator('#blog-url')).toHaveValue('example.tistory.com');
});

test('installer settings and code generation work with the keyboard', async ({page}) => {
  await page.goto('/install.html?lang=en');
  await page.locator('input[name="season"][value="christmas"]').focus();
  await expect(page.locator('input[name="season"][value="christmas"]')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('input[name="season"][value="spring"]')).toBeChecked();
  await page.keyboard.press('Tab');
  await expect(page.locator('#blog-url')).toBeFocused();
  await page.keyboard.type('example.tistory.com');
  await page.keyboard.press('Tab');
  await expect(page.locator('#create-code')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#advanced-settings summary')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.locator('#install-refresh')).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#create-code')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#copy-title')).toBeFocused();
  expect(await page.locator('#install-code').inputValue()).toContain('season="spring"');
  expect(await page.locator('#install-code').inputValue()).toContain('refresh-interval="60"');
});

for (const motion of ['reduce', 'no-preference'] as const) {
  test(`installer canvas stays localized across frames, seasons and languages with motion ${motion}`, async ({page}) => {
    await page.emulateMedia({reducedMotion: motion});
    await page.goto('/install.html?lang=en');
    await page.waitForFunction(() => (document.querySelector('#preview-village') as any)?.ready);
    const canvas = page.locator('#preview-village canvas');
    await expect(canvas).toHaveAttribute('aria-label', 'Christmas square, 24 visitors');
    await page.waitForTimeout(100);
    await expect(canvas).toHaveAttribute('aria-label', 'Christmas square, 24 visitors');
    await page.locator('input[name="season"][value="summer"]').check();
    await expect(canvas).toHaveAttribute('aria-label', 'Summer greenery, 24 visitors');
    await page.locator('#locale-select').selectOption('ja');
    await expect(canvas).toHaveAttribute('aria-label', '夏の緑の広場, 訪問者 24人');
    await page.waitForTimeout(100);
    await expect(canvas).toHaveAttribute('aria-label', '夏の緑の広場, 訪問者 24人');
  });
}

test('design polish keeps Korean words intact and the mobile install action available', async ({page}, testInfo) => {
  await page.setViewportSize({width:375,height:667});
  await page.goto('/install.html?lang=ko');
  const wordLines=await page.locator('#page-title').evaluate(el=>{
    const node=el.firstChild!;const start=node.textContent!.indexOf('마을');
    const range=document.createRange();range.setStart(node,start);range.setEnd(node,start+2);
    return range.getClientRects().length;
  });
  expect(wordLines).toBe(1);
  const action=await page.locator('#create-code').boundingBox();
  expect(action&&action.y>=0&&action.y+action.height<=667).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:testInfo.outputPath('install-mobile-first-screen.png')});
});

test('design polish distinguishes changed settings from an unused install form in every language',async({page})=>{
  await page.goto('/install.html?lang=ko');
  await page.locator('#blog-url').fill('example.tistory.com');await page.locator('#create-code').click();
  await page.locator('input[name="season"][value="spring"]').check();
  await expect(page.locator('#settings-status')).toContainText('설정이 변경');
  await expect(page.locator('#create-code')).toHaveText('코드 다시 만들기');
  await expect(page.locator('#install-result')).toBeHidden();
  await expect(page.locator('#admin-link')).toBeHidden();
  await page.locator('#locale-select').selectOption('en');
  await expect(page.locator('#settings-status')).toContainText('Settings changed');
  await expect(page.locator('#create-code')).toHaveText('Recreate install code');
  for (const [lang, status, action] of [
    ['ja', '設定が変更されました。', '設置コードを再作成'],
    ['zh-CN', '设置已更改', '重新生成安装代码'],
  ]) {
    await page.locator('#locale-select').selectOption(lang);
    await expect(page.locator('#settings-status')).toContainText(status);
    await expect(page.locator('#create-code')).toHaveText(action);
  }
  await page.locator('#blog-url').fill('javascript:alert(1)');
  await page.locator('#create-code').click();
  await expect(page.locator('#settings-status')).toContainText('设置已更改');
  await expect(page.locator('#install-result')).toBeHidden();
  await page.locator('#blog-url').fill('example.tistory.com');
  await page.locator('#create-code').click();
  await expect(page.locator('#settings-status')).toBeEmpty();
  expect(await page.locator('#install-code').inputValue()).toContain('season="spring"');
});

test('design polish keeps enabled advanced settings and their warning visible when collapsed',async({page},testInfo)=>{
  await page.setViewportSize({width:375,height:667});
  await page.goto('/install.html?lang=ko');
  await expect(page.locator('#advanced-settings')).not.toHaveAttribute('open');
  await expect(page.locator('#refresh-warning')).toBeHidden();
  await expect(page.locator('#install-refresh')).toHaveAccessibleDescription('마을이 화면에 보일 때 같은 블로그의 HTML을 읽습니다.');
  await page.locator('#advanced-settings summary').click();
  await page.locator('#install-refresh').check();
  await expect(page.locator('#install-refresh')).toHaveAccessibleDescription(/검증하지 않았습니다/);
  await page.locator('#advanced-settings summary').click();
  await expect(page.locator('#refresh-enabled')).toBeVisible();
  await expect(page.locator('#refresh-warning')).toBeVisible();
  await expect(page.locator('#refresh-warning')).toContainText('검증하지 않았습니다');
  await page.locator('#locale-select').selectOption('en');
  await expect(page.locator('#refresh-enabled')).toHaveText('Auto-check on');
  await expect(page.locator('#refresh-warning')).toContainText('has not been verified');
  await page.locator('#blog-url').fill('example.tistory.com');
  await page.locator('#create-code').click();
  await expect(page.locator('#copy-title')).toBeFocused();
  expect(await page.locator('#create-code').evaluate(el=>getComputedStyle(el.parentElement!).position)).toBe('static');
  await page.locator('#copy-code').focus();
  const copy=await page.locator('#copy-code').boundingBox();
  expect(copy!.y).toBeGreaterThanOrEqual(0);expect(copy!.y+copy!.height).toBeLessThanOrEqual(667);
  await page.locator('input[name="season"][value="spring"]').check();
  expect(await page.locator('#create-code').evaluate(el=>getComputedStyle(el.parentElement!).position)).toBe('fixed');
  await page.locator('#advanced-settings summary').focus();
  const summary=await page.locator('#advanced-settings summary').boundingBox();
  const action=await page.locator('#create-code').boundingBox();
  expect(summary!.y+summary!.height).toBeLessThanOrEqual(action!.y);
  await page.locator('#refresh-warning').evaluate(el=>el.scrollIntoView({block:'center'}));
  const warning=await page.locator('#refresh-warning').boundingBox();
  expect(warning!.y).toBeGreaterThanOrEqual(0);
  expect(warning!.y+warning!.height).toBeLessThanOrEqual(action!.y);
  await page.screenshot({path:testInfo.outputPath('install-mobile-dirty-warning.png')});
});

test('design polish keeps readable brand and controls across installation and immersive homepage',async({page},testInfo)=>{
  const metrics=async()=>page.locator('.brand-mark').evaluate(el=>({
    width:getComputedStyle(el).width,height:getComputedStyle(el).height,shape:getComputedStyle(el).clipPath,
  }));
  for(const width of [1440,520,375]){
    await page.setViewportSize({width,height:1000});
    await page.goto('/install.html?lang=ko');const installMark=await metrics();
    await page.goto('/');const homeMark=await metrics();expect(parseFloat(homeMark.width)).toBeGreaterThanOrEqual(parseFloat(installMark.width));expect(parseFloat(homeMark.height)).toBeGreaterThanOrEqual(parseFloat(installMark.height));
    await expect(page.locator('.brand-mark')).toHaveAttribute('src',/tree-summer/);
    for(const control of ['#pause','#season','#visitors']) expect(await page.locator(control).evaluate(el=>el.getBoundingClientRect().height)).toBe(48);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(width===1440)await page.screenshot({path:testInfo.outputPath('demo-dark-desktop.png'),fullPage:true});
  }
});

test('design polish limits only the installer repository link to its visible badge',async({page,context})=>{
  await context.route('https://github.com/hyunolike/pixel-visitor-village',route=>route.fulfill({body:'Repository test destination',contentType:'text/html'}));
  await page.goto('/install.html?lang=en');
  await page.waitForFunction(()=>(document.querySelector('#preview-village') as any)?.ready);
  const stage=await page.locator('#preview-stage').boundingBox();
  const link=page.locator('#preview-village .repository');const badge=await link.boundingBox();
  expect(badge!.width).toBeLessThan(stage!.width/2);
  let opened=0;page.on('popup',()=>{opened++;});
  await page.locator('#preview-stage').click({position:{x:20,y:100}});
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  expect(opened).toBe(0);
  await link.focus();const popupPromise=page.waitForEvent('popup');await page.keyboard.press('Enter');
  const popup=await popupPromise;await popup.waitForLoadState();expect(popup.url()).toContain('github.com/hyunolike/pixel-visitor-village');await popup.close();
});

test('design polish removes inactive visitor notices from the accessibility tree after a language switch',async({page})=>{
  await page.clock.install();await page.goto('/install.html?lang=ko');
  await page.waitForFunction(()=>(document.querySelector('#preview-village') as any)?.ready);
  const notice=page.locator('#preview-village .notice');
  await expect(notice).toHaveAttribute('data-open','true');
  await page.clock.fastForward(3100);
  await expect(notice).toHaveAttribute('aria-hidden','true');
  await page.locator('#locale-select').selectOption('en');
  expect(await page.locator('#preview-village').ariaSnapshot()).not.toContain('오늘 방문');
});

test('design polish preserves a mobile click from address editing to advanced settings',async({page})=>{
  await page.setViewportSize({width:375,height:667});
  await page.goto('/install.html?lang=en');
  await page.locator('#blog-url').fill('example.tistory.com');
  await page.locator('#advanced-settings summary').click();
  await expect(page.locator('#advanced-settings')).toHaveAttribute('open','');
  await page.locator('#install-refresh').check();
  await expect(page.locator('#refresh-warning')).toBeVisible();
  await page.waitForFunction(()=>(document.querySelector('#preview-village') as any)?.ready);
  await page.locator('#blog-url').fill('example.tistory.com');
  await page.locator('#preview-pause').click();
  await expect(page.locator('#preview-pause')).toHaveAttribute('aria-pressed','true');
});

test('atelier desktop prioritizes a large live village beside concise season settings',async({page})=>{
  await page.setViewportSize({width:1487,height:1058});
  await page.goto('/install.html?lang=ko');
  await page.waitForFunction(()=>(document.querySelector('#preview-village') as any)?.ready);
  await expect(page.locator('#page-title')).toHaveText('내 블로그에, 작은 마을 하나.');
  await expect(page.locator('.intro-copy p')).toHaveText('오늘 방문자 수만큼 픽셀 캐릭터가 마을에 모여요.');
  const settings=await page.locator('#setup').boundingBox(),preview=await page.locator('.preview-panel').boundingBox();
  expect(preview!.x).toBeGreaterThan(settings!.x+settings!.width-1);
  expect(preview!.width).toBeGreaterThan(settings!.width*1.7);
  const season=await page.locator('#install-season').boundingBox(),address=await page.locator('#blog-url').boundingBox();
  expect(season!.y+season!.height).toBeLessThan(address!.y);
  await expect(page.locator('.install-progress [aria-current="step"]')).toHaveAttribute('data-install-step','1');
  await expect(page.locator('#install-instructions')).not.toHaveAttribute('open');
});

test('atelier mobile keeps the header compact and the actual preview before settings',async({page})=>{
  await page.setViewportSize({width:375,height:667});await page.goto('/install.html?lang=ko');
  await page.waitForFunction(()=>(document.querySelector('#preview-village') as any)?.ready);
  expect((await page.locator('.site-header').boundingBox())!.height).toBeLessThanOrEqual(80);
  const preview=await page.locator('#preview-stage').boundingBox(),settings=await page.locator('#setup').boundingBox();
  expect(preview!.y).toBeLessThan(settings!.y);expect(preview!.y+preview!.height).toBeLessThanOrEqual(595);
  const create=await page.locator('#create-code').boundingBox();expect(create!.y+create!.height).toBeLessThanOrEqual(667);
  expect(await page.locator('#preview-stage').evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('#setup')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
});

test('atelier menu stays accessible in four languages and returns focus on Escape',async({page})=>{
  await page.setViewportSize({width:320,height:780});
  for(const locale of ['ko','en','ja','zh-CN']){
    await page.goto(`/install.html?lang=${locale}`);
    await page.evaluate(()=>document.fonts.ready);
    await expect(page.locator('#project-navigation')).toBeHidden();
    expect((await page.locator('#navigation-toggle').boundingBox())!.height).toBeLessThanOrEqual(48);
    for(const step of await page.locator('.install-progress li').all()) expect(await step.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await page.locator('#navigation-toggle').click();
    await expect(page.locator('#project-navigation')).toBeVisible();
    const headerBox=(await page.locator('.site-header').boundingBox())!,menuBox=(await page.locator('#project-navigation').boundingBox())!;
    expect(Math.abs(menuBox.y-headerBox.y-headerBox.height)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(()=>scrollY)).toBe(0);
    await expect(page.locator('#project-navigation')).toBeInViewport();
    await expect(page.locator('#navigation-toggle')).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#project-navigation a').first()).toBeFocused();
    await page.keyboard.press('Tab');await expect(page.locator('#project-navigation a').nth(1)).toBeFocused();
    await expect(page.locator('#project-navigation a[href*=github]')).toHaveAccessibleName(/GitHub.+/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#navigation-toggle')).toBeFocused();await expect(page.locator('#project-navigation')).toBeHidden();
    expect((await page.locator('.site-header').boundingBox())!.height).toBeLessThanOrEqual(80);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.locator('#navigation-toggle').click();await page.locator('#usage-docs-link').click();
  await expect(page.getByRole('heading',{name:'마을 사용 문서',exact:true})).toBeVisible();
});

test('atelier code handoff tracks preparation and copying without claiming installation',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/install.html?lang=ko');
  await expect(page.locator('#copy-step')).toBeHidden();
  await page.locator('#blog-url').fill('example.tistory.com');await page.locator('#create-code').click();
  await expect(page.locator('.preview-panel #copy-step')).toBeVisible();await expect(page.locator('#copy-title')).toBeFocused();
  await expect(page.locator('.install-progress [aria-current="step"]')).toHaveAttribute('data-install-step','2');
  await expect(page.locator('#install-instructions')).toHaveAttribute('open','');
  await page.locator('#install-instructions summary').click();await page.locator('#locale-select').selectOption('en');
  await expect(page.locator('#install-instructions')).not.toHaveAttribute('open');
  await page.locator('#copy-code').click();
  await expect(page.locator('.install-progress [aria-current="step"]')).toHaveAttribute('data-install-step','3');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('count="[##_count_today_##]"');
  await page.locator('input[name=season][value=spring]').check();
  await expect(page.locator('#install-result')).toBeHidden();await expect(page.locator('#copy-step')).toBeVisible();
  await expect(page.locator('.install-progress [aria-current="step"]')).toHaveAttribute('data-install-step','1');
  await expect(page.locator('#settings-status')).toContainText('Settings changed');
});


test('atelier field boundaries retain non-text contrast on light and dark surfaces',async({page})=>{
  for(const [path,selector] of [['/install.html?lang=ko','#blog-url'],['/','#visitors']]){
    await page.goto(path);
    const ratio=await page.locator(selector).evaluate(el=>{
      const style=getComputedStyle(el);
      const luminance=(color:string)=>{
        const rgb=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
        return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
      };
      const pair=[luminance(style.borderTopColor),luminance(style.backgroundColor)].sort((a,b)=>a-b);
      return (pair[1]+.05)/(pair[0]+.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(3);
  }
});


test('cozy art retries a failed monument for a new village without losing either visitor total',async({page})=>{
  let requests=0;
  await page.addInitScript(()=>{(window as any).artErrors=[];document.addEventListener('village-error',(event:any)=>{if(['tree','monument'].includes(event.detail.attribute))(window as any).artErrors.push(event.detail);});});
  await page.route('**/tistory-monument-*.png',route=>{requests++;return requests===1?route.abort():route.continue();});
  await page.goto('/');await page.waitForFunction(()=>(document.querySelector('visitor-village') as any)?.ready);
  await expect(page.locator('visitor-village').first().locator('[role=status]')).toContainText('기본 그림');
  await page.evaluate(()=>{const village=document.createElement('visitor-village');village.id='cozy-second';village.setAttribute('count','37');village.style.cssText='display:block;height:420px';document.body.append(village);});
  await page.waitForFunction(()=>(document.querySelector('#cozy-second') as any)?.ready);
  expect(await page.evaluate(()=>(window as any).artErrors[0].attribute)).toBe('monument');
  expect(requests).toBe(2);expect(await page.locator('visitor-village').first().evaluate(el=>(el as any).visitorCount)).toBe(12);
  expect(await page.locator('#cozy-second').evaluate(el=>(el as any).visitorCount)).toBe(37);await expect(page.locator('#cozy-second [role=status]')).toBeEmpty();
});

test('cozy seasonal artwork failure remains localized while code creation and counting work',async({page})=>{
  await page.addInitScript(()=>{(window as any).artErrors=[];document.addEventListener('village-error',(event:any)=>{if(['tree','monument'].includes(event.detail.attribute))(window as any).artErrors.push(event.detail);});});
  await page.route('**/tree-summer-*.png',route=>route.abort());await page.goto('/install.html?lang=ja');await page.waitForFunction(()=>(document.querySelector('#preview-village') as any)?.ready);
  await expect(page.locator('#preview-village [role=status]')).toBeEmpty();await page.locator('input[name=season][value=summer]').check();
  await expect(page.locator('#preview-village [role=status]')).toContainText('代わりの絵');
  expect(await page.evaluate(()=>(window as any).artErrors)).toEqual([expect.objectContaining({attribute:'tree',message:expect.stringContaining('代わりの絵')})]);
  expect(await page.locator('#preview-village').evaluate(el=>(el as any).visitorCount)).toBe(24);
  await page.locator('#blog-url').fill('example.tistory.com');await page.locator('#create-code').click();expect(await page.locator('#install-code').inputValue()).toContain('season="summer"');
  await page.locator('input[name=season][value=winter]').check();await expect(page.locator('#preview-village [role=status]')).toBeEmpty();
});

test('cozy shared artwork survives removal of a neighboring widget',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.waitForFunction(()=>(document.querySelector('visitor-village') as any)?.ready);
  await page.evaluate(()=>{const village=document.createElement('visitor-village');village.id='cozy-survivor';village.setAttribute('count','0');village.setAttribute('season','summer');village.setAttribute('paused','');village.setAttribute('glow','false');village.style.cssText='display:block;width:320px;height:420px';document.body.append(village);});
  await page.waitForFunction(()=>(document.querySelector('#cozy-survivor') as any)?.ready);
  const before=await page.locator('#cozy-survivor').evaluate(el=>{el.setAttribute('season','summer');return el.shadowRoot!.querySelector('canvas')!.toDataURL();});
  expect(before.length).toBeGreaterThan(5000);
  const after=await page.evaluate(()=>{document.querySelector('visitor-village')!.remove();const village=document.querySelector('#cozy-survivor')!;village.setAttribute('season','summer');return village.shadowRoot!.querySelector('canvas')!.toDataURL();});
  await expect(page.locator('#cozy-survivor [role=status]')).toBeEmpty();expect(after).toBe(before);
});


test('cozy mobile renderer keeps every visitor sprite inside the actual canvas',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [320,375]){
    await page.setViewportSize({width,height:780});await page.goto('/install.html?lang=ko');await page.waitForFunction(()=>(document.querySelector('#preview-village') as any)?.ready);
    await page.locator('#preview-village').evaluate(el=>el.setAttribute('count','5000'));
    const overflow=await page.locator('#preview-village').evaluate(el=>{const view=(el as any).view,{width,height}=view.app.screen;return view.people.map((sprite:any,id:number)=>({id,b:sprite.getBounds()})).filter(({b}:any)=>b.minX<-.001||b.maxX>width+.001||b.minY<-.001||b.maxY>height+.001).map(({id}:any)=>id);});
    expect(overflow).toEqual([]);expect(await page.locator('#preview-village').evaluate(el=>(el as any).visitorCount)).toBe(5000);
  }
});
