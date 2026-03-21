-- ==========================================================================
-- ROAD READY UAE — Supabase Schema
-- ==========================================================================
-- Run this in the Supabase SQL Editor to set up the database.
-- Uses the SAME Supabase instance as anon-view (separate tables).
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. PROFILES
-- --------------------------------------------------------------------------
create table if not exists public.rr_profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  display_name        text,
  avatar_url          text,
  preferred_vehicle_type text not null default 'B',
  total_xp            integer not null default 0,
  current_level       integer not null default 1,
  current_streak      integer not null default 0,
  longest_streak      integer not null default 0,
  last_active_at      timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.rr_profiles enable row level security;

create policy "Users can view own profile"
  on public.rr_profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.rr_profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.rr_profiles for insert with check (auth.uid() = id);

-- --------------------------------------------------------------------------
-- 2. QUESTIONS
-- --------------------------------------------------------------------------
create table if not exists public.rr_questions (
  id                    uuid primary key default gen_random_uuid(),
  question_text         text not null,
  explanation           text,
  module                text not null check (module in (
    'road_signs', 'traffic_rules', 'hazard_perception',
    'driving_conditions', 'critical_situations',
    'driving_behavior', 'vehicle_maintenance'
  )),
  vehicle_types         text[] not null default '{B}',
  difficulty            smallint not null default 2 check (difficulty between 1 and 5),
  relevance_rank        smallint not null default 5 check (relevance_rank between 1 and 10),
  svg_illustration_key  text,
  image_url             text,
  tags                  text[] default '{}',
  is_edcad_style        boolean default false,
  language              text not null default 'en',
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.rr_questions enable row level security;

create policy "Questions are publicly readable"
  on public.rr_questions for select using (true);

create index idx_rr_questions_module on public.rr_questions(module);
create index idx_rr_questions_vehicle on public.rr_questions using gin(vehicle_types);
create index idx_rr_questions_relevance on public.rr_questions(relevance_rank desc);

-- --------------------------------------------------------------------------
-- 3. ANSWERS
-- --------------------------------------------------------------------------
create table if not exists public.rr_answers (
  id              uuid primary key default gen_random_uuid(),
  question_id     uuid not null references public.rr_questions(id) on delete cascade,
  answer_text     text not null,
  is_correct      boolean not null default false,
  display_order   smallint not null,
  created_at      timestamptz not null default now()
);

alter table public.rr_answers enable row level security;

create policy "Answers are publicly readable"
  on public.rr_answers for select using (true);

create index idx_rr_answers_question on public.rr_answers(question_id);

-- --------------------------------------------------------------------------
-- 4. MODULES
-- --------------------------------------------------------------------------
create table if not exists public.rr_modules (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text unique not null,
  title                   text not null,
  description             text,
  icon_name               text not null,
  display_order           smallint not null,
  question_count          integer not null default 30,
  passing_score           numeric(3,2) not null default 0.71,
  vehicle_type            text not null default 'B',
  prerequisite_module_id  uuid references public.rr_modules(id),
  xp_reward               integer not null default 100,
  created_at              timestamptz not null default now()
);

alter table public.rr_modules enable row level security;

create policy "Modules are publicly readable"
  on public.rr_modules for select using (true);

-- Seed modules
insert into public.rr_modules (slug, title, description, icon_name, display_order, question_count, xp_reward)
values
  ('road-signs', 'Traffic Signs', 'Learn regulatory, warning, and informational signs', 'signpost', 1, 30, 100),
  ('traffic-rules', 'Road Rules', 'Speed limits, right of way, lane discipline', 'gavel', 2, 30, 100),
  ('hazard-perception', 'Hazard Perception', 'Identify and respond to dangerous situations', 'warning', 3, 30, 120),
  ('driving-conditions', 'Driving Conditions', 'City, highway, and adverse weather driving', 'cloud', 4, 20, 80),
  ('critical-situations', 'Critical Situations', 'Emergency responses and accident procedures', 'emergency', 5, 20, 120),
  ('driving-behavior', 'Safe Driving', 'Etiquette, courtesy, and defensive driving', 'shield', 6, 20, 80),
  ('vehicle-maintenance', 'Vehicle Knowledge', 'Vehicle systems, maintenance, and safety features', 'build', 7, 15, 60);

-- Set prerequisites (each module requires the previous one)
update public.rr_modules set prerequisite_module_id = (select id from public.rr_modules where slug = 'road-signs') where slug = 'traffic-rules';
update public.rr_modules set prerequisite_module_id = (select id from public.rr_modules where slug = 'traffic-rules') where slug = 'hazard-perception';
update public.rr_modules set prerequisite_module_id = (select id from public.rr_modules where slug = 'hazard-perception') where slug = 'driving-conditions';
update public.rr_modules set prerequisite_module_id = (select id from public.rr_modules where slug = 'driving-conditions') where slug = 'critical-situations';
update public.rr_modules set prerequisite_module_id = (select id from public.rr_modules where slug = 'critical-situations') where slug = 'driving-behavior';
update public.rr_modules set prerequisite_module_id = (select id from public.rr_modules where slug = 'driving-behavior') where slug = 'vehicle-maintenance';

-- --------------------------------------------------------------------------
-- 5. USER MODULE PROGRESS
-- --------------------------------------------------------------------------
create table if not exists public.rr_user_module_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.rr_profiles(id) on delete cascade,
  module_id       uuid not null references public.rr_modules(id) on delete cascade,
  status          text not null default 'locked' check (status in (
    'locked', 'available', 'in_progress', 'completed', 'mastered'
  )),
  best_score      numeric(5,2) default 0,
  attempts        integer not null default 0,
  questions_seen  integer not null default 0,
  last_attempted  timestamptz,
  unlocked_at     timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id, module_id)
);

