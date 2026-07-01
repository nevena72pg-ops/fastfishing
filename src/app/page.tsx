import Link from "next/link";
import { ArrowIcon, VerifiedIcon } from "@/components/icons";
import { CaptainCard, DestinationCard, StoryCard } from "@/components/home-cards";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { captains, destinations, seaPractices, stories } from "@/content/home";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div id="top" />
      <SiteHeader />

      <main id="main-content">
        <section aria-labelledby="hero-heading" className="page-shell grid gap-10 pb-20 pt-10 sm:pt-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-16">
          <div className="max-w-2xl lg:py-12">
            <p className="eyebrow">Bar &amp; Budva · Montenegro</p>
            <h1 id="hero-heading" className="mt-5 max-w-[12ch] font-serif text-[clamp(3.4rem,7vw,7rem)] leading-[0.93] tracking-[-0.055em] text-ink">
              Choose the person who knows the sea.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink/72 sm:text-xl sm:leading-9">
              Meet local captains we know personally. Learn how they fish, teach, cook and care for these waters—then speak with them directly.
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link className="button-primary focus-ring w-full sm:w-auto" href="#captains">
                Meet the Captains <ArrowIcon className="size-5" />
              </Link>
              <Link className="button-secondary focus-ring w-full sm:w-auto" href="#bar">Explore Bar</Link>
              <Link className="button-secondary focus-ring w-full sm:w-auto" href="#budva">Explore Budva</Link>
            </div>
          </div>

          <div className="relative lg:pl-5">
            <PhotoPlaceholder className="aspect-[4/5] sm:aspect-[5/6] sm:min-h-[31rem] lg:min-h-[43rem]" label="Hero placeholder — a captain preparing gear beside a small boat in early natural light" priority tone="sea" />
            <p className="mt-3 max-w-md text-xs leading-5 text-ink/52">Temporary photography slot. The final image will come from a real morning with a verified captain.</p>
          </div>
        </section>

        <section aria-labelledby="trust-heading" className="bg-wash py-20 md:py-28" id="trust">
          <div className="page-shell">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <div>
                <p className="eyebrow">Trust before conversation</p>
                <h2 id="trust-heading" className="section-title mt-4">Known personally.<br />Represented honestly.</h2>
              </div>
              <p className="max-w-2xl self-end text-lg leading-8 text-ink/70">
                A photograph of a boat tells very little about the person at the helm. We meet every captain, check what matters and write each profile from a real conversation.
              </p>
            </div>

            <ol className="mt-14 grid border-y border-ink/15 md:grid-cols-3 md:divide-x md:divide-ink/15">
              {[
                ["01", "We meet", "Time in the marina, on the boat and in conversation comes before publication."],
                ["02", "We verify", "Identity, vessel, safety, experience and public claims are checked and reviewed."],
                ["03", "You speak directly", "FishWithLocals makes the introduction. Captain and guest decide together what feels right."],
              ].map(([number, title, text]) => (
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
              <p className="eyebrow">The people at the helm</p>
              <h2 className="section-title mt-4" id="captains-heading">Meet the captains</h2>
            </div>
            <div className="max-w-xl">
              <p className="text-lg leading-8 text-ink/70">Choose a person whose temperament, knowledge and way of sharing the sea feel right for you.</p>
              <p className="mt-3 text-sm leading-6 text-ink/50">Prototype profiles: names, words and photographs will be replaced after real conversations and verification.</p>
            </div>
          </div>
          <div className="mt-14 grid gap-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {captains.map((captain) => <CaptainCard captain={captain} key={captain.name} />)}
          </div>
        </section>

        <section aria-labelledby="stories-heading" className="bg-sand py-20 md:py-28" id="stories">
          <div className="page-shell">
            <div className="section-intro">
              <div>
                <p className="eyebrow">Things worth remembering</p>
                <h2 className="section-title mt-4" id="stories-heading">Stories from the water</h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-ink/70">Not every story needs a large catch. Sometimes the moment that stays is a lesson, a change in weather, or the silence after something passes beneath the boat.</p>
            </div>
            <div className="mt-14">
              <StoryCard featured story={stories[0]} />
              <div className="mt-16 grid gap-14 border-t border-ink/15 pt-10 md:grid-cols-2 md:gap-8">
                {stories.slice(1).map((story) => <StoryCard key={story.title} story={story} />)}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="destinations-heading" className="page-shell py-20 md:py-28" id="destinations">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Two places, their own rhythms</p>
              <h2 className="section-title mt-4" id="destinations-heading">Bar and Budva</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-ink/70">Destinations are more than departure points. They hold working mornings, local food, remembered weather and people who have learnt these waters over time.</p>
          </div>
          <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-8">
            {destinations.map((destination) => (
              <div id={destination.name.toLowerCase()} key={destination.name}>
                <DestinationCard destination={destination} />
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="sea-heading" className="bg-ink py-20 text-canvas md:py-28" id="sea">
          <div className="page-shell">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="eyebrow text-canvas/55">Respect in ordinary actions</p>
                <h2 className="section-title mt-4 text-canvas" id="sea-heading">The sea is not a backdrop.</h2>
              </div>
              <p className="max-w-2xl self-end text-lg leading-8 text-canvas/68">Responsible fishing is not a badge. It appears in what a captain keeps, what they release, what they bring back to shore and how much room they leave for others.</p>
            </div>
            <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-6">
              {seaPractices.map((practice) => (
                <figure key={practice.title}>
                  <PhotoPlaceholder className="aspect-[4/3] min-h-40 md:min-h-0 lg:min-h-56 border-canvas/10" label={practice.imageLabel} tone={practice.tone} />
                  <figcaption className="pt-5">
                    <h3 className="font-serif text-2xl">{practice.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-canvas/62">{practice.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="invitation-heading" className="page-shell py-24 text-center md:py-36" id="final-invitation">
          <VerifiedIcon className="mx-auto size-8 text-rust" />
          <p className="eyebrow mt-6">A conversation, not a checkout</p>
          <h2 className="mx-auto mt-5 max-w-[14ch] font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[1.02] tracking-[-0.045em]" id="invitation-heading">
            Find the person you would like to spend a day with.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-ink/68">Take your time. Read their stories. When someone feels right, start a direct conversation about the day.</p>
          <Link className="button-primary focus-ring mt-9 inline-flex" href="#captains">
            Meet the Captains <ArrowIcon className="size-5" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
