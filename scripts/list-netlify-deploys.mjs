import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const siteId = process.argv[2] || "1db41fed-c2c6-4cde-be6c-4d5453f424fb";
const siteName = process.argv[3] || "asylum-court-reports";

const runJs = path.join(
  process.env.APPDATA || "",
  "npm",
  "node_modules",
  "netlify-cli",
  "bin",
  "run.js"
);

if (!fs.existsSync(runJs)) {
  console.error("netlify-cli run.js not found at", runJs);
  process.exit(1);
}

const raw = execFileSync(
  process.execPath,
  [runJs, "api", "listSiteDeploys", "--data", JSON.stringify({ site_id: siteId })],
  { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
);

const deploys = JSON.parse(raw);
console.log(`Site: ${siteName} (${siteId})`);
console.log(`Deploys returned: ${deploys.length}\n`);
console.log(
  ["#", "state", "context", "created_at", "commit", "title", "deploy_id"].join(" | ")
);
deploys.slice(0, 15).forEach((d, i) => {
  console.log(
    [
      i + 1,
      d.state,
      d.context,
      d.created_at,
      (d.commit_ref || "").slice(0, 7),
      (d.title || d.commit_message || "").toString().replace(/\s+/g, " ").slice(0, 60),
      d.id,
    ].join(" | ")
  );
});

const published = deploys.find((d) => d.state === "ready" && d.context === "production");
const olderReady = deploys.filter((d) => d.state === "ready" && d.context === "production");
console.log(`\nProduction-ready deploys available to restore: ${olderReady.length}`);
if (olderReady[0]) console.log(`Current/latest ready: ${olderReady[0].id} @ ${olderReady[0].created_at}`);
if (olderReady[1]) console.log(`Previous ready candidate: ${olderReady[1].id} @ ${olderReady[1].created_at}`);
