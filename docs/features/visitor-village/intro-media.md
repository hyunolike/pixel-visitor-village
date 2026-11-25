# 소개 영상 제작과 출처

2026-11-20 요청: “claude code로 brag 스킬 사용해 썸네일, 소개 영상 바로 재생되게 추가해줘”.


## 현재 버전: Claude Code brag 재제작

사용자의 명시적 요청으로 Claude Code에서 `brag:brag --tone polished --duration 20 --format landscape`를 실제 실행했다. 모델 Claude Opus5.5는 공식 스킬의 분기 규칙에 따라 brag-slim으로 진행했다. 이번 영상은 HyperFrames 재촬영본이 아니라 Vite/Playwright/Chrome/FFmpeg로 새로 구성한20초 영상이다.

방문 수0→24,캐릭터 인사 근접 장면,루돌프,계절 전환,실제 설치 작업실과 마무리의6장면이다. source Web Component를 직접 실행하고 실제 마을/캐릭터/효과를 캡처했다. 시연 숫자와 카메오 등장 시점은 연출이며 실제 방문자의 기록이 아니다. 긴 하단 설명은 훅의 시연 배지와 끝의 짧은 문구로 줄였다. 기존 상단 README썸네일은 유지한다.

- 최종MP4:1920×1080,30fps,600프레임,20.000초,H.264/AAC,5,202,133bytes.
- SHA-256:`a81f6f53e9071bee6c77d70d95c5c04dbe5d280d5549ca2f9364411b2e3f02d7`.
- 포스터:정착된마무리f585를선택했고영상frame0을교체해구웠다. 프레임을추가하지않았다.
- GIF:7초,720×406,12fps. frame0 포스터를지나0.0667초부터추출했다.
- 음원:Sascha Ende,Happy Beats(Business Moves Vol.10),ende.app,CC BY4.0.20초편집/음량0.75/끝1.2초페이드와CC0효과음혼합. 기존음원크레딧은유지한다. 내레이션과유료생성은없다.
- 원본:[기획과편집소스](../../../assets/concepts/brag-remake/README.md),[검증근거](reviews/brag-remake-evidence.json). 원시Claude로그는인증/사용자환경정보가들어갈수있어ignored작업폴더에보관하고공개문서에는모델/스킬/버전/산출물만기록한다.

## 이전 갱신: 작은 티스토리 조형물

사용자의 전체 갱신 요청으로 작은 조형물이 있는 최신 PixiJS 위젯과 실제 설치 작업실을 다시 촬영했다. 기존20초 편집과음악/효과음/출처를 유지하며 아래 이전 갱신본을 대체한다. 촬영 모듈SHA-256은 `f3a5147f707bb400f27cbd1671a0694af323485919ca333cd32fd1c6a83ea164`다.

MP4는1920×1080,30fps,600프레임,20.000초,H.264/AAC,3,948,560bytes이며SHA-256은 `347f390992648799bb8e9ac778e03cf7b1c969f62d5ad41d77f83d2e1fcafa5f`다. 포스터는2.5초 프레임187,736bytes,GIF는7초/720×406/12fps/84프레임,1,575,924bytes다. 제작/검증 자료는 [최종 미디어 근거](reviews/entry-media-evidence.json)에 있다. 정적인 README 소개 일러스트는 별도 제작물이다.

## 이전 갱신 이력 (2026-11-25, 조형물 축소 전)

현재 배포 파일은 아래 최초 영상의 갱신본이다. **현재 production PixiJS Web Component 화면을 캡처한 영상**이며 예전 Canvas2D 재현기를 사용하지 않는다. 최신 원화와 티스토리 조형물, 인사/말풍선, 산타와 다섯 계절, 실제 마을 작업실의 코드 생성을 담았다. 공개 사이트 반영은 별도 배포가 필요하다.

