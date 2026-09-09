import Link from "next/link";
import { homeCopy } from "@/content/home";
import { languageHref, locales, type Locale } from "@/content/i18n";

type SiteHeaderProps = {
  languageBasePath?: string;
  locale: Locale;
};

export function SiteHeader({ languageBasePath = "/", locale }: SiteHeaderProps) {
  const copy = homeCopy[locale];
  const sectionHref = (href: string) => {
    if (languageBasePath === "/") {
      return href;
    }

    return locale === "cg" ? `/?lang=cg${href}` : `/${href}`;
  };

  return (
    <header className="border-b border-ink/10 bg-canvas">
      <div className="page-shell flex min-h-20 items-center justify-between gap-6 py-4">
        <Link className="font-serif text-[1.35rem] tracking-[-0.025em] text-ink focus-ring" href={copy.logoHref}>
          FishWithLocals
        </Link>

        <nav aria-label={copy.navLabel} className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-ink/78">
            {copy.nav.map(([label, href]) => (
              <li key={href}>
                <Link className="nav-link focus-ring" href={sectionHref(href)}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="language-switcher hidden md:flex" aria-label={copy.languageSwitcherLabel}>
          {(Object.keys(locales) as Locale[]).map((language) => (
            <Link
              aria-current={language === locale ? "page" : undefined}
              aria-label={locales[language].languageName}
              className="language-option focus-ring"
              href={languageHref(language, languageBasePath)}
              key={language}
              hrefLang={language === "cg" ? "cnr-Latn-ME" : "en"}
            >
              <span aria-hidden="true">{locales[language].flag}</span> {locales[language].label}
            </Link>
          ))}
        </div>

        <details className="mobile-nav relative md:hidden">
          <summary className="focus-ring cursor-pointer list-none border-b border-ink/40 px-1 py-2 text-sm">{copy.menu}</summary>
          <nav aria-label={copy.mobileNavLabel} className="absolute right-0 top-12 z-30 w-56 border border-ink/10 bg-canvas p-5 shadow-[0_18px_50px_rgba(24,42,42,0.12)]">
            <ul className="space-y-4 text-base">
              {copy.nav.map(([label, href]) => (
                <li key={href}><Link className="block focus-ring" href={sectionHref(href)}>{label}</Link></li>
              ))}
            </ul>
            <div className="mt-5 border-t border-ink/10 pt-4">
              <div className="language-switcher inline-flex" aria-label={copy.languageSwitcherLabel}>
                {(Object.keys(locales) as Locale[]).map((language) => (
                  <Link
                    aria-current={language === locale ? "page" : undefined}
                    aria-label={locales[language].languageName}
                    className="language-option focus-ring"
                    href={languageHref(language, languageBasePath)}
                    key={language}
                    hrefLang={language === "cg" ? "cnr-Latn-ME" : "en"}
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
