/**
 * Restore mangled forms from git HEAD, then apply brace-aware await transform.
 * Also fix duplicate message keys in submit-lead routes.
 *
 * node scripts/fleet-reapply-silent-batch-a.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const APPLY = process.argv.includes("--apply");

const BROKEN_FILES = [
  "abc-expert-consultants/components/forms/ContactForm.tsx",
  "abc-expert-consultants/components/forms/RetainForm.tsx",
  "aigeos-web/src/components/PricingPlanForm.tsx",
  "asylum-expert-scot/components/forms/ContactForm.tsx",
  "asylum-expert-scot/components/forms/RequestEvidenceForm.tsx",
  "business-loss-expert/components/contact/ContactForm.tsx",
  "ceed/src/pages/Contact.tsx",
  "coi-experts/components/forms/ContactForm.tsx",
  "coi-experts/components/forms/InstructForm.tsx",
  "coi-experts/app/api/submit-lead/route.ts",
  "country-condition-reports/app/api/submit-lead/route.ts",
  "country-conditions-expert/app/api/submit-lead/route.ts",
  "country-conditions-expert/lib/submitLeadClient.ts",
  "country-expert-insights/components/forms/ContactForm.tsx",
  "country-expert-insights/components/forms/InstructForm.tsx",
  "country-expert-witness-net/components/forms/ContactForm.tsx",
  "country-expert-witness-net/components/forms/SecureMatchForm.tsx",
  "country-report-expert/components/forms/ContactForm.tsx",
  "country-report-expert/app/api/submit-lead/route.ts",
  "divorce-accountant-expert/components/forms/ContactForm.tsx",
  "divorce-accountant-expert/components/forms/InstructForm.tsx",
  "divorce-accountant-expert/app/api/submit-lead/route.ts",
  "divorce-tax-expert/components/forms/ContactForm.tsx",
  "divorce-tax-expert/components/forms/InstructForm.tsx",
  "employee-fraud-expert/src/components/forms/ContactForm.tsx",
  "employee-fraud-expert/src/components/forms/InstructForm.tsx",
];

function matchBrace(src, openIdx) {
  let depth = 0;
  let inStr = null;
  let esc = false;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (c === "\\") {
        esc = true;
        continue;
      }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function gitShow(repo, rel) {
  try {
    return execSync(`git show HEAD:"${rel.replace(/\\/g, "/")}"`, {
      cwd: path.join(ROOT, repo),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch {
    return null;
  }
}

function ensureMessageInOpts(optsSrc) {
  // optsSrc includes surrounding { }
  if (/message\s*:/.test(optsSrc)) return optsSrc;
  const bodyIdx = optsSrc.search(/body:\s*JSON\.stringify\s*\(/);
  if (bodyIdx === -1) return optsSrc;
  const paren = optsSrc.indexOf("(", bodyIdx);
  // find { after (
  let i = paren + 1;
  while (i < optsSrc.length && /\s/.test(optsSrc[i])) i++;
  if (optsSrc[i] !== "{") return optsSrc;
  const end = matchBrace(optsSrc, i);
  if (end === -1) return optsSrc;
  const inner = optsSrc.slice(i + 1, end);
  if (/message\s*:/.test(inner)) return optsSrc;
  const msg =
    "payload.description ?? payload.enquiry ?? payload.details ?? payload.summary ?? payload.notes ?? payload.matter ?? payload.message ?? data.description ?? data.enquiry ?? data.message ?? data.caseBrief ?? data.caseOverview ?? \"\"";
  const trimmed = inner.replace(/\s*$/, "");
  const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
  const newInner = `${trimmed}${comma}\n          message: ${msg},\n        `;
  return optsSrc.slice(0, i + 1) + newInner + optsSrc.slice(end);
}

/**
 * Replace fire-and-forget fetch("/api/submit-lead", opts)... with soft await block.
 * Brace-aware.
 */