- 편집: HyperFrames0.9.72, 로컬 편집 원본 `brag-output/intro-refresh/`. 새 brag 실행이나 내레이션/유료 미디어 생성은 하지 않았다.
- 기준: HEAD `2a237d4` 이후 작업 공간의 원화/렌더러 수정까지 포함한 production 빌드. 실제 캡처 모듈 SHA-256: `25226667af0c764d7390bd245c91666abf98a827d446600ddca10d1090c49184`. 영상 촬영 당시 검증 빌드의 해시다. 이후 모바일 스프라이트 경계와 오류 진단 수정으로 현재 위젯 해시는 달라졌으며 영상은 같은 새 원화를 사용한다.
- 촬영: 시연 입력0~24명, 고정 난수0.25, ticker30fps와 실제 모델/렌더러를 프레임 진행. 개인의 방문 시각/지역/신원은 수집하지 않았다. 설치 화면은 로컬 빌드 바이트를 Pages origin에서 응답해 실제 생성 코드의 모듈 URL을 공개 주소와 맞췄다. 티스토리 계정 설치 검증은 아니다.
- 음악: 아래 Sascha Ende 원본을45%로 혼합하고 끝1초를 페이드했다. 계절 전환의 Kenney rollover와 코드 생성의 click(CC0)을 동작 시점에 배치했다. NanumSquareRound R/B를 로컬 파일로 렌더했다. 글꼴은 완성 영상의 픽셀에만 들어간다.
- 규격: 1920×1080,30fps,600프레임,20.000초,H.264/AAC,3,817,264bytes. 포스터는2.5초 프레임184,327bytes. GIF는7초,720×406px,12fps,84프레임,1,592,209bytes.
- SHA-256(MP4): `b7b02ae192a63cb8b78a8dcec8a405ffc0ff838917ad77e39f3d2da1968124c4`.

| 구간 | 현재 장면 |
| --- | --- |
| 0~4초 | 시연 count0→24와 나무 팻말 |
| 4~8초 | 실제 손 인사/말풍선과 산타 장식 |
| 8~14초 | 봄/여름/가을/겨울 각1.5초 |
| 14~18초 | 실제 작업실에서 주소 입력/계절 선택/코드 생성 |
| 18~20초 | 프로젝트 표장과 Pages 주소 |

재생성 코드는 [캡처](../../../scripts/media/capture-intro.mjs), [편집 원본 생성](../../../scripts/media/compose-intro.mjs), [최종 파일 만들기](../../../scripts/media/finalize-intro.mjs)에 있다. `pnpm build` 후 로컬 Vite preview를5208포트에 실행하고 캡처→편집 원본 생성→HyperFrames check/snapshot/preview→render→최종 파일 생성 순서로 진행한다. `MEDIA_ORIGIN`으로 서버 주소를 바꿀 수 있다. 렌더 출력은 `brag-output/intro-refresh/work/intro-final.mp4`다. 편집 폴더에는 같은 프로젝트의 최초 음원/효과음,로컬 R/B글꼴,GSAP3.15.0 원본을 둔다. 이 의존 원본과 고해상도 작업 자료는 Git 제외 경로에 보존한다.

