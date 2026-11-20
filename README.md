# Pixel Visitor Village

티스토리의 오늘 방문자 수만큼 픽셀 캐릭터가 생성되어 중앙의 큰 나무 주변을 돌아다니는 독립 웹 위젯.

첫 테마는 크리스마스다. 봄, 여름, 가을과 겨울로 바꿀 수 있고 테마 변경은 방문자 수와 위치를 유지한다. 데모 화면의 숫자는 시연용이며 실제 블로그 집계는 아직 연결하지 않았다.

## 로컬 실행

Node.js 22.12 이상과 pnpm 10을 사용한다.

```bash
pnpm install
pnpm dev --port 5174
```

개발 화면은 `http://127.0.0.1:5174/`에서 열린다. 날짜와 관계없이 크리스마스 테마로 시작한다.

## 검증과 빌드

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm test:e2e
pnpm preview
```

브라우저 테스트는 설치된 Google Chrome을 headless로 사용한다. Chrome이 없는 환경에서는 설치 후 실행하거나 `playwright.config.ts`의 channel을 환경에 맞게 조정한다. 테스트는 데스크톱과 모바일 에뮬레이션이며 실기기 결과와 구분한다.

빌드는 `dist/`에 데모를, `dist/widget/visitor-village.js`에 독립 ES 모듈을 만든다. 배포 모듈은 PixiJS, Shadow DOM 스타일과 크리스마스 이미지를 포함한다. `pnpm preview`에서 `/embed-example.html`을 열면 독립 삽입 예제를 볼 수 있다.

## 티스토리 삽입

빌드한 모듈을 HTTPS 정적 호스트에 올린 뒤 스킨 HTML에 넣는다. 현재 공개 배포 주소는 https://pixel-visitor-village.vercel.app 이다. 외부 ES 모듈을 허용하는 CORS 응답이 필요하다.

```html
<script type="module" src="https://pixel-visitor-village.vercel.app/widget/visitor-village.js"></script>
<visitor-village
  count="[##_count_today_##]"
  season="christmas"
  style="height: 420px"
></visitor-village>
```

오늘 방문자 수 치환자는 티스토리 스킨 HTML에서 처리한다. 외부 JS 파일이나 일반 글 본문에 넣어 자동 치환될 것으로 기대하지 않는다. 처음 열 때의 값을 사용하며 실시간 방문자 서버나 방문자 식별 기능은 없다.

실제 계정과 대상 스킨에는 아직 접근하지 않았으므로 실제 티스토리 설치 검증은 남아 있다. 전체 블로그를 덮는 화면 대신 위젯에 배정한 영역에서만 그린다. 비대화형 캔버스는 모바일 스크롤을 가로채지 않는다.

## 위젯 설정

| 속성 | 동작 |
| --- | --- |
| `count` | 생략/빈 문자열은 0. 정수 또는 올바른 쉼표 표기. 지원 범위 0~5,000. 초과/오류는 안내하고 마지막 정상 마을을 유지한다. |
| `season` | `christmas`(기본), `spring`, `summer`, `autumn`, `winter`. 잘못된 값은 기존 계절을 유지한다. |
| `paused` | 존재하면 정지한다. `paused="false"`도 존재하는 속성이므로 정지한다. 재생하려면 제거한다. |
| `glow` | 기본 켜짐. `glow="false"`로 빛 번짐만 끈다. 이미지에 그려진 전구색은 유지한다. |

운영체제의 모션 줄이기 설정, 숨겨진 탭, 화면 밖 또는 0 크기에서는 애니메이션을 중지한다. 다시 보이면 수동 정지 설정을 존중해 재개한다.

`visitorCount`, `season`, `ready`, `motionReduced`는 읽기 전용이다. `getVisitors()`는 `{id,x,y}` 배열의 복사본을 반환한다. `village-change`, `village-ready`는 `{count,season,paused}`, `village-error`는 `{attribute,message}`를 detail로 전달한다. 이벤트는 bubbles/composed로 전파한다. 공개 계약의 상세 내용은 [설계](docs/features/visitor-village/design.md#첫-버전-공개-계약)에 있다.

## 그림과 개발 문서

- [크리스마스 나무 원본 시안과 생성 기록](assets/concepts/README.md)
- `src/assets/christmas-tree.png`: 원본 시안의 420px 배포용 사본
- 다른 계절의 나무, 캐릭터와 마을 배경: `src/art.ts`에서 직접 그리는 픽셀 그림
- [요구사항](docs/features/visitor-village/spec.md), [설계](docs/features/visitor-village/design.md), [구현 계획](docs/features/visitor-village/implementation-plan.md), [진행 상태](docs/features/visitor-village/tasks.md)
- [독립 검토 기록](docs/features/visitor-village/reviews/)

크리스마스 나무는 하나로 합쳐진 PNG이며 장식별로 분리된 스프라이트가 아니다. 외부 게임 에셋은 사용하지 않았다. Vercel 공개 배포를 완료했다. 라이선스 선택은 별도 작업이다.

## 배포 준비

Vercel 정적 배포 설정은 `vercel.json`에 있다. 외부 블로그에서 모듈을 불러오는 `/widget/*` 경로에 CORS 헤더를 지정했다. [배포와 설치 안내](docs/features/visitor-village/deployment.md)와 [티스토리 설치 코드](examples/tistory-snippet.html)를 참고한다. 설치 템플릿에는 실제 공개 URL을 반영했다.

다른 출처의 블로그를 모의한 브라우저에서 배포 모듈 로드와 쉼표가 있는 `1,234`명 입력을 검증한다. 실제 Vercel의 응답 헤더와 티스토리 스킨 검증은 배포 후 별도로 수행한다. 대화 안 미리보기 표시 문제는 사용자 요청으로 보류한다.

설치 도우미는 `/install.html`에서 사용할 수 있다. 블로그 주소를 입력하면 코드와 관리자 링크를 만들며, 최초 한 번은 스킨에 직접 붙여 넣어야 한다. 주소만으로 원격 설치가 완료되었다고 표시하지 않는다.

## 공개 주소

- [마을 시연](https://pixel-visitor-village.vercel.app/)
- [티스토리 설치 도우미](https://pixel-visitor-village.vercel.app/install.html)

사용자가 Vercel 공개 배포를 요청해 production에 배포했다. 비로그인 접근과 실제 CORS 응답, 공개 설치 도우미에서 생성한 코드의 교차 출처 로드를 확인했다. 실제 티스토리 스킨에는 아직 설치하지 않았다.
