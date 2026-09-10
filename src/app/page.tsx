import Link from "next/link";
import { ArrowIcon, VerifiedIcon } from "@/components/icons";
import { CaptainCard, DestinationCard, StoryCard } from "@/components/home-cards";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { captains, destinations, getHomeCopy, seaPractices, stories } from "@/content/home";
import { locales, localise, resolveLocale } from "@/content/i18n";

type HomePageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const copy = getHomeCopy(locale);
  const htmlLang = locales[locale].htmlLang;

  return (
    <>
      <a className="skip-link" href="#main-content">{copy.skipLink}</a>
      <div id="top" />
      <SiteHeader locale={locale} />

      <main id="main-content" lang={htmlLang}>
        <section aria-labelledby="hero-heading" className="page-shell grid gap-10 pb-20 pt-10 sm:pt-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-16">
          <div className="max-w-2xl lg:py-12">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1 id="hero-heading" className="mt-5 max-w-[12ch] font-serif text-[clamp(3.4rem,7vw,7rem)] leading-[0.93] tracking-[-0.055em] text-ink">
              {copy.hero.heading}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink/72 sm:text-xl sm:leading-9">
              {copy.hero.body}
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link className="button-primary focus-ring w-full sm:w-auto" href="#captains">
                {copy.hero.primaryAction} <ArrowIcon className="size-5" />
              </Link>
              <Link className="button-secondary focus-ring w-full sm:w-auto" href="#bar">{copy.hero.barAction}</Link>
              <Link className="button-secondary focus-ring w-full sm:w-auto" href="#budva">{copy.hero.budvaAction}</Link>
            </div>
          </div>

          <div className="relative lg:pl-5">
            <PhotoPlaceholder
              className="aspect-[4/5] sm:aspect-[5/6] sm:min-h-[31rem] lg:min-h-[43rem]"
              image={copy.hero.image}
              label={copy.hero.imageLabel}
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              tone="sea"
            />
          </div>
        </section>

        <section aria-labelledby="trust-heading" className="bg-wash py-20 md:py-28" id="trust">
          <div className="page-shell">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <div>
                <p className="eyebrow">{copy.trust.eyebrow}</p>
                <h2 id="trust-heading" className="section-title mt-4">
                  {copy.trust.heading.split("\n").map((line) => (
                    <span key={line}>{line}<br /></span>
                  ))}
                </h2>
              </div>
              <p className="max-w-2xl self-end text-lg leading-8 text-ink/70">
                {copy.trust.body}
              </p>
            </div>

            <ol className="mt-14 grid border-y border-ink/15 md:grid-cols-3 md:divide-x md:divide-ink/15">
              {copy.trust.steps.map(([number, title, text]) => (
                <li className="py-7 md:px-8 md:py-9 first:md:pl-0 last:md:pr-0" key={number}>
                  <span className="text-xs tracking-[0.16em] text-ink/42">{number}</span>
                  <h3 className="mt-4 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 leading-7 text-ink/65">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="captains-heading" className="page-shell py-20 md:py-28" id="captains">
          <div className="section-intro">
            <div>
              <p className="eyebrow">{copy.captains.eyebrow}</p>
              <h2 className="section-title mt-4" id="captains-heading">{copy.captains.heading}</h2>
            </div>
            <div className="max-w-xl">
              <p className="text-lg leading-8 text-ink/70">{copy.captains.body}</p>
              <p className="mt-3 text-sm leading-6 text-ink/50">{copy.captains.note}</p>
            </div>
          </div>
          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-8">
            {captains.map((captain) => (
              <CaptainCard
                actionLabel={copy.captains.action}
                captain={captain}
                key={localise(captain.name, locale)}
                locale={locale}
                verifiedLabel={copy.captains.verified}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="stories-heading" className="bg-sand py-20 md:py-28" id="stories">
          <div className="page-shell">
            <div className="section-intro">
              <div>
                <p className="eyebrow">{copy.stories.eyebrow}</p>
                <h2 className="section-title mt-4" id="stories-heading">{copy.stories.heading}</h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-ink/70">{copy.stories.body}</p>
            </div>
            <div className="mt-14">
              <StoryCard actionLabel={copy.stories.action} featured locale={locale} story={stories[0]} />
              <div className="mt-16 grid gap-14 border-t border-ink/15 pt-10 md:grid-cols-2 md:gap-8">
                {stories.slice(1).map((story) => (
                  <StoryCard actionLabel={copy.stories.action} key={localise(story.title, locale)} locale={locale} story={story} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="destinations-heading" className="page-shell py-20 md:py-28" id="destinations">
          <div className="section-intro">
            <div>
              <p className="eyebrow">{copy.destinations.eyebrow}</p>
              <h2 className="section-title mt-4" id="destinations-heading">{copy.destinations.heading}</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-ink/70">{copy.destinations.body}</p>
          </div>
          <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-8">
            {destinations.map((destination) => (
              <div id={destination.slug} key={destination.slug}>
                <DestinationCard actionLabel={copy.destinations.action} destination={destination} locale={locale} />
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="sea-heading" className="bg-ink py-20 text-canvas md:py-28" id="sea">
          <div className="page-shell">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="eyebrow text-canvas/55">{copy.sea.eyebrow}</p>
                <h2 className="section-title mt-4 text-canvas" id="sea-heading">{copy.sea.heading}</h2>
              </div>
              <p className="max-w-2xl self-end text-lg leading-8 text-canvas/68">{copy.sea.body}</p>
            </div>
            <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-6">
              {seaPractices.map((practice) => (
                <figure key={localise(practice.title, locale)}>
                  <PhotoPlaceholder
                    className="aspect-[4/3] min-h-40 border-canvas/10 md:min-h-0 lg:min-h-56"
                    image={{
                      alt: localise(practice.image.alt, locale),
                      objectPosition: practice.image.objectPosition,
                      src: practice.image.src,
                    }}
                    label={localise(practice.imageLabel, locale)}
                    sizes="(min-width: 768px) 30vw, 100vw"
                    tone={practice.tone}
                  />
                  <figcaption className="pt-5">
                    <h3 className="font-serif text-2xl">{localise(practice.title, locale)}</h3>
                    <p className="mt-3 text-sm leading-6 text-canvas/62">{localise(practice.text, locale)}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <aside className="mt-16 grid gap-7 border border-canvas/15 bg-canvas/6 p-6 sm:p-8 lg:grid-cols-[0.45fr_1fr_auto] lg:items-end lg:gap-10" aria-labelledby="sea-log-heading">
              <p className="eyebrow text-canvas/55">{copy.seaLog.title}</p>
              <div>
                <h3 className="font-serif text-3xl leading-tight tracking-tight text-canvas" id="sea-log-heading">{copy.seaLog.heading}</h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-canvas/68">{copy.seaLog.body}</p>
              </div>
              <Link className="button-sea-log focus-ring inline-flex justify-center" href={copy.seaLog.href}>
                {copy.seaLog.action} <ArrowIcon className="size-5" />
              </Link>
            </aside>
          </div>
        </section>

        <section aria-labelledby="invitation-heading" className="page-shell py-24 text-center md:py-36" id="final-invitation">
          <VerifiedIcon className="mx-auto size-8 text-rust" />
          <p className="eyebrow mt-6">{copy.invitation.eyebrow}</p>
          <h2 className="mx-auto mt-5 max-w-[14ch] font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[1.02] tracking-[-0.045em]" id="invitation-heading">
            {copy.invitation.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-ink/68">{copy.invitation.body}</p>
          <Link className="button-primary focus-ring mt-9 inline-flex" href="#captains">
            {copy.invitation.action} <ArrowIcon className="size-5" />
          </Link>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
