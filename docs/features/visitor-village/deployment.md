# 배포와 티스토리 설치

현재 공개 호스트는 **Cloudflare Pages Free**다. 2026-11-23 KST에 무료 정적 배포와 로그인 없는 공개 접근, 외부 출처 위젯 로드를 확인했다. 사용자가 무료 요금 비교 뒤 Pages 이전을 요청했다. 실제 티스토리 스킨 설치와 모바일 실기기 확인은 아직 남아 있다.

## 공개 주소와 배포 상태

- 마을: https://pixel-visitor-village.pages.dev/
- 설치 도우미: https://pixel-visitor-village.pages.dev/install.html
- 독립 모듈: https://pixel-visitor-village.pages.dev/widget/visitor-village.js
- 이번 고유 배포: https://1d843341.pixel-visitor-village.pages.dev/
- 프로젝트: `pixel-visitor-village`, production branch: `main`, 방식: Wrangler Direct Upload.
- 계정 ID: `96dc7e6d07c8cb414af597acfec30146`. 인증은 사용자 OAuth를 사용하며 인증 값은 저장소와 명령 인자에 넣지 않는다.
- 최신 소스: `f67b67de3fc34daa853c4be3211918f0d765fb9b` (`feat/visitor-notice`). 최초 Pages 이전은 `234e854` 기반으로 진행했고 이후 `main`에 병합되었다. 이번 기능 커밋은 기능 브랜치에 푸시했으며 GitHub 자동 배포는 구성하지 않았다.

## 2026-11-25 디자인 시스템 후속 개선 배포 완료

준비한 개선안의 커밋/푸시와 운영 배포를 사용자가 승인했다. 소스 커밋은 `f67b67de3fc34daa853c4be3211918f0d765fb9b`이며 기존 `origin/feat/visitor-notice`에 푸시했다. 커밋의 배포 소스44개와 작업 파일을 바이트 단위로 대조하고 검증한 정적 파일24개의 해시 일치를 확인한 뒤 기존 Pages production에 Direct Upload했다.

- 고유 배포: https://1d843341.pixel-visitor-village.pages.dev/ (`1d843341-942c-400b-8fb2-2a02e024cbd0`).
- 공개 설치 화면: https://pixel-visitor-village.pages.dev/install?lang=ko. `/install.html`도 기존대로 사용할 수 있다.
- 공통 토큰/브랜드와 제어 규격, 모바일 조판과 하단 행동, 고급 설정과 경고, 설정 변경 안내, 설치 미리보기 링크 범위와 숨긴 알림 접근성을 반영했다. 설치 화면의 한국어/영어/일본어/중국어 간체 지원을 유지한다.
- 커밋 전 단위128/128, 전체 Chrome63/63, 타입 검사와 빌드를 통과했다. 공개 Chrome 검증7/7도 통과했다.
- 공개 검증: 320px 네 언어의 고급 설정 열기/닫기와 주의, 코드 생성/변경/재생성, 실제 Pages 모듈 URL과 티스토리 치환자, 관리자 링크와 클립보드 복사, 데스크톱 공통 제어, 375px 첫 화면을 확인했다. 별도 HTTP 블로그 출처에서 공개 모듈로37명을 렌더링했다. 페이지 스크립트 오류 없음.
- 공개 위젯 SHA-256은 `6598bd78157dc7095b6ea70cbd0f24450245fb858c1da8fbcb83f37a240af4d7`로 검증한 묶음과 일치한다. JavaScript MIME/CORS `*`/`nosniff`/5분 캐시와 없는 JS의404를 확인했다. 공개 HTML의 새 설치 JS/CSS 참조도 확인했다.
- 직전 production은 `09738faa-0e3b-4a88-8b61-7ca2ded22215`다. 필요할 때 되돌릴 이전 버전으로 기록하며 이번에는 롤백하지 않았다.

실제 티스토리 스킨 편집과 방문자 집계, 모바일 실기기와 보조 기술의 음성 출력 검증은 별도 범위다. 기존 블로그는 동일한 모듈 URL을 계속 사용하며 브라우저 캐시 때문에 이전 파일이 최대5분 남을 수 있다. GitHub main 병합이나 자동 배포 설정은 변경하지 않았다.

