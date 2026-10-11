# Launchpad Hub Masterclass

Launchpad Hub is a twelve-chapter curriculum for building and launching AI-assisted websites, applications, APIs, internal tools, and software products. Each chapter contains an executable artifact, a teaching narrative, a lab, and a verification gate.

## Course path

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

## Fast start

```bash
pnpm install --frozen-lockfile
pnpm run validate:environment
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

Copy `.env.example` to `.env` for local work. The example contains names only; it never contains credentials.

## Teaching method

Every chapter uses the same loop: explain the architecture, install the tool, implement a bounded slice, run a failure exercise, inspect the diff, and record evidence. Learners should be able to explain why a choice was made, reproduce it on a clean machine, and roll it back.

