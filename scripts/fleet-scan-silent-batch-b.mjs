/**
 * Scan SILENT lead issues for batch B repos.
 * Run: node scripts/fleet-scan-silent-batch-b.mjs
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

const REQUIRED_ALIASES = [
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
    else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(ent.name)) acc.push(full);
  }
  return acc;
}

function isAwaitedFetchLine(line, prevLines) {
  if (/await\s+fetch/.test(line)) return true;
  if (/const\s+\w+\s*=\s*(?:await\s+)?fetch/.test(line)) return true;
  if (/return\s+fetch/.test(line)) return true;
  // Multi-line: await on previous line
  const joined = prevLines.slice(-2).join(" ") + " " + line;
  if (/await\s+fetch/.test(joined)) return true;
  if (/const\s+\w+\s*=\s*await\s*$/.test(prevLines.at(-1) || "")) return true;
  return false;
}

const out = [];
for (const r of REPOS) {
  const p = path.join(ROOT, r);
  if (!fs.existsSync(p)) {
    out.push({ repo: r, status: "MISSING" });
    continue;
  }
  const issues = [];
  for (const f of walk(p)) {
    const t = fs.readFileSync(f, "utf8");
    const rel = path.relative(p, f).replace(/\\/g, "/");
    const lines = t.split(/\n/);

    lines.forEach((line, i) => {
      if (
        /(?:void\s+)?fetch\s*\(\s*['"`]\/api\/submit-lead/.test(line) &&
        !isAwaitedFetchLine(line, lines.slice(0, i))
      ) {
        issues.push({
          type: "FIRE_FETCH",
          file: rel,
          line: i + 1,
          snip: line.trim().slice(0, 140),
        });
      }
      if (/void\s+notifyLeadWebhook\s*\(/.test(line)) {
        issues.push({
          type: "VOID_NOTIFY",
          file: rel,
          line: i + 1,
          snip: line.trim().slice(0, 140),
        });
      }
    });

    if (/\/api\/submit-lead/.test(t)) {
      const blocks = [...t.matchAll(/fetch\s*\(\s*['"`]\/api\/submit-lead['"`][\s\S]{0,900}/g)];
      for (const b of blocks) {
        if (!/message\s*:/.test(b[0])) {
          issues.push({
            type: "NO_MESSAGE_IN_FETCH",
            file: rel,
            snip: b[0].slice(0, 220).replace(/\n/g, " "),
          });
        }
      }
    }

    if (/netlify\/functions\/submit-lead/.test(rel)) {
      if (!/resolveLeadMessage/.test(t)) {
        issues.push({ type: "NO_RESOLVE", file: rel });
      } else {
        for (const a of REQUIRED_ALIASES) {
          if (!new RegExp(`["']${a}["']`).test(t)) {
            issues.push({ type: "MISSING_ALIAS", file: rel, alias: a });
          }
        }
      }
      const outbound = t.match(/outbound\s*=\s*\{[\s\S]*?\n\s*\}/);
      if (outbound && !/\bmessage\b/.test(outbound[0])) {
        issues.push({ type: "NO_OUTBOUND_MESSAGE", file: rel });
      }
      if (r === "MENA-expert-witness" || r === "middle-east-expert") {
        if (!/statusCode:\s*502/.test(t)) {
          issues.push({ type: "NO_502", file: rel });
        }
      }
    }

    // Local void notify helpers
    if (
      /function\s+notifyLeadWebhook\s*\([^)]*\)\s*:\s*void/.test(t) &&
      /\/api\/submit-lead/.test(t)
    ) {
      issues.push({ type: "VOID_HELPER", file: rel });
    }
  }
  out.push({ repo: r, issueCount: issues.length, issues });
}

console.log(JSON.stringify(out, null, 2));
