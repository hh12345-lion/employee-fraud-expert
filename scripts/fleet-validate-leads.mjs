/**
 * Validate Netlify submit-lead.js for remaining breakage patterns.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const bad = [];

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  for (const rel of ["netlify/functions/submit-lead.js", "netlify/functions/submit-lead.cjs"]) {
    const fp = path.join(ROOT, ent.name, rel);
    if (!fs.existsSync(fp)) continue;
    const t = fs.readFileSync(fp, "utf8");
    const issues = [];

    // message inside try with JSON.parse
    if (/try\s*\{[^}]*JSON\.parse[^}]*const\s+message\s*=/.test(t.replace(/\n/g, " "))) {
      // more precise:
      if (/try\s*\{\s*\n\s*(?:body|payload|parsed|json)\s*=\s*JSON\.parse[\s\S]*?const\s+message\s*=[\s\S]*?\}\s*catch/.test(t)) {
        issues.push("message_in_try");
      }
    }

    // bare message in build helper without param
    const buildFns = [...t.matchAll(/function\s+(build\w*)\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\}/g)];
    for (const m of buildFns) {
      const params = m[2];
      const body = m[3];
      if (/\n\s*message,\s*\n/.test(body) && !/\bmessage\b/.test(params) && !/message\s*:/.test(body)) {
        issues.push(`bare_message_in_${m[1]}`);
      }
    }

    // mangled resolver: param payload but uses body
    if (/function\s+resolveLeadMessage\s*\(\s*payload\s*\)\s*\{[\s\S]*?\bbody\b/.test(t)) {
      issues.push("mangled_resolver_payload_body");
    }
    if (/function\s+resolveLeadMessage\s*\(\s*parsed\s*\)\s*\{[\s\S]*?\bbody\b/.test(t)) {
      issues.push("mangled_resolver_parsed_body");
    }

    // resolveLeadMessage(body) but no body var (and has payload)
    if (/resolveLeadMessage\(\s*body\s*\)/.test(t) && !/\b(?:let|const|var)\s+body\b/.test(t) && !/function\s+resolveLeadMessage\s*\(\s*body\s*\)/.test(t)) {
      if (/\b(?:let|const|var)\s+payload\b/.test(t) || /\bpayload\s*=\s*JSON\.parse/.test(t)) {
        issues.push("resolve_body_missing_var");
      }
    }

    // duplicate const message
    if ((t.match(/^\s*const\s+message\s*=/gm) || []).length > 1) {
      issues.push("duplicate_const_message");
    }

    // ReferenceError risk: outbound message, without const message or message:
    if (/\n\s*message,\s*\n/.test(t) && !/const\s+message\s*=/.test(t) && !/message\s*:\s*resolveLeadMessage/.test(t)) {
      // allow if in destructure of build that has message param
      if (!/function\s+build\w*\s*\(\s*\{[^}]*\bmessage\b/.test(t)) {
        issues.push("undefined_message_shorthand");
      }
    }

    // CJS syntax check
    if (!/\bexport\s|\bimport\s/.test(t)) {
      try {
        new Function(t);
      } catch (e) {
        issues.push(`syntax:${e.message}`);
      }
    }

    if (issues.length) bad.push({ repo: ent.name, file: rel, issues });
  }
}

console.log(JSON.stringify({ badCount: bad.length, bad }, null, 2));
