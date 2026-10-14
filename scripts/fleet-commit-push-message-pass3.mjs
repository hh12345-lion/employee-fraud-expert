/**
 * Pass 3: commit/push remaining lead dirty files using execFileSync (reliable on Windows).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const MSG = "Add universal message field to n8n lead webhook payloads.\n";

const LEAD_RE =
  /submit-lead|leadNotification|lead-notification|leadWebhook|lead-webhook|notifyLead|submitLead|contactLead|lead-submission|ContactForm|InstructForm|RetainForm|EnquiryForm|DocketForm|QuoteForm|IntakeForm|LeadCapture|RequestEvidence|contact-form|PricingPlanForm|NetlifyForm|emailTemplates|submitLeadSchema|submitLeadClient|enquiry\.ts|engage[\\/]route|application[\\/]route|contact[\\/]route|instruct[\\/]route/i;

function git(cwd, args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  }).trim();
}

function tryGit(cwd, args) {
  try {
    return { ok: true, out: git(cwd, args) };
  } catch (e) {
    return {
      ok: false,
      out: String(e.stdout || "") + String(e.stderr || e.message || ""),
    };
  }
}

const committed = [];
const pushed = [];
const failed = [];

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  if (!fs.existsSync(path.join(project, ".git"))) continue;

  const st = tryGit(project, ["status", "--porcelain"]);
  if (!st.ok || !st.out) continue;

  const files = [];
  for (const line of st.out.split(/\r?\n/)) {
    if (!line) continue;
    let f = line.slice(3).trim().replace(/^"|"$/g, "");
    if (f.includes(" -> ")) f = f.split(" -> ").pop();
    if (LEAD_RE.test(f)) files.push(f);
  }
  if (!files.length) continue;

  for (const f of files) {
    tryGit(project, ["add", "--", f]);
  }

  const staged = tryGit(project, ["diff", "--cached", "--name-only"]);
  if (!staged.ok || !staged.out) continue;

  const msgFile = path.join(project, ".git", "COMMIT_MSG_PASS3");
  fs.writeFileSync(msgFile, MSG, "utf8");
  const commit = tryGit(project, ["commit", "-F", msgFile]);
  try {
    fs.unlinkSync(msgFile);
  } catch {}

  if (!commit.ok) {
    failed.push({ name: ent.name, step: "commit", err: commit.out.slice(0, 300) });
    continue;
  }
  committed.push(ent.name);

  let push = tryGit(project, ["push", "origin", "HEAD"]);
  if (!push.ok && /non-fast-forward|rejected/i.test(push.out)) {
    tryGit(project, ["stash", "push", "-u", "-m", "pass3-temp"]);
    tryGit(project, ["pull", "--rebase", "origin", "HEAD"]);
    push = tryGit(project, ["push", "origin", "HEAD"]);
    tryGit(project, ["stash", "pop"]);
  }
  if (!push.ok) failed.push({ name: ent.name, step: "push", err: push.out.slice(0, 300) });
  else pushed.push(ent.name);
}

console.log(
  JSON.stringify(
    {
      committed: committed.length,
      pushed: pushed.length,
      failed: failed.length,
      failedDetails: failed.slice(0, 15),
      sample: pushed.slice(0, 30),
    },
    null,
    2
  )
);
