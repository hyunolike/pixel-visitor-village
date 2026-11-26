# Cohesive pixel art implementation plan

**Goal:** finish the current playable village artwork as one warm daylight game set, preserving original identities, animations and the small Tistory well.
**Architecture:** authored color-ramp JSON shared by deterministic raster finishing and native canvas/RGBA art. Existing generated source archives stay intact. No dependency or model/UI behavior change.
**Spec:** VV-ART-001–006, this plan and existing playable-map contracts. Baseline main6bd61c39323d5eddbadf7bcb221f65e0dc8c9096; branch feat/cohesive-pixel-art, existing isolated host worktree. Primary native execution; fresh readiness/final review. User handed off implementation and already authorized Pillow pixel/palette/alpha finishing; do not reopen those decisions. No commit/push/PR/production promotion. A separate Cloudflare cohesive-art preview is authorized by the established public-preview workflow.

## Style and acceptance

- VV-ART-001: warm olive outlines, cream light, terracotta/oak construction, distinct seasonal foliage. Upper-left highlights/down-right shade. Preserve eight outfits/skin tones and the red Tistory face with five cream dots. No airbrush, dithering or added noise.
- VV-ART-002: native object pixel stays one source pixel: characters20×28, holiday32×36, bubbles18×14, raster trees/well180×180. Preserve silhouettes/frame dimensions. Background1536×1024 is finished at768×512 nearest-neighbor then exactly2× upscaled; palette-constrained with no dither. Existing normalized composition and all walking/hitbox geometry remain.
- VV-ART-003: shared named hex ramps in src/art-direction.json, explicit season selections. Object transforms preserve original alpha including contact shadows and zero transparent RGB. Raster tree/well exact alpha-threshold128 masks remain. Background stays opaque; fruit/ribbon/red accents protected by role palettes. Processing only at source/atlas construction, never per animation frame/count change.
- VV-ART-004: native house/furniture material clusters replace excessive repeated wall/roof strokes; use consistent warm highlights/shades. Characters keep silhouettes/poses but get consistent shades and corrected hair highlight on back views. Holiday/emote art shares ramps. Re-export guide portrait from the finished native character.
- VV-ART-005: keep page structure/header/form IDs, four locales, snippets, model/social/effect timing, reduced motion and texture ownership. Default embed gets art polish but original geometry/API. README thumbnail/video files unchanged.
- VV-ART-006: exact before/after views and native sheets, all five seasons desktop/mobile,320px four-locale/keyboard/fallback regression. Deterministic export checks and full unit/release/type/build/browser suite; fresh final review; actual public preview verification.

## Files and interfaces

Create src/art-direction.json, src/art-palette.ts and src/art-palette.test.ts. fitArtPixels(pixels:Uint8ClampedArray):Uint8ClampedArray maps RGB to the shared global palette by nearest squared RGB distance, stable first-index ties and cached source colors. Keeps alpha byte-for-byte, zeros transparent RGB, deterministic/idempotent. finishArtCanvas(canvas:HTMLCanvasElement):HTMLCanvasElement transforms its canvas once through get/putImageData and returns it; no Pixi/model state. Tests: exact alpha/zero transparent RGB, palette membership, idempotence and protected red/skin distinctions.

Modify only native art src/{characters,holiday-art,social-art,environment,art}.ts; apply finishing before completed RGBA/canvas returns. Native house detail edits remain in environment.ts. Preserve all exports and dimensions.

