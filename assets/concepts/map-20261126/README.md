# 선택한 마을 지도와 실제 에셋

사용자가 공개 비교 페이지에서 선택한1안은 design-reference.png다. 이 파일은 생성 원본을 그대로 보존한 정적 디자인 목표이며 실행 화면이 아니다. 런타임에서는 기존 캐릭터, 나무, 조형물과 집을 계속 별도 레이어로 렌더링한다.

배경은 내장 imagegen으로 생성한5계절 지형이다. 중앙 나무와 집, 사람, UI를 배경에 그리지 않았다. v1의 낮고 단조로운 숲과 분기 없는 길은 시안 대조에서 제외했고, v2에 높이가 다른 숲과 집으로 이어지는 길을 반영했다. 선택된 원본은 landscape-*-v2.png, 런타임은 src/assets/map/landscape-*.webp다. 원본 생성 프롬프트/참고 파일/해시는 landscape-provenance-v2.json 및 활성 landscape-provenance.json에 있다. v1 자료는 제작 이력이다.

런타임 파일은 cwebp -lossless -z6으로 인코딩했다. 모든 파일은1536×1024이며 Pillow로 읽은 디코딩 RGBA 픽셀이 생성 PNG와 같음을 확인했다. 색상/투명도/크기/그림 내용을 편집하지 않았다. 이미지들은 선택된 계절만 지연 로드하며 블로그용 독립 위젯 번들에는 들어가지 않는다.

안내 캐릭터는 scripts/media/export-guide.mjs가 기존 characters.ts의 style2/front/greeting 프레임을4배 nearest-neighbor로 출력한 원본 캐릭터다. 새로운 외부 캐릭터가 아니다.

표준 조작 아이콘은 Pixelarticons2.4.2의 무료 MIT 파일을 외부 SVG 이미지로 사용한다. 출처 https://pixelarticons.com/docs/ 및 https://github.com/halfmage/pixelarticons . 원본 파일과 LICENSE는 src/assets/map/icons에 둔다. 직접 그린/인라인 SVG로 대체하지 않았다. 프로젝트의 기존 Neo둥근모와 Pretendard 자체 제공 글꼴은 그대로 사용한다.

표준 아이콘의 경로는 원본 그대로이며 fill만 서비스 잉크색#173c2c로 고정했다. 일시정지 상태에서는 밝게 반전해 대비를 확보한다. MIT 전문은 공개 배포의 licenses/pixelarticons.txt에도 포함한다.
