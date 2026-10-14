# Lead → n8n failures (fleet audit)

**Status (local only — not committed/pushed):** fixes applied for all listed repos.
Outbound n8n payload includes lowercase `message` from free-text aliases.
Truncated Netlify `submit-lead.js` files restored. Silent forms now await submit-lead.

## Empty `message` (fixed)

- asia-court-reports — enquiry `notes` → `message` on webhook
- asylum-court-reports — Request form includes `message`/`notes`
- asylum-expert-witness-org — QuickBrief sends synthetic `message`
- business-interruption-expert — textarea + `message` in submit-lead
- business-valuation-expert — `caseDescription` → `message` + aliases
- case-boost — textarea → `message`
- damages-expert-loss — textarea → `message`
- dispute-forensic — textarea → `message`
- redd-growth — ghl-webhook n8n payload includes `message`
- warranty-claim-expert — textarea → `message`

## Crash / truncated Netlify (fixed)

- employment-loss-expert
- future-earnings-expert
- juris-country-experts
- (+ fleet restore of other truncated submit-lead.js that lost BRAND_NAME/helpers)

## Silent (fixed — await + message)

- abc-expert-consultants
- accounting-expert-witness
- ads-for-openai
- aigeos-web
- asylum-country-expert
- asylum-expert
- asylum-expert-scot
- business-loss-expert
- business-valuation-expert-witness
- case-assistant
- ceed
- coi-experts
- context-signal
- country-condition-reports
- country-conditions-expert
- country-expert-insights
- country-expert-witness-net
- country-report-expert
- country-risk-expert
- divorce-accountant-expert
- divorce-tax-expert
- employee-fraud-expert
- expert-country-reports
- expert-witness-uae
- forensic-accountant-ae
- forensic-accountant-expert
- forensic-expert-witness
- fraud-expert-accountant
- fraud-expert-witness
- ibn-furat
- Iran-Country-Expert
- Latin-america-expert
- lawstone-web
- legal-aid-expert
- legal-aid-expert-witness
- legalaid-expert-witness
- loss-of-earnings-expert
- MENA-expert-witness
- middle-east-expert
- negligence-loss-expert
- pakistan-country-expert
- randd
- str-claims-web
- witness-consulting
- witness-forensic
