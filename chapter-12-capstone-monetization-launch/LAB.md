# Practical Lab 12 — Deliver the Cumulative AI-Native Product

## Starting point

Complete Labs 01–11. Use Launchpad Hub or a narrowly scoped product of your choice. The capstone must include one user journey, one AI-assisted operation, persistent state, a frontend, a secure API, tests, deployment evidence, and a rollback plan.

## Installation

These commands create or select an isolated branch so experimental work does not modify the shared branch. They also install project dependencies using the selected package manager and its lockfile policy.

```bash
git switch -c feat/capstone-launch
pnpm install --frozen-lockfile
```

## Configuration

Create a capstone brief:

```text
Product:
Primary user:
Painful workflow:
One measurable outcome:
AI operation:
Persistent entities:
Security/data classification:
Non-goals:
Acceptance tests:
Deployment target:
Rollback target:
```

Give the brief to the installed agent. Require it to inspect all existing chapters, produce a plan, create a file list, and wait for approval before installing dependencies or changing infrastructure.

## Execution

Build in vertical slices:

1. Frontend input and visible state.
2. Validated API route.
3. Database write/read.
4. AI gateway call with bounded timeout.
5. Telemetry event.
6. Concurrency and error tests.
7. Docker/cloud deployment.
8. DNS/TLS verification.

At each slice:

These commands inspect or change version-controlled project state in an auditable way. They also run the project tool through the configured package-manager/runtime workflow.

```bash
git diff --check
pnpm run typecheck
pnpm run lint
pnpm run test
```

## Expected result

A real user can complete the selected workflow from the deployed frontend, the AI operation returns a useful result, state persists, failures are visible, and the team can demonstrate a rollback.

## Verification

Complete `CAPSTONE-RUNBOOK.md` and record:

- screen recording or screenshots of the working flow;
- exact Git SHA and deployment URL;
- test/type/lint/audit output;
- database migration and backup evidence;
- WAF/DNS/TLS checks;
- known limitations and next release scope.

## Troubleshooting

If the scope cannot be completed in three hours, cut features rather than quality gates. Keep one working vertical slice and document deferred work. Never claim a paid provider, database, MCP tool, or deployment was verified when it was not.

## Completion criteria

The learner can explain the architecture, reproduce the setup, show the agent's contribution and review trail, demonstrate the product, prove the important failure modes, and hand the system to another operator.

## Command annotations: what and why

These commands create or select an isolated branch so experimental work does not modify the shared branch. They also install project dependencies using the selected package manager and its lockfile policy. They also inspect or change version-controlled project state in an auditable way. They also run the project tool through the configured package-manager/runtime workflow.

```bash
git switch -c feat/capstone-launch                       # Isolate the final product work from main.
pnpm install --frozen-lockfile                            # Recreate the exact dependency graph before implementation.
git diff --check                                          # Catch whitespace errors after each vertical slice.
pnpm run typecheck                                        # Prove strict TypeScript contracts remain valid.
pnpm run lint                                             # Prove static quality and repository conventions remain valid.
pnpm run test                                             # Execute the automated behavior suite.
```

The capstone commands are repeated after each slice so a failure is attributed to a small change. This is faster and safer than waiting until deployment to discover which layer broke.

```text
Product:                         # Names the system the agent is expected to build.
Primary user:                    # Identifies who receives the value.
Painful workflow:                # Defines the problem rather than a vague feature list.
One measurable outcome:           # Sets the acceptance metric.
AI operation:                     # States where the model is used and what it must return.
Persistent entities:              # Identifies data that must survive a restart.
Security/data classification:     # Determines credential, privacy, and retention requirements.
Non-goals:                        # Prevents the agent from expanding scope.
Acceptance tests:                 # Converts the brief into verifiable behavior.
Deployment target:                # Names the environment to configure.
Rollback target:                  # Defines how to recover from a failed release.
```

The brief is configuration for the agent and the human team: every field prevents a different class of ambiguity. The final evidence commands and records prove delivery rather than merely producing source files.
