import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;
const TWILIO_WHATSAPP_TEST_TO = process.env.TWILIO_WHATSAPP_TEST_TO;

type CaptainRecord = {
  id: string;
  phone_e164: string;
  whatsapp_enabled: boolean;
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

async function findCaptain(displayName: string): Promise<CaptainRecord | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const params = new URLSearchParams({
    select: "id,phone_e164,whatsapp_enabled",
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

function buildCaptainMessage(args: {
  reference: string;
  captainName: string;
  date: string;
  time: string;
  duration: string;
  partySize: number;
  experience: string;
  guestName: string;
  guestPhone: string;
  preferredContact: string;
  note: string | null;
}) {
  const lines = [
    `FishWithLocals — novi upit ${args.reference}`,
    `Kapetan: ${args.captainName}`,
    `Datum: ${args.date}`,
    `Vrijeme: ${args.time}`,
    `Trajanje: ${args.duration}`,
    `Broj osoba: ${args.partySize}`,
    `Iskustvo: ${args.experience}`,
    `Gost: ${args.guestName}`,
    `Kontakt: ${args.guestPhone} (${args.preferredContact})`,
  ];

  if (args.note) {
    lines.push(`Napomena: ${args.note}`);
  }

  lines.push("Odgovori PREUZIMAM kada preuzmeš komunikaciju sa gostom.");
  return lines.join("\n");
}

async function sendWhatsApp(to: string, body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    return { attempted: false, ok: false };
  }

  const form = new URLSearchParams({
    To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
    From: TWILIO_WHATSAPP_FROM,
    Body: body,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error("Failed to send WhatsApp inquiry", response.status, detail);
    return { attempted: true, ok: false };
  }

  return { attempted: true, ok: true };
}

async function markForwarded(reference: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const params = new URLSearchParams({ reference: `eq.${reference}` });
  await fetch(`${SUPABASE_URL}/rest/v1/inquiries?${params.toString()}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "forwarded", forwarded_at: new Date().toISOString() }),
    cache: "no-store",
  });
}

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Inquiry storage is not configured yet." },
      { status: 503 },
    );
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

  const message = buildCaptainMessage({
    reference,
    captainName,
    date: String(body.date),
    time: String(body.time),
    duration: String(body.duration).trim(),
    partySize,
    experience: String(body.experience).trim(),
    guestName: String(body.guestName).trim(),
    guestPhone: String(body.phone).trim(),
    preferredContact: String(body.preferredContact),
    note,
  });

  const realCaptainRecipient = captain?.whatsapp_enabled ? captain.phone_e164 : null;
  const recipient = TWILIO_WHATSAPP_TEST_TO || realCaptainRecipient;
  const delivery = recipient
    ? await sendWhatsApp(recipient, message)
    : { attempted: false, ok: false };

  const isTestDelivery = Boolean(TWILIO_WHATSAPP_TEST_TO);
  if (delivery.ok && !isTestDelivery) {
    await markForwarded(reference);
  }

  return NextResponse.json(
    {
      reference,
      whatsapp: delivery.attempted ? (delivery.ok ? (isTestDelivery ? "sent-test" : "sent") : "failed") : "not-configured",
    },
    { status: 201 },
  );
}
