# Product Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking. Fresh-context reviewers perform readiness and final review; implementation stays with the primary agent.

**Goal:** Remove repetitive copy, unnecessary installation friction and mismatched art/media while retaining the selected working pixel village.

**Architecture:** Keep the current static Vite entries and Web Component. Refine page/controller/locale sources, reuse the original raster and editable video sources, and consolidate existing CSS rather than layering another theme.

**Tech Stack:** TypeScript, Vite, PixiJS, Playwright/Vitest, existing browser/FFmpeg media tooling and explicitly authorized Python/Pillow pixel finishing.

**Spec:** VV-REFINE-001–007 in spec.md and the product-refinement section of design.md.

## Global Constraints

- README top thumbnail SHA256 b6c8955e5a9202bc585cde996905a288ea99beeb1d14fc3d4967f2ab264fd4f9 remains unchanged.
- Keep 65px compact/77px desktop shared headers, four locales, no-JS guide, keyboard/focus, reduced motion and standalone widget contracts.
- Today accumulated visits are the input. Demos are synthetic and no actual Tistory installation is claimed.
- No new runtime dependencies, copied third-party art, automatic blog modification, commit, push or public deployment.
- Current baseline main is5bea9201da858c200b0a81b4c965e3eec49edd5a. Before evidence is the fresh2026-11-26 public audit under /private/tmp/pvv-ai-audit-2026-11-26; keep accepted comparison captures in the repository.

## Review Focus

- Blank→valid→blank optional address: code remains available after regeneration, stale admin links/origin notes disappear, and copy races stay guarded.
- Supplied malformed/private-credential URL: localized error focuses input and never supplies an unsafe admin link.
- Four locales at320/390/701px: labels wrap, code/admin text stays truthful, and mobile installation is visible outside the menu.
- Removing the duplicate season select must preserve all five season buttons, active states, code handoff and legacy widget tests through real controls.
- Art/video changes must preserve character visibility, small monument, loading fallback, correct alpha/aspect, current UI/logo/fonts and accessible playback.

## Execution rulings and exact write boundary

The existing spec/design/tasks and this plan serve as the execution ledger, per the project's instruction to reuse its document system. No separate workflow scaffold or task commits are needed. User authorization covers implementing the audit recommendations; PR/commit/deployment remain separate.

- Task1 also migrates the existing four `installer ... translates validation...` cases, `installer translates existing errors...`, exact address-label selectors, site navigation's #season use and control-height #season use. Blank submissions become successful cases; malformed/credential URL rejection assertions remain exact and localized. Add blank-address clipboard success/fallback, invalid→blank recovery and delayed copy completion across address regeneration; preserve existing copy-generation guards.
- Task2 exact writes: src/assets/cozy/{tree-summer,tree-spring,tree-autumn,tree-winter,tree-christmas,tistory-monument}.png; assets/concepts/cozy/refinement-20261126/{tree-summer,tree-spring,tree-autumn,tree-winter,tree-christmas,tistory-monument}.png, provenance.json and exports.json; scripts/media/refine-pixel-assets.py; assets/concepts/cozy/README.md and docs/assets/README.md. Raw generated files are copied into this versioned source directory; existing originals stay intact. `python3 scripts/media/refine-pixel-assets.py finish` finishes the existing180px native grid without resampling and records exact metadata.
- Task3 exact writes: src/install.css, src/site-pages.css, src/design-system.css, src/demo.css, src/service-chrome.css, src/docs.css, src/demo.ts, src/install.ts, src/service-header.ts, install.html and docs/index.html; package.json, pnpm-lock.yaml and .prettierrc.json only for a pinned development-only formatter. No model/renderer blanket reformat.
- Task4 exact source writes: assets/concepts/refinement-20261126/{README.md,brag-plan.md,capture.html,composition.html,capture.mjs,render.mjs,share-copy.txt} and scripts/media/refine-intro.mjs. The adapter prepares ignored brag-output/refinement-20261126/work/{capture,compose,frames,logs,scripts,audio,stills}; fonts come from src/assets/fonts/{neodgm-1.600,pretendard-variable-1.3.9}.woff2 and logo from src/assets/cozy/tree-summer.png. It rewires the archived source's hardcoded workspace paths to this fixed new workspace and serves the built widget via production preview5208. Commands: pnpm build; node scripts/media/refine-intro.mjs prepare; node scripts/media/refine-intro.mjs capture; node scripts/media/refine-intro.mjs stills; node scripts/media/refine-intro.mjs render; node scripts/media/refine-intro.mjs finalize. Add `verify` to decode representative frames and check ffprobe metadata. Reconstruct the existing credited AAC stream from the documented baseline Git video, recording its hash/source; do not download or invoke paid services. Final writes: public/media/intro.mp4, public/media/intro-poster.jpg, docs/assets/intro-preview.gif, docs/features/visitor-village/intro-media.md and docs/features/visitor-village/reviews/refinement-media.json. No current Claude Code invocation is implied by reusing the original brag sources.
- Final evidence writes: docs/assets/refinement/{home-mobile,home-desktop,install-mobile,install-desktop,code-mobile,docs-mobile,art-seasons,scene-seasons,video-contact,before-after}.png, design-qa.md, docs/features/visitor-village/reviews/refinement-2026-11-26.md, and this feature's spec/design/tasks/plan. Media stills/contact sheets must show no unintended black frame at0,3,6,9,12,14.5,17,19.5s; full decoded ffmpeg blackdetect may report at most0.10s per transition and no blank first/last frame. Twenty seconds ±one frame,1920×1080,30fps,H.264/AAC are required.

## Task 1: Focused installation and homepage behavior

**Files:** src/demo.ts, src/demo.css, install.html, src/install.ts, src/install-i18n.ts, docs/index.html, tests/widget.spec.ts.

