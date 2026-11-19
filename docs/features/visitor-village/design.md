# 방문자 픽셀 위젯 설계 초안

상태: 기술 조사에 따른 제안. 설계 승인과 EGM 검토는 아직 수행하지 않았다.

## 접근 방식

| 방식 | 장점 | 부담과 판단 |
| --- | --- | --- |
| Web Components + PixiJS | 전용 태그로 설치하고 위젯 내부 스타일을 분리한다. 프레임 애니메이션을 사용하기 좋다. | 추천안. 이동과 행동 규칙은 직접 작성한다. |
| Web Components + Canvas 2D | 렌더링 라이브러리 없이 단순한 위젯을 만든다. | 작은 시제품의 대안. 에셋과 애니메이션 관리도 직접 구현한다. |
| Web Components + Phaser | 장면과 충돌, 물리 기능을 활용한다. | 미니게임까지 확장할 때 재검토한다. |
| iframe | 별도 문서를 삽입한다. | 이전에 검토한 대안. 이번 조사에서는 iframe 외의 방식을 우선 제안했다. |

Lit은 설정 UI가 복잡해질 때 고려한다. 현재는 기본 Custom Elements API로 충분한지 먼저 확인한다.

## 추천 구조

```text
티스토리 skin.html의 오늘 방문자 수 치환자
  → <visitor-village count="숫자">
  → Custom Element가 입력을 검증
  → Shadow DOM 내부 Canvas에 PixiJS로 그림
  → 캐릭터별 걷기와 쉬기 상태를 갱신
```

Shadow DOM은 위젯 내부 스타일의 충돌을 줄이는 수단이다. iframe과 같은 보안 격리를 제공하지 않는다.

PixiJS는 WebGL 렌더러를 우선 검토한다. WebGPU와 OffscreenCanvas/Worker는 실제 성능 측정 후 필요할 때 도입한다.

## 데이터 계약 제안

- `count`: 0 이상의 정수. 오늘 방문자 수를 뜻한다. 허용할 표시 형식과 최대 수는 구현 전에 확정한다.
- 스킨 HTML에서 티스토리 치환자를 처리하여 전달한다. 외부 JS 파일에서 치환자 처리를 기대하지 않는다.
- 첫 버전의 캐릭터 수는 페이지를 열었을 때 전달된 값이다. 이 값만으로 실시간 집계나 날짜 변경 시 갱신을 보장하지 않는다.
- 공개 데이터 API, 인증키와 별도 방문자 추적 서버는 첫 버전의 필수 구성으로 두지 않는다.
- 예시 태그 이름과 속성은 제안이며 공개 API로 확정하지 않았다.

## 실패 처리와 수명 주기

구현 시 잘못된 입력, 에셋 로드 실패와 렌더러 초기화 실패를 위젯 안에서 처리한다. 요소가 제거되면 애니메이션과 렌더러 자원을 해제한다. 화면 밖과 숨겨진 탭에서는 갱신을 줄이는 방식을 검토한다.

## 확인하지 않은 경계

- 대상 티스토리 스킨에서의 치환자 처리 위치와 스크립트 로드.
- 모바일 화면과 자동 모바일 스킨에서의 노출.
- 실제 캐릭터 수에 따른 프레임 속도와 블로그 스크롤 영향.
- 활동 영역을 페이지 전체로 선택할 경우의 클릭 통과와 레이아웃 연결.

## 공식 근거

2026-11-20 대화에서 아래 공식 문서를 확인했다. 사용 빈도 순위를 조사한 결과는 아니다.

- [티스토리 스킨 파일 구조](https://tistory.github.io/document-tistory-skin/common/files.html)
- [티스토리 오늘 방문자 수](https://tistory.github.io/document-tistory-skin/sidebar/count.html)
- [Chrome: Web Components](https://developer.chrome.com/docs/modern-web-guidance/guides/html/web-components)
- [Lit: 기존 프로젝트에 추가](https://lit.dev/docs/tools/adding-lit/)
- [PixiJS: 렌더러와 운영용 권장 사항](https://pixijs.com/8.x/guides/components/renderers)
- [PixiJS: AnimatedSprite](https://pixijs.download/v8.10.0/docs/scene.AnimatedSprite.html)
- [Phaser: 물리 엔진](https://docs.phaser.io/phaser/concepts/physics)
- [MDN: OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
