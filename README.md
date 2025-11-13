# World Model Journal

A Next.js 14 app for tracking beliefs, predictions, and calibrating your worldview. Built with Supabase, TypeScript, and Tailwind CSS.

## Features

- **Landing Page**: Clean, minimal public landing page with mystic aesthetic
- **CRUD Entries**: Create journal entries, beliefs, and notes
- **Prediction Tracking**: Make probabilistic predictions and resolve them
- **Analytics Dashboard**: View Brier score, bet statistics, and word frequency analysis
- **Server Actions**: Fast, type-safe mutations without API routes
- **Clean Architecture**: Modular lib utilities, reusable UI components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion (landing page)
- **Fonts**: Inter (body) + Playfair Display (headings)
- **Validation**: Zod
- **Charts**: Recharts
- **Language**: TypeScript (strict mode)

## Project Structure

```
world-model-journal/
├── supabase/
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Demo data
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with nav
│   │   ├── page.tsx        # Landing page (public)
│   │   ├── dashboard/
│   │   │   └── page.tsx    # Analytics & metrics
│   │   ├── entries/
│   │   │   ├── page.tsx    # Entries list
│   │   │   ├── actions.ts  # Server actions
│   │   │   ├── create-form.tsx
│   │   │   └── entry-card.tsx
│   │   └── bets/
│   │       ├── page.tsx    # Bets list
│   │       ├── actions.ts  # Server actions
│   │       ├── create-form.tsx
│   │       └── bet-card.tsx
│   ├── lib/
│   │   ├── supabase-server.ts  # Supabase client
│   │   ├── database.types.ts   # Type definitions
│   │   ├── stopwords.ts        # Word filtering
│   │   ├── text.ts             # Text analysis
│   │   └── metrics.ts          # Brier score calculation
│   └── components/
│       ├── landing/         # Landing page components
│       │   ├── Hero.tsx
│       │   ├── About.tsx
│       │   ├── HowItWorks.tsx
│       │   ├── Quote.tsx
│       │   ├── CTA.tsx
│       │   └── Footer.tsx
│       └── ui/              # shadcn/ui components
│           ├── card.tsx
│           ├── button.tsx
│           ├── input.tsx
│           ├── label.tsx
│           ├── textarea.tsx
│           └── select.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Data Model

### User
- `id` (uuid, primary key)
- `email` (text, unique)
- `created_at` (timestamptz)

### Entry
- `id` (uuid, primary key)
- `user_id` (foreign key → User)
- `kind` (enum: 'journal' | 'belief' | 'note')
- `text` (text)
- `created_at` (timestamptz)

### Bet
- `id` (uuid, primary key)
- `user_id` (foreign key → User)
- `source` (enum: 'personal')
- `statement` (text)
- `probability` (float, 0-1)
- `status` (enum: 'open' | 'resolved')
- `outcome` (boolean, nullable)
- `created_at` (timestamptz)
- `resolved_at` (timestamptz, nullable)

## Setup Instructions

### 1. Prerequisites

- Node.js 20+
- A Supabase account (free tier works)

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the contents of `supabase/schema.sql`
5. Click "Run" to create tables
6. Copy and paste the contents of `supabase/seed.sql`
7. Click "Run" to insert demo data

### 3. Get Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public key**

### 4. Clone & Install

```bash
cd /Users/tommybutcher/wmmm
npm install
```

### 5. Configure Environment

Create a `.env.local` file in the root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DEMO_USER_ID=00000000-0000-0000-0000-000000000001
```

Replace `your-project-url` and `your-anon-key-here` with your actual Supabase credentials.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Landing Page

The root route (`/`) displays a minimal, mystic landing page for visitors:

- **Aesthetic**: Dark gradient background (indigo-950 → black → slate-900), teal-purple accent gradient
- **Sections**: Hero, About, How It Works (3 cards), Quote, CTA, Footer
- **Typography**: Playfair Display serif for headings, Inter for body text
- **Animations**: Subtle fade-in on scroll using Framer Motion
- **Mobile**: Fully responsive design
- **Customization**: All text easily editable in component files (see `src/components/landing/README.md`)

The landing page is self-contained and doesn't require authentication.

## Usage

### Dashboard
- View your Brier score (prediction accuracy metric)
- See open vs resolved bet counts
- Analyze top words from your entries (last 7 days)
- Browse recent bets in a table

