import { InquiryForm } from "@/components/inquiry-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { locales, resolveLocale } from "@/content/i18n";

type InquiryPageProps = {
  searchParams?: Promise<{
    captain?: string | string[];
    lang?: string | string[];
  }>;
};

export default async function InquiryPage({ searchParams }: InquiryPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const captainParam = Array.isArray(params?.captain) ? params?.captain[0] : params?.captain;
  const captain = captainParam || (locale === "cg" ? "Izabrani kapetan" : "Selected captain");
  const skipLabel = locale === "cg" ? "Preskoči na sadržaj" : "Skip to content";

  return (
    <>
      <a className="skip-link" href="#main-content">{skipLabel}</a>
      <SiteHeader
        languageBasePath="/inquiry"
        languageParams={captainParam ? { captain: captainParam } : {}}
        locale={locale}
      />
      <main className="page-shell py-16 md:py-24" id="main-content" lang={locales[locale].htmlLang}>
        <InquiryForm captain={captain} locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
