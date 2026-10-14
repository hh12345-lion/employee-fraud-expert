import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const REPOS = [
  "abc-expert-consultants",
  "accounting-expert-witness",
  "ads-for-openai",
  "aigeos-web",
  "asylum-country-expert",
  "asylum-expert",
  "asylum-expert-scot",
  "business-loss-expert",
  "business-valuation-expert-witness",
  "case-assistant",
  "ceed",
  "coi-experts",
  "context-signal",
  "country-condition-reports",
  "country-conditions-expert",
  "country-expert-insights",
  "country-expert-witness-net",
  "country-report-expert",
  "country-risk-expert",
  "divorce-accountant-expert",
  "divorce-tax-expert",
  "employee-fraud-expert",
];
const SKIP = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".turbo",
  "coverage",
  "out",
  ".vercel",
  ".cursor",
  "scripts",
  ".netlify",
]);

function walk(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries) {
    if (SKIP.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (/\.(tsx?|jsx?)$/.test(ent.name)) acc.push(full);
  }
  return acc;
}

const report = [];
for (const r of REPOS) {
  const p = path.join(ROOT, r);
  if (!fs.existsSync(p)) continue;
  for (const f of walk(p)) {
    const t = fs.readFileSync(f, "utf8");
    const rel = path.relative(p, f).replace(/\\/g, "/");
    if (/lead\.message\s*\?\?\s*lead\.description/.test(t)) {
      report.push(`BAD_LEAD_REF ${r}/${rel}`);
    }
    if (/message:\s*lead\.message\s*\?\?\s*"",\s*\n\s*message:\s*string/.test(t)) {
      report.push(`BAD_TYPE ${r}/${rel}`);
    }
    if (
      /(?<!await\s)submitLeadNotification\s*\(/.test(t) &&
      !/export async function submitLeadNotification/.test(t) &&
      !/export function submitLeadNotification/.test(t)
    ) {
      report.push(`NO_AWAIT_SUBMIT ${r}/${rel}`);
    }
  }
}
console.log(report.join("\n") || "clean");
