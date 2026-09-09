import Link from "next/link";
import type { Captain, Destination, Story } from "@/content/home";
import { localise, type Locale } from "@/content/i18n";
import { ArrowIcon, VerifiedIcon } from "@/components/icons";
import { PhotoPlaceholder } from "@/components/photo-placeholder";

type CaptainCardProps = {
  actionLabel: string;
  captain: Captain;
  locale: Locale;
  verifiedLabel: string;
};

export function CaptainCard({ actionLabel, captain, locale, verifiedLabel }: CaptainCardProps) {
  return (
    <article className="group border-t border-ink/18 pt-4">
      <PhotoPlaceholder className="aspect-[4/5] min-h-80" label={localise(captain.imageLabel, locale)} tone={captain.tone} />
      <div className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{localise(captain.location, locale)}</p>
            <h3 className="mt-2 font-serif text-3xl tracking-tight text-ink">{captain.name}</h3>
          </div>
          <span className="mt-1 inline-flex items-center gap-1.5 whitespace-nowrap text-[0.68rem] uppercase tracking-[0.12em] text-ink/60">
            <VerifiedIcon className="size-4" /> {verifiedLabel}
          </span>
        </div>
        <p className="mt-4 text-[0.97rem] leading-7 text-ink/76">{localise(captain.introduction, locale)}</p>
        <p className="mt-4 text-xs tracking-wide text-ink/55">{localise(captain.languages, locale)}</p>
        <Link className="text-link focus-ring mt-6 inline-flex items-center gap-2" href="#final-invitation">
          {actionLabel} <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

type StoryCardProps = {
  actionLabel: string;
  featured?: boolean;
  locale: Locale;
  story: Story;
};

export function StoryCard({ actionLabel, story, featured = false, locale }: StoryCardProps) {
  return (
    <article className={featured ? "group md:grid md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-8" : "group"}>
      <PhotoPlaceholder className={featured ? "aspect-[16/11] min-h-72" : "aspect-[4/3] min-h-56"} label={localise(story.imageLabel, locale)} tone={story.tone} />
      <div className={featured ? "pt-5 md:pb-2 md:pt-0" : "pt-5"}>
        <h3 className={featured ? "font-serif text-4xl leading-tight tracking-tight md:text-5xl" : "font-serif text-3xl leading-tight tracking-tight"}>{localise(story.title, locale)}</h3>
        <p className="mt-4 max-w-xl leading-7 text-ink/72">{localise(story.excerpt, locale)}</p>
        <Link className="text-link focus-ring mt-5 inline-flex items-center gap-2" href="#stories">
          {actionLabel} <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

type DestinationCardProps = {
  actionLabel: string;
  destination: Destination;
  locale: Locale;
};

export function DestinationCard({ actionLabel, destination, locale }: DestinationCardProps) {
  const name = localise(destination.name, locale);

  return (
    <article className="group">
      <PhotoPlaceholder className="aspect-[3/2] min-h-56 sm:min-h-72" label={localise(destination.imageLabel, locale)} tone={destination.tone} />
      <div className="grid gap-5 border-b border-ink/18 py-6 sm:grid-cols-[1fr_2fr]">
        <h3 className="font-serif text-4xl tracking-tight">{name}</h3>
        <div>
          <p className="leading-7 text-ink/72">{localise(destination.description, locale)}</p>
          <Link className="text-link focus-ring mt-5 inline-flex items-center gap-2" href={"#" + destination.slug}>
            {actionLabel} {name} <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
