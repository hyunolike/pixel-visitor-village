# Seasonal Visitor Village Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Do not commit or push without a separate user request.

**Goal:** 승인된 마을 설계를 실행 가능한 계절 나무 방문자 위젯과 로컬 데모로 만든다.

**Architecture:** Custom Element의 Shadow DOM 안에서 PixiJS/WebGL로 그린다. 방문자 모델은 렌더러와 분리하고 계절 변경과 리사이즈로 초기화하지 않는다. 데모와 배포용 단일 ES 모듈을 따로 빌드한다.

**Tech Stack:** TypeScript, PixiJS 8, Vite, Vitest, Playwright.

**Spec:** [spec.md](spec.md), [design.md](design.md). 2026-11-20 사용자가 설계 미리보기 후 “진행해줘”로 구현 승인.

## Global Constraints

- 중앙의 큰 나무, 첫 테마는 크리스마스. 계절을 바꿔도 캐릭터 수와 위치를 보존한다.
- 블로그 본문과 스크롤을 가리지 않는 독립 영역에 표시한다.
- 잘못된 수를 임의의 수로 바꾸거나 방문자를 조용히 잘라 내지 않는다.
- 시연 값과 실제 티스토리 집계를 구분한다. 실제 스킨 접근 전에는 설치 검증 완료로 기록하지 않는다.
- 코드와 에셋은 이 프로젝트에만 반영한다. 커밋, 푸시와 공개 배포는 이번 범위에 포함하지 않는다.

## Review Focus

- 미치환 문자열, 음수, NaN, 무한대, 잘못된 쉼표와 과도한 입력은 안내하고 마지막 정상 마을을 유지한다.
- 초기화 중 요소 제거/재연결, 복수 위젯과 자원 해제에서 유령 루프나 파괴된 텍스처를 사용하지 않는다.
- 좁은 화면과 0너비에서 나무가 잘리지 않고 캐릭터가 유효 영역을 유지한다.
- 모션 줄이기, 숨겨진 탭과 화면 밖에서는 루프를 중지하고 다시 보이면 정상 재개한다.
- 호스트의 전역 CSS가 Shadow DOM 내부에 침투하지 않으며 배포 모듈은 독립 경로에서도 로드된다.

## Task 1: 입력과 마을 모델

**Files:** `src/model.ts`, `src/model.test.ts`, `package.json`, `tsconfig.json`.

**Interfaces:** `parseCount(raw: string | null): number`; `VillageModel`의 `setCount`, `setSeason`, `step`; `getTreeLayout(width, height)`; `Visitor`는 id, x, y, vx, vy, phase를 가진다. 위치는 0~1의 정규화 좌표다.

- [x] 단위 테스트 작성: 0/1/37/1,234와 빈 값, 잘못된 숫자, 5,001 초과를 검증한다. 첫 버전 지원 범위는 0~5,000이며 초과 시 정확한 안내로 거부하고 절삭하지 않는다.
- [x] `pnpm test`에서 미구현 모듈 때문에 실패함을 확인한다.
- [x] 모델 구현: 캐릭터를 늘리면 기존 객체를 보존하고 줄이면 끝에서 제거한다. 계절 변경은 상태를 보존하며 이동은 화면과 줄기 충돌 경계를 지킨다.
- [x] `pnpm test` 통과. 320px/1024px 배치와 긴 프레임 간격도 테스트한다.

## Task 2: PixiJS 위젯과 계절 나무

**Files:** `playwright.config.ts`, `tests/widget.spec.ts`, `index.html`, `src/demo.ts`, `src/visitor-village.ts`, `src/renderer.ts`, `src/art.ts`, `src/themes.ts`, `src/widget.css`, `src/assets/christmas-tree.png`.

**Consumes:** Task 1 모델. **Produces:** `<visitor-village count="24" season="christmas">`, `count/season/paused/glow` 속성, 읽기 전용 `visitorCount`, `season`, `getVisitors()`와 `village-change`, `village-error` 이벤트.

