# Supabase Asset Inventory (2025-11-13)

Snapshot of every Supabase-related artifact in the repo, tagged with an action so we can confidently delete or refactor without surprises.

## SQL & Database Assets

| Path | Action | Notes |
| --- | --- | --- |
| `supabase/schema-standard-sql.sql` | Replace | PascalCase tables + duplicated policies; supersede with new canonical migration. |
| `supabase/schema.sql` | Delete | Same content as above without RLS; redundant once we ship the new schema. |
| `supabase/migrate-to-snake-case.sql` | Delete | Prisma-era conversion script; no longer relevant after fresh schema. |
| `supabase/migrate-to-snake-case-safe.sql` | Delete | Safe variant of the same Prisma migration; remove. |
| `supabase/drop-all-tables.sql` | Delete | Dangerous reset script tied to legacy schema. |
| `supabase/auth-migration.sql` | Replace | Trigger inserts into `"User"` while app expects lower-case; fold into new migration. |
| `supabase/seed.sql` | Review | Contains demo data tied to PascalCase table names; update or remove after schema rewrite. |
| `worker/schema.sql` | Delete | Worker-only table definition (`daily_agg`) we plan to drop with the workers. |

## Application Supabase Clients

| Path | Action | Notes |
| --- | --- | --- |
| `src/lib/supabase-server.ts` | Delete | Legacy singleton; all code now uses `createSupabaseServer`. |
| `src/lib/supabase-ssr.ts` | Refactor | Rename/move into `lib/supabase/server.ts` using reference pattern. |
| `src/lib/database.types.ts` | Regenerate | Generated against PascalCase tables; regenerate after schema change. |

## Workers & Supporting Code

| Path | Action | Notes |
| --- | --- | --- |
| `worker/` | Delete | Analytics worker depends on removed tables & service role key. |
| `worker-llm/` | Delete | LLM worker + OpenAI dependency slated for removal. |
| `WORKER_LLM_SETUP.md` | Delete | Documentation tied to removed worker. |
| `worker/README.md` | Delete | Same as above. |

## Scripts & Tooling

| Path | Action | Notes |
| --- | --- | --- |
| `scripts/check-supabase-setup.js` | Delete | Checks env + references outdated schema steps. |

## Documentation

| Path | Action | Notes |
| --- | --- | --- |
| `AUTH_SETUP.md` | Replace | Superseded by new streamlined setup guide. |
| `AUTH_FLOW_DIAGRAM.md` | Review | Keep if still accurate; otherwise fold into new docs. |
| `DATABASE_MIGRATION_GUIDE.md` | Delete | Prisma migration narrative no longer relevant. |
| `SETUP_FIX_INSTRUCTIONS.md` | Delete | Troubleshooting for outdated schema; remove. |
| `LANDING_PAGE_AUTH_FIXES.md` | Review | Mixed landing/auth instructions; confirm relevance post-cleanup. |
| `PASSWORD_AUTH_SETUP.md` | Review | If the new guide covers this, delete. |
| `QUICK_START.md` | Review | Ensure it aligns with the simplified project; adjust later. |
| `README.md` | Replace | Rewrite once new flow is implemented. |

## Environment & Config

| Path | Action | Notes |
| --- | --- | --- |
| `env.example` | Replace | Reduce to `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| `.env.local` (expected) | Update | New instructions will reference only the two required vars. |

## Middleware & Auth Flow Touchpoints

| Path | Action | Notes |
| --- | --- | --- |
| `src/middleware.ts` | Refactor | Rewire to use new `createServerClient` helper; confirm route matching. |
| `src/app/auth/callback/route.ts` | Refactor | Switch to centralized server client helper. |
| `src/app/(auth)/login/page.tsx` | Refactor | Swap in shared browser client helper. |
| `src/app/(auth)/signup/page.tsx` | Refactor | Same as above. |
| `src/app/(auth)/logout/route.ts` | Refactor | Align redirect host handling with new helpers. |

## Data Fetching Surfaces

| Path | Action | Notes |
| --- | --- | --- |
| `src/app/dashboard/page.tsx` | Refactor | Move queries into new data modules/hooks. |
| `src/app/entries/actions.ts` | Refactor | Update to consume server helper + lower-case tables. |
| `src/app/entries/page.tsx` | Refactor | Same. |
| `src/app/bets/actions.ts` | Refactor | Same. |
| `src/app/bets/page.tsx` | Refactor | Same. |

---

This list is the source of truth while executing the reset; update statuses in follow-up commits as items are deleted or rebuilt.

