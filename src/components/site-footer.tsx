import Link from "next/link";
import { homeCopy } from "@/content/home";
import type { Locale } from "@/content/i18n";

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = homeCopy[locale].footer;
  const publicLinks = copy.links
    .filter(([, href]) => !href.startsWith("/docs/") && !href.startsWith("mailto:"))
    .map(([label, href]) => {
      if (!href.startsWith("#")) {
        return [label, href] as const;
      }

      return [label, locale === "cg" ? `/?lang=cg${href}` : `/${href}`] as const;
    });

  return (
    <footer className="border-t border-canvas/15 bg-ink text-canvas">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end md:py-16">
        <div>
          <p className="font-serif text-2xl">FishWithLocals</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-canvas/65">{copy.description}</p>
        </div>
        <nav aria-label={copy.navLabel}>
          <ul className="grid gap-3 text-sm text-canvas/78 sm:grid-cols-2 sm:gap-x-8 md:text-right">
            {publicLinks.map(([label, href]) => (
              <li key={href}><Link className="footer-link focus-ring" href={href}>{label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
