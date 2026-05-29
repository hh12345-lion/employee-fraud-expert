import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Retired routes - permanent redirects preserve SEO equity */
const RETIRED_PATH_REDIRECTS: Record<string, string> = {
  "/faq": "/guides",
  "/fees": "/contact",
  "/experts": "/qualifications",
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const apexHost = "employeefraudexpert.com";

  if (host === apexHost) {
    const url = request.nextUrl.clone();
    url.host = `www.${apexHost}`;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  const pathname = request.nextUrl.pathname;
  const redirectTo = RETIRED_PATH_REDIRECTS[pathname];
  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
