/**
 * Commit+push empty-message fixes: forms, lead helpers, submit-lead routes, Netlify aliases.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const MSG =
  "Wire free-text into n8n message field (forms + webhook helpers + aliases).\n";

const FILE_RE =
  /(submit-lead|leadNotification|lead-notification|ContactForm|EngageForm|InstructForm|processContactSubmission|processRequestSubmission|requestSheet|notifyLead)/i;

function git(cwd, args) {
  try {
    return {
      ok: true,
      out: execFileSync("git", args, {
        cwd,
        encoding: "utf8",
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      }).trim(),
    };
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

  const st = git(project, ["status", "--porcelain"]);
  if (!st.ok || !st.out) continue;

  const files = [];
  for (const line of st.out.split(/\r?\n/)) {
    if (!line) continue;
    let f = line.slice(3).trim().replace(/^"|"$/g, "");
    if (f.includes(" -> ")) f = f.split(" -> ").pop();
    const norm = f.replace(/\\/g, "/");
    if (FILE_RE.test(norm) || /netlify\/functions\/submit-lead\./i.test(norm)) {
      files.push(f);
    }
  }
  if (!files.length) continue;

  for (const f of files) git(project, ["add", "--", f]);
  const staged = git(project, ["diff", "--cached", "--name-only"]);
  if (!staged.ok || !staged.out) continue;

  const msgFile = path.join(project, ".git", "COMMIT_MSG_MSG_WIRE");
  fs.writeFileSync(msgFile, MSG, "utf8");
  const commit = git(project, ["commit", "-F", msgFile]);
  try {
    fs.unlinkSync(msgFile);
  } catch {}

  if (!commit.ok) {
    failed.push({ name: ent.name, step: "commit", err: commit.out.slice(0, 300) });
    continue;
  }
  committed.push(ent.name);

  let push = git(project, ["push", "origin", "HEAD"]);
  if (!push.ok && /non-fast-forward|rejected/i.test(push.out)) {
    git(project, ["pull", "--rebase", "origin", "HEAD"]);
    push = git(project, ["push", "origin", "HEAD"]);
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
      focus: pushed.filter((n) =>
        /accountant|accounting-expert|business-loss|business-valuation-expert-witness|loss-of-profits|africa-expert-reports/i.test(
          n
        )
      ),
    },
    null,
    2
  )
);
