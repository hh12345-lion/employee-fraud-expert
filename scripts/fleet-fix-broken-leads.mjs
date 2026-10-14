/**
 * Hotfix broken Netlify submit-lead.js patterns from the unsafe fleet message patch.
 * Fixes only known breakage; does not remove the message field.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";

function git(cwd, args) {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (e) {
    return { __err: true, out: String(e.stderr || e.message || "") };
  }
}

function fixText(text, repo) {
  let t = text;
  const fixes = [];

  // 1) Move `const message = resolveLeadMessage(...)` out of JSON.parse try block
  // Pattern:
  //   try {
  //     body = JSON.parse(...);
  //   const message = resolveLeadMessage(body);
  //   } catch {
  const tryMsgRe =
    /(try\s*\{\s*\n)(\s*)((?:body|payload|parsed)\s*=\s*JSON\.parse\([^\n]+\);\s*\n)\s*const\s+message\s*=\s*resolveLeadMessage\(([^)]+)\);\s*\n(\s*\}\s*catch)/g;
  if (tryMsgRe.test(t)) {
    t = t.replace(tryMsgRe, (_, tryOpen, indent, assign, arg, catchPart) => {
      fixes.push("move_message_out_of_try");
      return `${tryOpen}${indent}${assign}${catchPart}\n\n${indent}const message = resolveLeadMessage(${arg});`;
    });
  }

  // Also handle without newline quirks (message on same indent right after parse)
  const tryMsgRe2 =
    /(try\s*\{)(\s*)((?:let\s+|const\s+)?(?:body|payload|parsed)\s*=\s*JSON\.parse\([^;]+;)\s*const\s+message\s*=\s*resolveLeadMessage\(([^)]+)\);\s*(\}\s*catch)/g;
  // Already handled by first; skip if already fixed

  // 2) resolveLeadMessage(body) when only payload/parsed/json exists
  if (/resolveLeadMessage\(\s*body\s*\)/.test(t) && !/\b(?:let|const|var)\s+body\b/.test(t)) {
    if (/\b(?:let|const|var)\s+payload\b/.test(t)) {
      t = t.replace(/resolveLeadMessage\(\s*body\s*\)/g, "resolveLeadMessage(payload)");
      fixes.push("body_to_payload");
    } else if (/\b(?:let|const|var)\s+parsed\b/.test(t)) {
      t = t.replace(/resolveLeadMessage\(\s*body\s*\)/g, "resolveLeadMessage(parsed)");
      fixes.push("body_to_parsed");
    } else if (/\b(?:let|const|var)\s+json\b/.test(t)) {
      t = t.replace(/resolveLeadMessage\(\s*body\s*\)/g, "resolveLeadMessage(json)");
      fixes.push("body_to_json");
    }
  }

  // 3) Bare `message,` inside build* helper → message: (data|args).message ?? ""
  // Detect function buildX(...) { return { ... message, }; }
  t = t.replace(
    /(function\s+build\w*\s*\(\s*\{([^}]*)\}\s*\)\s*\{[\s\S]*?domain:\s*getSiteDomain\(\),)\s*\n(\s*)message,/g,
    (full, prefix, params, indent) => {
      if (/\bmessage\b/.test(params)) {
        fixes.push("bare_message_in_destructure_ok");
        return `${prefix}\n${indent}message,`;
      }
      // add message to destructure
      fixes.push("add_message_to_build_destructure");
      const newParams = params.trim() ? `${params.trim()}, message = ""` : `message = ""`;
      return full
        .replace(/function\s+build\w*\s*\(\s*\{[^}]*\}/, (sig) =>
          sig.replace(/\{[^}]*\}/, `{ ${newParams} }`)
        )
        .replace(/\n(\s*)message,/, `\n${indent}message,`);
    }
  );

  // buildLeadWebhookPayload(data) style with bare message
  t = t.replace(
    /(function\s+build\w*\s*\(\s*(\w+)\s*\)\s*\{[\s\S]*?domain:\s*getSiteDomain\(\),)\s*\n(\s*)message,/g,
    (full, prefix, argName, indent) => {
      fixes.push("bare_message_use_data_prop");
      return `${prefix}\n${indent}message: ${argName}.message ?? "",`;
    }
  );

  // 4) Outbound object with bare message but no const message — add resolve before outbound
  // If we have `message,` in an object literal in handler and no `const message`
  if (/\n\s*message,\s*\n/.test(t) && !/const\s+message\s*=/.test(t)) {
    // Prefer inserting after phone extract or after validation
    if (/domain:\s*getSiteDomain\(\),\s*\n\s*message,/.test(t)) {
      t = t.replace(
        /(domain:\s*getSiteDomain\(\),)\s*\n(\s*)message,/,
        (m, dom, indent) => {
          fixes.push("inline_resolve_on_outbound");
          // Find which var to use
          let arg = "body";
          if (/\bconst\s+\{[^}]*\}\s*=\s*payload/.test(t) || /\bpayload\b/.test(t)) {
            if (/\b(?:let|const|var)\s+payload\b/.test(t)) arg = "payload";
          }
          if (/\b(?:let|const|var)\s+parsed\b/.test(t)) arg = "parsed";
          return `${dom}\n${indent}message: resolveLeadMessage(${arg}),`;
        }
      );
    }
  }

  // 5) Duplicate const message declarations — keep resolveLeadMessage one, remove following duplicate
  const dupMsg =
    /const\s+message\s*=\s*resolveLeadMessage\([^)]+\);\s*\n\s*const\s+message\s*=\s*[\s\S]*?;\s*\n/;
  if (dupMsg.test(t)) {
    t = t.replace(dupMsg, (m) => {
      fixes.push("remove_duplicate_const_message");
      const first = m.match(/const\s+message\s*=\s*resolveLeadMessage\([^)]+\);/)[0];
      return first + "\n";
    });
  }

  // Also: const message = resolve... then const message = typeof...
  const dupMsg2 =
    /(const\s+message\s*=\s*resolveLeadMessage\([^)]+\);)\s*\n(\s*const\s+message\s*=\s*(?:typeof|String)[\s\S]*?;)/;
  if (dupMsg2.test(t)) {
    t = t.replace(dupMsg2, (_, keep) => {
      fixes.push("remove_duplicate_const_message_2");
      return keep;
    });
  }

  // 6) Calls to build*(...) that omit message when build expects it
  // buildLeadWebhookPayload({ fullName, email, phone }) → include message
  t = t.replace(
    /build(LeadWebhookPayload|Payload|Outbound)\(\s*\{\s*fullName,\s*email,\s*phone(?:\s*:\s*[^,}]+)?\s*\}\s*\)/g,
    (m) => {
      if (/message/.test(m)) return m;
      fixes.push("pass_message_into_build_call");
      return m.replace(/\}\s*\)/, ", message })");
    }
  );

  // buildLeadWebhookPayload({ fullName, email, phone }) variants with phone: phone ?? ""
  t = t.replace(
    /buildLeadWebhookPayload\(\s*\{\s*fullName,\s*email,\s*phone:\s*[^}]+\}\s*\)/g,
    (m) => {
      if (/message/.test(m)) return m;
      fixes.push("pass_message_into_buildLead_call");
      return m.replace(/\}\s*\)/, ", message })");
    }
  );

  return { text: t, fixes: [...new Set(fixes)], changed: t !== text };
}

const fixed = [];
const skipped = [];

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  for (const rel of [
    "netlify/functions/submit-lead.js",
    "netlify/functions/submit-lead.cjs",
  ]) {
    const fp = path.join(project, rel);
    if (!fs.existsSync(fp)) continue;
    const original = fs.readFileSync(fp, "utf8");
    const { text, fixes, changed } = fixText(original, ent.name);
    if (!changed) continue;

    // Syntax check
    try {
      new Function(text);
    } catch (e) {
      skipped.push({ repo: ent.name, file: rel, reason: String(e.message), fixes });
      continue;
    }

    fs.writeFileSync(fp, text, "utf8");
    fixed.push({ repo: ent.name, file: rel, fixes });
  }
}

console.log(JSON.stringify({ fixedCount: fixed.length, skippedCount: skipped.length, fixed, skipped }, null, 2));
