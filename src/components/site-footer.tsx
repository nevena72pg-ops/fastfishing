import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-canvas/15 bg-ink text-canvas">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end md:py-16">
        <div>
          <p className="font-serif text-2xl">FishWithLocals</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-canvas/65">Introductions to local captains who know their waters, their limits and the value of a quiet day at sea.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-3 text-sm text-canvas/78 sm:grid-cols-2 sm:gap-x-8 md:text-right">
            <li><Link className="footer-link focus-ring" href="/docs/Manifest.md">Manifest</Link></li>
            <li><Link className="footer-link focus-ring" href="#trust">How We Verify Captains</Link></li>
            <li><Link className="footer-link focus-ring" href="/docs/Editorial_Style_Guide.md">Editorial Principles</Link></li>
            <li><Link className="footer-link focus-ring" href="mailto:hello@fishwithlocals.com">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
