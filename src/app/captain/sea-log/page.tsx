import Link from "next/link";
import { redirect } from "next/navigation";
import { CaptainSeaLogForm } from "@/components/captain-sea-log-form";
import { captainServiceHeaders, currentCaptainSession } from "@/lib/captain-session";

type Observation = {
  id: string;
  category: "species" | "waste" | "water" | "weather" | "other";
  species_name: string | null;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  observed_at: string;
  created_at: string;
  photo_path: string | null;
  review_status: "submitted" | "verified" | "rejected";
};

const categoryLabels: Record<Observation["category"], string> = {
  species: "Vrsta / životinja",
  waste: "Otpad / plastika",
  water: "Promjena vode",
  weather: "Vrijeme / stanje mora",
  other: "Drugo",
};

const reviewLabels: Record<Observation["review_status"], string> = {
  submitted: "Čeka provjeru",
  verified: "Provjereno",
  rejected: "Odbačeno",
};

async function loadObservations(captainName: string): Promise<{ rows: Observation[]; available: boolean }> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return { rows: [], available: false };

  const params = new URLSearchParams({
    select: "id,category,species_name,notes,latitude,longitude,observed_at,created_at,photo_path,review_status",
    captain_name: `eq.${captainName}`,
    order: "observed_at.desc",
    limit: "50",
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/sea_log_observations?${params.toString()}`, {
    headers: captainServiceHeaders(),
    cache: "no-store",
  });

  if (!response.ok) return { rows: [], available: false };
  return { rows: (await response.json()) as Observation[], available: true };
}

function formatObserved(value: string) {
  return new Intl.DateTimeFormat("sr-Latn-ME", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function CaptainSeaLogPage() {
  const session = await currentCaptainSession();
  if (!session) redirect("/captain?error=session");

  const { rows, available } = await loadObservations(session.name);

  return (
    <main className="min-h-screen bg-canvas pb-28 text-ink">
      <header className="border-b border-ink/15 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">FWL Captain</p>
            <h1 className="mt-1 font-serif text-3xl">Sea Log</h1>
          </div>
          <p className="text-right text-sm font-semibold text-ink/65">{session.name}</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-4xl gap-7 px-5 py-7 sm:px-8 sm:py-9">
        <div className="border-b border-ink/15 pb-5">
          <p className="eyebrow">Citizen science</p>
          <h2 className="mt-2 font-serif text-4xl">Dnevnik mora</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
            Bilježi ono što stvarno vidiš na moru. Fotografija, GPS lokacija i vrijeme opažanja čine zapis korisnijim za kasniju stručnu provjeru.
          </p>
        </div>

        {!available ? (
          <div className="border border-ink/15 bg-wash p-5 text-sm leading-6 text-ink/70">
            Sea Log ekran je spreman, ali baza opažanja još nije aktivirana. Unos će proraditi čim primijenimo pilot migracije u Supabase-u.
          </div>
        ) : null}

        <CaptainSeaLogForm />

        <section>
          <div className="flex items-end justify-between gap-4 border-b border-ink/15 pb-4">
            <div>
              <p className="eyebrow">Moja opažanja</p>
              <h3 className="mt-2 font-serif text-3xl">Posljednji zapisi</h3>
            </div>
            <p className="text-sm text-ink/55">{rows.length}</p>
          </div>

          <div className="mt-5 grid gap-4">
            {rows.length === 0 ? (
              <div className="border border-ink/15 bg-white/30 p-5 text-sm leading-6 text-ink/65">
                Još nema Sea Log zapisa za ovog kapetana.
              </div>
            ) : rows.map((observation) => (
              <article className="border border-ink/15 bg-white/35 p-5" key={observation.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">
                      {categoryLabels[observation.category]}
                    </p>
                    <h4 className="mt-2 font-serif text-2xl">
                      {observation.species_name || categoryLabels[observation.category]}
                    </h4>
                    <p className="mt-1 text-xs text-ink/50">{formatObserved(observation.observed_at)}</p>
                  </div>
                  <span className="border border-ink/15 px-3 py-2 text-xs font-semibold">{reviewLabels[observation.review_status]}</span>
                </div>

                {observation.notes ? <p className="mt-4 text-sm leading-6 text-ink/75">{observation.notes}</p> : null}

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/10 pt-4 text-xs text-ink/55">
                  {observation.latitude !== null && observation.longitude !== null ? (
                    <span>GPS: {observation.latitude.toFixed(5)}, {observation.longitude.toFixed(5)}</span>
                  ) : <span>Bez GPS lokacije</span>}
                  <span>{observation.photo_path ? "Fotografija dodata ✓" : "Bez fotografije"}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <nav className="fixed inset-x-0 bottom-0 border-t border-ink/15 bg-canvas/95 px-3 py-3 backdrop-blur" aria-label="FWL Captain">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-2 text-center text-xs font-semibold">
          <Link className="px-2 py-3 text-ink/70" href="/captain">Upiti</Link>
          <Link className="px-2 py-3 text-ink/70" href="/captain?view=messages">Poruke</Link>
          <span className="bg-ink px-2 py-3 text-canvas">Sea Log</span>
          <span className="px-2 py-3 text-ink/35">Profil</span>
        </div>
      </nav>
    </main>
  );
}
