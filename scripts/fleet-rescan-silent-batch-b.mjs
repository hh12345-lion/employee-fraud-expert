/**
 * Re-scan batch B after apply.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const REPOS = [
  "expert-country-reports",
  "expert-witness-uae",
  "forensic-accountant-ae",
  "forensic-accountant-expert",
  "forensic-expert-witness",
  "fraud-expert-accountant",
  "fraud-expert-witness",
  "ibn-furat",
  "Iran-Country-Expert",
  "Latin-america-expert",
  "lawstone-web",
  "legal-aid-expert",
  "legal-aid-expert-witness",
  "legalaid-expert-witness",
  "loss-of-earnings-expert",
  "MENA-expert-witness",
  "middle-east-expert",
  "negligence-loss-expert",
  "pakistan-country-expert",
  "randd",
  "str-claims-web",
  "witness-consulting",
  "witness-forensic",
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

const REQUIRED = [
  "caseBrief",
  "case_summary",
  "caseDescription",
  "notes",
  "summary",
  "details",
  "description",
  "enquiry",
  "matter",
  "caseSummary",
  "briefSummary",
];

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

const remaining = [];
for (const r of REPOS) {
  const p = path.join(ROOT, r);
  if (!fs.existsSync(p)) {
    remaining.push({ repo: r, issue: "MISSING" });
    continue;
  }
  for (const f of walk(p)) {
    const t = fs.readFileSync(f, "utf8");
    const rel = path.relative(p, f).replace(/\\/g, "/");
    const lines = t.split(/\n/);
    lines.forEach((line, i) => {
      if (
        /(?:void\s+)?fetch\s*\(\s*['"`]\/api\/submit-lead/.test(line) &&
        !/await\s+fetch/.test(line) &&
        !/const\s+\w+\s*=/.test(line) &&
        !/return\s+fetch/.test(line)
      ) {
        // allow Promise.all
        const window = lines.slice(Math.max(0, i - 15), i + 1).join("\n");
        if (/Promise\.all/.test(window)) return;
        remaining.push({
          repo: r,
          type: "FIRE_FETCH",
          file: rel,
          line: i + 1,
          snip: line.trim().slice(0, 100),
        });
      }
      if (/void\s+notifyLeadWebhook\s*\(/.test(line)) {
        remaining.push({ repo: r, type: "VOID_NOTIFY", file: rel, line: i + 1 });
      }
      if (/void\s+post(LeadNotification|SubmitLead)\s*\(/.test(line)) {
        remaining.push({ repo: r, type: "VOID_POST", file: rel, line: i + 1 });
      }
    });
    if (
      /export function (notifyLeadSubmission|submitLeadNotification)/.test(t) &&
      /\/api\/submit-lead/.test(t) &&
      !/await\s+fetch/.test(t)
    ) {
      remaining.push({ repo: r, type: "SYNC_HELPER", file: rel });
    }
    if (/netlify\/functions\/submit-lead/.test(rel)) {
      for (const a of REQUIRED) {
        if (!new RegExp(`["']${a}["']`).test(t)) {
          remaining.push({ repo: r, type: "MISSING_ALIAS", file: rel, alias: a });
        }
      }
      if (
        (r === "MENA-expert-witness" || r === "middle-east-expert") &&
        !/statusCode:\s*502/.test(t)
      ) {
        remaining.push({ repo: r, type: "NO_502", file: rel });
      }
    }
    // await without async in non-async function (rough)
    if (
      /const sendLead = \([^)]*\)\s*=>\s*\{[\s\S]*?await\s+fetch/.test(t) &&
      !/const sendLead = async/.test(t)
    ) {
      remaining.push({ repo: r, type: "AWAIT_IN_SYNC", file: rel });
    }
  }
}

console.log(
  remaining.length
    ? JSON.stringify(remaining, null, 2)
    : "CLEAN — no remaining fire-and-forget / missing alias / 502 issues"
);
