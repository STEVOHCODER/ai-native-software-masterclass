# Database Tooling Runbook

## Local service lifecycle

```powershell
docker start launchpad-postgres launchpad-mongo
docker ps --filter "name=launchpad"
docker logs --tail 50 launchpad-postgres
```

```bash
docker start launchpad-postgres launchpad-mongo
docker ps --filter name=launchpad
docker logs --tail 50 launchpad-mongo
```

## Safe role setup

Create separate roles for migrations, application writes, telemetry writes, and agent read-only access. Never reuse the Supabase service-role key in a browser, CI log, or MCP configuration. Rotate credentials after a classroom cohort.

## Agent query contract

An agent may inspect schema, explain query plans, generate a migration, and run a local dry-run. It may not drop a table, alter production data, apply a migration to production, or print connection strings. Add an approval step between generated SQL and execution.
