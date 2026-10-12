# Launchpad Hub Masterclass

Launchpad Hub is a thirteen-chapter curriculum for building and launching AI-assisted websites, applications, APIs, internal tools, and software products. Each chapter contains an executable artifact, a teaching narrative, a lab, and a verification gate.

## Course path

0. Make a real model answer and audit your coding agents.
1. Wire a safe local workstation.
2. Build a multi-provider AI gateway.
3. Control coding agents and IDE extensions.
4. Protect Git history and agent checkpoints.
5. Model relational state and telemetry.
6. Build a responsive React design system.
7. Expose safe MCP tools and custom skills.
8. Secure an API and isolate write races.
9. Close the loop with automated verification.
10. Deploy reproducible cloud artifacts.
11. Configure DNS, TLS, WAF, and edge caching.
12. Launch, audit, package, and sell the system.

Chapter 00 comes first on purpose: it proves the learner can reach a model and run at least one coding agent before any tooling is trusted with their code.

## Fast start


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
npm ci
npm run validate:environment
npm run lint
npm run typecheck
npm run test
npm run build
```

Copy `.env.example` to `.env` for local work. The example contains names only; it never contains credentials.

## Teaching method

Every chapter uses the same loop: explain the architecture, install the tool, implement a bounded slice, run a failure exercise, inspect the diff, and record evidence. Learners should be able to explain why a choice was made, reproduce it on a clean machine, and roll it back.

## Practical lab contract

Each chapter contains a `LAB.md`. A lab is not complete because a command is printed; it is complete only when the learner can perform the operation and show evidence:

| Evidence | Meaning |
|---|---|
| Starting point | The learner knows what must already exist |
| Installation | The tool is installed or the account/service is reached |
| Configuration | A real file path, setting, or environment variable is created |
| Execution | The learner runs the tool or completes the UI action |
| Expected result | The observable success state is defined |
| Verification | A command, test, health check, or screenshot proves it |
| Troubleshooting | A failure can be diagnosed without guessing |
| Completion criteria | The learner knows when to proceed |

The project is cumulative. Labs 01–04 establish the workstation, AI gateway, agent, and Git controls. Labs 05–08 build data, frontend, MCP, and backend capabilities. Labs 09–12 test, deploy, secure, and package the same product. When an external account, paid API, domain, or cloud service is unavailable, the lab provides a local or read-only fallback and labels the unverified portion.

Validate the lab structure before publishing course material:


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
node scripts/validate-labs.js
```
