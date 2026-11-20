# 배포와 티스토리 설치

현재 단계: Vercel production 배포와 공개 URL 검증을 완료했다. 사용자가 Vercel 공개 배포를 명시적으로 요청했다. 대상 티스토리 주소는 아직 제공되지 않았으며, 설치 도우미에서 소유자가 주소를 입력하고 최초 한 번 코드를 붙여 넣도록 한다. 대화 안 미리보기 호환 문제는 사용자 요청으로 보류한다.

## 배포 방식

별도 서버나 데이터베이스가 필요 없는 정적 웹사이트다. Vercel은 현재 로그인된 `hyunolike` 계정의 `hyunho-jangs-projects` 팀을 후보로 확인했다. 기존 프로젝트를 재사용한다고 가정하지 않는다. 새 프로젝트명 후보는 `pixel-visitor-village`다.

Vercel 설정은 `pnpm build`를 실행하고 `dist`만 웹사이트로 제공한다. `/widget/*`에 외부 ES 모듈 사용을 위한 `Access-Control-Allow-Origin: *`를 설정한다. 인증 정보가 없는 공개 정적 파일에만 적용한다. 이름이 고정된 모듈은 5분 캐시와 재검증을 사용한다.

설정 근거: [Vercel 프로젝트 설정](https://vercel.com/docs/project-configuration), [응답 헤더](https://vercel.com/docs/headers).

## 실제 배포 전 확인할 내용

- 사용자가 Vercel 공개 배포에 동의했고 올바른 계정/팀/프로젝트를 대상으로 하는지 확인한다.
- 이 변경은 아직 미커밋 상태다. Git에 없는 코드를 배포할 경우 배포 대상 파일과 해시를 기록한다. 별도 요청 없이 커밋이나 푸시하지 않는다.
- 배포가 끝나면 로그인하지 않은 요청에서 HTML과 `/widget/visitor-village.js`가 200으로 열리는지 확인한다. 티스토리에서 읽을 위젯 파일에 로그인 화면이 반환되면 설치 완료로 보지 않는다.
- 모듈의 JavaScript MIME과 CORS 헤더를 실제 HTTPS 응답에서 확인한다. 로컬 브라우저 검증만으로 Vercel 헤더까지 검증했다고 기록하지 않는다.

## 티스토리 설치

1. 사용 중인 스킨을 백업한다.
2. [설치 코드](../../../examples/tistory-snippet.html)의 `YOUR_HOST`를 공개 배포 호스트명으로 바꾼다. 현재 템플릿에는 실제 주소를 반영했다.
3. 티스토리 관리자에서 꾸미기 → 스킨 편집 → HTML 편집을 연다.
4. 마을을 넣을 영역에 코드를 삽입한다. 전체 페이지를 덮는 고정 요소로 넣지 않는다. 오늘 방문자 수 치환자는 기존 스킨의 방문자 수 영역과 같은 처리 문맥에서 사용하는 것이 좋다.
5. 실제 페이지에서 숫자가 치환됐는지 확인한다. `[##_count_today_##]`가 그대로 남으면 설치 오류이며 임의의 시연 값으로 바꾸지 않는다.
6. 실제 방문자 수와 캐릭터 수를 확인하고 좁은 화면에서 스크롤과 본문 링크도 확인한다. 티스토리 자동 모바일 스킨을 사용하면 별도 적용 여부를 확인한다.

## 배포 묶음

`release/pixel-visitor-village-0.1.0.tar.gz`에 빌드한 정적 사이트와 설치 코드, SHA-256 목록을 포함한다. 인증 파일, 원본 스킨, node_modules와 테스트 추적 파일은 포함하지 않는다. 배포 묶음의 설치 코드에는 실제 공개 호스트명을 적용했다.

## 후속 작업

공개 URL과 실제 스킨 확인 결과를 이 문서에 기록한 뒤 `tasks.md`의 남은 설치 항목을 완료한다. 현재 공개 배포를 승인받아 production 배포를 완료했다. 실제 티스토리 주소와 스킨 적용은 아직 확인하지 않았다.

## 설치 도우미

공개 배포 후 `/install.html`에서 주소를 입력하면 해당 블로그 관리자 링크와 실제 배포 호스트의 위젯 코드가 생성된다. 주소만으로 계정에 접근하거나 스킨을 수정하지 않는다. 티스토리의 공개 API는 [공식 종료 안내](https://notice.tistory.com/2664)에 따라 종료되었으며 이 기능은 API나 비밀번호 수집에 의존하지 않는다.

## 배포 결과와 실제 확인

- production: https://pixel-visitor-village.vercel.app
- 설치 도우미: https://pixel-visitor-village.vercel.app/install.html
- 프로젝트: hyunho-jangs-projects/pixel-visitor-village
- deployment: dpl_87WZRKurrkR53K4c3LmTp354mSXC, READY
- 소스 상태: feat/seasonal-village의 미커밋 파일. 별도 커밋/푸시는 하지 않았다. Git HEAD의 초기 문서 커밋을 기능 코드의 커밋으로 주장하지 않는다.
- 로그인 정보 없는 HTTP 요청으로 메인, 설치 페이지와 위젯 파일 접근 성공.
- 위젯 MIME: application/javascript; charset=utf-8
- 실제 응답: Access-Control-Allow-Origin: *, Cache-Control: public, max-age=300, must-revalidate, X-Content-Type-Options: nosniff
- 공개 설치 페이지에서 생성한 코드를 다른 HTTP 출처에서 읽어 크리스마스 캐릭터 37명 생성 확인. 37은 검증용 값이며 실제 티스토리 집계 검증은 아니다.
- 공개 모듈 SHA-256: `45b01d8d12f5457c53338a2194750e214165c71102722764730ccba1ff67fc5f`. 로컬에서 테스트한 빌드와 바이트 단위로 일치한다.
