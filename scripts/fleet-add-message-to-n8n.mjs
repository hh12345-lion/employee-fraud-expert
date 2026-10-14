/**
 * Fleet patch: ensure n8n lead webhooks always include `message`.
 *
 * Dry-run:  node scripts/fleet-add-message-to-n8n.mjs
 * Apply:    node scripts/fleet-add-message-to-n8n.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const APPLY = process.argv.includes("--apply");

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
]);

const ALIAS_LIST = [
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

const changes = [];
const errors = [];

function listProjects() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP.has(d.name))
    .map((d) => path.join(ROOT, d.name));
}

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
    else acc.push(full);
  }
  return acc;
}

function writeIfChanged(file, before, after) {
  if (!after || after === before) return false;
  changes.push(path.relative(ROOT, file));
  if (APPLY) fs.writeFileSync(file, after, "utf8");
  return true;
}

function resolveFnJs() {
  return `function resolveLeadMessage(body) {
  if (!body || typeof body !== "object") return "";
  const keys = ${JSON.stringify(ALIAS_LIST)};
  for (const key of keys) {
    if (body[key] != null && String(body[key]).trim()) {
      return String(body[key]).trim();
    }
  }
  return "";
}
`;
}

function resolveFnTs() {
  return `function resolveLeadMessage(b: Record<string, unknown>): string {
  const keys = ${JSON.stringify(ALIAS_LIST)} as const;
  for (const key of keys) {
    if (b[key] != null && String(b[key]).trim()) {
      return String(b[key]).trim();
    }
  }
  return "";
}
`;
}

/** Patch netlify/functions/submit-lead.js|.cjs */
function patchNetlifyFn(src) {
  if (!src.includes("Brand name")) return null;
  if (/outbound\s*=\s*\{[^}]*\bmessage\b/.test(src)) return null;

  let out = src;

  if (!out.includes("function resolveLeadMessage")) {
    const idx = out.search(/exports\.handler|module\.exports/);
    if (idx === -1) return null;
    out = out.slice(0, idx) + resolveFnJs() + "\n" + out.slice(idx);
  }

  if (!out.includes("const message = resolveLeadMessage")) {
    out = out.replace(
      /const phone = ([^;]+);/,
      "const phone = $1;\n  const message = resolveLeadMessage(body);"
    );
  }

  // Insert message into outbound object after domain line (preferred)
  if (out.includes("domain: getSiteDomain()")) {
    out = out.replace(
      /domain:\s*getSiteDomain\(\),?/,
      "domain: getSiteDomain(),\n    message,"
    );
  } else if (out.includes('"Brand name": BRAND_NAME')) {
    out = out.replace(
      /"Brand name":\s*BRAND_NAME,?/,
      '"Brand name": BRAND_NAME,\n    message,'
    );
  } else {
    return null;
  }

  // Avoid double commas / duplicate message
  out = out.replace(/message,\s*message,/g, "message,");

  return out;
}

