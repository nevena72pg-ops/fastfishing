import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "fwl_captain_session";

export const CAPTAIN_IDENTITIES = [
  { id: "feta", name: "Feta" },
  { id: "backo", name: "Baćko — Petar Radulović" },
] as const;

export type CaptainSession = {
  id: (typeof CAPTAIN_IDENTITIES)[number]["id"];
  name: string;
  exp: number;
};

function sessionSecret() {
  return process.env.CAPTAIN_PORTAL_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function safeEqual(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

function signPayload(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function parseSession(token: string | undefined): CaptainSession | null {
  if (!token || !sessionSecret()) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, signPayload(payload))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as CaptainSession;
    if (!parsed.id || !parsed.name || !parsed.exp || parsed.exp < Date.now()) return null;

    return CAPTAIN_IDENTITIES.some((captain) => captain.id === parsed.id && captain.name === parsed.name)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export async function currentCaptainSession() {
  const store = await cookies();
  return parseSession(store.get(COOKIE_NAME)?.value);
}

export function captainServiceHeaders(): Record<string, string> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const headers: Record<string, string> = { apikey: key };

  // Supabase's newer sb_secret_* keys are API keys, not JWTs. Sending them as
  // Authorization: Bearer can make Storage try to parse them as a JWT and reject
  // an otherwise valid server-side request. Legacy service_role JWT keys still
  // need the bearer header for role propagation.
  if (!key.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${key}`;
  }

  return headers;
}
