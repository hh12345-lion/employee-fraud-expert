/**
 * Compare lead→n8n setup of failure-list (fixed) repos vs known-WORKING reference repos.
 * Reference = repos audited as WORKING in first-27 / later batches before the empty/silent fixes.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";

const WORKING_REFS = [
  "accountant-expert-witness",
  "afghanistan-country-expert",
  "africa-expert-witness",
  "altair-institute-web",
  "astra-country-experts",
  "asylum-expert-network",
  "asylum-expert-witness",
  "asylum-reports",
  "axiom-country-experts",
  "balkan-expert-witness",
  "bidwellGrant",
  "commercial-dispute-expert",
  "contract-loss-expert",
  "country-expert-witness-com",
  "dispute-accounting",
  "expert-consultancy",
  "fraud-loss-expert",
  "immigration-expert-witnesses",
  "LATAM-Court-Reports",
  "personal-injury-accountant",
];

const FIXED_FROM_FAILURES = [
  "asia-court-reports",
  "asylum-court-reports",
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
  "aigeos-web",
  "asylum-expert-scot",
  "business-loss-expert",
  "employee-fraud-expert",
  "forensic-accountant-expert",
  "fraud-expert-witness",
  "legal-aid-expert-witness",
  "MENA-expert-witness",
  "middle-east-expert",
  "str-claims-web",
  "witness-consulting",
  "country-expert-insights",
  "pakistan-country-expert",
  "warranty-claim-expert",
];

function walk(dir, acc = [], depth = 0) {
  if (!fs.existsSync(dir) || depth > 6) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next", "dist", "out", ".turbo"].includes(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc, depth + 1);
    else if (/\.(js|cjs|ts|tsx)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function analyze(repo) {
  const project = path.join(ROOT, repo);
  if (!fs.existsSync(project)) return { repo, missing: true };

  const netlifyPaths = [
    "netlify/functions/submit-lead.js",
    "netlify/functions/submit-lead.cjs",
    "netlify/functions/ghl-webhook.cjs",
    "netlify/functions/ghl-webhook.js",
    "netlify/functions/contact.js",
  ];

  let outboundMessage = false;
  let resolveHelper = false;
  let brandDomain = false;
  let truncated = false;
  let netlifyFile = null;

  for (const rel of netlifyPaths) {
    const fp = path.join(project, rel);
    if (!fs.existsSync(fp)) continue;
    const t = fs.readFileSync(fp, "utf8");
    netlifyFile = rel;
    if (/message\s*:|\n\s*message,/.test(t) && /Brand name|Full Name/.test(t)) outboundMessage = true;
    if (/resolveLeadMessage|resolvedMessage/.test(t)) resolveHelper = true;
    if (/BRAND_NAME|Brand name/.test(t) && /domain/.test(t)) brandDomain = true;
    if (/getSiteDomain\(/.test(t) && !/function\s+getSiteDomain/.test(t)) truncated = true;
    if (/BRAND_NAME/.test(t) && !/const\s+BRAND_NAME|let\s+BRAND_NAME|var\s+BRAND_NAME/.test(t)) truncated = true;
    if (/jsonResponse\(/.test(t) && !/function\s+jsonResponse|const\s+jsonResponse/.test(t)) truncated = true;
  }

  // Next helpers
  const libs = walk(path.join(project, "lib"))
    .concat(walk(path.join(project, "src", "lib")))
    .filter((p) => /lead|submit|webhook|notif/i.test(p));
  for (const fp of libs) {
    const t = fs.readFileSync(fp, "utf8");
    if (/message\s*:/.test(t) && /Brand name|Full Name|LeadWebhook|buildLead/.test(t)) {
      outboundMessage = true;
      brandDomain = true;
    }
    if (/resolveLeadMessage/.test(t)) resolveHelper = true;
  }

  // Forms: submit-lead with message + await
  let formSendsMessage = false;
  let formAwaits = false;
  let formVoid = false;
  const forms = walk(project).filter((p) =>
    /Form\.(tsx|ts|jsx|js)$|actions\.(ts|tsx)$|submitLead|notifyLead|ContactForm|InstructForm/i.test(
      path.basename(p)
    )
  );

  for (const fp of forms) {
    let t;
    try {
      t = fs.readFileSync(fp, "utf8");
    } catch {
      continue;
    }
    if (!/submit-lead|notifyLeadWebhook|postSubmitLead|submitLeadToWebhook|notifyLeadSubmission|postLeadNotification|postLeadToWebhook|ghl-webhook|notifyLead\b/.test(t)) {
      continue;
    }
    if (
      /message\s*:/.test(t) ||
      /\.\.\.(?:data|payload|values|parsed\.data)/.test(t) ||
      /message:\s*(?:data|String|payload|values|fd|formData)/.test(t)
    ) {
      formSendsMessage = true;
    }
    if (
      /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead|await\s+(?:notifyLeadWebhook|postSubmitLead|submitLeadNotification|notifyLeadSubmission|postLeadNotification|submitLeadToWebhook|notifySubmitLead|notifyLead)\s*\(/.test(
        t
      ) ||
      /await\s+Promise\.all/.test(t)
    ) {
      formAwaits = true;
    }
    if (
      /void\s+fetch\s*\(\s*[`'"]\/api\/submit-lead|void\s+(?:notifyLeadWebhook|postSubmitLead|submitLeadNotification|notifyLeadSubmission|postLeadNotification)\s*\(/.test(
        t
      )
    ) {
      formVoid = true;
    }
  }

  // Score like reference WORKING sites
  const checks = {
    outboundMessage,
    brandDomain,
    notTruncated: !truncated,
    formSendsMessage: formSendsMessage || outboundMessage, // server-only paths ok if outbound resolves
    formAwaitsOrServer: formAwaits || !formVoid, // no void fire-and-forget
  };

  const pass = Object.values(checks).every(Boolean);
  return {
    repo,
    netlifyFile,
    resolveHelper,
    truncated,
    formSendsMessage,
    formAwaits,
    formVoid,
    checks,
    pass,
    confidence: pass
      ? formAwaits && formSendsMessage && outboundMessage
        ? "high"
        : "medium"
      : "low",
  };
}

const refs = WORKING_REFS.map(analyze).filter((r) => !r.missing);
const fixed = [...new Set(FIXED_FROM_FAILURES)].map(analyze).filter((r) => !r.missing);

const refPassRate = refs.filter((r) => r.pass).length / refs.length;
const fixedPass = fixed.filter((r) => r.pass);
const fixedFail = fixed.filter((r) => !r.pass);
const fixedHigh = fixed.filter((r) => r.confidence === "high");
const fixedMed = fixed.filter((r) => r.confidence === "medium");

console.log(
  JSON.stringify(
    {
      reference: {
        count: refs.length,
        pass: refs.filter((r) => r.pass).length,
        passRate: Math.round(refPassRate * 100),
        high: refs.filter((r) => r.confidence === "high").length,
        sampleFail: refs.filter((r) => !r.pass).map((r) => ({
          repo: r.repo,
          checks: r.checks,
          formVoid: r.formVoid,
        })),
      },
      fixedSample: {
        count: fixed.length,
        pass: fixedPass.length,
        fail: fixedFail.length,
        highConfidence: fixedHigh.length,
        mediumConfidence: fixedMed.length,
        lowConfidence: fixedFail.length,
        fails: fixedFail.map((r) => ({
          repo: r.repo,
          checks: r.checks,
          formVoid: r.formVoid,
          truncated: r.truncated,
        })),
        medium: fixedMed.map((r) => r.repo),
      },
      verdict:
        fixedFail.length === 0
          ? "All sampled fixed repos match working-site checklist"
          : `${fixedFail.length} sampled fixed repos still diverge from working checklist`,
    },
    null,
    2
  )
);
