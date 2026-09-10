"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/content/i18n";

type InquiryFormProps = {
  captain: string;
  locale: Locale;
};

export function InquiryForm({ captain, locale }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const copy = locale === "cg"
    ? {
        eyebrow: "Upit kapetanu",
        heading: `Pošalji upit za ${captain}`,
        intro: "Ovo nije trenutna rezervacija. Pošalji željeni termin i osnovne podatke, a kapetan potvrđuje dostupnost i detalje.",
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
        successTitle: "Upit je zabilježen.",
        successBody: "Ovo je testna verzija obrasca. Prije javnog puštanja povezujemo ga sa trajnim čuvanjem i dostavom upita.",
        back: "Nazad na kapetane",
      }
    : {
        eyebrow: "Captain inquiry",
        heading: `Send an inquiry for ${captain}`,
        intro: "This is not an instant booking. Send your preferred time and basic details; the captain confirms availability and the day together with you.",
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
        successTitle: "Inquiry recorded.",
        successBody: "This is the test version of the form. Before public launch, it will be connected to persistent storage and delivery.",
        back: "Back to captains",
      };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
              <input className={inputClass} name="date" type="date" required />
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

          <button className="button-primary focus-ring mt-1 w-full justify-center sm:mt-2 sm:w-fit" type="submit">{copy.send}</button>
        </form>
      )}
    </div>
  );
}
