export type PilotInquiryStatus = "received" | "forwarded" | "accepted" | "taken_over" | "unavailable" | "closed";

export type PilotInquiry = {
  status: PilotInquiryStatus;
  created_at: string;
  preferred_date: string;
  guest_name: string;
  preferred_time: string;
  party_size: number;
};

const HOUR_MS = 60 * 60 * 1000;

/** Operational triage only: no automatic acceptance or guest messaging. */
export function inquiryPriority(inquiry: PilotInquiry, now: Date = new Date()) {
  if (inquiry.status !== "received" && inquiry.status !== "forwarded") return "handled" as const;
  const createdAtMs = new Date(inquiry.created_at).getTime();
  const ageHours = Number.isFinite(createdAtMs)
    ? Math.max(0, (now.getTime() - createdAtMs) / HOUR_MS)
    : 0;
  if (ageHours >= 24) return "overdue" as const;
  if (ageHours >= 6) return "attention" as const;
  return "new" as const;
}

export function inquirySummary<T extends PilotInquiry>(items: T[], now: Date = new Date()) {
  const counts = { awaiting: 0, overdue: 0, attention: 0, takenOver: 0, unavailable: 0, closed: 0 };
  for (const item of items) {
    const priority = inquiryPriority(item, now);
    if (priority !== "handled") {
      counts.awaiting += 1;
      if (priority === "overdue") counts.overdue += 1;
      if (priority === "attention") counts.attention += 1;
    }
    if (item.status === "accepted" || item.status === "taken_over") counts.takenOver += 1;
    if (item.status === "unavailable") counts.unavailable += 1;
    if (item.status === "closed") counts.closed += 1;
  }
  return counts;
}

export function sortInquiries<T extends PilotInquiry>(items: T[], now: Date = new Date()): T[] {
  const weight = { overdue: 0, attention: 1, new: 2, handled: 3 };
  return [...items].sort((a, b) => {
    const diff = weight[inquiryPriority(a, now)] - weight[inquiryPriority(b, now)];
    return diff || Date.parse(a.created_at) - Date.parse(b.created_at);
  });
}

export function suggestedReply(inquiry: PilotInquiry, captainName: string) {
  const guestFirstName = inquiry.guest_name.trim().split(/\s+/)[0] || "goste";
  const preferredDate = inquiry.preferred_date.split("-").reverse().join(".");
  const preferredTime = inquiry.preferred_time.slice(0, 5);
  return `Zdravo, ${guestFirstName}! Hvala na interesovanju za izlazak na more ${preferredDate} u ${preferredTime}, za ${inquiry.party_size} osoba. Provjeriću dostupnost i javiti vam detalje. Pozdrav, ${captainName} — FishWithLocals.`;
}
