import { expect, test, type Page } from '@playwright/test';
import { createServer } from 'node:http';
const waitReady=async(page:Page)=> {
  await page.goto('/');
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
};
const state=async(page:Page)=>page.locator('visitor-village').first().evaluate((el:any)=>({count:el.visitorCount,season:el.season,people:el.getVisitors()}));

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
  await page.route('**/christmas-tree-*.png',route=>route.abort());
  await page.goto('/');
  await expect(page.locator('visitor-village canvas')).toBeVisible();
  await expect(page.locator('visitor-village [role=status]')).toContainText('기본 나무');
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
  const page=await context.newPage();await page.goto('http://127.0.0.1:4178/');
  await page.waitForFunction(()=>Boolean((document.querySelector('visitor-village') as any)?.ready));
  const canvas=await page.locator('visitor-village canvas').boundingBox();
  const cdp=await context.newCDPSession(page),x=canvas!.x+canvas!.width/2,y=canvas!.y+canvas!.height*.65;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*20}]});await page.waitForTimeout(20);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(20);await context.close();
});

test('the distribution module loads from a different blog origin',async({page})=>{
  const server=createServer((_request,response)=>{
    response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    response.end(`<!doctype html><html lang="ko"><head><meta charset="utf-8"></head><body><h1>다른 출처의 블로그</h1><script type="module" src="http://127.0.0.1:4178/widget/visitor-village.js"></script><visitor-village count="1,234" season="christmas" style="display:block;height:420px"></visitor-village></body></html>`);
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
  await page.goto('/install.html');
  await page.getByLabel('티스토리 주소',{exact:true}).fill('example.tistory.com/entry/hello');
  await page.getByRole('button',{name:'설치 코드 만들기',exact:true}).click();
  const code=await page.getByLabel('티스토리 설치 코드',{exact:true}).inputValue();
  expect(code).toContain('src="http://127.0.0.1:4178/widget/visitor-village.js"');
  expect(code).toContain('count="[##_count_today_##]"');
  await expect(page.getByRole('link',{name:'내 블로그 관리자 열기'})).toHaveAttribute('href','https://example.tistory.com/manage');
  await expect(page.getByText('주소 입력만으로 설치되지는 않습니다.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'코드 복사',exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(code);
  await page.getByLabel('티스토리 주소',{exact:true}).fill('javascript:alert(1)');
  await expect(page.getByLabel('티스토리 설치 코드',{exact:true})).toBeHidden();
  await page.getByRole('button',{name:'설치 코드 만들기',exact:true}).click();
  await expect(page.getByRole('alert')).not.toBeEmpty();
});
