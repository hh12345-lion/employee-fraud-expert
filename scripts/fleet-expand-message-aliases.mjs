/**
 * Expand resolveLeadMessage alias lists in Netlify submit-lead functions.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";

const EXTRA = [
  "caseBrief",
  "case_summary",
  "matterDescription",
  "additionalNotes",
  "caseBackground",
  "specificQuestions",
  "briefSummary",
  "conflict_info",
  "brief",
];

const changed = [];

for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  for (const rel of ["netlify/functions/submit-lead.js", "netlify/functions/submit-lead.cjs"]) {
    const fp = path.join(ROOT, ent.name, rel);
    if (!fs.existsSync(fp)) continue;
    let t = fs.readFileSync(fp, "utf8");
    if (!/function\s+resolveLeadMessage/.test(t)) continue;

    let did = false;
    t = t.replace(
      /(function\s+resolveLeadMessage\s*\([^)]*\)\s*\{[\s\S]*?const\s+keys\s*=\s*\[)([\s\S]*?)(\];)/,
      (full, open, list, close) => {
        let next = list;
        for (const key of EXTRA) {
          if (!new RegExp(`["']${key}["']`).test(next)) {
            next = next.replace(/\s*$/, `\n    "${key}",\n  `);
            did = true;
          }
        }
        return open + next + close;
      }
    );

    if (!did) continue;
    fs.writeFileSync(fp, t, "utf8");
    changed.push(`${ent.name}/${rel}`);
  }
}

console.log(JSON.stringify({ changed: changed.length, sample: changed.slice(0, 40) }, null, 2));
