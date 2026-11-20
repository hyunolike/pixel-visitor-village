# README 화면 캡처

이 폴더의 PNG는 [공개 마을 데모](https://pixel-visitor-village.vercel.app/)에서 2026-11-20 KST에 촬영한 실제 위젯 화면입니다. 별도로 그린 목업이 아닙니다.

| 파일 | 테마 | 이미지 크기 |
| --- | --- | --- |
| `village-christmas.png` | 크리스마스 | 1082 × 541 |
| `village-spring.png` | 봄 | 634 × 401 |
| `village-summer.png` | 여름 | 634 × 401 |
| `village-autumn.png` | 가을 | 634 × 401 |
| `village-winter.png` | 겨울 | 634 × 401 |

## 촬영 조건

- Google Chrome headless, 기기 배율 1에서 `<visitor-village>` 영역을 PNG로 캡처했습니다.
- 크리스마스는 1200 × 1100, 나머지 계절은 720 × 1000 브라우저 뷰포트를 사용했습니다.
- 방문자는 시연용 24명이며, 최초 렌더링과 이동 후 ‘움직임 멈추기’를 눌러 같은 캐릭터 상태에서 테마만 바꿨습니다.
- 각 화면에서 렌더러 준비 상태, 테마, 방문자 수와 Canvas 접근성 이름을 확인했습니다. 페이지 스크립트 오류는 없었습니다.
- 실제 티스토리 스킨을 촬영한 화면은 아닙니다. 배포 화면이 바뀌면 같은 조건으로 다시 촬영합니다.

나무 원본의 출처와 생성 기록은 [에셋 문서](../../assets/concepts/README.md)에 있습니다. 루트 README의 동작 구조는 GitHub에서 렌더링되는 Mermaid 다이어그램으로 관리합니다.

## 캐릭터 개선 개발 화면

다음 두 이미지는 2026-11-20 KST에 로컬 개발 서버(`http://127.0.0.1:5182/`)에서 촬영했습니다. 공개 배포 화면과 구분하며, 이 버전의 캐릭터는 아직 production에 반영하지 않았습니다.

- [캐릭터 8종과 방향/걷기 확대 시트](characters-v2.png): 1120 × 510px.
- [개선 캐릭터가 표시된 크리스마스 마을](village-characters-v2.png): 1082 × 541px.

확대 시트는 `src/characters.ts`의 실제 RGBA 프레임을 Canvas에 그린 검토용 화면입니다. 마을 화면은 데모의 `<visitor-village>` 영역이며 방문자 24명은 시연용입니다. Google Chrome headless와 기기 배율 1을 사용했고, 이동 후 정지한 상태를 촬영했습니다. 별도 그림 목업이나 외부 스프라이트를 사용하지 않았습니다.
