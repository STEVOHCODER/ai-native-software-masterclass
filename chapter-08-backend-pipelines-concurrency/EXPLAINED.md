# Chapter 08 Backend Walkthrough

`express()` creates the application. `helmet()` adds security response headers. `express.json({limit:'32kb', strict:true})` rejects oversized or non-object JSON. The origin middleware protects browser writes. `cleanText` removes control characters and angle brackets before storage. `requireRecord` loads state or returns `404`. The patch route validates `__v` and progress, compares the expected version, increments it, and returns `409` on a stale writer. The final error middleware maps malformed JSON and unexpected exceptions to safe responses.

The `curl` and PowerShell blocks perform the same HTTP operation with different shell syntax. The first correct version succeeds; the second stale version demonstrates optimistic locking. The production adapter must move the compare-and-swap predicate into a database transaction.