function transformFireAndForgetFetch(src) {
  let out = src;
  const re = /(?:void\s+)?fetch\s*\(\s*(['"`])\/api\/submit-lead\1\s*,/g;
  const replacements = [];

  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index;
    // skip if already awaited
    const before = src.slice(Math.max(0, start - 10), start);
    if (/await\s+$/.test(before)) continue;
    const lineStart = src.lastIndexOf("\n", start) + 1;
    const linePrefix = src.slice(lineStart, start);
    if (/const\s+|let\s+|var\s+|return\s+/.test(linePrefix)) continue;

    // find opts {
    let i = m.index + m[0].length;
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] !== "{") continue;
    const optsEnd = matchBrace(src, i);
    if (optsEnd === -1) continue;

    // after opts: ) optional .catch(...) ;
    let j = optsEnd + 1;
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] !== ")") continue;
    j++;
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src.slice(j, j + 6) === ".catch") {
      // skip .catch(...)
      const catchParen = src.indexOf("(", j);
      if (catchParen === -1) continue;
      // match parens for catch arg
      let depth = 0;
      let k = catchParen;
      let inStr = null;
      let esc = false;
      for (; k < src.length; k++) {
        const c = src[k];
        if (inStr) {
          if (esc) {
            esc = false;
            continue;
          }
          if (c === "\\") {
            esc = true;
            continue;
          }
          if (c === inStr) inStr = null;
          continue;
        }
        if (c === '"' || c === "'" || c === "`") {
          inStr = c;
          continue;
        }
        if (c === "(") depth++;
        else if (c === ")") {
          depth--;
          if (depth === 0) {
            k++;
            break;
          }
        }
      }
      j = k;
    }
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] === ";") j++;

    const end = j;
    const indent = (src.slice(lineStart, start).match(/^[ \t]*/)?.[0] || "") + "";
    // Use the indent of the statement line
    const stmtIndent = src.slice(lineStart, start).match(/^[ \t]*/)?.[0] || "      ";

    let opts = src.slice(i, optsEnd + 1);
    opts = ensureMessageInOpts(opts);
    const q = m[1];

    const block = `try {
${stmtIndent}  const leadRes = await fetch(${q}/api/submit-lead${q}, ${opts});
${stmtIndent}  if (!leadRes.ok) {
${stmtIndent}    console.warn("Lead webhook notification failed; continuing.");
${stmtIndent}  }
${stmtIndent}} catch (err) {
${stmtIndent}  console.warn("Lead webhook notification failed;", err);
${stmtIndent}}`;

    replacements.push({ start, end, block });
  }

  // apply from end to start
  for (let r = replacements.length - 1; r >= 0; r--) {
    const { start, end, block } = replacements[r];
    out = out.slice(0, start) + block + out.slice(end);
  }
  return out;
}

/** void notifyLeadWebhook({...}) → await in try/catch */
function transformVoidNotify(src) {
  let out = src;
  const re = /void\s+notifyLeadWebhook\s*\(/g;
  const replacements = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index;
    const paren = start + m[0].length - 1;
    let i = paren + 1;
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] !== "{") continue;
    const objEnd = matchBrace(src, i);
    if (objEnd === -1) continue;
    let j = objEnd + 1;
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] !== ")") continue;
    j++;
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] === ";") j++;

    const lineStart = src.lastIndexOf("\n", start) + 1;
    const stmtIndent = src.slice(lineStart, start).match(/^[ \t]*/)?.[0] || "      ";
    let obj = src.slice(i, objEnd + 1);
    if (!/message\s*:/.test(obj)) {
      obj = obj.replace(
        /\}\s*$/,
        `,\n        message: data.message ?? data.description ?? data.caseOverview ?? data.caseBrief ?? "",\n      }`
      );
    }
    const block = `try {
${stmtIndent}  await notifyLeadWebhook(${obj});
${stmtIndent}} catch (err) {
${stmtIndent}  console.warn("Lead webhook notification failed;", err);
${stmtIndent}}`;
    replacements.push({ start, end: j, block });
  }
  for (let r = replacements.length - 1; r >= 0; r--) {
    const { start, end, block } = replacements[r];
    out = out.slice(0, start) + block + out.slice(end);
  }
  return out;
}

