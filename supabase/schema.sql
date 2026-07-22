-- MOVA Strategy — Supabase schema (single-user, no login).
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- This is a private single-user app, so there is no authentication: the whole
-- synced state lives in ONE shared row that the public (anon) key can read and
-- write. Every device running the app connects to the same row automatically.
--
-- Trade-off: anyone who has the app's URL and anon key can read/write this row.
-- That is acceptable here because only the owner uses the app.

create table if not exists public.solo_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.solo_state enable row level security;

-- Allow the anon key full access to the single app row (no user identity).
drop policy if exists "solo read" on public.solo_state;
create policy "solo read" on public.solo_state for select using (true);

drop policy if exists "solo insert" on public.solo_state;
create policy "solo insert" on public.solo_state for insert with check (true);

drop policy if exists "solo update" on public.solo_state;
create policy "solo update" on public.solo_state for update using (true) with check (true);
