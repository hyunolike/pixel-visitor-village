# Installed widget pixel effects

> Implementation: native execution with superpowers:executing-plans; fresh final review. User asked to install pixelfx and improve the blog-installed widget after the recommendation of arrival and seasonal effects. That scope is authorized; implementation choices below are the implementer's decisions.

**Goal:** Give the installed village restrained seasonal movement and a brief response to a genuine increase in today's cumulative count.
**Architecture:** Author small transparent sprite motifs with pixelfx, export them at build time and reuse them through one instance-owned Pixi atlas. A pure effects state controls timing and placement on the existing ticker. No second canvas, animation loop, network service or browser runtime dependency.
**Tech stack:** Existing TypeScript/PixiJS/Vite/Playwright, pinned pixelfx5294518ce7c72e48b6100a744596e0acf57f2826 Node tooling.
**Spec:** This document extends the existing spec/design/tasks; the actual blog widget is the acceptance surface.

## Design and alternatives

Directly running the entire effects library would add per-frame CPU image compositing. Full-screen seasonal sprite sheets would consume more texture memory and stretch particles on narrow blogs. Exported small motifs use the library's renderer and permit sparse, responsive placement. Retain all existing trees, well, terrain, character identities, visitor counts and blog scroll behavior.

- VV-FX-001: Spring petals, summer fireflies, autumn leaves and winter/Christmas snow replace the existing dot weather. Use at most26 ambient sprites desktop,14 when native width<=210px; no full-screen flashes, shake, sound or extra particles per visitor. Layer stays inside the existing canvas and never captures input. Small sprites retain square pixels and the authored village palette.
- VV-FX-002: A short warm sparkle appears at the small well when an existing count reading increases on the same Korean day. Initial reading, zero, decreases, invalid input, locale changes, repeated readings and day rollover do not celebrate. A burst lasts1.5seconds. Ignore celebration requests while a burst is active; do not restart or queue. Cap to one active burst; rapid changes cannot accumulate sprites. Hidden readings use the existing notice coalescing. Every newly queued notice carries a one-use eligibility flag, consumed at first presentation even if paused/reduced/off. Requeued shown notices keep the consumed flag. Paused/reduced-motion states do not queue a future celebration.
- VV-FX-003: Reuse the existing30fps ticker and visibility gating. Offscreen/hidden/paused animations stop. Reduced motion hides optional effects and clears a burst. `effects="off"` disables all optional effects without changing counts or scenery. Reconnection, resizing, season changes and neighboring instance disposal remain safe. Optional atlas load failure leaves a usable village and basic weather fallback; no new mandatory renderer dependency.
- VV-FX-004: No new runtime package. One small atlas, target <=64KB PNG and <=2MB decoded, nearest filtering and instance-owned disposable textures. Use a final generateBundle hook in vite.widget.config.ts to retain the complete public/licenses/pixelfx.txt notice in the standalone bundle; verify its built content. Include the upstream MIT notices both in source and standalone bundle, no separately licensed font. Pin source commit, generation recipe, checksums and actual tool results; inspect three render/refine passes.
- VV-FX-005: Capture actual standalone widget in the blog-body fixture on desktop and320/390px, with all seasons and an arrival. Verify normal/reduced/paused/off states, failure/retry, multiple instances, reconnect and cross-origin standalone code. Use synthetic counts and do not claim real private Tistory installation. Preserve README thumbnail/video. Deliver a public preview; no source push/PR/merge/production promotion in this request.

## Global constraints

Today cumulative count is the input; no identity or concurrent presence. Existing max visitor limits and movement remain. No secrets, blog skins or other repositories' user data. Local review artefacts reuse docs/features/visitor-village/reviews. Existing host-owned linked worktree on feat/blog-pixelfx starts from production f9315b7.

## Review focus

1. Attribute upgrades before renderer readiness and disconnected async loads must not allocate after destruction.
2. Korean midnight, hidden decreases and reconnect must not make an old notice a new arrival.
3. Width320, short hosts and0visitors must keep effects clipped and touch scrolling functional.
4. Reduced motion/off switching and asset failure must leave no stale burst or independent ticker.
5. One disposed widget must not destroy shared sources used by a neighboring instance.

## Detailed implementation plan

### Task1: Authored pixelfx assets and provenance

Files: scripts/media/pixelfx/{petal,leaf,firefly,snow,welcome}.js; scripts/media/export-pixelfx.mjs; src/assets/effects/{village-fx.png,village-fx.json}; public/licenses/pixelfx.txt; vite.widget.config.ts; docs/assets/pixelfx/.
Interface: one atlas and metadata with kind, frame rectangles, fps, loop, duration and pivot. Author sources use upstream core only during export; generator takes a verified checkout path and checks its commit.
- [x] Inspect library candidates and three refined exports at1x/enlarged; run upstream check on every final effect.
- [x] Export deterministic atlas under size budget, repeat and compare hashes, record MIT notices.

### Task2: State, placement and rendering

Files: src/village-effects.ts, src/village-effects.test.ts, src/effect-art.ts, src/renderer.ts, src/visitor-village.ts. Model API: setSeason, setEnabled, setReduced, celebrate, clearBurst, step(dt); pure frame/placement helpers. Clamp each finite positive step to0.1seconds; reject nonfinite/negative time. Renderer owns atlas texture, frames, bounded sprites and disposal; optional load cache retries failed images, copies source into instance-owned texture after core readiness with a local failure boundary and a lifetime guard.
- [x] Write failing state/placement tests for caps, deterministic bounds, finite/clamped time, duration, reset and disable behavior. Run RED, implement minimal controller, run GREEN.
- [x] Integrate ambient rendering on existing ticker; replace basic dot weather only when atlas is available; reduced/off hides fallback too.
- [x] Add same-day positive-delta trigger at existing notice presentation, with no initial/rollover/decrease replay and no queued paused celebration.
- [x] Check attribute upgrade, optional atlas failure/retry, disconnect, shared-source isolation and renderer teardown with actual browser tests.