function fixDupMessageRoute(src) {
  let out = src;
  // message,\n message: lead.message ...
  out = out.replace(
    /(\n\s*)message,(\s*\n\s*)message:\s*lead\.message\s*\?\?\s*lead\.description\s*\?\?\s*"",?/g,
    '$1message: lead.message ?? lead.description ?? message ?? "",'
  );
  out = out.replace(
    /(\n\s*)message:\s*([^,\n]+),(\s*\n\s*)message:\s*lead\.message\s*\?\?\s*lead\.description\s*\?\?\s*"",?/g,
    '$1message: lead.message ?? lead.description ?? ($2),'
  );
  return out;
}

function fixSubmitLeadClient(src) {
  if (!/submitLeadNotification|\/api\/submit-lead/.test(src)) return src;
  // Always rewrite to clean async awaited helper
  if (
    /submitLeadNotification/.test(src) ||
    /Fire-and-forget/.test(src)
  ) {
    return `/**
 * Client-side lead notification.
 * Callers should await so the webhook request completes before thank-you.
 */
export async function submitLeadNotification(data: {
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
}): Promise<void> {
  try {
    const leadRes = await fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        message: data.message || "",
      }),
    });
    if (!leadRes.ok) {
      console.warn("Lead webhook notification failed; continuing.");
    }
  } catch (err) {
    console.warn("Lead webhook notification failed;", err);
  }
}
`;
  }
  return src;
}

function ensureCallersAwaitSubmitLeadNotification(src) {
  // submitLeadNotification(...) → await submitLeadNotification(...)
  return src.replace(
    /(?<!await\s)(?<!function\s)submitLeadNotification\s*\(/g,
    "await submitLeadNotification("
  );
}

const report = [];

function processFile(relPath) {
  const [repo, ...rest] = relPath.split("/");
  const rel = rest.join("/");
  const abs = path.join(ROOT, repo, rel);
  if (!fs.existsSync(abs)) {
    report.push(`MISSING ${relPath}`);
    return;
  }

  // Prefer clean HEAD for form files that we mangled
  let src = gitShow(repo, rel);
  if (!src) src = fs.readFileSync(abs, "utf8");

  let next = src;

  if (rel.endsWith("submitLeadClient.ts")) {
    next = fixSubmitLeadClient(next);
  } else if (rel.includes("api/submit-lead/route.ts")) {
    // Start from current file for routes (may have good changes + dup)
    next = fs.readFileSync(abs, "utf8");
    // If dup, fix; if still missing message wiring from HEAD merge carefully
    next = fixDupMessageRoute(next);
    // If somehow still has duplicate resolve
    if ((next.match(/\bmessage\s*:/g) || []).length >= 2 && /notifyLeadWebhook\(\s*\{/.test(next)) {
      next = next.replace(
        /notifyLeadWebhook\(\s*\{([\s\S]*?)\}\s*(?:,|\))/,
        (full, body) => {
          const cleaned = body
            .replace(/\n\s*message,\s*\n/g, "\n")
            .replace(/\n\s*message:\s*lead\.message\s*\?\?\s*lead\.description\s*\?\?\s*"",?\s*\n/g, "\n");
          if (/message\s*:/.test(cleaned)) {
            return full.replace(body, cleaned);
          }
          return full.replace(
            body,
            `${cleaned.replace(/\s*$/, "")}\n      message: lead.message ?? lead.description ?? message ?? "",\n    `
          );
        }
      );
    }
  } else {
    next = transformFireAndForgetFetch(next);
    next = transformVoidNotify(next);
    next = ensureCallersAwaitSubmitLeadNotification(next);
  }

  // Fix aigeos-style preferBlock leftovers shouldn't exist from clean HEAD

  if (next !== fs.readFileSync(abs, "utf8")) {
    report.push(relPath);
    if (APPLY) fs.writeFileSync(abs, next, "utf8");
  } else if (next !== src) {
    report.push(relPath + " (same as disk?)");
  }
}

function main() {
  for (const f of BROKEN_FILES) processFile(f);
  console.log(
    JSON.stringify({ mode: APPLY ? "APPLY" : "DRY_RUN", fixed: report }, null, 2)
  );
}

main();
