# Chapter 05: Database Architecture and State

Use Supabase/Postgres for strongly relational identities, entitlements, and audit records. Use MongoDB Atlas for high-volume telemetry whose shape evolves independently of transactional records. Keep identifiers opaque, enforce tenant ownership at the database boundary, and never trust a client-supplied role.

Apply `supabase-schema.sql` through a migration runner. The policy assumes Supabase Auth and uses `auth.uid()` for ownership. The Mongoose model validates telemetry dimensions, limits payload size, and adds TTL cleanup for operational events.

