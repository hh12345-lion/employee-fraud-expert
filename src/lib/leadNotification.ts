import { getSiteDomain } from "./seo";

export const BRAND_NAME = "Employee Fraud Expert";

export interface LeadWebhookInput {
  fullName: string;
  email: string;
  phone: string;
}

/** Outbound n8n payload — five keys, identical across all brand sites. */
export function buildWebhookPayload(lead: LeadWebhookInput) {
  return {
    "Full Name": lead.fullName,
    Email: lead.email,
    "Phone Number": lead.phone ?? "",
    "Brand name": BRAND_NAME,
    domain: getSiteDomain(),
  };
}

export function getLeadWebhookUrl(): string {
  return (
    process.env.Lead_notification_url ||
    process.env.LEAD_NOTIFICATION_URL ||
    ""
  );
}

export async function notifyLeadWebhook(
  lead: LeadWebhookInput,
  webhookUrl?: string
): Promise<boolean> {
  const url = webhookUrl || getLeadWebhookUrl();
  if (!url) return false;

  try {
    const res = await fetch(url, {
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

export function isLeadWebhookConfigured(): boolean {
  return Boolean(getLeadWebhookUrl());
}
