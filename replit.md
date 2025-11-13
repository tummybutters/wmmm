# World Model Journal

## Overview

World Model Journal is a Next.js 14 application for tracking beliefs, predictions, and calibrating your worldview. Users create journal entries, make probabilistic predictions (bets), and view analytics on their reasoning patterns over time. The app features a public landing page with a minimal, mystic aesthetic and a protected dashboard area for authenticated users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14 with App Router
- Server Components by default for data fetching and layout
- Client Components (`'use client'`) for interactive UI (forms, charts, animations)
- Server Actions for mutations instead of traditional API routes
- File-based routing under `src/app/`

**Authentication Flow**:
- Public landing page at `/` (bypasses auth middleware)
- Protected routes redirect unauthenticated users to `/login`
- Multiple auth methods: password, magic link (email OTP), GitHub OAuth
- Middleware (`src/middleware.ts`) handles auth state and redirects
- Auth callback route (`/auth/callback`) exchanges OAuth codes for sessions

**UI Component Strategy**:
- Tailwind CSS for styling with custom color palette
- shadcn/ui-inspired components in `src/components/ui/`
- Landing page uses Framer Motion for scroll animations
- Charts isolated to Client Components to avoid SSR issues (Recharts)
- Playfair Display serif font for headings, Inter for body text

**Data Patterns**:
- Server Components fetch data directly from Supabase
- Client Components receive data as props
- Forms submit via Server Actions (no client-side fetch calls)
- `revalidatePath()` used after mutations to update cached data

### Backend Architecture

**Database**: PostgreSQL via Supabase
- Tables: `User`, `Entry`, `Bet`
- All table/column names use snake_case (e.g., `user_id`, `created_at`)
- Row Level Security (RLS) policies enforce user data isolation
- Auth trigger automatically creates User records on signup

**Data Access**:
- Three Supabase client factories:
  - `createServerClient()` for Server Components and Actions
  - `createClient()` for Client Components
  - `createMiddlewareClient()` for middleware auth checks
- Type-safe database queries via generated `database.types.ts`
- Zod schemas validate Server Action inputs

**Business Logic**:
- `src/lib/metrics.ts`: Brier score calculation, bet statistics
- `src/lib/text.ts`: Word frequency analysis with stopword filtering
- Server Actions in `app/[feature]/actions.ts` handle CRUD operations
- No traditional API routes - all mutations via Server Actions

### External Dependencies

**Authentication**: Supabase Auth
- Email/password authentication
- Magic link (OTP) authentication
- OAuth providers (GitHub configured)
- Session management via cookies (handled by @supabase/ssr)

**Database**: Supabase PostgreSQL
- Hosted PostgreSQL database
- Real-time subscriptions available (not currently used)
- Connection via @supabase/supabase-js client library

**Charts**: Recharts
- Client-side rendering only (SSR incompatible)
- Used for word frequency bar charts on dashboard
- Isolated in `WordFrequencyChart.tsx` Client Component

**Animations**: Framer Motion
- Used exclusively on landing page
- Scroll-triggered entrance animations
- `whileInView` with `once: true` for performance

**Validation**: Zod
- Schema validation for Server Action inputs
- Type inference for form data parsing

**Required Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous/public key