import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const repos = [
  "asylum-expert-witness-org",
  "accounting-expert-witness",
  "country-expert-insights",
  "ibn-furat",
  "business-valuation-expert-witness",
  "case-assistant",
  "randd",
  "asia-court-reports",
  "ads-for-openai",
  "asylum-expert",
  "asylum-expert-scot",
  "ceed",
  "country-expert-witness-net",
  "expert-country-reports",
  "lawstone-web",
  "loss-of-earnings-expert",
  "negligence-loss-expert",
  "str-claims-web",
  "business-valuation-expert",
  "damages-expert-loss",
  "dispute-forensic",
  "asylum-court-reports",
  "business-interruption-expert",
];

function walk(dir, acc = [], depth = 0) {
  if (!fs.existsSync(dir) || depth > 7) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next", "dist"].includes(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc, depth + 1);
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

for (const repo of repos) {
  const proj = path.join(ROOT, repo);
  const files = walk(proj).filter((p) =>
    /Form|contact-form|Intake|LeadForm/i.test(path.basename(p))
  );
  const hits = [];
  for (const f of files) {
    const t = fs.readFileSync(f, "utf8");
    if (!/submit-lead|submitLead|notifyLead|\/api\/contact|\/api\/instruct|ghl-webhook/.test(t))
      continue;
    const rel = path.relative(proj, f).replace(/\\/g, "/");
    const awaitLead = /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t);
    const voidLead =
      (/void\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t) ||
        (/submitLeadNotification\s*\(/.test(t) && !/await\s+submitLeadNotification/.test(t))) &&
      !awaitLead;
    const primaryFirst = (() => {
      const p = t.search(/\/api\/(?:contact|instruct|docket|retain|ghl-webhook)/);
      const l = t.search(/\/api\/submit-lead/);
      return p >= 0 && (l < 0 || p < l);
    })();
    const leadFirst = (() => {
      const p = t.search(/\/api\/(?:contact|instruct|docket|retain)/);
      const l = t.search(/\/api\/submit-lead/);
      return l >= 0 && (p < 0 || l < p);
    })();
    const blocksLead =
      /\/api\/submit-lead[\s\S]{0,800}if\s*\(\s*!(?:res|apiRes|leadRes|response)\.ok/.test(t) ||
      /leadRes\.ok|apiRes\.ok[\s\S]{0,200}thank-you/.test(t);
    hits.push({ rel, awaitLead, voidLead, primaryFirst, leadFirst, blocksLead });
  }
  console.log(JSON.stringify({ repo, hits }, null, 0));
}
