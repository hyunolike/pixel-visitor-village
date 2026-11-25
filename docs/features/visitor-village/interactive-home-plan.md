# Interactive Village Home Implementation Plan

The user selected the first displayed concept, Living Village Square, on 2026-11-26 and authorized implementation. Baseline: origin/main 20f76be1293f4086b8add65095ca78899a7fc548; clean working tree; branch feat/interactive-village-home. Implementation stays in this existing linked worktree. Implementation was verified locally. The user subsequently requested a pull request, authorizing a commit, push and PR against main; merge and public deployment are separate steps.

**Goal:** Make the homepage a directly usable village, with character greetings, demo invitations and season settings that carry into installation.

**Architecture:** Reuse the production Pixi renderer and original assets. Add opt-in interactive behavior to the existing Web Component; keep embedded widgets unchanged by default. The homepage owns controls and accessible announcements; the model owns greeting lifetime and arrival positions.

**Tech stack:** Existing TypeScript, PixiJS, Vite, Vitest and Playwright; no new dependencies.

**Spec:** [spec.md](spec.md), VV-HOME-001 through VV-HOME-005.

## Visual target and constraints

Selected image: /Users/hyuno/.codex/generated_images/01a20dd3-dda2-7ad3-9bc3-4e9e31b44af9/exec-58851b0c-d838-44e5-86cd-7d194ba78f52.png (1487×1058). Compare at this native size and also check 1440×1024, 390×844 and 320×850.

The first viewport is edge-to-edge: compact 72px header, forest sky with left headline, demo count at right, central village and cream control dock at bottom. The hero fills at least 100svh at desktop sizes. No centered article frame. Match cream #fff0c7, deep forest #0d3537 and gold #f6c55d with angular controls. Use existing NeoDunggeunmo display (64px desktop, 48px tablet, 32px compact) and Pretendard 14–16px controls. Keep the actual pixel sprites and tiny monument. Actual art takes priority over generative differences in scenery, character scale, glyphs and counts. Reuse source tree PNG thumbnails for season buttons and brand; no replacement artwork or icon package is needed. Controls use text plus these real assets.

Homepage starts at summer, 12 demo visitors. Five season buttons select spring/summer/autumn/winter/christmas; all remain usable at 320px by wrapping to a compact grid. The dock offers one keyboard-operable greeting button, invite, pause; detailed numeric count (0–5000, slider to 200), select and Christmas glow controls remain below the immersive stage for existing power users. Content below is reduced to demo explanation, existing introduction video, concise installation steps and FAQ. Original README thumbnail and media files remain byte-identical.

## Detailed Implementation Plan

### Task 1 — Model and widget interactions

Modify: src/model.ts, src/model.test.ts, src/social.ts, src/renderer.ts, src/visitor-village.ts, src/widget.css, tests/widget.spec.ts.

- [x] Add failing unit tests then implement `VillageModel.greet(id:number):boolean`, `greeting:{id:number;age:number}|null`, `invite():boolean`, and pure `hitVisitor(people,width,height,x,y):number|undefined`. Invalid/nonexistent IDs reject. Greeting replaces the prior greeting, has a 3-active-second life, holds that person's movement, clears on season change, count removal and disconnect. Disabled/paused time does not advance it. Direct greetings remain possible with reduced motion; renderer then shows a static front-facing wave and existing heart balloon. Autogreetings continue for other people. Reset automatic social pairs when an explicit greeting begins to avoid conflicting poses.
- [x] `invite()` refuses at MAX_VISITORS without throwing; otherwise adds exactly one at x=.5,y=.94 with vx=0,vy=-.04. Other visitors retain IDs/positions. Arriving visitors use existing bounds and simulation, no extra clock/tween. Explicit repeated invitations are allowed.
- [x] `hitVisitor(people,width,height,x,y,cssScaleX,cssScaleY)` uses actual clamped sprite layout in renderer pixels (20×28 or compact16×22, same as renderState). Renderer supplies canvas bounding-box width/screen.width and height/screen.height as positive CSS pixels per renderer pixel. Hit box is centered on sprite center, width=max(sprite width,24/cssScaleX), height=max(sprite height,24/cssScaleY), implicitly clipped by rejecting coordinates outside the canvas first. Reject non-finite input/invalid scales; return frontmost matching visitor by foot y then highest ID. Test differing scales, narrow/tiny scenes, edges and overlapping people.
- [x] Extend SocialModel.step(people,seconds,excludedId?:number) and its private search to skip the active greeted visitor as either candidate. Pass model.greeting?.id from VillageModel.step; other visitors can still pair. Test the full 3-second greeting interval, including search after 2 seconds.
- [x] Add public Web Component opt-in attribute `interactive`, `greetVisitor(id?:number):boolean`, `inviteVisitor():boolean`. Methods require interactive, connected and renderer ready. Default greeting cycles IDs using a private cursor. Successful greeting emits `village-greet` with `{id}`; invite sets count through the regular attribute path, positions the last visitor, rerenders and emits `village-invite` with `{count}`. Default embedded link remains full-frame; interactive mode forces badge link and enables canvas click only. Blank canvas clicks do nothing. Do not prevent scroll/touch gestures. Toggle interactive off, season change, count removal, disconnect/reconnect clear greeting.
- [x] Renderer exposes `hitVisitor(x:number,y:number)` and renders the explicit greeting with existing wave frames and heart balloon, depth sorted and within viewport. Canvas remains an image with a description; external greeting button is its keyboard equivalent, so no application role or thousands of focus targets. Click coordinates convert CSS pixels to renderer pixels using canvas bounds.
- [x] Browser tests assert actual canvas pixel/state change on click and keyboard action, plus-count attribute/count/event, no popup, legacy link preserved, removal/reset, reduced motion and paused greeting feedback.

