# Product refinement QA (2026-11-26)

Final result: passed. Implementation, art/media, build, full browser acceptance and independent review complete.

The selected pixel village is retained. Mobile installation now appears in the first viewport, optional blog-address input serves only the admin shortcut, secondary copy names the actual task, season controls have one owner and Christmas-only options stay contextual. Header geometry remains77px desktop/65px compact across home, installer and guide.

Actual comparison: [390px before/after](docs/assets/refinement/before-after.png), [desktop home](docs/assets/refinement/home-desktop.png), [mobile installer](docs/assets/refinement/install-mobile.png), [generated code](docs/assets/refinement/code-mobile.png), [guide](docs/assets/refinement/docs-mobile.png). Production preview5208 captures use DPR1 at1440×1024,390×844 and320×850. All9 main captures have no page/console errors or horizontal overflow; compact translated menus remain anchored. Demo input is synthetic, not visitor identity or concurrent presence.

Six artwork files retain their180px grid and thresholded silhouettes while using binary alpha and bounded palettes:16–27 colors for trees,11 for the monument. Their combined bytes fall88.6%. [Art inspection](docs/assets/refinement/art-seasons.png) and [actual five-season world crops](docs/assets/refinement/scene-seasons.png) were opened; full-page geometry is judged from the separate page captures. The small monument and real character family remain.

The20-second intro now shows the current installer, tree brand and service fonts. [Scene sheet](docs/assets/refinement/video-contact.png), [actual metadata/hashes](docs/features/visitor-village/reviews/refinement-media.json) and the [full review](docs/features/visitor-village/reviews/refinement-2026-11-26.md) distinguish Codex adaptation from historical Claude Code execution. Eight final decoded samples were inspected. The17s forest transition covers one frame, intentionally within the0.10s allowance; no0.1s black segment was detected. The README top thumbnail is unchanged. The earlier media/hash preservation statements below describe earlier iterations only.

Unit151/151, release14/14, formatting, asset validation and type/app/widget build pass. Final production Chrome90/90 passed in55.4s. Independent whole-branch review found no material defects. No commit/push/PR/deployment or real Tistory skin validation is claimed.

---

# Shared header correction QA (2026-11-26)

final result: passed

The user's screenshot exposed a remaining layout inconsistency in the previous iteration. Its acceptance of different mobile row counts and heights below is superseded. Home, installer and guide now share brand/navigation/toggle slots, layout styles and the same progressive menu controller. Installer language selection remains accessible in its settings panel. The static guide keeps visible links when JavaScript is disabled.

Actual comparison inputs: [desktop headers](docs/assets/shared-header/desktop.png), [390px pages](docs/assets/shared-header/mobile.png), [390px menus open](docs/assets/shared-header/mobile-menu.png). Each combined input was opened and inspected. All Korean headers have identical geometry at320/390/700/701/1440px; active-page state is the intentional difference. Eight viewport widths ×four installer locales also pass non-overlap, width and header-height checks. Headers are65px compact or77px desktop including their divider. The translated701px wrap discovered during review was reproduced before shortening the navigation labels and protecting the brand gutter.

Verification and independent source review: [record](docs/features/visitor-village/reviews/header-consistency-2026-11-26.md). Unit151/151, release14/14, type/app/widget build and final full Chrome87/87 pass. No asset or product-logic changes. The user requested this verified correction be committed, pushed and submitted as a PR; no public deployment is claimed in this step.

---

# Unified village pages QA (2026-11-26, historical PR #14)

final result: passed

**Visual truth:** the selected Living Village Square concept and the deployed homepage before this task, captured at /private/tmp/pvv-unify-qa/before/home-desktop.png and home-full.png. This iteration extends that visual language to installation and documentation; their content layouts remain task-specific. Source/implementation CSS viewports1440×1024,390×844 and320×850, deviceScaleFactor1; source and actual pixels match those dimensions with no resampling.

**Comparison evidence:** [three common headers](docs/assets/unified-pages/headers.png), [guide before/after](docs/assets/unified-pages/docs-before-after.png), [paper and typography](docs/assets/unified-pages/paper-and-type.png), [installer](docs/assets/unified-pages/install-desktop.png), [guide](docs/assets/unified-pages/docs-desktop.png), [compact installer](docs/assets/unified-pages/install-small.png), [compact guide](docs/assets/unified-pages/docs-small.png), [English menu open](docs/assets/unified-pages/install-en-menu.png). Full before/after images were composited into one2880×1024 input and opened; header and body crops were opened as combined comparison inputs. State: homepage summer12, installer Christmas24/paused, guide at top. Demo numbers and page task differ intentionally.

