import { appendRow, type CellValue } from "@/lib/google-sheets";

export const BRAND_NAME = "Employee Fraud Expert";

/** Row 1 on GOOGLE_SHEET_TAB_NAME - must match buildLeadSheetRow column order */
export const LEAD_SHEET_HEADERS = [
  "Timestamp",
  "Full Name",
  "Email",
  "Phone Number",
  "Organisation",
  "You Are",
  "Fraud Types",
  "Proceedings",
  "Approximate Loss",
  "Suspect Still Employed",
  "Urgent",
  "Description",
  "Brand Name",
] as const;

export interface LeadSubmission {
  fullName: string;
  email: string;
  phone: string;
  organisation?: string;
  audience?: string;
  fraudTypes?: string;
  proceedings?: string;
  lossValue?: string;
  suspectEmployed?: string;
  urgent?: string;
  description?: string;
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function opt(value: unknown): string {
  if (value == null) return "";
  return sanitize(String(value));
}

function formatFraudTypes(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((v) => sanitize(String(v))).filter(Boolean).join("; ");
  }
  return opt(value);
}

/** Prevent Sheets from treating +44… as a formula when using USER_ENTERED */
function formatPhoneForSheet(phone: string): string {
  if (!phone) return "";
  if (phone.startsWith("+") || phone.startsWith("=") || phone.startsWith("-")) {
    return `'${phone}`;
  }
  return phone;
}

export function parseLeadBody(body: unknown): LeadSubmission | null {
  if (!body || typeof body !== "object") return null;

  const b = body as Record<string, unknown>;
  const fullName = opt(b.fullName ?? b.full_name);
  const email = opt(b.email).toLowerCase();

  if (!fullName || !email) return null;

  return {
    fullName,
    email,
    phone: b.phone != null ? String(b.phone).trim() : "",
    organisation: opt(b.organisation),
    audience: opt(b.audience ?? b.audienceType),
    fraudTypes: formatFraudTypes(b.fraudTypes ?? b.fraudType),
    proceedings: opt(b.proceedings),
    lossValue: opt(b.lossValue),
    suspectEmployed: opt(b.suspectEmployed),
    urgent: opt(b.urgent),
    description: opt(b.description),
  };
}

export function buildLeadSheetRow(lead: LeadSubmission): CellValue[] {
  return [
    new Date().toISOString(),
    lead.fullName,
    lead.email,
    formatPhoneForSheet(lead.phone),
    lead.organisation ?? "",
    lead.audience ?? "",
    lead.fraudTypes ?? "",
    lead.proceedings ?? "",
    lead.lossValue ?? "",
    lead.suspectEmployed ?? "",
    lead.urgent ?? "",
    lead.description ?? "",
    BRAND_NAME,
  ];
}

/** n8n webhook - four keys only */
export function buildWebhookPayload(lead: LeadSubmission) {
  return {
    "Full Name": lead.fullName,
    Email: lead.email,
    "Phone Number": lead.phone,
    "Brand name": BRAND_NAME,
  };
}

export async function appendLeadToSheet(lead: LeadSubmission): Promise<void> {
  await appendRow(buildLeadSheetRow(lead));
}

export async function notifyLeadWebhook(
  lead: LeadSubmission,
  webhookUrl: string
): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWebhookPayload(lead)),
    });
    return res.ok;
  } catch (err) {
    console.error("Lead webhook failed:", err);
    return false;
  }
}
