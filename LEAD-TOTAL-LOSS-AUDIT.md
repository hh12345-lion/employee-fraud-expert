# Lead TOTAL_LOSS audit

**Question:** which repos on the n8n failure list break form submission so badly that **Google Sheets also gets nothing**?

**Method:** code evidence on live `/api/submit-lead` handler + form submit order. Hand-read of every TOTAL_LOSS candidate. Soft-fail / contact-first / GHL-primary → not TOTAL_LOSS.

## Verdict

| Class | Count | Meaning |
|-------|------:|---------|
| **TOTAL_LOSS** | **4** | n8n/`submit-lead` fail ⇒ form error **and** no Sheets row |
| SHEETS_OK (or CRM_OK) | 54 | Sheets/CRM still get the lead (or form soft-continues) |
| Unresolved | 0 | — |

Of ~58 failure-list repos, **only 4** lose Sheets when lead/n8n breaks.

---

## TOTAL_LOSS (4) — evidence

### 1. `asylum-court-reports`
- **Form:** `ContactForm` / `RequestForm` `await /api/submit-lead` → `if (!leadRes.ok) throw` → only then `/api/contact` or `/api/request` (Sheets).
- **Live handler:** Next `app/api/submit-lead/route.ts` — webhook-only (no Sheets).
- **Result:** n8n/webhook fail ⇒ visitor error, Sheets never called.

### 2. `asylum-expert-witness-org`
- **Form:** `ContactForm` same pattern — lead must OK, then fire-and-forget `/api/contact` (Sheets).
- **Live handler:** Netlify `submit-lead` (redirect) — webhook-only.
- **Result:** same as above.

### 3. `business-valuation-expert`
- **Handler:** `app/api/submit-lead/route.ts` — `notifyLeadWebhook`; on `"error" in result` **returns 502/503 before** `softFailAppendSheet`.
- **Form:** awaits submit-lead; thank-you only on OK (Formspree only on 503).
- **Result:** n8n reject/unreachable ⇒ no Sheets append, form errors.

### 4. `damages-expert-loss`
- **Handler:** `src/app/api/submit-lead/route.ts` — `notifyLeadWebhook`; `if (!webhookOk) return 502`; Sheets append **only after**.
- **Form:** awaits submit-lead; `!res.ok` blocks thank-you.
- **Result:** same webhook-before-Sheets hard fail.

---

## Patterns that are NOT TOTAL_LOSS (common)

These keep Sheets (or CRM) even when n8n fails:

1. **Contact/docket first** — `/api/contact` writes Sheets, then soft `submit-lead` (most “silent” fleet sites).
2. **Sheets OR webhook** — handler returns 200 if either path works (`employment-loss-expert`, `dispute-forensic`, `warranty-claim-expert`, `business-interruption-expert`, …).
3. **Soft continue** — `console.warn` / continue on `!leadRes.ok` then contact (`country-expert-insights`, `witness-forensic`+GHL, …).
4. **GHL primary** — `case-boost`, `ceed`, `witness-forensic`, `str-claims-web`.

**False alarm cleared:** `employment-loss-expert` was previously flagged; Sheets are written **before** webhook and success is OR — n8n-only fail still leaves a Sheets row.

---

## Scripts

- `scripts/audit-total-loss-final.mjs` — classifier + hand overrides  
- `scripts/resolve-manual.mjs` — remaining soft/contact/GHL checks  
- Output: this file  

Re-run: `node scripts/audit-total-loss-final.mjs`
