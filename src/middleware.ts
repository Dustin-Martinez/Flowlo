import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("flowlo_session")?.value;

  // Protect dashboard: require session cookie
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      const home = new URL("/", request.url);
      return NextResponse.redirect(home);
    }
  }

  // If logged in and visiting home, redirect to dashboard
  if (pathname === "/" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
