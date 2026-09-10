create table if not exists public.captains (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display_name text unique not null,
  phone_e164 text not null,
  whatsapp_enabled boolean not null default false,
  viber_enabled boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.captains enable row level security;

alter table public.inquiries
  add column if not exists captain_id uuid references public.captains(id) on delete set null;

create or replace function public.set_captains_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists captains_set_updated_at on public.captains;
create trigger captains_set_updated_at
before update on public.captains
for each row execute function public.set_captains_updated_at();
