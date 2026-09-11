"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/content/i18n";

type InquiryFormProps = {
  captain: string;
  locale: Locale;
};

export function InquiryForm({ captain, locale }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const copy = locale === "cg"
    ? {
        eyebrow: "Upit kapetanu",
        heading: `Pošalji upit za ${captain}`,
        intro: "Pošalji željeni termin i osnovne podatke. Kapetan će potvrditi dostupnost i javiti se za detalje.",
        captain: "Kapetan",
        date: "Željeni datum",
        time: "Vrijeme polaska",
        duration: "Planirano trajanje ture",
        people: "Broj osoba",
        experience: "Vrsta iskustva",
        name: "Ime i prezime",
        phone: "Broj telefona",
        preferredContact: "Kako želiš da te kapetan kontaktira?",
        note: "Napomena",
        choose: "Izaberi",
        experiences: ["Ribolov", "Porodični izlazak", "Početnici / učenje", "Izlazak na more", "Drugo"],
        durations: ["2 sata", "3 sata", "4 sata", "6 sati", "Cijeli dan"],
        contactMethods: ["WhatsApp", "Viber", "Telefon"],
        send: "Pošalji upit",
        sending: "Šaljem upit…",
        successTitle: "Upit je primljen.",
        successBody: "FishWithLocals će proslijediti upit kapetanu. Kada ga kapetan preuzme, dalje komunicirate direktno.",
        reference: "Broj upita",
        error: "Upit trenutno nije mogao biti poslat. Pokušaj ponovo za nekoliko trenutaka.",
        back: "Nazad na kapetane",
      }
    : {
        eyebrow: "Captain inquiry",
        heading: `Send an inquiry for ${captain}`,
        intro: "Send your preferred date, time and basic details. The captain will confirm availability and get in touch about the details.",
        captain: "Captain",
        date: "Preferred date",
        time: "Departure time",
        duration: "Planned tour duration",
        people: "Number of guests",
        experience: "Type of experience",
        name: "Full name",
        phone: "Phone number",
        preferredContact: "How would you like the captain to contact you?",
        note: "Note",
        choose: "Choose",
        experiences: ["Fishing", "Family outing", "Beginners / learning", "Time at sea", "Other"],
        durations: ["2 hours", "3 hours", "4 hours", "6 hours", "Full day"],
        contactMethods: ["WhatsApp", "Viber", "Phone"],
        send: "Send inquiry",
        sending: "Sending inquiry…",
        successTitle: "Inquiry received.",
        successBody: "FishWithLocals will forward the inquiry to the captain. Once the captain takes over the conversation, you continue directly.",
        reference: "Inquiry reference",
        error: "The inquiry could not be sent right now. Please try again in a moment.",
        back: "Back to captains",
      };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      const result = await response.json() as { reference?: string };
      setReference(result.reference ?? null);
      setSubmitted(true);
      form.reset();
    } catch {
      setError(copy.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = "min-h-12 w-full rounded-none border border-ink/20 bg-canvas px-4 py-3 text-base focus-ring";

  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className="mt-4 font-serif text-[clamp(2.6rem,11vw,4rem)] leading-[1.02] tracking-tight">{copy.heading}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">{copy.intro}</p>

      {submitted ? (
        <section className="mt-8 border border-ink/15 bg-wash p-6 sm:p-7 md:p-9" aria-live="polite">
          <h2 className="font-serif text-3xl">{copy.successTitle}</h2>
          <p className="mt-4 leading-7 text-ink/70">{copy.successBody}</p>
          {reference ? <p className="mt-4 text-sm font-medium text-ink/75">{copy.reference}: {reference}</p> : null}
          <Link className="button-primary focus-ring mt-7 inline-flex w-full justify-center sm:w-auto" href={locale === "cg" ? "/?lang=cg#captains" : "/#captains"}>{copy.back}</Link>
        </section>
      ) : (
        <form className="mt-8 grid gap-5 border-t border-ink/15 pt-7 sm:gap-6 sm:pt-8" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            {copy.captain}
            <input className={`${inputClass} bg-wash`} name="captain" value={captain} readOnly />
          </label>

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <label className="grid gap-2 text-sm font-medium">
              {copy.date}
              <input className={inputClass} min={minDate} name="date" type="date" required />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {copy.time}
              <input className={inputClass} name="time" type="time" required />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <label className="grid gap-2 text-sm font-medium">
              {copy.duration}
              <select className={inputClass} name="duration" defaultValue="" required>
                <option value="" disabled>{copy.choose}</option>
                {copy.durations.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {copy.people}
              <input className={inputClass} inputMode="numeric" min="1" name="people" type="number" required />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            {copy.experience}
            <select className={inputClass} name="experience" defaultValue="" required>
              <option value="" disabled>{copy.choose}</option>
              {copy.experiences.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            {copy.name}
            <input className={inputClass} name="guestName" autoComplete="name" required />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            {copy.phone}
            <input className={inputClass} name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            {copy.preferredContact}
            <select className={inputClass} name="preferredContact" defaultValue="" required>
              <option value="" disabled>{copy.choose}</option>
              {copy.contactMethods.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            {copy.note}
            <textarea className={`${inputClass} min-h-32 resize-y`} name="note" />
          </label>

          {error ? <p className="text-sm font-medium text-ink" role="alert">{error}</p> : null}

          <button className="button-primary focus-ring mt-1 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:mt-2 sm:w-fit" disabled={isSubmitting} type="submit">
            {isSubmitting ? copy.sending : copy.send}
          </button>
        </form>
      )}
    </div>
  );
}