로고 동작 구조는 [직접 그린 SVG/PNG](../../assets/README.md#로고가-들어간-동작-구조)이며 한글과 영문을 제공한다. 상세 출처/실제 검증은 [갱신 검토 기록](reviews/intro-refresh-2026-11-25.md)을 참고한다. 아래 제작/장면/파일 정보는 **최초 버전의 이력**이다.

## 최초 제작 이력 (2026-11-20)

- Claude Code의 **Claude Opus 5.5**에서 실제 `brag:brag` 스킬을 실행했다. 스킬의 모델 분기 규칙에 따라 번들 `slim.md`(brag-slim)를 사용했고 Hyperframes와 hyperframes-cli를 함께 사용했다.
- 원본 스킬: [latent-spaces/brag](https://github.com/latent-spaces/brag), [SKILL.md](https://github.com/latent-spaces/brag/blob/main/skills/brag/SKILL.md). 전역 설정을 바꾸지 않고 세션 한정 플러그인으로 불러왔다.
- 로컬 Hyperframes 0.9.72로 1920×1080, 30fps, 600프레임, 20.000초 H.264/AAC 영상을 렌더했다. 내레이션과 유료 미디어 서비스는 사용하지 않았다.
- 원본 편집 자료와 실행한 검사 기록은 Git에서 제외한 `brag-output/`에 남겼다. 다시 편집하려면 그 폴더의 `brag-plan.md`, `composition-brief.md`, `composition/index.html`과 `work/village-entry.ts`를 사용한다. 다른 기기에서는 NanumSquareRound를 먼저 설치해야 한다.
- 기준 제품 커밋은 `a9c5ff5`. `src/model.ts`, `art.ts`, `characters.ts`, `character-motion.ts`와 나무 PNG를 사용했다. 프레임 탐색이 가능하도록 Canvas 2D에서 모델 시간을 재현했으며 마을과 캐릭터는 실제로 움직인다. PixiJS 화면 녹화와 구분한다.

## 배포용 파일

| 파일 | 설명 |
| --- | --- |
| [`public/media/intro.mp4`](../../../public/media/intro.mp4) | 20초 소개 영상, 약 3MB |
| [`public/media/intro-poster.jpg`](../../../public/media/intro-poster.jpg) | 19.5초 엔딩의 정착 장면, 첫 프레임에도 반영 |
| [`docs/assets/intro-preview.gif`](../../assets/intro-preview.gif) | 7초, 720×406px, 12fps, 약 0.87MB의 README 미리보기 |

## 장면

1. 0~3.55초: 시연 카운터가 0명에서 24명으로 오르며 크리스마스 마을에 캐릭터가 모인다.
2. 3.55~6.55초: 나무 아래를 가까이에서 보여 준다.
3. 6.55~9.83초: 자체 제작 캐릭터 8종과 방향별 동작을 보여 준다.
4. 9.83~15.28초: 봄, 여름, 가을과 겨울로 바뀐다.
5. 15.28~17.47초: 실제 티스토리 방문자 수 치환자를 포함한 설치 코드를 보여 준다.
6. 17.47~20초: 프로젝트 이름, 공개 주소와 시연 숫자 안내를 보여 준다.

## 음악과 효과음

**Music: Sascha Ende, ende.app (CC BY 4.0).** 트랙은 `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3`(Happy Beats / Business Moves Vol. 10)다. [음악 출처](https://ende.app/en), [배포처 라이선스](https://ende.app/en/standard-license), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)를 참고한다. brag 스킬에 번들된 원본을 사용해 20초로 자르고 음량과 페이드를 조절했으며 영상과 효과음에 혼합했다. 재배포할 때도 이 출처와 라이선스, 편집 사실을 함께 표시해야 한다. 데모 플레이어 아래에도 음악 크레딧을 제공한다.

효과음은 스킬에 포함된 Kenney의 CC0 소리와 unicae_games의 CC0 키 입력음을 사용했다. 그림은 프로젝트 자체 제작 에셋이다. NanumSquareRound를 로컬 글꼴로 사용했고 글꼴 파일은 배포에 포함하지 않았다. 음악은 이 저장소에 아직 정하지 않은 코드 라이선스와 별도로 위 이용 조건을 따른다.

## 확인 범위

Claude Code가 Hyperframes `check`를 실행해 lint/runtime/layout/contrast/craft/audio 오류 0건을 확인했다. 남은 경고는 로컬 글꼴 참조 6건과 계절 장면의 타임라인 밀도 1건이었다. 제작 담당이 디코딩한 장면을 열어 별과 글자가 겹치는 문제를 수정했다. 최종 파일은 별도로 ffprobe로 해상도/길이/코덱을 확인한다.

영상 속 숫자는 시연용이며 실제 티스토리 집계나 스킨 설치의 검증 결과가 아니다. README는 GIF 미리보기, 데모는 MP4 플레이어를 사용한다. 영상에 관련된 자동 재생과 모션 줄이기 검증은 진행 상태 문서에 기록한다.
