# Chapter 12 — Capstone and Monetization Launch

## Outcome

You will deliver a complete AI-assisted software product: define the customer, scaffold it, add an AI capability, persist state, build the frontend, secure the API, test races, deploy it, connect DNS, and package the result as a corporate service.

## 1. Three-hour capstone schedule

### 00:00–00:20 — Define the product

Write a one-page brief: user, painful workflow, measurable outcome, non-goals, data classification, AI role, success metric, and launch risk. Choose one vertical slice, not a platform.

### 00:20–00:50 — Bootstrap

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm create vite capstone-web --template react-ts
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm create hono capstone-api
# What/why: Create or select an isolated branch so experimental work does not modify the shared branch.
git switch -c feat/capstone-launch
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile
```

Create `.env.example`, add provider/database contracts, and commit the clean baseline.

### 00:50–01:30 — Build the vertical slice

Implement one authenticated flow from form input to validated API request, database write, AI-assisted result, and rendered response. Add loading, empty, error, retry, and offline states. Use the Chapter 02 gateway instead of calling a provider directly from React.

### 01:30–02:00 — Harden and verify

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run lint
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run typecheck
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test:concurrency
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm audit --audit-level=high
```

Inspect headers, rate limits, tenant boundaries, logs, secret exposure, backup evidence, and rollback procedure.

### 02:00–02:30 — Deploy

Build the Docker image, deploy the API, deploy the frontend, configure secrets, run migrations, and execute smoke tests. Do not paste production keys into an agent chat.

### 02:30–03:00 — Launch and sell

Connect DNS, verify TLS, publish the landing page, record the release SHA, set monitoring alerts, and send the first qualified outreach message. Keep a rollback window open.

## 2. Corporate package templates

| Package | Price | Deliverables | Timeline |
|---|---:|---|---|
| Architecture Audit | $1,000 | system map, risk register, 90-day plan, executive readout | 3–5 days |
| AI Product Sprint | $2,500 | vertical slice, provider gateway, data model, test plan, handoff | 1–2 weeks |
| Production Launch System | $5,000 | architecture, implementation, CI/CD, security review, observability, launch support | 2–4 weeks |

Specify assumptions for environments, integrations, data migration, seats, support hours, response times, and customer-owned dependencies. Use 50/50 or milestone billing, define change control, and exclude unbounded “make it production-ready” language.

## 3. System audit guide

Request architecture and data-flow diagrams, dependency inventory, credentials ownership, backup/restore evidence, deployment history, incident records, access list, retention policy, and vendor contracts. Grade each finding by impact, likelihood, exploitability, evidence quality, and remediation cost. Retest critical findings and obtain written acceptance for residual risk.

## 4. Consulting landing page conversion model

Hero: measurable outcome for a specific buyer. Proof: before/after metric or concrete artifact. Method: bounded phases and decision points. Offer: three packages with clear exclusions. Risk reversal: defined acceptance criteria and rollback. CTA: one qualification form asking only role, workflow, current stack, timeline, and budget range.

Do not claim guaranteed revenue, hide AI data handling, or request credentials through the marketing form. A credible launch offer sells reduced delivery risk and a verifiable operating system.

## 5. Agent-assisted delivery contract

The capstone team may assign agents to research, scaffold, implement, test, document, and prepare deployment artifacts. Assign one human owner to architecture, secrets, migrations, billing, security findings, and final release. Require every agent handoff to include changed files, assumptions, commands, failures, and rollback notes.

## 6. Buyer-facing technical handoff

Deliver an architecture diagram, environment matrix, runbook, threat model, data-retention statement, dependency inventory, backup evidence, CI status, deployment SHA, support boundary, and a recorded walkthrough. The buyer should be able to operate the system without access to the builder's personal accounts.

## Learn by executing

Run [`LAB.md`](LAB.md) to deliver the cumulative product. The brief fields and release commands are annotated with their purpose; [`EXPLAINED.md`](EXPLAINED.md) explains how the evidence proves the capstone works.
