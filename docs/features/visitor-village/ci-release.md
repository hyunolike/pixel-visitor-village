# 자동 검사, 배포와 릴리즈

`.github/workflows/pages.yml`이 현재 Pages Direct Upload 프로젝트를 사용한다. Cloudflare 프로젝트를 새로 만들거나 서비스 주소를 바꾸지 않는다.

## 동작

1. main 대상 PR은 잠금 파일 설치, 단위 검사와 배포 도구 검사, 타입/사이트+위젯 빌드, Linux Chromium 브라우저 검사를 실행한다. production Secret과 배포/릴리즈 권한은 받지 않는다.
2. main push 또는 main에서의 수동 실행은 같은 검사를 통과한 `dist`를 묶어 보존한다. publish job은 다시 빌드하지 않고 이 묶음의 체크섬을 확인하고 배포한다.
3. Cloudflare의 고유 배포 파일 SHA-256, 위젯 CORS/MIME/404와 공개 메인 주소의 `deployment.json`이 소스와 같은지 확인한다.
4. 검증을 통과하면 `deploy-<실행 번호>-<짧은 커밋>` 태그의 GitHub 릴리즈를 게시한다. 자동 변경 내역과 서비스/고유 배포/Actions 주소, 전체 사이트 `site.tar.gz`, 독립 위젯, 파일 manifest, `SHA256SUMS`, 배포 확인 JSON을 남긴다.

빌드와 게시가 main에서 겹치지 않도록 직렬 실행하고, 새로운 main 커밋이 이미 있으면 오래된 실행은 배포 전에 제외한다. 동일 실행을 다시 실행할 때 정식 릴리즈가 이미 있으면 다시 게시하지 않는다. draft 단계가 중단되었으면 같은 태그/소스로 재개한다. 잘못된 SHA의 기존 태그/릴리즈는 덮어쓰지 않고 실패한다.

## 최초 인증 설정

GitHub 저장소 Settings → Secrets and variables → Actions에 다음을 등록한다.

| 이름 | 값 |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | 기존 Pages 계정 ID. 이번 작업에서 등록했다. |
| `CLOUDFLARE_API_TOKEN` | 해당 계정에만 Account → Cloudflare Pages → Edit 권한을 준 API 토큰. |

토큰은 Cloudflare 대시보드에서 생성한다. 채팅/코드/로그에 값을 붙이지 않는다. 로컬 Wrangler OAuth/refresh token은 장기 CI 토큰으로 옮기지 않는다. GitHub 릴리즈는 Actions가 제공하는 `GITHUB_TOKEN`의 해당 job contents:write 권한으로 만든다.

2026-11-25 현재 기존 로컬 OAuth 갱신 후 토큰 발급 permission_groups API가403 Unauthorized로 거부됐다. Mac 잠금으로 브라우저 대시보드도 사용할 수 없었다. 따라서 API 토큰이 등록되기 전 첫 자동 배포/정식 릴리즈 확인은 미완료다. 인증 값이 없으면 publish job은 명확한 오류로 중단한다.

## 다시 실행과 복구

- Actions → **Verify and publish Pages**에서 실패한 실행의 **Re-run failed jobs**로 재시도한다. 새 main 배포를 원하면 **Run workflow**, branch **main**을 선택한다. 다른 브랜치의 수동 실행은 검사만 한다.
- 배포 자체는 성공했으나 공개 검증이 실패했으면 이미 서비스 파일이 바뀌었을 수 있다. job 실패를 자동 롤백으로 해석하지 않는다. 오류와 metadata를 확인하고 원인을 고쳐 다시 배포한다.
- 릴리즈 업로드가 실패하면 draft가 남을 수 있다. 같은 실행 재시도는 이를 이어서 완성한다. 이미 정식 릴리즈인 기록은 바꾸지 않는다.
- 이전 버전 복구는 Cloudflare Pages의 이전 성공 배포로 rollback한다. 이 작업은 별도 운영 판단이다. 릴리즈 파일은 당시 빌드와 해시를 확인하는 기록으로도 사용할 수 있다.

로컬 도구 검사는 `pnpm test:release`, workflow 문법 검사는 `actionlint .github/workflows/pages.yml`이다. `prepare.mjs`와 공개 검증/게시 스크립트는 Actions 메타데이터와 검증 파일이 없는 임의 실행을 허용하지 않는다.

공식 근거: [Cloudflare CI Direct Upload](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [GitHub workflow 권한](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions), [Playwright CI](https://playwright.dev/docs/ci).
