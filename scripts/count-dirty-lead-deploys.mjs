/**
 * Count repos with uncommitted lead-related changes (would trigger Netlify deploy on push).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const LEAD_RE =
  /submit-lead|leadNotification|lead-notification|ghl-webhook|ContactForm|InstructForm|RetainForm|ContactLeadForm|EnquiryForm|RequestForm|QuickBriefForm|processContact|processEnquiry|notifyLead|submitLead/i;

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

const dirty = [];
for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  if (!fs.existsSync(path.join(project, ".git"))) continue;
  const st = git(project, ["status", "--porcelain"]);
  if (!st) continue;
  const files = [];
  for (const line of st.split(/\r?\n/)) {
    if (!line) continue;
    let f = line.slice(3).trim().replace(/^"|"$/g, "");
    if (f.includes(" -> ")) f = f.split(" -> ").pop();
    const norm = f.replace(/\\/g, "/");
    if (LEAD_RE.test(norm) || /netlify\/functions\/submit-lead/.test(norm)) {
      files.push(norm);
    }
  }
  if (files.length) dirty.push({ name: ent.name, files });
}

dirty.sort((a, b) => a.name.localeCompare(b.name));
console.log(
  JSON.stringify(
    {
      dirtyLeadRepos: dirty.length,
      approxCreditsIfAllDeploy: dirty.length * 8, // user said 840 for ~105 → ~8/deploy
      note: "840/105≈8 credits per deploy — adjust if your plan differs",
      sample: dirty.slice(0, 40).map((d) => d.name),
      all: dirty.map((d) => d.name),
    },
    null,
    2
  )
);
