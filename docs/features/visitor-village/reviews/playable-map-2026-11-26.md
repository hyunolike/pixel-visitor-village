# Playable village map acceptance — 2026-11-26

The user selected concept1 from the public comparison gallery. This implements that choice in the existing Vite service and real widget, on `feat/playable-village-map` over main `46b305899bda81e10e3800a36bfd1619b0918091`. No source commit, push, PR, merge or production promotion was performed.

## Scope and visual evidence

The homepage is a playable village with actual house links, guide dialogue, greeting, five seasonal inventory items, synthetic visitor count, invitation and pause. Installation and static documentation share its mint, warm paper, gold actions, pixel display type and header geometry. The guide adds literal topic search and current-location navigation. Four installer languages and the reusable snippet contract remain.

Selected truth: `assets/concepts/map-20261126/design-reference.png`, SHA256 `aa86c5d034b3b79163c87a4398409589446e36e6d1476a28804333e8d19301be`. Source and actual home are both1487×1058, CSS1487×1058, DPR1, summer12, normal motion, install-house hover. [Public side-by-side](../../../assets/playable-map/comparison-public.jpg), [type](../../../assets/playable-map/focus-type.png), [landmarks](../../../assets/playable-map/focus-landmarks.png), [HUD](../../../assets/playable-map/focus-hud.png) were opened. [Desktop seasons](../../../assets/playable-map/seasons-desktop.jpg) and [mobile seasons](../../../assets/playable-map/seasons-mobile.jpg) were also inspected. These sheets resize only inspection copies; runtime artwork is unchanged.

The illustration's baked NPCs and beveled graphic lettering are not a replacement for the original live sprite family or accessible HTML controls. Original sprite art, small Tistory well and NeoDunggeunmo/Pretendard remain authoritative. The water is at the outer edges, outside existing visitor movement bounds. The title becomes one line on short wide screens; mobile has a separate introduction and a scrollable HUD. These are deliberate responsive/product adaptations.

## Independent reviews and corrections

Fresh readiness review (`/root/map_readiness`) identified missing reference identity, incomplete image/landmark geometry, reconnect-after-detached-load behavior, a legacy null-reset race and guide search/hash rules. These were specified in the plan. Its recheck still identified a pending image overriding a default reset; explicit service-only `data-map-scene` opt-in, generation checks and a delayed-completion regression resolve that issue. No claim of a further reviewer recheck is made.

Fresh whole-branch final review (`/root/map_final_review`) inspected the source and tests. Material findings and their fix evidence:

| Finding | Resolution and verification |
| --- | --- |
| Short desktop title intersects house label | Compact title rules; bounding-box regression at701/1024/1280/1440 widths. |
|701px HUD overflow | One column at701–1000px; page scrollWidth equals viewport. |
| External SVG pause glyph contrast | Explicit ink fill, inverted pressed glyph, immediate state surface; actual rendered icon contrast regression passes. |
| Search and settled bottom scroll leave stale current topic | Recompute from visible sections, clear for no-results, use last visible section at bottom; literal-search/hash/focus regressions pass. |
| License absent from public build | MIT text in `public/licenses/pixelarticons.txt`, static guide credit link, public HTTP200. |
| Weak delayed-image and shared-source coverage | Wait for real image completion; two renderers share one HTMLImageElement and retain strict pixel equality after the first replaces/destroys its texture. |

Root visual iterations also corrected the flat v1 forest/paths, leftmost house placement, undersized HUD text and source-like foreground targeting. Hover/focus now highlights the actual full house, with only the label center clamped on mobile. Failure-state QA measured low hero contrast against the default winter sky; cream fallback text now passes4.5:1. Final short-screen inspection found the HUD bottom at843px in a768px viewport. A regression reproduced that failure; the stage now uses a flexible track and a compact one-line heading at wide720–849px heights. Re-captured1440×768 shows the complete HUD at746px, with no title/sign overlap. Both corrections are included in the final100-test run.

## Final verification

- `pnpm test`:157/157, including map geometry and unchanged default layout.
- `pnpm test:release`:14/14.
- `pnpm build`: type check, service and standalone widget builds pass. The service-only terrain files are not imported by the standalone widget entry.
- `pnpm format:check` and `git diff --check`: pass.
- Final `pnpm test:e2e`:100/100 in1.3minutes, after the last short-screen correction. Covers default widget, renderer failures/retries, image races/reconnects/shared ownership, population limits, four locales, clipboard races, keyboard, reduced motion, common headers and no-JS guide.
- Public Chrome matrix: all three pages at320/390/700/701/1440/1487px. All18 captures have matching scrollWidth and no console/page errors. Header65px compact,77px desktop. All five seasons captured on desktop/mobile. [Machine-readable results](../../../assets/playable-map/public-viewports.json).
- Public interaction smoke: actual pause/invite/greeting, house-body pointer handoff, four-locale blank-address code generation and real clipboard, literal search/hidden hash restoration, license200,320px reduced-motion keyboard navigation and no-JS guide. No console/page errors. [Results](../../../assets/playable-map/public-smoke.json). The smoke fixture follows Cloudflare's canonical `/install` redirect and waits for actual widget readiness before keyboard focus.
- README thumbnail SHA256 remains `b6c8955e5a9202bc585cde996905a288ea99beeb1d14fc3d4967f2ab264fd4f9`. Existing media was not rewritten; it remains a widget explanation filmed before this service redesign.

## Public preview and boundary

Working build: https://playable-map.pixel-visitor-village.pages.dev/ . Immutable deployment: https://e825929a.pixel-visitor-village.pages.dev . Cloudflare project `pixel-visitor-village`, preview branch `playable-map`, dirty-build flag true. Only built `dist` files were uploaded. No credentials were read or changed. The original https://design-review.pixel-visitor-village.pages.dev/ comparison gallery remains separate.

Anonymous production metadata still identifies main `46b305899bda81e10e3800a36bfd1619b0918091`. The working preview is not a tagged release or a verified live Tistory skin installation. The next source integration action requires the user's PR instruction.

Asset provenance and full source prompts are in [the asset record](../../../../assets/concepts/map-20261126/README.md). Five1536×1024 generated plates are lossless WebP; decoded PNG/WebP pixels were checked equal. Existing sprite data supplies the portrait. Free MIT Pixelarticons2.4.2 supplies standard icons; no new runtime dependency was introduced.

Final result: passed. No actionable P0/P1/P2 finding remains in the reviewed scope.
