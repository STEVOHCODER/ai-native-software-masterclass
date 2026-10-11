# Chapter 05 — Database Architecture and State

## Outcome

You will model identity, tenancy, course progress, entitlements, audit history, and telemetry across a relational system and a document system. The design teaches when consistency matters, when flexible documents help, how row-level security differs from application checks, and how to migrate without downtime.

## 1. Provision local and hosted databases

Local Postgres for repeatable SQL practice:

These commands start the local container with explicit name, environment, port, and lifecycle settings.

```bash
docker run --name launchpad-postgres --detach \
  --env POSTGRES_USER=launchpad \
  --env POSTGRES_PASSWORD=change-this-locally \
  --env POSTGRES_DB=launchpad \
  --publish 5432:5432 postgres:17-alpine
```

Local MongoDB for telemetry practice:

These commands start the local container with explicit name, environment, port, and lifecycle settings.

```bash
docker run --name launchpad-mongo --detach \
  --publish 27017:27017 mongo:8
```

Hosted alternative: create a Supabase project and a MongoDB Atlas cluster, restrict network access, create least-privilege database users, and store connection strings in the secret manager. Never commit `DATABASE_URL` or a MongoDB URI.

## 2. Apply the relational schema

These commands use the database CLI to apply, inspect, or verify state in the selected environment.

```bash
psql "$DATABASE_URL" --set ON_ERROR_STOP=1 --file chapter-05-database-architecture-state/supabase-schema.sql
```

Supabase SQL editor users should run the file as one migration and inspect the resulting policies. Verify:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public';
```

The schema uses `auth.uid()` for ownership, not a client-supplied user ID. In a multi-tenant extension, add `organization_id` to every tenant-owned row and include it in every policy predicate and index.

## 3. State ownership decisions

| Data | System | Consistency |
|---|---|---|
| Auth identity and profile | Supabase/Postgres | Strong |
| Course progress and entitlements | Supabase/Postgres | Strong |
| Request traces and model latency | MongoDB Atlas | Eventual/append-only |
| Search index | Derived store | Rebuildable |
| Billing provider status | Provider + local mirror | Reconciled |

Do not use telemetry as an authorization source. Do not put mutable billing truth only in a browser or document log.

## 4. Mongoose telemetry lab

These commands run the project tool through the configured package-manager/runtime workflow.

```bash
pnpm exec tsx -e "import { TelemetryModel } from './chapter-05-database-architecture-state/mongoose-model.ts'; console.log(TelemetryModel.schema.indexes())"
```

The model rejects unknown top-level fields, bounds property count, validates event names, indexes tenant/time lookups, and expires operational telemetry after a defined retention period.

## 5. Migration and backup drill

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
pg_dump "$DATABASE_URL" --format=custom --file=backup.dump
pg_restore --list backup.dump | Select-Object -First 20
mongodump --uri "$MONGODB_URI" --archive=telemetry.archive
```

Test restore into a separate database. Record recovery point objective, recovery time objective, backup owner, encryption status, and last restore date.

## 6. CLI installation and MCP connectivity

Supabase CLI options:

These commands install the selected windows package so the required tool is available to later labs. They also install the developer tool through scoop without requiring machine-wide installation.

```powershell
winget install Supabase.CLI
scoop install supabase
```

These commands install the required developer tool through homebrew on macos. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
brew install supabase/tap/supabase
npx supabase --version
```

Authenticate without putting a token in shell history:

These commands set a process environment variable so the next command receives explicit configuration. They also use the database cli to apply, inspect, or verify state in the selected environment.

```powershell
$env:SUPABASE_ACCESS_TOKEN = Read-Host 'Supabase token'
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also use the database cli to apply, inspect, or verify state in the selected environment.

```bash
read -rsp 'Supabase token: ' SUPABASE_ACCESS_TOKEN; export SUPABASE_ACCESS_TOKEN; echo
supabase link --project-ref <project-ref>
supabase db push
```

MongoDB tools:

These commands install the selected Windows package so the required tool is available to later labs.

```powershell
winget install MongoDB.Server MongoDB.Shell
```

These commands install the required developer tool through homebrew on macos. They also use the database cli to apply, inspect, or verify state in the selected environment.

```bash
brew install mongosh mongodb-atlas
mongosh "$MONGODB_URI"
atlas auth login
atlas projects list
```

Use `supabase db diff`, `supabase db lint`, `mongosh`, and `atlas` from an agent only in a sandbox project. Production migration and backup commands require an explicit approval gate.

## 7. Database MCP pattern

Connect an agent to a **read-only** database MCP server first. The MCP configuration should reference an environment variable:

```json
{
  "mcpServers": {
    "supabase-readonly": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_READONLY_URL}"],
      "env": { "DATABASE_READONLY_URL": "${DATABASE_READONLY_URL}" }
    }
  }
}
```

PowerShell registration for an agent that supports JSON configuration:

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
$config = "$HOME\.continue\config.json"
$json = Get-Content $config -Raw | ConvertFrom-Json
$json | Add-Member -NotePropertyName mcpServers -NotePropertyValue ([pscustomobject]@{}) -Force
$json.mcpServers | Add-Member -NotePropertyName supabase-readonly -NotePropertyValue ([pscustomobject]@{
  command = 'npx'
  args = @('-y', '@modelcontextprotocol/server-postgres', '${DATABASE_READONLY_URL}')
}) -Force
$json | ConvertTo-Json -Depth 20 | Set-Content $config
```

Never expose a service-role key to an MCP server used by an agent. Use a database role that can select only the tables needed for the lesson.

## Learn by executing

Run [`LAB.md`](LAB.md) to provision, migrate, query, and expose a read-only database tool. The command blocks include inline explanations; [`EXPLAINED.md`](EXPLAINED.md) covers schema intent.
