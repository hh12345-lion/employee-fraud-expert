import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Retired routes - permanent redirects preserve SEO equity */
const RETIRED_PATH_REDIRECTS: Record<string, string> = {
  "/faq": "/guides",
  "/fees": "/contact",
  "/experts": "/qualifications",
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const redirectTo = RETIRED_PATH_REDIRECTS[pathname];
  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip static SEO files and assets so /robots.txt and /sitemap.xml
     * are never delayed or blocked by Edge middleware.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
