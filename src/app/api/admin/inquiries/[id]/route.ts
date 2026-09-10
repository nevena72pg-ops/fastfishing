import { NextResponse } from "next/server";

const allowedStatuses = new Set(["forwarded", "closed"]);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return new NextResponse("Supabase nije konfigurisan.", { status: 503 });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const status = String(formData.get("status") || "");

  if (!allowedStatuses.has(status)) {
    return new NextResponse("Nevažeći status.", { status: 400 });
  }

  const payload: Record<string, string> = { status };
  const now = new Date().toISOString();

  if (status === "forwarded") {
    payload.forwarded_at = now;
  }

  if (status === "closed") {
    payload.closed_at = now;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/inquiries?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    return new NextResponse("Status upita nije ažuriran.", { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
