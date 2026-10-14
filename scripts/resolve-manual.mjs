import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const repos = [
  "ads-for-openai",
  "asia-court-reports",
  "asylum-country-expert",
  "asylum-expert",
  "asylum-expert-scot",
  "case-assistant",
  "ceed",
  "context-signal",
  "country-condition-reports",
  "country-conditions-expert",
  "country-expert-witness-net",
  "country-risk-expert",
  "expert-country-reports",
  "forensic-accountant-ae",
  "Latin-america-expert",
  "lawstone-web",
  "legalaid-expert-witness",
  "loss-of-earnings-expert",
  "negligence-loss-expert",
  "pakistan-country-expert",
  "str-claims-web",
  "witness-forensic",
];

function walk(dir, acc = [], depth = 0) {
  if (!fs.existsSync(dir) || depth > 8) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next", "dist", "out"].includes(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc, depth + 1);
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

for (const repo of repos) {
  const project = path.join(ROOT, repo);
  const files = walk(project);
  let flags = {
    contactThenLead: false,
    softLead: false,
    ghl: false,
    sheetsInActions: false,
    leadGateThrow: false,
    soleLeadHard: false,
  };
  const evidence = [];

  for (const f of files) {
    const t = fs.readFileSync(f, "utf8");
    const rel = path.relative(project, f).replace(/\\/g, "/");
    const base = path.basename(f);

    if (/api\/(contact|instruct|docket|retain)/.test(rel) && /append|GOOGLE_SHEET|spreadsheet/i.test(t)) {
      flags.sheetsInActions = true;
      evidence.push(`sheets API: ${rel}`);
    }
    if (/actions\.ts$/.test(base) && /appendRow|GOOGLE_SHEET/.test(t) && /submitLead|webhook|notifyLead/i.test(t)) {
      const s = t.search(/appendRow|append\(/);
      const w = t.search(/submitLead|notifyLead|webhook/i);
      if (s >= 0 && (w < 0 || s < w)) {
        flags.sheetsInActions = true;
        flags.softLead = /warn.*webhook|webhook failed|still saved/i.test(t);
        evidence.push(`actions sheets-before-webhook: ${rel}`);
      }
    }

    if (!/Form|actions|Intake|Quote|Enquiry|contact-form/i.test(base)) continue;

    const c = t.search(/\/api\/(?:contact|instruct|docket|retain|submit-contact)/);
    const l = t.search(/\/api\/submit-lead|submitLeadNotification|notifyLeadWebhook/);
    if (c >= 0 && l >= 0 && c < l) {
      flags.contactThenLead = true;
      evidence.push(`contact-before-lead: ${rel}`);
    }
    if (/continuing|Lead webhook notification failed|Secondary lead|do not block|don't block/i.test(t) && /submit-lead|notifyLead|submitLead/i.test(t)) {
      flags.softLead = true;
      evidence.push(`soft-lead: ${rel}`);
    }
    if (/ghlService|ghl-webhook|GoHighLevel|createContact/.test(t)) {
      flags.ghl = true;
      evidence.push(`ghl: ${rel}`);
    }
    if (/!leadRes\.ok[\s\S]{0,80}throw/.test(t)) {
      flags.leadGateThrow = true;
      evidence.push(`leadGateThrow: ${rel}`);
    }
    if (
      /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t) &&
      /if\s*\(\s*!(?:res|apiRes|response)\.ok/.test(t) &&
      !/\/api\/(?:contact|instruct|docket|retain|submit-contact)/.test(t) &&
      !/continuing|console\.warn/i.test(t)
    ) {
      flags.soleLeadHard = true;
      evidence.push(`soleLeadHard: ${rel}`);
    }
  }

  let cls = "NEEDS_MANUAL";
  if (flags.leadGateThrow && !flags.softLead) cls = "TOTAL_LOSS";
  else if (flags.soleLeadHard && !flags.softLead && !flags.contactThenLead && !flags.ghl)
    cls = "TOTAL_LOSS_MAYBE";
  else if (flags.contactThenLead || flags.softLead || flags.ghl || flags.sheetsInActions)
    cls = "SHEETS_OK";

  console.log(JSON.stringify({ repo, cls, flags, evidence: evidence.slice(0, 6) }));
}
