import Link from "next/link";

const links = [
  ["Captains", "#captains"],
  ["Stories", "#stories"],
  ["Destinations", "#destinations"],
  ["About", "#trust"],
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10 bg-canvas">
      <div className="page-shell flex min-h-20 items-center justify-between gap-6 py-4">
        <Link className="font-serif text-[1.35rem] tracking-[-0.025em] text-ink focus-ring" href="#top">
          FishWithLocals
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-ink/78">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link className="nav-link focus-ring" href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <details className="mobile-nav relative md:hidden">
          <summary className="focus-ring cursor-pointer list-none border-b border-ink/40 px-1 py-2 text-sm">Menu</summary>
          <nav aria-label="Mobile" className="absolute right-0 top-12 z-30 w-56 border border-ink/10 bg-canvas p-5 shadow-[0_18px_50px_rgba(24,42,42,0.12)]">
            <ul className="space-y-4 text-base">
              {links.map(([label, href]) => (
                <li key={href}><Link className="block focus-ring" href={href}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
