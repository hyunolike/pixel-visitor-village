# 설치 페이지 디자인 시스템과 다국어 구현 계획

> 실행: superpowers:executing-plans를 적용해 현재 세션에서 직접 구현한다. 사용자의 “진행해줘”는 앞서 제시한 설계와 네 언어 지원의 구현 승인이다. 같은 범위를 다시 승인 요청하지 않는다. 커밋, 푸시와 공개 배포는 수행하지 않는다.

**Goal:** 승인한 밝은 설정 작업실을 구현하고 설치 흐름을 한국어, 영어, 일본어, 중국어 간체로 제공한다.

**Architecture:** 기본 HTML 폼과 CSS 토큰, 타입이 일치하는 번역 사전을 사용한다. 기존 설치 모델을 유지하고 마을 모듈은 동적으로 불러 폼 실패와 미리보기 실패를 분리한다.

**Tech Stack:** 기존 TypeScript, Vite, PixiJS, Vitest와 Playwright. 새 의존성 없음.

**Spec:** [VV-INSTALL-001~004](spec.md), [2026-11-24 승인 설계](design.md).

## 공통 제약

- 기존 linked worktree에서 작업하며 방문 수 팻말/저장소 링크/1분 조회 옵션을 보존한다. 독립 위젯 기본 한국어와 티스토리 치환자를 유지한다.
- 설치 페이지만 개편/번역한다. 24명은 시연용이며 실제 설치 성공을 주장하지 않는다.
- 번역 문자열은 textContent/value/속성으로 넣고 innerHTML로 삽입하지 않는다.
- 320px 이상에서 가로 넘침 없음, 키보드 포커스, 모션 줄이기와 WCAG AA 텍스트 대비.
- URL lang → 저장 선택 → 브라우저 언어 → ko. ko/en/ja/zh 지역 변형을 지원 언어로 정규화한다. 저장소 실패는 무시한다.

## 검토 초점

1. 이미 코드/오류/복사 상태가 있는 도중 언어를 바꿔도 그 상태와 포커스를 잃지 않아야 한다.
2. 복사 중 주소/계절/조회 옵션을 바꾸면 오래된 비동기 복사 완료가 현재 화면에 표시되지 않아야 한다.
3. 미리보기 모듈/WebGL 실패와 재시도가 설치 코드 생성에 영향을 주지 않아야 한다.
4. 네 언어의 긴 문구와 320px 화면에서 native radio/checkbox와 코드가 조작 가능해야 한다.
5. 새 번역 경로가 기존 외부 위젯의 한국어 팻말/저장소 링크와 조회 수명을 깨지 않아야 한다.

## Task 1: 번역과 언어 결정

**Files:** 새 `src/install-i18n.ts`, `src/install-i18n.test.ts`. 수정 `src/install-model.ts`, `src/install.test.ts`.

**Interfaces:** `Locale = 'ko'|'en'|'ja'|'zh-CN'`, `normalizeLocale(value:string|null):Locale|undefined`, `resolveLocale(search:string,readStored:()=>string|null,languages:readonly string[]):Locale`, `saveLocale(locale:Locale,write:(value:string)=>void):void`, `messages:Record<Locale,Messages>`. 폼 오류는 `InstallError`에 안정적인 code를 추가하고 기존 한국어 message를 보존한다. 사전에 코드별 오류를 둔다.

오류 계약: `InstallErrorCode = 'empty'|'invalid'|'unsafe'|'public'|'module'|'season'`. `InstallError extends Error`의 생성자는 `(code:InstallErrorCode)`이며 한국어 message는 기존 문자열 그대로다. 순서대로 빈 주소, URL 파싱 실패, 잘못된 프로토콜/계정정보/포트, 비공개/잘못된 호스트, 모듈 URL, 잘못된 계절을 나타낸다. 예상 밖 오류는 번역된 일반 생성 실패 문구로 표시한다.

- [x] 지역 언어 정규화, URL/저장/브라우저 우선순위, 미지원 값, 저장 접근 실패와 기존 URL 검증/조회 옵션 보존 테스트를 작성하고 실패 확인.
- [x] 네 언어 전체 사전과 위 함수/오류 식별자 구현. 실행 `pnpm test` → 전체 통과.

## Task 2: 작업실 화면과 다국어 미리보기

**Files:** 수정 `install.html`, `src/install.ts`, `src/install.css`, `src/visitor-village.ts`. 새 `src/design-system.css`, `src/village-labels.ts`. 검증 `tests/widget.spec.ts`.

**Interfaces:** Task 1 사전을 소비한다. `VillageLabels`는 region, repository, repositoryLabel, loadError, assetWarning, seasons, today(count,delta), recent(count)을 가진다. 위젯 `labels` setter는 지정한 문자열을 갱신하며 기본 한국어를 유지한다. 미리보기는 refresh-interval 미지정, count=24, 언어별 labels를 전달한다.

코드 검토 반영: visitors(count)와 guests(santa/rudolph)를 추가한다. 렌더러의 setLabels가 같은 labels를 받아 매 프레임의 캔버스 접근성 설명을 직접 구성한다. 위젯에서 캔버스 aria-label을 임의로 덮어쓰지 않는다.

