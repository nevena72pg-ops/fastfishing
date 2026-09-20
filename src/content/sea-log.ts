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
    body: "FishWithLocals uses the Sea Log to collect careful notes from captains and guests: unusual or invasive species, marine litter, abandoned gear, wildlife in distress and other changes noticed at sea.",
    note: "Guests can now submit observations directly. Reports are not published automatically: each one stays pending until it can be reviewed.",
    returnHome: "Return to the homepage",
  },
  cg: {
    eyebrow: "Dnevnik mora",
    heading: "Mirno mjesto za opažanja sa mora.",
    body: "FishWithLocals koristi Dnevnik mora za pažljive bilješke kapetana i gostiju: neuobičajene ili invazivne vrste, otpad u moru, napuštenu opremu, životinje u nevolji i druge promjene primijećene na moru.",
    note: "Gosti sada mogu direktno poslati opažanje. Prijave se ne objavljuju automatski: svaka prvo ostaje na provjeri.",
    returnHome: "Vrati se na početnu",
  },
};