### Entries
- **Create**: Select entry type (journal/belief/note) and write content
- **Edit**: Click "Edit" on any entry card
- **Delete**: Click "Delete" with confirmation

### Bets
- **Create**: Write a prediction statement and probability (0-1)
- **Edit**: Modify statement or probability for open bets
- **Resolve**: Mark whether prediction came true
- **Delete**: Remove any bet

## Key Features

### Brier Score
The dashboard calculates your Brier score:
```
Brier Score = mean((probability - outcome)²)
```
- 0 = perfect calibration
- 1 = worst possible
- Only calculated from resolved bets

### Word Frequency
- Analyzes entries from last 7 days
- Filters stopwords (common words like "the", "and")
- Shows top 15 words in bar chart
- Helps identify recurring themes

### Server Actions
All CRUD operations use Next.js Server Actions:
- No client-side fetch calls
- Automatic revalidation
- Type-safe with Zod validation
- Optimistic UI updates

## Development Notes

### No Auth (MVP Constraint)
This MVP uses a single demo user (hardcoded UUID). For production:
1. Add Supabase Auth
2. Replace `DEMO_USER_ID` with session user
3. Add Row Level Security (RLS) policies

### Supabase Row Level Security
Currently disabled for simplicity. To enable:

```sql
ALTER TABLE "Entry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bet" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own entries"
ON "Entry" FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own bets"
ON "Bet" FOR ALL
USING (auth.uid() = user_id);
```

### Type Generation
For production, generate types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id your-project-id > src/lib/database.types.ts
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DEMO_USER_ID`
4. Deploy

### Production Checklist

- [ ] Enable Supabase RLS policies
- [ ] Add authentication (Supabase Auth)
- [ ] Set up error monitoring (Sentry)
- [ ] Add rate limiting
- [ ] Implement pagination for large datasets
- [ ] Add tests (Playwright, Vitest)

## Background Workers

The application includes two independent worker processes for analytics and AI insights:

### Analytics Worker (`worker/`)

Runs daily at 2 AM UTC to compute deterministic analytics:
- Word frequency analysis from entries
- Bet count statistics (open/resolved)
- Brier score calculation
- Writes to `daily_agg` table

```bash
npm run analyze        # Run analytics for yesterday
npm run analyze:build  # Build production bundle
npm run analyze:run    # Execute production bundle
```

### AI Insight Worker (`worker-llm/`)

Runs daily at 3 AM UTC (after analytics) to generate LLM-powered insights:
- Analyzes themes and entities from user activity
- Identifies worldview assumptions
- Detects sentiment and cognitive biases
- Writes to `insights_llm` table

```bash
npm run insight:run    # Run AI insights for yesterday
npm run insight:build  # Build production bundle
npm run insight:exec   # Execute production bundle
```

**Required Environment Variables:**
```bash
# .env (for workers)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-api-key
```

**Scheduling with Cron:**
```bash
# Analytics at 2 AM UTC daily
0 2 * * * cd /path/to/wmmm && node dist/worker/index.js

# AI Insights at 3 AM UTC daily
0 3 * * * cd /path/to/wmmm && node dist/worker-llm/index.js
```

See `worker-llm/README.md` for detailed AI worker documentation.

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Analytics Worker
npm run analyze      # Run analytics for yesterday (dev)
npm run analyze:build # Build for production
npm run analyze:run  # Run production build

# AI Insight Worker
npm run insight:run  # Run AI insights for yesterday (dev)
npm run insight:build # Build for production
npm run insight:exec # Run production build
```

## Architecture Decisions

### Why Server Actions?
- Eliminates API route boilerplate
- Automatic request deduplication
- Progressive enhancement friendly
- Type-safe by default

### Why No Prisma?
- Supabase client is simpler for this MVP
- Direct SQL for schema migrations
- Less abstraction overhead
- Faster iteration

### Why shadcn/ui?
- Copy-paste components (no npm bloat)
- Full customization control
- Tailwind-native styling
- Production-ready accessibility

## Future Enhancements

- [ ] Multi-user support with auth
- [ ] Entry/bet search and filters
- [ ] Export data to CSV/JSON
- [ ] Calibration curve visualization
- [ ] Bet resolution reminders
- [ ] Mobile app (React Native)

## License

MIT

## Author

Built by a Senior Software Engineer @ NVIDIA as a personal side project.

---

**Slice 1 Complete**: CRUD + Dashboard + Analytics ✓

