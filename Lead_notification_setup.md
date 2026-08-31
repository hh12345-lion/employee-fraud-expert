# Lead notification webhook (n8n)

Use this pattern on every brand site: on **form submit**, POST a fixed set of fields to a URL in environment variables (e.g. **n8n**).

The outbound payload shape is **identical across all projects** so one n8n workflow can receive leads from every site.

---

## On submit: what gets sent

When the user submits the contact form, the app **POST**s JSON to **`/api/submit-lead`** with:

| Field sent to the API | Source (contact form) |
|------------------------|-------------------------|
| **`fullName`** | Full name |
| **`email`** | Email |
| **`phone`** | Phone (may be empty string) |
| **`formType`** | Optional: `contact` or `instruct` |

The handler (**`netlify/functions/submit-lead.js`** or **`app/api/submit-lead/route.ts`**) **POST**s to **`Lead_notification_url`** with **exactly these keys**:

| Key in the outbound JSON | Value | Required |
|---------------------------|--------|----------|
| **`Full Name`** | From `fullName` | Yes |
| **`Email`** | From `email` | Yes |
| **`Phone Number`** | From `phone` | Yes (may be `""`) |
| **`Brand name`** | Fixed per site in code (`BRAND_NAME`) | Yes |
| **`domain`** | Site hostname, no `www` (e.g. `forensicexpertwitness.co.uk`) | Yes |

Content type: **`application/json`**.

### Example outbound body

```json
{
  "Full Name": "Jane Smith",
  "Email": "jane@example.com",
  "Phone Number": "+44 7700 900123",
  "Brand name": "Forensic Expert Witness",
  "domain": "forensicexpertwitness.co.uk"
}
```

### `domain` (standard across all projects)

- **Key name:** always lowercase **`domain`** (not `Domain`, not `site`, not `website`).
- **Value:** hostname only from the site’s public URL — no `https://`, no path, no trailing slash.
- **Strip `www.`** if present (`www.example.co.uk` → `example.co.uk`).
- **Source:** `NEXT_PUBLIC_SITE_URL` (or equivalent) in each project’s env.

| Project env | Example `domain` value |
|-------------|-------------------------|
| `NEXT_PUBLIC_SITE_URL=https://forensicexpertwitness.co.uk` | `forensicexpertwitness.co.uk` |
| `NEXT_PUBLIC_SITE_URL=https://www.other-brand.com` | `other-brand.com` |

n8n can route or label leads with **`domain`** + **`Brand name`** without parsing URLs differently per repo.

---

## Where the URL is configured

| Environment variable | Purpose |
|----------------------|--------|
| **`Lead_notification_url`** | Webhook URL (POST). **`LEAD_NOTIFICATION_URL`** is accepted as a fallback. |
| **`NEXT_PUBLIC_SITE_URL`** | Canonical site URL; used to derive **`domain`** for the webhook. |

Set both in **Netlify → Environment variables** and in local **`.env`** for **`netlify dev`**.

Do not commit real URLs in Git; keep **`.env`** gitignored.

---

## Netlify wiring

- **`netlify.toml`**: redirect **`/api/submit-lead`** → **`/.netlify/functions/submit-lead`**.
- **`netlify/functions/submit-lead.js`**: builds the five keys above and **`fetch` POST**s to **`Lead_notification_url`**.

For local testing, run **`netlify dev`** and open the URL it prints (often **`http://localhost:8888`**) so **`/api/submit-lead`** resolves to the function.

---

## Next.js (non-Netlify) wiring

- **`app/api/submit-lead/route.ts`**: validates body, calls **`notifyLeadWebhook`** in **`lib/leadNotification.ts`**.
- **`lib/leadNotification.ts`**: same five-key outbound JSON as the Netlify function.
- **`lib/seo.ts`**: **`getSiteDomain()`** reads **`NEXT_PUBLIC_SITE_URL`** and returns the hostname for **`domain`**.

Contact form should POST **`/api/contact`** first (Sheets soft-fail), then fire **`/api/submit-lead`** after success (fire-and-forget is fine).

---

## Per-project checklist (copy to every brand)

1. Set **`BRAND_NAME`** in **`netlify/functions/submit-lead.js`** and **`lib/leadNotification.ts`** (display name for n8n).
2. Set **`NEXT_PUBLIC_SITE_URL`** to the live site (e.g. `https://forensicexpertwitness.co.uk`).
3. Set **`Lead_notification_url`** to the shared n8n webhook URL.
4. Confirm outbound JSON includes all **five keys**, especially **`domain`** spelled exactly as above.
5. In n8n, map **`domain`** to branch, filter, or store — same field name on every site.

### Files to copy for another project

- **`netlify/functions/submit-lead.js`** (update **`BRAND_NAME`**, keep **`domain`** logic)
- **`netlify.toml`** block for **`/api/submit-lead`**
- **`lib/leadNotification.ts`** + **`getSiteDomain()`** helper (or equivalent)
- **`app/api/submit-lead/route.ts`**
- In the contact form handler:

```javascript
fetch("/api/submit-lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || "",
    formType: "contact",
  }),
});
```

---

## This project (Employee Fraud Expert)

| Setting | Value |
|---------|--------|
| **`BRAND_NAME`** | `Employee Fraud Expert` |
| **`domain`** (when `NEXT_PUBLIC_SITE_URL` is set) | `employeefraudexpert.com` |
| Contact webhook | **`/api/submit-lead`** after successful **`/api/contact`** (fire-and-forget) |
| Instruct webhook | **`/api/submit-lead`** after successful **`/api/instruct`** (fire-and-forget) |
| Google Sheets | **`/api/contact`** and **`/api/instruct`** → one `GOOGLE_SHEET_TAB_NAME` tab with **Form Type** `Contact` / `Instruct` (soft-fail) |
| **`/api/submit-lead`** | Webhook-only (no Sheets append) |
