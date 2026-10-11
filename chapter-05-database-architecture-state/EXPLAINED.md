# Chapter 05 Database Walkthrough

## What each part means

`docker run --name` gives each local service a stable identifier. `--detach` leaves it running; `--env` supplies initialization values; `--publish` maps the host port to the container port; the final image selects the database version. `psql --set ON_ERROR_STOP=1 --file` applies the schema and stops on the first SQL error. The verification query checks table names and RLS flags. `mongosh --eval` executes one telemetry insert and count without opening an interactive shell.

The Supabase SQL creates a profile table tied to `auth.users`, adds indexes, defines an update timestamp trigger, enables RLS, and permits a user to read/write only the row whose ID equals `auth.uid()`. The Mongoose schema rejects unknown top-level fields, validates event/source strings, limits properties, indexes tenant/time access, and expires telemetry after retention.

The MCP JSON uses `command`, `args`, and an environment-sourced URI. The URI must point to a read-only role; the agent can inspect and explain data but cannot mutate production state.
