import { appendRow, type CellValue } from "@/lib/google-sheets";
import { BRAND_NAME, isLeadWebhookConfigured } from "@/lib/leadNotification";

export { BRAND_NAME };

/**
 * Row 1 on GOOGLE_SHEET_TAB_NAME — one shared tab; Form Type distinguishes Contact/Instruct.
 * Timestamp | Brand | Form Type | Full Name | Email | Phone Number |
 * Organisation | You Are | Description
 */
export const LEAD_SHEET_HEADERS = [
  "Timestamp",
  "Brand",
  "Form Type",
  "Full Name",
  "Email",
  "Phone Number",
  "Organisation",
  "You Are",
  "Description",
] as const;

export interface LeadSubmission {
  fullName: string;
  email: string;
  phone: string;
  formType?: string;
  organisation?: string;
  audience?: string;
  description?: string;
  /** Universal free-text field for n8n (`message`). */
  message?: string;
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function opt(value: unknown): string {
  if (value == null) return "";
  return sanitize(String(value));
}

/** Prevent Sheets from treating +1… as a formula when using USER_ENTERED */
function formatPhoneForSheet(phone: string): string {
  if (!phone) return "";
  if (phone.startsWith("+") || phone.startsWith("=") || phone.startsWith("-")) {
    return `'${phone}`;
  }
  return phone;
}

export function resolveFormTypeLabel(
  formType?: string
): "Contact" | "Instruct" {
  const normalized = (formType || "").toLowerCase().trim();
  return normalized === "instruct" ? "Instruct" : "Contact";
}

export function parseLeadBody(body: unknown): LeadSubmission | null {
  if (!body || typeof body !== "object") return null;

  const b = body as Record<string, unknown>;
  const fullName = opt(b.fullName ?? b.full_name ?? b.name);
  const email = opt(b.email).toLowerCase();

  if (!fullName || !email) return null;

  const freeText = opt(
    b.message ??
      b.Message ??
      b.description ??
      b.enquiry ??
      b.details ??
      b.summary ??
      b.notes ??
      b.matter
  );

  return {
    fullName,
    email,
    phone: b.phone != null ? String(b.phone).trim() : "",
    formType: opt(b.formType),
    organisation: opt(b.organisation ?? b.organization ?? b.lawFirm),
    audience: opt(b.audience ?? b.audienceType),
    description: freeText || opt(b.description ?? b.message),
    message: freeText,
  };
}

/** Used by scripts/test-sheets.ts — same column order as sheetSubmissions. */
export function buildLeadSheetRow(lead: LeadSubmission): CellValue[] {
  return [
    new Date().toISOString(),
    BRAND_NAME,
    resolveFormTypeLabel(lead.formType),
    lead.fullName,
    lead.email,
    formatPhoneForSheet(lead.phone),
    lead.organisation ?? "",
    lead.audience ?? "",
    lead.description ?? "",
  ];
}

export async function appendLeadToSheet(lead: LeadSubmission): Promise<void> {
  await appendRow(buildLeadSheetRow(lead));
}

export function isLeadDeliveryConfigured(): boolean {
  return Boolean(
    isLeadWebhookConfigured() ||
      (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
        process.env.GOOGLE_PRIVATE_KEY &&
        process.env.GOOGLE_SHEET_ID)
  );
}
