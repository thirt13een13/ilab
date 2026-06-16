create extension if not exists "uuid-ossp";

-- Profiles
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  school text,
  role text default 'student' check (role in ('student','teacher')),
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles(id, full_name, school)
  values(new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'school');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Subjects
create table public.subjects (
  id text primary key,
  name text not null,
  icon text not null,
  color text not null,
  description text,
  display_order integer default 0
);

-- Levels
create table public.levels (
  id text primary key,
  label text not null,
  description text,
  display_order integer default 0
);

-- Subject-level mapping
create table public.subject_levels (
  subject_id text references public.subjects(id) on delete cascade,
  level_id   text references public.levels(id)   on delete cascade,
  primary key(subject_id, level_id)
);

-- Experiments
create table public.experiments (
  id           text primary key,
  subject_id   text references public.subjects(id) on delete cascade not null,
  level_id     text references public.levels(id)   on delete cascade not null,
  title        text not null,
  description  text,
  theory       text,
  formula      text,
  duration     text,
  difficulty   text check(difficulty in ('Beginner','Intermediate','Advanced')),
  topics       text[] default '{}',
  steps        text[] default '{}',
  docker_port  integer unique,
  display_order integer default 0,
  is_active    boolean default true,
  created_at   timestamptz default now()
);

-- Components
create table public.experiment_components (
  id            text not null,
  experiment_id text references public.experiments(id) on delete cascade not null,
  label         text not null,
  icon          text not null,
  description   text,
  type          text not null,
  value         numeric,
  display_order integer default 0,
  primary key(id, experiment_id)
);

-- Variables
create table public.experiment_variables (
  id            text not null,
  experiment_id text references public.experiments(id) on delete cascade not null,
  label         text not null,
  min_value     numeric not null,
  max_value     numeric not null,
  step_value    numeric not null,
  default_value numeric not null,
  unit          text not null,
  display_order integer default 0,
  primary key(id, experiment_id)
);

-- Simulation rules
create table public.simulation_rules (
  id                  uuid default uuid_generate_v4() primary key,
  experiment_id       text references public.experiments(id) on delete cascade unique,
  required_components text[] not null default '{}',
  formula_type        text not null,
  formula_params      jsonb default '{}',
  graph_x_key         text,
  graph_y_key         text,
  graph_x_label       text,
  graph_y_label       text
);

-- Progress
create table public.experiment_progress (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  experiment_id text not null,
  subject_id    text not null,
  level_id      text not null,
  status        text default 'in_progress' check(status in ('in_progress','completed')),
  score         integer default 0,
  attempts      integer default 1,
  placed_items  jsonb default '[]',
  variables     jsonb default '{}',
  started_at    timestamptz default now(),
  completed_at  timestamptz,
  updated_at    timestamptz default now(),
  unique(user_id, experiment_id)
);

-- Results
create table public.experiment_results (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  experiment_id text not null,
  result_data   jsonb not null,
  conclusion    text,
  recorded_at   timestamptz default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger set_progress_updated_at
  before update on public.experiment_progress
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles              enable row level security;
alter table public.subjects              enable row level security;
alter table public.levels                enable row level security;
alter table public.subject_levels        enable row level security;
alter table public.experiments           enable row level security;
alter table public.experiment_components enable row level security;
alter table public.experiment_variables  enable row level security;
alter table public.simulation_rules      enable row level security;
alter table public.experiment_progress   enable row level security;
alter table public.experiment_results    enable row level security;

-- Public read for experiment catalogue
create policy "public read" on public.subjects              for select using (true);
create policy "public read" on public.levels                for select using (true);
create policy "public read" on public.subject_levels        for select using (true);
create policy "public read" on public.experiments           for select using (true);
create policy "public read" on public.experiment_components for select using (true);
create policy "public read" on public.experiment_variables  for select using (true);
create policy "public read" on public.simulation_rules      for select using (true);

-- User-scoped policies
create policy "own profile read"    on public.profiles for select using (auth.uid()=id);
create policy "own profile update"  on public.profiles for update using (auth.uid()=id);
create policy "own progress read"   on public.experiment_progress for select using (auth.uid()=user_id);
create policy "own progress insert" on public.experiment_progress for insert with check (auth.uid()=user_id);
create policy "own progress update" on public.experiment_progress for update using (auth.uid()=user_id);
create policy "own results read"    on public.experiment_results for select using (auth.uid()=user_id);
create policy "own results insert"  on public.experiment_results for insert with check (auth.uid()=user_id);