## 2026-11-25 기능 배포 완료

사용자가 커밋/푸시/배포를 요청했다. 소스 커밋은 `91aa12f964e4c1f74481af1442caec1bfafb44d8`이며 `origin/feat/visitor-notice`로 푸시했다. 이 커밋의 배포용 소스 100개와 Git 내용을 바이트 단위로 대조한 뒤 기존 production 프로젝트에 Direct Upload했다. 미완료 디자인 시스템 개선은 로컬에 보존하고 이번 커밋/배포에서 제외했다. main 병합과 Git 자동 배포 설정은 수행하지 않았다.

- 배포 URL: https://09738faa.pixel-visitor-village.pages.dev/
- 공개 주소: https://pixel-visitor-village.pages.dev/ 및 /install.html.
- 포함 기능: 나무 팻말/선택적 방문 수 확인/저장소 링크, 직각 프레임, 산타/루돌프 장식, 캐릭터 자동 인사/아이콘 반응, 다국어 설치 페이지 개편.
- 단위 128/128, 타입 검사와 앱/독립 위젯 빌드, 배포 소스의 전체 Chrome 56/56 통과. 브라우저 검사는 별도 스냅샷과 5202 포트를 사용했으며 커밋의 기본 테스트 설정은 유지했다.
- 공개 위젯 SHA-256: `36b084240f6f801b2c74199ec55262088714a24d23dced877cfa1b8d2a337154`. 검증한 로컬 번들과 일치한다.
- 공개 응답에서 JavaScript MIME, CORS `*`, `public, max-age=300, must-revalidate`, `nosniff`와 없는 JS의 404를 확인했다.
- 실제 공개 Chrome에서 24명, 직각 프레임, 자동 인사, 산타/루돌프, 모션 줄이기, 네 언어 설치 코드의 Pages origin/티스토리 치환자, 320px 넘침 없음, 별도 HTTP 출처의 37명 위젯을 확인했다. 스크립트 오류 없음.

집/나무 아트는 조사만 포함하며 교체하지 않았다. 방문자 시각/지역 수집도 구현하지 않았다. 기존 Pages 모듈을 사용하는 블로그는 같은 URL로 새 코드를 받지만 이전 파일이 최대 5분간 캐시될 수 있다. 실제 티스토리 스킨과 모바일 실기기 검증은 남아 있다.

## 정적 배포 구성

서버와 데이터베이스, Pages Functions 없이 `pnpm build`의 `dist`만 제공한다. 원본 에셋과 소스, 인증/개인 스킨, `node_modules`, 테스트 결과와 `brag-output`을 배포하지 않는다. 2026-11-25 배포의 출력 파일 24개는 총 5,475,835bytes이며 가장 큰 MP4는 2,979,821bytes다. `dist/widget`에는 독립 JavaScript 한 개만 둔다. 업로더는 `_headers`를 별도 처리하고 나머지 23개 파일 중 18개를 새로 올렸으며 5개는 기존 업로드를 재사용했다.

`wrangler.jsonc`는 이름/출력/호환 날짜를 고정한다. `public/_headers`는 `/widget/*`에 CORS `*`, `public, max-age=300, must-revalidate`, `nosniff`를 적용한다. `public/404.html`로 없는 JS 경로가 기본 SPA HTML 200으로 바뀌지 않게 한다. `vite.widget.config.ts`의 `publicDir: false`는 영상과 설정의 중복 복사를 막는다.

설치 도우미는 자기 origin을 기준으로 모듈 URL을 생성한다. 서버에서 블로그에 접근하거나 비밀번호를 받지 않는다.

## 다시 배포하는 방법

Node.js 22.12 이상과 pnpm 10, 사용자 Cloudflare 로그인을 사용한다.

```bash
npx --yes wrangler@4.166.0 whoami
pnpm build
pnpm test
pnpm test:e2e
npx --yes wrangler@4.166.0 pages deploy dist --project-name pixel-visitor-village --branch main
```

