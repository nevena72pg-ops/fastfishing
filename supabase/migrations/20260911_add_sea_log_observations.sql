create table if not exists public.sea_log_observations (
  id uuid primary key default gen_random_uuid(),
  captain_name text not null,
  category text not null check (category in ('species', 'waste', 'water', 'weather', 'other')),
  species_name text,
  notes text,
  latitude double precision,
  longitude double precision,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists sea_log_observations_captain_created_idx
  on public.sea_log_observations (captain_name, created_at desc);

alter table public.sea_log_observations enable row level security;
