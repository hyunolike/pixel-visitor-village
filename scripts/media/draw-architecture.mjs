// Directly authored SVG layout. Brand files are official originals; see assets README.
import { readFile,writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const dir='docs/assets/architecture';
const xml=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const data=async(path,type)=>`data:${type};base64,${(await readFile(path)).toString('base64')}`;
const [tistory,ts,pixi,cloud,tree,shot]=await Promise.all([
  data(`${dir}/logos/tistory.png`,'image/png'),data(`${dir}/logos/typescript.png`,'image/png'),
  data(`${dir}/logos/pixijs.svg`,'image/svg+xml'),data(`${dir}/logos/cloudflare.png`,'image/png'),
  data('src/assets/cozy/tree-summer.png','image/png'),
  data('brag-output/intro-refresh/work/widget-current-180.png','image/png'),
]);
const mark=(x,y,size)=>`<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100"><path fill="#5752cf" d="M40 0H60V16H80V36H100V68H60V100H40V68H0V36H20V16H40Z"/></svg>`;
const img=(href,x,y,w,h)=>`<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const txt=(s,x,y,size=24,fill='#44546a',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}">${xml(s)}</text>`;
const card=(x,y,w,h,fill='#fff')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#cdd5e1" stroke-width="2"/>`;
const label=(s,x,y,w)=>`<rect x="${x-10}" y="${y-25}" width="${w}" height="34" fill="#f6f8fc"/>${txt(s,x,y,22,'#33466b',700)}`;
const arrow=(d,dashed=false)=>`<path d="${d}" fill="none" stroke="${dashed?'#8492aa':'#5752cf'}" stroke-width="4" ${dashed?'stroke-dasharray="9 8"':''} marker-end="url(#${dashed?'muted':'arrow'})"/>`;
for(const locale of ['ko','en']){
  const ko=locale==='ko';
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1140" viewBox="0 0 1800 1140" role="img" aria-labelledby="title desc"><title id="title">${ko?'방문자 마을의 동작 구조':'How Pixel Visitor Village works'}</title><desc id="desc">${ko?'티스토리 오늘 방문자 수와 정적 모듈을 입력받아 모델을 계산하고 PixiJS로 Shadow DOM 안에 그립니다.':'The Tistory daily count and static module initialize a Web Component, whose model drives a PixiJS Canvas inside Shadow DOM.'}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="#5752cf"/></marker><marker id="muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10" fill="#8492aa"/></marker></defs><rect width="1800" height="1140" fill="#f6f8fc"/><g font-family="NanumSquareRound, NanumSquareRoundR, Arial, sans-serif">`;
  svg+=mark(70,48,54)+txt(ko?'방문자 수가 작은 마을이 되기까지':'From a daily count to a pixel village',145,90,42,'#15263e',700);
  svg+=txt(ko?'브라우저에서 계산하고 그립니다. 별도 방문자 집계 서버나 데이터베이스는 사용하지 않습니다.':'Calculated and drawn in the browser. No separate visitor-counting server or database.',70,135,26);
  svg+=arrow('M900 240V185H280V240',true)+label(ko?'선택: 같은 블로그 HTML 확인 · 60–3600초 · 기본 꺼짐':'Optional: poll the same blog HTML · 60–3600 s · off by default',380,189,ko?605:815);
  svg+=card(70,240,420,190)+img(tistory,94,264,58,58)+txt('TISTORY',170,305,30,'#15263e',700);
  svg+=txt(ko?'스킨 HTML의 오늘 방문자 수':'Daily count in skin HTML',98,357,25)+txt('[##_count_today_##]',98,399,25,'#15263e',700);
  svg+=card(680,240,440,190,'#eeedff')+mark(706,267,48)+txt('visitor-village',774,304,31,'#15263e',700);
  svg+=txt('Web Component',708,355,25,'#5752cf',700)+txt(ko?'입력 검증 / 생명주기 / 팻말':'Validation / lifecycle / notice',708,398,24);
  svg+=card(1310,240,420,190)+img(cloud,1332,256,100,70)+txt('Cloudflare Pages',1443,302,27,'#15263e',700);
  svg+=txt(ko?'정적 파일 호스팅':'Static file hosting',1338,357,25)+txt('visitor-village.js',1338,399,25,'#15263e',700);
  svg+=arrow('M490 337H680')+label('count',543,322,85)+arrow('M1310 337H1120')+label('ES module',1153,322,144);
  svg+=arrow('M900 430V530')+label(ko?'상태 갱신':'Update state',922,490,ko?130:170);
  svg+=card(680,530,440,170)+img(ts,707,553,54,54)+txt('VillageModel',780,585,30,'#15263e',700);
  svg+=txt('+ SocialModel',708,637,27,'#5752cf',700)+txt(ko?'수 / 이동 / 짝 인사와 말풍선':'Count / movement / greetings',708,678,24);
  svg+=arrow('M900 700V820')+label(ko?'프레임별 상태':'Per-frame state',922,770,ko?174:201);
  svg+=card(680,820,440,200)+img(pixi,703,842,116,48)+txt('PixiJS 8',843,878,31,'#15263e',700);
  svg+=txt(ko?'WebGL / 공유 텍스처 / 깊이 정렬':'WebGL / textures / depth order',708,933,24)+txt(ko?'계절 장식과 산타·루돌프 등장':'Seasonal effects / holiday guests',708,980,23);
  svg+=card(70,820,420,200)+img(tree,89,835,95,145)+txt(ko?'프로젝트 픽셀 그림':'Project pixel artwork',195,878,27,'#15263e',700);
  svg+=txt('PNG / Canvas RGBA',195,923,22)+txt(ko?'나무 / 집 / 캐릭터 / 말풍선':'Trees / houses / characters',98,992,24);
  svg+=arrow('M490 928H680')+label(ko?'그림 → 텍스처':'Art → textures',510,910,ko?162:168);
  svg+=card(1310,820,420,200)+txt('Shadow DOM + Canvas',1336,858,28,'#15263e',700)+img(shot,1336,877,368,103)+txt(ko?'블로그의 지정 영역에 표시':'Inside the blog’s chosen area',1336,1003,23);
  svg+=arrow('M1120 928H1310')+label(ko?'화면 출력':'Draw frame',1157,910,ko?132:147);
  svg+=txt(ko?'실선: 기본 흐름     점선: 선택적 조회     방문자 수는 오늘 누적 집계이며 동시 접속자나 개별 신원을 뜻하지 않습니다.':'Solid: default flow     Dashed: optional polling     Daily aggregate count; no live presence or individual identity.',70,1094,24);
  svg+='</g></svg>';
  await writeFile(`${dir}/architecture-${locale}.svg`,svg);
}
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1800,height:1140},deviceScaleFactor:1});
  for(const locale of ['ko','en']){
    await page.goto(pathToFileURL(resolve(`${dir}/architecture-${locale}.svg`)).href);
    await page.screenshot({path:`${dir}/architecture-${locale}.png`});
  }
}finally{await browser.close();}
