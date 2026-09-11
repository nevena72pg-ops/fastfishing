alter table public.inquiries
  add column if not exists guest_access_token_hash text;

create table if not exists public.inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  sender_role text not null check (sender_role in ('guest', 'captain', 'system')),
  sender_name text,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists inquiry_messages_inquiry_created_idx
  on public.inquiry_messages (inquiry_id, created_at);

alter table public.inquiry_messages enable row level security;
