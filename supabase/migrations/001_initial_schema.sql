-- ============================================
-- WM (Worldview Monitor) - Complete Schema
-- Safe migration: checks existing state
-- ============================================

-- 1. Create tables if they don't exist (lowercase names)
-- ============================================

-- Users table (synced with auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  created_at timestamptz default now() not null
);

-- Entries table
create table if not exists public.entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  kind text check (kind in ('journal', 'belief', 'note')) not null,
  text text not null,
  created_at timestamptz default now() not null
);

-- Bets table
create table if not exists public.bets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  source text default 'personal' not null,
  statement text not null,
  probability numeric not null check (probability >= 0 and probability <= 1),
  status text check (status in ('open', 'resolved')) default 'open' not null,
  outcome boolean,
  created_at timestamptz default now() not null,
  resolved_at timestamptz
);

-- 2. Migrate data from old tables if they exist
-- ============================================

-- Migrate User → users (if old table exists)
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'User') then
    insert into public.users (id, email, created_at)
    select 
      id::uuid,  -- Cast text to uuid
      email, 
      created_at
    from public."User"
    on conflict (id) do nothing;
    
    raise notice 'Migrated data from User to users';
  end if;
end $$;

-- Migrate Entry → entries (if old table exists)
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'Entry') then
    insert into public.entries (id, user_id, kind, text, created_at)
    select 
      id::uuid,       -- Cast text to uuid
      user_id::uuid,  -- Cast text to uuid
      kind, 
      text, 
      created_at
    from public."Entry"
    on conflict (id) do nothing;
    
    raise notice 'Migrated data from Entry to entries';
  end if;
end $$;

-- Migrate Bet → bets (if old table exists)
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'Bet') then
    insert into public.bets (id, user_id, source, statement, probability, status, outcome, created_at, resolved_at)
    select 
      id::uuid,       -- Cast text to uuid
      user_id::uuid,  -- Cast text to uuid
      source, 
      statement, 
      probability, 
      status, 
      outcome, 
      created_at, 
      resolved_at
    from public."Bet"
    on conflict (id) do nothing;
    
    raise notice 'Migrated data from Bet to bets';
  end if;
end $$;

-- 3. Enable RLS on new tables
-- ============================================

alter table public.users enable row level security;
alter table public.entries enable row level security;
alter table public.bets enable row level security;

-- 4. Drop old RLS policies if they exist
-- ============================================

drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can insert own profile" on public.users;
drop policy if exists "Users can view own entries" on public.entries;
drop policy if exists "Users can insert own entries" on public.entries;
drop policy if exists "Users can update own entries" on public.entries;
drop policy if exists "Users can delete own entries" on public.entries;
drop policy if exists "Users can view own bets" on public.bets;
drop policy if exists "Users can insert own bets" on public.bets;
drop policy if exists "Users can update own bets" on public.bets;
drop policy if exists "Users can delete own bets" on public.bets;

-- 5. Create RLS policies
-- ============================================

-- Users policies
create policy "Users can view own profile" 
  on public.users for select 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.users for insert 
  with check (auth.uid() = id);

-- Entries policies
create policy "Users can view own entries" 
  on public.entries for select 
  using (auth.uid() = user_id);

create policy "Users can insert own entries" 
  on public.entries for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own entries" 
  on public.entries for update 
  using (auth.uid() = user_id);

create policy "Users can delete own entries" 
  on public.entries for delete 
  using (auth.uid() = user_id);

-- Bets policies
create policy "Users can view own bets" 
  on public.bets for select 
  using (auth.uid() = user_id);

create policy "Users can insert own bets" 
  on public.bets for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own bets" 
  on public.bets for update 
  using (auth.uid() = user_id);

create policy "Users can delete own bets" 
  on public.bets for delete 
  using (auth.uid() = user_id);

-- 6. Create or replace the user creation trigger
-- ============================================

create or replace function public.handle_new_user()
returns trigger 
language plpgsql 
security definer
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop old trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create new trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row 
  execute procedure public.handle_new_user();

-- 7. Clean up old tables (OPTIONAL - uncomment if you want to remove them)
-- ============================================
-- WARNING: Only uncomment these after verifying data migration worked!

-- drop table if exists public."DailyAgg" cascade;
-- drop table if exists public."InsightsLlm" cascade;
-- drop table if exists public."Bet" cascade;
-- drop table if exists public."Entry" cascade;
-- drop table if exists public."User" cascade;

-- 8. Create indexes for performance
-- ============================================

create index if not exists idx_entries_user_id on public.entries(user_id);
create index if not exists idx_entries_created_at on public.entries(created_at desc);
create index if not exists idx_bets_user_id on public.bets(user_id);
create index if not exists idx_bets_status on public.bets(status);
create index if not exists idx_bets_created_at on public.bets(created_at desc);

-- Done!
select 'Migration completed successfully!' as status;

