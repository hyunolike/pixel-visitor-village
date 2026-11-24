import './visitor-village';
import './demo.css';
import { setupIntroVideo } from './intro-video';
import { themes } from './themes';
import type { VisitorVillage } from './visitor-village';

document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
<article class="page">
  <a class="skip-link" href="#demo">마을 체험으로 건너뛰기</a>
  <header class="top"><a class="project-brand" href="./index.html" aria-label="작은 방문자 마을 홈"><span class="tree-mark brand-mark" aria-hidden="true"></span><span class="brand brand-title">작은 방문자 마을</span></a><nav class="top-links project-nav" aria-label="프로젝트 안내"><a href="#demo" aria-current="page">마을 체험</a><a href="./install.html">설치하기</a><a href="./docs/">사용 문서</a><a href="https://github.com/hyunolike/pixel-visitor-village" target="_blank" rel="noopener noreferrer">GitHub<span class="sr-only"> (새 탭)</span></a></nav></header>
  <section class="home-hero" aria-labelledby="home-title"><div><h1 id="home-title">오늘의 방문이<br>작은 마을이 됩니다.</h1><p class="hero-description">티스토리의 오늘 방문자 수만큼 픽셀 캐릭터가 모입니다. 계절이 바뀌고 서로 인사를 나누는 마을을 블로그에 놓아 보세요.</p><div class="hero-actions"><a id="home-install" class="button button-primary" href="./install.html">내 블로그에 설치하기</a><a href="#demo">먼저 둘러보기</a></div></div><p class="hero-note">오늘의 방문 수를<br>한 명, 한 명의 캐릭터로.</p></section>
  <section id="demo" aria-labelledby="demo-title" tabindex="-1">
  <div class="intro"><div><h2 id="demo-title">지금, 마을을 둘러보세요.</h2><p>계절과 인원을 바꾸며 내 블로그의 모습을 미리 확인하세요.</p></div><div class="count"><span>시연 방문자 수</span><strong id="visitor-count">24<small>명</small></strong></div></div>
  <div class="stage"><visitor-village count="24" season="christmas"></visitor-village></div>
  <section class="tools" aria-label="마을 꾸미기">
    <div class="field"><label for="season">나무 꾸미기</label><select id="season"><option value="christmas">크리스마스</option><option value="spring">봄 · 꽃나무</option><option value="summer">여름 · 푸른 나무</option><option value="autumn">가을 · 단풍나무</option><option value="winter">겨울 · 눈꽃나무</option></select></div>
    <div class="field"><label for="visitors">시연 방문자 수</label><div class="visitor-inputs"><input id="visitors" type="text" value="24" inputmode="numeric" autocomplete="off" spellcheck="false"><input id="visitor-range" type="range" value="24" min="0" max="200" aria-label="0명에서 200명까지 빠른 방문자 수 조절"></div></div>
    <div class="actions"><button id="glow" class="button button-secondary" type="button" aria-pressed="true">빛 번짐 켜짐</button><button id="pause" class="button button-secondary" type="button" aria-pressed="false">움직임 멈추기</button></div>
  </section>
  <p class="demo-note">24명은 시연용 숫자입니다. 설치 후에는 블로그의 오늘 누적 방문 수를 사용하며, 동시 접속자나 개별 방문자의 신원을 나타내지 않습니다.</p>
  </section>
  <section class="home-section" aria-labelledby="features-title"><h2 id="features-title">방문이 쌓이는 풍경</h2><div class="feature-list"><div><h3>다섯 가지 계절</h3><p>크리스마스와 봄, 여름, 가을, 겨울. 블로그에 어울리는 풍경을 고르세요.</p></div><div><h3>작은 인사와 반응</h3><p>가까운 캐릭터가 손을 흔들고 아이콘 말풍선으로 반응합니다. 움직임은 잠시 멈출 수도 있어요.</p></div><div><h3>오늘의 방문 수 팻말</h3><p>처음 확인한 오늘의 수와 같은 날짜의 증가분을 나무 팻말로 알려드립니다.</p></div></div></section>
  <section class="intro-film" id="intro-film" aria-labelledby="intro-film-title">
    <div class="film-heading"><div><span class="film-label">20초 소개 영상</span><h2 id="intro-film-title">방문자가 모이면, 마을이 됩니다.</h2><p id="intro-video-description">캐릭터가 걷고 계절이 바뀌는 작은 방문자 마을을 만나 보세요.</p></div><a class="film-file" href="./media/intro.mp4" target="_blank" rel="noopener">영상 파일 열기</a></div>
    <video id="intro-video" src="./media/intro.mp4" poster="./media/intro-poster.jpg" controls muted loop playsinline preload="metadata" aria-label="작은 방문자 마을 소개 영상" aria-describedby="intro-video-description">이 브라우저에서는 영상 재생을 지원하지 않습니다.</video>
    <p class="film-caption">음소거로 시작합니다. 소리는 플레이어에서 켤 수 있어요. 영상 속 방문자 수는 시연용입니다.</p>
    <p class="film-credit">Music: <a href="https://ende.app/en" target="_blank" rel="noopener">Sascha Ende</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> · 20초 편집</p>
    <p class="film-status" id="intro-video-status" role="status" hidden>소개 영상을 불러오지 못했어요. ‘영상 파일 열기’로 확인해 주세요.</p>
  </section>
  <section class="home-section" aria-labelledby="start-title"><div class="section-heading"><h2 id="start-title">블로그에 놓는 세 단계</h2><a href="./docs/#quick-start">자세한 설치 방법</a></div><ol class="setup-steps"><li><h3>마을 설정하기</h3><p>블로그 주소와 처음 보여 줄 계절을 선택합니다.</p></li><li><h3>스킨에 코드 넣기</h3><p>생성된 코드를 복사하고 티스토리 스킨 HTML에 붙여 넣습니다.</p></li><li><h3>실제 블로그 확인하기</h3><p>오늘 방문자 수와 모바일 화면을 확인합니다. 주소 입력만으로 설치되지는 않아요.</p></li></ol><a class="button button-primary" href="./install.html">설치 코드 만들기</a></section>
  <section class="home-section home-faq" aria-labelledby="faq-title"><h2 id="faq-title">설치 전에 궁금한 점</h2><details><summary>지금 접속한 사람 수를 보여 주나요?</summary><p>오늘 누적 방문 수를 사용합니다. 캐릭터는 실제 방문자와 연결되지 않으며 이름이나 위치를 나타내지 않습니다. <a href="./docs/#visitor-count">집계 방식 알아보기</a></p></details><details><summary>복사한 코드는 어디에 넣나요?</summary><p>티스토리 관리자에서 꾸미기 → 스킨 편집 → HTML 편집을 열고 원하는 위치에 넣습니다. 먼저 현재 스킨을 백업해 두세요. <a href="./docs/#quick-start">설치 순서 보기</a></p></details><details><summary>방문 수가 바로 바뀌지 않으면 어떻게 하나요?</summary><p>기본은 페이지를 열 때 전달된 숫자입니다. 1분 확인은 선택 기능이며 티스토리 집계 지연과 반복 조회의 영향은 미검증입니다. <a href="./docs/#troubleshooting">문제 해결 문서 보기</a></p></details></section>
  <footer class="home-footer"><span id="theme-description">${themes.christmas.description}</span><nav aria-label="더 알아보기"><a href="./docs/">사용 문서</a><a href="./docs/#credits">제작과 출처</a><a href="https://github.com/hyunolike/pixel-visitor-village" target="_blank" rel="noopener noreferrer">GitHub (새 탭)</a></nav></footer>