### Task3: Independent blog acceptance and handoff

Files: tests/widget.spec.ts, public/examples/blog.html, docs/index.html, docs/reference/widget.{ko,en,ja,zh-CN}.md, existing feature records and docs/assets/pixelfx/.
- [x] Extend blog fixture with pause/effects controls outside the widget and an explicit synthetic +1arrival button; no service initializer.
- [x] Browser regressions prove visible effects change real pixels, suppressed modes stay quiet, count semantics, narrow bounds and scroll; avoid cleared WebGL readback as visual proof.
- [x] Run pnpm test, pnpm typecheck, pnpm build, pnpm test:release, pnpm format:check and pnpm test:e2e. Inspect desktop/mobile/five-season motion captures.
- [x] One fresh focused final review, one direct fix pass with reproducing tests; record actual outcomes.
- [x] Publish preview branch and verify public blog widget/installer, metadata and production unchanged; no source integration without a subsequent request.

## Execution ledger

- Installed pixelfx skill at ~/.codex/skills/pixelfx from the pinned source; future turns auto-discover it. This turn read and applies its actual SKILL.md.
- Baseline: isolated host worktree preserved, feature branch starts at production f9315b7; no runtime changes yet.

Readiness review: pixelfx_readiness read the bundled persona/standard and five source files. Three Major gaps were resolved before implementation: consumed per-notice arrival eligibility across replays; an explicit standalone Rollup MIT banner; exact1.5s/ignore-active/0.1s/210px timing and boundary rules. No unresolved readiness issue. Baseline unit164/164 passes.

Task1: five motifs rendered with the real pixelfx core. Three passes inspected: reduced petal highlight, a turned/veined ochre leaf, subdued snow and staggered warm glints. Upstream check:5/5 pass, no warnings. Atlas11,471bytes and770,048decoded bytes. Unit state tests first failed because module absent, then174/174 pass after implementation.

Runtime integration: existing ticker and canvas own26bounded sprites and one burst. Per-notice fresh state prevents replay. Initial two browser regressions failed on absent effects then passed2/2 after implementation. A plain Rollup banner was removed by the build pipeline; a final generateBundle hook retains the complete notice after transforms, covered by a failing built-content assertion. Test-only locator type error was corrected before the final build.

Task2 complete:174/174 unit, type/build, and3/3 targeted browser regressions pass. Actual optional atlas failure/retry and neighbor removal covered; standalone full MIT notice passes after final bundle hook. Generated module1,431.27KB /500.27KB gzip (about14.4KB gzip increase over baseline). Read-only canvas data-effects/data-arrival diagnostics identify animation state without new controls inside the widget.
Task3 in progress: local1000/390/320blog captures,5seasons,arrival/pause/off/reduced checks pass with no console errors or overflow; actual spring desktop, arrival390 and autumn320 opened. Full105/105 browser suite passes in1.4minutes.
Ruling: no source commit/push in this implementation request; retain the complete worktree for preview review. This overrides generic plan commit examples and keeps deployment production unchanged.

Verification before final review:174unit,14release,105browser tests; type/build, service/new-file formatting, whitespace, upstream5effects and local3width/5season checks pass. Final review pixelfx_final_review is a fresh read-only whole-worktree review; integration remains uncommitted. README thumbnail/video hashes equal production.

Final review:3Important findings accepted for one direct fix pass: suppressed hidden-reading eligibility, optional artwork blocking/failing core startup, and insufficient successful-neighbor disposal coverage. Minor deferred: duplicate render on unchanged play() state (extra work on state events, not a separate ticker). No declined-to-judge behavior or design scope dispute. See reviews/pixelfx-final-2026-11-27.md.

Final fix pass: three runtime repro cases failed as expected before fixes; seven focused cases pass afterward, including all three suppression modes and live two-successful-instance compositor comparison. Optional art installs after core readiness with a connection guard and rollback. No second reviewer dispatch. Unit174/type/build pass; final full109browser suite running. Deferred minor remains documented.

Final task3 regression:109/109browser in1.4minutes after direct fixes;174unit,14release,type/build/format/whitespace and5upstream checks pass. Final generated widget1,432.25KB /500.49KB gzip. Source images/video untouched. Preview publication and public checks remain.

Public acceptance: https://blog-pixelfx.pixel-visitor-village.pages.dev/examples/blog (immutable4f45198c),56/56 files match final dist SHA256; widget CORS/MIME/nosniff/404 pass. Anonymous1000/390/320blog flows exercise5seasons,arrival,pause/off/reduced with no errors, no overflow or service-asset requests. Production remains f9315b7/deploy-16-f9315b7. No commit/push/PR/promotion. All implementation tasks complete; duplicate-render Minor deferred in review.


PR follow-up: the user requested a pull request for the verified pixelfx widget changes. Commit and push feat/blog-pixelfx and open against main. Preserve the preview and worktree. Merge and production promotion remain outside this request. Earlier no-commit statements describe the implementation/preview stage.
