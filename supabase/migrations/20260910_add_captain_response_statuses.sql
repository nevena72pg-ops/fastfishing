alter table public.inquiries
  drop constraint if exists inquiries_status_check;

alter table public.inquiries
  add constraint inquiries_status_check
  check (status in ('received', 'forwarded', 'accepted', 'taken_over', 'unavailable', 'closed'));

alter table public.inquiries
  add column if not exists captain_responded_at timestamptz,
  add column if not exists unavailable_at timestamptz,
  add column if not exists captain_response text;