labels 변경 시 현재 shownNotice의 snapshot/count/delta로 텍스트만 다시 만든다. 최근 날짜이면 recent(count)를 사용한다. 타이머, 표시 여부, last/pending/shown 상태와 캐릭터 모델은 바꾸지 않는다. 다음 notice 표시에도 같은 labels를 사용한다. 렌더러/에셋 실패 상태도 labels에서 다시 표시한다.

- [x] 기존 빌드에서 언어 선택/계절 미리보기가 없는 것을 브라우저 검사로 확인한다.
- [x] 공통 토큰과 반응형 작업실, native 계절 radio, 기본 꺼짐 조회 체크박스, 코드 영역과 항상 읽을 수 있는 설치 절차를 구현한다. 생성 후 관리자 링크만 활성화한다.
- [x] 폼 상태는 origin/errorCode/copyStatus/세대번호로 보관한다. 주소/계절/조회 변경은 결과를 지우고 세대번호를 올린다. 복사는 시작 시 코드/세대를 캡처해 완료 시 여전히 같을 때만 상태를 표시한다.
- [x] 언어 변경은 DOM을 재생성하지 않고 문자열/lang/title/URL/저장값과 미리보기 labels만 갱신한다. 주소/계절/코드/체크/포커스/상태를 보존한다.
- [x] 동적 import와 village-ready/error를 감시한다. 로드 실패 안내/재시도에서 폼은 독립 동작한다. 오류가 renderer일 때 미리보기만 교체하고 현재 계절/언어/일시 정지 상태를 재적용한다.
- [x] 결과 제목에 tabindex=-1, 오류는 입력과 연결, 복사 상태는 aria-live. 설치 코드에 시연 24명이나 언어를 주입하지 않는다.
- [x] `pnpm typecheck`, `pnpm build`, 설치 전용 브라우저 검사 통과.

## Task 3: 회귀, 시각 확인과 기록

**Files:** 수정 `tests/widget.spec.ts`, `docs/features/visitor-village/{spec,design,tasks}.md`. 새 `docs/features/visitor-village/reviews/install-redesign-2026-11-24.md`. 실제 캡처는 `docs/assets/install-desktop.png`, `docs/assets/install-mobile.png`.

- [x] 네 언어의 코드 생성/오류/복사 상태/언어 전환 보존, 선택 기억, URL 우선순위와 쿼리/해시 보존을 검사한다.
- [x] 5개 계절, ID 보존, 일시 정지/모션 줄이기, 복사 실패, 복사 경합, 미리보기 실패/재시도와 실제 설치 흐름을 검사한다.
- [x] 320/390/1440px, 영어/일본어/중국어 문구의 넘침 및 포커스를 확인한다. 실제 빌드 캡처를 보고 승인 보드와 비교한다.
- [x] `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e` 전체 통과. 실제 결과만 기록한다.
- [x] 새 문맥 코드 검토 결과를 받고 중요 결함을 수정/재검증한 뒤 전달한다. 운영 배포와 실제 티스토리 스킨 검증은 완료로 기록하지 않는다.

## 실행 기록

- 2026-11-24: 사용자가 설계 승인. 현재 linked worktree feat/visitor-notice에서 진행하며 기존 수정은 보존한다.
- Task 1→2: Locale/Messages와 오류 code를 공유한다. Task 2→3: locale-select, preview-village와 기존 install-* ID를 브라우저 검사에 사용한다.
- 사전 EGM 준비 검토: 독립 implementation_readiness 검토자가 오류 code 계약과 표시 중 팻말 번역 계약 두 Major를 지적했다. 위 두 인터페이스를 명시해 보완했다. Blocker 없음. 전체 5단계 EGM 완료로 주장하지 않는다.
- Task 1: complete — 언어 모듈 부재를 확인한 뒤 구현, 전체 단위 107개 통과. 잘못된 모듈 URL 오류 code 회귀도 RED→GREEN으로 확인했다.
- Task 2: complete — 이전 화면의 lang=ko와 장식이 라디오를 가리는 실패를 확인한 뒤 구현/수정했다. 설치 전용 브라우저 13개 통과, 실제 캡처로 데스크톱/모바일 배치를 확인했다.
- Final: fixed — 독립 코드 검토의 Important(캔버스 설명 언어 덮어쓰기)를 모션 reduce/no-preference 브라우저 재현 후 렌더러 소유의 번역으로 수정했다. 두 회귀 모두 GREEN.
- Final: fixed — 잘못된 언어 태그가 우선순위를 깨는 지적은 VV-INSTALL-004의 동작 결함으로 분류해 함께 수정했다. malformed URL/storage 테스트 3개 RED→GREEN. 전체 단위 110개 통과.
- Ruling: 일반 사용자에게 잘못된 URL 언어를 저장된 선호보다 우선시키는 동작은 언어 선택 계약에 어긋나므로 수정 범위에 포함했다. 비용은 유효하지 않은 지역 태그를 더 이상 허용하지 않는 것이다.
- 전체 브라우저 첫 실행에서 다른 작업의 크리스마스 장식 가시성/가짜 시계 검사가 실패했고 단독 재실행은 통과했다. 실제 화면 진입을 기다린 뒤 가짜 시계를 진행하도록 검사를 동기화했다. 제품 동작은 바꾸지 않았다.

- Task 3: complete — 최종 단위 110/110, 전체 브라우저 52/52, 타입/사이트/위젯 빌드 통과. 검증은 다른 서버와 겹치지 않는 임시 4191 설정에서 같은 tests 전체로 실행했다. 확인용 미리보기는 5201이다.
