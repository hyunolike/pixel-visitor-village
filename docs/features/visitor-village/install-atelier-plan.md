# 마을 작업실 Implementation Plan

> For agentic workers: use superpowers:executing-plans for native execution in this session. 사용자는 추천 시안을 선택하고 구현을 승인했다. 기존 linked worktree에서 직접 구현하며 마지막 독립 검토를 받는다. 커밋/푸시/공개 배포는 이번 구현의 자동 단계가 아니다.

**Goal:** 선택한 첫 번째 마을 작업실 시안을 실제 4개 언어 설치 도구로 구현한다.
**Architecture:** Vite/TypeScript/Custom Element를 유지한다. 공통 색상 역할을 소나무/눈빛 계열로 정리하고 설치 배치/메뉴/출력 안내를 재구성한다. 위젯 모델/아트/독립 모듈 계약을 바꾸지 않는다.
**Tech Stack:** 기존 CSS, TypeScript, PixiJS, Vitest, Playwright. 신규 의존성 없음.
**Spec:** spec.md VV-ATELIER-001~006, design.md 마을 작업실 계약. 연구/선택 기록은 reviews/install-rebuild-research-2026-11-25.md.

## 선택한 시안과 제약

선택 결과는 실제 표시 순서1의 `exec-8b233de1-fee7-4391-bea3-3c3f23e9fc4a.png`다. 원본은 `/Users/hyuno/.codex/generated_images/01a20dd3-dda2-7ad3-9bc3-4e9e31b44af9/`에 있다. 권장 안을 “진행해줘 추천으로”라고 승인했다.

- 데스크톱은 392px 설정 + 나머지 대형 미리보기, 데스크톱72px/모바일64px 헤더, 소개/3단계 안내/작업면/접는 설치 안내로 구성한다. 모서리는 기존처럼0px다.
- 밝은 역할 색: page #f2f7f8, surface #fff, ink #18322f, muted #58706b, action #1c5d56, hover #154a44, selection #e4efeb, divider #cedcd8, input-border #7a918a. 어두운 홈은 배경을 보존하고 action을 #a4d7c9/선택 #214b42로 연결한다. 오류/경고는 기존 별도 역할을 유지한다. 실제 대비 계산으로 필요한 경우 값을 조정한다.
- body16/caption14/meta12/section24/title28/hero48/lead18, S40/M48/L56와 기존 CJK 시스템 글꼴을 재사용한다. 시안의 새 트리 로고 대신 실제 기존 브랜드 마크를 유지한다. 마을은 이미지를 배경으로 굽지 않고 실제 위젯으로 렌더링한다.
- 모바일은 헤더를64~80px 안에 두고 메뉴를 접는다. 언어 선택은 항상 접근 가능하다. 미리보기 DOM을 폼보다 먼저 두고 데스크톱에서 오른쪽에 배치한다. 작은 화면에서 마을을 본 뒤 설정하도록 읽기/시각 순서를 맞춘다. 하단 생성 버튼과 안전 여백/포커스 처리를 보존한다.
- 계절5개는 폼의 첫 설정이다. 주소는 관리자 링크 생성용임을 설명하지만 기존 필수 주소 검증과 코드 생성 조건을 유지한다. 주소/계절/자동 확인 변경 시 ready 코드를 무효화하는 계약도 유지한다.
- 코드 결과를 미리보기 바로 아래에 둔다. pristine에서는 출력 섹션을 숨기고 ready/dirty에서는 표시한다. 성공하면 결과 제목에 포커스를 옮긴다. 설치 안내는 처음에는 접힌 details이며 생성 성공 때 열어 실제 수동 설치 절차와 관리자 링크를 보여 준다. 사용자에 의한 이후 접기/열기는 언어 변경 때 보존한다.
- 단계 안내는 버튼이 아닌 ordered list다. pristine/dirty는1단계, ready는2단계, 복사 성공이면3단계 aria-current=step. 복사 fallback은2단계다. 실제 설치 완료 상태는 만들지 않는다.
- 모바일 메뉴는 단일 nav와 버튼(aria-expanded/aria-controls)이다.700px 이하에서 접고 위에서는 항상 보인다. Escape로 닫고 버튼에 포커스를 돌린다. 언어 변경은 현재 메뉴/폼 상태를 유지한다. JS 없는 경우 nav는 보이는 HTML fallback이다.
- 한국어/영어/일본어/중국어 간체를 모두 제공한다. 홈/문서 내용과 링크, 현재 새로 배포된 사용자 문서 작업을 보존한다. 시안의 개념 표시/예시 코드 수치보다 실제 높이420px/티스토리 치환자/호스트 모듈 주소 계약이 우선한다.

## Task 1: 작업실 구조와 공통 디자인 규칙

**Files:** src/design-system.css, src/install.css, install.html, src/install-i18n.ts, src/install.ts, tests/widget.spec.ts.
**Interfaces:** #navigation-toggle와 #project-navigation는 단일 메뉴를 제어한다. #locale-select는 nav 밖에 유지한다. #preview-panel은 실제 위젯과 #copy-step을 포함한다. #copy-step hidden은 pristine에서만 true다. #install-instructions는 native details다. 기존 필드/버튼/코드 ID는 유지한다.

