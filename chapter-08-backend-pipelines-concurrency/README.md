# Chapter 08 — Backend Pipelines and Concurrency

## Outcome

You will construct a secure Express API from request boundary to persistence boundary. The route demonstrates JSON limits, security headers, origin policy, XSS-oriented input normalization, strict validation, centralized error handling, health checks, and optimistic locking with `__v`.

## 1. Install and run

```bash
pnpm install --frozen-lockfile
pnpm start
```

PowerShell:

```powershell
$env:PORT = '3000'
$env:ALLOWED_ORIGIN = 'http://localhost:5173'
pnpm start
```

Verify the process:

```bash
curl --fail http://127.0.0.1:3000/health
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
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress \
  --header "content-type: application/json" \
  --header "origin: http://localhost:5173" \
  --data '{"progress":25,"__v":0}'
```

Repeat with `__v:0`; the response must be `409` and include the current version. Never accept a client version by silently overwriting the newer record.

## 4. Production hardening

Add authentication middleware, tenant authorization, rate limiting, request IDs, structured logging, graceful shutdown, and a real persistence adapter before deployment. Terminate TLS at the edge, but still validate forwarded headers against a trusted proxy configuration. Do not return internal exception messages to clients.

