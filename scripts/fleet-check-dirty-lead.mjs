import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const LEAD_RE =
  /submit-lead|leadNotification|lead-notification|leadWebhook|lead-webhook|notifyLead|submitLead|contactLead|lead-submission|ContactForm|InstructForm|RetainForm|EnquiryForm|DocketForm|QuoteForm|IntakeForm|LeadCapture|RequestEvidence|contact-form|PricingPlanForm|NetlifyForm|emailTemplates|submitLeadSchema|submitLeadClient|enquiry\.ts|engage[\\/]route|application[\\/]route|contact[\\/]route|instruct[\\/]route/i;

const dirty = [];
for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const project = path.join(ROOT, ent.name);
  if (!fs.existsSync(path.join(project, ".git"))) continue;
  let out = "";
  try {
    out = execFileSync("git", ["status", "--porcelain"], {
      cwd: project,
      encoding: "utf8",
      windowsHide: true,
    }).trim();
  } catch {
    continue;
  }
  if (!out) continue;
  const leadFiles = [];
  for (const line of out.split(/\r?\n/)) {
    if (!line) continue;
    let f = line.slice(3).trim().replace(/^"|"$/g, "");
    if (f.includes(" -> ")) f = f.split(" -> ").pop();
    if (LEAD_RE.test(f)) leadFiles.push(f);
  }
  if (leadFiles.length) dirty.push({ name: ent.name, files: leadFiles });
}
console.log(JSON.stringify({ dirtyLeadRepos: dirty.length, details: dirty }, null, 2));
