# Interactive homepage verification

Scope: VV-HOME-001–005, selected Living Village Square concept. Branch feat/interactive-village-home, clean baseline20f76be1293f4086b8add65095ca78899a7fc548. The implementation was verified locally, then the user requested a commit/push and PR against main. No public deployment or real Tistory skin validation is claimed.

## Delivered behavior

The homepage is a full-width scene with an integrated season/action dock. Actual production characters wave and show an existing heart balloon when tapped; a keyboard button provides the same response. Invitations add exactly one model visitor at the foreground path. Demo count defaults to12/summer and is clearly synthetic. Validated season selection reaches the existing installer preview and generated code, preserving locale changes. Existing embedded widgets keep full-frame repository links by default; homepage interaction is opt-in. Empty/capacity states, pause/reduced motion, touch scrolling and lifecycle cleanup remain covered.

No new dependencies or replacement pixel artwork were added. The favicon uses the existing summer tree, fixing a console404 discovered during final QA. The original README thumbnail SHA256 is b6c8955e5a9202bc585cde996905a288ea99beeb1d14fc3d4967f2ab264fd4f9; introduction video SHA256 is a81f6f53e9071bee6c77d70d95c5c04dbe5d280d5549ca2f9364411b2e3f02d7. Both match the baseline.

## Actual validation

- pnpm test:151/151,6 files. Five new model cases cover explicit greetings, active lifetime, social exclusion, hit testing across scales/overlaps/edges, and invitations through5000.
- pnpm typecheck and pnpm build: passed. Both app and independent widget bundles build.
- pnpm test:release:14/14.
- pnpm test:e2e:84/84, Chrome,49.6seconds. Five new homepage flows cover actual pixel reaction with HTML feedback excluded, invitation identity/count, setting handoff, reduced/empty/capacity states,320px and greeting cleanup. Existing media, cross-origin widget, count validation, offscreen, touch and four-locale installer regressions pass.
- The final favicon-only HTML adjustment was built and separately checked in Chrome; it does not change the already verified JS/CSS behavior.
- git diff --check: passed before final report update; repeated on final handoff.

Browser evidence: [desktop](../../../assets/interactive-home/desktop.png), [320px](../../../assets/interactive-home/small.png), [complete page](../../../assets/interactive-home/desktop-full.png), [same-size source/implementation comparison](../../../assets/interactive-home/comparison.png), [type detail](../../../assets/interactive-home/type-comparison.png), [dock detail](../../../assets/interactive-home/dock-comparison.png). Native1487×1058,1440×1024,390×844 and320×850 are captured with deviceScaleFactor1; no viewport overflow. Detailed comparison history is in root design-qa.md. Actual production sprites and the user's original small-monument constraint take precedence over generative differences in scenery.

## Independent review

Readiness review used three fresh-context EGM reviewers. Scale conversion, automatic social pairing exclusion and file boundaries were clarified before implementation; the readiness reviewer re-audited and reported zero remaining material findings. See [readiness report](interactive-home-readiness-2026-11-26.md).

A separate fresh-context final reviewer read the full uncommitted diff, plan/spec and relevant source. It reported no Critical/Important runtime issues and made no edits or test claims. Rendered visual fidelity and test outcomes were explicitly outside that review; these were separately verified here. Parent transcripts were not supplied; host instruction-file exclusion remains unverified.

## Corrections during verification

Fixed range flex overflow, display scale, cloud/copy overlap, feedback/badge overlap, pressed-state contrast, exact control height and input-boundary contrast. Widget regression fixtures now explicitly initialize their prior24/christmas embedded mode; homepage tests independently assert the new12/summer defaults. Canvas pixel assertions use compositor screenshots with the HTML feedback surface hidden, avoiding WebGL drawing-buffer timing and false differences caused by notifications. Lifecycle checks compare the same interactive presentation after opt-out, rather than comparing embedded labels to the homepage.

Local preview: http://127.0.0.1:5199/ . The user requested the PR after reviewing the local handoff. This branch is prepared for review; merge and deployment have not been performed. No Cloudflare token changes are needed; the existing main-merge automation remains available.