</article>`;

const widget=document.querySelector<VisitorVillage>('visitor-village')!;
const season=document.querySelector<HTMLSelectElement>('#season')!;
const number=document.querySelector<HTMLInputElement>('#visitors')!;
const range=document.querySelector<HTMLInputElement>('#visitor-range')!;
const pause=document.querySelector<HTMLButtonElement>('#pause')!;
const glow=document.querySelector<HTMLButtonElement>('#glow')!;
season.addEventListener('change',()=>widget.setAttribute('season',season.value));
number.addEventListener('input',()=>widget.setAttribute('count',number.value));
range.addEventListener('input',()=>{number.value=range.value;widget.setAttribute('count',range.value);});
pause.addEventListener('click',()=>widget.toggleAttribute('paused'));
glow.addEventListener('click',()=>widget.setAttribute('glow',widget.getAttribute('glow')==='false'?'true':'false'));
const sync=()=>{
  const strong=document.querySelector('#visitor-count')!;strong.replaceChildren(String(widget.visitorCount));const small=document.createElement('small');small.textContent='명';strong.append(small);
  range.value=String(Math.min(200,widget.visitorCount));
  document.querySelector('#theme-description')!.textContent=themes[widget.season].description;
  const reduced=widget.motionReduced,paused=widget.hasAttribute('paused');
  pause.disabled=reduced;pause.textContent=reduced?'모션 줄이기 적용':paused?'움직임 재생':'움직임 멈추기';pause.setAttribute('aria-pressed',String(reduced||paused));
  const glows=widget.getAttribute('glow')!=='false';glow.disabled=widget.season!=='christmas';glow.textContent=glows?'빛 번짐 켜짐':'빛 번짐 꺼짐';glow.setAttribute('aria-pressed',String(glows));
};
widget.addEventListener('village-change',sync);widget.addEventListener('village-ready',sync);sync();

setupIntroVideo(document.querySelector<HTMLVideoElement>('#intro-video')!,document.querySelector<HTMLElement>('#intro-video-status')!);
if(location.hash==='#intro-film'||location.hash==='#demo')document.querySelector(location.hash)?.scrollIntoView({block:'start'});
