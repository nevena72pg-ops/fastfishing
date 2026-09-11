import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "fwl_captain_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

const CAPTAINS = [
  { id: "feta", name: "Feta", codeEnv: "CAPTAIN_PORTAL_FETA_CODE" },
  { id: "backo", name: "Baćko — Petar Radulović", codeEnv: "CAPTAIN_PORTAL_BACKO_CODE" },
] as const;

type Captain = (typeof CAPTAINS)[number];
type InquiryStatus = "received" | "forwarded" | "accepted" | "taken_over" | "unavailable" | "closed";

type Inquiry = {
  id: string;
  reference: string;
  captain_name: string;
  preferred_date: string;
  preferred_time: string;
  planned_duration: string;
  party_size: number;
  experience_type: string;
  guest_name: string;
  guest_phone: string;
  preferred_contact: string;
  note: string | null;
  status: InquiryStatus;
  created_at: string;
};

type CaptainSession = {
  id: Captain["id"];
  name: string;
  exp: number;
};

const statusLabels: Record<InquiryStatus, string> = {
  received: "Novi upit",
  forwarded: "Novi upit",
  accepted: "Preuzet",
  taken_over: "Preuzet",
  unavailable: "Nijesam dostupan",
  closed: "Zatvoren",
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

function makeSession(captain: Captain) {
  const payload = Buffer.from(
    JSON.stringify({ id: captain.id, name: captain.name, exp: Date.now() + SESSION_SECONDS * 1000 }),
  ).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

function parseSession(token: string | undefined): CaptainSession | null {
  if (!token || !sessionSecret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, signPayload(payload))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as CaptainSession;
    if (!parsed.id || !parsed.name || !parsed.exp || parsed.exp < Date.now()) return null;
    const captain = CAPTAINS.find((item) => item.id === parsed.id && item.name === parsed.name);
    return captain ? parsed : null;
  } catch {
    return null;
  }
}

async function currentCaptain() {
  const store = await cookies();
  return parseSession(store.get(COOKIE_NAME)?.value);
}

async function loginAction(formData: FormData) {
  "use server";

  const captainId = String(formData.get("captain") || "");
  const code = String(formData.get("code") || "").trim();
  const captain = CAPTAINS.find((item) => item.id === captainId);

  if (!captain || !code) redirect("/captain?error=login");

  const expectedCode = process.env[captain.codeEnv];
  if (!expectedCode) redirect("/captain?error=setup");
  if (!safeEqual(code, expectedCode)) redirect("/captain?error=login");

  const store = await cookies();
  store.set(COOKIE_NAME, makeSession(captain), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });

  redirect("/captain");
}

async function logoutAction() {
  "use server";
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/captain");
}

