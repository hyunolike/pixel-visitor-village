# Cohesive pixel art acceptance — 2026-11-26

The user approved finishing the remaining art consistency work after playable-map PR17 was merged. Baseline main6bd61c39323d5eddbadf7bcb221f65e0dc8c9096; branch feat/cohesive-pixel-art. Native implementation in the existing isolated host worktree. No commit/push/PR/merge or production promotion in this step.

## Actual change

Five existing terrain plates are finished on a768×512 native grid and exported1536×1024 with a fixed seasonal palette, indexed mode cleanup and lossless WebP. Input-color sky classification retains mountain silhouettes; interior snow avoids water-blue selection. Original layout/walking/hitbox coordinates stay.

The five180px trees and small Tistory well retain exact visible masks with updated shared ramps. Native house details/material shading, all192 visitor poses, four Santa/Rudolph frames, three emotes,50 prop canvases and recovery artwork share the finish. Three skin groups, costume identities and per-style hair highlights remain. Guide portrait is re-exported from the actual finished frame. No newly generated art, external game assets, dependency or frame-loop processing was introduced.

[Source manifest and recipe](../../../../assets/concepts/cohesive-20261126/README.md), [exports](../../../../assets/concepts/cohesive-20261126/exports.json) and [repeatability](../../../../assets/concepts/cohesive-20261126/repeatability.json) document the prior explicit Pillow authorization, baseline hashes and tools. Eleven raster files fall from6,858,075 to193,526bytes,97.18%. Five trees/well remain binary alpha; native shadows keep their exact alpha.

## Independent review and fix evidence

Fresh readiness reviewer art_readiness read its bundled persona/standard and the plan/source. No Blocker; three Major gaps were resolved in the plan: machine-readable palette schema/ties, exact immutable eleven-file inputs, native integration alpha/color checks. The Node22 JSON-import/export path was also verified.

Fresh whole-branch reviewer art_final_review found actual medium/light skin collapse, missing default/fallback skyline contrast and an opaque-palette verification gap. Each was resolved in one fix pass. The back-hair lighting finding was regraded Important here because consistent lighting is explicit scope. Actual skin samples, six exposed hair highlights and all five native theme skyline inputs first failed, then passed. Medium skin and native skyline ramps plus authored per-style hair highlights fix those issues. Capture now asserts261 exact native alpha/dimension signatures and zero opaque off-palette pixels, including original monument/glow primitives. No second reviewer pass is claimed.

Earlier visual/code checks found neutral gray turning purple and dark hair green, now covered by a failing-then-passing palette regression and neutral/dark-wood ramps. RGB mode cleanup initially invented off-palette colors; indexed filtering fixes it. Late sky finishing briefly clipped mountains at a fixed row; source-color classification removes that cut. Final images were recaptured after these fixes.

## Visual comparison

[Exact before/after](../../../assets/cohesive-art/before-after.jpg) is a2974×1058 combined input: two1487×1058 CSS/DPR1 captures, summer12/reduced motion/selected-summer feedback, no scaling. [World detail](../../../assets/cohesive-art/focus-world.jpg), [192 poses](../../../assets/cohesive-art/characters-comparison.png), [props](../../../assets/cohesive-art/props-comparison.png) and [holiday/emotes](../../../assets/cohesive-art/emotes-comparison.png) compare baseline and finished sources together. [Desktop seasons](../../../assets/cohesive-art/seasons-desktop.jpg), [mobile seasons](../../../assets/cohesive-art/seasons-mobile.jpg), installer and actual default summer/Christmas widgets were inspected. Contact-sheet resizing is inspection-only, not an additional runtime export transform.

Fonts, text, layout and UI tokens remain the accepted playable-map design. Artwork now uses olive outlines, common warm material ramps, distinct seasonal colors, protected identities and reduced generated texture noise. The original larger-tree silhouette remains a product identity constraint, rather than a new hand-drawn object set. No actionable P0/P1/P2 visual finding remains.

## Final verification

