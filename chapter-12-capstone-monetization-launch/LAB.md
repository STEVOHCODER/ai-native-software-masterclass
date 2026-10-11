# Practical Lab 12 — Deliver the Cumulative AI-Native Product

## Starting point

Complete Labs 01–11. Use Launchpad Hub or a narrowly scoped product of your choice. The capstone must include one user journey, one AI-assisted operation, persistent state, a frontend, a secure API, tests, deployment evidence, and a rollback plan.

## Installation

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

