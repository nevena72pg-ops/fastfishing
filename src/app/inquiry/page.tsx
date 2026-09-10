"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function InquiryPage() {
  const searchParams = useSearchParams();
  const locale = searchParams.get("lang") === "cg" ? "cg" : "en";
  const captain = useMemo(() => searchParams.get("captain") || (locale === "cg" ? "Izabrani kapetan" : "Selected captain"), [searchParams, locale]);
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
        contact: "Kontakt email ili telefon",
        note: "Napomena",
        choose: "Izaberi",
        experiences: ["Ribolov", "Porodični izlazak", "Početnici / učenje", "Izlazak na more", "Drugo"],
        durations: ["2 sata", "3 sata", "4 sata", "6 sati", "Cijeli dan"],
        send: "Pošalji upit",
        successTitle: "Upit je spreman.",
        successBody: "Za javno puštanje još treba povezati formu sa stvarnim servisom za prijem upita. Korisnički tok i validacija polja su postavljeni.",
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
        contact: "Contact email or phone",
        note: "Note",
        choose: "Choose",
        experiences: ["Fishing", "Family outing", "Beginners / learning", "Time at sea", "Other"],
        durations: ["2 hours", "3 hours", "4 hours", "6 hours", "Full day"],
        send: "Send inquiry",
        successTitle: "Your inquiry is ready.",
        successBody: "Before public launch, this form still needs to be connected to a real inquiry delivery or storage service. The user flow and field validation are in place.",
        back: "Back to captains",
      };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="page-shell py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight md:text-6xl">{copy.heading}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">{copy.intro}</p>

        {submitted ? (
          <section className="mt-10 border border-ink/15 bg-wash p-7 md:p-9" aria-live="polite">
            <h2 className="font-serif text-3xl">{copy.successTitle}</h2>
            <p className="mt-4 leading-7 text-ink/70">{copy.successBody}</p>
            <Link className="button-primary focus-ring mt-7 inline-flex" href={locale === "cg" ? "/?lang=cg#captains" : "/#captains"}>{copy.back}</Link>
          </section>
        ) : (
          <form className="mt-10 grid gap-6 border-t border-ink/15 pt-8" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium">
              {copy.captain}
              <input className="border border-ink/20 bg-wash px-4 py-3 text-base" name="captain" value={captain} readOnly />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {copy.date}
                <input className="border border-ink/20 bg-canvas px-4 py-3 text-base" name="date" type="date" required />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {copy.time}
                <input className="border border-ink/20 bg-canvas px-4 py-3 text-base" name="time" type="time" required />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {copy.duration}
                <select className="border border-ink/20 bg-canvas px-4 py-3 text-base" name="duration" defaultValue="" required>
                  <option value="" disabled>{copy.choose}</option>
                  {copy.durations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {copy.people}
                <input className="border border-ink/20 bg-canvas px-4 py-3 text-base" min="1" max="20" name="people" type="number" required />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              {copy.experience}
              <select className="border border-ink/20 bg-canvas px-4 py-3 text-base" name="experience" defaultValue="" required>
                <option value="" disabled>{copy.choose}</option>
                {copy.experiences.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              {copy.name}
              <input className="border border-ink/20 bg-canvas px-4 py-3 text-base" name="guestName" autoComplete="name" required />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              {copy.contact}
              <input className="border border-ink/20 bg-canvas px-4 py-3 text-base" name="contact" required />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              {copy.note}
              <textarea className="min-h-32 border border-ink/20 bg-canvas px-4 py-3 text-base" name="note" />
            </label>

            <button className="button-primary focus-ring mt-2 w-fit" type="submit">{copy.send}</button>
          </form>
        )}
      </div>
    </main>
  );
}
