# 최신 코드 소개 영상과 직접 그린 구조도

2026-11-25. [계획](../intro-refresh-plan.md), VV-MEDIA-001~003의 로컬 구현과 검증 기록이다. 작업 공간에서 진행한 원화 개편과 마지막 모바일 좌표/진단 수정까지 포함한다. 이번 요청으로 제품 실행 코드를 변경하거나 커밋/푸시/공개 배포하지 않았다.

## 결과와 출처

- 실제 배포 번들의 PixiJS Web Component를 고정 시연 입력0~24명과30fps ticker로 캡처했다. 구형 Canvas2D 재현기를 사용하지 않는다. 캡처 시작/종료 모듈 해시 일치를 확인하고 원본 번들을 ignored 작업 폴더에 보관했다.
- 실제 설치 작업실에서 주소 입력/가을 선택/코드 생성을 수행했다. Pages origin의 요청을 로컬 빌드로 응답해 생성 코드가 공개 모듈 URL을 사용한다. 생성 코드의 치환자와 URL을 검사했다. 실제 티스토리 계정 설치는 검증하지 않았다.
- 최종 촬영 모듈과 검증 빌드 SHA-256은 모두 `25226667af0c764d7390bd245c91666abf98a827d446600ddca10d1090c49184`다. 캡처 기록에서 실제 인사 짝/말풍선과 산타,계절별 상태를 확인했다. 방문자 개인정보는 사용하지 않았다.
- [한국어 구조도](../../../assets/architecture/architecture-ko.png)와 [영어 구조도](../../../assets/architecture/architecture-en.png)를 SVG로 직접 배치하고 PNG로 렌더했다. 티스토리/TypeScript/PixiJS/Cloudflare 공식 로고와 프로젝트 표장,현재 위젯 캡처를 사용했다. [출처](../../../assets/README.md#로고가-들어간-동작-구조)를 보존했다. 네 README가 PNG와 SVG,접힌 Mermaid 대안을 제공한다.
- 실제 캡처와 [편집/생성 코드](../../../../scripts/media/)를 남겼다. HyperFrames 프로젝트/음원/글꼴/캡처 중간 파일은 `brag-output/intro-refresh/`에 보존한다. 최초 Sascha Ende CC BY4.0 음악과 Kenney CC0 효과음의 크레딧을 유지했다.

## 독립 검토

새 문맥의 `/root/media_plan_review`는 계획 한 파일에서 Blocker/Major 없이 Ready로 판정했다. `/root/media_final_review`는 한글/영문 구조도와10장 장면표,캡처 코드/기록을 읽고 P0/P1 없음으로 판정했다. 큰 조형물 반영 후7장 장면표와 구조도를 다시 본 차이 검토도 noImportant였다. 이 기록은 전체 제품 코드에 대한 별도의 다단계 EGM 검토 완료를 뜻하지 않는다.

## 실제 검증

- `pnpm test`:144/144. `pnpm typecheck`와 `pnpm build`:통과. 실제 최종 모듈 해시와 촬영 해시가 같다.
- 최종 미디어를 포함한 `pnpm test:e2e`:76/76(40.4초). 자동 음소거/인라인 재생,모션 줄이기/수동 재생,화면 밖 정지와 실패 메시지를 포함한다. 직전 갱신본의 focused 영상 검사도4/4였다.
- HyperFrames0.9.72 `check`:lint/runtime/layout/contrast/craft/audio 오류0,경고0. 실제 영상의 문구와 배치가 확인된 뒤 로컬 footage만 최신 빌드로 교체했다. 최종 MP4의 장면을 디코딩해 다섯 계절/팻말/손님/설치 화면/Pages URL을 직접 확인했다.
- 로컬 편집 미리보기 `http://localhost:5210/#project/intro-refresh`의 HTTP200을 확인한 뒤 delivery 렌더했다. 추가 편집은 이 미리보기나 [HyperFrames desktop app](https://hyperframes.studio/studio/download?src=cli)에서 할 수 있다.
- ffprobe:20.000초,1920×1080,H.264,30fps,600프레임,AAC/48kHz/stereo. MP4 3,817,264bytes. 포스터는2.5초의1920×1080 JPEG184,327bytes. GIF는7초/720×406/12fps/84프레임,1,592,209bytes.
- 로컬 음성 신호 측정:통합-21.9LUFS,true peak-10dBTP,클리핑0,감지된 무음 구간없음. 청취 검수로 기록하지 않는다.
- README 상대 링크/이미지와 앵커를 검사하고 HTML 설치/개발/API 코드 블록 보존을 확인했다. 구조 설명과 소스 폴더 안내는 현재 코드에 맞춰 갱신했다. `git diff --check` 통과.

MP4 SHA-256: `b7b02ae192a63cb8b78a8dcec8a405ffc0ff838917ad77e39f3d2da1968124c4`. [기계 판독 검증 자료](intro-refresh-evidence.json)에 실제 촬영 상태,각 산출물의 크기/해시,검사 요약이 있다. 최종 빌드의 영상 바이트와 `public/media/intro.mp4`가 같음을 확인했다. 공개 사이트는 별도 배포 전 버전이며 이번 갱신본의 공개 반영을 주장하지 않는다.
