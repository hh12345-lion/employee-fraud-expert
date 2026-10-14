/**
 * Verify all LEAD-N8N-FAILURES repos: outbound message wiring + no truncated Netlify crashes.
 * Read-only checks.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";

const EMPTY = [
  "asia-court-reports",
  "asylum-court-reports",
  "asylum-expert-witness-org",
  "business-interruption-expert",
  "business-valuation-expert",
  "case-boost",
  "damages-expert-loss",
  "dispute-forensic",
  "redd-growth",
  "warranty-claim-expert",
];

const CRASH = [
  "employment-loss-expert",
  "future-earnings-expert",
  "juris-country-experts",
];

const SILENT = [
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

const ALL = [...EMPTY, ...CRASH, ...SILENT];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (["node_modules", ".git", ".next", "dist", "out"].includes(ent.name)) continue;
      walk(p, acc);
    } else if (/\.(js|cjs|ts|tsx)$/.test(ent.name)) {
      acc.push(p);
    }
  }
  return acc;
}

const issues = [];
const ok = [];

for (const name of ALL) {
  const project = path.join(ROOT, name);
  if (!fs.existsSync(project)) {
    issues.push({ name, issue: "repo_missing" });
    continue;
  }

  const netlifyCandidates = [
    "netlify/functions/submit-lead.js",
    "netlify/functions/submit-lead.cjs",
    "netlify/functions/ghl-webhook.cjs",
    "netlify/functions/ghl-webhook.js",
  ];

  let netlifyOk = true;
  for (const rel of netlifyCandidates) {
    const fp = path.join(project, rel);
    if (!fs.existsSync(fp)) continue;
    const t = fs.readFileSync(fp, "utf8");
    // Truncation heuristics
    if (
      /exports\.handler|export\s+(?:async\s+)?function\s+handler|export\s+const\s+handler/.test(t) &&
      /parseLead\(|postToWebhook\(|writeToSheets\(|jsonResponse\(/.test(t) &&
      !/function\s+parseLead|function\s+postToWebhook|function\s+writeToSheets|function\s+jsonResponse|const\s+jsonResponse/.test(t)
    ) {
      // call without definition
      if (/parseLead\(/.test(t) && !/function\s+parseLead/.test(t)) {
        issues.push({ name, issue: "truncated_parseLead", file: rel });
        netlifyOk = false;
      }
      if (/postToWebhook\(/.test(t) && !/function\s+postToWebhook|async function\s+postToWebhook/.test(t)) {
        issues.push({ name, issue: "truncated_postToWebhook", file: rel });
        netlifyOk = false;
      }
      if (/jsonResponse\(/.test(t) && !/function\s+jsonResponse|const\s+jsonResponse/.test(t)) {
        issues.push({ name, issue: "truncated_jsonResponse", file: rel });
        netlifyOk = false;
      }
    }

    if (rel.includes("submit-lead") || rel.includes("ghl-webhook")) {
      // outbound should mention message key for n8n
      const hasOutboundMessage =
        /message\s*:/.test(t) ||
        /\n\s*message,\s*\n/.test(t) ||
        /["']message["']\s*:/.test(t);
      if (!hasOutboundMessage && /Brand name|Full Name/.test(t)) {
        issues.push({ name, issue: "netlify_no_message_in_outbound", file: rel });
        netlifyOk = false;
      }
    }

    if (rel.includes("submit-lead") && !/\bexport\s|\bimport\s/.test(t)) {
      try {
        new Function(t.replace(/^\uFEFF/, ""));
      } catch (e) {
        issues.push({ name, issue: `syntax:${e.message}`, file: rel });
        netlifyOk = false;
      }
    }
  }

  // Forms: look for submit-lead bodies that only send name/email/phone (no message)
  const formFiles = walk(project).filter((p) =>
    /Form\.(tsx|ts|jsx|js)$|contact\/actions\.(ts|tsx)$|ghl-webhook/i.test(p)
  );

  let formSendsMessage = false;
  let formHitsSubmitLead = false;
  let voidFetchFound = false;

  for (const fp of formFiles) {
    const t = fs.readFileSync(fp, "utf8");
    if (/\/api\/submit-lead|submitLeadToWebhook|notifyLeadWebhook|postSubmitLead|notifyLeadSubmission|postLeadNotification|postLeadToWebhook|ghl-webhook/.test(t)) {
      formHitsSubmitLead = true;
      if (
        /message\s*:/.test(t) ||
        /message:\s*(?:data\.|String\(|payload\.|parsed\.|values\.|fd\.|formData)/.test(t) ||
        /JSON\.stringify\(\s*\{[^}]*message/.test(t) ||
        /\.\.\.data/.test(t) // spread often includes message
      ) {
        formSendsMessage = true;
      }
      // Detect remaining void fetch to submit-lead
      if (/void\s+fetch\s*\(\s*['"`]\/api\/submit-lead/.test(t) ||
          /void\s+fetch\s*\(\s*['"`][^'"`]*submit-lead/.test(t)) {
        voidFetchFound = true;
      }
      if (/void\s+(?:notifyLeadWebhook|postSubmitLead|submitLeadNotification|notifyLeadSubmission|postLeadNotification)\s*\(/.test(t)) {
        voidFetchFound = true;
      }
    }
  }

  // Server actions / processEnquiry paths
  const serverFiles = walk(path.join(project, "src")).concat(walk(path.join(project, "app"))).concat(walk(path.join(project, "lib")));
  for (const fp of serverFiles.slice(0, 400)) {
    const t = fs.readFileSync(fp, "utf8");
    if (/submitLeadToWebhook|notifyLeadWebhook|buildLeadWebhookPayload|postLeadToWebhook/.test(t)) {
      if (/message\s*:/.test(t)) formSendsMessage = true;
    }
  }

  if (CRASH.includes(name) && !netlifyOk) {
    // already recorded
  } else if (EMPTY.includes(name) && formHitsSubmitLead && !formSendsMessage) {
    // check netlify/ghl has message from body at least
    const stillBad = !fs
      .readdirSync(path.join(project, "netlify", "functions"), { withFileTypes: true })
      .some((e) => {
        if (!e.isFile()) return false;
        const t = fs.readFileSync(path.join(project, "netlify", "functions", e.name), "utf8");
        return /message\s*:/.test(t);
      });
    // also check lib
    const libHas =
      walk(path.join(project, "lib")).concat(walk(path.join(project, "src", "lib"))).some((fp) => {
        const t = fs.readFileSync(fp, "utf8");
        return /message\s*:/.test(t) && /Brand name|Full Name|LeadWebhook|submitLead/.test(t);
      });
    if (stillBad && !libHas && !formSendsMessage) {
      issues.push({ name, issue: "empty_message_still_likely" });
    }
  }

  if (voidFetchFound) {
    issues.push({ name, issue: "still_void_fetch_submit_lead" });
  }

  if (!issues.some((i) => i.name === name)) ok.push(name);
}

console.log(
  JSON.stringify(
    {
      total: ALL.length,
      okCount: ok.length,
      issueCount: issues.length,
      issues,
    },
    null,
    2
  )
);
