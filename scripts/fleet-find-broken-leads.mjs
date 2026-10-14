/**
 * Find broken Netlify submit-lead patterns from the unsafe fleet patch.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";

const findings = [];

function scanFile(repo, rel, text) {
  const issues = [];

  // Bare `message,` inside a build* helper (not message: ...)
  const buildRe = /function\s+build\w*\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g;
  let m;
  while ((m = buildRe.exec(text))) {
    const block = m[0];
    if (/\n\s*message,\s*\n/.test(block) && !/message\s*:/.test(block.split(/\n\s*message,\s*\n/)[0].slice(-80))) {
      // has bare message, line
      if (!/\bmessage\b/.test(block.match(/function[^{]+/)?.[0] || "")) {
        issues.push("bare_message_in_build_helper");
      }
    }
  }

  // const message inside try before catch, then message used after
  if (/try\s*\{[^}]*const\s+message\s*=/.test(text) && /catch\s*\([^)]*\)\s*\{[\s\S]*?\}\s*[\s\S]*?\bmessage\b/.test(text)) {
    // crude: message declared in try
    const tryBlocks = [...text.matchAll(/try\s*\{([\s\S]*?)\}\s*catch/g)];
    for (const tb of tryBlocks) {
      if (/const\s+message\s*=/.test(tb[1])) {
        const after = text.slice(tb.index + tb[0].length);
        // if message referenced in outbound after this catch
        if (/\bmessage\b/.test(after.slice(0, 800)) && !/const\s+message\s*=/.test(after.slice(0, 400))) {
          issues.push("message_declared_inside_try");
          break;
        }
      }
    }
  }

  // outbound has message, but no resolveLeadMessage / const message anywhere
  if (/\n\s*message,\s*\n/.test(text) && !/resolveLeadMessage|const\s+message\s*=/.test(text)) {
    issues.push("message_without_definition");
  }

  // resolveLeadMessage(body) but only payload variable
  if (/resolveLeadMessage\(\s*body\s*\)/.test(text) && !/\b(?:let|const|var)\s+body\b/.test(text) && /\b(?:let|const|var)\s+payload\b/.test(text)) {
    issues.push("resolve_body_but_var_is_payload");
  }

  // bare message in object that's returned from build helper
  if (/return\s*\{[\s\S]*?\n\s*message,\s*\n[\s\S]*?\}/.test(text)) {
    const returns = [...text.matchAll(/return\s*(\{[\s\S]*?\n\s*\})/g)];
    for (const r of returns) {
      if (/\n\s*message,\s*\n/.test(r[1]) && !/message\s*:/.test(r[1])) {
        // check if inside a function that doesn't have message param
        issues.push("bare_message_in_return_object");
        break;
      }
    }
  }

  if (issues.length) {
    findings.push({ repo, file: rel, issues: [...new Set(issues)] });
  }
}

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  const candidates = [
    "netlify/functions/submit-lead.js",
    "netlify/functions/submit-lead.cjs",
    "netlify/functions/submit-lead.ts",
  ];
  for (const rel of candidates) {
    const fp = path.join(project, rel);
    if (!fs.existsSync(fp)) continue;
    scanFile(ent.name, rel, fs.readFileSync(fp, "utf8"));
  }
}

console.log(JSON.stringify({ count: findings.length, findings }, null, 2));