- [x] 선택 시안의 대형 미리보기/좁은 설정, 작은 화면 헤더와 미리보기 우선, 메뉴 열기/Escape/링크 이동 브라우저 검사를 먼저 작성한다.
- [x] 기존 배포 번들에서 새 계약이 실패함을 확인한다. 다른 테스트도 실패하면 기준 실패로 분리한다.
- [x] 공통 팔레트와 설치 구조/네 언어 카피/접는 메뉴를 구현한다. 기존 source 로고/위젯/홈·문서 기능을 보존한다.
- [x] focused 검사와 타입/빌드를 통과시키고1440/375/320px 실제 화면을 확인한다.

## Task 2: 코드 인계와 상태/키보드 흐름

**Files:** src/install.ts, src/install-i18n.ts, install.html, src/install.css, tests/widget.spec.ts.
**Interfaces:** 기존 installState/resultGeneration이 정본이다. renderResultState에서 출력 영역과 단계만 추가 동기화한다. generation success는 안내 details를 한 번 연다. renderLocale는 사용자가 접은 안내를 열지 않는다. menu는 locale 전환과 별도 상태다.

- [x] 코드 출력이 미리보기와 연결되고 생성/dirty/재생성/복사/언어 전환 시 단계와 안내가 올바르게 유지되는 브라우저 검사를 먼저 실패 확인한다.
- [x] 성공/오류/복사 fallback/늦은 복사 완료 처리와 focus를 보존하며 출력/guide 상태를 연결한다.
- [x] 계절이 먼저인 DOM에 맞춰 native 라디오/주소/고급 설정의 키보드 검사를 갱신한다. 새 제목 문구의 네 언어 검증도 갱신한다. 기존 테스트의 주소 검증/치환자/코드 무효화 의미는 약화하지 않는다.
- [x] 네 언어320px와 모바일 주소→생성/고급 설정/미리보기 클릭, 숨은 메뉴와 안내의 키보드 접근을 확인한다.

## Task 3: 전체 회귀/시각 비교/독립 검토

**Files:** docs/features/visitor-village/{spec,design,tasks}.md, reviews/install-atelier-2026-11-25.md, design-qa.md, docs/assets/install-atelier-{desktop,mobile}.png.

- [x] pnpm test/typecheck/build/test:e2e를 실행한다. 기본4178 충돌 시 임시 설정의4193에서 같은 전체 tests를 실행한다.
- [x] 선택 원본1487×1058과 같은 뷰포트/초기 상태를 캡처하고 비교한다.375×667 및320px 네 언어/ready/dirty/오류/렌더 실패도 확인한다.
- [x] design-qa.md에서 P0/P1/P2를 수정해 final result: passed로 마무리한다. 실제 위젯/기존 로고를 유지한 시안과의 차이는 기록한다.
- [x] 마지막 fresh-context 코드 검토를 받고 중요 결함을 재현해 수정한다. 실제 수행한 검토만 기록하고 로컬 미리보기를 유지한다.

## Review Focus

- DOM 순서/반응형 배치가 서로 다른 키보드 경험을 만들지 않는지.
- 주소 입력 중 이동한 고정 버튼이나 메뉴 팝업이 포인터 클릭과 focus를 잃게 하지 않는지.
- 언어 전환이 안내 details/메뉴 열림과 dirty 상태를 재설정하지 않는지.
- clipboard 성공과 fallback을 실제 설치 성공으로 표시하지 않는지.
- 공통 색상 변경이 어두운 홈/밝은 문서의 대비와 기존 선택/오류 경계를 깨지 않는지.

## 실행 기록

- 기존 linked worktree는 기능 브랜치이며 기준 HEAD는 bd4a3f5다. 다른 세션의 홈/문서 변경은 이미 커밋됐고 보존한다. 초기 dirty는 이번 조사의 이미지와 연구 문서뿐이다.
- Native 실행과 현재 명세 경로를 재사용한다. 중복 승인/커밋을 요구하는 일반 스킬 템플릿 대신 사용자의 선택 승인과 이 실행 기록을 작업 원장으로 삼고, 승인한 구현을 계속한다.

- 독립 구현 준비 검토: 중요한 미정 결정이나 blocker 없음. 현재 선택 시안과 VV-ATELIER 계약으로 구현 가능하다고 확인했다.
- RED: 기존 번들에서 새 제목/배치,142px 모바일 헤더, 없는 접는 메뉴, 미리보기 밖의 결과 섹션으로4개 새 검사가 모두 실패함을 확인했다.

- 시각 비교1: 원본 대비 제목/설정 글자와 설정 열이 작고320px 영어 메뉴가 줄바꿈되는 P2를 확인했다. 설치 hero48/lead18/작업면 제목24, 설정 열392px와 짧은 주소 역할 안내로 맞추고 메뉴는 줄바꿈하지 않으며 모바일 단계는 번호 위/문구 아래로 정리한다. 본문16/도움말14와 실제 제품/로고 계약은 유지한다.

- 독립 코드 검토: Important3건(키보드로 메뉴 열기 후 링크 진입, 오늘까지/오늘 집계 문구, 입력 경계3:1)과 Minor1건(모바일 새 탭 보조 설명 숨김)을 확인했다. 앞의3건을 실패 검증으로 재현하고 첫 링크 초점/오늘 하루 문구/3.36:1 경계로 수정했으며 sr-only override도 제거했다.

- 최종 검증: 단위128/128, 전체 브라우저72/72, 타입/사이트/독립 위젯 빌드 통과. 동일1487×1058 비교와 설정 상세 비교,375/320px 다국어 화면에 남은 P0/P1/P2 없음. [실제 검토 기록](reviews/install-atelier-2026-11-25.md)과 루트 design-qa.md에 근거를 남겼다. 미리보기5201을 유지하며 이번 변경은 커밋/푸시/배포하지 않았다.
