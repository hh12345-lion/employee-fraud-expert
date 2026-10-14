import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

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
    else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(ent.name)) acc.push(full);
  }
  return acc;
}

const summary = {};

for (const repo of REPOS) {
  const project = path.join(ROOT, repo);
  const entry = {
    voidFetch: [],
    bareFetchCatch: [],
    hasMessageAlias: null,
    gitFiles: [],
    notes: [],
  };

  if (!fs.existsSync(project)) {
    entry.notes.push("MISSING");
    summary[repo] = entry;
    continue;
  }

  for (const f of walk(project)) {
    const t = fs.readFileSync(f, "utf8");
    const rel = path.relative(project, f).replace(/\\/g, "/");
    if (/void\s+fetch\s*\(\s*['"`]\/api\/submit-lead/.test(t)) {
      entry.voidFetch.push(rel);
    }
    if (
      /(?<!await\s)(?<!const\s+\w+\s*=\s*)fetch\s*\(\s*['"`]\/api\/submit-lead/.test(
        t
      ) &&
      /\/api\/submit-lead[\s\S]{0,300}?\.catch\(/.test(t) &&
      !/const leadRes = await fetch/.test(t)
    ) {
      entry.bareFetchCatch.push(rel);
    }
    if (/netlify\/functions\/submit-lead\.(js|cjs)$/.test(rel)) {
      entry.hasMessageAlias = /caseDescription|caseBrief/.test(t) &&
        /resolveLeadMessage\(/.test(t) &&
        /message/.test(t);
    }
  }

  try {
    const out = execSync("git status --porcelain", {
      cwd: project,
      encoding: "utf8",
    });
    entry.gitFiles = out
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .filter(
        (l) =>
          /submit-lead|ContactForm|InstructForm|RetainForm|EngageForm|PricingPlan|RequestEvidence|SecureMatch|leadNotification|lead-notification|leadWebhook|submitLeadClient|enquiry\.ts|Contact\.tsx|notifyLead/i.test(
            l
          )
      );
  } catch {
    entry.notes.push("not a git repo / status failed");
  }

  summary[repo] = entry;
}

console.log(JSON.stringify(summary, null, 2));