/** Patch TS lead helpers with buildWebhookPayload */
function patchLeadHelperTs(src) {
  if (!src.includes("Brand name") && !src.includes('"Brand name"')) return null;

  let out = src;
  let changed = false;

  // Interface: add message?: string
  out = out.replace(
    /export interface (LeadWebhookInput|LeadPayload|WebhookLead|LeadInput) \{([^}]*)\}/g,
    (m, name, body) => {
      if (/\bmessage\??\s*:/.test(body)) return m;
      changed = true;
      const trimmed = body.replace(/\s*$/, "");
      return `export interface ${name} {${trimmed}\n  message?: string;\n}`;
    }
  );

  // Rename capital Message key in return objects to message
  if (/\n\s*Message\s*:/.test(out)) {
    out = out.replace(/(\n\s*)Message(\s*:)/g, "$1message$2");
    changed = true;
  }

  // Add message to buildWebhookPayload / buildLeadWebhookPayload return
  out = out.replace(
    /(function build(?:Lead)?WebhookPayload\s*\(\s*lead\s*:[^)]*\)[^{]*\{[\s\S]*?return\s*\{)([\s\S]*?)(\n\s*\};)/g,
    (m, open, body, close) => {
      if (/\bmessage\s*:/.test(body)) return m;
      changed = true;
      const trimmed = body.replace(/\s*$/, "");
      const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
      return `${open}${trimmed}${comma}\n    message: lead.message ?? "",${close}`;
    }
  );

  // parseLeadWebhookInput: inject resolver + message field
  if (out.includes("parseLeadWebhookInput")) {
    if (!out.includes("function resolveLeadMessage")) {
      out = out.replace(
        "export function parseLeadWebhookInput",
        `${resolveFnTs()}\nexport function parseLeadWebhookInput`
      );
      changed = true;
    }
    if (
      out.includes("parseLeadWebhookInput") &&
      !/message:\s*resolveLeadMessage/.test(out)
    ) {
      out = out.replace(
        /(return \{\s*fullName,\s*email,\s*phone:[^\n]+\n)(\s*formType[^\n]*\n)?(\s*\};)/,
        (m, a, b, c) => {
          if (m.includes("message:")) return m;
          changed = true;
          return `${a}${b || ""}    message: resolveLeadMessage(b),\n${c}`;
        }
      );
    }
  }

  return changed ? out : null;
}

/** Patch /api/submit-lead/route.ts to pass message through */
function patchSubmitLeadRoute(src) {
  if (!src.includes("notifyLeadWebhook")) return null;
  let out = src;
  let changed = false;

  // Pattern: notifyLeadWebhook({ fullName: lead.fullName, email: lead.email, phone: lead.phone }, ...)
  const re =
    /notifyLeadWebhook\(\s*\{\s*fullName:\s*lead\.fullName\s*,\s*email:\s*lead\.email\s*,\s*phone:\s*lead\.phone\s*(?:,\s*formType:\s*lead\.formType)?\s*\}/g;
  out = out.replace(re, (m) => {
    if (m.includes("message:")) return m;
    changed = true;
    return m.replace(
      /\}\s*$/,
      ',\n      message: lead.message ?? lead.description ?? "",\n    }'
    );
  });

  // Pattern with explicit fields from parseLeadWebhookInput result already as `lead`
  // If notifyLeadWebhook(lead, ...) — ensure parse adds message (helper patch)

  return changed ? out : null;
}

/** Patch forms that fire /api/submit-lead */
function patchForm(src) {
  if (!src.includes("/api/submit-lead")) return null;
  let out = src;
  let changed = false;

  // Fire-and-forget body with fullName/email/phone/formType only
  const fireRe =
    /body:\s*JSON\.stringify\(\{\s*\n?\s*fullName:\s*payload\.fullName,\s*\n?\s*email:\s*payload\.email,\s*\n?\s*phone:\s*payload\.phone,\s*\n?\s*formType:\s*("[^"]+"|'[^']+'|[^,}]+),?\s*\n?\s*\}\)/g;

  out = out.replace(fireRe, (m) => {
    if (m.includes("message:")) return m;
    changed = true;
    return m.replace(
      /\}\)\s*$/,
      ',\n          message: payload.description ?? payload.enquiry ?? payload.details ?? payload.summary ?? payload.notes ?? payload.matter ?? payload.message ?? "",\n        })'
    );
  });

  // leadPayload objects: add message field mapped from form fields
  out = out.replace(
    /(const\s+(?:leadPayload|payload)\s*=\s*\{)([\s\S]*?)(\n\s*\};)/g,
    (m, open, body, close) => {
      // Only touch objects that look like lead submissions
      if (!/fullName\s*:/.test(body) || !/email\s*:/.test(body)) return m;
      if (/\bmessage\s*:/.test(body)) return m;
      // Must be near a submit-lead usage in file (already checked)
      changed = true;
      const trimmed = body.replace(/\s*$/, "");
      const comma = /,\s*$/.test(trimmed.trimEnd()) ? "" : ",";
      return `${open}${trimmed}${comma}\n      message: String(data.get("message") || data.get("description") || data.get("enquiry") || data.get("details") || data.get("summary") || data.get("notes") || data.get("matter") || "").trim(),${close}`;
    }
  );

  return changed ? out : null;
}

