# 디자인 시스템 진단 후 개선 계획

> 사용자는 2026-11-25 진단 결과를 확인하고 “진행해줘”로 개선을 승인했다. 기존 linked worktree에서 직접 구현하고 독립 검토를 받는다. 새 승인 질문, 커밋, 푸시와 공개 배포는 이번 범위가 아니다.

**Goal:** 공통 디자인 규칙을 시연/설치에 적용하고 모바일 조판/행동 배치와 생성 결과의 상태 피드백을 개선한다.
**Architecture:** 기존 design-system.css의 역할 토큰과 공통 컨트롤을 확장하고 demo/install은 배치만 담당한다. 위젯 기본 전체 마을 링크는 보존하고 설치 미리보기만 명시적 badge 모드로 제한한다.
**Tech Stack:** 기존 TypeScript/CSS/Vite/PixiJS/Playwright/Vitest. 의존성 추가 없음.
**Spec:** spec.md VV-DESIGN-001~006, design.md의 2026-11-25 디자인 시스템 개선.

## 공통 제약

- 기존 방문 수 팻말/크리스마스/자동 인사 작업을 보존한다. renderer/모델/픽셀 아트는 이 개선에서 변경하지 않는다.
- 시연의 어두운 테마와 설치의 밝은 테마는 유지한다. 이미 쓰이는 각진 형태를 공통 컨트롤/패널 규칙으로 쓰고 브랜드 마크/크기는 공유한다.
- 제어 크기 S=40px, M=48px, L=56px. 모바일 주요 버튼은 M. 글자 역할은 meta=12, caption=14, body=16, section=20, title=28, display=40px. 본문/오류/주의는 caption 이상이다.
- 한국어 제목/본문은 keep-all과 긴 문자열 fallback을 구분한다. URL/코드는 anywhere 또는 내부 스크롤을 허용한다. 네 언어와 320px 이상을 유지한다.
- 미리보기는 시연용 24명, 조회 기본 끄기. 설치 완료를 주장하지 않는다. 모션 줄이기와 키보드를 보존한다.

## 검토 초점

1. 생성 후 주소/계절/조회 변경을 최초 빈 상태와 구분하고 오래된 코드/관리자 링크를 다시 사용하지 않도록 한다.
2. 모바일 하단 버튼이 키보드 포커스, 결과 제목/복사 버튼, 마지막 안내와 페이지 스크롤을 가리지 않아야 한다.
3. 고급 설정을 닫아도 사용자가 켠 옵션을 초기화하지 않고, 선택 중임을 summary에서 알려야 한다. 미검증 주의는 켰을 때 읽을 수 있어야 한다.
4. 설치 미리보기의 중앙 클릭은 외부 이동을 일으키지 않고 badge의 키보드 링크만 동작한다. 외부 삽입 위젯은 기존 전체 링크 계약을 유지한다.
5. 숨긴 방문 수 팻말은 접근성 트리에서 제외하고 언어를 바꿔도 과거 한국어를 노출하지 않아야 한다. 표시 타이머/증가 계산은 유지한다.

## Task 1: 공통 토큰과 모바일 조판/배치

**Files:** src/design-system.css, src/demo.css, src/install.css, src/demo.ts, src/install.ts, src/install-i18n.ts, index.html, install.html, tests/widget.spec.ts. Task 1에서 고급 설정/번역/행동 바 상태의 기반도 구현하고 Task 2에서 dirty와 링크/알림을 검증한다.
**Interfaces:** root data-theme=dark/light가 동일한 의미 색상 토큰을 선택한다. --control-size-sm/md/lg, --font-size-meta/caption/body/section/title/display, --line-body, --weight-*, --radius-*와 공통 brand-mark/brand-title/button 규칙을 소비한다.

- [x] 375×667에서 한국어 단어가 음절 중간에 끊기지 않고 코드 생성 버튼이 viewport 안에 있는 브라우저 검사를 먼저 실패 확인.
- [x] 역할 토큰/브랜드/제어 규칙을 공통화하고 demo의 직접 색상과 컨트롤 수치를 토큰으로 이동한다. 시연의 기본 동작과 한국어는 보존한다.
- [x] 설치 폼의 필수 입력과 계절을 먼저, 고급 자동 확인은 details/summary로 분리한다. 네 언어 summary와 on 상태 문구를 제공한다. 주의사항은 caption 크기의 warning 의미 컴포넌트로 노출한다.

`#refresh-help`의 짧은 작동 설명은 details 안에 두고, 집계 지연/미검증 주의는 별도 `#refresh-warning`으로 details 밖에 둔다. 선택한 동안에는 details를 닫아도 warning이 보인다. 선택을 끄면 warning도 숨긴다. 언어 변경에도 on 표시/주의를 유지한다.
- [x] 모바일 pristine/dirty 상태의 단일 생성 버튼은 하단 action bar로 고정하고 body 하단에 같은 높이+safe-area 여백을 둔다. 키보드가 주소 입력에 있을 때는 고정하지 않는다. ready 상태는 고정을 해제해 결과/복사를 주 행동으로 둔다. focus-visible/scroll-margin으로 가림을 방지한다. preview 높이는 모바일 240px로 축소한다.
- [x] 네 언어, 키보드, 320/375/390px 넘침/포커스 및 공통 브랜드/컨트롤 규격 검증.

## Task 2: 결과 상태와 미리보기 링크/접근성

**Files:** src/install.ts, src/install-i18n.ts, src/visitor-village.ts, src/widget.css, tests/widget.spec.ts.
**Interfaces:** install 상태 pristine/ready/dirty를 구분한다. ready에서 입력이 바뀌면 dirty, dirty는 재생성 성공까지 유지한다. resultGeneration으로 기존 비동기 복사를 무효화한다. dirty 문구/재생성 버튼은 네 언어 사전의 regenerateCode/settingsChanged 키다.

