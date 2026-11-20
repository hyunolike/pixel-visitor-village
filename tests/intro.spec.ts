import { expect,test } from '@playwright/test';

test('the intro shows a poster and plays muted inline when visible',async({page})=>{
  await page.goto('/#intro-film');
  const video=page.locator('#intro-video');
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute('poster','./media/intro-poster.jpg');
  expect(await video.evaluate((element:HTMLVideoElement)=>({muted:element.muted,inline:element.playsInline,loop:element.loop,controls:element.controls}))).toEqual({muted:true,inline:true,loop:true,controls:true});
  await video.scrollIntoViewIfNeeded();
  await expect.poll(()=>video.evaluate((element:HTMLVideoElement)=>element.currentTime)).toBeGreaterThan(.1);
  await page.setViewportSize({width:320,height:850});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('reduced motion keeps the poster still and permits manual playback',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#intro-film');
  const video=page.locator('#intro-video');
  await expect(video).toBeVisible();await video.scrollIntoViewIfNeeded();
  await expect.poll(()=>video.evaluate((element:HTMLVideoElement)=>element.readyState)).toBeGreaterThanOrEqual(2);
  await page.waitForTimeout(250);
  expect(await video.evaluate((element:HTMLVideoElement)=>({paused:element.paused,time:element.currentTime}))).toEqual({paused:true,time:0});
  await video.focus();await video.press('Space');
  await expect.poll(()=>video.evaluate((element:HTMLVideoElement)=>element.currentTime)).toBeGreaterThan(.1);
});

test('scrolling suspends playback but preserves a manual pause',async({page})=>{
  await page.goto('/#intro-film');
  const video=page.locator('#intro-video');
  await expect(video).toBeVisible();await video.scrollIntoViewIfNeeded();
  await expect.poll(()=>video.evaluate((element:HTMLVideoElement)=>element.paused)).toBe(false);
  await page.evaluate(()=>window.scrollTo(0,0));
  await expect.poll(()=>video.evaluate((element:HTMLVideoElement)=>element.paused)).toBe(true);
  await video.scrollIntoViewIfNeeded();
  await expect.poll(()=>video.evaluate((element:HTMLVideoElement)=>element.paused)).toBe(false);
  await video.evaluate((element:HTMLVideoElement)=>element.pause());
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(150);await video.scrollIntoViewIfNeeded();await page.waitForTimeout(150);
  expect(await video.evaluate((element:HTMLVideoElement)=>element.paused)).toBe(true);
});

test('an unavailable video leaves its poster, a message and direct file link',async({page})=>{
  await page.route('**/media/intro.mp4',route=>route.abort());
  await page.goto('/#intro-film');
  await expect(page.locator('#intro-video')).toBeVisible();
  await expect(page.locator('#intro-video-status')).toBeVisible();
  await expect(page.locator('#intro-video-status')).toContainText('소개 영상을 불러오지 못했어요');
  await expect(page.getByRole('link',{name:'영상 파일 열기',exact:true})).toHaveAttribute('href','./media/intro.mp4');
});
