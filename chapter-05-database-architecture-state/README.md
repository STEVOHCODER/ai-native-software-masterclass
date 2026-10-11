# Chapter 05 — Database Architecture and State

## Outcome

You will model identity, tenancy, course progress, entitlements, audit history, and telemetry across a relational system and a document system. The design teaches when consistency matters, when flexible documents help, how row-level security differs from application checks, and how to migrate without downtime.

## 1. Provision local and hosted databases

Local Postgres for repeatable SQL practice:

```bash
docker run --name launchpad-postgres --detach \
  --env POSTGRES_USER=launchpad \
  --env POSTGRES_PASSWORD=change-this-locally \
  --env POSTGRES_DB=launchpad \
  --publish 5432:5432 postgres:17-alpine
```

Local MongoDB for telemetry practice:

```bash
docker run --name launchpad-mongo --detach \
  --publish 27017:27017 mongo:8
```

Hosted alternative: create a Supabase project and a MongoDB Atlas cluster, restrict network access, create least-privilege database users, and store connection strings in the secret manager. Never commit `DATABASE_URL` or a MongoDB URI.

## 2. Apply the relational schema

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

```bash
pnpm exec tsx -e "import { TelemetryModel } from './chapter-05-database-architecture-state/mongoose-model.ts'; console.log(TelemetryModel.schema.indexes())"
```

The model rejects unknown top-level fields, bounds property count, validates event names, indexes tenant/time lookups, and expires operational telemetry after a defined retention period.

## 5. Migration and backup drill

```bash
pg_dump "$DATABASE_URL" --format=custom --file=backup.dump
pg_restore --list backup.dump | Select-Object -First 20
mongodump --uri "$MONGODB_URI" --archive=telemetry.archive
```

Test restore into a separate database. Record recovery point objective, recovery time objective, backup owner, encryption status, and last restore date.