**Interfaces:** buildInstallSnippet(moduleUrl,season,refresh) and normalizeBlogUrl(raw) stay unchanged. The controller conditionally invokes URL validation only for nonblank input. Optional admin output depends on normalized origin, not snippet creation success. Existing IDs for code/results/address and data-install links remain; remove only the duplicate #season select.

- [x] Add and run failing browser regressions for mobile install visibility/season handoff and four-locale empty-address code creation/valid→blank/admin removal/invalid input.
- [x] Add #hero-install using existing data-install synchronization. Keep compact viewport installation visible and shared header untouched.
- [x] Remove required from blog input and translate optional label/help/pending/admin-only note in all four locales. Hide absent admin shortcut, never claim domain-bound code. Preserve dirty/generation/copy protections.
- [x] Replace repetitive secondary headings with function names; keep one emotional hero heading. Remove redundant season select; show #season-effects only in Christmas. Update control-dependent tests to use actual season buttons.
- [x] Update public quick-start/copy labels to optional-address flow and run focused regressions.

## Task 2: Runtime artwork refinement

**Files:** src/assets/cozy/*.png, assets/concepts/cozy/ (versioned original edits/provenance), artwork export script/metadata if needed. No model/scene API changes.

**Interfaces:** Same six filenames/aspect and runtime180×180 transparent images. Preserve season roles and existing renderer sizing/fallbacks.

- [x] Inspect six original targets and the actual scene. The generated summer draft retained gradients and was rejected; the user explicitly authorized Pillow finishing. Apply shared authored ramps, protected accents and binary alpha on the existing native grid.
- [x] Inspect the finished outputs and actual scenes. Preserve the original generated art and versioned180px baseline snapshots, check identical visible masks, and compare all five seasons plus the small monument on desktop/mobile.
- [x] Record actual dimensions/alpha/hash/byte sizes and factual source history; retain originals and do not claim exact palette compliance unless measured.

## Task 3: Consolidated service styles and readable source

**Files:** src/install.css, src/site-pages.css, src/design-system.css, affected service TypeScript/HTML; scoped formatter setup only if an existing formatter cannot be reused.

**Interfaces:** Same classes for functional UI and shared header. No global widget style/API changes.

- [x] Merge existing installer base/theme overrides into one source of each rule and one block per breakpoint. Remove unused old home hero and CSS-drawn brand rules.
- [x] Format affected service files with existing local tooling; no broad renderer/model reformat or speculative abstractions.
- [x] Re-run responsive/contrast/focus checks and inspect desktop/mobile before/after captures.

## Task 4: Current introduction and final acceptance

**Files:** existing brag composition/capture/render sources or a reproducible refinement adapter under scripts/media, public/media/intro.mp4 and intro-poster.jpg, docs/assets/intro-preview.gif, media provenance/QA/review records.

**Interfaces:** Keep20s/1920×1080/30fps/H.264-AAC, existing player URLs and playback semantics. Use actual current local production code to capture installation and village. Reuse credited music with current license and truthful history; do not fabricate external skill execution.

- [x] Inspect existing editable video and skill context; update logo/fonts/copy and recapture current installer/world with selected art.
- [x] Preview representative frames first, render final media, decode six actual frames and inspect them with current screen comparisons. Regenerate poster/GIF from the final file and verify duration/codecs/audio/blank-frame limits.
- [x] Run pnpm test, pnpm typecheck, pnpm build, pnpm test:release, then one full pnpm test:e2e. Never run competing Playwright runners.
- [x] Fresh-context independent final review against all seven requirements, fix material findings and verify affected surfaces.
- [x] Record actual results, preview and remaining limitations. Commit/push/PR/deploy await a separate user request.

Ruling: the media adapter uses an existing production preview at MEDIA_ORIGIN (default5208), serving the built widget through a routed capture fixture. This avoids dependence on Vite private/ignored-file serving. The normal editable UI preview remains5199. README.md, README.en.md, README.ja.md and README.zh-CN.md receive only the required optional-address installation sentence update; their source thumbnail stays untouched.

Ruling: add vite.config.ts to the write boundary and keep service assets external with assetsInlineLimit:0. Refined PNGs now fall below Vite's4KiB inline threshold; retaining external URLs avoids duplicating base64 in HTML, preserves independently cacheable favicons/brand assets and keeps real network-failure coverage. The separate library build remains unchanged and still embeds its own artwork.

Ruling: prepare reconstructs the credited AAC stream from the documented baseline Git video and finalization copies that stream without audio re-encoding. This replaces the ignored-local-stem dependency with repository history, so a fresh checkout with the baseline commit can prepare the same source audio.

Ruling: the user explicitly approved Python/Pillow finishing via the asynchronous method question. The exact source snapshots at assets/concepts/cozy/refinement-20261126/*.png are baseline180px runtime inputs, while original1254px art stays in the parent folder. scripts/media/refine-pixel-assets.py prepare|finish|check replaces image regeneration and the proposed JavaScript exporter. Palette ramps protect small colored accents; a native-grid mode pass removes isolated shade noise. The visible alpha>=128 mask is byte-identical before/after, all output alpha is0/255 and tree/monument palettes stay within32/16 colors. The initial generated draft and a population-only adaptive-palette draft were rejected in visual QA; neither is a selected source.

Final acceptance: unit151/151, release14/14, final production Chrome90/90(55.4s), format/asset/type/app/widget checks pass. Fresh whole-branch review found no material defect. Eight final decoded media samples were inspected; the17s forest dip intentionally covers one frame(0.033s), within the0.10s transition allowance. Full results and limits are recorded in reviews/refinement-2026-11-26.md. No commit/push/deploy performed.
