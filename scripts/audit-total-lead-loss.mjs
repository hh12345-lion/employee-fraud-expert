/**
 * Evidence audit: which repos lose BOTH form success AND Sheets when lead/n8n path breaks.
 *
 * TOTAL_LOSS = live submit-lead handler returns non-2xx (or crashes) before Sheets append,
 *             AND the form's success gate depends on that handler.
 * SHEETS_OK = Sheets written before webhook, OR success if sheetsOk||webhookOk, OR contact/GHL first.
 * FORM_FAIL_SHEETS_OK = form may show error on submit-lead fail, but Sheets already written earlier.
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

function read(fp) {
  try {
    return fs.readFileSync(fp, "utf8");
  } catch {
    return "";
  }
}

function exists(fp) {
  return fs.existsSync(fp);
}

function walk(dir, acc = [], depth = 0) {
  if (!exists(dir) || depth > 8) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next", "dist", "out"].includes(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc, depth + 1);
    else if (/\.(tsx|ts|jsx|js|cjs|toml)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function findNextSubmitLead(project) {
  const candidates = [
    "app/api/submit-lead/route.ts",
    "src/app/api/submit-lead/route.ts",
  ];
  for (const rel of candidates) {
    const fp = path.join(project, rel);
    if (exists(fp)) return { rel, text: read(fp), kind: "next" };
  }
  return null;
}

function findNetlifySubmitLead(project) {
  for (const rel of [
    "netlify/functions/submit-lead.js",
    "netlify/functions/submit-lead.cjs",
  ]) {
    const fp = path.join(project, rel);
    if (exists(fp)) return { rel, text: read(fp), kind: "netlify" };
  }
  return null;
}

function usesNetlifyRedirect(project) {
  const toml = read(path.join(project, "netlify.toml"));
  if (!toml) return false;
  // Active (uncommented) redirect of /api/submit-lead → function
  const lines = toml.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#")) continue;
    if (/from\s*=\s*["']\/api\/submit-lead["']/.test(line)) {
      // look ahead for to = /.netlify/functions/submit-lead
      const window = lines.slice(i, i + 6).join("\n");
      if (/to\s*=\s*["']\/\.netlify\/functions\/submit-lead/.test(window)) return true;
    }
  }
  return false;
}

function isTruncated(t) {
  if (!t) return false;
  const checks = [
    [/jsonResponse\s*\(/, /function\s+jsonResponse|const\s+jsonResponse\s*=/],
    [/parseLead\s*\(/, /function\s+parseLead/],
    [/getSiteDomain\s*\(/, /function\s+getSiteDomain/],
    [/\bBRAND_NAME\b/, /const\s+BRAND_NAME|let\s+BRAND_NAME|var\s+BRAND_NAME|export\s+const\s+BRAND_NAME/],
  ];
  for (const [use, def] of checks) {
    if (use.test(t) && !def.test(t)) return true;
  }
  try {
    if (!/\bexport\s|\bimport\s/.test(t)) new Function(t.replace(/^\uFEFF/, ""));
  } catch {
    return true;
  }
  return false;
}

function hasSheetsWrite(t) {
  return /appendRow|appendLead|writeToSheets|writeLeadToSheet|appendContactToSheet|append.*Sheet|spreadsheets\.values\.append|googleapis.*sheets|softFailAppendSheet|writeSubmissionToSheet/i.test(
    t
  );
}

/**
 * Detect if handler hard-fails on webhook BEFORE attempting sheets.
 * Patterns:
 * - notify/webhook then early return 502/503 before sheets call
 * - "if (!webhookOk) return ...502" then sheets later
 * - "if (\"error\" in result) return" then softFailAppendSheet later
 */
