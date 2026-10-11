# Practical Lab 08 — Build and Prove a Persistent, Safe Backend Boundary

## Starting point

Complete Labs 01–07 and have local Postgres running from Lab 05. Start with the teaching server, then have the agent plan the persistence adapter.

## Installation


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm install --frozen-lockfile
```

## Configuration


Run these commands to complete the $env:PORT step and verify its result before continuing.

```powershell
$env:PORT = '3000'
$env:ALLOWED_ORIGIN = 'http://localhost:5173'
```


Run these commands to load the required configuration into the current process so the following tool can authenticate and use the selected service.

```bash
export PORT=3000
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


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm start
```

Exercise normal and invalid requests:


Run these commands to make the network request, fail visibly on HTTP errors, and inspect the returned service or deployment response.

```bash
curl --fail http://127.0.0.1:3000/health
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress --header 'content-type: application/json' --header 'origin: http://localhost:5173' --data '{"progress":20,"__v":0}'
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress --header 'content-type: application/json' --header 'origin: http://localhost:5173' --data '{"progress":90,"__v":0}'
```

PowerShell:


Run these commands to make the network request, fail visibly on HTTP errors, and inspect the returned service or deployment response.

```powershell
$body = @{ progress = 20; __v = 0 } | ConvertTo-Json
Invoke-RestMethod http://127.0.0.1:3000/api/progress/course-progress -Method Patch -ContentType 'application/json' -Headers @{ Origin = 'http://localhost:5173' } -Body $body
```

## Expected result

The first write succeeds and increments `__v`. The second stale write returns `409 version_conflict`. HTML/control characters are normalized and malformed or oversized requests are rejected.

## Verification


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
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


Run these commands to make the network request, fail visibly on HTTP errors, and inspect the returned service or deployment response.

```powershell
$env:PORT = '3000'                                      # Set the HTTP port for this PowerShell process.
$env:ALLOWED_ORIGIN = 'http://localhost:5173'           # Allow writes only from the local frontend origin.
pnpm start                                               # Launch the Express server using the repository script.
$body = @{ progress = 20; __v = 0 } | ConvertTo-Json    # Serialize a typed-looking PowerShell object as JSON.
Invoke-RestMethod http://127.0.0.1:3000/api/progress/course-progress -Method Patch -ContentType 'application/json' -Headers @{ Origin = 'http://localhost:5173' } -Body $body # Send an authenticated-origin-shaped update.
```


Run these commands to make the network request, fail visibly on HTTP errors, and inspect the returned service or deployment response.

```bash
export PORT=3000                                       # Configure the POSIX shell's server port.
export ALLOWED_ORIGIN=http://localhost:5173            # Configure the accepted browser origin.
pnpm start                                               # Start the same server on macOS/Linux.
curl --fail http://127.0.0.1:3000/health                # Require a successful liveness response.
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress --header 'content-type: application/json' --header 'origin: http://localhost:5173' --data '{"progress":20,"__v":0}' # Send the first optimistic-lock update.
curl --request PATCH http://127.0.0.1:3000/api/progress/course-progress --header 'content-type: application/json' --header 'origin: http://localhost:5173' --data '{"progress":90,"__v":0}' # Send a stale second update that must be rejected.
pnpm run test:concurrency                               # Run three competing writers and prove exactly one wins.
```

`--fail` makes `curl` exit non-zero for failed HTTP status codes. The `Origin` header exercises the browser-write policy. Both updates claim version `0`; only the first can atomically advance the record to version `1`.