async function loadInquiries(captainName: string): Promise<Inquiry[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return [];

  const fields = [
    "id",
    "reference",
    "captain_name",
    "preferred_date",
    "preferred_time",
    "planned_duration",
    "party_size",
    "experience_type",
    "guest_name",
    "guest_phone",
    "preferred_contact",
    "note",
    "status",
    "created_at",
  ].join(",");

  const params = new URLSearchParams({
    select: fields,
    captain_name: `eq.${captainName}`,
    order: "created_at.desc",
    limit: "50",
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/inquiries?${params.toString()}`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return [];
  return response.json();
}

async function updateInquiryAction(formData: FormData) {
  "use server";

  const session = await currentCaptain();
  if (!session) redirect("/captain?error=session");

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["taken_over", "unavailable"].includes(status)) redirect("/captain");

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) redirect("/captain?error=data");

  const checkParams = new URLSearchParams({
    select: "id,captain_name",
    id: `eq.${id}`,
    captain_name: `eq.${session.name}`,
    limit: "1",
  });

  const check = await fetch(`${supabaseUrl}/rest/v1/inquiries?${checkParams.toString()}`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!check.ok) redirect("/captain?error=data");
  const rows = (await check.json()) as { id: string; captain_name: string }[];
  if (!rows[0]) redirect("/captain?error=session");

  const now = new Date().toISOString();
  const payload = status === "taken_over"
    ? { status: "taken_over", captain_responded_at: now, captain_response: "Preuzimam" }
    : { status: "unavailable", captain_responded_at: now, unavailable_at: now, captain_response: "Nisam dostupan" };

  const patchParams = new URLSearchParams({ id: `eq.${id}`, captain_name: `eq.${session.name}` });
  const response = await fetch(`${supabaseUrl}/rest/v1/inquiries?${patchParams.toString()}`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) redirect("/captain?error=data");
  redirect("/captain");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sr-Latn-ME", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatCreated(value: string) {
  return new Intl.DateTimeFormat("sr-Latn-ME", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function CaptainPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const session = await currentCaptain();

  if (!session) {
    const configured = CAPTAINS.some((captain) => Boolean(process.env[captain.codeEnv]));
    const message = params.error === "login"
      ? "Podaci za pristup nijesu tačni."
      : params.error === "setup"
        ? "Pilot pristup za ovog kapetana još nije aktiviran."
        : null;

    return (
      <main className="min-h-screen bg-canvas px-5 py-10 text-ink sm:px-8">
        <div className="mx-auto max-w-md">
          <p className="eyebrow">FishWithLocals</p>
          <h1 className="mt-4 font-serif text-5xl leading-none">FWL Captain</h1>
          <p className="mt-5 text-base leading-7 text-ink/70">
            Privatni pilot portal za kapetane — upiti gostiju, komunikacija i Sea Log na jednom mjestu.
          </p>

          <form action={loginAction} className="mt-9 grid gap-5 border-t border-ink/15 pt-7">
            <label className="grid gap-2 text-sm font-medium">
              Kapetan
              <select className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-base" name="captain" defaultValue="feta">
                {CAPTAINS.map((captain) => <option key={captain.id} value={captain.id}>{captain.name}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Pristupni kod
              <input className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-base" name="code" type="password" autoComplete="current-password" required />
            </label>
            {message ? <p className="text-sm font-medium" role="alert">{message}</p> : null}
            {!configured ? (
              <p className="border border-ink/15 bg-wash p-4 text-sm leading-6 text-ink/70">
                Pilot portal je pripremljen, ali pristupni kodovi još nijesu aktivirani.
              </p>
            ) : null}
            <button className="button-primary focus-ring w-full justify-center" type="submit">Uđi u FWL Captain</button>
          </form>
        </div>
      </main>
    );
  }

  const inquiries = await loadInquiries(session.name);
  const openInquiries = inquiries.filter((item) => item.status !== "closed");

  return (
    <main className="min-h-screen bg-canvas pb-28 text-ink">
      <header className="border-b border-ink/15 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">FWL Captain</p>
            <h1 className="mt-1 font-serif text-3xl">{session.name}</h1>
          </div>
          <form action={logoutAction}>
            <button className="focus-ring border border-ink/20 px-4 py-2 text-sm font-semibold" type="submit">Odjava</button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-7 sm:px-8 sm:py-9">
        <div className="flex items-end justify-between gap-4 border-b border-ink/15 pb-5">
          <div>
            <p className="eyebrow">Upiti</p>
            <h2 className="mt-2 font-serif text-4xl">Inbox</h2>
          </div>
          <p className="text-sm text-ink/55">{openInquiries.length} aktivnih</p>
        </div>

        {params.error ? (
          <p className="mt-5 border border-ink/15 bg-wash p-4 text-sm">Nešto nije prošlo kako treba. Pokušaj ponovo.</p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {inquiries.length === 0 ? (
            <div className="border border-ink/15 bg-wash p-6">
              <h3 className="font-serif text-2xl">Nema novih upita.</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">Kad gost pošalje upit preko FishWithLocals sajta, pojaviće se ovdje.</p>
            </div>
          ) : inquiries.map((inquiry) => {
            const actionable = inquiry.status === "received" || inquiry.status === "forwarded";
            return (
              <article className="border border-ink/15 bg-white/35 p-5 sm:p-6" key={inquiry.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">{statusLabels[inquiry.status]}</p>
                    <h3 className="mt-2 font-serif text-2xl">{formatDate(inquiry.preferred_date)} · {inquiry.preferred_time.slice(0, 5)}</h3>
                    <p className="mt-1 text-xs text-ink/50">{inquiry.reference} · primljen {formatCreated(inquiry.created_at)}</p>
                  </div>
                  <p className="text-sm font-semibold">{inquiry.party_size} osoba</p>
                </div>

                <div className="mt-5 grid gap-4 border-t border-ink/10 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-ink/45">Gost</p>
                    <p className="mt-1 font-semibold">{inquiry.guest_name}</p>
                    <p className="mt-1 text-sm">{inquiry.guest_phone}</p>
                    <p className="text-sm text-ink/55">{inquiry.preferred_contact}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-ink/45">Izlazak</p>
                    <p className="mt-1">{inquiry.experience_type}</p>
                    <p className="text-sm text-ink/55">{inquiry.planned_duration}</p>
                  </div>
                </div>

                {inquiry.note ? (
                  <div className="mt-4 border-t border-ink/10 pt-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-ink/45">Napomena</p>
                    <p className="mt-1 text-sm leading-6 text-ink/75">{inquiry.note}</p>
                  </div>
                ) : null}

                {actionable ? (
                  <div className="mt-5 grid gap-3 border-t border-ink/10 pt-5 sm:grid-cols-2">
                    <form action={updateInquiryAction}>
                      <input name="id" type="hidden" value={inquiry.id} />
                      <input name="status" type="hidden" value="taken_over" />
                      <button className="button-primary focus-ring w-full justify-center" type="submit">Preuzimam</button>
                    </form>
                    <form action={updateInquiryAction}>
                      <input name="id" type="hidden" value={inquiry.id} />
                      <input name="status" type="hidden" value="unavailable" />
                      <button className="focus-ring min-h-12 w-full border border-ink/25 px-4 py-3 text-sm font-semibold" type="submit">Nijesam dostupan</button>
                    </form>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 border-t border-ink/15 bg-canvas/95 px-3 py-3 backdrop-blur" aria-label="FWL Captain">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-2 text-center text-xs font-semibold">
          <span className="bg-ink px-2 py-3 text-canvas">Upiti</span>
          <span className="px-2 py-3 text-ink/40">Poruke</span>
          <span className="px-2 py-3 text-ink/40">Sea Log</span>
          <span className="px-2 py-3 text-ink/40">Profil</span>
        </div>
      </nav>
    </main>
  );
}