**Comparison history and fixes:**

- Initial P1: selected installer navigation used cream text on gold, measured1.17:1 contrast. Scoped the active action color to dark ink; shared regression now requires at least4.5:1.
- Initial P2: English compact brand inherited a taller line height, making the header89px. Restored compact1.25 line-height; latest English header77px, other installer locales65px, within the80px constraint.
- Independent review P1: removing duplicated header CSS lost the mobile menu's positioning context and stacking. Restored position:relative/z-index12 on the common header. A new assertion first reproduced a715px placement error; final four-locale checks pass with menu top within1px of the header bottom, scrollY0 and menu inside the viewport. Recaptured open menus show the fix.
- Removed obsolete white outer document frame and separate CSS brand drawing. All service headers now use the same actual tree PNG, forest surface and gold action. Moved repeated homepage paper colors into the shared design token block.

No actionable P0/P1/P2 visual findings remain. No unresolved product questions.

**Required fidelity surfaces:**

- Fonts: existing locally hosted NeoDunggeunmo display/brand and Pretendard UI remain; guide/installer heading48px desktop32px compact, body16px and guide line height1.8. JA/CN retain their existing locale stacks. Korean words, long English copy and code keep readable wrapping/overflow.
- Layout: full-width forest introduction, consistent header gutters and angular actions, cream work/reading surface. Installer retains narrow desktop controls/large preview and mobile preview-before-settings with a fixed create action. Guide retains sticky desktop contents and wrapped compact anchors; tables/code scroll locally. Different mobile header row counts support optional language/menu controls, rather than imposing a nonfunctional identical layout.
- Colors: forest#123b3e, gold#f6c55d, paper#fff8e7, ink#193c32, input boundary#697a5e. Tokens and shared chrome own the palette. Selected/error/focus and disabled states remain distinct; text/action and field-boundary contrast regressions pass.
- Imagery: real source summer-tree brand/favicon, source five-season thumbnails and unchanged production village. No placeholder imagery, inline SVG, CSS artwork or emoji substitutions. Supplied original README thumbnail and introduction video hashes remain unchanged.
- Copy: existing labels and four installer translations are preserved; guide explains synthetic demos without stale fixed counts, and release copy reflects the checked repository workflow. All original guide section IDs remain.

**Verification:** unit151/151, release tooling14/14, type/app/widget build and full Chrome85/85 pass. The first attempted full browser run collided with another runner's artifact folder; it is not counted as passing. Final85-test run was sequential and passed in1.6minutes. Includes no-JS320px guide, four-locale menu/focus/installation, canvas interactions, touch scrolling and local overflow. Nine main captures have pageerror0/console error0 and viewport-width scrollWidth. Extra700/701/820/1024px boundary checks show no overflow; all compact locale menus stay beneath the header without scroll. Source-only final review re-audited the fix and found no remaining Critical/Important issues.

**Superseded acceptance:** optional language/menu controls previously created header-height and row-count differences. The user rejected this inconsistency; the header correction above replaces that acceptance. The record below describes the historical PR #14 iteration, which was later merged and deployed. No real Tistory validation is claimed.

---

# Living Village Square — interactive homepage QA (2026-11-26)

final result: passed

**Visual truth:** /Users/hyuno/.codex/generated_images/01a20dd3-dda2-7ad3-9bc3-4e9e31b44af9/exec-58851b0c-d838-44e5-86cd-7d194ba78f52.png, the first displayed option selected by the user. Source pixels1487×1058. Local Chrome at http://127.0.0.1:5199/, CSS viewport1487×1058, deviceScaleFactor1, screenshot1487×1058; no density resampling. Additional1440×1024,390×844 and320×850 views use density1. Native source size is used rather than stretching the image to the initially requested1440px.

