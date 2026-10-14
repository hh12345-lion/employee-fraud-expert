/**
 * Definitive TOTAL_LOSS scan:
 * Find forms where /api/submit-lead must succeed BEFORE /api/contact (or sheets),
 * OR live submit-lead hard-fails webhook before Sheets append.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const REPOS = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "employee-fraud-expert", "scripts", "audit-total-lead-loss.mjs"),
    "utf8"
  ).match(/const REPOS = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"')
);

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

function findLiveHandler(project) {
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
  const nextCands = ["app/api/submit-lead/route.ts", "src/app/api/submit-lead/route.ts"];
  const nfCands = ["netlify/functions/submit-lead.js", "netlify/functions/submit-lead.cjs"];
  let next = null;
  let nf = null;
  for (const r of nextCands) {
    const fp = path.join(project, r);
    if (fs.existsSync(fp)) next = { rel: r, text: read(fp) };
  }
  for (const r of nfCands) {
    const fp = path.join(project, r);
    if (fs.existsSync(fp)) nf = { rel: r, text: read(fp) };
  }
  const live = redirect ? nf : next || nf;
  return { live, redirect, next, nf };
}

function hasSheets(t) {
  return /appendRow|appendLead|writeToSheets|writeLeadToSheet|appendContactToSheet|spreadsheets\.values\.append|softFailAppendSheet|writeSubmissionToSheet|append.*ToSheet/i.test(
    t || ""
  );
}

function webhookHardBeforeSheets(t) {
  if (!t || !hasSheets(t)) return false;
  // damages: notify then if (!webhookOk) return 502 then sheets
  if (
    /notifyLeadWebhook[\s\S]{0,400}if\s*\(\s*!webhookOk\s*\)[\s\S]{0,250}return[\s\S]{0,150}502[\s\S]{0,500}(writeSubmissionToSheet|appendContactToSheet|softFailAppendSheet|appendLead)/.test(
      t
    )
  )
    return true;
  // valuation: if ("error" in result) return ... then softFailAppendSheet
  if (
    /if\s*\(\s*["']error["']\s+in\s+result\s*\)[\s\S]{0,400}return[\s\S]{0,300}(status:\s*result\.status|result\.status)[\s\S]{0,800}softFailAppendSheet/.test(
      t
    )
  )
    return true;
  // generic: early 502 return index < sheets call index, and no OR success
  const sheetsIdx = t.search(
    /softFailAppendSheet|appendLeadToGoogleSheet|writeSubmissionToSheet|appendContactToSheet|writeLeadToSheet|writeToSheets\(/
  );
  const early = t.match(
    /if\s*\(\s*!webhookOk\s*\)[\s\S]{0,200}return[\s\S]{0,120}502|if\s*\(\s*["']error["']\s+in\s+result\s*\)[\s\S]{0,250}return/
  );
  const orSuccess =
    /!forwarded\s*&&\s*!writtenToSheet|!webhookOk\s*&&\s*!sheetsOk|!sheetsOk\s*&&\s*!webhookOk/.test(
      t
    );
  if (early && sheetsIdx >= 0 && early.index < sheetsIdx && !orSuccess) return true;
  return false;
}

function isTruncatedNetlify(t) {
  if (!t || /\bimport\s|\bexport\s/.test(t)) return false; // TS/ESM routes — skip
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

const totalLoss = [];
const formFailSheetsOk = [];
const sheetsOk = [];
const manual = [];

for (const repo of REPOS) {
  const project = path.join(ROOT, repo);
  if (!fs.existsSync(project)) {
    manual.push({ repo, reason: "missing" });
    continue;
  }

  const { live } = findLiveHandler(project);
  const liveText = live?.text || "";
  const truncated = live ? isTruncatedNetlify(liveText) : false;
  const sheetsInLive = hasSheets(liveText);
  const hardBefore = webhookHardBeforeSheets(liveText);
  const webhookOnly = Boolean(live) && !sheetsInLive;

  const files = walk(project);
  const formFiles = files.filter((p) =>
    /Form|contact-form|Intake|LeadForm/i.test(path.basename(p))
  );

  let evidence = [];
  let leadGatesBeforeContact = false; // TOTAL_LOSS pattern
  let contactGatesBeforeLead = false; // SHEETS_OK / FORM_FAIL
  let soleLeadHardBlock = false;
  let voidLead = false;
  let ghlPrimary = false;
  let softLead = false;

  for (const fp of formFiles) {
    const t = read(fp);
    if (!/submit-lead|submitLead|notifyLead|\/api\/contact|ghl-webhook/.test(t)) continue;
    const rel = path.relative(project, fp).replace(/\\/g, "/");

    // lead must ok then contact
    if (
      /\/api\/submit-lead[\s\S]{0,600}if\s*\(\s*!(?:leadRes|res|apiRes|response)\.ok[\s\S]{0,400}\/api\/(?:contact|instruct|docket|retain)/.test(
        t
      ) ||
      /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead[\s\S]{0,500}if\s*\(\s*!leadRes\.ok[\s\S]{0,300}throw[\s\S]{0,200}\/api\/contact/.test(
        t
      )
    ) {
      leadGatesBeforeContact = true;
      evidence.push(`${rel}: submit-lead OK required before contact/sheets`);
    }

    // contact first then lead
    if (
      /\/api\/(?:contact|instruct|docket|retain)[\s\S]{0,800}\/api\/submit-lead/.test(t) ||
      /await\s+fetch\s*\(\s*[`'"]\/api\/(?:contact|instruct|docket|retain)[\s\S]{0,500}if\s*\(\s*!(?:res|response)\.ok[\s\S]{0,400}\/api\/submit-lead/.test(
        t
      )
    ) {
      const c = t.search(/\/api\/(?:contact|instruct|docket|retain)/);
      const l = t.search(/\/api\/submit-lead/);
      if (c >= 0 && l >= 0 && c < l) {
        contactGatesBeforeLead = true;
        evidence.push(`${rel}: contact/sheets before submit-lead`);
      }
    }

    if (
      /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead[\s\S]{0,500}if\s*\(\s*!(?:res|apiRes|leadRes|response)\.ok/.test(
        t
      ) &&
      !/\/api\/(?:contact|instruct|docket|retain|ghl-webhook)/.test(
        t.slice(0, t.search(/\/api\/submit-lead/) + 800)
      )
    ) {
      // sole path if no contact in file or contact only after lead ok
      if (!contactGatesBeforeLead) {
        soleLeadHardBlock = true;
        evidence.push(`${rel}: hard-block on submit-lead`);
      }
    }

    if (
      /void\s+fetch\s*\(\s*[`'"]\/api\/submit-lead|submitLeadNotification\s*\(/.test(t) &&
      !/await\s+submitLeadNotification/.test(t) &&
      !/await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t)
    ) {
      voidLead = true;
      evidence.push(`${rel}: void/fire-and-forget lead`);
    }

    if (/ghl-webhook/.test(t) && /ghlRes|CRM sync/.test(t)) {
      ghlPrimary = true;
      evidence.push(`${rel}: GHL primary`);
    }

    if (/Secondary lead|don't block|do not block|soft/i.test(t) && /submit-lead/.test(t)) {
      softLead = true;
    }
  }

  let classification;
  let reason;

  if (truncated && (soleLeadHardBlock || leadGatesBeforeContact)) {
    classification = "TOTAL_LOSS";
    reason = `Truncated Netlify submit-lead; form requires it → crash loses Sheets too (${live?.rel})`;
  } else if (leadGatesBeforeContact) {
    classification = "TOTAL_LOSS";
    reason =
      "Form requires submit-lead OK before calling contact/Sheets — n8n/webhook fail = no Sheets row";
  } else if ((soleLeadHardBlock || (!contactGatesBeforeLead && soleLeadHardBlock)) && hardBefore) {
    classification = "TOTAL_LOSS";
    reason = `Live handler returns error on webhook fail BEFORE Sheets write (${live?.rel})`;
  } else if (soleLeadHardBlock && webhookOnly) {
    classification = "TOTAL_LOSS";
    reason = `Form sole-gates on webhook-only submit-lead; no Sheets in live handler (${live?.rel})`;
  } else if (soleLeadHardBlock && hardBefore) {
    classification = "TOTAL_LOSS";
    reason = `Form gates on submit-lead; webhook-before-Sheets hard fail (${live?.rel})`;
  } else if (contactGatesBeforeLead && soleLeadHardBlock) {
    classification = "FORM_FAIL_SHEETS_OK";
    reason = "Sheets via contact first; submit-lead fail may still error UI";
  } else if (contactGatesBeforeLead || voidLead || ghlPrimary || softLead) {
    classification = "SHEETS_OK";
    reason = contactGatesBeforeLead
      ? "Contact/Sheets succeeds before/independent of submit-lead"
      : ghlPrimary
        ? "GHL primary"
        : "Lead soft/void";
  } else if (sheetsInLive && !hardBefore && !soleLeadHardBlock) {
    classification = "SHEETS_OK";
    reason = `Sheets in live handler without hard-before-sheets; form soft or non-blocking (${live?.rel})`;
  } else if (sheetsInLive && !hardBefore) {
    // form may hard block but handler returns 200 if sheets ok
    const orOk =
      /!forwarded\s*&&\s*!writtenToSheet|!webhookOk\s*&&\s*!sheetsOk|!sheetsOk\s*&&\s*!webhookOk/.test(
        liveText
      );
    if (orOk || /sheetsOk|writtenToSheet/.test(liveText)) {
      classification = "SHEETS_OK";
      reason = `Live handler can return 200 when Sheets succeeds even if webhook fails (${live?.rel})`;
    } else {
      classification = "NEEDS_MANUAL";
      reason = `sheets in live but form/handler coupling unclear (${live?.rel})`;
    }
  } else {
    classification = "NEEDS_MANUAL";
    reason = `unclear live=${live?.rel || "none"} webhookOnly=${webhookOnly} sole=${soleLeadHardBlock} contactFirst=${contactGatesBeforeLead}`;
  }

  const row = { repo, classification, reason, live: live?.rel || null, truncated, sheetsInLive, hardBefore, evidence };

  if (classification === "TOTAL_LOSS") totalLoss.push(row);
  else if (classification === "FORM_FAIL_SHEETS_OK") formFailSheetsOk.push(row);
  else if (classification === "SHEETS_OK") sheetsOk.push(row);
  else manual.push(row);
}

// Force-confirm known hand-verified
const confirmed = {
  "damages-expert-loss":
    "HAND-VERIFIED: notifyLeadWebhook → if (!webhookOk) return 502 → Sheets only after; form awaits + !res.ok blocks thank-you",
  "business-valuation-expert":
    "HAND-VERIFIED: if (\"error\" in result) return 502/503 BEFORE softFailAppendSheet; form awaits submit-lead for thank-you",
  "asylum-court-reports":
    "HAND-VERIFIED: ContactForm awaits submit-lead, throws if !ok, only then fire-and-forget /api/contact (Sheets)",
};

for (const [repo, why] of Object.entries(confirmed)) {
  const existing = totalLoss.find((r) => r.repo === repo);
  if (!existing) {
    // move from other buckets
    for (const arr of [sheetsOk, formFailSheetsOk, manual]) {
      const i = arr.findIndex((r) => r.repo === repo);
      if (i >= 0) arr.splice(i, 1);
    }
    totalLoss.push({
      repo,
      classification: "TOTAL_LOSS",
      reason: why,
      live: findLiveHandler(path.join(ROOT, repo)).live?.rel,
      truncated: false,
      sheetsInLive: repo !== "asylum-court-reports",
      hardBefore: repo !== "asylum-court-reports",
      evidence: ["hand-verified"],
    });
  } else {
    existing.reason = why;
    existing.evidence = ["hand-verified", ...(existing.evidence || [])];
  }
}

// Remove false TOTAL_LOSS if hand-verified as OK
const falsePositives = ["dispute-forensic"]; // sheets first + OR success
for (const repo of falsePositives) {
  const i = totalLoss.findIndex((r) => r.repo === repo);
  if (i >= 0) {
    const row = totalLoss.splice(i, 1)[0];
    row.classification = "SHEETS_OK";
    row.reason =
      "HAND-VERIFIED: Next submit-lead writes Sheets first, succeeds if sheets OR webhook; form hard-blocks only on both failing";
    sheetsOk.push(row);
  }
}

const out = {
  counts: {
    TOTAL_LOSS: totalLoss.length,
    FORM_FAIL_SHEETS_OK: formFailSheetsOk.length,
    SHEETS_OK: sheetsOk.length,
    NEEDS_MANUAL: manual.length,
  },
  TOTAL_LOSS: totalLoss,
  FORM_FAIL_SHEETS_OK: formFailSheetsOk,
  NEEDS_MANUAL: manual,
  SHEETS_OK: sheetsOk.map((r) => r.repo),
};

console.log(JSON.stringify(out, null, 2));

const md = `# Lead TOTAL_LOSS audit (evidence)

**Question:** which failure repos break form submission so badly that Google Sheets also gets nothing?

## Verdict

| Class | Count | Meaning |
|-------|------:|---------|
| **TOTAL_LOSS** | ${totalLoss.length} | n8n/submit-lead fail ⇒ form error **and** no Sheets row |
| FORM_FAIL_SHEETS_OK | ${formFailSheetsOk.length} | form may error; Sheets already has row |
| SHEETS_OK | ${sheetsOk.length} | Sheets/CRM still get the lead if n8n fails |
| NEEDS_MANUAL | ${manual.length} | pattern not auto-proven (see list) |

## TOTAL_LOSS — hand-verified where marked

${totalLoss
  .map(
    (r) => `### ${r.repo}
- ${r.reason}
- live handler: \`${r.live || "n/a"}\`
- evidence: ${(r.evidence || []).join("; ") || "classifier"}`
  )
  .join("\n\n")}

## How TOTAL_LOSS happens (code patterns)

1. **Webhook-before-Sheets hard fail** — \`submit-lead\` returns 502 on n8n failure *before* appending Sheets (\`damages-expert-loss\`, \`business-valuation-expert\`).
2. **Lead-gates-contact** — form \`await\`s \`/api/submit-lead\`, throws on \`!ok\`, only then calls \`/api/contact\` which owns Sheets (\`asylum-court-reports\`).

## FORM_FAIL_SHEETS_OK

${formFailSheetsOk.map((r) => `- **${r.repo}** — ${r.reason}`).join("\n") || "_None auto-classified._"}

## NEEDS_MANUAL

${manual.map((r) => `- **${r.repo}** — ${r.reason}`).join("\n") || "_None._"}

## SHEETS_OK

${sheetsOk.map((r) => `- ${r.repo}`).join("\n")}
`;

fs.writeFileSync(path.join(ROOT, "employee-fraud-expert", "LEAD-TOTAL-LOSS-AUDIT.md"), md);
console.error("Wrote LEAD-TOTAL-LOSS-AUDIT.md");
