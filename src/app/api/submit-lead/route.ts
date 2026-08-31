import { NextResponse } from "next/server";
import {
  getLeadWebhookUrl,
  notifyLeadWebhook,
} from "@/lib/leadNotification";
import { parseLeadBody } from "@/lib/lead-submission";

/**
 * Webhook-only lead path. Sheets are written by /api/contact and /api/instruct
 * (shared tab + Form Type) so we do not double-append here.
 */
export async function POST(request: Request) {
  const webhookUrl = getLeadWebhookUrl();
  if (!webhookUrl) {
    return NextResponse.json(
      {
        error: "WEBHOOK_MISSING",
        message: "Lead_notification_url / LEAD_NOTIFICATION_URL is not set.",
      },
      { status: 503 }
    );
  }

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

  const result = await notifyLeadWebhook(
    {
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
    },
    webhookUrl
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: "Lead notification dispatch failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    success: true,
    forwarded: result.forwarded,
  });
}
