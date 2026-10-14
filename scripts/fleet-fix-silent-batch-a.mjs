/**
 * Fix SILENT lead failures (batch A):
 * - await submit-lead / notifyLeadWebhook (no void/fire-and-forget)
 * - include free-text as lowercase `message`
 * - expand resolveLeadMessage aliases
 * - accounting-expert-witness: return 502 when webhook set and fetch fails
 * - ads-for-openai: ensure processEnquiry sends message; don't swallow webhook errors
 *
 * Dry-run:  node scripts/fleet-fix-silent-batch-a.mjs
 * Apply:    node scripts/fleet-fix-silent-batch-a.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const APPLY = process.argv.includes("--apply");

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

const REQUIRED_ALIASES = [
  "message",
  "Message",
  "description",
  "enquiry",
  "details",
  "summary",
  "notes",
  "matter",
  "caseSummary",
  "case_summary",
  "caseBrief",
  "caseDescription",
  "caseDetails",
  "additionalInfo",
  "additional_info",
  "enquiryDetails",
  "matterDescription",
  "additionalNotes",
  "caseBackground",
  "specificQuestions",
  "briefSummary",
  "conflict_info",
  "brief",
];

const report = {};

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

function note(repo, file, change) {
  if (!report[repo]) report[repo] = [];
  report[repo].push(`${file}: ${change}`);
}

function write(file, next, before) {
  if (next === before) return false;
  if (APPLY) fs.writeFileSync(file, next, "utf8");
  return true;
}

function expandAliases(src) {
  if (!/function\s+resolveLeadMessage/.test(src)) return src;
  return src.replace(
    /(function\s+resolveLeadMessage\s*\([^)]*\)\s*\{[\s\S]*?const\s+keys\s*=\s*\[)([\s\S]*?)(\];)/,
    (m, open, body, close) => {
      const existing = new Set(
        [...body.matchAll(/["']([^"']+)["']/g)].map((x) => x[1])
      );
      const merged = [...existing];
      for (const a of REQUIRED_ALIASES) {
        if (!existing.has(a)) merged.push(a);
      }
      return `${open}\n    ${merged.map((k) => `"${k}"`).join(",\n    ")}\n  ${close}`;
    }
  );
}

function softAwaitBlock(indent, callExpr) {
  return `try {
${indent}  const leadRes = ${callExpr};
${indent}  if (leadRes && typeof leadRes.ok === "boolean" && !leadRes.ok) {
${indent}    console.warn("Lead webhook notification failed; continuing.");
${indent}  }
${indent}} catch (err) {
${indent}  console.warn("Lead webhook notification failed;", err);
${indent}}`;
}

/**
 * Convert fire-and-forget fetch("/api/submit-lead", ...) to awaited call.
 * Matches: void fetch(...), bare fetch(...).catch(...), etc.
 */
