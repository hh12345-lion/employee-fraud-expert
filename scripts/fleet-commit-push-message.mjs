/**
 * Commit + push universal n8n `message` field changes across Projects repos.
 * Only stages lead-delivery related paths. Skips clean repos.
 *
 *   node scripts/fleet-commit-push-message.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const MSG = `Add universal message field to n8n lead webhook payloads.

`;

const LEAD_PATH_RE =
  /(^|\/|\\)(netlify[\\/]functions[\\/]submit-lead\.(js|cjs)|.*lead[-_]?notification.*|.*lead[-_]?webhook.*|.*submit[-_]?lead.*|.*notify[-_]?lead.*|.*contact[-_]?lead.*|lead-submission\.ts|submitLeadSchema\.ts|submitLeadClient\.ts|schemas\/.*lead.*|ContactForm\.tsx|InstructForm\.tsx|RetainForm\.tsx|RetainExpertForm\.tsx|EnquiryForm\.tsx|DocketForm\.tsx|QuoteForm\.tsx|IntakeForm\.tsx|LeadCaptureForm\.tsx|RequestEvidence\.tsx|contact-form\.tsx|ContactPageClient\.tsx|Contact\.tsx|Contact\.jsx|PricingPlanForm\.tsx|NetlifyForm\.tsx|submitLead\.ts|processLeadSubmission\.ts|emailTemplates\.ts|validations\.ts|enquiry-sheet-row\.ts|contactLead\.ts|submitLeadHandler\.ts|notifyLeadClient\.ts|notifyLead\.ts|LeadCaptureForm\.|contact\/route\.ts|application\/route\.ts|instruct\/route\.ts)/i;

function sh(cmd, cwd) {
  return execSync(cmd, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  }).trim();
}

function safeSh(cmd, cwd) {
  try {
    return { ok: true, out: sh(cmd, cwd) };
  } catch (err) {
    return {
      ok: false,
      out: (err.stdout || "") + (err.stderr || err.message || ""),
    };
  }
}

function isLeadRelated(filePath) {
  const n = filePath.replace(/\\/g, "/");
  if (LEAD_PATH_RE.test(n)) return true;
  // forms folder + submit-lead usage often in *Form*
  if (/Form\.(tsx|ts|jsx|js)$/i.test(n) && /forms?\//i.test(n)) return true;
  if (/api\/(submit-lead|contact|instruct|application)\//i.test(n)) return true;
  return false;
}

const results = { committed: [], pushed: [], skipped: [], failed: [] };

const projects = fs
  .readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => path.join(ROOT, d.name));

for (const project of projects) {
  const name = path.basename(project);
  if (!fs.existsSync(path.join(project, ".git"))) continue;

  const status = safeSh("git status --porcelain", project);
  if (!status.ok) {
    results.failed.push({ name, step: "status", err: status.out.slice(0, 200) });
    continue;
  }
  if (!status.out) {
    results.skipped.push({ name, reason: "clean" });
    continue;
  }

  const lines = status.out.split(/\r?\n/).filter(Boolean);
  const files = lines.map((l) => l.slice(3).replace(/^"+|"+$/g, "").trim());
  const leadFiles = files.filter(isLeadRelated);

  // If porcelain shows renames "old -> new"
  const toAdd = leadFiles
    .map((f) => (f.includes(" -> ") ? f.split(" -> ").pop() : f))
    .filter(Boolean);

  if (toAdd.length === 0) {
    results.skipped.push({
      name,
      reason: `dirty but no lead files matched (${files.length} dirty)`,
      dirty: files.slice(0, 8),
    });
    continue;
  }

  // Stage lead files one by one for safety
  for (const f of toAdd) {
    const add = safeSh(`git add -- "${f.replace(/"/g, '\\"')}"`, project);
    if (!add.ok) {
      // try without escaping issues via -A pathspec limited
      safeSh(`git add -- "${f}"`, project);
    }
  }

  const staged = safeSh("git diff --cached --name-only", project);
  if (!staged.ok || !staged.out) {
    results.skipped.push({ name, reason: "nothing staged after add" });
    continue;
  }

  // Commit via temp file to avoid PowerShell quoting issues
  const msgFile = path.join(project, ".git", "COMMIT_EDITMSG_FLEET");
  fs.writeFileSync(msgFile, MSG, "utf8");
  const commit = safeSh(`git commit -F "${msgFile}"`, project);
  try {
    fs.unlinkSync(msgFile);
  } catch {
    /* ignore */
  }

  if (!commit.ok) {
    results.failed.push({
      name,
      step: "commit",
      err: commit.out.slice(0, 300),
    });
    continue;
  }
  results.committed.push(name);

  const push = safeSh("git push origin HEAD", project);
  if (!push.ok) {
    results.failed.push({
      name,
      step: "push",
      err: push.out.slice(0, 300),
    });
  } else {
    results.pushed.push(name);
  }
}

console.log(
  JSON.stringify(
    {
      committed: results.committed.length,
      pushed: results.pushed.length,
      skipped: results.skipped.length,
      failed: results.failed.length,
      failedDetails: results.failed,
      skippedDirtyNonLead: results.skipped.filter((s) =>
        String(s.reason).includes("no lead files")
      ),
      samplePushed: results.pushed.slice(0, 20),
    },
    null,
    2
  )
);
