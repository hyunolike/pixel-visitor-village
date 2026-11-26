# 현재 서비스 디자인을 반영한 소개 영상

기존 `brag-remake`의 캡처와 편집 원본을 바탕으로 현재 서비스의 나무 로고, Neo둥근모 제목, Pretendard 본문과 설치 화면을 반영한다. Codex에서 로컬 `brag-slim` 지침을 적용한 수정이며 Claude Code를 새로 실행했다고 설명하지 않는다. 이전 제작 이력은 원래 폴더에 보존한다.

이 폴더의 원본을 `scripts/media/refine-intro.mjs`가 실행 가능한 작업 폴더로 준비한다. Node22, pnpm10, Google Chrome과 FFmpeg가 필요하다. 저장소의 기존 Git 커밋 `5bea9201da858c200b0a81b4c965e3eec49edd5a`도 있어야 한다. 그 커밋의 소개 영상에서 기존 AAC 음원을 추출해 재인코딩 없이 재사용하므로 별도 비공개 음원 폴더나 인증 정보가 필요하지 않다. Sascha Ende의 Happy Beats(Business Moves Vol.10), CC BY4.0과 기존 CC0효과음 크레딧을 유지한다.

```sh
pnpm build
pnpm preview --port 5208 --strictPort
```

다른 터미널에서 아래 순서로 실행한다. 각 단계는 종료 코드를 확인한 뒤 다음으로 넘어간다.

```sh
node scripts/media/refine-intro.mjs prepare
node scripts/media/refine-intro.mjs capture
node scripts/media/refine-intro.mjs stills
# work/stills와 docs/assets/refinement/video-contact.png를 실제로 확인한다.
node scripts/media/refine-intro.mjs render
node scripts/media/refine-intro.mjs finalize
node scripts/media/refine-intro.mjs verify
```

전체 프레임은 Git에서 제외하는 `brag-output/refinement-20261126/work`에 저장한다. 본문 원본과 adapter는 저장소에 보존한다. `MEDIA_ORIGIN`으로 다른 로컬 production preview를 지정할 수 있다. 실제 배포 모듈을 고정된 모델 시간으로 캡처하며 사람 수0→24와 인사, 크리스마스 손님의 타이밍은 영상 시연을 위한 연출이다. 설치 장면은 공개 도메인 주소에 로컬 빌드 바이트를 응답해 실제 배포 주소가 담긴 코드를 생성한다. 블로그 주소를 비워 두고 계절 선택과 코드 생성을 수행한다. 실제 블로그에 코드를 설치하지 않는다.

`prepare`는 기존 미디어를 작업 폴더에 백업하고 `finalize`는 MP4, poster와 GIF를 갱신한다. 상단 README 썸네일은 수정하지 않는다. `verify`는20초/600프레임/1920×1080/H.264-AAC와 검은 구간을 검사하고 최종 파일의 해시를 검토 기록에 남긴다. 디코딩한 화면 검수는 별도로 수행한다.
