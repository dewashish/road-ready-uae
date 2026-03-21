-- Run this in the Supabase SQL Editor to create the session history table
-- This enables cross-device quiz history sync

create table if not exists public.rr_session_history (
  id              text not null,
  user_id         uuid not null references auth.users(id) on delete cascade,
  module_slug     text not null,
  module_title    text not null,
  vehicle_type    text not null default 'B',
  score           integer not null,
  total           integer not null,
  percent         integer not null,
  passed          boolean not null,
  xp_earned       integer not null default 0,
  completed_at    timestamptz not null,
  answers         jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.rr_session_history enable row level security;

create policy "Users can view own session history"
  on public.rr_session_history for select using (auth.uid() = user_id);
create policy "Users can insert own session history"
  on public.rr_session_history for insert with check (auth.uid() = user_id);
create policy "Users can update own session history"
  on public.rr_session_history for update using (auth.uid() = user_id);
