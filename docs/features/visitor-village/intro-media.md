# 소개 영상 제작과 출처

2026-11-20 요청: “claude code로 brag 스킬 사용해 썸네일, 소개 영상 바로 재생되게 추가해줘”.

## 제작

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
