import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const MSG = "Add universal message field to n8n lead webhook payloads";

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

const hits = [];
for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  if (!fs.existsSync(path.join(project, ".git"))) continue;

  const log = git(project, [
    "log",
    "--all",
    "--grep",
    MSG,
    "--fixed-strings",
    "-i",
    "--format=%H|%s|%ci",
  ]);
  if (!log) continue;

  const first = log.split(/\r?\n/)[0];
  const [hash, subject, date] = first.split("|");
  const branch = git(project, ["rev-parse", "--abbrev-ref", "HEAD"]) || "?";
  const remote = git(project, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]) || "";
  let pushed = false;
  if (remote) {
    const contains = git(project, ["branch", "-r", "--contains", hash]);
    pushed = contains.split(/\r?\n/).some((l) => l.trim().length > 0);
  } else {
    // no upstream: check origin/*
    const contains = git(project, ["branch", "-r", "--contains", hash]);
    pushed = contains.split(/\r?\n/).some((l) => l.trim().startsWith("origin/"));
  }

  hits.push({ name: ent.name, hash: hash.slice(0, 7), branch, pushed, date, subject });
}

hits.sort((a, b) => a.name.localeCompare(b.name));
const pushed = hits.filter((h) => h.pushed).map((h) => h.name);
const localOnly = hits.filter((h) => !h.pushed).map((h) => h.name);

console.log(
  JSON.stringify(
    {
      totalWithCommit: hits.length,
      pushedCount: pushed.length,
      localOnlyCount: localOnly.length,
      pushed,
      localOnly,
    },
    null,
    2
  )
);
