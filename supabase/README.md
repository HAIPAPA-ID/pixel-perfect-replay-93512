# HAIPAPA Supabase project

This directory contains the Supabase CLI configuration and project documentation.

## Database change workflow

This repository is connected to Lovable. Per `AGENTS.md`, database schema changes
and migration files are managed through Lovable rather than edited directly in
GitHub. Use Lovable to request schema changes, then review the generated changes
and verify them against the connected Supabase project.

## Existing production database

The connected HAIPAPA Supabase project already contains live tables, policies,
functions, triggers, and data. Historical SQL migration bodies have not yet been
recovered into this repository. Do not invent replacement historical migrations
or run a guessed baseline against production.

## Security

- Never commit passwords, service-role keys, access tokens, or production data.
- Local `.env` files are ignored by Git.
- The browser application may use only the Supabase publishable key; enforce
  access with database RLS and server-side functions.
- Before a production schema change, review its impact and verify the result.
