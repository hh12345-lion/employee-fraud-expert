/**
 * Final cleanup for batch A silent-lead fix artifacts.
 * node scripts/fleet-cleanup-silent-batch-a.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const APPLY = process.argv.includes("--apply");

const TYPE_FILES = [
  "accounting-expert-witness/lib/leadNotification.ts",
  "asylum-expert-scot/lib/lead-notification.ts",
  "business-loss-expert/lib/lead-notification.ts",
  "business-valuation-expert-witness/lib/lead-notification.ts",
  "country-expert-witness-net/lib/leadWebhook.ts",
];

const ROUTE_FILES = [
  "coi-experts/app/api/submit-lead/route.ts",
  "country-condition-reports/app/api/submit-lead/route.ts",
  "country-conditions-expert/app/api/submit-lead/route.ts",
  "country-report-expert/app/api/submit-lead/route.ts",
  "divorce-accountant-expert/app/api/submit-lead/route.ts",
];

const FORM_AWAIT = [
  "country-conditions-expert/components/forms/ContactForm.tsx",
  "country-conditions-expert/components/forms/RetainForm.tsx",
];

const report = [];

function fixTypeFile(src) {
  // Remove erroneous `message: lead.message ?? "",` inside type definitions
  return src.replace(
    /(\n\s*)message:\s*lead\.message\s*\?\?\s*"",\s*\n(\s*message:\s*string;)/g,
    "$1$2"
  );
}

function fixRouteFile(src) {
  // Where there is no `const lead =`, replace lead.message ?? lead.description ?? message with message
  if (/\bconst\s+lead\s*=/.test(src) || /\blead\s*=\s*parseLead/.test(src)) {
    return src;
  }
  return src.replace(
    /message:\s*lead\.message\s*\?\?\s*lead\.description\s*\?\?\s*message\s*\?\?\s*"",?/g,
    'message,'
  ).replace(
    /message:\s*lead\.message\s*\?\?\s*lead\.description\s*\?\?\s*"",?/g,
    'message,'
  );
}

function fixAwaitSubmitLead(src) {
  return src.replace(
    /(?<!await\s)submitLeadNotification\s*\(/g,
    "await submitLeadNotification("
  );
}

function expandResolveAliasesTs(src) {
  if (!/function\s+resolveLeadMessage/.test(src)) return src;
  const required = [
    "message",
    "Message",
    "description",
    "enquiry",
    "details",
    "summary",
    "notes",
    "matter",
    "caseSummary",
    "case_summary",
    "caseBrief",
    "caseDescription",
    "caseDetails",
    "additionalInfo",
    "additional_info",
    "enquiryDetails",
  ];
  return src.replace(
    /(function\s+resolveLeadMessage\s*\([^)]*\)[^{]*\{[\s\S]*?const\s+keys\s*=\s*\[)([\s\S]*?)(\]\s*as\s+const)/,
    (m, open, body, close) => {
      const existing = new Set(
        [...body.matchAll(/["']([^"']+)["']/g)].map((x) => x[1])
      );
      const merged = [...existing];
      for (const a of required) if (!existing.has(a)) merged.push(a);
      return `${open}\n    ${merged.map((k) => `"${k}"`).join(",\n    ")}\n  ${close}`;
    }
  );
}

for (const rel of TYPE_FILES) {
  const abs = path.join(ROOT, rel);
  let src = fs.readFileSync(abs, "utf8");
  let next = fixTypeFile(src);
  if (next !== src) {
    report.push(`type ${rel}`);
    if (APPLY) fs.writeFileSync(abs, next, "utf8");
  }
}

for (const rel of ROUTE_FILES) {
  const abs = path.join(ROOT, rel);
  let src = fs.readFileSync(abs, "utf8");
  let next = fixRouteFile(src);
  next = expandResolveAliasesTs(next);
  if (next !== src) {
    report.push(`route ${rel}`);
    if (APPLY) fs.writeFileSync(abs, next, "utf8");
  }
}

for (const rel of FORM_AWAIT) {
  const abs = path.join(ROOT, rel);
  let src = fs.readFileSync(abs, "utf8");
  let next = fixAwaitSubmitLead(src);
  if (next !== src) {
    report.push(`await ${rel}`);
    if (APPLY) fs.writeFileSync(abs, next, "utf8");
  }
}

// Expand aliases in country-risk-expert TS helper + coi route resolveLeadMessage
for (const rel of [
  "country-risk-expert/lib/leadNotification.ts",
  "coi-experts/app/api/submit-lead/route.ts",
  "country-expert-witness-net/lib/leadWebhook.ts",
]) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  let src = fs.readFileSync(abs, "utf8");
  let next = expandResolveAliasesTs(src);
  if (next !== src) {
    report.push(`aliases ${rel}`);
    if (APPLY) fs.writeFileSync(abs, next, "utf8");
  }
}

console.log(
  JSON.stringify({ mode: APPLY ? "APPLY" : "DRY_RUN", report }, null, 2)
);
