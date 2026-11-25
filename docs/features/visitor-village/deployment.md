# 배포와 티스토리 설치

현재 공개 호스트는 **Cloudflare Pages Free**다. 2026-11-23 KST에 무료 정적 배포와 로그인 없는 공개 접근, 외부 출처 위젯 로드를 확인했다. 사용자가 무료 요금 비교 뒤 Pages 이전을 요청했다. 실제 티스토리 스킨 설치와 모바일 실기기 확인은 아직 남아 있다.

## 공개 주소와 배포 상태

- 마을: https://pixel-visitor-village.pages.dev/
- 설치 도우미: https://pixel-visitor-village.pages.dev/install.html
- 독립 모듈: https://pixel-visitor-village.pages.dev/widget/visitor-village.js
- 이번 고유 배포: https://2e1378ac.pixel-visitor-village.pages.dev/
- 프로젝트: `pixel-visitor-village`, production branch: `main`, 방식: Wrangler Direct Upload.
- 계정 ID: `96dc7e6d07c8cb414af597acfec30146`. 인증은 사용자 OAuth를 사용하며 인증 값은 저장소와 명령 인자에 넣지 않는다.
- 최신 배포 소스: `f05d3f61f7e0065411a2ddbcb963e40768637b38` (`feat/brag-readme-refresh`), [PR #10](https://github.com/hyunolike/pixel-visitor-village/pull/10). 실제 Claude Code brag 제작 영상과 간결한 README 수정본이다. GitHub 자동 배포는 구성하지 않았다.

## 2026-11-25 Claude Code brag 재제작 공개 반영

직전 PR/배포 승인 범위의 후속 요청으로 소개 영상을 실제 Claude Code brag로 다시 제작하고 네 README를 각각44줄로 정리했다. PR #9 병합 뒤 현재 main 기준 후속 [PR #10](https://github.com/hyunolike/pixel-visitor-village/pull/10)을 만들었다. 기존 상단 썸네일과 이미지 체험 버튼은 유지한다. PR병합은 수행하지 않았다.

- Production/main: `2e1378ac-05cb-423b-824e-38402505bbc3`, https://2e1378ac.pixel-visitor-village.pages.dev/ . 기존 공개 별칭에도 반영됐다. 직전 production은18cb4021이다.
- 소스 `f05d3f61f7e0065411a2ddbcb963e40768637b38`,commit-dirty=false. 커밋한 빌드 입력58개와 고정묶음35파일/8,196,967bytes를 대조했다. _headers별도처리 후34개 중3개 업로드/31개재사용.
- 단위146/146,타입/빌드,전체Chrome79/79(42.1초),독립검토와원본썸네일일치/네언어링크보존검사통과.
- 공개7개 범주를 통과했다.34개파일SHA,새20초영상의디코딩/재생,5계절과24명/작은조형물,320px네언어설치/클립보드,4개이미지버튼이동과외부HTTP출처37명위젯을확인했다. pageerror0.
- 영상SHA-256:`a81f6f53e9071bee6c77d70d95c5c04dbe5d280d5549ca2f9364411b2e3f02d7`. 위젯은이전과같은f3a5147f…이다.
- [제작과 검증](reviews/brag-remake-2026-11-25.md),[실제배포파일/해시](reviews/brag-remake-evidence.json). 이번제작은모델분기에따른brag-slim이며HyperFrames새실행으로기록하지않는다.

## 2026-11-25 이미지 버튼과 소개 미디어 커밋 기준 배포

사용자가 후속으로 풀리퀘스트와 배포를 요청해 소스 `c76257b24495d66e90794cc34b01b9a7e2396508`을 원격 브랜치에 올리고 [PR #9](https://github.com/hyunolike/pixel-visitor-village/pull/9)를 생성했다. 기존 상단 썸네일은 원본을 유지한다. PR 병합은 수행하지 않았다.

- Production/main: `18cb4021-03d6-4bfb-b72c-2613c49f741c`, https://18cb4021.pixel-visitor-village.pages.dev/ . 기존 별칭에도 반영됐다. 직전 production은0f6d4807이다.
- 커밋한 빌드 입력58개와 고정 배포 묶음35파일/6,837,943bytes를 대조해 일치를 확인했다.34개 파일은 모두 기존 업로드를 재사용하고 _headers를 별도 반영했다. `--commit-dirty=false`로 소스 커밋을 명시했다.
- 단위146/146과타입/빌드를다시통과했다. 새빌드는직전전체Chrome79/79,HyperFrames오류0/경고0과공개검증을통과한묶음과바이트단위로동일하다.
- 재배포 후 공개7개 범주를 다시 통과했다.34개 파일SHA,5계절과작은조형물/24명,새영상시간진행,320px네언어설치코드와실제클립보드,4개이미지버튼의실제체험이동,외부HTTP출처37명을확인했다. pageerror0.
- 위젯SHA와MP4SHA는아래초기공개반영과같다. [현재근거](reviews/entry-media-evidence.json)에배포ID/소스커밋/파일별해시를보존한다.

첫 Git push가HTTP400으로중단돼원격브랜치미생성을확인한뒤,해당명령에서만HTTP/1.1과8MiB전송버퍼로재시도해성공했다. 원격ref가소스커밋과같음을확인했다. 전역Git설정은변경하지않았다.

## 2026-11-25 작은 조형물과 소개 영상 공개 반영 — 초기 작업 공간 배포

사용자가 README 이미지 버튼과 전체 갱신을 요청해 기존 production에 반영했다. 소스 기준 e9db2c5와 미커밋 미디어 수정본을 `--commit-dirty=true`로 배포했으며 새 Git 커밋/푸시는 수행하지 않았다. 아래 이전 커밋/배포 기록과 구분한다.

- 배포: `0f6d4807-05dc-40ac-b0da-4e8cb9d611bf`,Production/main. 고유 주소 https://0f6d4807.pixel-visitor-village.pages.dev/ . 직전 production은1a1111e3다.
- 고정 묶음:35파일/6,837,943bytes. _headers 별도 처리 후34개 중28개 업로드,6개 재사용.
- 범위: 최신5계절 아트/작은 티스토리 조형물/재연결 수정 위젯,실제 현재 PixiJS 소개 영상/포스터,네 언어 이미지 버튼. 홈/설치/문서는 기존 제품 구조를 유지한다.
- 단위146/146,타입/빌드,전체Chrome79/79과HyperFrames 오류0/경고0. 공개7개 범주,34개 파일SHA,5계절24명/작은 조형물,영상 재생,320px 네 언어 설치/클립보드,버튼 이동과 외부HTTP출처37명 확인. pageerror0.
- 위젯 SHA-256: `f3a5147f707bb400f27cbd1671a0694af323485919ca333cd32fd1c6a83ea164`.
- 소개 MP4 SHA-256: `347f390992648799bb8e9ac778e03cf7b1c969f62d5ad41d77f83d2e1fcafa5f`.
- README4개의 이미지 버튼/작은 조형물 썸네일/갱신 GIF와 설명은 작업 공간에 반영되어 있다. GitHub 문서 반영용 새 커밋/PR은 이번 단계에서 생성하지 않았다. [상세 검증](reviews/entry-media-2026-11-25.md)과 [배포 파일 해시](reviews/entry-media-evidence.json)를 본다.

실제 티스토리 스킨 편집이나 방문자 개인정보 수집은 하지 않았다. 기존 위젯 URL을 사용하는 블로그는 최대5분의 캐시 뒤 새 위젯을 받는다.

## 2026-11-25 마을 작업실 개편 배포 완료

사용자가 추천 시안의 로컬 구현을 확인한 뒤 “진행해줘”라고 요청해 기존 production 반영을 진행했다. 소스 `2a4e2b567ac90857c0cf4ec701449b3e7283a138`을 `origin/feat/visitor-notice`에 푸시하고, 검증한 정적 묶음을 Wrangler Direct Upload했다. main 병합이나 자동 배포 설정은 수행하지 않았다.

- 공개 설치 화면: https://pixel-visitor-village.pages.dev/install?lang=ko. 기존 `/install.html`, 홈과 `/docs/`도 동작한다.
- 고유 배포: https://1a1111e3.pixel-visitor-village.pages.dev/ (`1a1111e3-ef42-4b06-83cc-6f359490199a`). Pages 목록에서 Production/main/소스2a4e2b5를 확인했다. 직전 production은 `d5bbcc11-9a68-4075-90fc-549f3beb1f3a`다.
- 커밋 전 단위128/128, 타입/앱/독립 위젯 빌드, 전체 Chrome72/72를 다시 통과했다. 커밋의 빌드 입력48개를 검증한 작업 파일과 바이트 단위로 대조했다.
- 고정 묶음 `/private/tmp/pvv-atelier-release-20261125/dist`:26개 파일/5,533,398bytes. 파일별 SHA-256 manifest를 저장했다. `_headers` 별도 처리 후25개 중7개 업로드/18개 재사용했다. 개발 Markdown이나 원본/인증 파일은 배포하지 않았다.
- 공개 Chrome8/8 통과: 세 HTML과 설치 JS/CSS/위젯의 로컬 빌드 해시 일치, CORS/MIME/캐시/nosniff/없는 파일404, 데스크톱 코드 생성과 실제 클립보드 복사/단계 전환,320px 네 언어 메뉴 초점/Escape/고급 설정/변경 무효화와 재생성, 독립 HTTP 출처37명 렌더링, 홈·문서/앵커 이동과 JS 없는320px 문서를 확인했다. 설치/외부 위젯 페이지의 스크립트 오류 없음.
- 공개 데스크톱1487×1058과 모바일375×667 캡처를 직접 열어 로컬 시안 구현이 반영됐음을 확인했다. 캡처와 테스트 결과는 `/private/tmp/pvv-atelier-production-results/`에 있다. Codex 패널 열기는 queued 응답으로 표시 완료를 주장하지 않는다.
- 홈 SHA-256: `787865c3fd66bd241936a8e7b55d02b775a8674b5871c9d4239276890f217c3c`.
- 설치 HTML SHA-256: `bf80b6cacdb38b18ad69cc226f93c7df306b2649f138ef066b9175d16ed0beb3`.
- 문서 HTML SHA-256: `faf0fd4bad033030b6b0bd955d40e7530f22b90d37049e1ca703c2de54c8b2ea`.
- 설치 JS SHA-256: `8c29f1931eab8143f01c35724b4ce7808d6af968129c3828842d6ff58a41e8be` (`install-B6wpcjXz.js`).
- 설치 CSS SHA-256: `384ea3ee05e293f7736d122abe973925eb146ef93fd8d70dee4304f1852742f8` (`install-DjmfRH4o.css`).
- 위젯 SHA-256: `6598bd78157dc7095b6ea70cbd0f24450245fb858c1da8fbcb83f37a240af4d7`. 위젯은 직전 배포와 같으며 설치 도구와 공통 스타일을 개편했다.

첫 GitHub push는 HTTP400으로 중단됐고 원격이 이전 커밋임을 확인했다. 해당 명령에서만 `http.postBuffer=8388608`로 바꿔 재시도한 뒤 성공했다. 전역 Git 설정은 바꾸지 않았다. 원격 ref가 소스 커밋과 일치함을 재확인했다. 실제 티스토리 스킨 편집/집계와 모바일 실기기 확인은 수행하지 않았다.

## 2026-11-25 홈·설치·사용 문서 배포 완료

사용자가 로컬 구현 완료 뒤 진행을 요청해 커밋/푸시/배포를 수행했다. 소스는 `3fb60b27b2420b8e2d0e5f032fb2511188e21833`이며 `origin/feat/visitor-notice`로 푸시했다. 검증한 배포 소스110개와 커밋 내용을 바이트 단위로 대조한 뒤 기존 production에 Direct Upload했다. 별도 설치 개편 조사 문서는 이번 변경에 포함하지 않고 로컬에 보존했다.

- 공개 페이지: https://pixel-visitor-village.pages.dev/ , https://pixel-visitor-village.pages.dev/install , https://pixel-visitor-village.pages.dev/docs/ . 기존 /install.html도 지원한다.
- 고유 배포: https://d5bbcc11.pixel-visitor-village.pages.dev/ . 직전 production은 `1d843341-942c-400b-8fb2-2a02e024cbd0`다.
- 커밋 전 단위128/128, 타입/앱/독립 위젯 빌드, 고정 배포 소스 전체 Chrome67/67 통과. 별도 검증 설정에서5204 포트를 사용했고 저장소 기본 설정은 유지했다.
- 공개 검증6개 범주 통과: 홈/설치/문서 HTML과 위젯의 로컬 빌드 해시 일치, CORS와 없는 JS/개발 Markdown의404, 홈 시연과 메뉴/문서/직접 앵커 이동, JS 없는320px 정적 문서와 CSS, 네 언어320px 메뉴/실제 origin 설치 코드, 별도 HTTP 출처의37명 위젯. 스크립트 오류 없음.
- 홈 SHA-256: `31ec567e6c84388c1901ce5751c45b2289e1a2e931068b11f5cfb8598595663f`.
- 설치 HTML SHA-256: `956688babf51fbd0b4c18e2fcdcefb6f73b5b2e0557ec4c3931e1102c354d11b`.
- 문서 HTML SHA-256: `b61cae80cbb76f0ce1b3e0009162db5ffc17b790eb93037fd2ed3a9748ac29cd`.
- 위젯 SHA-256: `6598bd78157dc7095b6ea70cbd0f24450245fb858c1da8fbcb83f37a240af4d7`. 이전 디자인 시스템 배포의 위젯과 같으며 사이트 페이지 개편이 위젯 코드를 바꾸지 않았음을 확인했다.
- 출력 파일26개, 총5527201bytes. _headers 별도 처리 후25개 파일 중8개를 업로드하고17개를 재사용했다. 개발 Markdown을 출력하지 않는다.

홈과 사용 문서는 한국어이며 설치 화면은 네 언어를 유지한다. 실제 티스토리 스킨 편집/집계와 모바일 실기기는 검증하지 않았다. GitHub main 병합과 자동 배포 설정은 변경하지 않았다.

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

서버와 데이터베이스, Pages Functions 없이 `pnpm build`의 `dist`만 제공한다. 원본 에셋과 소스, 인증/개인 스킨, `node_modules`, 테스트 결과와 `brag-output`을 배포하지 않는다. 최신 마을 작업실 배포의 출력 파일 26개는 총 5,533,398bytes이며 가장 큰 MP4는 2,979,821bytes다. `dist/widget`에는 독립 JavaScript 한 개만 둔다. 업로더는 `_headers`를 별도 처리하고 나머지 25개 파일 중 7개를 새로 올렸으며 18개는 기존 업로드를 재사용했다.

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


## 홈·사용 문서 개편 로컬 준비 — 당시 기록

2026-11-25 후속 사용자 승인으로 홈의 소개/실제 데모/설치/FAQ와 `/docs/` 정적 한국어 문서, 설치 네 언어 메뉴를 구현하고 로컬에서 검증했다. 새 진입점은 `docs/index.html`이며 `pnpm build`에서 `dist/docs/index.html`을 만든다. 이번 변경은 아직 커밋/푸시/공개 배포하지 않았다. 위의 production URL과 소스 기록을 새 페이지가 반영된 상태로 해석하지 않는다. [구현 검증 기록](reviews/site-pages-2026-11-25.md)을 참고한다.

후속 진행 승인으로 위 2026-11-25 홈·설치·사용 문서 배포 완료 절의 공개 반영과 검증을 마쳤다. 로컬 준비 당시의 미배포 상태는 현재 상태가 아니다.
