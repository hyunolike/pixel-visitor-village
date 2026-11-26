import './visitor-village';
import './demo.css';
import { setupIntroVideo } from './intro-video';
import { setupServiceHeader } from './service-header';
import { MAX_VISITORS, type Season } from './model';
import { themes } from './themes';
import type { VisitorVillage } from './visitor-village';
import { setupMapScene, setupMapLandmarks } from './map-scene';
import guidePortrait from './assets/map/guide.png';
import pauseIcon from './assets/map/icons/pause.svg';
import playIcon from './assets/map/icons/play.svg';
import plusIcon from './assets/map/icons/plus.svg';
import spring from './assets/cozy/tree-spring.png';
import summer from './assets/cozy/tree-summer.png';
import autumn from './assets/cozy/tree-autumn.png';
import winter from './assets/cozy/tree-winter.png';
import christmas from './assets/cozy/tree-christmas.png';

const seasons: { value: Season; label: string; image: string }[] = [
  { value: 'spring', label: '봄', image: spring },
  { value: 'summer', label: '여름', image: summer },
  { value: 'autumn', label: '가을', image: autumn },
  { value: 'winter', label: '겨울', image: winter },
  { value: 'christmas', label: '크리스마스', image: christmas },
];

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /* HTML */ ` <article class="page">
  <a class="skip-link" href="#village-controls">마을 조작으로 건너뛰기</a>
  <section class="playground" aria-labelledby="home-title">
    <header class="service-header">
      <div class="service-header-inner">
        <a class="project-brand" href="./index.html" aria-label="작은 방문자 마을 홈"
          ><img class="brand-mark" src="${summer}" alt="" width="32" height="32" /><span
            class="brand-title"
            >작은 방문자 마을</span
          ></a
        >
        <nav id="project-navigation" class="project-nav" aria-label="주 메뉴">
          <a href="#demo" aria-current="page">마을 체험</a><a href="./docs/">사용 문서</a
          ><a
            href="https://github.com/hyunolike/pixel-visitor-village"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub<span class="sr-only"> (새 탭)</span></a
          ><a
            id="home-install"
            class="button install-action"
            data-install
            href="./install.html?season=summer"
            >설치하기</a
          >
        </nav>
        <button
          id="navigation-toggle"
          class="button button-secondary button-sm"
          type="button"
          aria-controls="project-navigation"
          aria-expanded="false"
          hidden
        >
          메뉴
        </button>
      </div>
    </header>
    <section
      id="demo"
      class="stage"
      tabindex="-1"
      aria-label="직접 만나는 픽셀 마을"
      aria-busy="true"
    >
      <div class="scene-intro">
        <div>
          <h1 id="home-title">
            작은 방문이<br />
            마을이 되는 곳.
          </h1>
          <p class="hero-description">티스토리 오늘 방문자 수를 픽셀 캐릭터로 보여줘요.</p>
          <a
            id="hero-install"
            class="button button-accent hero-install"
            data-install
            href="./install.html?season=summer"
            >내 블로그에 설치하기</a
          >
        </div>
      </div>
      <div class="world-wrap">
        <visitor-village
          data-map-scene
          interactive
          repository-link="badge"
          count="12"
          season="summer"
        ></visitor-village>
        <p class="scene-loading" id="scene-loading" role="status">마을 문을 열고 있어요…</p>
        <div class="map-landmarks" aria-label="마을의 장소">
          <a id="map-install" class="map-landmark" data-install href="./install.html?season=summer"
            ><span class="map-sign">설치 작업실</span
            ><span class="house-target" aria-hidden="true"></span
          ></a>
          <a id="map-guide" class="map-landmark" href="./docs/"
            ><span class="map-sign">사용 안내</span
            ><span class="house-target" aria-hidden="true"></span
          ></a>
        </div>
      </div>
    </section>
    <div id="village-controls" class="village-dock" tabindex="-1" aria-label="마을 조작">
      <div class="guide-dialogue">
        <img id="guide-portrait" src="${guidePortrait}" alt="" width="60" height="84" />
        <div class="dialogue-copy">
          <p class="guide-intro">반가워요! 계절을 바꾸고<br />손님에게 인사해 보세요.</p>
          <p
            id="interaction-status"
            class="interaction-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          ></p>
        </div>
        <button id="greet" class="button dock-secondary" type="button" disabled>
          손님에게 인사
        </button>
      </div>
      <div class="season-buttons" role="group" aria-label="마을 계절">
        ${seasons.map(({ value, label, image }) => `<button type="button" data-home-season="${value}" aria-pressed="${value === 'summer'}"><img src="${image}" alt="" width="40" height="40"><span>${label}</span></button>`).join('')}
      </div>
      <div class="dock-visit">
        <div class="count">
          <a href="#visitor-settings" aria-label="시연 방문자 수 바꾸기">시연 방문</a
          ><strong id="visitor-count">12<small>명</small></strong>
        </div>
        <div class="dock-actions">
          <button
            id="pause"
            class="button dock-secondary"
            type="button"
            aria-pressed="false"
            disabled
          >
            <img id="pause-icon" src="${pauseIcon}" alt="" width="20" height="20" /><span
              class="pause-label sr-only"
              >움직임 멈추기</span
            ></button
          ><button id="invite" class="button invite-action" type="button" disabled>
            <img src="${plusIcon}" alt="" width="20" height="20" />손님 한 명 초대
          </button>
        </div>
        <p class="demo-truth">실제 방문 정보가 아닌 체험용 숫자예요.</p>
      </div>
    </div>
  </section>
  <div class="home-content service-paper">
    <section
      id="visitor-settings"
      class="detail-settings"
      tabindex="-1"
      aria-labelledby="details-title"
    >
      <div class="section-heading">
        <h2 id="details-title">방문자 수 바꿔보기</h2>
        <p>0명부터 5,000명까지 직접 입력할 수 있어요.</p>
      </div>
      <div class="tools">
        <div class="field">
          <label for="visitors">시연 방문자 수</label>
          <div class="visitor-inputs">
            <input
              id="visitors"
              type="text"
              value="12"
              inputmode="numeric"
              autocomplete="off"
              spellcheck="false"
              aria-describedby="count-help"
            /><input
              id="visitor-range"
              type="range"
              value="12"
              min="0"
              max="200"
              aria-label="0명에서 200명까지 빠른 방문자 수 조절"
            />
          </div>
        </div>
        <div id="season-effects" class="actions" hidden>
          <button id="glow" class="button button-secondary" type="button" aria-pressed="true">
            빛 번짐 켜짐
          </button>
        </div>
      </div>
      <p id="count-help" class="demo-note">
        체험용 숫자입니다. 블로그에 설치하면 티스토리의 오늘 누적 방문 수가 표시됩니다.
      </p>
    </section>
    <section class="intro-film" id="intro-film" aria-labelledby="intro-film-title">
      <div class="film-heading">
        <div>
          <h2 id="intro-film-title">20초 소개 영상</h2>
          <p id="intro-video-description">캐릭터의 인사, 다섯 계절과 설치 방법을 확인하세요.</p>
        </div>
        <a class="film-file" href="./media/intro.mp4" target="_blank" rel="noopener"
          >영상 파일 열기</a
        >
      </div>
      <video
        id="intro-video"
        src="./media/intro.mp4"
        poster="./media/intro-poster.jpg"
        controls
        muted
        loop
        playsinline
        preload="metadata"
        aria-label="작은 방문자 마을 소개 영상"
        aria-describedby="intro-video-description"
      >
        이 브라우저에서는 영상 재생을 지원하지 않습니다.
      </video>
      <p class="film-caption">
        음소거로 시작합니다. 소리는 플레이어에서 켤 수 있어요. 영상 속 방문자 수는 시연용입니다.
      </p>
      <p class="film-credit">
        Music: <a href="https://ende.app/en" target="_blank" rel="noopener">Sascha Ende</a> ·
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener"
          >CC BY 4.0</a
        >
        · 20초 편집
      </p>
      <p class="film-status" id="intro-video-status" role="status" hidden>
        소개 영상을 불러오지 못했어요. ‘영상 파일 열기’로 확인해 주세요.
      </p>
    </section>
    <section class="home-section" aria-labelledby="start-title">
      <div class="section-heading">
        <h2 id="start-title">티스토리에 설치하기</h2>
        <a href="./docs/#quick-start">자세한 설치 방법</a>
      </div>
      <ol class="setup-steps">
        <li>
          <h3>계절 선택</h3>
          <p>처음 보여 줄 계절을 고르고 설치 코드를 만드세요.</p>
        </li>
        <li>
          <h3>코드 붙여 넣기</h3>
          <p>생성된 코드를 티스토리 스킨 HTML에 넣으세요.</p>
        </li>
        <li>
          <h3>설치 확인</h3>
          <p>오늘 방문자 수와 모바일 화면을 확인하세요.</p>
        </li>
      </ol>
      <a class="button button-primary" data-install href="./install.html?season=summer"
        >선택한 계절로 설치하기</a
      >
    </section>
    <section class="home-section home-faq" aria-labelledby="faq-title">
      <h2 id="faq-title">설치 전에 궁금한 점</h2>
      <details>
        <summary>지금 접속한 사람 수를 보여 주나요?</summary>
        <p>
          오늘 누적 방문 수를 사용합니다. 캐릭터는 실제 방문자와 연결되지 않으며 이름이나 위치를
          나타내지 않습니다. <a href="./docs/#visitor-count">집계 방식 알아보기</a>
        </p>
      </details>
      <details>
        <summary>복사한 코드는 어디에 넣나요?</summary>
        <p>
          티스토리 관리자에서 꾸미기 → 스킨 편집 → HTML 편집을 열고 원하는 위치에 넣습니다. 먼저
          현재 스킨을 백업해 두세요. <a href="./docs/#quick-start">설치 순서 보기</a>
        </p>
      </details>
      <details>
        <summary>방문 수가 바로 바뀌지 않으면 어떻게 하나요?</summary>
        <p>
          기본은 페이지를 열 때 전달된 숫자입니다. 1분 확인은 선택 기능이며 티스토리 집계 지연과
          반복 조회의 영향은 미검증입니다. <a href="./docs/#troubleshooting">문제 해결 문서 보기</a>
        </p>
      </details>
    </section>
    <footer class="home-footer service-footer">
      <span id="theme-description">${themes.summer.description}</span>
      <nav aria-label="더 알아보기">
        <a href="./docs/">사용 문서</a><a href="./docs/#credits">제작과 출처</a
        ><a
          href="https://github.com/hyunolike/pixel-visitor-village"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub (새 탭)</a
        >
      </nav>
    </footer>
  </div>
</article>`;

