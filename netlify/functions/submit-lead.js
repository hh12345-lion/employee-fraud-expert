/**
 * POST /api/submit-lead (via netlify.toml redirect) → n8n / webhook.
 * Env: Lead_notification_url or LEAD_NOTIFICATION_URL, NEXT_PUBLIC_SITE_URL.
 * Outbound JSON: Full Name, Email, Phone Number, Brand name, domain (five keys).
 */
const BRAND_NAME = "Employee Fraud Expert";

function getLeadWebhookUrl() {
  return (
    process.env.Lead_notification_url ||
    process.env.LEAD_NOTIFICATION_URL ||
    ""
  );
}

function getSiteDomain() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || "https://employeefraudexpert.com";

  try {
    return new URL(raw).hostname.replace(/^www\./i, "");
  } catch {
    return "employeefraudexpert.com";
  }
}

exports.handler = async (event) => {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: jsonHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const fullName = String(body.fullName || body.full_name || "").trim();
  const email = String(body.email || "").trim();
  const phone = body.phone != null ? String(body.phone).trim() : "";

  if (!fullName || !email) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "fullName and email are required" }),
    };
  }

  const webhookUrl = getLeadWebhookUrl();
  if (!webhookUrl) {
    return {
      statusCode: 503,
      headers: jsonHeaders,
      body: JSON.stringify({
        error: "WEBHOOK_MISSING",
        message: "Lead_notification_url / LEAD_NOTIFICATION_URL is not set.",
      }),
    };
  }

  const outbound = {
    "Full Name": fullName,
    Email: email,
    "Phone Number": phone,
    "Brand name": BRAND_NAME,
    domain: getSiteDomain(),
  };

  let res;
  try {
    res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(outbound),
    });
  } catch {
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "WEBHOOK_UNREACHABLE" }),
    };
  }

  if (!res.ok) {
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "WEBHOOK_REJECTED", status: res.status }),
    };
  }

  return {
    statusCode: 200,
    headers: jsonHeaders,
    body: JSON.stringify({ ok: true }),
  };
};
