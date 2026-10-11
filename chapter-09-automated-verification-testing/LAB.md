# Practical Lab 09 — Make the Agent Reproduce and Fix a Failure

## Starting point

Complete Lab 08. Work on a branch and save the current passing test output.

## Installation

```bash
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile
```

## Configuration

Set a bounded self-correction command:

```powershell
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:TEST_COMMAND = 'pnpm'
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:TEST_ARGS = 'test'
```

```bash
# What/why: Set a process environment variable so the next command receives explicit configuration.
export TEST_COMMAND=pnpm
# What/why: Set a process environment variable so the next command receives explicit configuration.
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
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run self-correct
# What/why: Read bounded diagnostic output so failures can be investigated without dumping an unbounded log.
Get-Content chapter-09-automated-verification-testing/last-diagnostics.log -Tail 80
```

macOS/Linux:

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run self-correct
# What/why: Read bounded diagnostic output so failures can be investigated without dumping an unbounded log.
tail -80 chapter-09-automated-verification-testing/last-diagnostics.log
```

## Expected result

The agent identifies the failed assertion, fixes implementation or fixture based on the contract, and ends with all tests passing. The diagnostic file contains bounded output and no secret values.

## Verification

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run lint
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run typecheck
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm audit --audit-level=high
```

## Troubleshooting

Do not let the agent delete the test, weaken the expected status, or retry indefinitely. If the failure is environmental, record it as environmental and reproduce it in CI rather than hiding it.

## Completion criteria

The learner can reproduce a failure, preserve the acceptance criterion, use bounded diagnostics, and demonstrate a clean test/type/lint/security run.

## Command annotations: what and why

```powershell
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:TEST_COMMAND = 'pnpm'                              # Tell the self-correction runner which executable to start.
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:TEST_ARGS = 'test'                                 # Give it the test subcommand as a bounded argument string.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run self-correct                                    # Capture output, write diagnostics, and return the test exit code.
# What/why: Read bounded diagnostic output so failures can be investigated without dumping an unbounded log.
Get-Content chapter-09-automated-verification-testing/last-diagnostics.log -Tail 80 # Read only the latest bounded diagnostic lines.
```

```bash
# What/why: Set a process environment variable so the next command receives explicit configuration.
export TEST_COMMAND=pnpm                                 # Select pnpm without hard-coding it into the runner.
# What/why: Set a process environment variable so the next command receives explicit configuration.
export TEST_ARGS=test                                    # Select the repository test script.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run self-correct                                    # Execute the feedback loop and fail when tests fail.
# What/why: Read bounded diagnostic output so failures can be investigated without dumping an unbounded log.
tail -80 chapter-09-automated-verification-testing/last-diagnostics.log # Inspect the end of the captured failure.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run lint                                             # Check static quality after the fix.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run typecheck                                        # Check strict TypeScript contracts.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test                                              # Run all Node tests.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm audit --audit-level=high                             # Fail on high/critical dependency advisories.
```

The environment variables make the runner reusable for another command. `-Tail`/`tail` limits displayed output so an agent receives useful diagnostics without dumping an unbounded or secret-bearing log.
