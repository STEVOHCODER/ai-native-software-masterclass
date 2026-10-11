# Practical Lab 09 — Make the Agent Reproduce and Fix a Failure

## Starting point

Complete Lab 08. Work on a branch and save the current passing test output.

## Installation


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm install --frozen-lockfile
```

## Configuration

Set a bounded self-correction command:


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```powershell
$env:TEST_COMMAND = 'pnpm'
$env:TEST_ARGS = 'test'
```


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

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


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm run self-correct
Get-Content chapter-09-automated-verification-testing/last-diagnostics.log -Tail 80
```

macOS/Linux:


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm run self-correct
tail -80 chapter-09-automated-verification-testing/last-diagnostics.log
```

## Expected result

The agent identifies the failed assertion, fixes implementation or fixture based on the contract, and ends with all tests passing. The diagnostic file contains bounded output and no secret values.

## Verification


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

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

## Command annotations: what and why


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```powershell
$env:TEST_COMMAND = 'pnpm'                              # Tell the self-correction runner which executable to start.
$env:TEST_ARGS = 'test'                                 # Give it the test subcommand as a bounded argument string.
pnpm run self-correct                                    # Capture output, write diagnostics, and return the test exit code.
Get-Content chapter-09-automated-verification-testing/last-diagnostics.log -Tail 80 # Read only the latest bounded diagnostic lines.
```


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
export TEST_COMMAND=pnpm                                 # Select pnpm without hard-coding it into the runner.
export TEST_ARGS=test                                    # Select the repository test script.
pnpm run self-correct                                    # Execute the feedback loop and fail when tests fail.
tail -80 chapter-09-automated-verification-testing/last-diagnostics.log # Inspect the end of the captured failure.
pnpm run lint                                             # Check static quality after the fix.
pnpm run typecheck                                        # Check strict TypeScript contracts.
pnpm run test                                              # Run all Node tests.
pnpm audit --audit-level=high                             # Fail on high/critical dependency advisories.
```

The environment variables make the runner reusable for another command. `-Tail`/`tail` limits displayed output so an agent receives useful diagnostics without dumping an unbounded or secret-bearing log.