Create scripts/media/finish-village-art.py with prepare/finish/check and assets/concepts/cohesive-20261126/{README.md,source-manifest.json,exports.json}. Source input is git6bd61c3 or the existing immutable raw archives, never a previous finished output. Record source commit/path/hash rather than duplicating discarded originals. Runtime writes: five src/assets/map/landscape-*.webp, six src/assets/cozy/*.png; re-export src/assets/map/guide.png using existing scripts/media/export-guide.mjs. Record recipe/tool versions/hashes, palette limits, exact masks,2× background block uniformity and byte sizes. Lossless cwebp; no image API/keys/new downloaded art.

Capture helper may export full native character/prop/holiday/emote sheets; durable helper belongs in scripts/media. Evidence: docs/assets/cohesive-art/. Update existing spec/design/tasks, this plan, design-qa.md, reviews/cohesive-art-2026-11-26.md. No workflow/README/media changes. Add actual browser regressions only when new art visibility/failure logic warrants them; retain existing behavior checks.

## Work and checks

- [x] Baseline157 units, source/public screenshots and art metrics; fresh readiness review.
- [x] Write palette contract tests, observe RED, implement, run GREEN. Refine native material/lighting clusters and finish source frames.
- [x] Preserve baseline hashes; finish five terrains/six raster objects and export guide. Inspect enlarged contact sheets and live composition. Check masks, palette membership, binary raster alpha, native shadow alpha,2× background grid and repeatable hashes. Reject erased face/fruit/season identity.
- [x] Build/type/format and unit/release/browser acceptance. Five seasons1487×1058/390×844,320px locales, native8style×3direction×8pose sheets, holiday/emote contacts. Compare exact before/after together plus focused tree/person/terrain crops; correct material differences.
- [x] Fresh whole-branch review, one verified fix pass, actual evidence. Publish existing project preview branch cohesive-art, verify anonymous interactions/assets and hand off real URL. Production stays unchanged until separately requested.

## Review focus

Palette collapse must not erase darker skin, eyes, fruit/ribbons or cream Tistory dots. Exact masks of existing180px objects stay. Background finishing must not shift path/house alignment or bake props. Preserve native alpha and dimensions. Source finishing rerun must be byte-identical. Mapping only at atlas/source construction; small/default/reduced-motion/fallback scenes remain readable.

## Ledger

Baseline pnpm test157/157. Isolated host worktree verified; new branch from origin/main6bd61c3.
Ruling: retain silhouettes/native animation sources and finish existing rasters rather than regenerate; this preserves identity and exact pose contracts. If color/grid finishing does not resolve visible mismatch, iterate it before acceptance. Public before/after inspection is the acceptance gate.


## Readiness resolutions

Fresh reviewer art_readiness read the persona, standard, plan and source. No Blocker; three Major points resolved as follows.

- JSON schema: version1, ramps is an insertion-ordered object of arrays of hex strings; objectRamps is an ordered array of ramp names; terrainRamps and objectAssetRamps select ordered ramp-name arrays by season/asset. Flatten in declared order, remove duplicate hex strings preserving first occurrence. Both Python and TypeScript use nearest squared RGB distance with the earliest palette index as the tie winner. Transparent RGB is zero. Native RGBA alpha is exact, raster tree/well alpha is binary from baseline threshold128. Canvas palette membership is required only for fully opaque pixels because premultiplication can round low-alpha RGB.
- Inputs are exactly the eleven git6bd61c3 runtime files pinned by source-manifest.json under assets/concepts/cohesive-20261126; every read verifies its hash. They are immutable inputs for this refinement even though six were finished in an earlier task. Do not read raw-v1/v2 archives or this task's output as inputs.
- Before edits, preserve SHA256 of alpha bytes for all192 visitor frames,4holiday frames,3bubbles and source-created props/terrain/fallback canvases in baseline-native.json. Post-edit checks compare every entry's dimensions and alpha hash. Native detail edits stay inside existing opaque masks. Pure tests also pin distinct skin ramp colors/protected red and cream. Browser atlas sheets must show eye/skin/fruit details at enlarged native scale. Add opaque palette checking at the source/canvas boundary, not through scaled canvas screenshots.
- Node export: JSON uses import attributes compatible with Vite and Node22.12+, the exporter runs node --experimental-strip-types scripts/media/export-guide.mjs. Record Node/FFmpeg versions and rerun to verify output hash. No additional dependencies.

## Final review resolutions

Fresh reviewer art_final_review found medium/light face collapse, native fallback skyline collapse and missing opaque-palette integration assertions. All were reproduced. Actual visitorPixels skin sampling and native theme-layer regressions now pass after preserving medium skin and skyline ramps. Hair feedback was graded Important here because shared lighting is explicit scope; per-style lighter tones pass exposed back-view regression. Capture checks261 sources, now including old monument/glow alpha and opaque-palette membership. Low-alpha RGB is exempt due to Canvas premultiplication.

The original silhouette ruling stands. RGB mode-filter off-palette colors were fixed with an indexed filter. Gray masonry/dark hair got neutral/dark-wood ramps after a regression reproduced violet/green tint. Sky finishing uses source-color classification rather than a horizontal crop; winter central snow avoids water-blue selection. All processing stays in source construction/build-time finishing. No unresolved review issue remains after direct tests; no second reviewer loop is claimed.

Final acceptance: unit164/164, release14/14, final browser100/100, type/build/format pass. Native261 exact alpha/dimension and opaque-palette checks pass; eleven raster masks/grid/palettes pass,12 exports repeat byte-identically. Final dist art hashes match source. Public53-file and interaction checks pass. Preview https://cohesive-art.pixel-visitor-village.pages.dev/ (a5f6e49d). Production6bd61c3 preserved; no source commit/push/PR. See reviews/cohesive-art-2026-11-26.md.

## User correction: installed blog widget is the target

The user clarified that the target is the widget exposed after blog installation, not the service website. The preceding homepage-centric acceptance is historical and insufficient for this corrected scope. Existing native art finishing is useful and retained. The measurable defect is that the service preview alone installs setupMapScene; generated standalone snippets cannot reproduce its terrain.

- VV-EMBED-ART-001: generated code adds a boolean illustrated attribute. The independent widget module owns the existing generation-guarded scene helper for illustrated/data-map-scene opt-in, including reconnect and removal. Existing unflagged manually embedded widgets retain their native scenery. No service header/layout change. Existing service callers stop installing duplicate helpers.
- VV-EMBED-ART-002: all five terrain plates are included by the standalone library build, which Vite inlines like existing raster art. Only the selected image is decoded. New generated code works cross-origin without service scripts, CSS or additional initialization. Count placeholder, four locales, optional admin URL and copy protection remain. Removing both appearance flags restores the classic scene. A failing selected image remains usable through native fallback.
- VV-EMBED-ART-003: public/examples/blog.html is an explicitly synthetic blog-body fixture containing only the real distributed module and generated component markup. No site hero, navigation/HUD or service-only initializer. Controls outside the widget allow five seasons/count comparison. Verify actual generated code after replacing only the Tistory count token, across a separate blog origin and320px; compare actual selected-season canvas with installer preview. Capture this fixture and standalone widget, publish the corrected preview path, and explain that a real Tistory skin installation remains unverified.

Exact added boundary: src/{visitor-village.ts,map-scene.ts,demo.ts,install.ts,install-model.ts,install.test.ts}, tests/widget.spec.ts, public/examples/blog.html and the existing guide/README code samples and feature records. README thumbnail/video unchanged. No commit/push/production promotion. Native implementation continues without another design-selection question; existing user authorization covers the requested widget-art correction.

Reopened work: reproduce absent appearance attribute and standalone scene; integrate component-owned lifecycle; exact snippet/cross-origin/equality/opt-out/reconnect regression; fresh focused final source review; full acceptance and public blog-body preview. Earlier web screenshots are not the handoff evidence for this correction.


Corrected-widget review/fix evidence: embed_final_review verified all5 WebP payloads are in the standalone bundle and external duplicate setup is gone. The original WebGL readback equality check could compare cleared buffers and is superseded by compositor screenshots, >16 sampled colors, a classic-scene negative control and strict re-enable equality. Comparison normalizes both canvases to integer520×420 placement; fractional default article margins caused an extra white screenshot row and were not a renderer defect. Initial-upgrade image ordering and detached opt-out state were graded acceptance issues for selected-only loading and truthful appearance state. Explicit connection gating and metadata cleanup fix them; both have direct RED→GREEN browser coverage. Source-picture resize waits on actual canvas dimensions. The public blog fixture uses only the distributed module, with a data favicon to avoid unrelated favicon404 noise.


Corrected public handoff: https://cohesive-art.pixel-visitor-village.pages.dev/examples/blog (immutable https://bc8f9ef0.pixel-visitor-village.pages.dev/examples/blog), preview branch cohesive-art. All54 deployed files match the final local dist SHA256; module headers and404 pass. Anonymous public blog captures1000/390/320px and5seasons/count0/24 checks pass without service requests, overflow or console/page errors. The first immediate post-deploy readiness check timed out; a fresh logged run passed without code changes, so no transient cause is asserted. Production deployment metadata still6bd61c39323d5eddbadf7bcb221f65e0dc8c9096. No source commit/push/PR/promotion. Corrected scope final result: passed.


Integration authorization: the user's subsequent “진행” continues the corrected widget delivery from public preview into PR, checked merge and automatic production deployment/release. The thumbnail and video stay unchanged. Existing installed unflagged snippets retain classic scenery; after production delivery, users can regenerate their installation code or add the boolean illustrated attribute to select the updated terrain.
