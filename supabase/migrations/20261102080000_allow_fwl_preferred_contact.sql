-- The in-app FWL conversation is a genuine contact preference.
-- Keep all four legacy options for existing or older clients.
-- Atomic replacement: there is no interval with the CHECK disabled.
begin;
set local lock_timeout = '5s';

alter table public.inquiries
  drop constraint inquiries_preferred_contact_check,
  add constraint inquiries_preferred_contact_check
    check (preferred_contact in ('FWL', 'WhatsApp', 'Viber', 'Phone', 'Telefon'));

commit;
