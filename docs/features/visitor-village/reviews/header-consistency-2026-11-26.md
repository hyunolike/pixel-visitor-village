# Header consistency correction

Base: f78dc7f2a23a8e12dbc8b34f62abbb97afbaa6be (merged PR #14). Branch: fix/consistent-service-header. Scope: VV-HEADER-001–003, correcting the user's observed difference between home, installer and guide headers. After the verified local handoff, the user requested a commit, push and pull request against main. Merge and public deployment are separate from this PR-creation step.

## Root cause and regression evidence

The previous iteration shared identity styles but retained three header structures. Home placed its action outside navigation, docs placed it inside a second mobile row, and installer had its own locale/menu arrangement. The previous QA acceptance of different row counts is superseded by the user's correction.

The new cross-page geometry/order test failed against the baseline: home had no shared navigation ID or toggle. After using the same slots and controller, it passes across 320/390/700/701/1440px, including opening, Escape, hash target focus and responsive focus transitions. No-JS guide tests now explicitly require all four navigation links to stay visible.

An extra browser check suggested by the independent reviewer found English/Japanese headers wrapping to114px at701px. A second regression reproduced expected77/received114 before the follow-up. Shortened labels retain the Korean-destination notice, and flex:none prevents brand compression. All32 viewport/locale combinations now show65px (≤700) or77px (>700), with no brand/navigation overlap or page overflow.

## Independent review

One fresh-context read-only reviewer received the exact requirement/file scope and baseline, without the parent conversation. Initial source review found no concrete Critical/Important/Minor issues and suggested the translated701px check. After the observed wrap, the reviewer re-read the narrower follow-up and updated requirement and reported no new findings. No files were modified or browser tests run by the reviewer. This is a scoped correction review, not a new full-product EGM approval or real Tistory validation.

## Verification and visual evidence

- Unit151/151 and release tooling14/14 passed; final type/app/widget build passed.
- Final full Chrome regression87/87 passed in54.4seconds, including the translated701px regression, no-JS navigation, responsive focus transitions, four-locale code/state preservation and existing widget contracts. Earlier86/86 was an intermediate run before the translated-boundary check was added.
- Nine actual Chrome captures (three pages ×1440/390/320) have zero page/console errors and no page overflow. Four compact installer locales show65px headers and properly anchored menus.
- Supplementary Chrome checks cover all four locales at320/390/700/701/750/820/1024/1440. Brand text stays clear of adjacent controls; all header heights and page widths pass.
- Opened and inspected the combined [desktop](../../../assets/shared-header/desktop.png), [mobile](../../../assets/shared-header/mobile.png) and [open mobile menu](../../../assets/shared-header/mobile-menu.png) comparisons. Active-page underline/gold state is the only Korean header variation.
- README thumbnail SHA256 b6c8955e5a9202bc585cde996905a288ea99beeb1d14fc3d4967f2ab264fd4f9 and intro video SHA256 a81f6f53e9071bee6c77d70d95c5c04dbe5d280d5549ca2f9364411b2e3f02d7 are unchanged.

Local preview: http://127.0.0.1:5199/docs/ (also / and /install.html). Public service runs the previous release until this change is merged and its automatic deployment succeeds.
