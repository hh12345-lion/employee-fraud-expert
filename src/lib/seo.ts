/**
 * Public site hostname for n8n routing (no protocol, path, or www).
 * Source: NEXT_PUBLIC_SITE_URL
 */
export function getSiteDomain(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.employeefraudexpert.com";

  try {
    return new URL(raw).hostname.replace(/^www\./i, "");
  } catch {
    return "employeefraudexpert.com";
  }
}
