import { createHash, timingSafeEqual } from "node:crypto";
import Link from "next/link";
import { redirect } from "next/navigation";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Inquiry = {
  id: string;
  reference: string;
  captain_name: string;
  preferred_date: string;
  preferred_time: string;
  guest_name: string;
  status: "received" | "forwarded" | "accepted" | "taken_over" | "unavailable" | "closed";
  guest_access_token_hash: string | null;
};

type Message = {
  id: string;
  sender_role: "guest" | "captain" | "system";
  sender_name: string | null;
  body: string;
  created_at: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function headers() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

async function loadInquiry(reference: string): Promise<Inquiry | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const params = new URLSearchParams({
    select: "id,reference,captain_name,preferred_date,preferred_time,guest_name,status,guest_access_token_hash",
    reference: `eq.${reference}`,
    limit: "1",
  });
  const response = await fetch(`${SUPABASE_URL}/rest/v1/inquiries?${params.toString()}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Inquiry[];
  return rows[0] ?? null;
}

function tokenMatches(inquiry: Inquiry | null, token: string) {
  if (!inquiry?.guest_access_token_hash || !token) return false;
  return safeEqual(inquiry.guest_access_token_hash, hashToken(token));
}

async function loadMessages(inquiryId: string): Promise<{ messages: Message[]; available: boolean }> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return { messages: [], available: false };
  const params = new URLSearchParams({
    select: "id,sender_role,sender_name,body,created_at",
    inquiry_id: `eq.${inquiryId}`,
    order: "created_at.asc",
  });
  const response = await fetch(`${SUPABASE_URL}/rest/v1/inquiry_messages?${params.toString()}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!response.ok) return { messages: [], available: false };
  return { messages: (await response.json()) as Message[], available: true };
}

async function sendGuestMessage(formData: FormData) {
  "use server";
  const reference = String(formData.get("reference") || "");
  const token = String(formData.get("token") || "");
  const body = String(formData.get("body") || "").trim().slice(0, 2000);
  if (!reference || !token || !body) redirect(`/conversation/${encodeURIComponent(reference)}?token=${encodeURIComponent(token)}`);

  const inquiry = await loadInquiry(reference);
  if (!tokenMatches(inquiry, token) || !inquiry) redirect("/");

  const response = await fetch(`${SUPABASE_URL}/rest/v1/inquiry_messages`, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      inquiry_id: inquiry.id,
      sender_role: "guest",
      sender_name: inquiry.guest_name,
      body,
    }),
    cache: "no-store",
  });

  const suffix = response.ok ? "" : "&error=message";
  redirect(`/conversation/${encodeURIComponent(reference)}?token=${encodeURIComponent(token)}${suffix}`);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sr-Latn-ME", { day: "2-digit", month: "2-digit", year: "numeric" })
    .format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("sr-Latn-ME", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { reference } = await params;
  const query = await searchParams;
  const token = query.token || "";
  const inquiry = await loadInquiry(reference);

  if (!tokenMatches(inquiry, token) || !inquiry) {
    return (
      <main className="min-h-screen bg-canvas px-5 py-12 text-ink sm:px-8">
        <div className="mx-auto max-w-lg border border-ink/15 bg-wash p-7">
          <p className="eyebrow">FishWithLocals</p>
          <h1 className="mt-3 font-serif text-4xl">Razgovor nije dostupan</h1>
          <p className="mt-4 leading-7 text-ink/70">Ovaj privatni link nije važeći ili je nastao prije aktiviranja FWL razgovora.</p>
          <Link className="button-primary focus-ring mt-7 inline-flex" href="/">Nazad na FishWithLocals</Link>
        </div>
      </main>
    );
  }

  const { messages, available } = await loadMessages(inquiry.id);
  const unavailable = inquiry.status === "unavailable";

  return (
    <main className="min-h-screen bg-canvas pb-8 text-ink">
      <header className="border-b border-ink/15 px-5 py-5 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">FishWithLocals razgovor</p>
          <h1 className="mt-1 font-serif text-3xl">{inquiry.captain_name}</h1>
          <p className="mt-1 text-sm text-ink/60">{formatDate(inquiry.preferred_date)} · {inquiry.preferred_time.slice(0, 5)} · {inquiry.reference}</p>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-5 py-6 sm:px-8">
        {unavailable ? (
          <div className="mb-5 border border-ink/15 bg-wash p-4 text-sm leading-6">
            Kapetan nije dostupan za traženi termin. FishWithLocals može pomoći da pronađeš drugu opciju.
          </div>
        ) : null}

        {!available ? (
          <div className="border border-ink/15 bg-wash p-5 text-sm leading-6 text-ink/70">
            Razgovor je pripremljen, ali baza poruka još nije aktivirana za pilot.
          </div>
        ) : (
          <>
            <div className="grid gap-3" aria-live="polite">
              {messages.length === 0 ? (
                <div className="border border-ink/10 bg-white/35 p-5 text-sm leading-6 text-ink/65">
                  Upit je evidentiran. Ovdje će se pojaviti poruke između tebe i kapetana.
                </div>
              ) : messages.map((message) => {
                const guest = message.sender_role === "guest";
                return (
                  <article
                    className={`max-w-[88%] border p-4 ${guest ? "ml-auto border-ink/20 bg-ink text-canvas" : "mr-auto border-ink/15 bg-white/45"}`}
                    key={message.id}
                  >
                    <p className={`text-xs font-semibold ${guest ? "text-canvas/65" : "text-ink/50"}`}>
                      {guest ? "Ti" : message.sender_name || inquiry.captain_name}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.body}</p>
                    <p className={`mt-2 text-[11px] ${guest ? "text-canvas/55" : "text-ink/45"}`}>{formatTime(message.created_at)}</p>
                  </article>
                );
              })}
            </div>

            {!unavailable && inquiry.status !== "closed" ? (
              <form action={sendGuestMessage} className="mt-6 border-t border-ink/15 pt-5">
                <input name="reference" type="hidden" value={inquiry.reference} />
                <input name="token" type="hidden" value={token} />
                <label className="grid gap-2 text-sm font-medium">
                  Poruka kapetanu
                  <textarea className="min-h-28 w-full border border-ink/20 bg-canvas px-4 py-3 text-base" maxLength={2000} name="body" required />
                </label>
                {query.error ? <p className="mt-3 text-sm font-medium">Poruka nije poslata. Pokušaj ponovo.</p> : null}
                <button className="button-primary focus-ring mt-4 w-full justify-center sm:w-auto" type="submit">Pošalji poruku</button>
              </form>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
