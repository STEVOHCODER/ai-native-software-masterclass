# Practical Lab 08 — Build and Prove a Persistent, Safe Backend Boundary

## Starting point

Complete Labs 01–07 and have local Postgres running from Lab 05. Start with the teaching server, then have the agent plan the persistence adapter.

## Installation

```bash
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile
```

## Configuration

```powershell
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:PORT = '3000'
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:ALLOWED_ORIGIN = 'http://localhost:5173'
```

```bash
# What/why: Set a process environment variable so the next command receives explicit configuration.
export PORT=3000
# What/why: Set a process environment variable so the next command receives explicit configuration.
export ALLOWED_ORIGIN=http://localhost:5173
```

Ask the agent:

```text
Inspect server.js, supabase-schema.sql, and concurrency.test.js.
Plan a repository adapter that persists course progress in Postgres.
Do not implement until you show the SQL transaction and authorization boundary.
The stale __v update must return 409 and no lost update is acceptable.
```

## Execution

Start the API:

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm start
```

Exercise normal and invalid requests:

```bash
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail http://127.0.0.1:3000/health
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress --header 'content-type: application/json' --header 'origin: http://localhost:5173' --data '{"progress":20,"__v":0}'
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress --header 'content-type: application/json' --header 'origin: http://localhost:5173' --data '{"progress":90,"__v":0}'
```

PowerShell:

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
$body = @{ progress = 20; __v = 0 } | ConvertTo-Json
# What/why: Use PowerShell to download or call the service with explicit error behavior.
Invoke-RestMethod http://127.0.0.1:3000/api/progress/course-progress -Method Patch -ContentType 'application/json' -Headers @{ Origin = 'http://localhost:5173' } -Body $body
```

## Expected result

The first write succeeds and increments `__v`. The second stale write returns `409 version_conflict`. HTML/control characters are normalized and malformed or oversized requests are rejected.

## Verification

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test:concurrency
```

Use the agent to add a test for a forbidden origin, then inspect the diff and rerun the suite.

## Troubleshooting

| Problem | Fix |
|---|---|
| `EADDRINUSE` | Stop the previous process or change `PORT` |
| write succeeds twice | Inspect compare-and-swap condition and test fixture |
| CORS/origin rejection | Match `ALLOWED_ORIGIN` exactly |
| database adapter loses updates | Make `__v` part of the atomic update predicate |

## Completion criteria

The API is reachable, invalid requests fail safely, concurrent stale writes are isolated, and the learner can explain how to replace the in-memory store with a transaction.

## Command annotations: what and why

```powershell
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:PORT = '3000'                                      # Set the HTTP port for this PowerShell process.
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:ALLOWED_ORIGIN = 'http://localhost:5173'           # Allow writes only from the local frontend origin.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm start                                               # Launch the Express server using the repository script.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
$body = @{ progress = 20; __v = 0 } | ConvertTo-Json    # Serialize a typed-looking PowerShell object as JSON.
# What/why: Use PowerShell to download or call the service with explicit error behavior.
Invoke-RestMethod http://127.0.0.1:3000/api/progress/course-progress -Method Patch -ContentType 'application/json' -Headers @{ Origin = 'http://localhost:5173' } -Body $body # Send an authenticated-origin-shaped update.
```

```bash
# What/why: Set a process environment variable so the next command receives explicit configuration.
export PORT=3000                                       # Configure the POSIX shell's server port.
# What/why: Set a process environment variable so the next command receives explicit configuration.
export ALLOWED_ORIGIN=http://localhost:5173            # Configure the accepted browser origin.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm start                                               # Start the same server on macOS/Linux.
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail http://127.0.0.1:3000/health                # Require a successful liveness response.
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress --header 'content-type: application/json' --header 'origin: http://localhost:5173' --data '{"progress":20,"__v":0}' # Send the first optimistic-lock update.
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress --header 'content-type: application/json' --header 'origin: http://localhost:5173' --data '{"progress":90,"__v":0}' # Send a stale second update that must be rejected.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test:concurrency                               # Run three competing writers and prove exactly one wins.
```

`--fail` makes `curl` exit non-zero for failed HTTP status codes. The `Origin` header exercises the browser-write policy. Both updates claim version `0`; only the first can atomically advance the record to version `1`.