function webhookHardFailBeforeSheets(t) {
  if (!t || !hasSheetsWrite(t)) {
    // no sheets at all in handler
    return { hardBeforeSheets: false, noSheets: !hasSheetsWrite(t), orSuccess: false };
  }

  const sheetsIdx = t.search(
    /softFailAppendSheet|appendLeadToGoogleSheet|appendLeadToSheet|writeToSheets|writeLeadToSheet|appendContactToSheet|writeSubmissionToSheet|spreadsheets\.values\.append|appendRow\(/
  );
  const webhookIdx = t.search(
    /notifyLeadWebhook|postToWebhook|fetch\(webhookUrl|Lead_notification_url/
  );

  // Success if either path works
  const orSuccess =
    /!forwarded\s*&&\s*!writtenToSheet|!webhookOk\s*&&\s*!sheetsOk|!sheetsOk\s*&&\s*!webhookOk|webhookOk\s*\|\|\s*sheetsOk|sheetsOk\s*\|\|\s*webhookOk|forwarded\s*\|\|\s*writtenToSheet|writtenToSheet\s*\|\|\s*forwarded/.test(
      t
    );

  // Early return on webhook failure that appears BEFORE sheets write in source order
  const earlyReturnPatterns = [
    /if\s*\(\s*!webhookOk\s*\)[\s\S]{0,200}return[\s\S]{0,120}(502|503)/,
    /if\s*\(\s*"error"\s+in\s+result\s*\)[\s\S]{0,250}return[\s\S]{0,150}status:\s*result\.status/,
    /if\s*\(\s*!.*forwarded[\s\S]{0,80}\)[\s\S]{0,200}return[\s\S]{0,120}(502|503)/,
    /if\s*\(\s*!res\.ok[\s\S]{0,200}return[\s\S]{0,120}(502|503)/,
  ];

  let earlyReturnMatch = null;
  for (const re of earlyReturnPatterns) {
    const m = t.match(re);
    if (m) {
      earlyReturnMatch = m.index;
      break;
    }
  }

  // Webhook-required: missing url → 503 before any sheets
  const webhookRequiredNoSheetsFallback =
    /if\s*\(\s*!webhookUrl[\s\S]{0,80}\)[\s\S]{0,200}return[\s\S]{0,150}503/.test(t) &&
    !/sheetsConfigured|isGoogleSheetsConfigured/.test(
      t.slice(0, t.search(/503/) + 200 || 0)
    );

  // Specific: business-valuation style — error in result return, THEN softFailAppendSheet later
  const webhookThenReturnThenSheets =
    earlyReturnMatch != null &&
    sheetsIdx >= 0 &&
    earlyReturnMatch < sheetsIdx;

  // damages style: webhookOk = await notify; if (!webhookOk) return 502; then sheets
  const damagesStyle =
    /notifyLeadWebhook[\s\S]{0,300}if\s*\(\s*!webhookOk\s*\)[\s\S]{0,200}return[\s\S]{0,120}502[\s\S]{0,400}(writeSubmissionToSheet|appendContactToSheet|softFailAppendSheet|appendLead)/.test(
      t
    );

  const hardBeforeSheets =
    damagesStyle ||
    webhookThenReturnThenSheets ||
    (webhookIdx >= 0 &&
      sheetsIdx >= 0 &&
      webhookIdx < sheetsIdx &&
      earlyReturnMatch != null &&
      earlyReturnMatch < sheetsIdx &&
      !orSuccess);

  return {
    hardBeforeSheets: Boolean(hardBeforeSheets),
    noSheets: false,
    orSuccess,
    sheetsAfterWebhook: webhookIdx >= 0 && sheetsIdx >= 0 && webhookIdx < sheetsIdx,
    sheetsBeforeWebhook: webhookIdx >= 0 && sheetsIdx >= 0 && sheetsIdx < webhookIdx,
    webhookRequiredNoSheetsFallback,
  };
}

function webhookOnlyHardFail(t) {
  if (!t) return false;
  if (hasSheetsWrite(t)) return false;
  return /statusCode:\s*502|status:\s*502|statusCode:\s*503|status:\s*503/.test(t);
}

function analyzeForms(project) {
  const files = walk(project).filter((p) =>
    /\.(tsx|ts|jsx|js)$/.test(p) &&
    /Form|contact-form|ContactLead|DocketForm|RetainForm|InstructForm|RequestForm|QuickBrief|email-cta/i.test(
      path.basename(p)
    )
  );

  let awaitsSubmitLead = false;
  let voidSubmitLead = false;
  let blocksOnSubmitLeadFail = false;
  let softContinue = false;
  let postsPrimaryFirst = false; // contact/instruct/docket/retain/ghl before or instead as gate
  let solePathSubmitLead = false;
  let ghlPrimary = false;
  const evidence = [];

  for (const fp of files) {
    const t = read(fp);
    if (!t) continue;
    const rel = path.relative(project, fp).replace(/\\/g, "/");

    if (!/submit-lead|notifyLead|submitLead|ghl-webhook|\/api\/contact|\/api\/docket|\/api\/retain|\/api\/instruct/.test(t)) {
      continue;
    }

    // Extract rough submit bodies
    const chunks = t.split(/async function (?:handleSubmit|onSubmit)|const handleSubmit|function onSubmit/);
    for (const chunk of chunks.slice(1)) {
      const body = chunk.slice(0, 1800);

      const leadAwait =
        /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead|await\s+(?:notifyLeadWebhook|submitLeadNotification|notifyLeadSubmission|postSubmitLead|notifySubmitLead)\s*\(/.test(
          body
        ) ||
        /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(chunk.slice(0, 2500));

      const leadVoid =
        /void\s+fetch\s*\(\s*[`'"]\/api\/submit-lead|void\s+(?:notifyLead|submitLead)/.test(body) ||
        /fetch\s*\(\s*[`'"]\/api\/submit-lead[\s\S]{0,80}\)\s*;/.test(body) &&
          !/await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(body);

      const primary =
        /await\s+fetch\s*\(\s*[`'"]\/api\/(?:contact|instruct|docket|retain|enquire|request|ghl-webhook)/.test(
          body
        );

      if (/ghl-webhook/.test(body) && /ghlRes|CRM|ghl/.test(body)) {
        ghlPrimary = true;
        evidence.push(`${rel}: GHL primary gate`);
      }

      if (primary) {
        // Does primary run and gate success before lead?
        const primaryIdx = body.search(
          /\/api\/(?:contact|instruct|docket|retain|enquire|request|ghl-webhook)/
        );
        const leadIdx = body.search(/\/api\/submit-lead|submitLeadNotification|notifyLead/);
        if (primaryIdx >= 0 && (leadIdx < 0 || primaryIdx < leadIdx)) {
          postsPrimaryFirst = true;
          evidence.push(`${rel}: primary API before submit-lead`);
        }
      }

      if (leadAwait || /await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t)) {
        awaitsSubmitLead = true;
        evidence.push(`${rel}: awaits submit-lead`);
      }

      if (
        /void\s+fetch\s*\(\s*[`'"]\/api\/submit-lead|submitLeadNotification\(\{/.test(t) &&
        !/await\s+submitLeadNotification/.test(t)
      ) {
        voidSubmitLead = true;
        evidence.push(`${rel}: fire-and-forget lead notify`);
      }

      // Hard block patterns
      if (
        /\/api\/submit-lead[\s\S]{0,500}if\s*\(\s*!res\.ok|\/api\/submit-lead[\s\S]{0,500}if\s*\(\s*!apiRes\.ok|\/api\/submit-lead[\s\S]{0,400}throw new Error|if\s*\(\s*!res\.ok[\s\S]{0,200}setStatus\(["']error/.test(
          t
        )
      ) {
        // Only if thank-you is after the ok check (sole gate)
        if (/\/api\/submit-lead/.test(t) && /thank-you/.test(t)) {
          const leadPos = t.indexOf("/api/submit-lead");
          const thankPos = t.indexOf("/thank-you", leadPos);
          const failPos = t.search(/if\s*\(\s*!res\.ok|if\s*\(\s*!apiRes\.ok|if\s*\(\s*!.*\.ok/);
          if (thankPos > 0 && failPos >= 0 && failPos < thankPos) {
            // Check if primary already gated
            if (!postsPrimaryFirst && !ghlPrimary) {
              blocksOnSubmitLeadFail = true;
              evidence.push(`${rel}: thank-you gated on submit-lead OK`);
            }
          }
        }
      }

      // Sole path: only submit-lead fetch in submit handler
      if (
        /\/api\/submit-lead/.test(body) &&
        !/\/api\/(?:contact|instruct|docket|retain|enquire|request|ghl-webhook)/.test(body)
      ) {
        solePathSubmitLead = true;
        evidence.push(`${rel}: submit-lead-only handler`);
      }

      if (
        /catch\s*\{[\s\S]{0,80}(\/\/|console)|soft|Secondary lead|don't block|do not block|continuing/i.test(
          body
        )
      ) {
        softContinue = true;
      }
    }

    // Full-file fallbacks for forms without clear chunk split
    if (/await\s+fetch\s*\(\s*[`'"]\/api\/submit-lead/.test(t)) awaitsSubmitLead = true;
    if (
      /await\s+fetch\s*\(\s*[`'"]\/api\/(?:contact|instruct|docket|retain)/.test(t) &&
      /\/api\/submit-lead/.test(t)
    ) {
      const c = t.search(/\/api\/(?:contact|instruct|docket|retain)/);
      const l = t.search(/\/api\/submit-lead/);
      if (c >= 0 && l >= 0 && c < l) postsPrimaryFirst = true;
    }
    if (
      /\/api\/submit-lead[\s\S]{0,600}if\s*\(\s*!(?:res|apiRes|response)\.ok[\s\S]{0,200}(setStatus\(["']error|setError|return)/.test(
        t
      ) &&
      !postsPrimaryFirst &&
      !ghlPrimary
    ) {
      blocksOnSubmitLeadFail = true;
    }
    if (
      /\/api\/submit-lead/.test(t) &&
      !/\/api\/(?:contact|instruct|docket|retain|ghl-webhook)/.test(t) &&
      /thank-you/.test(t)
    ) {
      solePathSubmitLead = true;
    }
  }

  return {
    awaitsSubmitLead,
    voidSubmitLead,
    blocksOnSubmitLeadFail,
    softContinue,
    postsPrimaryFirst,
    solePathSubmitLead,
    ghlPrimary,
    evidence: [...new Set(evidence)],
  };
}

function analyze(repo) {
  const project = path.join(ROOT, repo);
  if (!exists(project)) {
    return { repo, classification: "MISSING", reason: "repo not found" };
  }

  const next = findNextSubmitLead(project);
  const nf = findNetlifySubmitLead(project);
  const redirect = usesNetlifyRedirect(project);
  const live = redirect ? nf : next || nf;
  const liveLabel = live
    ? `${live.kind}:${live.rel}${redirect ? " (redirect)" : next && !redirect ? " (Next primary)" : ""}`
    : "none";

  const truncated = live ? isTruncated(live.text) : false;
  const sheets = live ? hasSheetsWrite(live.text) : false;
  const order = live
    ? webhookHardFailBeforeSheets(live.text)
    : { hardBeforeSheets: false, noSheets: true, orSuccess: false };
  const whOnlyHard = live ? webhookOnlyHardFail(live.text) : false;

  const form = analyzeForms(project);

  let classification;
  let reason;

  // --- TOTAL_LOSS ---
  if (truncated && form.solePathSubmitLead && (form.blocksOnSubmitLeadFail || form.awaitsSubmitLead)) {
    classification = "TOTAL_LOSS";
    reason = `Live handler truncated/crashes; form sole path awaits it → nothing saved (handler: ${liveLabel})`;
  } else if (
    form.solePathSubmitLead &&
    form.blocksOnSubmitLeadFail &&
    order.hardBeforeSheets
  ) {
    classification = "TOTAL_LOSS";
    reason = `Webhook hard-fails BEFORE Sheets append; form requires submit-lead OK → Sheets never written (handler: ${liveLabel})`;
  } else if (
    form.solePathSubmitLead &&
    form.blocksOnSubmitLeadFail &&
    (order.noSheets || whOnlyHard) &&
    !form.postsPrimaryFirst
  ) {
    classification = "TOTAL_LOSS";
    reason = `Sole submit-lead path is webhook-only (no Sheets in live handler); fail → nothing persisted (handler: ${liveLabel})`;
  } else if (
    form.blocksOnSubmitLeadFail &&
    !form.postsPrimaryFirst &&
    !form.ghlPrimary &&
    order.hardBeforeSheets
  ) {
    classification = "TOTAL_LOSS";
    reason = `Form gates thank-you on submit-lead; webhook failure returns before Sheets (handler: ${liveLabel})`;
  }
  // --- FORM_FAIL but sheets already done ---
  else if (form.postsPrimaryFirst && form.blocksOnSubmitLeadFail) {
    classification = "FORM_FAIL_SHEETS_OK";
    reason = "Contact/docket/retain runs first and owns Sheets; submit-lead fail may show error but row exists";
  } else if (form.postsPrimaryFirst && (form.awaitsSubmitLead || form.voidSubmitLead)) {
    classification = "SHEETS_OK";
    reason = "Primary contact/docket/retain/GHL writes Sheets before/independent of submit-lead";
  } else if (form.ghlPrimary) {
    classification = "SHEETS_OK";
    reason = "GHL is success gate; submit-lead secondary";
  } else if (form.voidSubmitLead || form.softContinue) {
    classification = "SHEETS_OK";
    reason = "Lead notify soft/void; form does not require it for thank-you";
  } else if (sheets && order.orSuccess && !order.hardBeforeSheets) {
    classification = "SHEETS_OK";
    reason = `Live handler succeeds if Sheets OR webhook OK (handler: ${liveLabel})`;
  } else if (sheets && order.sheetsBeforeWebhook && !order.hardBeforeSheets) {
    classification = "SHEETS_OK";
    reason = `Sheets written before webhook in live handler (handler: ${liveLabel})`;
  } else if (sheets && !order.hardBeforeSheets && form.blocksOnSubmitLeadFail) {
    // sheets attempted even on webhook fail, but form still needs 200 — if orSuccess, sheets keep row and form OK
    classification = order.orSuccess
      ? "SHEETS_OK"
      : "NEEDS_MANUAL";
    reason = order.orSuccess
      ? `Sheets fallback keeps 200 when webhook fails (handler: ${liveLabel})`
      : `Sheets present but success rules ambiguous (handler: ${liveLabel})`;
  } else if (!form.awaitsSubmitLead && form.postsPrimaryFirst) {
    classification = "SHEETS_OK";
    reason = "Primary API path; submit-lead not awaited";
  } else {
    classification = "NEEDS_MANUAL";
    reason = `Ambiguous — live=${liveLabel}; sheets=${sheets}; hardBeforeSheets=${order.hardBeforeSheets}; sole=${form.solePathSubmitLead}; blocks=${form.blocksOnSubmitLeadFail}`;
  }

  return {
    repo,
    classification,
    reason,
    liveHandler: liveLabel,
    truncated,
    sheetsInLive: sheets,
    hardFailBeforeSheets: order.hardBeforeSheets,
    orSuccess: order.orSuccess,
    ...form,
  };
}

const results = REPOS.map(analyze);
const groups = {
  TOTAL_LOSS: results.filter((r) => r.classification === "TOTAL_LOSS"),
  FORM_FAIL_SHEETS_OK: results.filter((r) => r.classification === "FORM_FAIL_SHEETS_OK"),
  SHEETS_OK: results.filter((r) => r.classification === "SHEETS_OK"),
  NEEDS_MANUAL: results.filter((r) => r.classification === "NEEDS_MANUAL"),
  MISSING: results.filter((r) => r.classification === "MISSING"),
};

const out = {
  counts: {
    TOTAL_LOSS: groups.TOTAL_LOSS.length,
    FORM_FAIL_SHEETS_OK: groups.FORM_FAIL_SHEETS_OK.length,
    SHEETS_OK: groups.SHEETS_OK.length,
    NEEDS_MANUAL: groups.NEEDS_MANUAL.length,
    MISSING: groups.MISSING.length,
  },
  TOTAL_LOSS: groups.TOTAL_LOSS,
  FORM_FAIL_SHEETS_OK: groups.FORM_FAIL_SHEETS_OK,
  NEEDS_MANUAL: groups.NEEDS_MANUAL,
  SHEETS_OK_names: groups.SHEETS_OK.map((r) => r.repo),
};

console.log(JSON.stringify(out, null, 2));

const mdPath = path.join(
  ROOT,
  "employee-fraud-expert",
  "LEAD-TOTAL-LOSS-AUDIT.md"
);
const md = `# Lead TOTAL_LOSS audit

Generated by \`scripts/audit-total-lead-loss.mjs\`.

## Definition

**TOTAL_LOSS** = when the live \`/api/submit-lead\` path fails (n8n/webhook down, 502, or crash), the visitor gets an error **and** Google Sheets also receives no row.

**SHEETS_OK** = Sheets (or CRM/contact API that writes Sheets) still gets the lead even if n8n/submit-lead fails.

**FORM_FAIL_SHEETS_OK** = user may see a form error, but Sheets already has the row.

## Counts

| Class | Count |
|-------|------:|
| TOTAL_LOSS | ${groups.TOTAL_LOSS.length} |
| FORM_FAIL_SHEETS_OK | ${groups.FORM_FAIL_SHEETS_OK.length} |
| SHEETS_OK | ${groups.SHEETS_OK.length} |
| NEEDS_MANUAL | ${groups.NEEDS_MANUAL.length} |
| MISSING | ${groups.MISSING.length} |

## TOTAL_LOSS (Sheets also empty)

${
  groups.TOTAL_LOSS.length === 0
    ? "_None._"
    : groups.TOTAL_LOSS
        .map(
          (r) =>
            `### ${r.repo}\n- **Why:** ${r.reason}\n- **Handler:** ${r.liveHandler}\n- truncated=${r.truncated} sheets=${r.sheetsInLive} hardBeforeSheets=${r.hardFailBeforeSheets}`
        )
        .join("\n\n")
}

## FORM_FAIL_SHEETS_OK

${groups.FORM_FAIL_SHEETS_OK.map((r) => `- **${r.repo}** — ${r.reason}`).join("\n") || "_None._"}

## NEEDS_MANUAL

${groups.NEEDS_MANUAL.map((r) => `- **${r.repo}** — ${r.reason}`).join("\n") || "_None._"}

## SHEETS_OK (${groups.SHEETS_OK.length})

${groups.SHEETS_OK.map((r) => `- ${r.repo}`).join("\n")}
`;

fs.writeFileSync(mdPath, md, "utf8");
console.error(`\nWrote ${mdPath}`);
