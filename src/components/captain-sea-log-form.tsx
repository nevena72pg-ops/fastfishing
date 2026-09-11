"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LocationState = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
} | null;

function localDateTimeValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function CaptainSeaLogForm() {
  const router = useRouter();
  const [category, setCategory] = useState("species");
  const [location, setLocation] = useState<LocationState>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const observedAt = useMemo(localDateTimeValue, []);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function requestLocation() {
    setMessage(null);
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setMessage("Telefon ne podržava automatsko određivanje lokacije.");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
        });
        setLocationStatus("ready");
      },
      () => {
        setLocationStatus("error");
        setMessage("Lokacija nije dostupna. Možeš poslati opažanje i bez nje, ali je korisnije kada je uključiš.");
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 30_000 },
    );
  }

  function handlePhotoChange(file: File | undefined) {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (location) {
      formData.set("latitude", String(location.latitude));
      formData.set("longitude", String(location.longitude));
      if (location.accuracy !== null) formData.set("locationAccuracy", String(location.accuracy));
    }

    try {
      const response = await fetch("/api/captain/sea-log", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Sea Log nije mogao biti sačuvan.");

      form.reset();
      setCategory("species");
      setLocation(null);
      setLocationStatus("idle");
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      setMessage("Opažanje je sačuvano u Sea Log-u.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sea Log nije mogao biti sačuvan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5 border border-ink/15 bg-white/35 p-5 sm:p-6" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Novo opažanje</p>
        <h3 className="mt-2 font-serif text-3xl">Šta vidiš na moru?</h3>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Fotografija i lokacija pomažu da opažanje kasnije može da se provjeri i koristi kao citizen-science podatak.
        </p>
      </div>

      <label className="grid gap-2 text-sm font-medium">
        Vrsta opažanja
        <select
          className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-base"
          name="category"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          <option value="species">Vrsta / životinja</option>
          <option value="waste">Otpad / plastika</option>
          <option value="water">Promjena vode</option>
          <option value="weather">Vrijeme / stanje mora</option>
          <option value="other">Drugo</option>
        </select>
      </label>

      {category === "species" ? (
        <label className="grid gap-2 text-sm font-medium">
          Koja vrsta?
          <input
            className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-base"
            list="sea-log-species"
            name="speciesName"
            placeholder="npr. riba lav"
          />
          <datalist id="sea-log-species">
            <option value="Riba lav" />
            <option value="Vatreni crv" />
          </datalist>
        </label>
      ) : null}

      <label className="grid gap-2 text-sm font-medium">
        Vrijeme opažanja
        <input
          className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-base"
          defaultValue={observedAt}
          name="observedAt"
          type="datetime-local"
        />
      </label>

      <div className="grid gap-3">
        <p className="text-sm font-medium">Lokacija</p>
        <button
          className="focus-ring min-h-12 border border-ink/25 px-4 py-3 text-sm font-semibold"
          disabled={locationStatus === "loading"}
          onClick={requestLocation}
          type="button"
        >
          {locationStatus === "loading"
            ? "Tražim GPS lokaciju…"
            : locationStatus === "ready"
              ? "Lokacija dodata ✓"
              : "Dodaj trenutnu GPS lokaciju"}
        </button>
        {location ? (
          <p className="text-xs leading-5 text-ink/55">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            {location.accuracy !== null ? ` · tačnost oko ${Math.round(location.accuracy)} m` : ""}
          </p>
        ) : (
          <p className="text-xs leading-5 text-ink/55">Lokacija nije obavezna, ali značajno povećava vrijednost opažanja.</p>
        )}
      </div>

      <label className="grid gap-2 text-sm font-medium">
        Fotografija
        <input
          accept="image/*"
          capture="environment"
          className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-sm"
          name="photo"
          onChange={(event) => handlePhotoChange(event.target.files?.[0])}
          type="file"
        />
        <span className="text-xs font-normal leading-5 text-ink/55">Na telefonu ovo može odmah otvoriti kameru. Maksimalno 10 MB.</span>
      </label>

      {photoPreview ? (
        <div className="overflow-hidden border border-ink/15 bg-wash">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Pregled fotografije opažanja" className="max-h-80 w-full object-cover" src={photoPreview} />
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-medium">
        Kratka napomena
        <textarea
          className="min-h-28 border border-ink/20 bg-canvas px-4 py-3 text-base"
          maxLength={2000}
          name="notes"
          placeholder="Koliko ih je bilo, dubina, ponašanje, približna veličina…"
        />
      </label>

      {message ? <p className="border border-ink/15 bg-wash p-4 text-sm leading-6" role="status">{message}</p> : null}

      <button className="button-primary focus-ring w-full justify-center disabled:opacity-60 sm:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Čuvam…" : "Sačuvaj opažanje"}
      </button>
    </form>
  );
}
