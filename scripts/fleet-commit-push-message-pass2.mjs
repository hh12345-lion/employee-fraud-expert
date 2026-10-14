/**
 * Second pass: commit + push any remaining lead-related dirty files.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const MSG = `Add universal message field to n8n lead webhook payloads.

`;

const LEAD_RE =
  /(submit-lead|leadNotification|lead-notification|leadWebhook|lead-webhook|notifyLead|submitLead|contactLead|lead-submission|ContactForm|InstructForm|RetainForm|EnquiryForm|DocketForm|QuoteForm|IntakeForm|LeadCapture|RequestEvidence|contact-form|PricingPlanForm|NetlifyForm|emailTemplates|submitLeadSchema|submitLeadClient|submitLeadHandler|processLeadSubmission|enquiry\.ts|contact\/route|instruct\/route|engage\/route|application\/route)/i;

function sh(cmd, cwd) {
  return execSync(cmd, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  }).trim();
}
function safe(cmd, cwd) {
  try {
    return { ok: true, out: sh(cmd, cwd) };
  } catch (e) {
    return { ok: false, out: String(e.stdout || "") + String(e.stderr || e.message) };
  }
}

const committed = [];
const pushed = [];
const failed = [];
const skipped = [];

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  if (!fs.existsSync(path.join(project, ".git"))) continue;

  const st = safe("git status --porcelain", project);
  if (!st.ok || !st.out) {
    skipped.push(ent.name);
    continue;
  }

  const files = st.out
    .split(/\r?\n/)
    .filter(Boolean)
    .map((l) => l.slice(3).trim().replace(/^"+|"+$/g, ""))
    .map((f) => (f.includes(" -> ") ? f.split(" -> ").pop() : f))
    .filter((f) => LEAD_RE.test(f));

  if (!files.length) continue;

  for (const f of files) {
    safe(`git add -- "${f}"`, project);
  }
  const staged = safe("git diff --cached --name-only", project);
  if (!staged.ok || !staged.out) continue;

  const msgFile = path.join(project, ".git", "COMMIT_EDITMSG_FLEET2");
  fs.writeFileSync(msgFile, MSG, "utf8");
  const commit = safe(`git commit -F "${msgFile}"`, project);
  try {
    fs.unlinkSync(msgFile);
  } catch {}

  if (!commit.ok) {
    failed.push({ name: ent.name, step: "commit", err: commit.out.slice(0, 250) });
    continue;
  }
  committed.push(ent.name);

  // rebase if needed then push
  let push = safe("git push origin HEAD", project);
  if (!push.ok && /non-fast-forward|behind/i.test(push.out)) {
    safe("git stash push -u -m fleet-temp", project);
    const reb = safe("git pull --rebase origin HEAD", project);
    if (reb.ok) {
      push = safe("git push origin HEAD", project);
    }
    safe("git stash pop", project);
  }

  if (!push.ok) failed.push({ name: ent.name, step: "push", err: push.out.slice(0, 250) });
  else pushed.push(ent.name);
}

console.log(
  JSON.stringify(
    {
      committed: committed.length,
      pushed: pushed.length,
      failed: failed.length,
      failedDetails: failed,
      sample: pushed.slice(0, 25),
    },
    null,
    2
  )
);
