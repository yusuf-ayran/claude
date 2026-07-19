-- MOVA Strategy — Supabase schema.
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- The app stores the whole synced state as one JSONB blob per user
-- (single-user app; last-write-wins sync). Auth is Supabase's built-in
-- email magic link — no extra tables needed.

create table if not exists public.app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "own state select" on public.app_state;
create policy "own state select"
  on public.app_state for select
  using (auth.uid() = user_id);

drop policy if exists "own state insert" on public.app_state;
create policy "own state insert"
  on public.app_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "own state update" on public.app_state;
create policy "own state update"
  on public.app_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
