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

export function CaptainCard({ captain, locale, verifiedLabel }: CaptainCardProps) {
  const name = localise(captain.name, locale);
  const isFuturePlaceholder = name === "Captain #3" || name === "Kapetan #3";
  const inquiryLabel = locale === "cg" ? "Pošalji upit kapetanu" : "Send an inquiry to the captain";
  const inquiryHref = `/inquiry?captain=${encodeURIComponent(name)}${locale === "cg" ? "&lang=cg" : ""}`;

  if (isFuturePlaceholder) {
    return null;
  }

  if (!captain.image || !captain.introduction) {
    return (
      <article className="group border-t border-ink/18 pt-4">
        <div className="flex aspect-[4/5] min-h-80 items-center justify-center border border-ink/12 bg-wash/45 px-8 text-center">
          <h3 className="max-w-[13ch] font-serif text-4xl leading-tight tracking-tight text-ink/78">{name}</h3>
        </div>
        <div className="pt-5">
          <Link className="text-link focus-ring inline-flex items-center gap-2" href={inquiryHref}>
            {inquiryLabel} <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group border-t border-ink/18 pt-4">
      <PhotoPlaceholder
        className="aspect-[4/5] min-h-80"
        image={{
          alt: localise(captain.image.alt, locale),
          objectPosition: captain.image.objectPosition,
          src: captain.image.src,
        }}
        label={localise(captain.imageLabel, locale)}
        sizes="(min-width: 768px) 45vw, 100vw"
        tone={captain.tone}
      />
      <div className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            {captain.location ? <p className="eyebrow">{localise(captain.location, locale)}</p> : null}
            <h3 className="mt-2 font-serif text-3xl tracking-tight text-ink">{name}</h3>
          </div>
          <span className="mt-1 inline-flex items-center gap-1.5 whitespace-nowrap text-[0.68rem] uppercase tracking-[0.12em] text-ink/60">
            <VerifiedIcon className="size-4" /> {verifiedLabel}
          </span>
        </div>
        <p className="mt-4 text-[0.97rem] leading-7 text-ink/76">{localise(captain.introduction, locale)}</p>
        {captain.languages ? <p className="mt-4 text-xs tracking-wide text-ink/55">{localise(captain.languages, locale)}</p> : null}
        <Link className="text-link focus-ring mt-6 inline-flex items-center gap-2" href={inquiryHref}>
          {inquiryLabel} <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
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

export function StoryCard({ story, featured = false, locale }: StoryCardProps) {
  return (
    <article className={featured ? "group md:grid md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-8" : "group"}>
      <PhotoPlaceholder
        className={featured ? "aspect-[16/11] min-h-72" : "aspect-[4/3] min-h-56"}
        image={{
          alt: localise(story.image.alt, locale),
          objectPosition: story.image.objectPosition,
          src: story.image.src,
        }}
        label={localise(story.imageLabel, locale)}
        sizes={featured ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 45vw, 100vw"}
        tone={story.tone}
      />
      <div className={featured ? "pt-5 md:pb-2 md:pt-0" : "pt-5"}>
        <h3 className={featured ? "font-serif text-4xl leading-tight tracking-tight md:text-5xl" : "font-serif text-3xl leading-tight tracking-tight"}>{localise(story.title, locale)}</h3>
        <p className="mt-4 max-w-xl leading-7 text-ink/72">{localise(story.excerpt, locale)}</p>
      </div>
    </article>
  );
}

type DestinationCardProps = {
  actionLabel: string;
  destination: Destination;
  locale: Locale;
};

export function DestinationCard({ destination, locale }: DestinationCardProps) {
  const name = localise(destination.name, locale);

  return (
    <article className="group">
      <PhotoPlaceholder
        className="aspect-[3/2] min-h-56 sm:min-h-72"
        image={destination.image ? {
          alt: localise(destination.image.alt, locale),
          objectPosition: destination.image.objectPosition,
          src: destination.image.src,
        } : undefined}
        label={localise(destination.imageLabel, locale)}
        sizes="(min-width: 1024px) 45vw, 100vw"
        tone={destination.tone}
      />
      <div className="grid gap-5 border-b border-ink/18 py-6 sm:grid-cols-[1fr_2fr]">
        <h3 className="font-serif text-4xl tracking-tight">{name}</h3>
        <div>
          <p className="leading-7 text-ink/72">{localise(destination.description, locale)}</p>
        </div>
      </div>
    </article>
  );
}
