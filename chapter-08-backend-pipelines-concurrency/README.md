# Chapter 08 — Backend Pipelines and Concurrency

## Outcome

You will construct a secure Express API from request boundary to persistence boundary. The route demonstrates JSON limits, security headers, origin policy, XSS-oriented input normalization, strict validation, centralized error handling, health checks, and optimistic locking with `__v`.

## 1. Install and run

```bash
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm start
```

PowerShell:

```powershell
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:PORT = '3000'
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:ALLOWED_ORIGIN = 'http://localhost:5173'
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm start
```

Verify the process:

```bash
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail http://127.0.0.1:3000/health
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail http://127.0.0.1:3000/api/progress/course-progress
```

## 2. Request pipeline

1. Node binds to loopback in local mode.
2. Express disables fingerprinting and adds Helmet headers.
3. JSON parsing rejects oversized and malformed bodies.
4. Origin policy rejects unsafe browser writes.
5. Route middleware loads the record or returns `404`.
6. Validation checks version, range, type, length, and control characters.
7. The compare-and-swap update accepts exactly one matching version.
8. Central error middleware returns safe status codes and logs server-side diagnostics.

The in-memory map is a teaching adapter. In a multi-process deployment, replace it with a database transaction such as `updateOne({ _id, __v: expected }, { $set, $inc: { __v: 1 } })` and require the database write count to equal one.

## 3. Exercise: observe optimistic locking

```bash
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress \
  --header "content-type: application/json" \
  --header "origin: http://localhost:5173" \
  --data '{"progress":25,"__v":0}'
```

Repeat with `__v:0`; the response must be `409` and include the current version. Never accept a client version by silently overwriting the newer record.

## 4. Production hardening

Add authentication middleware, tenant authorization, rate limiting, request IDs, structured logging, graceful shutdown, and a real persistence adapter before deployment. Terminate TLS at the edge, but still validate forwarded headers against a trusted proxy configuration. Do not return internal exception messages to clients.

## 5. Multi-file route layout

When the teaching server grows, split it into:

```text
src/
  app.ts                 # middleware composition and error boundary
  config.ts              # validated environment
  routes/progress.ts     # HTTP contract
  controllers/progress.ts
  services/progress.ts   # business rules
  repositories/progress.ts
  security/input.ts
  observability/logger.ts
```

The route must not contain database queries, provider calls, or secret reads. Controllers translate HTTP to typed service calls; repositories own transactions; the app boundary owns error mapping.

## 6. Cross-platform API operations

Windows PowerShell:

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
$payload = @{ progress = 50; __v = 0 } | ConvertTo-Json
# What/why: Use PowerShell to download or call the service with explicit error behavior.
Invoke-RestMethod http://127.0.0.1:3000/api/progress/course-progress `
  -Method Patch -ContentType 'application/json' `
  -Headers @{ Origin = 'http://localhost:5173' } -Body $payload
```

macOS/Linux:

```bash
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail-with-body --request PATCH http://127.0.0.1:3000/api/progress/course-progress \
  --header 'content-type: application/json' \
  --header 'origin: http://localhost:5173' \
  --data '{"progress":50,"__v":0}'
```

Use `npm`, `pnpm`, or `bun` consistently within one deployment. Do not let an agent silently change package managers or lockfiles.

## 7. Database and AI agent boundaries

The API is the policy enforcement point. An AI agent can generate a migration or provider call, but it must invoke the same authenticated service boundary as the product. Never give a frontend MCP tool direct write access to Postgres, MongoDB, Stripe, or DNS.

## Learn by executing

Run [`LAB.md`](LAB.md) to exercise the backend, invalid requests, and optimistic locking. Every shell command is annotated with its HTTP/security purpose; [`EXPLAINED.md`](EXPLAINED.md) explains the request pipeline.
