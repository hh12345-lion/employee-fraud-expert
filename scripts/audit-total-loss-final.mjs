/**
 * Definitive TOTAL_LOSS audit — hand-verified patterns only.
 * Writes LEAD-TOTAL-LOSS-AUDIT.md
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";

const REPOS = [
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
  "employment-loss-expert",
  "future-earnings-expert",
  "juris-country-experts",
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

function read(fp) {
  try {
    return fs.readFileSync(fp, "utf8");
  } catch {
    return "";
  }
}

function findLiveSubmitLead(project) {
  const toml = read(path.join(project, "netlify.toml"));
  let redirect = false;
  const lines = toml.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#")) continue;
    if (/from\s*=\s*["']\/api\/submit-lead["']/.test(line)) {
      const w = lines.slice(i, i + 6).join("\n");
      if (/to\s*=\s*["']\/\.netlify\/functions\/submit-lead/.test(w)) redirect = true;
    }
  }
  const nextPaths = ["app/api/submit-lead/route.ts", "src/app/api/submit-lead/route.ts"];
  const nfPaths = ["netlify/functions/submit-lead.js", "netlify/functions/submit-lead.cjs"];
  let next = null;
  let nf = null;
  for (const r of nextPaths) {
    if (fs.existsSync(path.join(project, r))) next = { rel: r, text: read(path.join(project, r)) };
  }
  for (const r of nfPaths) {
    if (fs.existsSync(path.join(project, r))) nf = { rel: r, text: read(path.join(project, r)) };
  }
  return redirect ? nf : next || nf;
}

function hasSheets(t) {
  return /appendRow|appendLead|writeToSheets|writeLeadToSheet|appendContactToSheet|spreadsheets\.values\.append|softFailAppendSheet|writeSubmissionToSheet/i.test(
    t || ""
  );
}

function webhookHardBeforeSheets(t) {
  if (!t || !hasSheets(t)) return false;
  if (
    /notifyLeadWebhook[\s\S]{0,500}if\s*\(\s*!webhookOk\s*\)[\s\S]{0,300}return[\s\S]{0,200}502[\s\S]{0,600}(writeSubmissionToSheet|appendContactToSheet|softFailAppendSheet)/.test(
      t
    )
  )
    return true;
  if (
    /if\s*\(\s*["']error["']\s+in\s+result\s*\)[\s\S]{0,500}return[\s\S]{0,400}softFailAppendSheet/.test(
      t
    )
  )
    return true;
  const sheetsIdx = t.search(
    /softFailAppendSheet|appendLeadToGoogleSheet|writeSubmissionToSheet|appendContactToSheet|writeLeadToSheetSafely|writeToSheets\(/
  );
  const m = t.match(
    /if\s*\(\s*!webhookOk\s*\)[\s\S]{0,250}return[\s\S]{0,150}502|if\s*\(\s*["']error["']\s+in\s+result\s*\)[\s\S]{0,300}return/
  );
  const orSuccess = /!forwarded\s*&&\s*!writtenToSheet|!webhookOk\s*&&\s*!sheetsOk|!sheetsOk\s*&&\s*!webhookOk/.test(
    t
  );
  return Boolean(m && sheetsIdx >= 0 && m.index < sheetsIdx && !orSuccess);
}

function isTruncatedNetlifyJs(t) {
  if (!t) return false;
  if (/\bimport\s|\bexport\s/.test(t)) return false;
  if (/jsonResponse\s*\(/.test(t) && !/function\s+jsonResponse|const\s+jsonResponse\s*=/.test(t))
    return true;
  if (/parseLead\s*\(/.test(t) && !/function\s+parseLead/.test(t)) return true;
  if (/getSiteDomain\s*\(/.test(t) && !/function\s+getSiteDomain/.test(t)) return true;
  if (/\bBRAND_NAME\b/.test(t) && !/const\s+BRAND_NAME|let\s+BRAND_NAME|var\s+BRAND_NAME/.test(t))
    return true;
  try {
    new Function(t.replace(/^\uFEFF/, ""));
  } catch {
    return true;
  }
  return false;
}

function analyzeForms(project) {
  const files = walk(project);
  const out = {
    leadGateBeforeSheets: [], // TOTAL_LOSS form pattern
    contactFirst: [],
    soleLeadHardBlock: [],
    voidOrSoftLead: [],
    ghlPrimary: false,
  };

  for (const fp of files) {
    if (!/Form|contact-form|Intake|LeadForm|actions\.ts/i.test(path.basename(fp))) continue;
    const t = read(fp);
    if (!t) continue;
    const rel = path.relative(project, fp).replace(/\\/g, "/");

    // Pattern A: await submit-lead → !ok throw/return → then contact/request/instruct
    if (
      /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead[\s\S]{0,900}if\s*\(\s*!(?:leadRes|res|apiRes|response)\.ok\s*\)\s*(?:throw|return)[\s\S]{0,500}\/api\/(?:contact|request|instruct|docket|retain)/.test(
        t
      )
    ) {
      out.leadGateBeforeSheets.push(rel);
    }

    // Pattern A2: leadRes.ok throw specifically then contact
    if (
      /!leadRes\.ok[\s\S]{0,200}throw[\s\S]{0,400}\/api\/(?:contact|request|instruct)/.test(t)
    ) {
      if (!out.leadGateBeforeSheets.includes(rel)) out.leadGateBeforeSheets.push(rel);
    }

    // contact/docket/retain/ghl before submit-lead in source
    const cIdx = t.search(/\/api\/(?:contact|instruct|docket|retain|submit-contact|ghl-webhook)/);
    const lIdx = t.search(/\/api\/submit-lead/);
    if (cIdx >= 0 && lIdx >= 0 && cIdx < lIdx) {
      out.contactFirst.push(rel);
    }

    // sole lead hard block (no contact API in same handler region)
    if (
      /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t) &&
      /if\s*\(\s*!(?:res|apiRes|leadRes|response)\.ok/.test(t) &&
      !/\/api\/(?:contact|instruct|docket|retain|submit-contact|ghl-webhook)/.test(t)
    ) {
      out.soleLeadHardBlock.push(rel);
    }

    if (
      (/void\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t) ||
        (/submitLeadNotification\s*\(/.test(t) && !/await\s+submitLeadNotification/.test(t))) &&
      !/await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t)
    ) {
      out.voidOrSoftLead.push(rel);
    }

    // soft continue language after lead fail
    if (
      /submit-lead[\s\S]{0,200}continuing|Lead webhook notification failed; continuing|non-OK; continuing/i.test(
        t
      )
    ) {
      out.voidOrSoftLead.push(rel + " (soft-continue)");
    }

    if (/ghl-webhook/.test(t) && /ghlRes|CRM sync/.test(t)) out.ghlPrimary = true;
  }

  return out;
}

const TOTAL_LOSS = [];
const FORM_FAIL_SHEETS_OK = [];
const SHEETS_OK = [];
const NEEDS_MANUAL = [];

for (const repo of REPOS) {
  const project = path.join(ROOT, repo);
  if (!fs.existsSync(project)) {
    NEEDS_MANUAL.push({ repo, reason: "repo missing on disk" });
    continue;
  }

  const live = findLiveSubmitLead(project);
  const liveText = live?.text || "";
  const truncated = live ? isTruncatedNetlifyJs(liveText) : false;
  const sheetsInLive = hasSheets(liveText);
  const hardBefore = webhookHardBeforeSheets(liveText);
  const orSuccess = /!forwarded\s*&&\s*!writtenToSheet|!webhookOk\s*&&\s*!sheetsOk|!sheetsOk\s*&&\s*!webhookOk/.test(
    liveText
  );
  const forms = analyzeForms(project);

  let classification;
  let reason;
  let evidence = [];

  if (forms.leadGateBeforeSheets.length) {
    classification = "TOTAL_LOSS";
    reason =
      "Form requires /api/submit-lead OK before calling contact/request (Sheets). n8n fail ⇒ no Sheets row.";
    evidence = forms.leadGateBeforeSheets;
  } else if (forms.soleLeadHardBlock.length && hardBefore) {
    classification = "TOTAL_LOSS";
    reason = `Form sole-gates on submit-lead; live handler hard-fails webhook BEFORE Sheets (${live?.rel}).`;
    evidence = forms.soleLeadHardBlock;
  } else if (forms.soleLeadHardBlock.length && !sheetsInLive && live) {
    classification = "TOTAL_LOSS";
    reason = `Form sole-gates on webhook-only submit-lead (${live.rel}); fail ⇒ nothing persisted.`;
    evidence = forms.soleLeadHardBlock;
  } else if (truncated && (forms.soleLeadHardBlock.length || forms.leadGateBeforeSheets.length)) {
    classification = "TOTAL_LOSS";
    reason = `Truncated Netlify submit-lead + form requires it (${live?.rel}).`;
  } else if (forms.contactFirst.length && forms.soleLeadHardBlock.length) {
    classification = "FORM_FAIL_SHEETS_OK";
    reason = "Contact/Sheets first; submit-lead may still error UI after row exists.";
    evidence = forms.contactFirst;
  } else if (
    forms.contactFirst.length ||
    forms.voidOrSoftLead.length ||
    forms.ghlPrimary ||
    (sheetsInLive && orSuccess) ||
    (sheetsInLive && !hardBefore && !forms.soleLeadHardBlock.length)
  ) {
    classification = "SHEETS_OK";
    reason = forms.contactFirst.length
      ? "Contact/CRM/Sheets path succeeds independent of (or before soft) submit-lead"
      : forms.ghlPrimary
        ? "GHL primary success gate"
        : forms.voidOrSoftLead.length
          ? "Lead notify soft/void/continue"
          : orSuccess
            ? `Live handler returns OK if Sheets OR webhook (${live?.rel})`
            : `Sheets in live handler without webhook-before-Sheets hard fail (${live?.rel || "n/a"})`;
    evidence = [
      ...forms.contactFirst,
      ...forms.voidOrSoftLead,
      ...(live ? [live.rel] : []),
    ];
  } else {
    classification = "NEEDS_MANUAL";
    reason = `unclear — live=${live?.rel || "none"} sheets=${sheetsInLive} hardBefore=${hardBefore} sole=${forms.soleLeadHardBlock.length} contactFirst=${forms.contactFirst.length}`;
  }

  const row = {
    repo,
    classification,
    reason,
    live: live?.rel || null,
    truncated,
    sheetsInLive,
    hardBefore,
    orSuccess,
    evidence,
  };

  if (classification === "TOTAL_LOSS") TOTAL_LOSS.push(row);
  else if (classification === "FORM_FAIL_SHEETS_OK") FORM_FAIL_SHEETS_OK.push(row);
  else if (classification === "SHEETS_OK") SHEETS_OK.push(row);
  else NEEDS_MANUAL.push(row);
}

// Hand overrides from file reads this session
const HAND = {
  "damages-expert-loss": {
    classification: "TOTAL_LOSS",
    reason:
      "HAND-READ: src/app/api/submit-lead/route.ts — notifyLeadWebhook; if (!webhookOk) return 502; Sheets append only after. Form awaits + !res.ok blocks thank-you.",
  },
  "business-valuation-expert": {
    classification: "TOTAL_LOSS",
    reason:
      "HAND-READ: app/api/submit-lead/route.ts — if (\"error\" in result) return 502/503 BEFORE softFailAppendSheet. Form awaits submit-lead for thank-you.",
  },
  "asylum-court-reports": {
    classification: "TOTAL_LOSS",
    reason:
      "HAND-READ: ContactForm + RequestForm await submit-lead, throw if !ok, only then /api/contact or /api/request (Sheets).",
  },
  "asylum-expert-witness-org": {
    classification: "TOTAL_LOSS",
    reason:
      "HAND-READ: ContactForm awaits submit-lead, throw if !ok, only then fire-and-forget /api/contact (Sheets).",
  },
  "dispute-forensic": {
    classification: "SHEETS_OK",
    reason:
      "HAND-READ: Next submit-lead writes Sheets first; succeeds if sheets OR webhook. n8n-only fail still returns 200 with Sheets row.",
  },
  "business-interruption-expert": {
    classification: "SHEETS_OK",
    reason:
      "HAND-READ: Next submit-lead tries Sheets after webhook; returns 200 if webhookOk OR sheetsOk. n8n-only fail still writes Sheets.",
  },
  "employment-loss-expert": {
    classification: "SHEETS_OK",
    reason:
      "HAND-READ: Netlify fn writes Sheets first then webhook; 200 if either OK. Form hard-blocks only when both fail.",
  },
  "warranty-claim-expert": {
    classification: "SHEETS_OK",
    reason:
      "HAND-READ: Next submit-lead soft-fails webhook then Sheets; 200 if either OK.",
  },
  "country-expert-insights": {
    classification: "SHEETS_OK",
    reason:
      "HAND-READ: submit-lead failure only console.warn; /api/contact (Sheets) is the success gate.",
  },
  "accounting-expert-witness": {
    classification: "SHEETS_OK",
    reason:
      "HAND-READ: /api/contact first (Sheets); then await notifyLeadWebhook. Sheets already written if lead notify fails.",
  },
  "business-valuation-expert-witness": {
    classification: "SHEETS_OK",
    reason:
      "HAND-READ: submit-lead non-OK continues to Sheets intake action.",
  },
  "randd": {
    classification: "SHEETS_OK",
    reason:
      "HAND-READ: /api/submit-contact first; submit-lead soft after CRM success.",
  },
};

function moveTo(bucket, row) {
  for (const arr of [TOTAL_LOSS, FORM_FAIL_SHEETS_OK, SHEETS_OK, NEEDS_MANUAL]) {
    const i = arr.findIndex((r) => r.repo === row.repo);
    if (i >= 0) arr.splice(i, 1);
  }
  bucket.push(row);
}

for (const [repo, info] of Object.entries(HAND)) {
  const project = path.join(ROOT, repo);
  const live = findLiveSubmitLead(project);
  const base = {
    repo,
    classification: info.classification,
    reason: info.reason,
    live: live?.rel || null,
    truncated: false,
    sheetsInLive: hasSheets(live?.text || ""),
    hardBefore: webhookHardBeforeSheets(live?.text || ""),
    orSuccess: /!forwarded\s*&&\s*!writtenToSheet|!webhookOk\s*&&\s*!sheetsOk/.test(live?.text || ""),
    evidence: ["hand-read"],
  };
  if (info.classification === "TOTAL_LOSS") moveTo(TOTAL_LOSS, base);
  else if (info.classification === "FORM_FAIL_SHEETS_OK") moveTo(FORM_FAIL_SHEETS_OK, base);
  else moveTo(SHEETS_OK, base);
}

// Deduplicate by repo (keep last)
function dedupe(arr) {
  const map = new Map();
  for (const r of arr) map.set(r.repo, r);
  return [...map.values()].sort((a, b) => a.repo.localeCompare(b.repo));
}

const totalLoss = dedupe(TOTAL_LOSS);
const formFail = dedupe(FORM_FAIL_SHEETS_OK);
const sheetsOk = dedupe(SHEETS_OK);
const needsManual = dedupe(NEEDS_MANUAL).filter(
  (r) => !totalLoss.some((t) => t.repo === r.repo) && !sheetsOk.some((t) => t.repo === r.repo) && !formFail.some((t) => t.repo === r.repo)
);

const out = {
  counts: {
    TOTAL_LOSS: totalLoss.length,
    FORM_FAIL_SHEETS_OK: formFail.length,
    SHEETS_OK: sheetsOk.length,
    NEEDS_MANUAL: needsManual.length,
  },
  TOTAL_LOSS: totalLoss,
  FORM_FAIL_SHEETS_OK: formFail,
  NEEDS_MANUAL: needsManual,
  SHEETS_OK: sheetsOk.map((r) => ({ repo: r.repo, reason: r.reason })),
};

console.log(JSON.stringify(out, null, 2));

const md = `# Lead TOTAL_LOSS audit

**Definition:** broken n8n / \`submit-lead\` path ⇒ visitor gets form error **and** Google Sheets gets no row.

## Counts (58 failure-list repos)

| Class | Count |
|-------|------:|
| **TOTAL_LOSS** | ${totalLoss.length} |
| FORM_FAIL_SHEETS_OK | ${formFail.length} |
| SHEETS_OK | ${sheetsOk.length} |
| NEEDS_MANUAL | ${needsManual.length} |

## TOTAL_LOSS (${totalLoss.length}) — Sheets also empty

${totalLoss
  .map(
    (r) => `### ${r.repo}
- ${r.reason}
- live: \`${r.live || "n/a"}\``
  )
  .join("\n\n")}

## Code patterns that cause TOTAL_LOSS

1. **Webhook-before-Sheets hard fail** in live \`submit-lead\` (returns 502 before append).
2. **Form lead-gates-Sheets** — \`await /api/submit-lead\` + throw on \`!ok\` *before* \`/api/contact\` (or request) that owns Sheets.

## FORM_FAIL_SHEETS_OK

${formFail.map((r) => `- **${r.repo}** — ${r.reason}`).join("\n") || "_None._"}

## NEEDS_MANUAL (not auto-proven)

${needsManual.map((r) => `- **${r.repo}** — ${r.reason}`).join("\n") || "_None._"}

## SHEETS_OK (${sheetsOk.length})

n8n/submit-lead can fail without losing the Sheets (or CRM) row:

${sheetsOk.map((r) => `- **${r.repo}** — ${r.reason}`).join("\n")}
`;

fs.writeFileSync(path.join(ROOT, "employee-fraud-expert", "LEAD-TOTAL-LOSS-AUDIT.md"), md);
console.error("Wrote LEAD-TOTAL-LOSS-AUDIT.md");
