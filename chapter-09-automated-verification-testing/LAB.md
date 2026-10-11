# Practical Lab 09 — Make the Agent Reproduce and Fix a Failure

## Starting point

Complete Lab 08. Work on a branch and save the current passing test output.

## Installation

```bash
pnpm install --frozen-lockfile
```

## Configuration

Set a bounded self-correction command:

```powershell
$env:TEST_COMMAND = 'pnpm'
$env:TEST_ARGS = 'test'
```

```bash
export TEST_COMMAND=pnpm
export TEST_ARGS=test
```

## Execution

Introduce a controlled failure by changing the expected conflict count in a temporary branch, then ask the agent:

```text
Run the test suite. Do not change tests first.
Classify the failure, inspect the implementation, make the smallest fix,
rerun the focused test, then the complete suite. Report the original failure,
changed files, and final commands.
```

Run:

```bash
pnpm run self-correct
Get-Content chapter-09-automated-verification-testing/last-diagnostics.log -Tail 80
```

macOS/Linux:

```bash
pnpm run self-correct
tail -80 chapter-09-automated-verification-testing/last-diagnostics.log
```

## Expected result

The agent identifies the failed assertion, fixes implementation or fixture based on the contract, and ends with all tests passing. The diagnostic file contains bounded output and no secret values.

## Verification

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm audit --audit-level=high
```

## Troubleshooting

Do not let the agent delete the test, weaken the expected status, or retry indefinitely. If the failure is environmental, record it as environmental and reproduce it in CI rather than hiding it.

## Completion criteria

The learner can reproduce a failure, preserve the acceptance criterion, use bounded diagnostics, and demonstrate a clean test/type/lint/security run.