**Comparison evidence:** [full side-by-side](docs/assets/interactive-home/comparison.png), [typography](docs/assets/interactive-home/type-comparison.png), [dock](docs/assets/interactive-home/dock-comparison.png), [actual desktop](docs/assets/interactive-home/desktop.png), [390px](/private/tmp/pvv-interactive-qa/mobile.png), [320px](docs/assets/interactive-home/small.png). The full source and implementation were composited into one2974×1058 input and opened together; focused crops were also composited and opened. State: summer,12 synthetic visitors, explicit greeting, paused to permit a stable comparison. The implementation greets an actual existing visitor; generated visitor placement/count illustrations are not authoritative.

**Findings and fixes:**

- Initial P1: numeric range overflowed small screens by84px because the shared range input used flex:0 0 auto with width:100%. Added a shrinking flex basis within visitor-inputs. Recaptured390px and320px now have scrollWidth equal to viewport width.
- Initial P2:48px display was too small beside the selected concept; increased desktop heading to64px, preserving actual NeoDunggeunmo and using32px mobile. Reopened focused type comparison.
- P2: moving clouds crossed the description, and feedback covered the repository badge. Gave the description an opaque sky surface and raised feedback above the badge. Latest native capture shows readable copy and independent link.
- P2: pressed pause inherited pale dark-theme colors on cream. Scoped the pressed state to the dock; checked current dark forest/cream state. Matched control height48px after increasing desktop UI type to16px.
- P2: advanced input border initially failed3:1 non-text contrast. Changed the local border token to#697a5e; the existing contrast test now passes in the focused checks.

No actionable P0/P1/P2 visual issues remain after recapture. No unresolved product questions.

**Required fidelity surfaces:**

- Fonts: real self-hosted NeoDunggeunmo display/brand and Pretendard UI;64px desktop heading,48px tablet,32px mobile. Controls remain14–16px, normal Korean word wrapping, readable descriptions and12px supplemental demo note. The generated glyph shapes are approximations; actual licensed fonts take precedence.
- Layout: full-width scene begins under the compact header; desktop stage and dock fill the first viewport. Mobile uses normal flow and puts direct actions before wrapped seasons. No outer article frame or nested card grid. Original widget scene coordinates and actual sprites are retained rather than redrawing generative scenery.
- Color: forest/cream/gold semantic tokens, high-contrast primary action, distinct season selection and keyboard focus. Flat sky intentionally replaces the generated mock's gradient; square borders follow the existing user constraint.
- Imagery: source PNG trees and monument, production cottages/people/heart art and Pixi nearest-neighbor rendering. No replacement inline SVG, div art, emoji, stock placeholders or screenshot-as-interface. The tiny monument stays under roughly a third of the canopy; actual art has precedence over generative variations in cottage sizes, fences and foliage. README thumbnail/video files are unchanged.
- Copy: concise product-led headline, synthetic-demo label and actual cumulative-visit explanation. The keyboard greeting is a deliberate accessible addition to the mock; the pause control uses words. No live-online claim, identity data or new accounts.

**Interaction evidence:** actual canvas sprite pixels change after pointer/key greetings, with HTML feedback hidden only during pixel assertions. Invite adds exactly one existing-model visitor at the path, not a decorative overlay. All seasons change the renderer; validated selection reaches installer preview/code and survives locale changes. Test cases cover paused/reduced feedback, zero/5000 limits, blank ground, opt-out, count removal, season changes and reconnect. Existing browser tests cover touch scrolling, legacy embedded links, offscreen sleep, media fallback and four installer languages. Full-suite results are recorded in the feature review after execution.

**Console:** four captured viewports, pageerror0, console error0 and no horizontal overflow; /private/tmp/pvv-interactive-qa/result.json. Browser screenshots were opened, not inferred from build status. The local preview stays running. No public deployment or real Tistory skin verification is claimed.

**Implementation checklist:** selected visual mapped; supplied source art placed; real interactions connected; desktop/mobile captured; full/focused comparisons repeated; P0/P1/P2 fixes recaptured. Residual P3: the generated mock depicts denser illustrative scenery; the implementation deliberately retains source sprites and the exact requested model count.

---

# Claude Code brag 영상과 간결한 README 검증

final result: passed

Claude Code의 실제 brag 실행으로 새20초 영상을 제작했다. [장면표](docs/assets/brag-remake/video-contact-sheet.png),[375px README](docs/assets/brag-remake/readme-ko-375.png),[데스크톱 README](docs/assets/brag-remake/readme-ko-1280.png)와네언어화면을확인했다. 기존상단썸네일과이미지CTA는그대로다.