- Unit164/164, release-tool14/14, type/service/widget build, service/new-file formatting and git diff whitespace checks pass.
- Final browser100/100 in1.3minutes after the final raster finish. Existing failure/retry/shared-source ownership, reduced motion, keyboard, four locales and mobile contracts remain covered.
- All eleven raster exports pass palette/grid/alpha/mask/hash checks. A second finish and guide export are byte-identical. Exported source hashes equal final dist files.
- Native integration:261 source canvases/frames have identical baseline dimensions/alpha and zero opaque off-palette pixels. [Result](../../../assets/cohesive-art/native-check.json).
- Public preview:53 files match the exact local dist SHA256; widget CORS/MIME/nosniff/404 pass. [Result](../../../assets/cohesive-art/public-files.json).
- Public real interactions: pause/invite/greet, whole-house selected-season navigation, four-locale blank-address code/clipboard, guide search/hash,320px reduced-motion keyboard and no-JS docs. No page/console errors. [Result](../../../assets/cohesive-art/public-smoke.json).
- README thumbnail remains b6c8955e5a9202bc585cde996905a288ea99beeb1d14fc3d4967f2ab264fd4f9. Video files remain unchanged. No live Tistory skin installation is claimed.

Public working preview: https://cohesive-art.pixel-visitor-village.pages.dev/ . Immutable build: https://a5f6e49d.pixel-visitor-village.pages.dev . Existing Cloudflare project, preview branch cohesive-art, dirty-build flag true; this is not a source release. Production metadata remains main6bd61c3. Credentials were neither read nor changed.

Final result: passed.


## Corrected scope: installed blog widget

The user's clarification supersedes the earlier homepage-centric handoff. The actual defect was reproduced: newly generated standalone blog snippets did not select illustrated terrain, although the installer did. New snippets include boolean `illustrated`; the component now owns scenery setup, selected-image loading and teardown. The website and installer no longer install duplicate scene helpers. Existing manual snippets without either appearance flag retain classic scenery. No service layout changes were required.

Fresh focused reviewer embed_final_review inspected source, docs and standalone bundle. All five terrain payloads are embedded. Findings were fixed directly: WebGL readback can be cleared, so the regression now compares nonblank compositor PNGs with a classic-scene negative control and strict re-enable equality; detached opt-out resets appearance metadata; connection gating prevents a default-season decode before initial attributes finish upgrading. Targeted regressions passed after observed failures. The installer and independent cross-origin blog match at an integer520×420 canvas placement. Only the selected WebP image decodes; no service asset request is needed.

Final corrected build: unit164/164, release14/14, browser102/102 in1.3minutes, type/build/format/whitespace pass. The earlier immediate intro-resize assertion failed once; the unchanged intro test and complete final suite pass after the connection-order fix. No claim of reproducing its transient cause is made.

The plain blog-body fixture imports only `/widget/visitor-village.js`, with synthetic counts explicitly labelled. Actual1000/390/320px article captures, five season widget captures, count0/24 transitions, zero overflow and zero console/page errors pass locally. Desktop summer/Christmas and390/320px article captures were opened and inspected. No homepage navigation or service HUD is used in this proof. The self-contained bundle includes all five source plates (about485.85KB gzip total widget); only the requested season decodes. README thumbnail and video hashes remain unchanged. A private Tistory skin installation is still unverified.


Corrected public handoff: https://cohesive-art.pixel-visitor-village.pages.dev/examples/blog (immutable https://bc8f9ef0.pixel-visitor-village.pages.dev/examples/blog), preview branch cohesive-art. All54 deployed files match the final local dist SHA256; module headers and404 pass. Anonymous public blog captures1000/390/320px and5seasons/count0/24 checks pass without service requests, overflow or console/page errors. The first immediate post-deploy readiness check timed out; a fresh logged run passed without code changes, so no transient cause is asserted. Production deployment metadata still6bd61c39323d5eddbadf7bcb221f65e0dc8c9096. No source commit/push/PR/promotion. Corrected scope final result: passed.
