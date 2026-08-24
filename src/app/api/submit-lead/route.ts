import { NextResponse } from "next/server";
import { isGoogleSheetsConfigured } from "@/lib/google-sheets";
import {
  appendLeadToSheet,
  isLeadDeliveryConfigured,
  notifyLeadWebhook,
  parseLeadBody,
} from "@/lib/lead-submission";

export async function POST(request: Request) {
  if (!isLeadDeliveryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Lead delivery is not configured. Set Google Sheets env vars and/or Lead_notification_url in Netlify.",
      },
      { status: 503 }
    );
  }

  const webhookUrl =
    process.env.Lead_notification_url || process.env.LEAD_NOTIFICATION_URL;
  const sheetsConfigured = isGoogleSheetsConfigured();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const lead = parseLeadBody(body);
  if (!lead) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  let sheetsOk = false;
  if (sheetsConfigured) {
    try {
      await appendLeadToSheet(lead);
      sheetsOk = true;
    } catch (err) {
      console.error("Google Sheets write failed:", {
        message: err instanceof Error ? err.message : "Unknown error",
        sheetId: `${process.env.GOOGLE_SHEET_ID?.slice(0, 8)}...`,
        tab: process.env.GOOGLE_SHEET_TAB_NAME,
        timestamp: new Date().toISOString(),
      });
    }
  }

  let webhookOk = false;
  if (webhookUrl) {
    webhookOk = await notifyLeadWebhook(lead, webhookUrl);
  }

  if (!sheetsOk && !webhookOk) {
    return NextResponse.json(
      { error: "Failed to save your enquiry. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