조판은짧은장면별카피와읽을수있는홀드로,배치는넓은마을/인사근접/설치분할/마무리6장면으로구성했다. 청록/크림색과실제픽셀원화를사용하고작은티스토리장식비율을유지한다. 긴하단문구를줄이고시연표시를훅과끝으로모았다. 네README는44줄로정리하고상세설정/API/설치정보는참고문서에보존했다. 로컬Markdown근사렌더링이며GitHub실제레이아웃검증은아니다.

단위146/타입/빌드/Chrome79,20초/600프레임/전체디코드와포스터frame0확인,네언어링크보존검사통과. 독립검토에서실질적문제가없었다. [검증기록](docs/features/visitor-village/reviews/brag-remake-2026-11-25.md)을따른다. PR #10을생성하고소스f05d3f6를production2e1378ac에반영했다. 공개7범주/34파일해시/pageerror0을확인했다. PR은미병합이다. 아래는이전단계의이력이다.

---

# 이미지 버튼과 최신 마을 미디어 검증

final result: passed

2026-11-25 후속 전체 갱신.4개 README에 현재 픽셀 원화를 사용한 이미지 버튼을 반영했다. 상단 소개 썸네일은 후속 사용자 요청으로 기존 원본을 유지한다. 버튼4개는 `/#demo`의 실제 마을로 이동한다. [모바일 버튼](docs/assets/entry/buttons-mobile.png),[공개 홈](docs/assets/entry/public-home-desktop.png),[공개 모바일](docs/assets/entry/public-home-mobile.png),[영상 장면표](docs/assets/entry/video-contact-sheet.jpg)를 열어 확인했다.

글꼴은 버튼의 주요 레이블56px/표시327px에서약18.3px이며 네 언어가 잘리지 않는다. 배치는 기존 홈/설치 구조와 모바일 흐름을 유지한다. 색은 청록/크림/따뜻한 녹색을 연결하고 화살표/문구로 실제 체험 행동을 표시한다. 에셋은 실제 작은 조형물의 위젯 캡처와 별도 생성 소개 일러스트를 구분한다. 카피와 시연24명/오늘 집계/4개 언어의 의미도 유지했다. 작은 보조 문구는 필수 정보를 담당하지 않으며 큰 제목과 이미지 대체 텍스트로 행동을 전달한다.

단위146/146,타입/빌드,Chrome79/79과HyperFrames 오류0/경고0. 독립 검토의EN/JA/ZH 구형 배포 문구1건을 수정했다. production0f6d4807에 반영하고34개 파일SHA/공개7범주/외부37명/pageerror0을 확인했다. 후속 사용자 요청으로 README4개를소스c76257b에커밋해PR #9를생성했다. production18cb4021에동일묶음을반영하고공개7범주/34파일SHA/pageerror0을다시확인했다. 기존상단썸네일은유지하며PR은미병합이다. [최종 검증](docs/features/visitor-village/reviews/entry-media-2026-11-25.md)을 따른다.

아래는 이전 개편 단계의 검증 이력이다. 현재 상태는 위 후속 기록과 배포 문서를 우선한다.

---

# 첨부 콘셉트 기반 픽셀 마을 시각 검증

final result: passed


후속 크기 수정: 사용자 요청으로 티스토리 조형물을 이전의약44~46%로 줄였다. 현재 나무 크기의약30%인 작은 우물 비율이며 초기 확대 결정에 우선한다. 현재 링크의 데스크톱/모바일/5계절과 전체/상세 비교 이미지를 다시 캡처했다. 여름/크리스마스/320·375px/상세 화면을 직접 열어 나무의 줄기와 수관이 드러나는지 확인했다. 이전 큰 조형물은 [이력](docs/assets/cozy-village/scene-summer-large-monument.png)으로 보존한다. 아래 최초 개편 당시144개 검증과 확대 설명은 이전 단계의 이력이다. 이 단계에서는 소개 영상을 축소 이전 촬영본으로 유지했고,후속 전체 갱신에서 아래 최신 미디어로 교체한다. 후속 최종 검사:단위146/146,타입/빌드,전체Chrome76/76 통과,pageerror0. 결과 /private/tmp/pvv-well-size-green.

