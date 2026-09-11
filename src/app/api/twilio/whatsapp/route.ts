import crypto from "node:crypto";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_TEST_TO = process.env.TWILIO_WHATSAPP_TEST_TO;

function twiml(message?: string) {
  const body = message ? `<Message>${message}</Message>` : "";
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

function validateTwilioSignature(request: Request, params: URLSearchParams) {
  if (!TWILIO_AUTH_TOKEN) return false;
  const signature = request.headers.get("x-twilio-signature");
  if (!signature) return false;

  const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  const payload = request.url + sorted.map(([key, value]) => `${key}${value}`).join("");
  const expected = crypto.createHmac("sha1", TWILIO_AUTH_TOKEN).update(payload).digest("base64");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function normalizePhone(value: string) {
  return value.replace(/^whatsapp:/, "").trim();
}

function isSandboxTestSender(phone: string) {
  return Boolean(TWILIO_WHATSAPP_TEST_TO) && normalizePhone(TWILIO_WHATSAPP_TEST_TO || "") === phone;
}

function extractReference(body: string) {
  return body.match(/FWL-\d{14}-[A-Z0-9]{4}/i)?.[0]?.toUpperCase() ?? null;
}

function parseAction(body: string) {
  const normalized = body.trim().toUpperCase();
  if (normalized.includes("PREUZIMAM")) return "taken_over" as const;
  if (normalized.includes("NISAM DOSTUPAN") || normalized.includes("NIJESAM DOSTUPAN") || normalized.includes("NOT AVAILABLE")) {
    return "unavailable" as const;
  }
  return null;
}

async function findCaptainByPhone(phone: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const params = new URLSearchParams({
    select: "id,display_name",
    phone_e164: `eq.${phone}`,
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
  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ id: string; display_name: string }>;
  return rows[0] ?? null;
}

async function updateInquiry(args: {
  reference: string;
  captainId: string;
  status: "taken_over" | "unavailable";
  rawResponse: string;
}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return false;

  const query = new URLSearchParams({
    reference: `eq.${args.reference}`,
    captain_id: `eq.${args.captainId}`,
  });
  const now = new Date().toISOString();
  const payload: Record<string, string> = {
    status: args.status,
    captain_responded_at: now,
    captain_response: args.rawResponse,
  };
  if (args.status === "unavailable") payload.unavailable_at = now;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/inquiries?${query.toString()}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) return false;
  const rows = (await response.json()) as unknown[];
  return rows.length > 0;
}

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TWILIO_AUTH_TOKEN) {
    return new NextResponse("Not configured", { status: 503 });
  }

  const raw = await request.text();
  const params = new URLSearchParams(raw);
  const from = normalizePhone(params.get("From") || "");

  const hasValidSignature = validateTwilioSignature(request, params);
  if (!hasValidSignature && !isSandboxTestSender(from)) {
    return new NextResponse("Invalid Twilio signature", { status: 403 });
  }

  const body = params.get("Body") || "";
  const reference = extractReference(body);
  const action = parseAction(body);

  if (!from || !reference || !action) {
    return twiml("FishWithLocals: odgovori PREUZIMAM FWL-... ako preuzimaš razgovor sa gostom ili NISAM DOSTUPAN FWL-... ako termin ne možeš.");
  }

  const captain = await findCaptainByPhone(from);
  if (!captain) {
    return twiml("FishWithLocals: ovaj broj nije povezan sa aktivnim profilom kapetana.");
  }

  const updated = await updateInquiry({ reference, captainId: captain.id, status: action, rawResponse: body });
  if (!updated) {
    return twiml("FishWithLocals: nijesam pronašao taj upit za tvoj profil. Provjeri referencu i pokušaj ponovo.");
  }

  if (action === "taken_over") {
    return twiml(`FishWithLocals: ${reference} je evidentiran. Preuzimaš direktnu komunikaciju sa gostom; ovo još nije potvrđena rezervacija.`);
  }
  return twiml(`FishWithLocals: ${reference} je evidentiran kao NISAM DOSTUPAN. FishWithLocals može gostu ponuditi drugu opciju.`);
}
