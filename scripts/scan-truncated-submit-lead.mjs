import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const bad = [];

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const fp = path.join(ROOT, ent.name, "netlify", "functions", "submit-lead.js");
  if (!fs.existsSync(fp)) continue;
  const t = fs.readFileSync(fp, "utf8");
  const callsUndef = [];
  if (/jsonResponse\(/.test(t) && !/function\s+jsonResponse|const\s+jsonResponse\s*=/.test(t))
    callsUndef.push("jsonResponse");
  if (/parseLead\(/.test(t) && !/function\s+parseLead/.test(t)) callsUndef.push("parseLead");
  if (/postToWebhook\(/.test(t) && !/function\s+postToWebhook|async\s+function\s+postToWebhook/.test(t))
    callsUndef.push("postToWebhook");
  if (/getSiteDomain\(/.test(t) && !/function\s+getSiteDomain/.test(t)) callsUndef.push("getSiteDomain");
  if (/BRAND_NAME/.test(t) && !/const\s+BRAND_NAME|var\s+BRAND_NAME|let\s+BRAND_NAME/.test(t))
    callsUndef.push("BRAND_NAME");
  // bare message, in outbound without const message in scope nearby - hard to detect
  if (!/\bexport\s|\bimport\s/.test(t)) {
    try {
      new Function(t.replace(/^\uFEFF/, ""));
    } catch (e) {
      callsUndef.push("syntax:" + e.message);
    }
  }
  if (callsUndef.length) bad.push({ repo: ent.name, callsUndef, lines: t.split(/\n/).length });
}

console.log(JSON.stringify({ badCount: bad.length, bad }, null, 2));
