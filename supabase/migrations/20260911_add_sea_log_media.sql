alter table public.sea_log_observations
  add column if not exists photo_path text,
  add column if not exists location_accuracy_m double precision,
  add column if not exists review_status text not null default 'submitted';

alter table public.sea_log_observations
  drop constraint if exists sea_log_observations_review_status_check;

alter table public.sea_log_observations
  add constraint sea_log_observations_review_status_check
  check (review_status in ('submitted', 'verified', 'rejected'));

create index if not exists sea_log_observations_review_status_idx
  on public.sea_log_observations (review_status, observed_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sea-log',
  'sea-log',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
