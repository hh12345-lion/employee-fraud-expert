/**
 * Fix SILENT lead failures (batch B):
 * - await submit-lead / notifyLeadWebhook (no void/fire-and-forget)
 * - include free-text as lowercase `message`
 * - expand resolveLeadMessage aliases
 * - MENA-expert-witness / middle-east-expert: prefer 502 when URL set and fetch fails
 *
 * Dry-run:  node scripts/fleet-fix-silent-batch-b.mjs
 * Apply:    node scripts/fleet-fix-silent-batch-b.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const APPLY = process.argv.includes("--apply");

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

function matchParen(src, openIdx) {
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
    if (c === "(") depth++;
    else if (c === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function expandAliases(src) {
  if (!/function\s+resolveLeadMessage|export\s+function\s+resolveLeadMessage/.test(src)) {
    return src;
  }
  return src.replace(
    /((?:export\s+)?function\s+resolveLeadMessage\s*\([^)]*\)[^{]*\{[\s\S]*?const\s+keys\s*=\s*\[)([\s\S]*?)(\]\s*(?:as\s+const)?\s*;)/,
    (m, open, body, close) => {
      const existing = new Set(
        [...body.matchAll(/["']([^"']+)["']/g)].map((x) => x[1])
      );
      if (existing.size === 0) return m;
      const merged = [...existing];
      for (const a of REQUIRED_ALIASES) {
        if (!existing.has(a)) merged.push(a);
      }
      const indent = "    ";
      const asConst = /as\s+const/.test(close) ? " as const" : "";
      return `${open}\n${indent}${merged.map((k) => `"${k}"`).join(`,\n${indent}`)}\n  ]${asConst};`;
    }
  );
}

function ensureMessageInOpts(optsSrc) {
  if (/message\s*:/.test(optsSrc) || /\bmessage\s*,/.test(optsSrc)) return optsSrc;
  const bodyIdx = optsSrc.search(/body:\s*JSON\.stringify\s*\(/);
  if (bodyIdx === -1) return optsSrc;
  const paren = optsSrc.indexOf("(", bodyIdx);
  let i = paren + 1;
  while (i < optsSrc.length && /\s/.test(optsSrc[i])) i++;
  if (optsSrc[i] !== "{") {
    // JSON.stringify(lead) / JSON.stringify(payload) — leave as-is if var likely has message
    return optsSrc;
  }
  const end = matchBrace(optsSrc, i);
  if (end === -1) return optsSrc;
  const inner = optsSrc.slice(i + 1, end);
  if (/message\s*:/.test(inner) || /^\s*message\s*,/m.test(inner)) return optsSrc;
  const msg = pickMessageExpr(inner);
  const trimmed = inner.replace(/\s*$/, "");
  const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
  const newInner = `${trimmed}${comma}\n          message: ${msg},\n        `;
  return optsSrc.slice(0, i + 1) + newInner + optsSrc.slice(end);
}

function pickMessageExpr(body) {
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
    /data\.caseOverview/,
    /data\.message/,
    /values\.caseSummary/,
    /values\.caseBrief/,
    /values\.description/,
    /values\.message/,
    /form\.message/,
    /currentFormData\.message/,
    /validatedInput\.message/,
    /lead\.message/,
  ];
  for (const re of candidates) {
    const m = body.match(re);
    if (m) return `${m[0]} ?? ""`;
  }
  return `payload?.description ?? payload?.enquiry ?? payload?.details ?? payload?.summary ?? payload?.notes ?? payload?.matter ?? payload?.caseSummary ?? payload?.caseBrief ?? payload?.message ?? data?.description ?? data?.enquiry ?? data?.message ?? ""`;
}

/** Brace-aware: void/bare fetch("/api/submit-lead", ...) → soft await */
function transformFireAndForgetFetch(src) {
  let out = src;
  const re = /(?:void\s+)?fetch\s*\(\s*(['"`])\/api\/submit-lead\1\s*,/g;
  const replacements = [];

  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index;
    const before = src.slice(Math.max(0, start - 30), start);
    if (/await\s+$/.test(before)) continue;
    // Skip Promise.all parallel entries (already awaited by Promise.all)
    const beforeWide = src.slice(Math.max(0, start - 400), start);
    if (/Promise\.all\s*\(/.test(beforeWide)) {
      // Heuristic: still inside the Promise.all([ ... ]) call
      const afterAll = beforeWide.slice(beforeWide.lastIndexOf("Promise.all"));
      const opens = (afterAll.match(/\[/g) || []).length;
      const closes = (afterAll.match(/\]/g) || []).length;
      if (opens > closes) continue;
    }
    const lineStart = src.lastIndexOf("\n", start) + 1;
    const linePrefix = src.slice(lineStart, start);
    if (/const\s+|let\s+|var\s+|return\s+/.test(linePrefix)) continue;
    // Skip if assigned: const x = fetch or leadRes = fetch
    if (/=\s*$/.test(linePrefix.trimEnd())) continue;

    let i = m.index + m[0].length;
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] !== "{") continue;
    const optsEnd = matchBrace(src, i);
    if (optsEnd === -1) continue;

    let j = optsEnd + 1;
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] !== ")") continue;
    j++;
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src.slice(j, j + 6) === ".catch") {
      const catchParen = src.indexOf("(", j);
      if (catchParen === -1) continue;
      const catchEnd = matchParen(src, catchParen);
      if (catchEnd === -1) continue;
      j = catchEnd + 1;
    }
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] === ";") j++;

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

    replacements.push({ start, end: j, block });
  }

  for (let r = replacements.length - 1; r >= 0; r--) {
    const { start, end, block } = replacements[r];
    out = out.slice(0, start) + block + out.slice(end);
  }
  return out;
}

