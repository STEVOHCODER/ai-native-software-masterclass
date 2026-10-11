# Chapter 09: Automated Verification Testing

Closed-loop agent development has four gates: deterministic unit tests, concurrency tests, type/lint checks, and a diagnostic feedback artifact. Tests must assert externally observable behavior, especially `409 Conflict` for stale versions, rather than inspecting implementation details.

Run `node --test concurrency.test.js`. `self-correct.js` runs the configured test command, captures stdout and stderr, writes a bounded diagnostic file, and exits non-zero when the suite fails so CI cannot silently accept a broken iteration.

