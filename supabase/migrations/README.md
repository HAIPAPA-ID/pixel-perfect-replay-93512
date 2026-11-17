# Supabase migrations

This folder stores reviewed, version-controlled SQL migrations for the HAIPAPA Supabase project.

## Important: existing production database

The connected production database already contains live tables, policies, functions, triggers, and data. Historical migration SQL bodies have not yet been recovered into this repository. Do not invent historical migrations or run a guessed baseline against production.

## Future migration rules

1. Add each schema change as a new timestamped SQL file.
2. Use a descriptive snake_case name, for example `20261118120000_add_pos_transaction_rpc.sql`.
3. Review SQL before applying it to production.
4. Verify each change against the live database after applying it.
5. Never commit passwords, service-role keys, access tokens, or production data.
6. Keep local environment files out of Git; use `.env.example` with placeholders only.

## Baseline recovery

Before treating this repository as reproducible from migrations alone, export and review the current schema and reconstruct a safe baseline in a separate development environment. Do not overwrite production data.
