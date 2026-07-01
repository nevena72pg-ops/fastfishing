import type { PhotoTone } from "@/content/home";

type PhotoPlaceholderProps = {
  label: string;
  tone: PhotoTone;
  className?: string;
  priority?: boolean;
};

export function PhotoPlaceholder({ label, tone, className = "", priority = false }: PhotoPlaceholderProps) {
  return (
    <div
      aria-label={label}
      className={
        "photo-placeholder photo-" + tone + " " + className
      }
      role="img"
    >
      <div className="photo-grain" />
      <div className="photo-horizon" />
      <p className="photo-label">
        <span>{priority ? "Hero photography" : "Photography"}</span>
        {label.replace(/^.*?—s*/, "")}
      </p>
    </div>
  );
}
