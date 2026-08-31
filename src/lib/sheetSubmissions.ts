import {
  appendRowWithRetry,
  isGoogleSheetsConfigured,
  type CellValue,
  type SheetTarget,
} from "@/lib/google-sheets";
import { BRAND_NAME, type LeadSubmission } from "@/lib/lead-submission";

function sharedTab(): SheetTarget {
  return {
    sheetName: process.env.GOOGLE_SHEET_TAB_NAME || "Sheet1",
  };
}

/** Prevent Sheets from treating +1… as a formula when using USER_ENTERED */
function formatPhoneForSheet(phone: string): string {
  if (!phone) return "";
  if (phone.startsWith("+") || phone.startsWith("=") || phone.startsWith("-")) {
    return `'${phone}`;
  }
  return phone;
}

/**
 * Expected header row (one shared tab):
 * Timestamp | Brand | Form Type | Full Name | Email | Phone Number |
 * Organisation | You Are | Description
 */
function buildSheetRow(
  lead: LeadSubmission,
  formType: "Contact" | "Instruct"
): CellValue[] {
  return [
    new Date().toISOString(),
    BRAND_NAME,
    formType,
    lead.fullName,
    lead.email,
    formatPhoneForSheet(lead.phone),
    lead.organisation ?? "",
    lead.audience ?? "",
    lead.description ?? "",
  ];
}

export async function appendContactToSheet(lead: LeadSubmission): Promise<void> {
  if (!isGoogleSheetsConfigured()) return;
  await appendRowWithRetry(buildSheetRow(lead, "Contact"), 2, sharedTab());
}

export async function appendInstructToSheet(lead: LeadSubmission): Promise<void> {
  if (!isGoogleSheetsConfigured()) return;
  await appendRowWithRetry(buildSheetRow(lead, "Instruct"), 2, sharedTab());
}

export async function writeSubmissionToSheetSafely(
  writer: () => Promise<void>,
  context: string
): Promise<void> {
  if (!isGoogleSheetsConfigured()) {
    return;
  }

  try {
    await writer();
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      code?: number;
      response?: { status?: number };
    };
    console.error("Google Sheets error:", {
      context,
      message: err?.message,
      code: err?.code,
      status: err?.response?.status,
      spreadsheetId: `${process.env.GOOGLE_SHEET_ID?.slice(0, 8)}...`,
      tab: process.env.GOOGLE_SHEET_TAB_NAME,
      timestamp: new Date().toISOString(),
    });
  }
}
