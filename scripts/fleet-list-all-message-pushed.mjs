import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";

const PATTERNS = [
  "Add universal message field to n8n lead webhook payloads",
  "Fix lead webhook ReferenceErrors from message field patch",
  "Wire free-text into n8n message field",
  "Expand n8n message field aliases",
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

const repos = new Set();
const byCommit = {
  universal: [],
  referenceFix: [],
  wireFreeText: [],
  expandAliases: [],
};

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  if (!fs.existsSync(path.join(project, ".git"))) continue;

  for (let i = 0; i < PATTERNS.length; i++) {
    const log = git(project, [
      "log",
      "--all",
      "--grep",
      PATTERNS[i],
      "--fixed-strings",
      "--format=%H",
    ]);
    if (!log) continue;
    const hash = log.split(/\r?\n/)[0];
    const remoteContains = git(project, ["branch", "-r", "--contains", hash]);
    if (!remoteContains.split(/\r?\n/).some((l) => l.trim().startsWith("origin/"))) {
      continue;
    }
    repos.add(ent.name);
    if (i === 0) byCommit.universal.push(ent.name);
    if (i === 1) byCommit.referenceFix.push(ent.name);
    if (i === 2) byCommit.wireFreeText.push(ent.name);
    if (i === 3) byCommit.expandAliases.push(ent.name);
  }
}

const all = [...repos].sort((a, b) => a.localeCompare(b));
const focusWire = [...byCommit.wireFreeText].sort();
const refFix = [...byCommit.referenceFix].sort();

console.log(
  JSON.stringify(
    {
      totalPushed: all.length,
      all,
      priorityTestFirst: focusWire,
      hadReferenceErrorFix: refFix,
      counts: {
        universalMessage: byCommit.universal.length,
        referenceErrorFix: byCommit.referenceFix.length,
        wireFreeText: byCommit.wireFreeText.length,
        expandAliases: byCommit.expandAliases.length,
      },
    },
    null,
    2
  )
);