2026-11-25 사용자 첨부 [원본](docs/assets/cozy-village-reference.jpg)을 선택된 아트 디렉션으로 적용했다. 실제 production 위젯은 http://127.0.0.1:5201/install.html?lang=ko 에 있다. 기본은Christmas,비교 캡처는여름/시연24명/일시정지다. 새 에셋은 로컬 반영 상태이며 이번 변경의 공개 배포는 수행하지 않았다.

## 비교 입력과 수정

[전체 비교](docs/assets/cozy-village/comparison.png)를 열어 원본1179×610px 포스터와 실제935×476px 위젯을1179px 표시 폭으로 비교했다. [상세 비교](docs/assets/cozy-village/focus-landmarks.png)는 원본x390,y165와 구현x270,y70의430×390px 영역을 원래 픽셀로 함께 표시해 확인했다. 이는 서로 다른 포스터/동적 마을 카메라의 아트 방향 비교이며 동일 레이아웃의 픽셀 단위 복제 검사가 아니다.

첫 구현에서 티스토리 조형물이 작아 마을 높이의.50/최대너비.35로 확대했다. 모바일은20×28 인물이 밀집해16×22 전용 아틀라스를 쓴다. 최종 독립 검토가 지적한 가장자리 인물 잘림은 실제 프레임 반폭/높이로 좌표를 보정해 수정했다. 말풍선도 같은 보정점을 따른다. 수정 뒤 전체/상세/5계절/320·375px를 다시 캡처하고 열어 확인했다.

## 필수 다섯 영역 평가

| 영역 | 실제 비교와 판단 |
| --- | --- |
| 글꼴과 조판 | 기존 작업실의48/24/16/14px 위계를 유지한다. 첨부 포스터의 큰 한글 제목/영문 부제는 제품 그림에 굽지 않는다. 현재4개 언어의 설치/경고/접근성 문구를 유지하고320px 메뉴와 행동에 잘림이 없다. |
| 배치와 간격 | 중앙의 큰 나무와 앞쪽 조형물,좌우 집/가게,모래 광장,벤치와 전경 울타리로 구도를 연결했다. 실제 시연은24명이 움직이는 공간이므로 원본의5명 정렬/착석 장면은 그대로 복제하지 않았다. 320/375px에서는 장면이 좁아지고 인물끼리 겹칠 수 있으나 모든 인원을 생성하며 잘리지 않는다. |
| 색과 토큰 | 여름 sky#103b3d,ground#6b9257,cream#f3dfaf,roof#bd6641와 청록 외곽/따뜻한 목재를 공통 규칙으로 사용했다. 봄/단풍/눈/크리스마스도 같은 집과 인물 팔레트에 연결했다. 기존 UI 대비 검사도 통과했으며 그림의 모든 픽셀 대비에 접근성 인증을 주장하지 않는다. |
| 이미지와 에셋 |5계절 나무+조형물6개 실제 PNG,캐릭터192프레임,소품35개 변형,산타/루돌프4프레임과 말풍선3개를 확인했다. 생성 원본1254×1254는180×180 nearest 실행 파일로 변환했다. 굵은 묶음/밝은 윗왼쪽/진한 윤곽으로 맞췄지만 생성 PNG의 미세한 저알파/색 변화가 있어 엄격한 단일 격자 수작업 원화와 동일하다고 설명하지 않는다. |
| 카피와 내용 | 오늘 방문자 수/시연24명/0~5000명/기본Christmas를 유지한다. 빨간 원의5개 크림점은3+1+1이며 별도 장식이다. 현재 동시 접속자나 개별 사람의 신원을 의미하지 않는다.4개 언어 오류와 폼/코드 생성 동작이 유지된다. |

## 실제 화면과 검사

