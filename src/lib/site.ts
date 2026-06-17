export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.employeefraudexpert.com";

export const SITE_NAME = "EmployeeFraudExpert";
export const SITE_EMAIL = "contact@employeefraudexpert.com";
export const SITE_REGION_LABEL = "United Kingdom only";
export const LINKEDIN_URL =
  "https://www.linkedin.com/company/employee-fraud-expert";

export const COLORS = {
  primary: "#6B1A1A",
  highlight: "#D97706",
  accent: "#374151",
  background: "#FFFFFF",
  sectionAlt: "#FDF8F8",
  border: "#F0D5D5",
  heading: "#6B1A1A",
  body: "#374151",
} as const;
