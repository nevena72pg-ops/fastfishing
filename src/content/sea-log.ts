import type { Locale } from "@/content/i18n";

export type SeaLogObservationDraft = {
  date: string;
  approximateLocation: string;
  category: string;
  speciesOrDescription: string;
  approximateDepth?: string;
  evidence?: string[];
  notes?: string;
  verificationStatus: "reported" | "photo documented" | "verified";
};

export const seaLogCopy: Record<Locale, {
  eyebrow: string;
  heading: string;
  body: string;
  note: string;
  returnHome: string;
}> = {
  en: {
    eyebrow: "Sea Log",
    heading: "A quiet place for observations from the water.",
    body: "FishWithLocals will use the Sea Log to collect careful notes from captains and guests: unusual or invasive species, marine litter, abandoned gear, wildlife in distress and other changes noticed at sea.",
    note: "The reporting form is not open yet. We will add real observations only when the verification rules are ready and the people involved know how the information will be used.",
    returnHome: "Return to the homepage",
  },
  cg: {
    eyebrow: "Dnevnik mora",
    heading: "Mirno mjesto za opažanja sa mora.",
    body: "FishWithLocals će koristiti Dnevnik mora za pažljive bilješke kapetana i gostiju: neuobičajene ili invazivne vrste, otpad u moru, napuštenu opremu, životinje u nevolji i druge promjene primijećene na moru.",
    note: "Obrazac za prijavu još nije otvoren. Stvarna opažanja dodaćemo tek kada pravila provjere budu spremna i kada ljudi koji učestvuju znaju kako će se informacije koristiti.",
    returnHome: "Vrati se na početnu",
  },
};
