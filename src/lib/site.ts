function resolveSiteUrl(): string {
  const fallback = "https://employeefraudexpert.com";
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!raw) return fallback;
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return fallback;
    // Prefer apex — www redirects to non-www in production.
    u.hostname = u.hostname.replace(/^www\./i, "");
    return u.origin;
  } catch {
    return fallback;
  }
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "EmployeeFraudExpert";
export const SITE_EMAIL = "contact@employeefraudexpert.com";
export const SITE_REGION = "US";
export const SITE_REGION_LABEL = "Domestic referrals";
export const LINKEDIN_URL =
  "https://www.linkedin.com/company/employee-fraud-expert";

export const COLORS = {
  primary: "#2D3436",
  accent: "#C17F59",
  highlight: "#5C7A6B",
  background: "#FFFFFF",
  sectionAlt: "#F5F1EB",
  border: "#E0D6CC",
  heading: "#1A1F1E",
  body: "#4A5568",
} as const;
