# Cozy Village Asset Rebuild Implementation Plan

> For agentic workers: use superpowers:executing-plans for native implementation in this session. 실제 자산 제작은 imagegen과 기존 원본 편집을 사용한다. 사용자 첨부 이미지를 선택된 디자인으로 실행하며 같은 방향의 재승인을 요구하지 않는다. 이 문서를 작업 원장으로 사용한다.

**Goal:** 평가에서 드러난 그림체/모바일/홍보물 불일치를 해결하고 첨부 이미지의 따뜻한 마을로 전체 에셋을 정리한다.
**Architecture:** 기존 TypeScript/Canvas 원화/PixiJS/Web Component를 유지한다.5계절 나무와 빨간 티스토리 조형물은 실제 투명 PNG,캐릭터와 소품은 편집 가능한 픽셀 원본을 직접 수정한다. 랜드마크 로더는 각 실패를 새 스타일의 대체 그림으로 복구한다. 모델/설치 코드/4개 언어/공개 모듈 계약을 보존한다.
**Tech Stack:** 기존 TypeScript,Canvas,PixiJS,Vite,Vitest,Playwright. 내장 image_gen으로 래스터 제작. 기존 HyperFrames/FFmpeg 작업물을 확인해 영상 갱신. 새 런타임 의존성 없음.
**Spec:** spec.md VV-COZY-001~006와 design.md 첨부 콘셉트 계약. 원본 docs/assets/cozy-village-reference.jpg.

## Global Constraints

- 현재 feat/visitor-notice linked worktree,현재 기준2a237d4. 직전 감사 문서/캡처를 보존한다. 새 커밋/푸시/배포는 이번 로컬 수정의 자동 단계가 아니다.
- 실제 오늘 방문자 수와0~5000명,기본 Christmas,캐릭터8종/3방향/8프레임,24명 시연,420px 설치 코드와 origin/치환자 계약을 유지한다.
- 원본의 제목/둥근 흰 프레임은 포스터 구성이고 게임 에셋 규칙과 구분한다. 제목을 위젯 안에 크게 굽지 않는다. 중앙 티스토리 장식은 실제 개별 방문자나 현재 접속자를 의미하지 않는다.
- 생성한 나무/장식은 원본 투명 파일을 assets/concepts/cozy/에,180px 실행 파일을 src/assets/cozy/에 보관하고 프롬프트/출처를 기록한다. 정적인 배경에 방문자 그림을 굽지 않는다.
- 이미지 생성 자산이 실패해도 숫자/계절/다국어/폼이 동작한다. 새 로더는 완료된 Canvas만 공유하고 실패 Promise를 영구 캐시하지 않는다. 이미 파괴된 인스턴스는 생성 완료 후 부착하지 않는다.

## Task 1: 새 랜드마크와 자산 로딩

