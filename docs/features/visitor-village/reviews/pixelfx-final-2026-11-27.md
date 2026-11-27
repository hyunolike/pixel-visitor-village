# Fresh whole-worktree pixelfx review

Reviewer pixelfx_final_review used a fresh context, read the code-reviewer prompt, complete plan, changed runtime/build/docs and new asset/model/export sources. It inspected actual spring desktop, arrival390 and autumn320 captures. It did not rerun tests. Critical:none.

Important1: suppressed count updates while offscreen remain eligible after suppression is removed before reveal. Fix both queue-time eligibility and invalidation while suppression applies, retaining presentation-time gating.
Important2: optional image decode is a startup dependency and optional texture-copy exceptions destroy the core renderer. Install optional art after core readiness, with connection/lifetime guard and local rollback/fallback.
Important3: removal coverage only destroys an instance that failed to load effects. Add actual two-successful-instance disposal and live compositor restoration coverage.

Minor deferred: play() draws even when playback state is unchanged, and some attribute handlers also render. This is extra work on state updates, not an extra running ticker. It is a follow-up performance optimization; this fix pass does not expand into it.

Declined to judge:none. Verdict:proceed after fixes. Direct fix pass completed below; no second reviewer loop.


## Direct fix evidence

Before changes, suppressed offscreen reading reproduced active instead of idle; holding only the optional image left no core canvas; failing only the512×376instance texture copy destroyed the core canvas. All three regressions failed for the reported reasons. Queue-time eligibility plus suppression invalidation/presentation gating fix the first. Post-core asynchronous optional setup, a current-connection guard and per-instance local rollback fix the other two.

After fixes, seven targeted browser tests pass, including all three suppression modes (paused, reduced, effects off), delayed decode after detach, optional copy failure, failure retry, actual two-successful-renderer disposal and exact nonblank effect on/off/re-enable compositor comparisons. The added successful-neighbor test passed before fixes as the implementation already copied source textures; this closes a test gap rather than claiming a reproduced ownership defect. Unit174/174 and type/build pass. Final full suite109/109 passes in1.4minutes; unit174,release14,type/build/format/whitespace also pass. No unresolved Important or Critical finding; deferred minor remains as above.


## Public verification

Preview https://blog-pixelfx.pixel-visitor-village.pages.dev/examples/blog (immutable4f45198c),56file hashes and module CORS/MIME/nosniff/404 pass. Anonymous1000/390/320px flows pass all five seasons,arrival,pause/off/reduced with no page/console errors, overflow or service asset requests. Source module is self-contained. Production metadata remains f9315b7; no commit/push/PR/promotion. Private Tistory installation remains unverified.
