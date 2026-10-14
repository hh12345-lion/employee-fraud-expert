import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const MSG = "Fix lead webhook ReferenceErrors from message field patch.\n";

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

  const st = git(project, ["status", "--porcelain", "--", "netlify/functions"]);
  if (!st.ok || !st.out) continue;

  const files = st.out
    .split(/\r?\n/)
    .map((line) => line.slice(3).trim().replace(/^"|"$/g, ""))
    .filter((f) => f && f.replace(/\\/g, "/").includes("netlify/functions/submit-lead."));

  if (!files.length) continue;

  for (const f of files) git(project, ["add", "--", f]);
  const staged = git(project, ["diff", "--cached", "--name-only"]);
  if (!staged.ok || !staged.out) continue;

  const msgFile = path.join(project, ".git", "COMMIT_MSG_LEAD_FIX");
  fs.writeFileSync(msgFile, MSG, "utf8");
  const commit = git(project, ["commit", "-F", msgFile]);
  try {
    fs.unlinkSync(msgFile);
  } catch {}

  if (!commit.ok) {
    failed.push({ name: ent.name, step: "commit", err: commit.out.slice(0, 400) });
    continue;
  }
  committed.push(ent.name);

  let push = git(project, ["push", "origin", "HEAD"]);
  if (!push.ok && /non-fast-forward|rejected/i.test(push.out)) {
    git(project, ["stash", "push", "-u", "-m", "lead-fix-temp"]);
    git(project, ["pull", "--rebase", "origin", "HEAD"]);
    push = git(project, ["push", "origin", "HEAD"]);
    git(project, ["stash", "pop"]);
  }
  if (!push.ok) failed.push({ name: ent.name, step: "push", err: push.out.slice(0, 400) });
  else pushed.push(ent.name);
}

console.log(JSON.stringify({ committed: committed.length, pushed: pushed.length, failed, pushedRepos: pushed }, null, 2));