- [x] 위젯 계약을 검증하는 브라우저 테스트를 먼저 작성한다. 입력 오류, 테마 보존, 모션 설정, 복수 위젯과 연결 해제를 포함한다.
- [x] 미구현 위젯으로 테스트가 실패하는지 확인한다.
- [x] 중앙 나무, 계절별 배경과 잎, 캐릭터 프레임과 발 위치에 따른 깊이 정렬을 구현한다. 크리스마스는 생성 PNG를 사용하고 다른 계절의 픽셀 그림은 코드로 직접 그린다.
- [x] 연결 수명 주기에 맞춰 비동기 초기화와 GPU/옵저버/이벤트 자원을 정리한다. 렌더러 실패 시 위젯 안에 안내한다.
- [x] 타입 검사와 브라우저 테스트를 통과한다.

## Task 3: 데모, 배포 번들과 설치 예제

**Files:** `index.html`, `src/demo.ts`, `src/demo.css`, `vite.config.ts`, `vite.widget.config.ts`, `playwright.config.ts`, `tests/widget.spec.ts`, `public/embed-example.html`, `README.md`.

**Consumes:** Task 2 Custom Element. **Produces:** `dist/index.html`, `dist/widget/visitor-village.js`, 티스토리 설치 안내.

- [x] 승인된 크리스마스 미리보기의 배치와 조작을 실제 위젯 데모에 연결한다. 시연 숫자를 명시한다.
- [x] `pnpm build`로 데모와 배포 모듈을 만들고 `pnpm test:e2e`로 배포 파일을 검증한다.
- [x] 320px/1024px에서 나무와 컨트롤의 잘림, 0/37명 생성, 에러 복구, 계절 전환, 독립 ES 모듈과 CSS 격리를 검증한다.
- [x] 독립 검토 결과와 실행한 검증을 문서에 기록한다. 실제 티스토리 연결은 접근 가능한 스킨이 없어 미검증으로 남긴다.

## 실행 기록

- 구현은 허용된 임시 작업 폴더에서 시작하고 검증한 파일만 `/Volumes/T9/Projects/pixel-visitor-village`로 반영한다. 기존 변경은 보존한다.
- 일일 방문자 최대 규모는 주어지지 않았다. 첫 버전은 명시적인 5,000명 안전 한도를 두고 초과는 안내한다. 조용한 표시 수 제한은 하지 않는다.
- 설치/배포는 별도 호스팅이 필요하다. 로컬 실행까지 완료하고 공개 업로드는 하지 않는다.

## 구현 준비 검토 조치

독립 Goldfish 검토에서 공개 API, 시간/기하 계약과 브라우저 테스트 파일의 단계 배치가 불명확하다는 지적을 받았다. `design.md`의 첫 버전 공개 계약으로 허용값과 기본값, 오류/제거 처리, 이벤트와 복사본 반환을 명시했다. 시간 단위와 경계/0너비 계약을 명시했고 브라우저 설정과 파일을 Task 2로 앞당겼다.

## 완료 검증과 실행 판단

세 작업을 로컬 구현 범위에서 완료했다. 숫자/이동 테스트는 미구현 모듈 실패 후 28개 통과를 확인했고 브라우저 계약도 미등록 요소 실패 후 실제 구현으로 통과했다. 최종 브라우저 회귀는 16개다. 독립 검토자가 찾은 중요 결함 5개는 모두 수정 전 실패를 관찰한 뒤 통과시켰다. 실제 티스토리 설치는 명시적으로 후속 범위다.

판단: 사용자의 구현 진행 요청에 따라 실행 방법은 현재 세션의 직접 구현으로 정했다. 커밋이 허용되지 않아 변경은 미커밋 파일로 검토했고 이력 범위를 꾸며내지 않았다. 별도 허용 작업 폴더에서 검증 후 파일을 원래 새 저장소로 복사해 기존 기획 변경을 보존한다. 안전 한도 5,000명은 초과 안내로 드러내며, 더 큰 규모가 필요하면 성능 검증과 함께 확장해야 한다.
