# README 이미지와 화면 캡처

## 2026-11-26 서비스 정리와 픽셀 마감

[변경 전후](refinement/before-after.png)는 같은390×844px, DPR1의 실제 Chrome 화면이다. [홈](refinement/home-desktop.png), [설치](refinement/install-desktop.png), [모바일 설치](refinement/install-mobile.png), [사용 문서](refinement/docs-mobile.png)는 현재 로컬 production 빌드다. 방문 수는 시연 입력이며 실제 방문자 기록이 아니다.

사용자가 허용한 Pillow 방식으로 기존180px 나무5종과 조형물의 색상과 투명도를 정리했다. 공간 리샘플링 없이 기존 실루엣을 유지했고 색상 수는 나무16~27개, 조형물11개다. [원본과 마감본](refinement/art-seasons.png), [실제 다섯 계절](refinement/scene-seasons.png), [측정과 해시](../../assets/concepts/cozy/refinement-20261126/exports.json)를 보존한다. 계절 비교 이미지는 위젯 영역의 미술 검토용 크롭이며 페이지 전체 레이아웃 비교는 홈 화면을 사용한다.

소개 영상은 보존된 brag 편집 소스를 Codex에서 갱신한 버전이다. 실제 현재 설치 화면과 픽셀 에셋, 자체 제공 글꼴을 사용한다. 새 Claude Code 실행으로 설명하지 않는다. [장면표](refinement/video-contact.png), [재현 소스](../../assets/concepts/refinement-20261126/README.md), [현재 영상 출처](../features/visitor-village/intro-media.md)를 따른다. 아래 미디어 설명은 이전 제작 이력이다. README 상단 소개 썸네일과 네 언어 체험 이미지 버튼은 이번에 변경하지 않았다.

## 서비스 글꼴

제목과 브랜드는 Neo둥근모 v1.600, 본문과 조작 UI는 Pretendard Variable v1.3.9를 자체 제공한다. 원본 WOFF2를 수정하지 않았으며 [출처와 OFL 전문](../../public/fonts/README.md)을 함께 보존한다. [PC 화면](typography/home-1440-viewport.png), [모바일 화면](typography/home-375-viewport.png), [한국어 설치](typography/install-ko-375.png), [일본어 설치](typography/install-ja-320.png), [중국어 설치](typography/install-zh-CN-320.png)는 실제 빌드의 Chrome 캡처다. [검증 데이터](typography/result.json)에 실제 사용 글꼴과 네 언어/폭 결과가 있다. 기존 README 상단 썸네일과 소개 영상은 변경하지 않는다.

## Claude Code brag 재제작과 간결한 README

상단 소개 썸네일과 네 언어 체험 이미지 버튼은 유지한다. 소개 MP4/포스터/GIF는 Claude Code의 실제 brag 실행으로 새로 제작했다. [새 장면표](brag-remake/video-contact-sheet.png),[제작 원본](../../assets/concepts/brag-remake/README.md),[영상 출처](../features/visitor-village/intro-media.md)를 본다. 현재 파일 정보는 brag-remake-evidence.json이 기준이며 아래 이전 미디어 갱신 기록과 구분한다. README4개는 각각44줄로 정리했고 상세내용은 docs/reference/widget.*.md로 보존했다.

## 작은 조형물과 이미지 버튼 최종 갱신

후속 사용자 요청으로 README 상단 썸네일은 [기존 소개 일러스트](readme-tistory-village.png)를 그대로 유지한다. 네 README가 같은 원본을 사용하며 파일은 수정하지 않았다. [네 언어 이미지 버튼](entry/)과 갱신한 영상은 유지한다. 썸네일 축소 편집안은 최종 산출물에서 제외했다.

버튼은 현재 여름 나무PNG와 편집 가능한 캐릭터RGBA 원본을 사용한 자체 SVG다. 외부 글꼴/URL/스크립트 없이 이미지와 각 언어 레이블을 포함하며 클릭은 README의 표준 링크가 처리한다. 생성 코드는 [create-entry-buttons.mjs](../../scripts/media/create-entry-buttons.mjs),공개용 사본은 public/media/visit-village-*.svg다. README4개 모두 홈의/#demo로 이동한다.

