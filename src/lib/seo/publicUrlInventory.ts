import { caseTypeSlugs } from "@/data/case-types";
import { guideSlugs } from "@/data/guides";
import { serviceSlugs } from "@/data/services";

import { SITE_URL } from "@/lib/site";

/**
 * Canonical host for sitemap, robots.txt, and schema @id values.
 * Must match production www → apex redirect.
 */
export const CANONICAL_HOST = SITE_URL;

/**
 * Indexable static marketing routes.
 * Add new first-class pages here, then run: npm run seo:generate
 */
export const APP_STATIC_PATHS = [
  "/",
  "/services",
  "/fraud-types",
  "/what-is-employee-fraud",
  "/who-we-help",
  "/who-we-help/employers-hr",
  "/who-we-help/solicitors-law-firms",
  "/investigation-process",
  "/case-types",
  "/qualifications",
  "/how-to-instruct",
  "/guides",
  "/glossary",
  "/cookies",
] as const;

/**
 * Routes that exist in the app but must NOT appear in sitemap.xml.
 * /contact is indexable (metadata) but excluded from sitemap per SEO-ARCHITECTURE.md.
 * /thank-you, /privacy, /terms use noindex in page metadata.
 */
export const SITEMAP_EXCLUDED_PATHS = [
  "/contact",
  "/thank-you",
  "/privacy",
  "/terms",
] as const;

/**
 * Paths blocked in robots.txt (may overlap with sitemap exclusions).
 */
export const ROBOTS_DISALLOW_PATHS = [
  "/thank-you",
  "/privacy",
  "/terms",
  "/api/",
  "/_next/",
] as const;

export interface PublicUrlInventory {
  allPaths: string[];
  allUrls: string[];
  counts: {
    static: number;
    caseTypes: number;
    guides: number;
    services: number;
    total: number;
  };
}

export function buildPublicUrlInventory(): PublicUrlInventory {
  const caseTypePaths = caseTypeSlugs.map((slug) => `/case-types/${slug}`);
  const guidePaths = guideSlugs.map((slug) => `/guides/${slug}`);
  const servicePaths = serviceSlugs.map((slug) => `/services/${slug}`);

  const staticPaths = [...APP_STATIC_PATHS];
  const dynamicPaths = [...caseTypePaths, ...guidePaths, ...servicePaths];

  const excluded = new Set<string>(SITEMAP_EXCLUDED_PATHS);
  const allPaths = [...new Set([...staticPaths, ...dynamicPaths])]
    .filter((path) => !excluded.has(path))
    .sort((a, b) => a.localeCompare(b));

  return {
    allPaths,
    allUrls: allPaths.map((path) => toAbsoluteUrl(path)),
    counts: {
      static: staticPaths.length,
      caseTypes: caseTypePaths.length,
      guides: guidePaths.length,
      services: servicePaths.length,
      total: allPaths.length,
    },
  };
}

export function toAbsoluteUrl(path: string): string {
  if (path === "/") return `${CANONICAL_HOST}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${CANONICAL_HOST}${normalized}`;
}

/** Priorities per docs/SEO-ARCHITECTURE.md Appendix B */
export function getSitemapChangefreq(path: string): string {
  if (path === "/") return "weekly";
  return "monthly";
}

export function getSitemapPriority(path: string): number {
  if (path === "/") return 1.0;
  if (path === "/services" || path === "/fraud-types") return 0.95;
  if (path === "/investigation-process" || path === "/who-we-help") return 0.93;
  if (
    path === "/who-we-help/employers-hr" ||
    path === "/who-we-help/solicitors-law-firms"
  )
    return 0.92;
  if (path === "/case-types") return 0.92;
  if (path === "/what-is-employee-fraud") return 0.9;
  if (path.startsWith("/services/")) return 0.9;
  if (path === "/qualifications" || path === "/how-to-instruct") return 0.88;
  if (path.startsWith("/case-types/")) return 0.88;
  if (path === "/guides") return 0.87;
  if (path.startsWith("/guides/")) return 0.8;
  if (path === "/glossary" || path === "/cookies") return 0.75;
  return 0.7;
}
