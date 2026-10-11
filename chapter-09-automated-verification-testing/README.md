# Chapter 09 — Automated Verification and Testing

## Outcome

You will create a closed loop in which an AI coding agent can change code, run deterministic checks, receive bounded compiler/test diagnostics, and stop only when the acceptance criteria pass. The loop includes unit, integration, concurrency, accessibility, security, and build checks.

## 1. Test layers

| Layer | Question | Example |
|---|---|---|
| Unit | Does one function reject bad input? | sanitizer tests |
| Integration | Does HTTP behavior match the contract? | health/progress route |
| Concurrency | Does stale state lose safely? | three writers |
| Contract | Does the frontend/backend shape agree? | OpenAPI or schema |
| Security | Are headers, limits, and auth enforced? | malicious payload |
| Build | Can a clean machine reproduce it? | frozen install/build |

## 2. Run the gates

These commands run the project tool through the configured package-manager/runtime workflow.

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:concurrency
pnpm run build
pnpm run security:audit
```

Run the focused concurrency test directly while teaching:

These commands run a Node.js script or diagnostic using the project runtime.

```bash
node --test chapter-09-automated-verification-testing/concurrency.test.js
```

## 3. Three-user exercise

The test creates three independent writers that all read version `0`, then submit opposing progress values. Exactly one update succeeds, two receive `409`, and the final version is `1`. This tests the race boundary instead of merely asserting a helper function's return value.

Extend the lab with a fourth request using an invalid progress value, a malformed JSON request, a disallowed origin, an oversized body, and a payload containing HTML/control characters.

## 4. Self-correction protocol

These commands run the project tool through the configured package-manager/runtime workflow. They also read bounded diagnostic output so failures can be investigated without dumping an unbounded log.

```bash
pnpm run self-correct
Get-Content chapter-09-automated-verification-testing/last-diagnostics.log -Tail 80
```

`self-correct.js` captures both output streams, writes a bounded artifact, and exits non-zero so the agent cannot report success after a failing command. Do not allow an agent to automatically weaken tests, delete diagnostics, or loop indefinitely; set a maximum attempt count in the orchestrator.

## 5. Agent feedback loop

The reliable loop is:

```text
task brief → agent diff → static checks → focused test → integration test
→ security/accessibility checks → bounded diagnostics → human review
```

Persist each iteration's command, exit code, duration, changed files, and last diagnostic lines. Never feed an agent an entire secret-bearing log. Limit retries and stop when the same failure repeats.

## 6. Cross-platform runner commands

PowerShell:

These commands set a process environment variable so the next command receives explicit configuration. They also run the project tool through the configured package-manager/runtime workflow.

```powershell
$env:TEST_COMMAND = 'pnpm'
$env:TEST_ARGS = 'test'
pnpm run self-correct
```

macOS/Linux:

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
TEST_COMMAND=pnpm TEST_ARGS=test pnpm run self-correct
```

For CI, use the workflow in `.github/workflows/quality.yml`; for local agent work, run the narrowest test first and expand only when it passes.

## Learn by executing

Run [`LAB.md`](LAB.md) to reproduce and fix a failure with bounded diagnostics. The commands explain their runner/output roles inline; [`EXPLAINED.md`](EXPLAINED.md) explains the feedback loop.
