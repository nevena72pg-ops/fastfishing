type Inquiry = {
  id: string;
  reference: string;
  source: string;
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
  status: "received" | "forwarded" | "accepted" | "closed";
  forwarded_at: string | null;
  accepted_at: string | null;
  closed_at: string | null;
  created_at: string;
};

const statusLabels: Record<Inquiry["status"], string> = {
  received: "Novi upit",
  forwarded: "Proslijeđen kapetanu",
  accepted: "Kapetan preuzeo",
  closed: "Zatvoren",
};

async function loadInquiries(): Promise<Inquiry[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase nije konfigurisan.");
  }

  const fields = [
    "id",
    "reference",
    "source",
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
    "forwarded_at",
    "accepted_at",
    "closed_at",
    "created_at",
  ].join(",");

  const response = await fetch(
    `${supabaseUrl}/rest/v1/inquiries?select=${fields}&order=created_at.desc`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Ne mogu da učitam upite.");
  }

  return response.json();
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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminPage() {
  const inquiries = await loadInquiries();

  return (
    <main className="min-h-screen bg-canvas px-5 py-8 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-ink/15 pb-7">
          <p className="eyebrow">FishWithLocals admin</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Inquiry inbox</h1>
          <p className="mt-3 text-sm text-ink/65">{inquiries.length} ukupno evidentiranih upita</p>
        </div>

        <div className="mt-8 grid gap-5">
          {inquiries.length === 0 ? (
            <p className="border border-ink/15 bg-wash p-6">Još nema upita.</p>
          ) : (
            inquiries.map((inquiry) => (
              <article className="border border-ink/15 bg-white/30 p-5 sm:p-7" key={inquiry.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">{statusLabels[inquiry.status]}</p>
                    <h2 className="mt-2 font-serif text-2xl">{inquiry.reference}</h2>
                    <p className="mt-1 text-sm text-ink/60">Primljen {formatCreated(inquiry.created_at)}</p>
                  </div>
                  <div className="text-sm sm:text-right">
                    <p className="font-semibold">Kapetan {inquiry.captain_name}</p>
                    <p className="text-ink/65">{formatDate(inquiry.preferred_date)} u {inquiry.preferred_time.slice(0, 5)}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 border-t border-ink/10 pt-5 md:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-ink/45">Gost</p>
                    <p className="mt-1 font-medium">{inquiry.guest_name}</p>
                    <p className="mt-1 text-sm">{inquiry.guest_phone}</p>
                    <p className="text-sm text-ink/60">Kontakt: {inquiry.preferred_contact}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-ink/45">Tura</p>
                    <p className="mt-1">{inquiry.experience_type}</p>
                    <p className="text-sm text-ink/60">{inquiry.planned_duration} · {inquiry.party_size} osoba</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-ink/45">Napomena</p>
                    <p className="mt-1 text-sm leading-6 text-ink/75">{inquiry.note || "—"}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
                  {inquiry.status === "received" && (
                    <form action={`/api/admin/inquiries/${inquiry.id}`} method="post">
                      <input name="status" type="hidden" value="forwarded" />
                      <button className="button-primary focus-ring" type="submit">Označi proslijeđeno kapetanu</button>
                    </form>
                  )}
                  {inquiry.status !== "closed" && (
                    <form action={`/api/admin/inquiries/${inquiry.id}`} method="post">
                      <input name="status" type="hidden" value="closed" />
                      <button className="focus-ring border border-ink/25 px-4 py-3 text-sm font-semibold" type="submit">Zatvori upit</button>
                    </form>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