- [x] 생성 후 변경과 언어 전환 시 dirty 안내/버튼 유지, 오래된 코드 복사 차단을 먼저 브라우저 실패 확인.
- [x] clearResult와 renderLocale에서 pristine/dirty/ready 표시를 분리한다. 변경 안내는 폼 근처 role=status로 알리고 코드 위치에도 재생성이 필요함을 표시한다. 입력 포커스는 유지한다.
- [x] 생성 버튼의 모바일 action bar는 ready일 때만 해제하며 결과 제목에 포커스가 옮겨간다. 주소 오류가 발생해도 dirty 의미를 잃지 않는다.
- [x] preview host에 repository-link=badge를 설정하고 host 속성 CSS로 링크 영역만 구석에 배치한다. 독립 위젯의 기본 전체 링크/터치 스크롤은 변경하지 않는다.
- [x] notice 생성 시 aria-hidden=true, 표시 시 false, 닫을 때 true로 전환한다. 언어 변경 시 표시 중이면 재번역하고 닫혀 있으면 낡은 문자열을 비운다. 렌더러/알림 타이머/방문자 수 모델은 변경하지 않는다.
- [x] 생성/변경/재생성/복사 경합, 외부 링크 hit area와 hidden notice의 aria 상태 회귀 검사 통과.

## Task 3: 통합 검증과 기록

**Files:** docs/features/visitor-village/{spec,design,tasks}.md, docs/features/visitor-village/reviews/design-system-polish-2026-11-25.md, docs/assets/install-desktop.png, docs/assets/install-mobile.png. 테스트 수정은 tests/widget.spec.ts만, 기존 테스트의 의미는 보존한다.

- [x] 전체 pnpm test/typecheck/build/test:e2e. 포트 충돌 시 임시 설정의 별도 포트에서 동일 tests 전체를 검증한다.
- [x] 실제 빌드의 데스크톱/모바일과 dirty/warning 화면 캡처 확인. 각 테마의 본문/액션/선택/경계/주의 대비 계산.
- [x] 새 문맥 코드 검토를 받고 중요 지적을 재현 후 수정/검증한다. 실제 결과와 다음 시작점을 기록하고 미커밋 상태로 전달한다.

## 실행 기록

- 문서 준비: 승인된 진단 6개와 접근성 추가 지적을 구현 범위에 연결했다. 기존 위젯의 전체 링크는 이전 명시적 계약이므로 설치 미리보기만 좁히는 방식으로 경계를 정했다.
- 사전 독립 EGM 준비 검토의 Major 두 건(작업 간 파일 의존성, 고급 설정 닫힘 시 주의 노출)과 경로 표기 Nit를 위 계약에 반영했다. 전체 EGM 완료로 기록하지 않는다.
- 기준 전체 단위는 동시 진행 중인 social 작업의 model.setViewport 미구현으로 1건 실패(126/127)했다. 이번 UI 작업은 그 모델을 수정하지 않으며 최종 통합 검사에서 다시 확인한다.

- 실행 검증: 기존 빌드에서 조판/dirty/link/hidden notice 4건의 실패를 확인한 뒤 구현했다. 첫 통합 설치 검사에서 모바일 주소 blur가 버튼을 이동시켜 click을 form에 보내는 문제를 이벤트 로그로 확인했다. 주소→버튼 포커스 이동 동안 data-editing 상태로 배치를 보존했으며 네 언어와 고급 설정 검사를 포함한 22/22가 통과했다.

- Ruling: 기존 dirty linked worktree와 사용자의 미커밋 유지 지시 때문에 커밋 범위 기반 task/review 스크립트 대신 승인 계획의 실행 기록과 변경 전 파일 사본을 검토 경계로 사용했다. 동시 작업을 섞어 커밋하거나 되돌리는 위험을 피하며 최종 검토에는 실제 수정 파일과 테스트 결과를 제공한다.
- 경계 검사: 520px에서 두 화면의 브랜드 마크가 20×24/24×28로 갈라지는 실패를 확인했다. 600px 모바일 브랜드 규칙을 공통 CSS로 이동하고 각 화면 중복 규칙을 제거했다.

- 제어 검사: demo의 선택/숫자 입력은 12px 수직 padding 때문에 버튼48px과 달리50px이었다. 실제 높이의 실패를 확인한 뒤 수직 padding을8px로 조정해 공통 M 규격을 적용했다.

- Task 1/2/3 완료: 최종 단위128/128, 전체 Chrome 브라우저63/63, 타입 검사/사이트/독립 위젯 빌드와 diff 검사 통과. 새 문맥 코드 검토 Critical/Important 없음. Minor 두 건은 상태 안내의 동일 문자열 갱신 방지와 enabled일 때만 경고 설명 연결로 수정했으며 최종 브라우저 검사에 포함했다. [실제 기록](reviews/design-system-polish-2026-11-25.md)과 데스크톱/모바일 캡처를 저장했다. 사용자의 후속 요청에 따라 기존 linked worktree를 현재 대화에 연결하고 로컬5201 미리보기를 유지했다.

## 후속 운영 반영 승인

2026-11-25 사용자는 “커밋·푸시하고 공개 사이트에 배포할까요?”라는 준비 결과의 최종 반영 확인에 “진행해줘”로 승인했다. 승인 범위는 검증한 개선안의 현재 기능 브랜치 커밋/푸시와 기존 Cloudflare Pages production Direct Upload 및 공개 검증이다. main 병합과 새 서비스/요금제/도메인 변경은 포함하지 않는다.
