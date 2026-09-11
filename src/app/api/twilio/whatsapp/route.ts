import crypto from "node:crypto";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;
const TWILIO_WHATSAPP_TEST_TO = process.env.TWILIO_WHATSAPP_TEST_TO;

function emptyResponse(status = 204) {
  return new NextResponse(null, { status });
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

async function sendWhatsAppReply(to: string, body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) return false;

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
    console.error("Failed to send inbound WhatsApp reply", response.status, detail);
    return false;
  }
  return true;
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
  if (!TWILIO_AUTH_TOKEN) {
    return new NextResponse("Not configured", { status: 503 });
  }

  const raw = await request.text();
  const params = new URLSearchParams(raw);
  const from = normalizePhone(params.get("From") || "");

  const hasValidSignature = validateTwilioSignature(request, params);
  if (!hasValidSignature && !isSandboxTestSender(from)) {
    return new NextResponse("Invalid Twilio signature", { status: 403 });
  }

  if (!from) return emptyResponse();

  const body = params.get("Body") || "";
  const reference = extractReference(body);
  const action = parseAction(body);

  if (!reference || !action) {
    await sendWhatsAppReply(
      from,
      "FishWithLocals: odgovori PREUZIMAM FWL-... ako preuzimaš razgovor sa gostom ili NISAM DOSTUPAN FWL-... ako termin ne možeš.",
    );
    return emptyResponse();
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    await sendWhatsAppReply(from, "FishWithLocals: sistem trenutno nije dostupan. Pokušaj ponovo malo kasnije.");
    return emptyResponse();
  }

  const captain = await findCaptainByPhone(from);
  if (!captain) {
    await sendWhatsAppReply(from, "FishWithLocals: ovaj broj nije povezan sa aktivnim profilom kapetana.");
    return emptyResponse();
  }

  const updated = await updateInquiry({ reference, captainId: captain.id, status: action, rawResponse: body });
  if (!updated) {
    await sendWhatsAppReply(from, "FishWithLocals: nijesam pronašao taj upit za tvoj profil. Provjeri referencu i pokušaj ponovo.");
    return emptyResponse();
  }

  if (action === "taken_over") {
    await sendWhatsAppReply(
      from,
      `FishWithLocals: ${reference} je evidentiran. Preuzimaš direktnu komunikaciju sa gostom; ovo još nije potvrđena rezervacija.`,
    );
  } else {
    await sendWhatsAppReply(
      from,
      `FishWithLocals: ${reference} je evidentiran kao NISAM DOSTUPAN. FishWithLocals može gostu ponuditi drugu opciju.`,
    );
  }

  return emptyResponse();
}
