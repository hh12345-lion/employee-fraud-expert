/**
 * Proper hot-repair for broken Netlify submit-lead message patches.
 * 1) Normalize resolveLeadMessage helper to a known-good implementation
 * 2) Fix try-scoped const message
 * 3) Fix call sites to use the correct local var
 * 4) Fix build helpers / outbound / duplicate consts
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";

const RESOLVER = `/** Map site-specific free-text field names to universal \`message\`. */
function resolveLeadMessage(body) {
  if (!body || typeof body !== "object") return "";
  const keys = [
    "message",
    "Message",
    "description",
    "enquiry",
    "details",
    "summary",
    "notes",
    "matter",
    "caseSummary",
    "additionalInfo",
    "additional_info",
    "caseDetails",
    "enquiryDetails",
  ];
  for (const key of keys) {
    if (body[key] != null && String(body[key]).trim()) {
      return String(body[key]).trim();
    }
  }
  return "";
}`;

function detectParsedVar(text) {
  // Prefer the var that holds the parsed request JSON in the handler
  if (/\b(?:let|const|var)\s+payload\b/.test(text) && /payload\s*=\s*JSON\.parse/.test(text))
    return "payload";
  if (/\b(?:let|const|var)\s+parsed\b/.test(text) && /parsed\s*=\s*JSON\.parse/.test(text))
    return "parsed";
  if (/\b(?:let|const|var)\s+body\b/.test(text) && /body\s*=\s*JSON\.parse/.test(text))
    return "body";
  if (/\b(?:let|const|var)\s+json\b/.test(text) && /json\s*=\s*JSON\.parse/.test(text))
    return "json";
  // parseBody(json) style — use json param name in parseBody
  if (/function\s+parseBody\s*\(\s*json\s*\)/.test(text)) return "json";
  if (/function\s+parseBody\s*\(\s*body\s*\)/.test(text)) return "body";
  return "body";
}

function fixFile(text) {
  let t = text;
  const fixes = [];

  // Normalize any resolveLeadMessage function (any param name / mangled body)
  const resolverRe =
    /(?:\/\*\*[\s\S]*?\*\/\s*)?function\s+resolveLeadMessage\s*\(\s*\w+\s*\)\s*\{[\s\S]*?\n\}/;
  if (resolverRe.test(t)) {
    t = t.replace(resolverRe, RESOLVER);
    fixes.push("normalize_resolver");
  }

  // Move const message out of JSON.parse try
  // try {\n  X = JSON.parse(...);\n  const message = resolveLeadMessage(...);\n} catch
  t = t.replace(
    /(try\s*\{\s*\n)([ \t]*)((?:body|payload|parsed|json)\s*=\s*JSON\.parse\([^\n]+\)\s*;)\s*\n[ \t]*const\s+message\s*=\s*resolveLeadMessage\([^)]+\)\s*;\s*\n([ \t]*\}\s*catch)/g,
    (_, tryOpen, indent, assign, catchPart) => {
      fixes.push("move_message_out_of_try");
      const arg = assign.match(/^(\w+)/)[1];
      return `${tryOpen}${indent}${assign}\n${catchPart}\n\n${indent}const message = resolveLeadMessage(${arg});`;
    }
  );

  // Fix resolveLeadMessage(WRONG) call sites to correct local var
  const parsedVar = detectParsedVar(t);
  // Calls inside parseBody(json) should use json
  t = t.replace(
    /function\s+parseBody\s*\(\s*(\w+)\s*\)\s*\{([\s\S]*?)\n\}/g,
    (block, param, body) => {
      let b = body;
      if (/resolveLeadMessage\(\s*\w+\s*\)/.test(b)) {
        b = b.replace(/resolveLeadMessage\(\s*\w+\s*\)/g, `resolveLeadMessage(${param})`);
        fixes.push("parseBody_resolve_arg");
      }
      // Ensure message is returned in ok object if extracted
      if (/const\s+message\s*=\s*resolveLeadMessage/.test(b) && /return\s*\{\s*ok:\s*\{/.test(b)) {
        if (!/ok:\s*\{[^}]*\bmessage\b/.test(b)) {
          b = b.replace(
            /return\s*\{\s*ok:\s*\{\s*fullName,\s*email,\s*phone\s*\}/,
            "return { ok: { fullName, email, phone, message }"
          );
          fixes.push("parseBody_include_message_in_ok");
        }
      }
      return `function parseBody(${param}) {${b}\n}`;
    }
  );

  // Handler-level resolveLeadMessage calls (not inside the helper def)
  // Replace wrong args except inside the function definition we already normalized
  t = t.replace(
    /(?<!function\s)resolveLeadMessage\(\s*(?!body\b)(\w+)\s*\)/g,
    (m, arg) => {
      // Keep if arg is the correct parsed var OR is intentionally data/json from caller
      if (arg === parsedVar || arg === "json" || arg === "data" || arg === "lead") return m;
      // If call is resolveLeadMessage(body) and body doesn't exist, fix
      if (arg === "body" && parsedVar !== "body") {
        fixes.push(`call_arg_${arg}_to_${parsedVar}`);
        return `resolveLeadMessage(${parsedVar})`;
      }
      if (arg === "payload" && parsedVar !== "payload" && parsedVar !== "body") {
        // might be correct if payload exists
        if (!/\b(?:let|const|var)\s+payload\b/.test(t) && !/\bpayload\s*=/.test(t)) {
          fixes.push(`call_arg_payload_to_${parsedVar}`);
          return `resolveLeadMessage(${parsedVar})`;
        }
      }
      if (arg === "parsed" && !/\b(?:let|const|var)\s+parsed\b/.test(t) && !/\bparsed\s*=/.test(t)) {
        fixes.push(`call_arg_parsed_to_${parsedVar}`);
        return `resolveLeadMessage(${parsedVar})`;
      }
      return m;
    }
  );

  // build helpers: bare message → use param
  t = t.replace(
    /(function\s+build\w*\s*\(\s*\{([^}]*)\}\s*\)\s*\{[\s\S]*?domain:\s*[^\n]+,)(\s*\n\s*)message,/g,
    (full, prefix, params, ws) => {
      if (/\bmessage\b/.test(params)) return full;
      fixes.push("build_destructure_add_message");
      const newParams = params.trim() ? `${params.trim()}, message = ""` : `message = ""`;
      return full
        .replace(/\{[^}]*\}/, `{ ${newParams} }`)
        .replace(/\n(\s*)message,/, `${ws}message,`);
    }
  );

  t = t.replace(
    /(function\s+build\w*\s*\(\s*(\w+)\s*\)\s*\{[\s\S]*?domain:\s*[^\n]+,)(\s*\n\s*)message,/g,
    (full, prefix, argName, ws) => {
      if (/message\s*:/.test(full)) return full;
      fixes.push("build_data_message_prop");
      return `${prefix}${ws}message: ${argName}.message ?? "",`;
    }
  );

  // Pass message into build*({ fullName, email, phone })
  t = t.replace(
    /build(LeadWebhookPayload|Payload|Outbound)\(\s*\{\s*fullName,\s*email,\s*phone((?:\s*:\s*[^,}]+)?)(\s*)\}\s*\)/g,
    (m, name, phoneExtra, sp) => {
      if (/message/.test(m)) return m;
      fixes.push("pass_message_to_build");
      return `build${name}({ fullName, email, phone${phoneExtra || ""}, message })`;
    }
  );

  // Outbound bare message without const message → inline resolve
  if (/\n\s*message,\s*\n/.test(t) && !/const\s+message\s*=/.test(t)) {
    t = t.replace(
      /(domain:\s*[^\n]+,)\s*\n(\s*)message,/,
      (_, dom, indent) => {
        fixes.push("inline_message_resolve");
        return `${dom}\n${indent}message: resolveLeadMessage(${parsedVar}),`;
      }
    );
  }

  // Duplicate const message — keep resolveLeadMessage version
  t = t.replace(
    /(const\s+message\s*=\s*resolveLeadMessage\([^)]+\);)\s*\n\s*const\s+message\s*=\s*[\s\S]*?;/g,
    (_, keep) => {
      fixes.push("dedupe_const_message");
      return keep;
    }
  );

  // formType between two message consts
  t = t.replace(
    /(const\s+message\s*=\s*resolveLeadMessage\([^)]+\);)\s*\n(\s*const\s+formType\s*=\s*[^\n]+\n)\s*const\s+message\s*=\s*[\s\S]*?;/g,
    (_, keep, mid) => {
      fixes.push("dedupe_const_message_with_formType");
      return keep + "\n" + mid;
    }
  );

  return { text: t, fixes: [...new Set(fixes)], changed: t !== text };
}

function syntaxOk(text, file) {
  // ESM files use export — strip export for check, or use acorn-free heuristic
  if (/\bexport\s+/.test(text) || /\bimport\s+/.test(text)) {
    // Basic bracket balance
    const opens = (text.match(/\{/g) || []).length;
    const closes = (text.match(/\}/g) || []).length;
    if (opens !== closes) return false;
    // Check no `const message` inside try before catch without being closed
    if (/try\s*\{[^}]*const\s+message\s*=/.test(text)) return false;
    return true;
  }
  try {
    new Function(text);
    return true;
  } catch {
    return false;
  }
}

const results = { fixed: [], skipped: [], unchanged: 0 };

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  for (const rel of ["netlify/functions/submit-lead.js", "netlify/functions/submit-lead.cjs"]) {
    const fp = path.join(project, rel);
    if (!fs.existsSync(fp)) continue;
    const original = fs.readFileSync(fp, "utf8");
    // Only touch files that look message-patched or already partially fixed
    if (!/resolveLeadMessage|^\s*message,/m.test(original) && !/message:\s*resolveLeadMessage/.test(original)) {
      results.unchanged++;
      continue;
    }
    const { text, fixes, changed } = fixFile(original);
    if (!changed) {
      results.unchanged++;
      continue;
    }
    if (!syntaxOk(text, rel)) {
      results.skipped.push({ repo: ent.name, file: rel, fixes, reason: "syntax_check_failed" });
      continue;
    }
    fs.writeFileSync(fp, text, "utf8");
    results.fixed.push({ repo: ent.name, file: rel, fixes });
  }
}

console.log(JSON.stringify(results, null, 2));
