insert into public.captains (
  slug,
  display_name,
  phone_e164,
  active
)
values (
  'backo-petar-radulovic',
  'Baćko — Petar Radulović',
  '+38267239348',
  true
)
on conflict (slug) do update
set
  display_name = excluded.display_name,
  phone_e164 = excluded.phone_e164,
  active = true,
  updated_at = now();
