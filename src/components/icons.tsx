type IconProps = { className?: string };

export function ArrowIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function VerifiedIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path d="M10 2.75 12 4l2.35-.1.7 2.25L17 7.5l-.8 2.2.8 2.2-1.95 1.35-.7 2.25-2.35-.1-2 1.25-2-1.25-2.35.1-.7-2.25L3 11.9l.8-2.2L3 7.5l1.95-1.35.7-2.25L8 4l2-1.25Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
      <path d="m7.2 9.9 1.75 1.75 3.85-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
    </svg>
  );
}
