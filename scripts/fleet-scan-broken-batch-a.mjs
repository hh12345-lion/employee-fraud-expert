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

const bad = [];
for (const r of REPOS) {
  const p = path.join(ROOT, r);
  if (!fs.existsSync(p)) continue;
  for (const f of walk(p)) {
    const t = fs.readFileSync(f, "utf8");
    const rel = path.relative(p, f).replace(/\\/g, "/");
    if (/\}\)\.catch\(/.test(t) && /const leadRes = await fetch/.test(t)) {
      bad.push(`BROKEN ${r}/${rel}`);
    }
    if (/message,\s*\n\s*message:\s*lead\.message/.test(t)) {
      bad.push(`DUPMSG ${r}/${rel}`);
    }
    if (
      /export function submitLeadNotification[\s\S]*?await fetch/.test(t)
    ) {
      bad.push(`SYNCASYNC ${r}/${rel}`);
    }
    // orphaned pattern: `},` then `}).catch` after catch block
    if (
      /Lead webhook notification failed; continuing/.test(t) &&
      /\}\)\.catch\(/.test(t)
    ) {
      bad.push(`ORPHAN_CATCH ${r}/${rel}`);
    }
  }
}
console.log(bad.join("\n") || "none");
