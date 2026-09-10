create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  source text not null default 'fishwithlocals',
  captain_name text not null,
  preferred_date date not null,
  preferred_time time not null,
  planned_duration text not null,
  party_size integer not null check (party_size > 0),
  experience_type text not null,
  guest_name text not null,
  guest_phone text not null,
  preferred_contact text not null check (preferred_contact in ('WhatsApp', 'Viber', 'Phone', 'Telefon')),
  note text,
  status text not null default 'received' check (status in ('received', 'forwarded', 'accepted', 'closed')),
  forwarded_at timestamptz,
  accepted_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_status_created_at_idx
  on public.inquiries (status, created_at desc);

alter table public.inquiries enable row level security;

-- Public visitors never read or write this table directly.
-- The application route uses the Supabase service-role key server-side.

create or replace function public.set_inquiries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_inquiries_updated_at();
