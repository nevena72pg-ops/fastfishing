import { NextResponse } from "next/server";

// The legacy admin page is intentionally disabled.
// Its former write endpoint had no authentication and must never accept status changes.
// Captain-managed status updates use authenticated server actions in /captain.
export async function POST() {
  return NextResponse.json(
    { error: "This legacy admin endpoint has been retired." },
    { status: 410 },
  );
}