- [데스크톱1487×1058](docs/assets/cozy-village/desktop.png), [320×780](docs/assets/cozy-village/mobile-page-320.png), [375×780](docs/assets/cozy-village/mobile-page-375.png): Chrome headless/DPR1 실제 캡처. [5계절과 시트](docs/assets/cozy-village/)를 함께 확인했다.
- 단위144/144,타입 검사/앱/독립 위젯 빌드,전체Chrome76/76 통과. 브라우저 결과 `/private/tmp/pvv-cozy-final-green`,캡처 [pageerror](docs/assets/cozy-village/errors.json)는0건이다.
- 독립 최종 코드 검토1회,중요1건/경미2건을 한 번의 수정 단계에서 해결했다. 이후 전체 재검증했다. 새 검토를 반복하거나 전체 EGM 다중 심사를 수행했다고 기록하지 않는다.
- 현재MP4의0.3/6.5/10/14.5/19초를 디코딩해 확인하고 브라우저 재생4개 시나리오도 통과했다. 원화/영상 출처는 [개편 검토](docs/features/visitor-village/reviews/cozy-village-2026-11-25.md)와 [소개 영상 기록](docs/features/visitor-village/intro-media.md)에 있다.

열린 필수 수정은 없다. 실기기/보조기기와 실제 티스토리 스킨 설치는 검증 범위 밖이다. 이전 작업실 UI의 QA는 아래 이력으로 보존한다.

---

# 마을 작업실 시각 검증

final result: passed

선택 원본: docs/assets/install-atelier-reference.png (1487×1058). 구현: /private/tmp/pvv-atelier-qa/desktop.png, 같은1487×1058 CSS px/DPR1, ko/pristine/Christmas24명 상태. 비교 입력: /private/tmp/pvv-atelier-qa/comparison.png의 좌우 원본/구현을 함께 열어 확인했다. 생성된 시안 이미지는 실제 마을을 대신하는 제품 에셋으로 사용하지 않는다.

## 비교1 지적

- [P2] 제목/섹션/단계 글자의 크기와 작업면 비율이 시안보다 작다. 설정 열360px가 시안의약392px보다 좁고 실제 미리보기가 너무 왼쪽부터 시작한다. 제목을48px, 소개18px, 작업면 제목24px와 설정 열392px로 조정한다. 기존 body16/caption14는 유지한다.
- [P2] 320px 영어 메뉴가 Men/u로 두 줄로 나뉘고 단계 글자가 다음 번호와 맞닿는다. 모바일 메뉴를 줄바꿈하지 않는 고정 폭 제어로 두고 단계는 번호 위/문구 아래로 재배치한다.

## 보존할 실제 제품 차이

- 생성 시안의 트리 로고 대신 기존 source 브랜드 마크와 실제 렌더러/아트를 보존한다. 시안의 개념 표시와 임의 코드 수치는 제품에 넣지 않는다.
- 주소 레이블은 기존 티스토리 주소, 높이420px와 치환자/현재호스트 모듈 계약을 유지한다. 도움말은 실제 관리자 링크 역할을 짧게 설명한다.

## 수정 후 비교와 최종 근거

첫 비교의 두 P2를 수정한 뒤 같은1487×1058 CSS px/DPR1로 재캡처했다. 원본/구현 모두1487×1058 이미지 px이며 리사이즈하지 않았다. [최종 데스크톱](docs/assets/install-atelier-desktop.png), [375×667 모바일](docs/assets/install-atelier-mobile.png), [전체 좌우 비교](docs/assets/install-atelier-comparison.png), [설정 상세 비교](docs/assets/install-atelier-focus-settings.png)를 열어 판단했다. 상세 비교는 x64,y320의 원본/구현 영역을 브라우저 overflow로 잘라 원래 픽셀 크기로 비교했다. route는 http://127.0.0.1:5201/install.html?lang=ko 이다.

첫 비교에서 작았던 hero/lead/섹션을48/18/24px로, 설정을392px로 수정했다. 320px 메뉴 nowrap과 모바일 단계 재배치 후 메뉴 높이48px 이하/문구 겹침 없음도 확인했다. 중간 캡처는 `/private/tmp/pvv-atelier-qa/round2/`에 보존했다. 마지막 독립 코드 검토의 메뉴 첫 링크 초점, 오늘 하루 집계 문구, 입력 경계 대비는 각각 실패 검사로 재현해 수정했다. 모바일 새 탭 보조 설명 숨김도 제거했다. 최종 이미지에 남은 P0/P1/P2는 없다.

## 필수 다섯 영역 평가