### Task 2 — Immersive homepage and settings handoff

Modify: index.html, src/demo.ts, src/demo.css, src/design-system.css, src/install.ts, tests/widget.spec.ts. Do not add a settings helper; validate the query inline against the existing SEASONS constant in src/install.ts.

- [x] Write failing browser tests for scene-first viewport (stage begins at header), real controls, count and setting handoff, 320px no overflow and reachable controls. Update existing homepage navigation assertions for the intentional new query and layout. Existing widget tests explicitly initialize their prior 24/christmas fixture, rather than mistaking demo defaults for widget API defaults.
- [x] Replace upper static article with one immersive stage, live DOM headline/counter, accessible loading/error feedback, actual interactive widget, then the dock. Use source summer tree asset as header mark and favicon, and five source tree PNGs for season icons. Keep #demo, #home-install, #visitors, #visitor-range, #season, #glow and #pause identifiers for existing links and controls. No auto audio or pointer parallax; actual character action is the main motion. Error fallback keeps installation and docs links usable; interaction controls stay disabled until ready and for empty population/upper bound as appropriate.
- [x] Seasonal buttons and detailed select synchronize to widget.season; live region announces manual greeting/invite/season changes only. Count remains clearly synthetic. Installation links always use `./install.html?season=<validated season>` and never transfer demo counts. On installer startup validate query against SEASONS, default invalid/missing to christmas, set matching checked radio before rendering preview/generating code. Locale switching must preserve this choice. Do not persist new settings or collect data.
- [x] On mobile, wrap header/dock and place intro in normal document flow above the stage; village stays fully visible without horizontally clipping UI. Avoid fixed overlays over canvas characters/links. Keep pause available, respect prefers-reduced-motion and maintain pointer scrolling.

### Task 3 — Verification and review

Modify: docs/features/visitor-village/spec.md, docs/features/visitor-village/design.md, docs/features/visitor-village/tasks.md, design-qa.md. Create: docs/assets/interactive-home/*.png (generated QA captures), docs/features/visitor-village/reviews/interactive-home-readiness-2026-11-26.md, docs/features/visitor-village/reviews/interactive-home-2026-11-26.md. Temporary screenshots/scripts may be saved outside the repo; no generated production media changes.

- [x] Run pnpm test, pnpm typecheck, pnpm build, pnpm test:release, pnpm test:e2e against final build. Preserve embedded behavior, exact count, offscreen sleep, count validation, independent instance lifetime, installer four locales and media fallback tests. Record actual counts only after execution.
- [x] Open selected visual and rendered local Chrome screenshot in one comparison input, full and focused regions, fix P0/P1/P2 mismatches and recapture. Record native source normalization, screenshots, interactions, console errors and final result in design-qa.md.
- [x] Fresh independent implementation review, fix material findings and reverify relevant flows. Do not claim real Tistory validation or public deployment. Keep local preview running for the user.

## Review Focus

1. Empty/5000 population: no invalid greetings, no 5001st arrival, count field errors retain prior state.
2. Paused/reduced/offscreen scenes: explicit response remains visible without restarting animation.
3. Pointer click versus touch scroll: blank ground does not navigate; badge remains independent.
4. Setting handoff: valid/invalid URL query, all four installer locales, no demo count in snippet.
5. Greeting lifecycle: season change, count shrink, interactive removal, reconnect and independent instances do not retain stale references.
