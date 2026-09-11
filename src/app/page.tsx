import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
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
  const citizenScience = locale === "cg"
    ? {
        eyebrow: "Građanska nauka · Dnevnik mora",
        heading: "More se mijenja. Pomozi nam da to primijetimo.",
        body: "Naši kapetani i gosti vide ono što se sa obale često ne vidi — nove vrste, otpad, napuštenu opremu i životinje u nevolji. Svako pouzdano opažanje može biti korisno.",
        cards: [
          {
            kicker: "Invazivna vrsta",
            title: "Riba lav",
            body: "Riba lav se sve češće bilježi u Jadranu. Fotografija, lokacija i datum opažanja mogu pomoći u praćenju njenog širenja.",
            warning: "Ne diraj bodlje golim rukama — otrov je u bodljama. Meso je jestivo; nakon bezbjednog uklanjanja bodlji i pravilnog čišćenja fileti se mogu pripremati na grilu, tiganju ili u rerni.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Lionfish_%28Pterois_volitans%29.jpg/1280px-Lionfish_%28Pterois_volitans%29.jpg",
            imageAlt: "Riba lav pod vodom, sa karakterističnim prugama i dugim bodljama.",
            credit: "Foto: Brian Gratwicke · CC BY 2.0",
            creditHref: "https://commons.wikimedia.org/wiki/File:Lionfish_(Pterois_volitans).jpg",
            action: null,
            href: null,
          },
          {
            kicker: "Oprez pri dodiru",
            title: "Vatreni crv",
            body: "Bradati vatreni crv prisutan je u Mediteranu i Jadranu. Fotografija i lokacija opažanja pomažu da pratimo gdje se pojavljuje.",
            warning: "Ne diraj ga. Bijele čekinje mogu lako ući u kožu i izazvati jak bol i iritaciju. Posmatraj, fotografiši i ostavi ga na miru.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Hermodice_carunculata_%28Bearded_Fireworm%29.jpg/960px-Hermodice_carunculata_%28Bearded_Fireworm%29.jpg",
            imageAlt: "Bradati vatreni crv na morskom dnu, sa prepoznatljivim bijelim čekinjama.",
            credit: "Foto: Nick Hobgood · CC BY-SA 3.0",
            creditHref: "https://commons.wikimedia.org/wiki/File:Hermodice_carunculata_(Bearded_Fireworm).jpg",
            action: null,
            href: null,
          },
          {
            kicker: "Tvoj podatak vrijedi",
            title: "Prijavi opažanje",
            body: "Fotografija, lokacija, datum i kratka napomena mogu pretvoriti običan izlazak na more u koristan podatak za građansku nauku.",
            warning: "Ako nisi siguran šta si vidio, ipak pošalji fotografiju. Opažanje možemo provjeriti prije nego što ga koristimo kao podatak.",
            image: null,
            imageAlt: null,
            credit: null,
            creditHref: null,
            action: "Prijavi opažanje",
            href: "/sea-log?lang=cg",
          },
        ],
      }
    : {
        eyebrow: "Citizen science · Sea Log",
        heading: "The sea is changing. Help us notice it.",
        body: "Our captains and guests see what is often invisible from shore — new species, marine litter, abandoned gear and wildlife in distress. Every reliable observation can be useful.",
        cards: [
          {
            kicker: "Invasive species",
            title: "Lionfish",
            body: "Lionfish are being recorded more often in the Adriatic. A photograph, location and date can help track their spread.",
            warning: "Do not handle the spines with bare hands — the venom is in the spines. The flesh is edible; once the spines are safely removed and the fish is properly cleaned, fillets can be grilled, pan-fried or baked.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Lionfish_%28Pterois_volitans%29.jpg/1280px-Lionfish_%28Pterois_volitans%29.jpg",
            imageAlt: "Lionfish underwater, showing its distinctive stripes and long spines.",
            credit: "Photo: Brian Gratwicke · CC BY 2.0",
            creditHref: "https://commons.wikimedia.org/wiki/File:Lionfish_(Pterois_volitans).jpg",
            action: null,
            href: null,
          },
          {
            kicker: "Handle with care",
            title: "Bearded fireworm",
            body: "The bearded fireworm occurs across the Mediterranean and Adriatic. A photograph and location can help us track where it is appearing.",
            warning: "Do not touch it. Its white bristles can penetrate skin and cause intense pain and irritation. Observe, photograph and leave it undisturbed.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Hermodice_carunculata_%28Bearded_Fireworm%29.jpg/960px-Hermodice_carunculata_%28Bearded_Fireworm%29.jpg",
            imageAlt: "Bearded fireworm on the seabed, showing its distinctive white bristles.",
            credit: "Photo: Nick Hobgood · CC BY-SA 3.0",
            creditHref: "https://commons.wikimedia.org/wiki/File:Hermodice_carunculata_(Bearded_Fireworm).jpg",
            action: null,
            href: null,
          },
          {
            kicker: "Your observation matters",
            title: "Report a sighting",
            body: "A photograph, location, date and short note can turn an ordinary day at sea into a useful citizen-science record.",
            warning: "Not sure what you saw? Send the photograph anyway. We can verify the observation before treating it as data.",
            image: null,
            imageAlt: null,
            credit: null,
            creditHref: null,
            action: "Report an observation",
            href: "/sea-log",
          },
        ],
      };

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
          </div>
        </section>

        <section aria-labelledby="citizen-science-heading" className="page-shell py-20 md:py-28" id="citizen-science">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="eyebrow">{citizenScience.eyebrow}</p>
              <h2 className="section-title mt-4" id="citizen-science-heading">{citizenScience.heading}</h2>
            </div>
            <p className="max-w-2xl self-end text-lg leading-8 text-ink/70">{citizenScience.body}</p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-3">
            {citizenScience.cards.map((card) => (
              <article className="flex min-h-full flex-col bg-canvas" key={card.title}>
                {card.image ? (
                  <div>
                    <div
                      aria-label={card.imageAlt ?? card.title}
                      className="aspect-[4/3] bg-cover bg-center"
                      role="img"
                      style={{ backgroundImage: `url(${card.image})` }}
                    />
                    {card.credit && card.creditHref ? (
                      <a
                        className="block px-7 pt-2 text-[0.66rem] leading-5 text-ink/42 underline-offset-2 hover:underline sm:px-8"
                        href={card.creditHref}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {card.credit}
                      </a>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <p className="eyebrow text-rust">{card.kicker}</p>
                  <h3 className="mt-5 font-serif text-3xl leading-tight tracking-tight">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-ink/68">{card.body}</p>
                  <div className="mt-6 border-l-2 border-rust/55 bg-rust/6 px-4 py-4">
                    <p className="text-sm leading-6 text-ink/76">{card.warning}</p>
                  </div>
                  {card.action && card.href ? (
                    <Link className="button-primary focus-ring mt-8 inline-flex self-start" href={card.href}>
                      {card.action} <ArrowIcon className="size-5" />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
