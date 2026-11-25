# 배포와 릴리즈 자동화 검토

## 로컬 확인

- 단위146/146, 배포 도구14/14, 타입/사이트+위젯 빌드 통과.
- 전체 로컬 Chrome 브라우저79/79(44.1초) 통과. Linux CI는 PR 게시 후 별도로 확인한다.
- `actionlint .github/workflows/pages.yml`, JavaScript 구문과 diff 검사 통과.
- 실제 dist에 dry-run metadata를 추가한36개 파일 묶음 생성과 로컬 전체 SHA 검증 통과. 로컬 dry-run은 production 배포/릴리즈가 아니다.

## 독립 코드 검토

fresh-context `ci_release_review`가 workflow/배포 도구/명세와 테스트를 검토했다. 초기P2 한 건: GitHub Release의 target_commitish만 확인하면 이미 다른 소스를 가리키는 Git 태그를 놓칠 수 있었다. 실제 Git ref와 annotated tag의 최종 커밋을 검사하고 잘못된 태그를 배포 전에 거부하도록 수정했다. 배포 검증 후 없는 태그만 정확한SHA로 만들고 정식 게시 직전 다시 확인한다. 두 새 태그 검사는 검토자가 독립 실행해2/2 통과했고P2 해결로 판단했다. 남은 material finding은 없다.

검토자는 실제 Linux CI, Cloudflare 토큰 권한과 production 게시 성공, 전체 EGM 완료를 판단하지 않았다. PR의 Secret 격리, 검증된 동일dist 전달, 공개 전체 파일 해시와 메인 metadata, 위젯 헤더/404, draft 재개와 완료된 릴리즈 재실행 제외는 정적 검토 범위에 포함했다.

## 현재 운영 연결 경계

GitHub Actions는 활성화되어 있고 공식 Action의 실제 커밋SHA를 확인해 고정했다. accountID Secret은 등록했다. Cloudflare OAuth를 갱신한 뒤에도 `/user/tokens/permission_groups`가403(code9109, Unauthorized to access requested resource)였다. API Tokens 권한이 없는 사용자 로그인/refresh token을 CI로 복사하지 않았다. Mac 잠금/브라우저 미연결 상태라 대시보드로 발급할 수도 없었다. API 토큰 Secret이 없으므로 실제 자동 production 배포/첫 정식 릴리즈는 미완료다.
