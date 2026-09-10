import { NextRequest, NextResponse } from "next/server";

function unauthorized(message = "Authentication required") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="FishWithLocals Admin", charset="UTF-8"',
    },
  });
}

export function proxy(request: NextRequest) {
  const adminUser = process.env.FWL_ADMIN_USER;
  const adminPassword = process.env.FWL_ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return new NextResponse("FishWithLocals admin access is not configured.", { status: 503 });
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    const user = separator >= 0 ? decoded.slice(0, separator) : "";
    const password = separator >= 0 ? decoded.slice(separator + 1) : "";

    if (user !== adminUser || password !== adminPassword) {
      return unauthorized("Invalid credentials");
    }
  } catch {
    return unauthorized("Invalid credentials");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
