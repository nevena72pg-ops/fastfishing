import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const form = read("src/components/inquiry-form.tsx");
const api = read("src/app/api/inquiries/route.ts");
const migration = read("supabase/migrations/20261102080000_allow_fwl_preferred_contact.sql");

function extractQuotedValues(source) {
  return [...source.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
}

test("guest form selects the in-app FWL contact method", () => {
  assert.match(form, /name="preferredContact"\s+type="hidden"\s+value="FWL"/);
});

test("API allows the contact method sent by the guest form", () => {
  const match = api.match(/const allowedContacts = new Set\(\[([^\]]+)\]\)/);
  assert.ok(match, "API contact whitelist must be present");
  const allowed = extractQuotedValues(match[1]);
  assert.deepEqual(allowed, ["FWL", "WhatsApp", "Viber", "Phone", "Telefon"]);
  assert.match(api, /allowedContacts\.has\(String\(body\.preferredContact\)\)/);
  assert.match(api, /preferred_contact:\s*String\(body\.preferredContact\)/);
});

test("migration makes the database whitelist match the API exactly", () => {
  const match = migration.match(/check\s*\(preferred_contact\s+in\s*\(([^)]+)\)\)/i);
  assert.ok(match, "Expected explicit preferred_contact CHECK constraint");
  const allowed = extractQuotedValues(match[1]);
  assert.deepEqual(allowed, ["FWL", "WhatsApp", "Viber", "Phone", "Telefon"]);
  assert.match(migration, /drop constraint inquiries_preferred_contact_check/i);
  assert.match(migration, /add constraint inquiries_preferred_contact_check/i);
});

test("migration is atomic and does not widen data access", () => {
  assert.match(migration, /^begin;/m);
  assert.match(migration, /^commit;/m);
  assert.match(migration, /set local lock_timeout = '5s';/);
  assert.doesNotMatch(migration, /disable\s+row\s+level\s+security|drop\s+policy|grant\s+/i);
});
