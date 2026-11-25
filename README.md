# 작은 방문자 마을

**한국어** | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

[![티스토리 로고와 작은 방문자 마을의 픽셀 캐릭터를 함께 그린 소개 썸네일](docs/assets/readme-tistory-village.png)](https://pixel-visitor-village.pages.dev/)

티스토리의 오늘 방문자 수만큼 픽셀 캐릭터가 모이는 작은 마을입니다.

<a href="https://pixel-visitor-village.pages.dev/#demo"><img src="docs/assets/entry/visit-village-ko.svg" alt="마을 구경하기 — 최신 마을을 직접 체험하세요." width="640"></a>

[티스토리 설치하기](https://pixel-visitor-village.pages.dev/install) · [사용 문서](https://pixel-visitor-village.pages.dev/docs/)

## 20초 소개 영상

[![작은 방문자 마을 소개 영상](docs/assets/intro-preview.gif)](public/media/intro.mp4)

[영상 보기](https://pixel-visitor-village.pages.dev/#intro-film) · [MP4](public/media/intro.mp4)

영상과 데모의 방문자 수는 시연용입니다.

## 주요 기능

- 오늘 누적 방문자 수를 0~5,000명의 캐릭터로 표시합니다.
- 크리스마스와 봄·여름·가을·겨울, 다섯 가지 풍경을 고릅니다.
- 캐릭터가 걷고 인사합니다. 일시정지와 모션 줄이기를 지원합니다.

## 설치

1. [설치 화면](https://pixel-visitor-village.pages.dev/install)에서 블로그 주소와 계절을 선택하고 코드를 복사합니다.
2. 현재 스킨을 백업한 뒤, 티스토리 관리자 → **꾸미기 → 스킨 편집 → HTML 편집**에 붙여 넣습니다.
3. 실제 블로그에서 오늘 방문자 수와 모바일 화면을 확인합니다.

소유자가 스킨에 직접 코드를 넣어야 합니다. 오늘 누적 방문 수를 사용하며 동시 접속자나 개인의 신원을 나타내지 않습니다. 실제 티스토리 계정의 스킨 설치 검증은 남아 있습니다.

## 개발

Node.js 22.12+, pnpm 10을 사용합니다. 브라우저 검사에는 Google Chrome이 필요합니다.

```bash
pnpm install
pnpm dev
```

[위젯 설정과 API](docs/reference/widget.ko.md) · [개발·테스트·배포](docs/reference/widget.ko.md#로컬-개발) · [제작과 음원 출처](docs/features/visitor-village/intro-media.md)