alter table public.rr_user_module_progress enable row level security;

create policy "Users can view own progress"
  on public.rr_user_module_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress"
  on public.rr_user_module_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress"
  on public.rr_user_module_progress for update using (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- 6. QUIZ SESSIONS
-- --------------------------------------------------------------------------
create table if not exists public.rr_quiz_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.rr_profiles(id) on delete cascade,
  module_id         uuid references public.rr_modules(id),
  session_type      text not null check (session_type in ('practice', 'module_quiz', 'mock_exam')),
  vehicle_type      text not null default 'B',
  total_questions   integer not null,
  correct_answers   integer not null default 0,
  score_percent     numeric(5,2),
  time_spent_secs   integer,
  passed            boolean,
  started_at        timestamptz not null default now(),
  completed_at      timestamptz,
  created_at        timestamptz not null default now()
);

alter table public.rr_quiz_sessions enable row level security;

create policy "Users can view own sessions"
  on public.rr_quiz_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions"
  on public.rr_quiz_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions"
  on public.rr_quiz_sessions for update using (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- 7. QUIZ ANSWERS (per-question responses)
-- --------------------------------------------------------------------------
create table if not exists public.rr_quiz_answers (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references public.rr_quiz_sessions(id) on delete cascade,
  question_id         uuid not null references public.rr_questions(id),
  selected_answer_id  uuid references public.rr_answers(id),
  is_correct          boolean not null,
  time_spent_secs     integer,
  skipped             boolean not null default false,
  created_at          timestamptz not null default now()
);

alter table public.rr_quiz_answers enable row level security;

create policy "Users can view own quiz answers"
  on public.rr_quiz_answers for select
  using (session_id in (select id from public.rr_quiz_sessions where user_id = auth.uid()));
create policy "Users can insert own quiz answers"
  on public.rr_quiz_answers for insert
  with check (session_id in (select id from public.rr_quiz_sessions where user_id = auth.uid()));

-- --------------------------------------------------------------------------
-- 8. USER QUESTION STATS (spaced repetition)
-- --------------------------------------------------------------------------
create table if not exists public.rr_user_question_stats (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.rr_profiles(id) on delete cascade,
  question_id     uuid not null references public.rr_questions(id) on delete cascade,
  times_seen      integer not null default 0,
  times_correct   integer not null default 0,
  times_incorrect integer not null default 0,
  ease_factor     numeric(4,2) not null default 2.50,
  interval_days   integer not null default 0,
  next_review     timestamptz,
  last_seen       timestamptz,
  is_bookmarked   boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id, question_id)
);

alter table public.rr_user_question_stats enable row level security;

create policy "Users can view own stats"
  on public.rr_user_question_stats for select using (auth.uid() = user_id);
create policy "Users can insert own stats"
  on public.rr_user_question_stats for insert with check (auth.uid() = user_id);
create policy "Users can update own stats"
  on public.rr_user_question_stats for update using (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- 9. DAILY CHALLENGES
-- --------------------------------------------------------------------------
create table if not exists public.rr_daily_challenges (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.rr_profiles(id) on delete cascade,
  challenge_date        date not null default current_date,
  target_questions      integer not null default 10,
  completed_questions   integer not null default 0,
  is_completed          boolean not null default false,
  xp_earned             integer not null default 0,
  created_at            timestamptz not null default now(),
  unique(user_id, challenge_date)
);

alter table public.rr_daily_challenges enable row level security;

create policy "Users can view own challenges"
  on public.rr_daily_challenges for select using (auth.uid() = user_id);
create policy "Users can insert own challenges"
  on public.rr_daily_challenges for insert with check (auth.uid() = user_id);
create policy "Users can update own challenges"
  on public.rr_daily_challenges for update using (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- TRIGGERS
-- --------------------------------------------------------------------------

-- Auto-create profile on signup
create or replace function public.handle_rr_new_user()
returns trigger as $$
begin
  insert into public.rr_profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created_rr
  after insert on auth.users
  for each row execute procedure public.handle_rr_new_user();

-- Auto-update updated_at
create or replace function public.handle_rr_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_rr_profiles_updated_at
  before update on public.rr_profiles
  for each row execute procedure public.handle_rr_updated_at();

create trigger set_rr_user_module_progress_updated_at
  before update on public.rr_user_module_progress
  for each row execute procedure public.handle_rr_updated_at();

create trigger set_rr_user_question_stats_updated_at
  before update on public.rr_user_question_stats
  for each row execute procedure public.handle_rr_updated_at();

-- --------------------------------------------------------------------------
-- 11. SESSION HISTORY (lightweight sync for cross-device quiz history)
-- --------------------------------------------------------------------------
-- Stores quiz session records as structured columns + JSONB answers.
-- Used by the client-side ProgressContext to sync history across devices.
-- --------------------------------------------------------------------------
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
