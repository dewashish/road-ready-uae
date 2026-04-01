-- ==========================================================================
-- ROAD READY UAE — Migration: Vehicle-Scoped Progress Tracking
-- ==========================================================================
-- Run this AFTER the base schema (supabase-schema.sql) and
-- session history migration (supabase-migration-session-history.sql).
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. VEHICLE MODULE PROGRESS (replaces rr_user_module_progress for new flow)
--    Tracks per-user, per-vehicle, per-module progress.
--    This is the source of truth for the Module Path sidebar.
-- --------------------------------------------------------------------------
create table if not exists public.rr_vehicle_module_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  vehicle_type    text not null,
  module_slug     text not null,
  best_score      integer not null default 0,
  best_percent    integer not null default 0,
  attempts        integer not null default 0,
  questions_seen  integer not null default 0,
  total_questions integer not null default 0,
  total_correct   integer not null default 0,
  last_attempted  timestamptz,
  first_completed timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id, vehicle_type, module_slug)
);

alter table public.rr_vehicle_module_progress enable row level security;

create policy "Users can view own vehicle progress"
  on public.rr_vehicle_module_progress for select using (auth.uid() = user_id);
create policy "Users can insert own vehicle progress"
  on public.rr_vehicle_module_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own vehicle progress"
  on public.rr_vehicle_module_progress for update using (auth.uid() = user_id);

create index idx_rr_vmp_user_vehicle
  on public.rr_vehicle_module_progress(user_id, vehicle_type);

-- --------------------------------------------------------------------------
-- 2. WEEKLY PROGRESS SNAPSHOTS
--    Stores weekly aggregates for the "Weekly Performance" bar chart.
--    One row per user + vehicle + week.
-- --------------------------------------------------------------------------
create table if not exists public.rr_weekly_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  vehicle_type    text not null,
  week_start      date not null,          -- Monday of the ISO week
  sessions_count  integer not null default 0,
  avg_score       integer not null default 0,
  best_score      integer not null default 0,
  total_xp        integer not null default 0,
  questions_answered integer not null default 0,
  questions_correct  integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id, vehicle_type, week_start)
);

alter table public.rr_weekly_progress enable row level security;

create policy "Users can view own weekly progress"
  on public.rr_weekly_progress for select using (auth.uid() = user_id);
create policy "Users can insert own weekly progress"
  on public.rr_weekly_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own weekly progress"
  on public.rr_weekly_progress for update using (auth.uid() = user_id);

create index idx_rr_wp_user_vehicle_week
  on public.rr_weekly_progress(user_id, vehicle_type, week_start desc);

-- --------------------------------------------------------------------------
-- 3. HELPER FUNCTION: Get Monday of the ISO week for a given date
-- --------------------------------------------------------------------------
create or replace function public.iso_week_start(d date)
returns date as $$
  select d - (extract(isodow from d)::integer - 1);
$$ language sql immutable;

-- --------------------------------------------------------------------------
-- 4. HELPER FUNCTION: Upsert vehicle module progress from a quiz session
--    Call this after each quiz completion.
-- --------------------------------------------------------------------------
create or replace function public.upsert_vehicle_module_progress(
  p_user_id uuid,
  p_vehicle_type text,
  p_module_slug text,
  p_score integer,
  p_total integer,
  p_questions_seen integer
)
returns void as $$
declare
  v_percent integer;
begin
  v_percent := round((p_score::numeric / nullif(p_total, 0)) * 100);

  insert into public.rr_vehicle_module_progress (
    user_id, vehicle_type, module_slug,
    best_score, best_percent, attempts,
    questions_seen, total_questions, total_correct,
    last_attempted, first_completed
  ) values (
    p_user_id, p_vehicle_type, p_module_slug,
    p_score, v_percent, 1,
    p_questions_seen, p_total, p_score,
    now(), now()
  )
  on conflict (user_id, vehicle_type, module_slug) do update set
    best_score     = greatest(rr_vehicle_module_progress.best_score, p_score),
    best_percent   = greatest(rr_vehicle_module_progress.best_percent, v_percent),
    attempts       = rr_vehicle_module_progress.attempts + 1,
    questions_seen = greatest(rr_vehicle_module_progress.questions_seen, p_questions_seen),
    total_questions = rr_vehicle_module_progress.total_questions + p_total,
    total_correct   = rr_vehicle_module_progress.total_correct + p_score,
    last_attempted  = now(),
    updated_at      = now();
end;
$$ language plpgsql security definer;

-- --------------------------------------------------------------------------
-- 5. HELPER FUNCTION: Upsert weekly progress from a quiz session
-- --------------------------------------------------------------------------
create or replace function public.upsert_weekly_progress(
  p_user_id uuid,
  p_vehicle_type text,
  p_score integer,
  p_total integer,
  p_xp integer
)
returns void as $$
declare
  v_week date;
  v_percent integer;
begin
  v_week := public.iso_week_start(current_date);
  v_percent := round((p_score::numeric / nullif(p_total, 0)) * 100);

  insert into public.rr_weekly_progress (
    user_id, vehicle_type, week_start,
    sessions_count, avg_score, best_score,
    total_xp, questions_answered, questions_correct
  ) values (
    p_user_id, p_vehicle_type, v_week,
    1, v_percent, v_percent,
    p_xp, p_total, p_score
  )
  on conflict (user_id, vehicle_type, week_start) do update set
    sessions_count     = rr_weekly_progress.sessions_count + 1,
    avg_score          = round(
      (rr_weekly_progress.avg_score * rr_weekly_progress.sessions_count + v_percent)::numeric
      / (rr_weekly_progress.sessions_count + 1)
    ),
    best_score         = greatest(rr_weekly_progress.best_score, v_percent),
    total_xp           = rr_weekly_progress.total_xp + p_xp,
    questions_answered = rr_weekly_progress.questions_answered + p_total,
    questions_correct  = rr_weekly_progress.questions_correct + p_score,
    updated_at         = now();
end;
$$ language plpgsql security definer;