/** Expand parseLeadBody description aliases + optional message on LeadSubmission */
function patchLeadSubmission(src) {
  if (!src.includes("parseLeadBody")) return null;
  let out = src;
  let changed = false;

  if (
    out.includes("export interface LeadSubmission") &&
    !/message\??\s*:/.test(
      out.match(/export interface LeadSubmission \{[^}]*\}/)?.[0] || ""
    )
  ) {
    out = out.replace(
      /export interface LeadSubmission \{([^}]*)\}/,
      (m, body) => {
        if (/\bmessage\??\s*:/.test(body)) return m;
        changed = true;
        return `export interface LeadSubmission {${body}  message?: string;\n}`;
      }
    );
  }

  out = out.replace(
    /description:\s*opt\(([^)]+)\)/,
    (m, inner) => {
      if (inner.includes("enquiry") && inner.includes("summary")) return m;
      changed = true;
      return `description: opt(b.description ?? b.message ?? b.enquiry ?? b.details ?? b.summary ?? b.notes ?? b.matter)`;
    }
  );

  // Also set message on return if description is set
  if (
    out.includes("return {") &&
    out.includes("description:") &&
    !/message:\s*opt\(/.test(out) &&
    out.includes("parseLeadBody")
  ) {
    out = out.replace(
      /(description:\s*opt\([^\)]+\),?)/,
      `$1\n    message: opt(b.message ?? b.description ?? b.enquiry ?? b.details ?? b.summary ?? b.notes ?? b.matter),`
    );
    changed = true;
  }

  return changed ? out : null;
}

function processProject(projectDir) {
  const targets = [];
  const roots = [
    "netlify/functions",
    "src/lib",
    "lib",
    "src/app/api/submit-lead",
    "app/api/submit-lead",
    "src/components",
    "components",
    "src/components/forms",
    "components/forms",
    "app/components",
  ];
  for (const rel of roots) {
    const abs = path.join(projectDir, rel);
    if (fs.existsSync(abs)) walk(abs, targets);
  }

  for (const file of targets) {
    const base = path.basename(file).toLowerCase();
    let src;
    try {
      src = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    try {
      let next = null;
      if (base === "submit-lead.js" || base === "submit-lead.cjs") {
        next = patchNetlifyFn(src);
      } else if (
        [
          "leadnotification.ts",
          "lead-notification.ts",
          "leadwebhook.ts",
          "lead-webhook.ts",
          "submit-lead.ts",
        ].includes(base)
      ) {
        next = patchLeadHelperTs(src);
      } else if (
        base === "route.ts" &&
        file.replace(/\\/g, "/").includes("/api/submit-lead/")
      ) {
        next = patchSubmitLeadRoute(src);
      } else if (base === "lead-submission.ts") {
        next = patchLeadSubmission(src);
      } else if (
        (base.endsWith(".tsx") || base.endsWith(".ts")) &&
        src.includes("/api/submit-lead")
      ) {
        next = patchForm(src);
      }

      writeIfChanged(file, src, next);
    } catch (err) {
      errors.push(`${file}: ${err.message}`);
    }
  }
}

function main() {
  for (const project of listProjects()) {
    processProject(project);
  }
  console.log(
    JSON.stringify(
      {
        mode: APPLY ? "APPLY" : "DRY_RUN",
        changed: changes.length,
        errors: errors.slice(0, 30),
        files: changes,
      },
      null,
      2
    )
  );
}

main();
