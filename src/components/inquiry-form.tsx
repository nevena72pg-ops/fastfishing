"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/content/i18n";

type InquiryFormProps = {
  captain: string;
  locale: Locale;
};

function cgInquiryHeading(captain: string) {
  if (captain === "Feta") return "Pošalji upit Feti";
  if (captain === "Baćko — Petar Radulović") return "Pošalji upit Baćku";
  return `Pošalji upit kapetanu ${captain}`;
}

export function InquiryForm({ captain, locale }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const copy = locale === "cg"
    ? {
        eyebrow: "Upit kapetanu",
        heading: cgInquiryHeading(captain),
        intro: "Pošalji željeni termin i osnovne podatke. Kapetan će vidjeti upit u FWL Captain aplikaciji i javiti se kroz FishWithLocals.",
        captain: "Kapetan",
        date: "Željeni datum",
        time: "Vrijeme polaska",
        duration: "Planirano trajanje ture",
        people: "Broj osoba",
        experience: "Vrsta iskustva",
        name: "Ime i prezime",
        phone: "Broj telefona",
        phoneHint: "Telefon čuvamo kao rezervni kontakt za pilot.",
        note: "Napomena",
        choose: "Izaberi",
        experiences: ["Ribolov", "Porodični izlazak", "Početnici / učenje", "Izlazak na more", "Drugo"],
        durations: ["2 sata", "3 sata", "4 sata", "6 sati", "Cijeli dan"],
        send: "Pošalji upit",
        sending: "Šaljem upit…",
        successTitle: "Upit je primljen.",
        successBody: "Upit je stigao u FWL Captain. Razgovor sa kapetanom nastavljaš ovdje, bez WhatsAppa i Vibera.",
        fallbackBody: "Upit je primljen. Privatni FWL razgovor biće dostupan čim završimo aktiviranje pilot baze poruka.",
        reference: "Broj upita",
        openConversation: "Otvori razgovor",
        error: "Upit trenutno nije mogao biti poslat. Pokušaj ponovo za nekoliko trenutaka.",
        back: "Nazad na kapetane",
      }
    : {
        eyebrow: "Captain inquiry",
        heading: `Send an inquiry to ${captain}`,
        intro: "Send your preferred date, time and basic details. The captain will see the inquiry in FWL Captain and reply through FishWithLocals.",
        captain: "Captain",
        date: "Preferred date",
        time: "Departure time",
        duration: "Planned tour duration",
        people: "Number of guests",
        experience: "Type of experience",
        name: "Full name",
        phone: "Phone number",
        phoneHint: "We keep your phone number as a backup contact during the pilot.",
        note: "Note",
        choose: "Choose",
        experiences: ["Fishing", "Family outing", "Beginners / learning", "Time at sea", "Other"],
        durations: ["2 hours", "3 hours", "4 hours", "6 hours", "Full day"],
        send: "Send inquiry",
        sending: "Sending inquiry…",
        successTitle: "Inquiry received.",
        successBody: "Your inquiry is in FWL Captain. Continue the conversation with the captain here, without WhatsApp or Viber.",
        fallbackBody: "Your inquiry was received. The private FWL conversation will be available as soon as the pilot message database is activated.",
        reference: "Inquiry reference",
        openConversation: "Open conversation",
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

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json() as { reference?: string; conversationUrl?: string | null };
      setReference(result.reference ?? null);
      setConversationUrl(result.conversationUrl ?? null);
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
          <p className="mt-4 leading-7 text-ink/70">{conversationUrl ? copy.successBody : copy.fallbackBody}</p>
          {reference ? <p className="mt-4 text-sm font-medium text-ink/75">{copy.reference}: {reference}</p> : null}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {conversationUrl ? (
              <Link className="button-primary focus-ring inline-flex w-full justify-center sm:w-auto" href={conversationUrl}>{copy.openConversation}</Link>
            ) : null}
            <Link className={`${conversationUrl ? "focus-ring border border-ink/25 px-4 py-3 text-center text-sm font-semibold" : "button-primary focus-ring inline-flex"} w-full justify-center sm:w-auto`} href={locale === "cg" ? "/?lang=cg#captains" : "/#captains"}>{copy.back}</Link>
          </div>
        </section>
      ) : (
        <form className="mt-8 grid gap-5 border-t border-ink/15 pt-7 sm:gap-6 sm:pt-8" onSubmit={handleSubmit}>
          <input name="preferredContact" type="hidden" value="FWL" />
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
            <span className="text-xs font-normal leading-5 text-ink/55">{copy.phoneHint}</span>
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
