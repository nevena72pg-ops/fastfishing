export type Locale = "en" | "cg";

export type LocalisedText = Record<Locale, string>;

export const locales = {
  en: {
    label: "EN",
    flag: "🇬🇧",
    languageName: "English",
    htmlLang: "en-GB",
  },
  cg: {
    label: "CG",
    flag: "🇲🇪",
    languageName: "Crnogorski",
    htmlLang: "cnr-Latn-ME",
  },
} as const;

export function languageHref(locale: Locale, pathname = "/") {
  return locale === "en" ? pathname : `${pathname}?lang=cg`;
}

export function resolveLocale(value: string | string[] | undefined): Locale {
  return value === "cg" || (Array.isArray(value) && value[0] === "cg") ? "cg" : "en";
}

export function localise(text: LocalisedText, locale: Locale) {
  return text[locale];
}
