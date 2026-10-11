# Practical Lab 05 — Provision, Migrate, Query, and Safely Expose a Database

## Starting point

Complete Labs 01–04. Install Docker and choose local services first; hosted Supabase/Atlas accounts are optional.

## Installation

```bash
# What/why: Download the pinned container image before creating a reproducible local service.
docker pull postgres:17-alpine
# What/why: Download the pinned container image before creating a reproducible local service.
docker pull mongo:8
```

Supabase CLI:

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install Supabase.CLI
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
brew install supabase/tap/supabase
```

MongoDB tools:

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install MongoDB.Server MongoDB.Shell
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
brew install mongosh mongodb-atlas
```

## Configuration

```bash
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --name launchpad-postgres --detach --env POSTGRES_USER=launchpad --env POSTGRES_PASSWORD=local-only-password --env POSTGRES_DB=launchpad --publish 5432:5432 postgres:17-alpine
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --name launchpad-mongo --detach --publish 27017:27017 mongo:8
# What/why: Set a process environment variable so the next command receives explicit configuration.
export DATABASE_URL=postgresql://launchpad:local-only-password@127.0.0.1:5432/launchpad
# What/why: Set a process environment variable so the next command receives explicit configuration.
export MONGODB_URI=mongodb://127.0.0.1:27017/launchpad
```

PowerShell:

```powershell
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --name launchpad-postgres --detach --env POSTGRES_USER=launchpad --env POSTGRES_PASSWORD=local-only-password --env POSTGRES_DB=launchpad --publish 5432:5432 postgres:17-alpine
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --name launchpad-mongo --detach --publish 27017:27017 mongo:8
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:DATABASE_URL = 'postgresql://launchpad:local-only-password@127.0.0.1:5432/launchpad'
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/launchpad'
```

## Execution

Apply the schema:

```bash
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
psql "$DATABASE_URL" --set ON_ERROR_STOP=1 --file chapter-05-database-architecture-state/supabase-schema.sql
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
psql "$DATABASE_URL" -c "select tablename, rowsecurity from pg_tables where schemaname = 'public';"
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
mongosh "$MONGODB_URI" --eval "db.telemetry.insertOne({tenantId:'lab',actorId:'learner',event:'lab.completed',source:'api',properties:{chapter:5},createdAt:new Date()})"
```

Connect a read-only MCP server to a sandbox database:

```json
{
  "mcpServers": {
    "postgres-readonly": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_READONLY_URL}"]
    }
  }
}
```

Restart the agent, ask it to list tables, and then ask it to explain the profile query. Do not give the agent a service-role key or write-capable production URI.

## Expected result

Postgres contains `profiles` with RLS enabled. MongoDB contains one telemetry document. The agent discovers the read-only database tool and can inspect schema without changing rows.

## Verification

```bash
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
psql "$DATABASE_URL" -c "select count(*) from public.profiles;"
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
mongosh "$MONGODB_URI" --quiet --eval "db.telemetry.countDocuments({event:'lab.completed'})"
```

## Troubleshooting

| Error | Fix |
|---|---|
| connection refused | `docker ps`, then `docker logs launchpad-postgres` |
| `psql` not found | Install PostgreSQL client tools or run `docker exec` |
| RLS blocks query | Use an authenticated Supabase context; never disable RLS to make a demo pass |
| MCP cannot connect | Check the URI, `npx` availability, and restart the agent |
| Atlas network error | Add your current IP temporarily and remove it after the lab |

## Completion criteria

The learner can start both services, apply the relational schema, insert/read telemetry, demonstrate RLS, and use an agent through a read-only database integration.

## Command annotations: what and why

```bash
# What/why: Download the pinned container image before creating a reproducible local service.
docker pull postgres:17-alpine                         # Download the pinned PostgreSQL image before creating a container.
# What/why: Download the pinned container image before creating a reproducible local service.
docker pull mongo:8                                    # Download the MongoDB image used for telemetry practice.
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --name launchpad-postgres --detach --env POSTGRES_USER=launchpad --env POSTGRES_PASSWORD=local-only-password --env POSTGRES_DB=launchpad --publish 5432:5432 postgres:17-alpine # Start Postgres with local credentials, a stable name, and host port mapping.
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --name launchpad-mongo --detach --publish 27017:27017 mongo:8 # Start MongoDB in the background and expose its development port.
# What/why: Set a process environment variable so the next command receives explicit configuration.
export DATABASE_URL=postgresql://launchpad:local-only-password@127.0.0.1:5432/launchpad # Tell CLI/tools where the local relational database is.
# What/why: Set a process environment variable so the next command receives explicit configuration.
export MONGODB_URI=mongodb://127.0.0.1:27017/launchpad # Tell CLI/tools where the local telemetry database is.
```

PowerShell uses the same container flags but stores environment variables in the current process:

```powershell
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --name launchpad-postgres --detach --env POSTGRES_USER=launchpad --env POSTGRES_PASSWORD=local-only-password --env POSTGRES_DB=launchpad --publish 5432:5432 postgres:17-alpine # Create the relational service.
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --name launchpad-mongo --detach --publish 27017:27017 mongo:8 # Create the document service.
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:DATABASE_URL = 'postgresql://launchpad:local-only-password@127.0.0.1:5432/launchpad' # Configure the Postgres client for this shell.
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/launchpad' # Configure the Mongo client for this shell.
```

```bash
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
psql "$DATABASE_URL" --set ON_ERROR_STOP=1 --file chapter-05-database-architecture-state/supabase-schema.sql # Apply every SQL statement and stop at the first error.
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
psql "$DATABASE_URL" -c "select tablename, rowsecurity from pg_tables where schemaname = 'public';" # Verify tables and row-level security flags.
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
mongosh "$MONGODB_URI" --eval "db.telemetry.insertOne({tenantId:'lab',actorId:'learner',event:'lab.completed',source:'api',properties:{chapter:5},createdAt:new Date()})" # Insert one realistic telemetry document without opening an interactive shell.
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
psql "$DATABASE_URL" -c "select count(*) from public.profiles;" # Verify the relational table is queryable.
# What/why: Use the database CLI to apply, inspect, or verify state in the selected environment.
mongosh "$MONGODB_URI" --quiet --eval "db.telemetry.countDocuments({event:'lab.completed'})" # Count the document just inserted while suppressing shell noise.
```

The schema command creates the authorization boundary; the verification queries prove it exists. The telemetry insert demonstrates flexible event data without using it as authorization state.

```json
{
  "mcpServers": {
    "postgres-readonly": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_READONLY_URL}"]
    }
  }
}
```

`command` selects the MCP process, `-y` permits the ephemeral package install, the server package implements PostgreSQL tools, and the environment URI points at a read-only role. This is why the agent can inspect a sandbox without receiving a service-role key.