/** void notifyLeadWebhook({...}) → await try/catch */
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
      const msg = pickMessageExpr(obj);
      obj = obj.replace(/\}\s*$/, `,\n        message: ${msg},\n      }`);
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

/** void postLeadNotification(...) / void postSubmitLead(...) → await */
function transformVoidNamedLeadPosts(src) {
  let out = src;
  for (const name of ["postLeadNotification", "postSubmitLead"]) {
    const re = new RegExp(`void\\s+${name}\\s*\\(`, "g");
    const replacements = [];
    let m;
    while ((m = re.exec(out)) !== null) {
      const start = m.index;
      const paren = start + m[0].length - 1;
      const endParen = matchParen(out, paren);
      if (endParen === -1) continue;
      let j = endParen + 1;
      while (j < out.length && /\s/.test(out[j])) j++;
      if (out[j] === ";") j++;
      const lineStart = out.lastIndexOf("\n", start) + 1;
      const stmtIndent = out.slice(lineStart, start).match(/^[ \t]*/)?.[0] || "      ";
      const call = out.slice(start + 5, endParen + 1); // drop "void "
      const block = `try {
${stmtIndent}  await ${call};
${stmtIndent}} catch (err) {
${stmtIndent}  console.warn("Lead webhook notification failed;", err);
${stmtIndent}}`;
      replacements.push({ start, end: j, block });
    }
    for (let r = replacements.length - 1; r >= 0; r--) {
      const { start, end, block } = replacements[r];
      out = out.slice(0, start) + block + out.slice(end);
    }
  }
  return out;
}

