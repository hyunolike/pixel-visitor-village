# GitHub Actions 배포와 릴리즈 계획

사용자가 병합 후 자동 배포와 릴리즈 기록을 직접 구성하도록 요청했다. 기존 Cloudflare Pages Direct Upload 프로젝트/주소를 유지하고, 폰트 PR #11과 분리해 구현한다.

## 요구사항과 선택

- PR과 main에서 잠금 파일 설치, 단위/배포 도구 검사, 타입/사이트+위젯 빌드와 Chromium 브라우저 회귀를 실행한다. 실패하면 배포하지 않는다.
- main의 검증 산출물만 배포한다. PR은 배포 Secret을 받지 않는다. 배포는 동시 실행하지 않고 취소하지 않는다. 오래된 main 커밋은 배포 직전에 제외한다.
- 검증한 dist를 다시 빌드하지 않고 같은 파일로 업로드한다. 소스 커밋/실행 링크/릴리즈 태그를 deployment.json과 외부 manifest에 남긴다.
- 공개 고유 배포의 파일 해시, 메인 별칭의 deployment.json, 위젯 CORS/MIME/404를 확인한 뒤 GitHub 릴리즈를 게시한다.
- 태그는 deploy-<run_number>-<sha7>다. site.tar.gz, 독립 위젯, 파일 manifest와 SHA256SUMS를 첨부한다. 동일 실행 재시도는 같은 태그를 사용한다. 릴리즈 실패는 이미 성공한 배포를 되돌렸다고 주장하지 않는다.
- Actions는 공식 저장소의 확인한 SHA로 고정한다. production Secret은 프로젝트 계정의 Pages Edit API 토큰과 계정 ID만 사용한다. 사용자 OAuth/refresh token을 CI에 복사하지 않는다.

## 구현과 확인

- [x] spec/design/tasks에 계약을 연결하고 workflow/산출물/검증/릴리즈 스크립트 작성.
- [x] 해시 불일치와 누락 파일, 소스/실제 태그 검증, HTTP 오류/헤더, 재시도14개 도구 단위 검사.
- [x] 로컬 단위146/14, 타입/빌드/브라우저79, 실제 묶음 생성/해시와 독립 검토/태그 지적 보완.
- [x] [PR #12](https://github.com/hyunolike/pixel-visitor-village/pull/12)의 실제 Linux Actions146/14/79 통과와 main 병합.
- [x] Cloudflare 토큰 연결, main0215eb4 자동 배포/공개35파일 해시/첫 릴리즈 [deploy-2-0215eb4](https://github.com/hyunolike/pixel-visitor-village/releases/tag/deploy-2-0215eb4) 확인.

초기 OAuth 권한/잠금 문제는 사용자 발급 승인과 Mac 잠금 해제 뒤 대시보드 작업으로 해소했다. 기존 계정의 Cloudflare Pages Edit 전용 API 토큰을2027-11-25 만료로 발급해 GitHub Secret에 등록했다. 계정 ID도 등록되어 있다. 토큰 값은 채팅/저장소/로그에 기록하지 않았다. [첫 main 실행](https://github.com/hyunolike/pixel-visitor-village/actions/runs/45621195668)의 verify/publish가 모두 성공했다.
