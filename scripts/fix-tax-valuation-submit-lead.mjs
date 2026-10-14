import { execFileSync } from "node:child_process";
import fs from "node:fs";

for (const repo of ["tax-expert-witness", "valuation-expert-witness"]) {
  const cwd = `C:/Users/Eroniti/Desktop/Projects/${repo}`;
  const hash = execFileSync(
    "git",
    [
      "log",
      "--all",
      "--grep",
      "Add universal message field to n8n lead webhook payloads",
      "--fixed-strings",
      "--format=%H",
    ],
    { cwd, encoding: "utf8" }
  )
    .trim()
    .split(/\r?\n/)[0];

  let t = execFileSync("git", ["show", `${hash}:netlify/functions/submit-lead.js`], {
    cwd,
    encoding: "utf8",
  });

  // Remove duplicate const message
  t = t.replace(
    /(const\s+message\s*=\s*resolveLeadMessage\([^)]+\);)\s*\n\s*const\s+message\s*=[\s\S]*?;/,
    "$1"
  );
  t = t.replace(
    /(const\s+message\s*=\s*resolveLeadMessage\([^)]+\);)\s*\n(\s*const\s+formType[\s\S]*?\n)\s*const\s+message\s*=[\s\S]*?;/,
    "$1\n$2"
  );

  if (!t.includes("caseDescription")) {
    t = t.replace(
      `"enquiryDetails",`,
      `"enquiryDetails",\n    "caseBrief",\n    "caseDescription",\n    "case_description",`
    );
  }

  fs.writeFileSync(`${cwd}/netlify/functions/submit-lead.js`, t, "utf8");
  try {
    new Function(t);
    console.log(repo, "OK", t.split(/\n/).length);
  } catch (e) {
    console.log(repo, "FAIL", e.message);
    // fallback: checkout from hash via git show without regex mess - dump first error region
  }
}
