"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/content/i18n";

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

export function GuestSeaLogForm({ locale }: { locale: Locale }) {
  const cg = locale === "cg";
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
      setMessage(cg ? "Telefon ne podržava automatsko određivanje lokacije." : "Your device does not support automatic location.");
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
        setMessage(
          cg
            ? "Lokacija nije dostupna. Opažanje možeš poslati i bez nje."
            : "Location is unavailable. You can still submit the observation without it.",
        );
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
      const response = await fetch("/api/sea-log", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error || (cg ? "Sea Log nije mogao biti sačuvan." : "Sea Log could not be saved."));

      form.reset();
      setCategory("species");
      setLocation(null);
      setLocationStatus("idle");
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      setMessage(
        cg
          ? "Hvala. Opažanje je poslato i čeka provjeru."
          : "Thank you. Your observation was submitted and is awaiting review.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : cg ? "Sea Log nije mogao biti sačuvan." : "Sea Log could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-12 grid gap-5 border border-ink/15 bg-white/35 p-5 sm:p-6" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">{cg ? "Prijavi opažanje" : "Report an observation"}</p>
        <h2 className="mt-2 font-serif text-3xl">{cg ? "Šta si primijetio/la na moru?" : "What did you notice at sea?"}</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          {cg
            ? "Fotografija i GPS nijesu obavezni, ali mnogo pomažu pri provjeri opažanja."
            : "A photo and GPS location are optional, but they help us verify the observation."}
        </p>
      </div>

      <label className="grid gap-2 text-sm font-medium">
        {cg ? "Vrsta opažanja" : "Observation type"}
        <select
          className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-base"
          name="category"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          <option value="species">{cg ? "Vrsta / životinja" : "Species / animal"}</option>
          <option value="waste">{cg ? "Otpad / plastika" : "Waste / plastic"}</option>
          <option value="water">{cg ? "Promjena vode" : "Water change"}</option>
          <option value="weather">{cg ? "Vrijeme / stanje mora" : "Weather / sea state"}</option>
          <option value="other">{cg ? "Drugo" : "Other"}</option>
        </select>
      </label>

      {category === "species" ? (
        <label className="grid gap-2 text-sm font-medium">
          {cg ? "Koja vrsta?" : "Which species?"}
          <input
            className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-base"
            name="speciesName"
            placeholder={cg ? "npr. riba lav" : "e.g. lionfish"}
          />
        </label>
      ) : null}

      <label className="grid gap-2 text-sm font-medium">
        {cg ? "Vrijeme opažanja" : "Observation time"}
        <input
          className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-base"
          defaultValue={observedAt}
          name="observedAt"
          type="datetime-local"
        />
      </label>

      <div className="grid gap-3">
        <p className="text-sm font-medium">{cg ? "Lokacija" : "Location"}</p>
        <button
          className="focus-ring min-h-12 border border-ink/25 px-4 py-3 text-sm font-semibold"
          disabled={locationStatus === "loading"}
          onClick={requestLocation}
          type="button"
        >
          {locationStatus === "loading"
            ? cg ? "Tražim GPS lokaciju…" : "Getting GPS location…"
            : locationStatus === "ready"
              ? cg ? "Lokacija dodata ✓" : "Location added ✓"
              : cg ? "Dodaj trenutnu GPS lokaciju" : "Add current GPS location"}
        </button>
        {location ? (
          <p className="text-xs leading-5 text-ink/55">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            {location.accuracy !== null ? ` · ${cg ? "tačnost oko" : "accuracy about"} ${Math.round(location.accuracy)} m` : ""}
          </p>
        ) : (
          <p className="text-xs leading-5 text-ink/55">
            {cg ? "Lokacija nije obavezna." : "Location is optional."}
          </p>
        )}
      </div>

      <label className="grid gap-2 text-sm font-medium">
        {cg ? "Fotografija" : "Photo"}
        <input
          accept="image/*"
          capture="environment"
          className="min-h-12 border border-ink/20 bg-canvas px-4 py-3 text-sm"
          name="photo"
          onChange={(event) => handlePhotoChange(event.target.files?.[0])}
          type="file"
        />
        <span className="text-xs font-normal leading-5 text-ink/55">
          {cg ? "Na telefonu ovo može odmah otvoriti kameru. Maksimalno 10 MB." : "On a phone this may open the camera directly. Maximum 10 MB."}
        </span>
      </label>

      {photoPreview ? (
        <div className="overflow-hidden border border-ink/15 bg-wash">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={cg ? "Pregled fotografije opažanja" : "Observation photo preview"} className="max-h-80 w-full object-cover" src={photoPreview} />
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-medium">
        {cg ? "Kratka napomena" : "Short note"}
        <textarea
          className="min-h-28 border border-ink/20 bg-canvas px-4 py-3 text-base"
          maxLength={2000}
          name="notes"
          placeholder={cg ? "Koliko ih je bilo, ponašanje, približna veličina…" : "How many, behaviour, approximate size…"}
        />
      </label>

      <p className="text-xs leading-5 text-ink/55">
        {cg
          ? "Prijava se ne objavljuje automatski. Svako opažanje prvo čeka provjeru."
          : "Submissions are not published automatically. Every observation is reviewed first."}
      </p>

      {message ? <p className="border border-ink/15 bg-wash p-4 text-sm leading-6" role="status">{message}</p> : null}

      <button className="button-primary focus-ring w-full justify-center disabled:opacity-60 sm:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? (cg ? "Šaljem…" : "Submitting…") : (cg ? "Pošalji opažanje" : "Submit observation")}
      </button>
    </form>
  );
}
