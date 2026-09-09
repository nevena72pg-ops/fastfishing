import Image from "next/image";
import type { PhotoTone } from "@/content/home";

type PhotoImage = {
  alt: string;
  objectPosition?: string;
  src: string;
};

type PhotoPlaceholderProps = {
  label: string;
  tone: PhotoTone;
  className?: string;
  image?: PhotoImage;
  priority?: boolean;
  sizes?: string;
};

function displayLabel(label: string) {
  return label.split("—").pop()?.trim() ?? label;
}

export function PhotoPlaceholder({
  label,
  tone,
  className = "",
  image,
  priority = false,
  sizes = "100vw",
}: PhotoPlaceholderProps) {
  if (image) {
    return (
      <div className={"photo-placeholder photo-real " + className}>
        <Image
          alt={image.alt}
          className="object-cover"
          fill
          priority={priority}
          sizes={sizes}
          src={image.src}
          style={{ objectPosition: image.objectPosition ?? "50% 50%" }}
        />
      </div>
    );
  }

  return (
    <div
      aria-label={label}
      className={"photo-placeholder photo-" + tone + " " + className}
      role="img"
    >
      <div className="photo-grain" />
      <div className="photo-horizon" />
      <p className="photo-label">
        <span>{priority ? "Hero photography" : "Photography"}</span>
        {displayLabel(label)}
      </p>
    </div>
  );
}