**Files:** src/assets/cozy/*,src/village-art.ts,src/art.ts,src/renderer.ts,src/model.test.ts,tests/widget.spec.ts,assets/concepts/README.md.
**Interfaces:** `loadVillageArt():Promise<{trees:Partial<Record<Season,HTMLCanvasElement>>;monument?:HTMLCanvasElement;failed:string[]}>`; `seasonalTree(season)`는 새 스타일180×180 대체 원화; renderer가 로드 결과로5계절 Texture를 만든다. 조형물은 깊이 정렬되는 별도 Sprite이며 tree의 뒤/앞 관계와 발 기준선을 갖는다.

- [x]5개 나무/단독 티스토리 조형물의 투명 PNG를 첨부에 맞춰 제작/검수한다. 굵은 도트/단순 명암/크림/진녹색,과일/꽃/단풍/눈/크리스마스만 변형한다.
- [x] 누락/실패 자산 복구,5계절 실제 그림 교체,독립 번들의 외부 삽입에 대한 의미 있는 브라우저 검사를 먼저 실패 확인한다.
- [x] 공유 로더/새 스타일 대체 나무와 renderer를 연결한다. 각 PNG를180px 논리 캔버스에 nearest로 그려 실제 유효 픽셀 크기를 확인한다. 정상적인 자산 처리를 이미지 생성 원본의 수동 재페인팅으로 대신하지 않는다.
- [x] focused 검사와 타입/빌드 통과,에셋/독립 모듈 크기 확인. 이미지 압축/생성 품질에 따라 필요한 조정은 기록한다.

## Task 2: 전체 픽셀 원본과 화면 비율

**Files:** src/characters.ts,src/environment.ts,src/environment-layout.ts,src/themes.ts,src/holiday-art.ts,src/social-art.ts,src/renderer.ts,src/characters.test.ts,src/environment-layout.test.ts,tests/widget.spec.ts.
**Interfaces:** 기존 RGBA buffer 함수와20×28/32×36/18×14 크기,layout의 kind/좌표 반환 계약은 유지한다. `getTreeLayout`의 동작은 기존 모델 검사와 충돌 경계를 보존하면서 장식 위치만 별도 레이아웃으로 계산한다.

- [x] 새 독립 조형물의 작은 화면 경계/깊이와 실제 카운트 보존 검사를 실패 확인한다. 기존 의미 있는 인물/배치 회귀 검사는 유지한다.
- [x]8의상 실루엣/피부/크림색 상의/진한 바지/외곽,7종 소품의 지붕/창/꽃/테라코타와 덤불,따뜻한 녹색 바닥/숲/구름을 전면 편집한다.
- [x]5계절 배경을 같은 카메라/조명으로 연결하고 산타/루돌프/말풍선/입자/발광을 같은 팔레트로 정돈한다. 과도한 점무늬 대신 큰 묶음/빈 공간을 사용한다.
- [x]320/375px에서 나무/조형물/집/캐릭터의 비율과 밀집을 실제 캡처로 조정한다. 카운트를 줄이지 않는다.
- [x]192프레임/5계절/소품 시트와 실제 데스크톱/모바일을 확인하고 단위/브라우저 focused 검사 통과.

## Task 3: 홍보물/최종 검증과 전달

**Files:** public/media/intro.mp4,public/media/intro-poster.jpg,docs/assets/intro-preview.gif,docs/features/visitor-village/intro-media.md,docs/assets/cozy-*,design-qa.md,reviews/cozy-village-2026-11-25.md.

- [x]기존 영상의 음악/효과음과 크레딧을 보존하면서 현재 원화/조형물과 Pages 주소로20초 소개/포스터/GIF를 갱신한다. 기존 작업물은 덮어쓰지 않고 별도 ignored 작업 폴더를 쓴다.
- [x] pnpm test/typecheck/build와 전체 test:e2e,영상 메타데이터/브라우저 재생 검사.
- [x]원본 첨부와 여름 마을의 같은 화면 영역을 함께 배치해 전체/상세 비교하고,5계절과320/375px도 확인한다. 원본 포스터와 동적 위젯의 의도적 차이를 기록한다.
- [x] fresh-context 전체 코드 검토1회와 중요 문제1회 수정,전체 green 재검증. 실제 실행한 결과만 기록한다.
- [x]design-qa.md passed와 로컬 미리보기/실제 캡처를 전달한다.

## Review Focus

- PNG 로드 실패/재시도/동시 위젯/삭제 중 완료에 자원 누수/미부착 문제 없음.
- 조형물과 tree의 깊이/앵커가 모바일에서 인물이나 카운트를 숨기지 않음.
- 모델 수와5계절/언어 변경/일시정지/모션 줄이기 의미 유지.
- 독립 모듈이 assets URL/CORS/외부 상대경로에 의존하지 않고 삽입 가능.
- 영상/포스터/GIF가 새 그림과 공개 Pages 주소를 쓰며 기존 음원 크레딧 보존.

## 실행 원장

- Ruling: 첨부 이미지와 전면 수정 요청을 이번 아트 디렉션/실행 승인으로 사용한다. 재선택과 중복 승인 질문을 하지 않는다. 실제 제품 코드 편집은 이 계약에 한정한다.
- Ruling: 원본이 있는 캐릭터/소품은 직접 편집하고 새 랜드마크는 imagegen 래스터로 제작한다. 모든192프레임을 생성 모델에 맡기는 대신 기존 걷기/표정 정합성을 유지한다.
- Pre-flight: Task1 loadVillageArt/Texture → Task2 renderer/layout → Task3 실제 영상/캡처. 초기화 완료 전 새 원화를 쓰지 않으며 영상도 같은 loader를 기다린다.

- 구현 준비: /root/cozy_readiness가 fresh-context로 확인해 중요한 미정 사항 없음.
- Task1/2: generated6 masters 보존 +180px Canvas export,새 loader/5계절 Texture/조형물/compact16×22 인물/팔레트·환경·효과 연결. 입력/설치 UI 계약 유지.
- 실제 이미지 생성은 두 자산 담당자가 나무5종을,본 담당자가 조형물1종을 제작했다. 산출물/프롬프트는 /private/tmp/cozy-tree-*.json과 source assets에 보존하며 최종 출처 문서로 합친다.
- RED→GREEN: 조형물 경계6개/1000명 충돌7검사,조형물 비율1검사. 단위136/136 통과.
- 브라우저 RED: 실패 경고가 정상 계절에도 남음,공유 Texture 파괴로 다른 위젯의 alphaMode null 오류. 현재 계절별 경고 getter/각 인스턴스 전용 Canvas Texture로 수정. onload Canvas 실패도 Promise reject로 복구.
- 공유 원화 테스트의 CSS 캡처가421px/420px로 달라진 오탐을 네이티브 Canvas buffer 비교로 바꿨다. 단순히 오류 검사를 약화하지 않고 같은 렌더 결과를 비교한다.
- Task1/2 GREEN: 타입/앱/모듈 빌드와 전체 Chrome75/75. 최종6 PNG 합계 약208KB,모듈1.415MB/gzip496KB로 기존과 거의 같다. 초안의7.385MB 모듈은 배포용이 아니다.
- Ruling: 참고 이미지 대비 조형물이 작아 높이를 마을 높이의.50/최대너비.35로 키우고 받침대의 normalized 장애물도 .34<x<.53,.76<y<.84로 맞췄다. 나무 원래 기준점/모델경계는 유지했다.
- Task3 진행: 새 ignored HyperFrames 프로젝트 brag-output/cozy-village-20261125. 기존 intro-refresh 작업물은 수정하지 않는다. 현재 RGBA/환경/나무/조형물과 동일 loader를 번들한 Canvas2D 영상,기존 MP4 오디오 그대로 재사용,현재 Pages 주소 표시. source video와 실제 Pixi 위젯의 렌더 방식은 구분한다.

- 미디어 병행 작업 메모(소개 영상 요청): [intro-refresh-plan.md](intro-refresh-plan.md)에서 현재 production PixiJS Web Component와 실제 설치 작업실을 프레임 캡처한20초 영상,포스터/GIF와 로고 구조도를 만들고 있다. 편집 자료는 brag-output/intro-refresh에 있고,현재 public/media 파일을 최종 갱신하기 전이다. 최종 media의 출처/해시는 intro-media.md의 새 제작 기록을 기준으로 한다. 다른 편집 폴더는 건드리지 않는다.

- Ruling: 공유 작업 공간의 intro-refresh 작업에서 실제 최신 PixiJS와 설치 화면을 사용한 갱신 MP4/포스터/GIF가 완성됐다. 현재 모듈 SHA1c51ff...와 촬영 문서의 SHA가 같으며 새 원화/조형물을 포함함을 직접 확인했다. 해당 변경/README/구조도를 보존하며 본 작업의 Canvas2D 영상 초안은 채택하지 않는다. 초안은 ignored폴더에 남기고 미리보기를 닫는다. 최종 검증은 public/media의 실제 Pixi 영상으로 한다. 기존 source 및 다른 작업 산출물을 덮어쓰지 않는다.


## 최종 검증 (2026-11-25)

- 최종 독립 검토 cozy_final_review: 치명0,중요1(모바일 인물 가장자리 잘림),경미2(실패 이벤트 종류/번역,조형물 원본 크기 기록). 구현 준비와 최종 검토를 실제 수행했으며 전체 EGM 단계 완료로 확장하지 않는다.
- 한 번의 수정 단계: getVisitorSpriteLayout로 전체 프레임 경계를 보정하고 말풍선도 동일 기준점 사용. monument/tree 진단 분리 및 선택 언어로 오류 전달,원본1254×1254로 기록 정정. 신규8단위와실제5000명 브라우저 경계 검사가 수정 전 실패하고 수정 후 통과했다.
- 최종 pnpm test144/144,pnpm build(타입+앱+독립모듈),focused4/4,전체 Chrome76/76과 git diff --check 통과. 브라우저결과 /private/tmp/pvv-cozy-final-green. source 모듈SHA-25625226667af0c764d7390bd245c91666abf98a827d446600ddca10d1090c49184.
-6 PNG208,003bytes,독립모듈1,415,261bytes(빌드 표기1,415.26kB),gzip496.51kB. 원본6개/프롬프트와 실행 파일 해시를보존했다.
-5계절/캐릭터192프레임/소품35변형/게스트4프레임/말풍선3개와1487px/320px/375px 실제 화면 검수. 전체/상세 비교 후 design-qa.md passed,QA자료 docs/assets/cozy-village/. 캡처pageerror0.
- 병행 제작한 실제 PixiJS 소개 MP4/포스터/GIF를 보존해 검증했다. 촬영 모듈SHA는 당시 기록이며 이후 좌표/진단 수정된 현재 모듈과 바이트 일치를 주장하지 않는다. 별도 Canvas2D 초안은 전달용으로 채택하지 않았다.
- 현재 작업은 로컬 구현/미리보기 완료이며 새 커밋/푸시/공개 배포와 실제 티스토리 스킨 검증은 수행하지 않았다. [최종 기록](reviews/cozy-village-2026-11-25.md).


후속 소개 미디어 동기화: 마지막 좌표/진단 수정 모듈25226667…로 실제 PixiJS 캡처/최종 MP4를 다시 만들었다. 현재 MP4는3,817,264bytes, SHA-256 b7b02ae192a63cb8b78a8dcec8a405ffc0ff838917ad77e39f3d2da1968124c4다. 이전 문단의 미디어 측정은 중간본의 검증 이력이며, 현재 파일과 최종 검사76/76은 [소개 갱신 기록](reviews/intro-refresh-2026-11-25.md)을 따른다.


## 후속 요청: 우물처럼 작은 조형물

사용자가 큰 티스토리 로고를 우물처럼 작게 요청해 이전 확대 결정을 대체했다. min(w×.16,h×.22),기존 선형 크기의약44~46%,나무 크기의약30%로 축소한다. 받침 충돌 영역도 .39<x<.48,.80<y<.84로 줄이고 빈 공간에 정상 생성되도록 한다. 원본 PNG와 좌표 기준점은 유지한다. 별도 전체 EGM이나 새 원화 제작은 필요하지 않은 범위 조정으로 기존 명세/설계/검사를 갱신했다. 이전 큰 조형물 화면은 docs/assets/cozy-village/scene-summer-large-monument.png로 보존했다. 기존 소개 영상은 축소 이전 촬영 이력이며 이번 화면 비율 수정에서 재렌더하지 않았다.

후속 최종 검증:단위146/146,타입/빌드,전체Chrome76/76과실제크기/상세/320·375px 캡처 확인,pageerror0. 현재 모듈SHA-256:7ef073a323e7c3da1e50e89c255c9ffa76018e24546feedc7c9ed1257de3a662. 신규 커밋/푸시/공개 배포 없음.
