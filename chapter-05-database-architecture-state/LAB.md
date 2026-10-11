# Practical Lab 05 — Provision, Migrate, Query, and Safely Expose a Database

## Starting point

Complete Labs 01–04. Install Docker and choose local services first; hosted Supabase/Atlas accounts are optional.

## Installation

```bash
docker pull postgres:17-alpine
docker pull mongo:8
```

Supabase CLI:

```powershell
winget install Supabase.CLI
```

```bash
brew install supabase/tap/supabase
```

MongoDB tools:

```powershell
winget install MongoDB.Server MongoDB.Shell
```

```bash
brew install mongosh mongodb-atlas
```

## Configuration

```bash
docker run --name launchpad-postgres --detach --env POSTGRES_USER=launchpad --env POSTGRES_PASSWORD=local-only-password --env POSTGRES_DB=launchpad --publish 5432:5432 postgres:17-alpine
docker run --name launchpad-mongo --detach --publish 27017:27017 mongo:8
export DATABASE_URL=postgresql://launchpad:local-only-password@127.0.0.1:5432/launchpad
export MONGODB_URI=mongodb://127.0.0.1:27017/launchpad
```

PowerShell:

```powershell
docker run --name launchpad-postgres --detach --env POSTGRES_USER=launchpad --env POSTGRES_PASSWORD=local-only-password --env POSTGRES_DB=launchpad --publish 5432:5432 postgres:17-alpine
docker run --name launchpad-mongo --detach --publish 27017:27017 mongo:8
$env:DATABASE_URL = 'postgresql://launchpad:local-only-password@127.0.0.1:5432/launchpad'
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/launchpad'
```

## Execution

Apply the schema:

```bash
psql "$DATABASE_URL" --set ON_ERROR_STOP=1 --file chapter-05-database-architecture-state/supabase-schema.sql
psql "$DATABASE_URL" -c "select tablename, rowsecurity from pg_tables where schemaname = 'public';"
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
psql "$DATABASE_URL" -c "select count(*) from public.profiles;"
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

