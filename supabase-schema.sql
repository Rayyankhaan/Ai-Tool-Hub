-- ─────────────────────────────────────────────────────────────────────────────
-- AIToolsHub — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
create table if not exists public.profiles (
  id                  uuid references auth.users(id) on delete cascade primary key,
  email               text,
  name                text,
  avatar_url          text,
  plan                text not null default 'free' check (plan in ('free','pro','team')),
  stripe_customer_id  text unique,
  stripe_subscription_id text,
  subscription_status text default 'inactive',
  subscription_end    timestamptz,
  prompts_used_today  int not null default 0,
  prompts_date        date,
  saved_prompts       jsonb not null default '[]',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can only read/write their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role can do everything (used by webhook)
create policy "Service role full access"
  on public.profiles for all
  using (auth.role() = 'service_role');


-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- Fires whenever a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. PROMPT USAGE RESET
-- Resets prompts_used_today to 0 each new day automatically
-- (Called from API route, not a cron — Supabase free tier has no cron)
create or replace function public.reset_daily_prompts(user_id uuid)
returns void as $$
begin
  update public.profiles
  set prompts_used_today = 0, prompts_date = current_date
  where id = user_id and (prompts_date is null or prompts_date < current_date);
end;
$$ language plpgsql security definer;


-- 4. VERIFY SETUP
-- Run these to confirm everything is working:
-- select * from public.profiles limit 5;
-- select count(*) from public.profiles;
