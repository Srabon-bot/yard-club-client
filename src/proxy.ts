import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fast, optimistic check only. requireRole() in lib/api.server.ts remains the
// authoritative session and RBAC guard for every dashboard page and action.
const SESSION_COOKIES = ["better-auth.session_token", "better-auth.session_data"];

export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some(
    (name) => Boolean(request.cookies.get(name)?.value),
  );
  if (hasSession) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Only the private dashboard areas; API, _next/static, _next/image and other
  // assets never begin with these paths, so they are not matched.
  matcher: ["/dashboard/:path*", "/owner/:path*", "/admin/:path*"],
};
