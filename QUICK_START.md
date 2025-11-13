# Quick Start: Run This SQL Now! 🚀

## Your App is Ready - Just Need Database Setup

Everything has been converted to **standard PostgreSQL** (no Prisma!).

## 📋 What to Do Now

### Step 1: Run This SQL

Go to your **Supabase Dashboard → SQL Editor** and run ONE of these:

#### Option A: You Have Existing Data (Migrate) ⭐ RECOMMENDED
```sql
-- Copy EVERYTHING from: supabase/migrate-to-snake-case-safe.sql
-- This safely converts userId → user_id, createdAt → created_at, etc.
-- Won't fail if some columns don't exist
```

#### Option B: Starting Fresh (Clean Install) 🧹
**Step B1:** Drop all tables first
```sql
-- Copy EVERYTHING from: supabase/drop-all-tables.sql
-- This deletes all existing tables
```

**Step B2:** Create clean schema
```sql
-- Copy EVERYTHING from: supabase/schema-standard-sql.sql
-- This creates a clean database with standard SQL naming
```

### Step 2: Restart Dev Server
```bash
rm -rf .next
npm run dev
```

### Step 3: Test It! 
Open `http://localhost:3000` and try:
- Creating an entry
- Creating a bet
- Viewing the dashboard

## ✅ What's Been Fixed

| Feature | Status |
|---------|--------|
| Standard SQL naming (user_id, not userId) | ✅ Done |
| No Prisma dependencies | ✅ Done |
| Row Level Security policies | ✅ Ready to deploy |
| TypeScript types | ✅ Updated |
| All queries | ✅ Fixed |
| Error handling | ✅ Improved |

## 🎯 Key Changes

### Database Columns (Standard SQL)
- `userId` → `user_id`
- `createdAt` → `created_at`
- `resolvedAt` → `resolved_at`

### Benefits
✅ Standard PostgreSQL conventions
✅ Works with any SQL tool
✅ No ORM lock-in
✅ Cleaner, more maintainable
✅ Industry best practices

## 📁 Files Created

1. **`supabase/migrate-to-snake-case.sql`** - Migration for existing data
2. **`supabase/schema-standard-sql.sql`** - Clean schema for new databases
3. **`DATABASE_MIGRATION_GUIDE.md`** - Detailed guide

## 🐛 Troubleshooting

### Still seeing errors?

1. **Check columns were renamed:**
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'Entry' AND table_schema = 'public';
   ```
   Should show `user_id` (not `userId`)

2. **Check RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE schemaname = 'public';
   ```
   Should all show `true`

3. **Verify you're logged in:**
   ```sql
   SELECT auth.uid();
   ```
   Should return your user ID

## 💡 Next Steps

Once the SQL is run:
1. Dashboard should load without errors
2. You can create entries and bets
3. Everything should work smoothly!

Need more details? See `DATABASE_MIGRATION_GUIDE.md`

