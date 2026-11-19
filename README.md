# Pixel Visitor Village

티스토리의 오늘 방문자 수만큼 귀여운 픽셀 캐릭터가 생성되어 스스로 돌아다니는 웹 위젯.

첫 사용 흐름은 블로그에 위젯을 넣고 페이지를 열면, 오늘 방문자 수에 맞춰 캐릭터들이 움직이는 모습을 보는 것이다.

## 현재 상태

저장소와 기획 문서를 준비한 단계다. 실행 가능한 위젯, 개발 서버와 배포 주소는 아직 없다.

- 요구사항 초안: [spec.md](docs/features/visitor-village/spec.md)
- 구조와 기술 제안: [design.md](docs/features/visitor-village/design.md)
- 진행 상태와 다음 작업: [tasks.md](docs/features/visitor-village/tasks.md)
- AI 개발 지침: [AGENTS.md](AGENTS.md)

## 제안한 개발 방향

iframe 없이 Web Components로 설치하고, 내부 Canvas에 PixiJS로 픽셀 캐릭터를 그린다. 이 기술 조합은 조사에 따른 제안이며 설계 승인은 아직 받지 않았다.

캐릭터가 활동할 위치, 그림 스타일과 방문자가 많을 때의 표시 방법을 정한 뒤 구현한다. 기존 게임 캐릭터를 기본 에셋으로 사용하지 않는다.

## 로컬 작업

```bash
cd /Volumes/T9/Projects/pixel-visitor-village
git status
```

패키지 설치, 개발 서버와 테스트 명령은 도구 구성을 확정한 뒤 추가한다.

## 설치 형태 구상

다음은 목표 사용법을 설명하는 예시다. 현재 동작하는 코드가 아니다.

```html
<script type="module" src="위젯주소/visitor-village.js"></script>
<visitor-village count="[##_count_today_##]"></visitor-village>
```

치환자는 티스토리 스킨에서 처리한다. 외부 JavaScript 파일 안에 치환자를 넣는 방식은 사용하지 않는다.

## 공개와 배포

저장소는 비공개로 시작한다. 위젯 호스팅, 블로그 스킨 수정과 공개 배포는 별도 작업이다. 라이선스는 아직 선택하지 않았다.
