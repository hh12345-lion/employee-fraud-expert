/**
 * Restore truncated netlify/functions/submit-lead.js from the
 * "Add universal message field" commit, then safely append extra aliases.
 * Does NOT git commit/push.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const MSG = "Add universal message field to n8n lead webhook payloads";

const EXTRA = [
  "caseBrief",
  "case_summary",
  "caseDescription",
  "case_description",
  "matterDescription",
  "additionalNotes",
  "caseBackground",
  "specificQuestions",
  "briefSummary",
  "conflict_info",
  "brief",
];

function git(cwd, args) {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

function isTruncated(t) {
  const missing = [];
  if (/jsonResponse\(/.test(t) && !/function\s+jsonResponse|const\s+jsonResponse\s*=/.test(t))
    missing.push("jsonResponse");
  if (/parseLead\(/.test(t) && !/function\s+parseLead/.test(t)) missing.push("parseLead");
  if (/postToWebhook\(/.test(t) && !/function\s+postToWebhook|async\s+function\s+postToWebhook/.test(t))
    missing.push("postToWebhook");
  if (/getSiteDomain\(/.test(t) && !/function\s+getSiteDomain/.test(t)) missing.push("getSiteDomain");
  if (/BRAND_NAME/.test(t) && !/const\s+BRAND_NAME|var\s+BRAND_NAME|let\s+BRAND_NAME/.test(t))
    missing.push("BRAND_NAME");
  if (!/\bexport\s|\bimport\s/.test(t)) {
    try {
      new Function(t.replace(/^\uFEFF/, ""));
    } catch (e) {
      missing.push("syntax");
    }
  }
  return missing;
}

function expandAliases(t) {
  let out = t;
  for (const key of EXTRA) {
    if (!out.includes(`"${key}"`) && !out.includes(`'${key}'`)) {
      if (out.includes(`"enquiryDetails"`)) {
        out = out.replace(`"enquiryDetails",`, `"enquiryDetails",\n    "${key}",`);
      }
    }
  }
  // Fix bare `message,` / bad indent in outbound objects that should be message: x
  // Prefer leaving shorthand if const message exists in handler
  return out;
}

const restored = [];
const failed = [];
const skipped = [];

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  const fp = path.join(project, "netlify", "functions", "submit-lead.js");
  if (!fs.existsSync(fp)) continue;
  if (!fs.existsSync(path.join(project, ".git"))) continue;

  const current = fs.readFileSync(fp, "utf8");
  const missing = isTruncated(current);
  if (!missing.length) {
    skipped.push(ent.name);
    continue;
  }

  const hash = git(project, [
    "log",
    "--all",
    "--grep",
    MSG,
    "--fixed-strings",
    "--format=%H",
  ]).split(/\r?\n/)[0];

  if (!hash) {
    failed.push({ repo: ent.name, reason: "no_message_commit", missing });
    continue;
  }

  let content = "";
  try {
    content = execFileSync("git", ["show", `${hash}:netlify/functions/submit-lead.js`], {
      cwd: project,
      encoding: "utf8",
      windowsHide: true,
    });
  } catch (e) {
    failed.push({ repo: ent.name, reason: "show_failed", missing });
    continue;
  }

  content = expandAliases(content);
  const stillBad = isTruncated(content);
  if (stillBad.length) {
    // try parent of expand/fix commits — go one commit before first expand if needed
    failed.push({ repo: ent.name, reason: "restored_still_bad", missing: stillBad });
    // still write if better than current
    if (stillBad.length < missing.length) {
      fs.writeFileSync(fp, content, "utf8");
    }
    continue;
  }

  fs.writeFileSync(fp, content, "utf8");
  restored.push({ repo: ent.name, wasMissing: missing, lines: content.split(/\n/).length });
}

console.log(JSON.stringify({ restored: restored.length, failed, restoredRepos: restored }, null, 2));
