"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { homeCopy } from "@/content/home";
import { locales, type Locale } from "@/content/i18n";

type SiteHeaderProps = {
  languageBasePath?: string;
  languageParams?: Record<string, string>;
  locale: Locale;
};

export function SiteHeader({ languageBasePath = "/", languageParams = {}, locale }: SiteHeaderProps) {
  const copy = homeCopy[locale];
  const navItems: readonly (readonly [string, string])[] = [
    ...copy.nav,
    [locale === "cg" ? "Dnevnik mora" : "Sea Log", "#citizen-science"],
  ];

  const sectionHref = (href: string) => {
    return locale === "cg" ? `/?lang=cg${href}` : `/${href}`;
  };

  const languageHref = (language: Locale) => {
    const params = new URLSearchParams(languageParams);

    if (language === "cg") {
      params.set("lang", "cg");
    } else {
      params.delete("lang");
    }

    const query = params.toString();
    return query ? `${languageBasePath}?${query}` : languageBasePath;
  };

  const closeMobileMenu = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.closest("details")?.removeAttribute("open");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-canvas/95 backdrop-blur-md">
      <div className="page-shell flex min-h-[4.5rem] items-center justify-between gap-4 py-3">
        <Link className="font-serif text-[1.3rem] tracking-[-0.025em] text-ink focus-ring" href={copy.logoHref}>
          FishWithLocals
        </Link>

        <nav aria-label={copy.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm text-ink/78">
            {navItems.map(([label, href]) => (
              <li key={href}>
                <Link className="nav-link focus-ring whitespace-nowrap" href={sectionHref(href)}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="language-switcher hidden lg:flex" aria-label={copy.languageSwitcherLabel}>
          {(Object.keys(locales) as Locale[]).map((language) => (
            <Link
              aria-current={language === locale ? "page" : undefined}
              aria-label={locales[language].languageName}
              className="language-option focus-ring"
              href={languageHref(language)}
              key={language}
              hrefLang={language === "cg" ? "cnr-Latn-ME" : "en"}
            >
              <span aria-hidden="true">{locales[language].flag}</span> {locales[language].label}
            </Link>
          ))}
        </div>

        <details className="mobile-nav group relative lg:hidden">
          <summary className="focus-ring inline-flex min-h-11 cursor-pointer list-none items-center gap-2 border border-ink/15 px-3 py-2 text-sm font-semibold text-ink">
            <span className="flex w-4 flex-col gap-1.5 group-open:hidden" aria-hidden="true">
              <span className="h-px w-4 bg-ink" />
              <span className="h-px w-4 bg-ink" />
            </span>
            <span className="hidden text-xl font-normal leading-none group-open:inline" aria-hidden="true">×</span>
            {copy.menu}
          </summary>

          <nav
            aria-label={copy.mobileNavLabel}
            className="fixed inset-x-4 top-[5rem] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto border border-ink/12 bg-canvas p-5 shadow-[0_22px_70px_rgba(24,42,42,0.18)] sm:left-auto sm:right-6 sm:w-[22rem]"
          >
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {navItems.map(([label, href]) => (
                <li key={href}>
                  <Link
                    className="focus-ring flex min-h-14 items-center justify-between py-3 text-base font-medium text-ink"
                    href={sectionHref(href)}
                    onClick={closeMobileMenu}
                  >
                    <span>{label}</span>
                    <span aria-hidden="true" className="text-ink/40">→</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <p className="eyebrow mb-3 text-ink/45">{copy.languageSwitcherLabel}</p>
              <div className="language-switcher inline-flex" aria-label={copy.languageSwitcherLabel}>
                {(Object.keys(locales) as Locale[]).map((language) => (
                  <Link
                    aria-current={language === locale ? "page" : undefined}
                    aria-label={locales[language].languageName}
                    className="language-option focus-ring"
                    href={languageHref(language)}
                    key={language}
                    hrefLang={language === "cg" ? "cnr-Latn-ME" : "en"}
                    onClick={closeMobileMenu}
                  >
                    <span aria-hidden="true">{locales[language].flag}</span> {locales[language].label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