const find = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const widget = find<VisitorVillage>('visitor-village');
setupMapScene(widget);
setupMapLandmarks(widget, find('#map-install'), find('#map-guide'));
const number = find<HTMLInputElement>('#visitors'),
  range = find<HTMLInputElement>('#visitor-range');
const pause = find<HTMLButtonElement>('#pause'),
  glow = find<HTMLButtonElement>('#glow');
const greet = find<HTMLButtonElement>('#greet'),
  invite = find<HTMLButtonElement>('#invite');
const status = find('#interaction-status');
let statusTimer: ReturnType<typeof setTimeout> | undefined;
function announce(message: string) {
  clearTimeout(statusTimer);
  status.textContent = message;
  statusTimer = setTimeout(() => {
    status.textContent = '';
  }, 4500);
}
function selectSeason(value: string) {
  widget.setAttribute('season', value);
  announce(`${seasons.find((item) => item.value === widget.season)!.label} 마을로 바뀌었어요.`);
}
document
  .querySelectorAll<HTMLButtonElement>('[data-home-season]')
  .forEach((button) =>
    button.addEventListener('click', () => selectSeason(button.dataset.homeSeason!)),
  );
number.addEventListener('input', () => widget.setAttribute('count', number.value));
range.addEventListener('input', () => {
  number.value = range.value;
  widget.setAttribute('count', range.value);
});
pause.addEventListener('click', () => widget.toggleAttribute('paused'));
glow.addEventListener('click', () =>
  widget.setAttribute('glow', widget.getAttribute('glow') === 'false' ? 'true' : 'false'),
);
greet.addEventListener('click', () => widget.greetVisitor());
invite.addEventListener('click', () => widget.inviteVisitor());
widget.addEventListener('village-greet', () => announce('반가워요! 손님이 인사를 건넸어요.'));
widget.addEventListener('village-invite', () => {
  number.value = String(widget.visitorCount);
  announce('새 손님이 도착했어요.');
});
widget.addEventListener('village-error', (event) => {
  if ((event as CustomEvent<{ attribute: string }>).detail.attribute === 'renderer') {
    find('#scene-loading').textContent =
      '마을을 열지 못했어요. 새로고침하거나 사용 문서를 확인해 주세요.';
    find('#scene-loading').hidden = false;
    find('#demo').setAttribute('aria-busy', 'false');
  }
});
const sync = () => {
  find('.playground').dataset.season = widget.season;
  find('.playground').dataset.worldReady = String(widget.ready);
  find('#visitor-count').replaceChildren(
    String(widget.visitorCount),
    Object.assign(document.createElement('small'), { textContent: '명' }),
  );
  range.value = String(Math.min(200, widget.visitorCount));
  find('#theme-description').textContent = themes[widget.season].description;
  document
    .querySelectorAll<HTMLElement>('[data-home-season]')
    .forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.homeSeason === widget.season)),
    );
  document.querySelectorAll<HTMLAnchorElement>('[data-install]').forEach((link) => {
    link.href = `./install.html?season=${widget.season}`;
  });
  const reduced = widget.motionReduced,
    paused = widget.hasAttribute('paused');
  pause.disabled = !widget.ready || reduced;
  const pauseLabel = reduced ? '모션 줄이기 적용' : paused ? '움직임 재생' : '움직임 멈추기';
  pause.querySelector('.pause-label')!.textContent = pauseLabel;
  pause.title = pauseLabel;
  find<HTMLImageElement>('#pause-icon').src = reduced || paused ? playIcon : pauseIcon;
  pause.setAttribute('aria-pressed', String(reduced || paused));
  greet.disabled = !widget.ready || widget.visitorCount === 0;
  invite.disabled = !widget.ready || widget.visitorCount >= MAX_VISITORS;
  find('#season-effects').hidden = widget.season !== 'christmas';
  const glows = widget.getAttribute('glow') !== 'false';
  glow.disabled = widget.season !== 'christmas';
  glow.textContent = glows ? '빛 번짐 켜짐' : '빛 번짐 꺼짐';
  glow.setAttribute('aria-pressed', String(glows));
  if (widget.ready) {
    find('#scene-loading').hidden = true;
    find('#demo').setAttribute('aria-busy', 'false');
  }
};
widget.addEventListener('village-change', sync);
widget.addEventListener('village-ready', sync);
sync();
setupServiceHeader();
setupIntroVideo(find<HTMLVideoElement>('#intro-video'), find('#intro-video-status'));
if (location.hash === '#intro-film' || location.hash === '#demo')
  document.querySelector(location.hash)?.scrollIntoView({ block: 'start' });
