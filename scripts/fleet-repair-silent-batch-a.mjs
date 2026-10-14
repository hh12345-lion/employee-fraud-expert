/**
 * Repair broken soft-await transforms from fleet-fix-silent-batch-a.mjs
 * where non-greedy \{[\s\S]*?\} matched JSON.stringify body instead of fetch opts.
 *
 * Apply: node scripts/fleet-repair-silent-batch-a.mjs --apply
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

const report = [];

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
    else if (/\.(tsx?|jsx?)$/.test(ent.name)) acc.push(full);
  }
  return acc;
}

/**
 * Find matching closing brace starting at openIdx (which points at '{').
 * Respects strings.
 */
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

/** Fix corrupted try { const leadRes = await fetch(... mangled ...}).catch */
function repairBrokenAwaitFetch(src) {
  // Detect corruption marker: `});` missing after stringify, then `if (leadRes` inside try, then `},` + `}).catch`
  if (
    !/const leadRes = await fetch\(/.test(src) ||
    !/\}\s*catch \(err\)[\s\S]{0,120}\},\s*\n\s*\}\)\.catch/.test(src)
  ) {
    // Also match variant ending with `},` then `}).catch`
    if (
      !/Lead webhook notification failed; continuing/.test(src) ||
      !/\}\)\.catch\(/.test(src)
    ) {
      return src;
    }
  }

  let out = src;
  // Repeatedly find and repair each corrupted block
  const marker = "const leadRes = await fetch(";
  let searchFrom = 0;
  while (true) {
    const idx = out.indexOf(marker, searchFrom);
    if (idx === -1) break;

    // Check if this block is corrupted: after fetch(url, { ... should close with });
    // Corruption has: body: JSON.stringify({...});  then if (leadRes
    const after = out.slice(idx, idx + 800);
    if (!/JSON\.stringify\(\{[\s\S]*?\}\s*;\s*\n\s*if \(leadRes/.test(after)) {
      searchFrom = idx + marker.length;
      continue;
    }

    // Find start of try { before marker
    const tryIdx = out.lastIndexOf("try {", idx);
    if (tryIdx === -1 || idx - tryIdx > 40) {
      searchFrom = idx + marker.length;
      continue;
    }

    // Find fetch url quote
    const paren = idx + marker.length - 1; // points at '('
    // fetch("url", {
    const urlMatch = out.slice(paren).match(/^\(\s*(['"`])(\/api\/submit-lead)\1\s*,\s*/);
    if (!urlMatch) {
      searchFrom = idx + marker.length;
      continue;
    }
    const optsStart = paren + urlMatch[0].length; // index of '{'
    if (out[optsStart] !== "{") {
      searchFrom = idx + marker.length;
      continue;
    }

    // The mangled version closed stringify with `};` then inserted if/catch mid-opts.
    // Reconstruct by extracting fields from the mangled body.
    const stringifyIdx = out.indexOf("JSON.stringify(", optsStart);
    if (stringifyIdx === -1) {
      searchFrom = idx + marker.length;
      continue;
    }
    const objStart = out.indexOf("{", stringifyIdx);
    const objEnd = matchBrace(out, objStart);
    if (objEnd === -1) {
      searchFrom = idx + marker.length;
      continue;
    }
    const payloadObj = out.slice(objStart, objEnd + 1);

    // Find the trailing `}).catch(...);` after the broken try/catch
    const catchTail = out.slice(objEnd);
    const tailMatch = catchTail.match(
      /^;\s*\n\s*if \(leadRes[\s\S]*?\}\s*catch \(err\)[\s\S]*?\},\s*\n\s*\}\)\.catch\(([\s\S]*?)\);/
    );
    if (!tailMatch) {
      // Try alternate: soft block already partial
      const alt = catchTail.match(
        /^;\s*\n\s*if \(leadRes[\s\S]*?console\.warn\("Lead webhook notification failed;", err\);\s*\n\s*\},\s*\n\s*\}\)\.catch\(([\s\S]*?)\);/
      );
      if (!alt) {
        searchFrom = idx + marker.length;
        continue;
      }
    }

    const fullTailRe =
      /;\s*\n\s*if \(leadRes[\s\S]*?\}\s*catch \(err\)[\s\S]*?\},\s*\n\s*\}\)\.catch\([\s\S]*?\);/;
    const tailFull = catchTail.match(fullTailRe);
    if (!tailFull) {
      searchFrom = idx + marker.length;
      continue;
    }

    // Detect indent from try line
    const lineStart = out.lastIndexOf("\n", tryIdx) + 1;
    const indent = out.slice(lineStart, tryIdx).match(/^[ \t]*/)?.[0] || "      ";
    const q = urlMatch[1];
    const url = urlMatch[2];

    // Extract method/headers from mangled opts (before stringify)
    const optsHead = out.slice(optsStart + 1, stringifyIdx);
    const methodMatch = optsHead.match(/method:\s*(['"`][^'"`]+['"`])/);
    const method = methodMatch ? methodMatch[1] : '"POST"';
    const headersMatch = optsHead.match(/headers:\s*(\{[\s\S]*?\})/);
    // headers may be truncated — use default
    const headers = headersMatch
      ? headersMatch[1]
      : '{ "Content-Type": "application/json" }';

    const replacement = `try {
${indent}  const leadRes = await fetch(${q}${url}${q}, {
${indent}    method: ${method},
${indent}    headers: ${headers.includes("Content-Type") ? headers : '{ "Content-Type": "application/json" }'},
${indent}    body: JSON.stringify(${payloadObj}),
${indent}  });
${indent}  if (!leadRes.ok) {
${indent}    console.warn("Lead webhook notification failed; continuing.");
${indent}  }
${indent}} catch (err) {
${indent}  console.warn("Lead webhook notification failed;", err);
${indent}}`;

    const endIdx = objEnd + tailFull[0].length;
    out = out.slice(0, tryIdx) + replacement + out.slice(endIdx);
    searchFrom = tryIdx + replacement.length;
  }

  return out;
}

/** Fix submitLeadClient that became sync function with await + corruption */
function repairSubmitLeadClient(src, file) {
  if (!/submitLeadClient|submitLeadNotification/.test(file + src)) return src;
  if (!/\/api\/submit-lead/.test(src)) return src;

  // Rebuild a clean async helper if corrupted or sync-with-await
  if (
    /JSON\.stringify\(\{[\s\S]*?\}\s*;\s*\n\s*if \(leadRes/.test(src) ||
    (/await fetch/.test(src) && /export function submitLeadNotification/.test(src))
  ) {
    return `/**
 * Client-side lead notification.
 * Awaited by callers so the webhook request completes before thank-you.
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

/** Fix duplicate message keys in notifyLeadWebhook({ message, message: ...}) */
function repairDuplicateMessage(src) {
  return src.replace(
    /(\n\s*)message,(\s*\n\s*)message:\s*lead\.message\s*\?\?\s*lead\.description\s*\?\?\s*"",/g,
    "$1message: lead.message ?? lead.description ?? message ?? \"\","
  ).replace(
    /(\n\s*)message:\s*([^,\n]+),(\s*\n\s*)message:\s*lead\.message\s*\?\?\s*lead\.description\s*\?\?\s*"",/g,
    "$1message: lead.message ?? lead.description ?? $2,"
  );
}

function main() {
  for (const repo of REPOS) {
    const project = path.join(ROOT, repo);
    if (!fs.existsSync(project)) continue;
    for (const file of walk(project)) {
      let src = fs.readFileSync(file, "utf8");
      const rel = path.relative(project, file).replace(/\\/g, "/");
      let next = src;
      next = repairBrokenAwaitFetch(next);
      next = repairSubmitLeadClient(next, rel);
      next = repairDuplicateMessage(next);

      // Fix local notify helpers that got double-awaited incorrectly — accounting was OK

      if (next !== src) {
        report.push(`${repo}/${rel}`);
        if (APPLY) fs.writeFileSync(file, next, "utf8");
      }
    }
  }
  console.log(
    JSON.stringify({ mode: APPLY ? "APPLY" : "DRY_RUN", repaired: report }, null, 2)
  );
}

main();
