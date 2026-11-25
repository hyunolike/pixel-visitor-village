# Claude Code brag 편집 원본

2026-11-25 Claude Code의 `brag:brag`를 실제 호출했다. 실행 모델 Claude Opus5.5와 스킬0.6.0의 분기 규칙에 따라 번들 brag-slim 절차로 제작했다. 공식 스킬 기준은 [latent-spaces/brag 06379432](https://github.com/latent-spaces/brag/tree/06379432a9243c951dfcc051153be18d2d261044)이다. 전역 플러그인 설정을 바꾸지 않고 세션 한정으로 로드했다.

이 폴더는 편집 원본의 보관 사본이며 단독 실행 패키지가 아니다. 완전한 로컬 작업물은 Git 제외 폴더 `brag-output/claude-brag-remake-20261125/`에 있다. 큰 프레임 시퀀스, 글꼴과 음악은 Git에 복제하지 않는다.

| 보관 파일 | 작업 폴더의 원래 위치 |
| --- | --- |
| capture.html | work/capture/index.html |
| composition.html | work/compose/index.html |
| capture.mjs / render.mjs / tempo.mjs | work/scripts/ |
| brag-plan.md | 기획, 장면, 음원 출처와 검증 |
| share-copy.txt | 공유 문구. 자동 게시하지 않았다. |

원래 폴더 구조와 `brag-plan.md`의 캡처/렌더 단계를 사용한다. 실제 Web Component를 Vite에서 실행해 고정 난수와 모델 시간으로 캡처했다. 인사·카메오의 시점은 영상 연출이며 실제 방문자 행동의 기록이 아니다. 음악은 Sascha Ende의 Happy Beats(Business Moves Vol.10),CC BY4.0이고 기존 CC0효과음을 함께 사용했다. 음량/페이드와편집 사실은 기획 문서에 있다. 내레이션/유료 서비스/추가 의존성은 없다. 기존 상단 README썸네일은 수정하지 않았다.
