# Unified pages review and verification

Baseline c1b2d9b6022a397cbeea1fcd09de4e1c0427177f; branch feat/unified-village-pages. User scope is extending the selected homepage design to installer and usage guide. After the local handoff, the user requested a commit, push and PR against main. Public deployment is not part of this PR-creation step.

## Readiness

Three fresh-context read-only EGM Stage9 reviewers read the implementation-readiness/codebase-details/style personas and supplied standard. Findings: define exact replacement demo/release copy and its repository source; define which installer navigation link receives the shared gold action and its compact treatment. Both were clarified in unified-pages-plan.md. The readiness reviewer re-read the revised plan and reported zero remaining material Blocker/Major findings. Parent conversation was not forwarded; host instruction-file exclusion is unverified.

## Final independent review

A separate fresh-context read-only reviewer inspected the full diff and new shared CSS/guide CSS. It found one Important issue: mobile absolute navigation lost the original positioned/z-indexed header. Restored those properties on the shared header. Extended the four-locale menu regression to check menu/header alignment within1px, zero page scroll and viewport visibility. The new assertion failed against the faulty build with a715px separation, before the fix. The reviewer re-read the fix and tests and reported zero remaining Critical/Important findings; no tests were run by the reviewer.

## Visual corrections

All pages use the source summer tree, forest header, gold action and centralized cream/paper tokens. First captures exposed an89px English compact header and insufficient active action contrast (1.17:1). Compact brand line height was corrected; active gold action text is explicitly dark. The shared action contrast regression requires4.5:1. Guide remains static, keeps all section anchors and local table/code overflow, and corrects obsolete demo/release copy.

## Verification status

Unit151/151, release tooling14/14 and build/type checks passed. Full Chrome85/85 passed in1.6minutes, including strengthened menu placement, shared header/action contrast and no-JS guide checks. The first full browser run had an artifact-file collision from an overlapping runner; no clean pass is claimed from that run. Final browser execution was sequential.

Nine main page/viewport captures have pageerror0/console error0, no horizontal overflow. Extra700/701/820/1024px checks also fit. English320px installer header is77px; Japanese/Chinese/Korean are65px. Open menus align within the header's1px border and retain scrollY0. Source/actual images were composited and opened for full and focused comparison; latest root design-qa.md says final result: passed.

Evidence: [common headers](../../../assets/unified-pages/headers.png), [guide before/after](../../../assets/unified-pages/docs-before-after.png), [installer](../../../assets/unified-pages/install-desktop.png), [guide](../../../assets/unified-pages/docs-desktop.png), [compact guide](../../../assets/unified-pages/docs-small.png), [English menu](../../../assets/unified-pages/install-en-menu.png). All source/actual captures use density1 and identical viewport dimensions.

The independent widget bundle SHA256 matches the current deployed bundle byte-for-byte:0d78b32090ff1441a235473607de9d6a09e672ea1cece6085e260bf35ff6b13e. README thumbnail b6c8955e5a9202bc585cde996905a288ea99beeb1d14fc3d4967f2ab264fd4f9 and intro video a81f6f53e9071bee6c77d70d95c5c04dbe5d280d5549ca2f9364411b2e3f02d7 remain unchanged. Documentation local files/public font licenses and same-document anchors resolve. No installation algorithms, dependencies or original art changed.
