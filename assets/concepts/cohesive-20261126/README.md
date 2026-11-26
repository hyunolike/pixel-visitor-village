# 공통 픽셀 아트 마감

사용자가 개편 홈페이지에 맞춘 전체 픽셀 아트 통일을 승인했다. 앞선 명시적 Pillow 정밀 마감 허용을 이어 기존 그림의 격자·색상·투명도를 정리했다. 이번에는 새 이미지를 생성하거나 외부 게임 에셋을 가져오지 않았다. 기존 생성 원본은 ../map-20261126 및 ../cozy에 보존되어 있다.

source-manifest.json은 git6bd61c39323d5eddbadf7bcb221f65e0dc8c9096의 실제 런타임11개 입력과 해시를 고정한다. 이 작업의 출력이나 대형 원화를 입력으로 다시 선택하지 않는다. .cache/cohesive-art-inputs는 검증된 임시 입력 캐시다. baseline-native.json은192캐릭터 프레임,4산타/루돌프 프레임,3말풍선,50소품,5기본 지형,5대체 나무와 대체 조형물/빛까지261개 소스의 원본 크기·투명도 기준이다.

src/art-direction.json의 순서 있는 색상 묶음을 Python/TypeScript가 공유한다. 중복은 최초 항목을 남기며 RGB 제곱 거리의 최근접 색, 동률은 앞 색을 쓴다. 세 피부색, 돌/금속, 계절색과 기본 하늘/먼 산/뒤 숲을 구분한다. 직접 작성한 캐릭터·집·소품·손님·말풍선·대체 그림은 소스/아틀라스 생성 때만 마감한다. 포즈·크기·모델·조작을 바꾸지 않으며 반투명 그림자의 알파도 보존한다. 낮은 알파 RGB는 Canvas 반올림이 있어 색상표 소속 검사는 불투명 픽셀에 적용한다.

배경은768×512 nearest 축소, 팔레트/인덱스 모드 필터,1536×1024 nearest 확대, lossless WebP로 저장한다. 하늘은 입력 색상으로 판별해 정리하며 산 능선을 가로줄로 자르지 않는다. 겨울 중앙 눈밭에서 물 색상이 선택되지 않게 하며 가장자리 물가는 유지한다. 구도와 길/랜드마크 좌표는 같다.180px 나무5개와 작은 티스토리 조형물은 threshold128 가시 마스크가 정확히 같고 알파는0/255다.

재현에는 기존 Python/Pillow, cwebp, Node22.12+, FFmpeg와 Chrome/Playwright를 사용한다. 새 패키지는 없다.

```sh
python3 scripts/media/finish-village-art.py prepare
python3 scripts/media/finish-village-art.py finish
python3 scripts/media/finish-village-art.py check
node --experimental-strip-types scripts/media/export-guide.mjs
pnpm build
```

exports.json은 입력/출력/팔레트/제작 스크립트 해시, 색상 수, 마스크와 용량을 기록한다. repeatability.json은11개 출력과 안내 초상화 재실행 해시 및 도구 버전 기록이다. check는 기록의 최신 여부와11개 에셋의 완전성도 검증한다.

개발 서버5199와 production preview5208을 실행한 뒤 다음 명령으로 실제 다섯 계절/기본 임베드/전체 프레임과261개 소스의 투명도·불투명 팔레트 소속을 검증한다. 원본 촬영은 마지막 인수에 baseline을 추가해 새 팔레트 검사를 생략할 수 있다.

```sh
node scripts/media/capture-art.mjs http://127.0.0.1:5208 /tmp/cohesive-art http://127.0.0.1:5199
```

검증 화면은 docs/assets/cohesive-art에 있다. README 썸네일과 소개 영상은 변경하지 않았다.