새 배포를 실행할 때 대상 계정/프로젝트와 소스 상태를 확인한다. 이번처럼 미커밋 배포가 승인된 경우에만 `--commit-dirty=true`를 사용하고 기록에 남긴다. 위 명령은 직접 배포하며 GitHub push에 따른 자동 배포는 구성하지 않았다.

Wrangler 4.166.0은 최초 Pages 생성 명령을 Workers로 위임할 수 있다. 이번에는 요청한 Pages를 직접 만들기 위해 `pages project create pixel-visitor-village --production-branch main --force`를 한 번 사용했다. 이미 존재하는 이 프로젝트의 이후 배포에는 `--force`가 필요 없다.

Direct Upload 프로젝트를 나중에 Pages 기본 Git 통합으로 전환할 수는 없다. 자동화가 필요하면 외부 CI에서 Wrangler로 업로드하거나 새 Git 통합 프로젝트를 만든다. 자동화 설정과 토큰/Secret 생성은 이번에 수행하지 않았다.

근거: [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Headers](https://developers.cloudflare.com/pages/configuration/headers/), [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/), [무료 제한](https://developers.cloudflare.com/pages/platform/limits/).

## 2026-11-23 초기 배포의 실제 확인

- 단위 테스트 60/60, TypeScript와 사이트/모듈 빌드, 기존 Chrome 브라우저 회귀 22/22 통과.
- 비로그인 HTTPS에서 홈/설치/포스터와 위젯 접근 성공, 없는 `/widget/does-not-exist.js`는 404.
- 위젯 MIME: `application/javascript`, CORS: `*`, Cache-Control: `public, max-age=300, must-revalidate`, `nosniff` 확인.
- 공개 모듈 SHA-256: `ca2e663fd4cb478b6fe0e81d80e66265746df8c9aca42e306315e24fc19af37e`. 테스트한 로컬 빌드와 바이트 단위로 일치한다.
- 실제 공개 Chrome에서 5개 테마의 렌더러 준비와 24명, 계절 전환 시 위치 보존, 390px 화면과 가로 넘침 없음, 설치 코드의 실제 Pages origin과 티스토리 치환자 보존을 확인했다. 스크립트 오류 없음.
- 별도 HTTP 출처에서 공개 모듈을 불러 크리스마스 37명 위젯을 생성했다. 24와 37은 시연/검증용 값이다.
- MP4 Range 요청은 200 `video/mp4`였다. Chrome에서 20초 영상의 currentTime 진행과 음소거/인라인 재생을 확인했다. 206 구간 응답이나 Safari/iOS 실기기 호환을 확인한 것으로 해석하지 않는다.
- [독립 설정 검토](reviews/cloudflare-2026-11-23.md)에서 확정된 중요 문제 없음.

## 티스토리 설치

1. [설치 도우미](https://pixel-visitor-village.pages.dev/install.html)에 블로그 주소와 계절을 입력하고 코드를 복사한다.
2. 사용 중인 스킨을 백업한 뒤 티스토리 관리자 → 꾸미기 → 스킨 편집 → HTML 편집을 연다.
3. 마을을 표시할 위치에 코드를 붙여 넣고 저장한다. 기존 Vercel 스크립트를 넣었다면 새 Pages 주소로 바꾸며 같은 위젯을 중복 삽입하지 않는다.
4. `[##_count_today_##]`가 실제 오늘 방문자 수로 바뀌고 캐릭터 수와 일치하는지 확인한다. 치환자가 남으면 시연 숫자로 덮어쓰지 말고 스킨 삽입 위치를 확인한다.
5. 모바일 화면과 스크롤, 본문 링크를 확인한다. 자동 모바일 스킨을 사용하면 그 스킨의 별도 적용 여부도 확인한다.

주소 입력만으로 원격 스킨이 바뀌지는 않는다. 소유자가 최초 한 번 붙여 넣어야 하며 실제 대상 계정과 스킨 검증은 아직 수행하지 않았다. [정적 예제](../../../examples/tistory-snippet.html)에도 새 Pages 주소를 반영했다.

## 이전 Vercel 기록

이전 주소는 `https://pixel-visitor-village.vercel.app`이며 2026-11-21 확인 당시 홈과 위젯 파일이 HTTP 402 `DEPLOYMENT_DISABLED`를 반환했다. 당시 alias는 `dpl_666mTTaes3k9DMSbvJe7Gi48Wsoz`를 가리켰다. 기존 프로젝트와 `vercel.json`은 삭제하지 않았다.

최초 배포 당시 만들어 둔 `release/pixel-visitor-village-0.1.0.tar.gz`는 이전 Vercel 주소를 포함한 로컬 보관물이며 이번 Pages 배포 파일로 사용하지 않는다. Pages의 현재 상태와 주소는 위 기록을 따른다.


## 2026-11-24 방문 수 팻말 후속 변경

팻말/저장소 링크와 선택적 확인 기능은 로컬 구현 단계이며 이번 변경을 공개 배포한 것으로 기록하지 않는다. 배포 뒤 기존 설치에도 팻말과 링크가 표시되며, 1분 확인은 소유자가 설치 도우미에서 선택하거나 기존 태그에 refresh-interval="60"을 추가해야 한다. 자동 확인을 사용하려면 같은 블로그 홈페이지에도 정상 치환된 visitor-village count가 있어야 한다. 공개 블로그 HTML의 숫자 일치는 확인했지만 반복 조회의 집계 영향과 새 모듈의 실제 티스토리 실행은 미검증이다.

## 2026-11-25 디자인 시스템 후속 개선 배포 준비

사용자의 후속 진행 요청에 따라 디자인 시스템 후속 개선의 production 빌드를 다시 만들었다. 공개 설치 페이지는 기존 `install-n6A8lh_p.js`/`install-BoccGyv3.css`를 사용하며, 준비한 버전은 `install-DdVNZog2.js`/`install-pc46GGpr.css`다. 이 준비 단계에서 커밋, 푸시와 공개 배포는 수행하지 않았다.

- 범위: 공통 디자인 토큰/브랜드/제어 규격, 모바일 조판과 상태별 생성 버튼, 고급 설정/경고, 설정 변경 후 재생성 안내, 미리보기 링크 범위와 숨긴 알림 접근성. 한국어/영어/일본어/중국어 간체 유지.
- `pnpm build` 재실행 통과. 구현 최종 검증은 단위128/128, 브라우저63/63이며 [검토 기록](reviews/design-system-polish-2026-11-25.md)에 있다.
- 로컬 배포 묶음: `release/design-system-polish-20261125.tar.gz`. `dist` 24개 파일, 총5,487,193bytes와 각 파일 SHA-256이 있는 manifest를 포함한다. 소스/의존성/인증은 포함하지 않는다.
- 묶음 SHA-256: `49e883044d291aad728967fd38d4587701756530369af3b4ee9abfe1e0ed802a`.
- 위젯 SHA-256: `6598bd78157dc7095b6ea70cbd0f24450245fb858c1da8fbcb83f37a240af4d7`.
- 기존 사용자 OAuth 로그인과 기존 배포 계정 일치를 읽기 전용으로 확인했다.

프로젝트 `AGENTS.md`는 커밋과 푸시를 사용자가 요청한 범위에서만 하도록 정한다. 이번 구현 계획도 공개 배포를 별도 단계로 두었으므로, 준비한 결과물의 커밋/푸시와 현재 Pages production 반영 범위를 확인한 뒤 수행한다.

후속 상태: 사용자가 위 준비 결과의 커밋/푸시와 기존 Pages production 배포를 “진행해줘”로 승인했다. 승인한 버전의 최종 반영과 공개 검증을 진행한다.

최종 상태: 위 준비 묶음을 소스 `f67b67d`로 기존 production에 반영했고 공개 검증7/7을 통과했다. 최신 공개 주소와 해시는 문서 상단의 후속 개선 배포 완료 기록을 따른다.