function fixNotifyLeadClientHelper(src) {
  const isNotify = /export function notifyLeadSubmission/.test(src);
  const isSubmit = /export function submitLeadNotification/.test(src);
  if (!isNotify && !isSubmit) return src;
  if (!/\/api\/submit-lead/.test(src)) return src;
  if (/await\s+fetch/.test(src) && /export async function/.test(src)) return src;

  if (isNotify) {
    return `export interface LeadNotifyInput {
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
}

/**
 * Client-side lead notification.
 * Callers should await so the webhook request completes before thank-you.
 */
export async function notifyLeadSubmission(input: LeadNotifyInput): Promise<void> {
  try {
    const leadRes = await fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone ?? "",
        message: input.message ?? "",
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

function ensureCallersAwait(src, fnNames) {
  let out = src;
  for (const name of fnNames) {
    out = out.replace(
      new RegExp(`(?<!await\\s)(?<!function\\s)(?<!async function\\s)${name}\\s*\\(`, "g"),
      (m, offset) => {
        const before = out.slice(Math.max(0, offset - 40), offset);
        if (/export\s+(?:async\s+)?function\s+$/.test(before)) return m;
        if (/await\s+$/.test(before)) return m;
        if (new RegExp(`function\\s+${name}\\s*$`).test(before)) return m;
        return `await ${name}(`;
      }
    );
  }
  return out;
}

function fixMenaMiddleEast502(src, repo) {
  if (repo !== "MENA-expert-witness" && repo !== "middle-east-expert") return src;
  let out = src;
  // Prefer 502 when webhook URL is set and fetch fails (keep 200 when URL missing)
  if (/statusCode:\s*500/.test(out) && /Webhook returned|submit-lead function error/.test(out)) {
    out = out.replace(
      /return \{\s*statusCode:\s*500,\s*headers:\s*\{\s*"Content-Type":\s*"application\/json"\s*\},\s*body:\s*JSON\.stringify\(\{\s*error:\s*"Server error"\s*\}\),\s*\};/,
      `return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "WEBHOOK_FAILED" }),
    };`
    );
  }
  return out;
}

function processFile(repo, file, src) {
  const rel = path.relative(path.join(ROOT, repo), file).replace(/\\/g, "/");
  const base = path.basename(file).toLowerCase();
  let out = src;
  const changes = [];

  // Netlify submit-lead
  if (
    (base === "submit-lead.js" || base === "submit-lead.cjs") &&
    rel.includes("netlify/functions")
  ) {
    let next = expandAliases(out);
    next = fixMenaMiddleEast502(next, repo);
    if (next !== out) {
      changes.push(
        repo === "MENA-expert-witness" || repo === "middle-east-expert"
          ? "aliases + 502 on webhook fail"
          : "expand resolveLeadMessage aliases"
      );
      out = next;
    }
  }

  // TS/JS resolveLeadMessage helpers
  if (/resolveLeadMessage/.test(out) && /const\s+keys\s*=/.test(out)) {
    const next = expandAliases(out);
    if (next !== out) {
      changes.push("expand resolveLeadMessage aliases");
      out = next;
    }
  }

  // Client fire-and-forget helpers
  if (
    base === "notify-lead-client.ts" ||
    base === "submitleadclient.ts" ||
    (base === "submit-lead-client.ts" && /Fire-and-forget/.test(out))
  ) {
    const next = fixNotifyLeadClientHelper(out);
    if (next !== out) {
      changes.push("client helper → async await");
      out = next;
    }
  }

  // pakistan / legalaid style helpers by content
  if (
    (/export function submitLeadNotification/.test(out) ||
      /export function notifyLeadSubmission/.test(out)) &&
    /\/api\/submit-lead/.test(out) &&
    !/await\s+fetch/.test(out)
  ) {
    const next = fixNotifyLeadClientHelper(out);
    if (next !== out) {
      changes.push("client helper → async await");
      out = next;
    }
  }

  // Forms / pages with fire-and-forget
  if (
    /(?:void\s+)?fetch\s*\(\s*['"`]\/api\/submit-lead/.test(out) ||
    /void\s+notifyLeadWebhook\s*\(/.test(out) ||
    /void\s+postLeadNotification\s*\(/.test(out) ||
    /void\s+postSubmitLead\s*\(/.test(out)
  ) {
    let next = transformFireAndForgetFetch(out);
    next = transformVoidNotify(next);
    next = transformVoidNamedLeadPosts(next);
    if (next !== out) {
      changes.push("await submit-lead/notify (soft)");
      out = next;
    }
  }

  // Await callers of client helpers
  if (
    /notifyLeadSubmission\s*\(/.test(out) ||
    /submitLeadNotification\s*\(/.test(out)
  ) {
    const next = ensureCallersAwait(out, [
      "notifyLeadSubmission",
      "submitLeadNotification",
    ]);
    // Don't touch the export definitions file wrongly — ensureCallersAwait skips function defs
    if (next !== out && !/export async function notifyLeadSubmission/.test(out.slice(0, 200))) {
      // Only note if we added await to call sites
      if (/await notifyLeadSubmission|await submitLeadNotification/.test(next) &&
          !/await notifyLeadSubmission|await submitLeadNotification/.test(out)) {
        changes.push("await client notify callers");
        out = next;
      } else if (next !== out) {
        // may have added await to already-awaited — check carefully
        const added =
          (next.match(/await notifyLeadSubmission/g) || []).length >
            (out.match(/await notifyLeadSubmission/g) || []).length ||
          (next.match(/await submitLeadNotification/g) || []).length >
            (out.match(/await submitLeadNotification/g) || []).length;
        if (added) {
          changes.push("await client notify callers");
          out = next;
        }
      }
    } else if (next !== out) {
      const added =
        (next.match(/await notifyLeadSubmission\(/g) || []).length >
          (out.match(/await notifyLeadSubmission\(/g) || []).length ||
        (next.match(/await submitLeadNotification\(/g) || []).length >
          (out.match(/await submitLeadNotification\(/g) || []).length;
      if (added) {
        changes.push("await client notify callers");
        out = next;
      }
    }
  }

  // lawstone schema: make postContactSubmit await the lead fetch
  if (rel.includes("endpoints/contact/submit_POST.schema.ts") && /void fetch/.test(out)) {
    let next = transformFireAndForgetFetch(out);
    if (next !== out) {
      changes.push("await submit-lead in contact schema");
      out = next;
    }
  }

  if (changes.length && write(file, out, src)) {
    for (const c of changes) note(repo, rel, c);
    return true;
  }
  if (changes.length && out !== src) {
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
      const rel = path.relative(project, file).replace(/\\/g, "/");
      const base = path.basename(file).toLowerCase();
      const interesting =
        /submit-lead|lead-notification|leadNotification|lead_notification|notify-lead|notifyLead|submitLead|ContactForm|InstructForm|RetainForm|QuoteForm|NetlifyForm|Contact\.jsx|Contact\.tsx|contact\.tsx|DocketForm|submit_POST\.schema/i.test(
          rel + base
        ) ||
        /(?:void\s+)?fetch\s*\(\s*['"`]\/api\/submit-lead/.test(src) ||
        /void\s+notifyLeadWebhook/.test(src) ||
        /void\s+postLeadNotification/.test(src) ||
        /void\s+postSubmitLead/.test(src) ||
        (/resolveLeadMessage/.test(src) &&
          (/netlify\/functions\/submit-lead/.test(rel) ||
            /lead-notification|leadNotification/.test(rel)));

      if (!interesting) continue;
      if (processFile(repo, file, src)) filesChanged++;
    }
    if (!report[repo]) note(repo, "-", "already correct (await + message)");
  }

  console.log(
    JSON.stringify({ mode: APPLY ? "APPLY" : "DRY_RUN", filesChanged, report }, null, 2)
  );
}

main();
