import './visitor-village';
import './demo.css';
import { setupIntroVideo } from './intro-video';
import { themes } from './themes';
import type { VisitorVillage } from './visitor-village';

document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
<article class="page">
  <header class="top"><span class="tree-mark" aria-hidden="true"></span><span class="brand">작은 방문자 마을</span><nav class="top-links" aria-label="프로젝트 안내"><a class="preview-label" href="#intro-film">소개 영상</a><a class="preview-label" href="./install.html">블로그에 설치하기</a></nav></header>
  <div class="intro"><div><h1>오늘도, 여기 모였어요.</h1><p>큰 나무 아래에서 만나는 작은 방문자들.</p></div><div class="count"><span>오늘의 방문자 · 시연</span><strong id="visitor-count">24<small>명</small></strong></div></div>
  <div class="stage"><visitor-village count="24" season="christmas"></visitor-village></div>
  <section class="tools" aria-label="마을 꾸미기">
    <div class="field"><label for="season">나무 꾸미기</label><select id="season"><option value="christmas">크리스마스</option><option value="spring">봄 · 꽃나무</option><option value="summer">여름 · 푸른 나무</option><option value="autumn">가을 · 단풍나무</option><option value="winter">겨울 · 눈꽃나무</option></select></div>
    <div class="field"><label for="visitors">시연 방문자 수</label><div class="visitor-inputs"><input id="visitors" type="text" value="24" inputmode="numeric" autocomplete="off" spellcheck="false"><input id="visitor-range" type="range" value="24" min="0" max="200" aria-label="0명에서 200명까지 빠른 방문자 수 조절"></div></div>
    <div class="actions"><button id="glow" type="button" aria-pressed="true">빛 번짐 켜짐</button><button id="pause" type="button" aria-pressed="false">움직임 멈추기</button></div>
  </section>
  <section class="intro-film" id="intro-film" aria-labelledby="intro-film-title">
    <div class="film-heading"><div><span class="film-label">20초 소개 영상</span><h2 id="intro-film-title">방문자가 모이면, 마을이 됩니다.</h2><p id="intro-video-description">캐릭터가 걷고 계절이 바뀌는 작은 방문자 마을을 만나 보세요.</p></div><a class="film-file" href="./media/intro.mp4" target="_blank" rel="noopener">영상 파일 열기</a></div>
    <video id="intro-video" src="./media/intro.mp4" poster="./media/intro-poster.jpg" controls muted loop playsinline preload="metadata" aria-label="작은 방문자 마을 소개 영상" aria-describedby="intro-video-description">이 브라우저에서는 영상 재생을 지원하지 않습니다.</video>
    <p class="film-caption">음소거로 시작합니다. 소리는 플레이어에서 켤 수 있어요. 영상 속 방문자 수는 시연용입니다.</p>
    <p class="film-credit">Music: <a href="https://ende.app/en" target="_blank" rel="noopener">Sascha Ende</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> · 20초 편집</p>
    <p class="film-status" id="intro-video-status" role="status" hidden>소개 영상을 불러오지 못했어요. ‘영상 파일 열기’로 확인해 주세요.</p>
  </section>
  <footer><span id="theme-description">${themes.christmas.description}</span><span>시연용 숫자이며 실제 블로그 집계는 연결 전입니다.</span></footer>
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
if(location.hash==='#intro-film')document.querySelector('#intro-film')!.scrollIntoView({block:'start'});