소개 MP4/GIF/포스터와 구조도도 작은 조형물이 있는 최신 실제 PixiJS 화면으로 다시 만들었다. 현재 파일 정보와 촬영 모듈 해시는 [최종 미디어 기록](../features/visitor-village/reviews/entry-media-evidence.json)에 있다. 아래 축소 이전 영상 설명은 이력이며 현재 갱신본은 [소개 영상 문서](../features/visitor-village/intro-media.md)를 따른다.

## 티스토리와 픽셀 캐릭터 소개 썸네일

2026-11-25 사용자 요청으로 [readme-tistory-village.png](readme-tistory-village.png)를 제작했다. 기본 한국어 README와 영어/일본어/중국어 문서 상단에서 같은 이미지를 사용한다. README용 프로젝트 소개 일러스트이며 제품 화면이나 실제 티스토리 블로그의 캡처가 아니다.

- 파일: 1734×907px PNG, 1,489,880bytes.
- 제작: 내장 image_gen 도구의 이미지 합성/생성 모드. 최종 [프롬프트](readme-thumbnail-prompt.txt)를 보관했다.
- 캐릭터 참고: 이 프로젝트의 [캐릭터 시트](characters-v2.png)와 [실제 마을](social-desktop.png). 외부 게임 캐릭터는 사용하지 않았다.
- 로고 참고: [티스토리 공식 사이트](https://www.tistory.com/)가 제공하는 [앱 아이콘](https://t1.daumcdn.net/tistory_admin/top_v2/tistory-apple-touch-favicon.png). 오렌지 원 안의 다섯 점 T 형태를 참고했다. [공식 BI 안내](https://notice.tistory.com/2637)도 확인했다.
- 티스토리 표장은 해당 서비스의 브랜드이며 프로젝트 자체 제작 로고나 공식 제휴 표시로 설명하지 않는다. 공식 원본 파일은 저장소에 별도로 복사하지 않았다.
- 생성 결과의 한글 제목, 다섯 점 로고, 기존 캐릭터 색/의상과 이미지 가장자리 잘림 여부를 직접 확인했다. 원본 생성 파일을 수정 없이 저장소로 복사했다.

## 첨부 콘셉트로 개편한 현재 마을 (2026-11-25)

후속 요청으로 티스토리 조형물을 작은 우물 크기로 줄인 화면을 다시 촬영했다. `cozy-village/scene-summer-large-monument.png`는 축소 전 이력이다. 이 단계의 소개 영상은 비율 축소 전이었으며 현재는 위 최종 갱신본으로 교체했다.

현재 README 계절 갤러리는 [cozy-village/](cozy-village/)의 실제 로컬 production 화면을 사용한다. 크리스마스/봄/여름/가을/겨울은 각각935×476px이고 데스크톱은1487×1058px,모바일은320/375×780px 뷰포트다. Google Chrome headless/DPR1에서 준비 완료 후 움직임을 멈추고 시연24명 상태로 테마를 바꿨다. 이미지로 위젯을 대체하지 않았다.

[전체 비교](cozy-village/comparison.png)는 사용자 포스터와 실제 여름 위젯을 같은1179px 표시 폭으로 놓았다. [상세 비교](cozy-village/focus-landmarks.png)는 두 원본을 리샘플링하지 않은430×390px 크롭이다. 서로 다른 포스터/동적 카메라이므로 픽셀 단위 복제나 동일 인원 배치 비교가 아니다.

[정면](cozy-village/characters-front.png), [옆면](cozy-village/characters-side.png), [뒷면](cozy-village/characters-back.png)은 현재 RGBA 원본192프레임 전체를4배 표시한 시트다. [소품](cozy-village/props.png)은7종×5계절을2배 표시했고 [게스트와 말풍선](cozy-village/guests-bubbles.png)도 현재 원본에서 캡처했다. 출처/프롬프트는 [원화 기록](../../assets/concepts/cozy/README.md),검토는 [개편 검증](../features/visitor-village/reviews/cozy-village-2026-11-25.md)에 있다. pageerror는0건이며 실제 티스토리 스킨이나 실기기 캡처는 아니다.

## 이전 계절 갤러리 촬영 이력

아래 계절별 PNG는 2026-11-20 KST에 환경 에셋을 개선한 로컬 개발 서버(`http://127.0.0.1:5196/`)에서 다시 촬영한 실제 위젯 화면입니다. 별도로 그린 목업이 아닙니다. 이 환경 버전은 2026-11-23 KST에 Cloudflare Pages 공개 배포로 반영했습니다. 캡처는 아래 촬영 당시의 로컬 화면을 유지합니다.

| 파일 | 테마 | 이미지 크기 |
| --- | --- | --- |
| `village-christmas.png` | 크리스마스 | 1082 × 541 |
| `village-spring.png` | 봄 | 634 × 401 |
| `village-summer.png` | 여름 | 634 × 401 |
| `village-autumn.png` | 가을 | 634 × 401 |
| `village-winter.png` | 겨울 | 634 × 401 |

## 촬영 조건

- Google Chrome headless, 기기 배율 1에서 `<visitor-village>` 영역을 PNG로 캡처했습니다.
- 크리스마스는 1200 × 1100, 나머지 계절은 720 × 1000 브라우저 뷰포트를 사용했습니다.
- 방문자는 시연용 24명이며, 최초 렌더링과 이동 후 ‘움직임 멈추기’를 눌러 같은 캐릭터 상태에서 테마만 바꿨습니다.
- 각 화면에서 렌더러 준비 상태, 테마와 방문자 24명을 확인했습니다. 테마 전환과 화면 크기 변경 전후에 방문자 ID와 위치가 보존됐습니다. 페이지 스크립트 오류는 없었습니다.
- 390px 뷰포트에서도 봄 마을을 확인했고 문서 너비는 390px로 가로 넘침이 없었습니다.
- 실제 티스토리 스킨을 촬영한 화면은 아닙니다. 환경 변경 시 같은 조건으로 다시 촬영합니다.

나무 원본의 출처와 생성 기록은 [에셋 문서](../../assets/concepts/README.md)에 있습니다. 동작 구조는 아래 SVG/PNG로 직접 구성하고 Mermaid를 접힌 텍스트 대안으로 유지합니다.

## 로고가 들어간 동작 구조

[한국어 PNG](architecture/architecture-ko.png)와 [영어 PNG](architecture/architecture-en.png)는 1800×1140px입니다. 각 [한국어 SVG](architecture/architecture-ko.svg)와 [영어 SVG](architecture/architecture-en.svg)는 로고와 화면을 내부에 포함한 편집 가능한 벡터 원본입니다. [직접 배치한 생성 코드](../../scripts/media/draw-architecture.mjs)가 상자, 화살표, 문구와 프로젝트 나무 표장을 그립니다. 출력 화면은 현재 PixiJS 위젯을 로컬에서 캡처한 시연24명입니다.

브랜드 원본은 `architecture/logos/`에 보존했습니다. 로고는 각각 해당 브랜드의 표장이며 프로젝트가 제작한 로고나 공식 제휴 표시가 아닙니다.

| 표장 | 공식 출처와 사용한 파일 |
| --- | --- |
| 티스토리 | [공식 사이트](https://www.tistory.com/)의 [앱 아이콘](https://t1.daumcdn.net/tistory_admin/top_v2/tistory-apple-touch-favicon.png), [BI 안내](https://notice.tistory.com/2637) |
| TypeScript | [공식 Branding](https://www.typescriptlang.org/branding/)의 [디자인 팩](https://www.typescriptlang.org/branding/typescript-design-assets.zip), `ts-logo-128.png` |
| PixiJS | [공식 Branding](https://pixijs.com/branding)의 [투명 배경 로고](https://files.pixijs.download/branding/pixijs-logo-transparent-dark.svg). 해당 페이지는 자유로운 사용을 안내합니다. |
| Cloudflare | [공식 Press kit](https://www.cloudflare.com/press/press-kit/)의 Logos.zip, `CF-Logo 1.png` |

작업은 코드로 구성한 구조도이며 생성형 이미지로 글자나 화살표를 그리지 않았습니다. 픽셀 나무는 이 프로젝트의 `src/assets/cozy/tree-summer.png`, 작은 마을 표장은 실제 사이트의 나무 모양 벡터를 재사용했습니다. 이번 구조도에 복사한 공식 파일과 위 썸네일의 로고 참고는 별도 산출물입니다.

## 캐릭터 개선 개발 화면

다음 두 이미지는 2026-11-20 KST에 로컬 개발 서버(`http://127.0.0.1:5182/`)에서 촬영했습니다. 환경 개선 전 캐릭터 개발 당시의 기록입니다. 캐릭터 8종은 이후 운영 사이트에 반영됐으며, 이 두 이미지는 당시 촬영본을 유지합니다.

- [캐릭터 8종과 방향/걷기 확대 시트](characters-v2.png): 1120 × 510px.
- [개선 캐릭터가 표시된 크리스마스 마을](village-characters-v2.png): 1082 × 541px.

확대 시트는 `src/characters.ts`의 실제 RGBA 프레임을 Canvas에 그린 검토용 화면입니다. 마을 화면은 데모의 `<visitor-village>` 영역이며 방문자 24명은 시연용입니다. Google Chrome headless와 기기 배율 1을 사용했고, 이동 후 정지한 상태를 촬영했습니다. 별도 그림 목업이나 외부 스프라이트를 사용하지 않았습니다.

## 환경 에셋 확대 시트

[environment-v2.png](environment-v2.png)는 1120 × 740px이며, 같은 로컬 서버에서 실제 `src/art.ts`와 `src/environment.ts`의 Canvas 결과를 배치해 촬영했습니다. 봄/여름/가을/겨울 나무 4종과 크리스마스 테마의 집 3종, 가로등, 벤치와 표지판을 보여 줍니다. 외부 게임 이미지나 그림 목업은 사용하지 않았습니다.

## 소개 영상 미디어 — 축소 이전 갱신 이력

2026-11-25의 현재 파일은 새 원화와 조형물이 있는 실제 production PixiJS 위젯 및 설치 작업실을 캡처한 갱신본이다. 예전 Canvas2D 재현 영상은 제작 이력으로 구분한다.

- `intro-preview.gif`: 처음7초,720×406px,12fps,84프레임. 소리는 포함되지 않는다.
- [`intro-poster.jpg`](../../public/media/intro-poster.jpg): 새 영상2.5초 프레임,1920×1080px.
- [`intro.mp4`](../../public/media/intro.mp4): 1920×1080px,30fps,600프레임,20.000초 H.264/AAC,3,817,264bytes.

[제작 과정과 음원 출처](../features/visitor-village/intro-media.md)에 촬영 시점의 모듈 해시와 독립 제작 기록이 있다. 마지막 모바일 좌표/진단 수정까지 포함한 최종 빌드(25226667…)로 다시 촬영했다. 공개 반영은 별도 배포 단계다.


## 산타와 루돌프 픽셀 그림

2026-11-24 추가한 산타와 루돌프는 [holiday-art.ts](../../src/holiday-art.ts)의 자체 RGBA 픽셀 코드로 그립니다. 원본은 32×36px이며 각각 두 자세를 제공합니다. 외부 이미지, 폰트, 게임 에셋과 다운로드 자료를 포함하지 않습니다. 렌더러 초기화 시 공유 아틀라스로 한 번 만들고 등장마다 다시 생성하지 않습니다. 이들은 실제 방문자 수와 별개인 크리스마스 장식입니다.

## 자동 인사와 말풍선

2026-11-25 손 인사는 [characters.ts](../../src/characters.ts)의 기존 캐릭터에 추가한 자체 두 자세입니다. [social-art.ts](../../src/social-art.ts)의 18×14px 말풍선 세 종류(점 세 개, 하트, 반짝임)도 자체 RGBA 코드이며 외부 에셋이나 폰트를 사용하지 않습니다. 실제 방문자 간 메시지나 신원을 나타내지 않습니다. [데스크톱](social-desktop.png)과 [320px 화면](social-mobile.png)은 로컬 배포 번들의 실제 Pixi 장면을 Chrome으로 캡처한 검증 화면이며 시연 숫자는 80입니다.

## 설치 화면 디자인 시스템 개선

[데스크톱](install-desktop.png)은 1440px 너비의 전체 페이지, [모바일](install-mobile.png)은 375×667px의 첫 화면이다. 2026-11-25 로컬 production 빌드의 `/install.html?lang=ko`를 Chrome으로 촬영했다. 공통 브랜드/각진 컨트롤, 한국어 어절과 모바일 하단 생성 버튼을 확인할 수 있다. 미리보기 방문자 24명은 시연용이며 실제 티스토리 설치 화면을 촬영한 것이 아니다. [검토와 검증 기록](../features/visitor-village/reviews/design-system-polish-2026-11-25.md)을 함께 참고한다.

## 홈과 사용 문서 화면

2026-11-25 로컬 production 빌드의 [홈 데스크톱](home-desktop.png), [홈 320px](home-mobile.png), [문서 데스크톱](docs-desktop.png), [문서 320px](docs-mobile.png)을 Chrome으로 캡처했다. 데스크톱은 1440×1000, 모바일은 320×850 viewport의 첫 화면이며 공개 사이트나 실제 블로그 설치 화면으로 설명하지 않는다. 홈의 24명은 시연 값이다. 원본의 캐릭터/나무를 사용하는 실제 Pixi 화면과 정적 문서 레이아웃이다.

## 마을 작업실 시안과 구현 비교

`install-atelier-reference.png`는 사용자가 선택한 생성 시안이며 실제 제품 캡처와 구분한다. `install-atelier-desktop.png`(1487×1058)와 `install-atelier-mobile.png`(375×667)는 2026-11-25 로컬 production 빌드의 Chrome/DPR1 실제 화면이다. `install-atelier-comparison.png`와 `install-atelier-focus-settings.png`는 원본과 구현을 브라우저에 같은 크기로 나란히 배치한 비교 자료다. 미리보기24명은 시연 값이며 제품은 기존 실제 렌더러와 source 로고를 재사용한다. `install-rebuild-audit/`는 개편 전 공개 설치 화면의 조사 캡처다. [조사 출처](../features/visitor-village/reviews/install-rebuild-research-2026-11-25.md)와 [최종 시각 QA](../../design-qa.md)를 함께 본다.


## 선택한 인터랙티브 마을 지도1안

2026-11-26 선택 시안 원본은 `assets/concepts/map-20261126/design-reference.png`다. 실제 실행 캡처와 구분한다. 원본과 동일한1487×1058 CSS/DPR1에서 여름12명과 설치 집 hover 상태를 촬영했다. `playable-map/comparison-final.jpg`는 로컬 production, `comparison-public.jpg`는 공개 preview와 원본을 같은 입력에 나란히 배치한 비교다. `focus-{type,landmarks,hud}.png`는 글꼴과 건물/조작창을 원본 크기로 자른 비교다. `comparison-initial.png`는 수정 전 이력이다.

`public-home-{source-state,paused,short}.png`는 https://playable-map.pixel-visitor-village.pages.dev/ 의 실제 Chrome 캡처다. `home-390.png`, `home-320.png`, `home-701.png`, `install-1487.png`, `docs-1487.png`, `install-390.png`, `docs-390.png`도 같은 공개 빌드에서 촬영했다. `seasons-{desktop,mobile}.jpg`는 실제5계절을 한 장으로 배치한 검토용 축소 시트다. 캔버스는 원래 캐릭터/집/나무/작은 티스토리 조형물을 렌더링하며 숫자는 시연용이다.

`public-viewports.json`은3페이지×6너비의 오류/넘침/헤더 높이 결과, `public-smoke.json`은 실제 클릭/복사/키보드/정적 문서와 production 보존 결과다. [검토 기록](../features/visitor-village/reviews/playable-map-2026-11-26.md) 및 [시각 QA](../../design-qa.md)와 함께 본다. 이번 작업은 README 원본 썸네일과 소개 영상 파일을 변경하지 않았다.
