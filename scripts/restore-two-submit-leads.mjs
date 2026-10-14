import { execFileSync } from "node:child_process";
import fs from "node:fs";

const jobs = [
  ["country-expert-insights", "eee8267"],
  ["pakistan-country-expert", "2f75a10"],
];

const EXTRA = [
  "caseBrief",
  "case_summary",
  "caseDescription",
  "case_description",
  "matterDescription",
  "additionalNotes",
  "brief",
];

for (const [repo, rev] of jobs) {
  const cwd = `C:/Users/Eroniti/Desktop/Projects/${repo}`;
  let t = execFileSync("git", ["show", `${rev}:netlify/functions/submit-lead.js`], {
    cwd,
    encoding: "utf8",
  });

  for (const key of EXTRA) {
    if (!t.includes(`"${key}"`)) {
      t = t.replace(
        `"enquiryDetails",`,
        `"enquiryDetails",\n    "${key}",`
      );
    }
  }

  const fp = `${cwd}/netlify/functions/submit-lead.js`;
  fs.writeFileSync(fp, t, "utf8");

  try {
    new Function(t);
    console.log(
      JSON.stringify({
        repo,
        ok: true,
        lines: t.split(/\n/).length,
        hasJson: /function jsonResponse|const jsonResponse/.test(t),
        hasBrand: /BRAND_NAME/.test(t),
        hasMessageOutbound: /\n\s*message,/.test(t) || /message:/.test(t),
      })
    );
  } catch (e) {
    console.log(JSON.stringify({ repo, ok: false, err: e.message }));
  }
}
