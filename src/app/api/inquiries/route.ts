import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type CaptainRecord = {
  id: string;
};

function makeReference() {
  const stamp = new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replaceAll("T", "")
    .replaceAll("Z", "")
    .replaceAll(".", "")
    .slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FWL-${stamp}-${suffix}`;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function findCaptain(displayName: string): Promise<CaptainRecord | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;

  const params = new URLSearchParams({
    select: "id",
    display_name: `eq.${displayName}`,
    active: "eq.true",
    limit: "1",
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/captains?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Failed to resolve captain", response.status, detail);
    return null;
  }

  const rows = (await response.json()) as CaptainRecord[];
  return rows[0] ?? null;
}

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Inquiry storage is not configured yet." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const required = [
    "captain",
    "date",
    "time",
    "duration",
    "people",
    "experience",
    "guestName",
    "phone",
    "preferredContact",
  ] as const;

  for (const key of required) {
    if (!isNonEmptyString(body[key])) {
      return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
    }
  }

  const partySize = Number(body.people);
  if (!Number.isInteger(partySize) || partySize < 1) {
    return NextResponse.json({ error: "Invalid party size." }, { status: 400 });
  }

  const allowedContacts = new Set(["WhatsApp", "Viber", "Phone", "Telefon"]);
  if (!allowedContacts.has(String(body.preferredContact))) {
    return NextResponse.json({ error: "Invalid contact method." }, { status: 400 });
  }

  const captainName = String(body.captain).trim();
  const captain = await findCaptain(captainName);
  const reference = makeReference();
  const guestToken = randomBytes(24).toString("base64url");
  const note = isNonEmptyString(body.note) ? body.note.trim() : null;

  const payload = {
    reference,
    captain_id: captain?.id ?? null,
    captain_name: captainName,
    preferred_date: String(body.date),
    preferred_time: String(body.time),
    planned_duration: String(body.duration).trim(),
    party_size: partySize,
    experience_type: String(body.experience).trim(),
    guest_name: String(body.guestName).trim(),
    guest_phone: String(body.phone).trim(),
    preferred_contact: String(body.preferredContact),
    note,
    guest_access_token_hash: hashToken(guestToken),
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Failed to store inquiry", response.status, detail);
    return NextResponse.json({ error: "Could not save inquiry." }, { status: 500 });
  }

  return NextResponse.json(
    {
      reference,
      delivery: "captain-portal",
      conversationUrl: `/conversation/${encodeURIComponent(reference)}?token=${encodeURIComponent(guestToken)}`,
    },
    { status: 201 },
  );
}