function awaitSubmitLeadFetch(src, softFail = true) {
  let out = src;
  let changed = false;

  // Pattern A: optional void + fetch("/api/submit-lead", { ... }) + optional .catch(...)
  // Must NOT already be awaited (negative lookbehind via manual check in replacer).
  const fireFetchRe =
    /(\n)([ \t]*)(?:void\s+)?fetch\(\s*(['"`])\/api\/submit-lead\3\s*,\s*(\{[\s\S]*?\})\s*\)\s*(?:\.catch\(\s*(?:\(\s*\)\s*=>\s*\{[\s\S]*?\}|[^)]+)\)\s*)?;?/g;

  out = out.replace(fireFetchRe, (full, nl, indent, q, opts, offset) => {
    const before = out.slice(Math.max(0, offset - 12), offset);
    if (/await\s+$/.test(before) || /=\s*$/.test(before.trimEnd()) || /Promise\.|allSettled|all\(/.test(before)) {
      return full;
    }
    // Skip if this fetch is already assigned: const x = fetch(
    const lineStart = out.lastIndexOf("\n", offset) + 1;
    const linePrefix = out.slice(lineStart, offset);
    if (/const\s+|let\s+|var\s+|return\s+|await\s+/.test(linePrefix)) {
      return full;
    }
    changed = true;
    const optsFixed = ensureMessageInFetchOpts(opts);
    const call = `await fetch(${q}/api/submit-lead${q}, ${optsFixed})`;
    if (softFail) {
      return `${nl}${indent}${softAwaitBlock(indent, call)}`;
    }
    return `${nl}${indent}const leadRes = ${call};
${indent}if (!leadRes.ok) {
${indent}  setStatus?.("error");
${indent}  setErrorMessage?.("Something went wrong. Please try again or email us directly.");
${indent}  setServerError?.("Something went wrong. Please try again or email us directly.");
${indent}  setState?.("error");
${indent}  setSubmitState?.("error");
${indent}  return;
${indent}}`;
  });

  // Pattern B: void notifyLeadWebhook({...});
  const voidNotifyRe =
    /(\n)([ \t]*)void\s+notifyLeadWebhook\(\s*(\{[\s\S]*?\})\s*\)\s*;/g;
  out = out.replace(voidNotifyRe, (full, nl, indent, obj) => {
    changed = true;
    const objFixed = ensureMessageInObjectLiteral(obj);
    if (softFail) {
      return `${nl}${indent}try {
${indent}  await notifyLeadWebhook(${objFixed});
${indent}} catch (err) {
${indent}  console.warn("Lead webhook notification failed;", err);
${indent}}`;
    }
    return `${nl}${indent}const leadOk = await notifyLeadWebhook(${objFixed});
${indent}if (leadOk === false) {
${indent}  setStatus?.("error");
${indent}  setErrorMessage?.("Something went wrong. Please try again or email us directly.");
${indent}  setServerError?.("Something went wrong. Please try again or email us directly.");
${indent}  setState?.("error");
${indent}  return;
${indent}}`;
  });

  return changed || out !== src ? out : src;
}

function ensureMessageInFetchOpts(opts) {
  // Look for body: JSON.stringify({ ... })
  if (/message\s*:/.test(opts)) return opts;
  return opts.replace(
    /(body:\s*JSON\.stringify\(\s*\{)([\s\S]*?)(\}\s*\))/,
    (m, open, body, close) => {
      if (/message\s*:/.test(body)) return m;
      const trimmed = body.replace(/\s*$/, "");
      const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
      // Try to map common free-text fields from surrounding payload refs
      const msgExpr = pickMessageExpr(body);
      return `${open}${trimmed}${comma}\n          message: ${msgExpr},${close}`;
    }
  );
}

function ensureMessageInObjectLiteral(obj) {
  if (/message\s*:/.test(obj)) return obj;
  const msgExpr = pickMessageExpr(obj);
  const trimmed = obj.replace(/\s*$/, "").replace(/\}$/, "");
  const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
  // obj is like "{ ... }"
  return obj.replace(
    /\}\s*$/,
    `${comma}\n  message: ${msgExpr},\n}`
  );
}

function pickMessageExpr(body) {
  // Prefer existing free-text field references in the stringify body
  const candidates = [
    /payload\.description/,
    /payload\.enquiry/,
    /payload\.details/,
    /payload\.summary/,
    /payload\.notes/,
    /payload\.matter/,
    /payload\.caseSummary/,
    /payload\.caseBrief/,
    /payload\.message/,
    /data\.description/,
    /data\.enquiry/,
    /data\.details/,
    /data\.summary/,
    /data\.notes/,
    /data\.matter/,
    /data\.caseSummary/,
    /data\.caseBrief/,
    /data\.message/,
    /formData\.description/,
    /values\.description/,
    /values\.enquiry/,
    /lead\.description/,
    /lead\.message/,
  ];
  for (const re of candidates) {
    const m = body.match(re);
    if (m) return `${m[0]} ?? ""`;
  }
  // FormData get patterns nearby won't be in body; use chained fallbacks from common names
  if (/data\.get\(/.test(body) || /fullName/.test(body)) {
    return `String(payload?.description ?? payload?.enquiry ?? payload?.details ?? payload?.summary ?? payload?.notes ?? payload?.matter ?? payload?.message ?? data?.description ?? data?.enquiry ?? data?.message ?? "").trim()`;
  }
  return `""`;
}

/** Soft-await local helper that itself does void fetch */
function fixLocalVoidNotifyHelper(src) {
  // function notifyLeadWebhook(...): void { void fetch(...) }
  if (!/function\s+notifyLeadWebhook\s*\([^)]*\)\s*:\s*void/.test(src)) {
    return src;
  }
  let out = src;
  out = out.replace(
    /function\s+notifyLeadWebhook\s*\(([^)]*)\)\s*:\s*void\s*\{/,
    "async function notifyLeadWebhook($1): Promise<void> {"
  );
  out = out.replace(
    /void\s+fetch\(\s*(['"`])\/api\/submit-lead\1/,
    "await fetch($1/api/submit-lead$1"
  );
  // Ensure message in local helper body
  if (!/message\s*:/.test(out) && /JSON\.stringify/.test(out)) {
    out = out.replace(
      /(body:\s*JSON\.stringify\(\s*\{)([\s\S]*?)(\}\s*\))/,
      (m, open, body, close) => {
        if (/message\s*:/.test(body)) return m;
        const msgExpr = pickMessageExpr(body) || 'data.message ?? data.description ?? data.enquiry ?? ""';
        // Better: map from data fields
        const better =
          "data.message ?? data.description ?? data.enquiry ?? data.details ?? data.summary ?? data.notes ?? data.matter ?? data.caseSummary ?? data.caseBrief ?? \"\"";
        const trimmed = body.replace(/\s*$/, "");
        const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
        return `${open}${trimmed}${comma}\n      message: ${better},${close}`;
      }
    );
  }
  // Call sites: notifyLeadWebhook(data) → await notifyLeadWebhook(data)
  out = out.replace(
    /(?<!await\s)(?<!function\s)(?<!async function\s)notifyLeadWebhook\(/g,
    (m, offset) => {
      // Don't double-prefix await on definition
      const before = out.slice(Math.max(0, offset - 30), offset);
      if (/function\s+$/.test(before) || /await\s+$/.test(before) || /export\s+async\s+$/.test(before)) {
        return m;
      }
      // Only inside async handlers — assume yes in form files
      return "await notifyLeadWebhook(";
    }
  );
  return out;
}

function fixNetlifySubmitLead(src, repo) {
  let out = expandAliases(src);

  // Ensure outbound uses message: resolveLeadMessage(body) || body.message || ""
  if (/resolveLeadMessage\(/.test(out) && /const\s+message\s*=/.test(out)) {
    out = out.replace(
      /const\s+message\s*=\s*resolveLeadMessage\((\w+)\)(?:\s*\|\|\s*\w+\.message\s*\|\|\s*"" )?;/,
      (m, arg) =>
        `const message = resolveLeadMessage(${arg}) || ${arg}.message || "";`
    );
  }

  // accounting-expert-witness: return 502 when webhook URL is set and fetch fails
  if (repo === "accounting-expert-witness") {
    // Replace soft-fail always-200 after webhook attempt with proper status handling
    if (
      /Soft-fail — never block/.test(out) ||
      (/webhookUrl/.test(out) &&
        /return \{ statusCode: 200, body: JSON\.stringify\(\{ success: true \}\) \};/.test(
          out
        ) &&
        !/statusCode:\s*502/.test(out))
    ) {
      out = out.replace(
        /try \{\s*const res = await fetch\(webhookUrl, \{[\s\S]*?\}\);\s*if \(!res\.ok\) \{[\s\S]*?\}\s*\} catch \(error\) \{[\s\S]*?\}\s*\n\s*\/\/ Soft-fail[\s\S]*?return \{ statusCode: 200, body: JSON\.stringify\(\{ success: true \}\) \};/,
        `try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload({ fullName, email, phone, message })),
    });

    if (!res.ok) {
      console.error("lead-webhook", \`Webhook responded \${res.status}\`);
      return { statusCode: 502, body: JSON.stringify({ error: "WEBHOOK_REJECTED", status: res.status }) };
    }
  } catch (error) {
    console.error("lead-webhook", error);
    return { statusCode: 502, body: JSON.stringify({ error: "WEBHOOK_UNREACHABLE" }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };`
      );
    }
  }

  return out;
}

function fixLeadHelperTs(src) {
  let out = src;
  // Message → message
  if (/\n\s*Message\s*:/.test(out)) {
    out = out.replace(/(\n\s*)Message(\s*:)/g, "$1message$2");
  }
  // Ensure buildWebhookPayload has message
  if (
    /build(?:Lead)?WebhookPayload|return\s*\{[\s\S]*"Brand name"/.test(out) &&
    !/message:\s*lead\.message/.test(out) &&
    /"Brand name"/.test(out)
  ) {
    out = out.replace(
      /(domain:\s*(?:getSiteDomain\(\)|[^,\n]+),?)/,
      `$1\n    message: lead.message ?? "",`
    );
    if (!/message:\s*lead\.message/.test(out)) {
      out = out.replace(
        /("Brand name":\s*[^,\n]+,?)/,
        `$1\n    message: lead.message ?? "",`
      );
    }
  }
  // Interface message?
  out = out.replace(
    /export interface (LeadWebhookInput|LeadPayload|WebhookLead|LeadInput|SubmitLeadInput) \{([^}]*)\}/g,
    (m, name, body) => {
      if (/\bmessage\??\s*:/.test(body)) return m;
      return `export interface ${name} {${body}  message?: string;\n}`;
    }
  );
  return out;
}

function fixAdsForOpenaiEnquiry(src) {
  let out = src;
  // Ensure notifyLeadWebhook call includes message (already usually present)
  if (
    /notifyLeadWebhook\s*\(/.test(out) &&
    !/notifyLeadWebhook\([\s\S]*?message\s*:/.test(out)
  ) {
    out = out.replace(
      /notifyLeadWebhook\(\s*\{([\s\S]*?)\}\s*\)/,
      (m, body) => {
        if (/message\s*:/.test(body)) return m;
        const trimmed = body.replace(/\s*$/, "");
        const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
        return `notifyLeadWebhook({${trimmed}${comma}
        message: String(formData.get("message") || formData.get("enquiry") || formData.get("description") || formData.get("details") || formData.get("notes") || "").trim(),
      })`;
      }
    );
  }
  // Replace empty catch that fully swallows webhook errors with logged check
  out = out.replace(
    /try \{\s*await notifyLeadWebhook\((\{[\s\S]*?\})\);\s*\} catch \{[\s\S]*?\}/,
    (m, args) => {
      if (/webhookOk/.test(m)) return m;
      return `const webhookOk = await notifyLeadWebhook(${args});
    if (!webhookOk) {
      console.error("Lead webhook notification failed for enquiry (Sheets row was written)");
    }`;
    }
  );
  return out;
}

function processFile(repo, file, src) {
  const rel = path.relative(path.join(ROOT, repo), file).replace(/\\/g, "/");
  const base = path.basename(file).toLowerCase();
  let out = src;
  let changes = [];

  // Netlify submit-lead
  if (
    (base === "submit-lead.js" || base === "submit-lead.cjs") &&
    rel.includes("netlify/functions")
  ) {
    const next = fixNetlifySubmitLead(out, repo);
    if (next !== out) {
      changes.push("netlify aliases/message/502");
      out = next;
    }
  }

  // Lead helpers
  if (
    /lead[-_]?notification|lead[-_]?webhook|notify[-_]?lead/.test(base) ||
    base === "leadnotification.ts" ||
    base === "lead-notification.ts" ||
    base === "lead-webhook.ts" ||
    base === "leadwebhook.ts" ||
    base === "notifyleadclient.ts"
  ) {
    const next = fixLeadHelperTs(out);
    if (next !== out) {
      changes.push("helper message key");
      out = next;
    }
    // Client helper that fire-and-forgets
    if (/export async function notifyLeadWebhook/.test(out) || /export function notifyLeadWebhook/.test(out)) {
      // already async usually — ensure callers await
    }
  }

  // Local void notify helpers in form files
  if (
    /function\s+notifyLeadWebhook\s*\([^)]*\)\s*:\s*void/.test(out) &&
    /\/api\/submit-lead/.test(out)
  ) {
    const next = fixLocalVoidNotifyHelper(out);
    if (next !== out) {
      changes.push("local notify helper → await");
      out = next;
    }
  }

  // Forms: void/bare fire-and-forget fetch("/api/submit-lead"...) or void notify
  if (
    /(?:void\s+)?fetch\s*\(\s*['"`]\/api\/submit-lead/.test(out) ||
    /void\s+notifyLeadWebhook\s*\(/.test(out)
  ) {
    // Soft-fail Sheets+webhook sites: still AWAIT so message is delivered.
    // Prefer block thank-you when submit-lead non-OK and error UI exists,
    // unless comments say soft-fail / still logged.
    const preferBlock =
      (/setStatus|setServerError|setState|setSubmitState/.test(out) &&
        /setErrorMessage|setServerError|setState\(["']error/.test(out)) &&
      !/soft-fail|still logged|already stored|don't block|do not block|Google Sheets not configured|best-effort|does not block|continuing \(|webhook failure must not|keepalive/i.test(
        out
      );
    const next = awaitSubmitLeadFetch(out, !preferBlock);
    if (next !== out) {
      changes.push(
        preferBlock ? "await+block submit-lead/notify" : "await submit-lead/notify (soft)"
      );
      out = next;
    }
  }

  // Fire-and-forget client helpers: fetch without await inside notify/submitLead helpers
  if (
    /submitLeadClient|notifyLeadClient|notifyLeadWebhook/.test(base) &&
    /fetch\s*\(\s*['"`]\/api\/submit-lead/.test(out) &&
    !/await\s+fetch\s*\(\s*['"`]\/api\/submit-lead/.test(out)
  ) {
    const next = out.replace(
      /(?<!await\s)fetch\(\s*(['"`])\/api\/submit-lead\1/,
      "await fetch($1/api/submit-lead$1"
    );
    if (next !== out) {
      // Ensure function is async
      let next2 = next.replace(
        /export\s+function\s+(\w+)\s*\(/,
        "export async function $1("
      );
      next2 = next2.replace(
        /function\s+(\w+)\s*\(([^)]*)\)\s*:\s*void/,
        "async function $1($2): Promise<void>"
      );
      changes.push("client helper await fetch");
      out = next2;
    }
  }

  // Ensure message in submit-lead JSON even when already awaited
  if (
    /\/api\/submit-lead/.test(out) &&
    /JSON\.stringify\(\s*\{/.test(out) &&
    !/message\s*:/.test(out.match(/\/api\/submit-lead[\s\S]{0,500}/)?.[0] || "")
  ) {
    const next = out.replace(
      /(fetch\(\s*['"`]\/api\/submit-lead['"`]\s*,\s*\{[\s\S]*?body:\s*JSON\.stringify\(\s*\{)([\s\S]*?)(\}\s*\))/,
      (m, open, body, close) => {
        if (/message\s*:/.test(body)) return m;
        const msgExpr = pickMessageExpr(body);
        const trimmed = body.replace(/\s*$/, "");
        const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
        return `${open}${trimmed}${comma}\n          message: ${msgExpr},${close}`;
      }
    );
    if (next !== out) {
      changes.push("add message to submit-lead body");
      out = next;
    }
  }

  // ads-for-openai enquiry
  if (repo === "ads-for-openai" && /processEnquiry/.test(out) && base === "enquiry.ts") {
    const next = fixAdsForOpenaiEnquiry(out);
    if (next !== out) {
      changes.push("processEnquiry message + error log");
      out = next;
    }
  }

  // submit-lead route: ensure message passed
  if (
    rel.includes("/api/submit-lead/") &&
    base === "route.ts" &&
    /notifyLeadWebhook/.test(out)
  ) {
    if (
      /notifyLeadWebhook\(\s*\{/.test(out) &&
      !/notifyLeadWebhook\([\s\S]*?message\s*:/.test(out)
    ) {
      out = out.replace(
        /notifyLeadWebhook\(\s*\{([\s\S]*?)\}\s*(?:,|\))/,
        (m, body) => {
          if (/message\s*:/.test(body)) return m;
          const trimmed = body.replace(/\s*$/, "");
          const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
          return m.replace(
            body,
            `${trimmed}${comma}\n      message: lead.message ?? lead.description ?? "",\n    `
          );
        }
      );
      changes.push("route passes message");
    }
  }

  if (changes.length && write(file, out, src)) {
    for (const c of changes) note(repo, rel, c);
    return true;
  }
  if (changes.length && out !== src) {
    // dry-run
    for (const c of changes) note(repo, rel, c + (APPLY ? "" : " [dry]"));
    return true;
  }
  return false;
}

function main() {
  let filesChanged = 0;
  for (const repo of REPOS) {
    const project = path.join(ROOT, repo);
    if (!fs.existsSync(project)) {
      note(repo, "-", "MISSING");
      continue;
    }
    const files = walk(project);
    for (const file of files) {
      let src;
      try {
        src = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }
      // Quick filter: only relevant files
      const rel = path.relative(project, file).replace(/\\/g, "/");
      const base = path.basename(file).toLowerCase();
      const interesting =
        /submit-lead|leadNotification|lead-notification|lead-webhook|leadWebhook|notifyLead|submitLeadClient|ContactForm|RetainForm|EngageForm|InstructForm|EnquiryForm|IntakeForm|PricingPlanForm|RequestEvidence|SecureMatch|enquiry\.ts|processEnquiry|Contact\.tsx/i.test(
          rel + base
        ) ||
        /(?:void\s+)?fetch\s*\(\s*['"`]\/api\/submit-lead/.test(src) ||
        /void\s+notifyLeadWebhook/.test(src) ||
        (/resolveLeadMessage/.test(src) && /netlify\/functions\/submit-lead/.test(rel));

      if (!interesting) continue;
      if (processFile(repo, file, src)) filesChanged++;
    }
    if (!report[repo]) note(repo, "-", "no changes needed / already ok?");
  }

  console.log(
    JSON.stringify(
      {
        mode: APPLY ? "APPLY" : "DRY_RUN",
        filesChanged,
        report,
      },
      null,
      2
    )
  );
}

main();
