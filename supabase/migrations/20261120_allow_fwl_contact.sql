-- The pilot inquiry form uses private FishWithLocals messaging as its contact method.
-- Keep existing legacy contact options for older inquiries.
ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_preferred_contact_check;

ALTER TABLE public.inquiries
  ADD CONSTRAINT inquiries_preferred_contact_check
  CHECK (preferred_contact IN ('FWL', 'WhatsApp', 'Viber', 'Phone', 'Telefon'));
