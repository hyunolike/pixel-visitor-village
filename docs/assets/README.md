# README 이미지와 화면 캡처

## 티스토리와 픽셀 캐릭터 소개 썸네일

2026-11-25 사용자 요청으로 [readme-tistory-village.png](readme-tistory-village.png)를 제작했다. 기본 한국어 README와 영어/일본어/중국어 문서 상단에서 같은 이미지를 사용한다. README용 프로젝트 소개 일러스트이며 제품 화면이나 실제 티스토리 블로그의 캡처가 아니다.

- 파일: 1734×907px PNG, 1,489,880bytes.
- 제작: 내장 image_gen 도구의 이미지 합성/생성 모드. 최종 [프롬프트](readme-thumbnail-prompt.txt)를 보관했다.
- 캐릭터 참고: 이 프로젝트의 [캐릭터 시트](characters-v2.png)와 [실제 마을](social-desktop.png). 외부 게임 캐릭터는 사용하지 않았다.
- 로고 참고: [티스토리 공식 사이트](https://www.tistory.com/)가 제공하는 [앱 아이콘](https://t1.daumcdn.net/tistory_admin/top_v2/tistory-apple-touch-favicon.png). 오렌지 원 안의 다섯 점 T 형태를 참고했다. [공식 BI 안내](https://notice.tistory.com/2637)도 확인했다.
- 티스토리 표장은 해당 서비스의 브랜드이며 프로젝트 자체 제작 로고나 공식 제휴 표시로 설명하지 않는다. 공식 원본 파일은 저장소에 별도로 복사하지 않았다.
- 생성 결과의 한글 제목, 다섯 점 로고, 기존 캐릭터 색/의상과 이미지 가장자리 잘림 여부를 직접 확인했다. 원본 생성 파일을 수정 없이 저장소로 복사했다.

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

나무 원본의 출처와 생성 기록은 [에셋 문서](../../assets/concepts/README.md)에 있습니다. 루트 README의 동작 구조는 GitHub에서 렌더링되는 Mermaid 다이어그램으로 관리합니다.

## 캐릭터 개선 개발 화면

다음 두 이미지는 2026-11-20 KST에 로컬 개발 서버(`http://127.0.0.1:5182/`)에서 촬영했습니다. 환경 개선 전 캐릭터 개발 당시의 기록입니다. 캐릭터 8종은 이후 운영 사이트에 반영됐으며, 이 두 이미지는 당시 촬영본을 유지합니다.

- [캐릭터 8종과 방향/걷기 확대 시트](characters-v2.png): 1120 × 510px.
- [개선 캐릭터가 표시된 크리스마스 마을](village-characters-v2.png): 1082 × 541px.

확대 시트는 `src/characters.ts`의 실제 RGBA 프레임을 Canvas에 그린 검토용 화면입니다. 마을 화면은 데모의 `<visitor-village>` 영역이며 방문자 24명은 시연용입니다. Google Chrome headless와 기기 배율 1을 사용했고, 이동 후 정지한 상태를 촬영했습니다. 별도 그림 목업이나 외부 스프라이트를 사용하지 않았습니다.

## 환경 에셋 확대 시트

[environment-v2.png](environment-v2.png)는 1120 × 740px이며, 같은 로컬 서버에서 실제 `src/art.ts`와 `src/environment.ts`의 Canvas 결과를 배치해 촬영했습니다. 봄/여름/가을/겨울 나무 4종과 크리스마스 테마의 집 3종, 가로등, 벤치와 표지판을 보여 줍니다. 외부 게임 이미지나 그림 목업은 사용하지 않았습니다.

## 소개 영상 미디어

- `intro-preview.gif`: Claude Code의 실제 brag 산출물에서 0.07~7.07초를 추출한 720×406px, 12fps 자동 움직임 미리보기. 음성/음악은 GIF에 포함되지 않는다.
- [`../../public/media/intro-poster.jpg`](../../public/media/intro-poster.jpg): 영상 19.5초의 정착 장면. 1920×1080px.
- [`../../public/media/intro.mp4`](../../public/media/intro.mp4): 1920×1080px, 30fps, 600프레임, 20.000초 H.264/AAC 영상. 첫 프레임에 포스터를 구웠다.

영상 제작 당시 프로젝트의 model/art/characters/character-motion을 재사용해 프레임별로 재현 가능한 마을을 그렸다. 소개 영상과 GIF, 포스터는 환경 에셋 개선 전 버전으로 유지한다. 제품 위젯의 PixiJS 실시간 화면을 녹화한 것으로 설명하지 않는다. [제작 과정과 음원 출처](../features/visitor-village/intro-media.md)를 참고한다.


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
