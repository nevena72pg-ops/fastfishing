import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { seaLogCopy } from "@/content/sea-log";
import { locales, resolveLocale } from "@/content/i18n";

type SeaLogPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function SeaLogPage({ searchParams }: SeaLogPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const copy = seaLogCopy[locale];

  return (
    <>
      <a className="skip-link" href="#main-content">
        {locale === "cg" ? "Preskoči na sadržaj" : "Skip to content"}
      </a>
      <SiteHeader languageBasePath="/sea-log" locale={locale} />
      <main className="page-shell py-24 md:py-36" id="main-content" lang={locales[locale].htmlLang}>
        <section aria-labelledby="sea-log-page-heading" className="mx-auto max-w-3xl">
          <p className="eyebrow text-ink/50">{copy.eyebrow}</p>
          <h1 className="mt-5 font-serif text-[clamp(3.2rem,6vw,6rem)] leading-[0.96] tracking-[-0.055em]" id="sea-log-page-heading">
            {copy.heading}
          </h1>
          <p className="mt-8 text-lg leading-8 text-ink/72">{copy.body}</p>
          <p className="mt-5 text-base leading-7 text-ink/62">{copy.note}</p>
          <Link className="button-primary focus-ring mt-10 inline-flex" href={locale === "cg" ? "/?lang=cg#sea" : "/#sea"}>
            {copy.returnHome} <ArrowIcon className="size-5" />
          </Link>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