| 영역 | 실제 비교와 판단 |
| --- | --- |
| 글꼴과 조판 | 기존 CJK 시스템 산세리프를 재사용한다. 생성 이미지의 서체 원본은 제공되지 않아 정확한 서체 일치를 주장하지 않는다. 제목48px/작업면24px/선택18px/본문16px/도움말14px로 위계를 맞췄다. 상세 입력의 무게와 줄간격, 모바일 한국어 어절 및 영어 줄바꿈에 겹침/잘림이 없다. OS별 안티앨리어싱 차이는 허용한다. |
| 배치와 간격 | 설정392px + 대형 미리보기, 각진 면,32px 안쪽 여백을 반영했다. 실제 미리보기 x472,y393.47,935×475.83px로 원본의 우측 영역과 대응한다. 헤더는 데스크톱73px/모바일65px. 모바일 실제 마을은 먼저 나오고375px에서 y289.6~489.6에 보인다.320px 네 언어에 가로 넘침/메뉴 잘림이 없다. 모바일 원본 시안은 없어 반응형 해석과 수용 기준으로 검증했다. |
| 색과 토큰 | page #f2f7f8, ink #18322f, action #1c5d56, selection #e4efeb로 눈빛/소나무 방향을 공통 역할에 적용했다. 생성 시안의 약한 질감/그라데이션은 필수 제품 요소로 보지 않고 평면 역할 색을 쓴다. 밝은 본문13.67:1, 보조5.32:1, 주요 버튼7.64:1, 입력 경계3.36:1. 어두운 홈 대응 경계도3:1 이상을 브라우저에서 검사했다. 전체 접근성 준수 인증을 의미하지 않는다. |
| 이미지와 에셋 | 실제 기존 렌더러/아트로 트리, 집, 캐릭터, 눈, 벤치와 울타리를 표시한다. 선명한 픽셀 경계와 중앙 나무, 비율/크롭을 확인했다. 기존 source 브랜드 마크 유지와 동적 배치는 구현 계약에서 의도적으로 보존한 차이다. 생성 시안 이미지를 제품 배경으로 굽거나 새 CSS/SVG로 그림을 흉내 내지 않았다. |
| 카피와 내용 | 제목과3단계, 계절 우선 설정, 주소 역할과 수동 붙여넣기를 유지한다. 시안의 ‘오늘까지 누적’을 실제 계약인 ‘오늘 방문자 수’로 정정했다. 실제420px/치환자/호스트 모듈을 유지한다.4개 언어의 메뉴/안내/오류/복사 상태를 제공하며 시연24명과 실제 설치를 구분한다. |

## 동작과 검증 범위

전체 브라우저72개는 실제 빌드 번들에서 코드 생성/무효화/재생성/복사 fallback/늦은 완료, 언어 상태 보존, 메뉴 열기/Tab/Escape/문서 링크, 라디오 키보드, 모션 줄이기, 렌더 실패 복구와320px 화면을 포함한다. 최초 생성에서 안내를 열고 이후 수동 접힘은 언어 변경에도 유지한다. 캡처 pageerror는0건(`/private/tmp/pvv-atelier-qa/errors.json`의 `[]`). 실제 휴대전화/보조기기와 티스토리 스킨 쓰기는 수행하지 않았다.

## 구현 체크리스트

- [x] 두 P2 시각 문제 수정 후 같은 상태로 재캡처/재비교.
- [x] 전체 보기와 설정 상세 보기, 작은 화면과 네 언어 확인.
- [x] 독립 검토의 중요3건과 보조 설명1건 수정 및 회귀 확인.
- [x] 단위128/128, 타입/빌드, 브라우저72/72 통과.
- [x] 실제 로컬 화면과 근거를 전달하고 현재 변경은 운영 배포 전임을 구분.

추가 필수 수정이나 열린 제품 결정은 없다. 실기기/보조기기 조합별 확인은 후속 검증 범위다.

## 후속 공개 확인

사용자의 후속 진행 승인으로 동일 소스를 production1a1111e3에 반영했다. 공개 Chrome8/8과 주요 HTML/JS/CSS/위젯의 검증 빌드 해시 일치를 확인했다. 공개1487×1058/375×667 실제 캡처를 다시 열어 로컬과 같은 배치/타이포그래피/이미지/색/카피임을 확인했다. 근거는 `/private/tmp/pvv-atelier-production-results/`와 [배포 기록](docs/features/visitor-village/deployment.md)에 있다. final result는 passed로 유지한다.
