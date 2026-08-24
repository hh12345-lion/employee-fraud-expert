export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.employeefraudexpert.com";

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
