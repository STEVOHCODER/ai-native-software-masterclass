# Backend Operations Runbook

## Environment contract

```text
NODE_ENV=development|test|production
PORT=3000
ALLOWED_ORIGIN=https://app.example.com
DATABASE_URL=<secret>
MONGODB_URI=<secret>
```

Validate at startup, fail closed for missing production values, and redact values in diagnostics. Health checks must not reveal database URLs or provider keys.

## Graceful shutdown

Production servers should stop accepting requests, allow in-flight work to finish, close database pools, and exit within a deadline. A process manager or container orchestrator should restart a failed process; the application should not spin in an uncontrolled retry loop.

## Observability

Emit a request ID, route, method, status, latency, tenant ID hash, provider, model, and error class. Do not emit authorization headers, cookies, prompt bodies, connection strings, or raw personal data.
