/**
 * Netlify rollback for message-feature failure sites.
 * Skips blog sites added after message work.
 *
 * Usage:
 *   node scripts/netlify-message-rollback.mjs            # dry-run plan
 *   node scripts/netlify-message-rollback.mjs --execute   # restore
 *   node scripts/netlify-message-rollback.mjs --execute --from-plan
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:\\Users\\Eroniti\\Desktop\\Projects";
const OUT = path.join(ROOT, "employee-fraud-expert", "NETLIFY-MESSAGE-ROLLBACK-PLAN.json");
const EXECUTE = process.argv.includes("--execute");
const FROM_PLAN = process.argv.includes("--from-plan");
const DELAY_MS = 1500;
const MAX_RETRIES = 6;

const EXCLUDE_BLOG_REPOS = new Set([
  "finish-maker",
  "Iran-Country-Expert",
  "iran-country-expert",
  "south-asia-reports",
  "south-asia-expert",
]);

const FAILURE_REPOS = [
  "asia-court-reports",
  "asylum-court-reports",
  "asylum-expert-witness-org",
  "business-interruption-expert",
  "business-valuation-expert",
  "case-boost",
  "damages-expert-loss",
  "dispute-forensic",
  "redd-growth",
  "warranty-claim-expert",
  "employment-loss-expert",
  "future-earnings-expert",
  "juris-country-experts",
  "abc-expert-consultants",
  "accounting-expert-witness",
  "ads-for-openai",
  "aigeos-web",
  "asylum-country-expert",
  "asylum-expert",
  "asylum-expert-scot",
  "business-loss-expert",
  "business-valuation-expert-witness",
  "case-assistant",
  "ceed",
  "coi-experts",
  "context-signal",
  "country-condition-reports",
  "country-conditions-expert",
  "country-expert-insights",
  "country-expert-witness-net",
  "country-report-expert",
  "country-risk-expert",
  "divorce-accountant-expert",
  "divorce-tax-expert",
  "employee-fraud-expert",
  "expert-country-reports",
  "expert-witness-uae",
  "forensic-accountant-ae",
  "forensic-accountant-expert",
  "forensic-expert-witness",
  "fraud-expert-accountant",
  "fraud-expert-witness",
  "ibn-furat",
  "Iran-Country-Expert",
  "Latin-america-expert",
  "lawstone-web",
  "legal-aid-expert",
  "legal-aid-expert-witness",
  "legalaid-expert-witness",
  "loss-of-earnings-expert",
  "MENA-expert-witness",
  "middle-east-expert",
  "negligence-loss-expert",
  "pakistan-country-expert",
  "randd",
  "str-claims-web",
  "witness-consulting",
  "witness-forensic",
];

const MESSAGE_COMMIT_RE =
  /message field|n8n lead|lead webhook|ReferenceErrors from message|universal message|message aliases|Expand n8n message|Add universal message/i;

const runJs = path.join(
  process.env.APPDATA || "",
  "npm",
  "node_modules",
  "netlify-cli",
  "bin",
  "run.js"
);

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function netlifyApi(method, data) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const args = [runJs, "api", method];
      if (data) args.push("--data", JSON.stringify(data));
      const raw = execFileSync(process.execPath, args, {
        encoding: "utf8",
        maxBuffer: 40 * 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
      });
      return JSON.parse(raw);
    } catch (err) {
      lastErr = err;
      const msg = String(err.stderr || err.message || err);
      const retryable = /Bad Gateway|Service Temporarily|Too Many|429|502|503|500|Internal Server|ECONNRESET/i.test(
        msg
      );
      if (!retryable || attempt === MAX_RETRIES) throw err;
      const wait = DELAY_MS * attempt * 2;
      console.error(`  retry ${attempt}/${MAX_RETRIES} ${method} wait ${wait}ms`);
      sleep(wait);
    }
  }
  throw lastErr;
}

function normalize(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function listAllSites() {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    sleep(DELAY_MS);
    const chunk = netlifyApi("listSites", { filter: "all", page, per_page: 100 });
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    all.push(...chunk);
    console.log(`  sites page ${page}: +${chunk.length} (total ${all.length})`);
    if (chunk.length < 100) break;
  }
  return all;
}

function matchSite(repo, sites) {
  const n = normalize(repo);
  let hit = sites.find((s) => normalize(s.name) === n);
  if (hit) return hit;
  const candidates = sites.filter((s) => {
    const sn = normalize(s.name);
    return sn === n || sn.includes(n) || n.includes(sn);
  });
  if (!candidates.length) return null;
  candidates.sort(
    (a, b) => Math.abs(normalize(a.name).length - n.length) - Math.abs(normalize(b.name).length - n.length)
  );
  return candidates[0];
}

function titleOf(d) {
  return String(d.title || d.commit_message || d.branch || "").replace(/\s+/g, " ").trim();
}

function isMessageDeploy(d) {
  return MESSAGE_COMMIT_RE.test(titleOf(d));
}

function isExcludedBlogSite(site) {
  const sn = normalize(site.name);
  return (
    sn.includes("finishmaker") ||
    sn.includes("irancountryexpert") ||
    sn.includes("southasiareports") ||
    sn.includes("southasiaexpert")
  );
}

function planForSite(site) {
  sleep(DELAY_MS);
  const deploys = netlifyApi("listSiteDeploys", { site_id: site.id });
  const readyProd = deploys.filter((d) => d.state === "ready" && d.context === "production");
  if (!readyProd.length) return { skip: true, reason: "no ready production deploys" };

  const current = readyProd[0];
  let i = 0;
  while (i < readyProd.length && isMessageDeploy(readyProd[i])) i++;

  if (i === 0) {
    return {
      skip: true,
      reason: `current not message-related: "${titleOf(current).slice(0, 80)}"`,
      current: { id: current.id, at: current.created_at, title: titleOf(current) },
    };
  }

  const target = readyProd[i];
  if (!target) {
    return {
      skip: true,
      reason: "no older ready production before message deploys",
      current: { id: current.id, at: current.created_at, title: titleOf(current) },
    };
  }

  return {
    skip: false,
    current: { id: current.id, at: current.created_at, title: titleOf(current) },
    target: { id: target.id, at: target.created_at, title: titleOf(target) },
    rollingBackCount: i,
    messageDeploys: readyProd.slice(0, i).map((d) => ({
      id: d.id,
      at: d.created_at,
      title: titleOf(d),
    })),
  };
}

function save(results) {
  fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
}

function restore(siteId, deployId) {
  sleep(DELAY_MS);
  return netlifyApi("restoreSiteDeploy", { site_id: siteId, deploy_id: deployId });
}

const results = {
  mode: EXECUTE ? "execute" : "dry-run",
  excludedBlog: [],
  noSite: [],
  skipped: [],
  planned: [],
  restored: [],
  errors: [],
};

if (FROM_PLAN && fs.existsSync(OUT)) {
  const prev = JSON.parse(fs.readFileSync(OUT, "utf8"));
  console.log(`Loaded plan: ${prev.planned?.length || 0} planned`);
  results.excludedBlog = prev.excludedBlog || [];
  results.noSite = prev.noSite || [];
  results.skipped = prev.skipped || [];
  results.planned = prev.planned || [];
} else {
  console.log(EXECUTE ? "EXECUTE MODE" : "DRY-RUN");
  console.log("Loading all Netlify sites (paginated)...");
  const sites = listAllSites();
  console.log(`Sites total: ${sites.length}`);

  for (const repo of FAILURE_REPOS) {
    if (EXCLUDE_BLOG_REPOS.has(repo)) {
      results.excludedBlog.push(repo);
      console.log(`SKIP blog ${repo}`);
      continue;
    }
    const site = matchSite(repo, sites);
    if (!site) {
      results.noSite.push(repo);
      console.log(`NO SITE ${repo}`);
      continue;
    }
    if (isExcludedBlogSite(site)) {
      results.excludedBlog.push(`${repo} → ${site.name}`);
      console.log(`SKIP blog match ${repo} → ${site.name}`);
      continue;
    }
    try {
      const plan = planForSite(site);
      const row = {
        repo,
        siteName: site.name,
        siteId: site.id,
        url: site.ssl_url || site.url,
        ...plan,
      };
      if (plan.skip) {
        results.skipped.push(row);
        console.log(`SKIP ${repo}: ${plan.reason}`);
      } else {
        results.planned.push(row);
        console.log(
          `PLAN ${repo} (${site.name}): -${plan.rollingBackCount} → ${plan.target.at} | ${plan.target.title.slice(0, 70)}`
        );
      }
      save(results);
    } catch (err) {
      const msg = String(err.stderr || err.message || err).slice(0, 300);
      results.errors.push({ repo, error: msg });
      console.error(`ERROR ${repo}: ${msg.slice(0, 180)}`);
      save(results);
    }
  }
}

if (EXECUTE) {
  console.log(`\nRestoring ${results.planned.length} sites...`);
  for (const row of results.planned) {
    if (results.restored.some((r) => r.repo === row.repo)) continue;
    try {
      const out = restore(row.siteId, row.target.id);
      results.restored.push({
        repo: row.repo,
        siteName: row.siteName,
        siteId: row.siteId,
        url: row.url,
        from: row.current,
        to: row.target,
        restoreState: out?.state || "ok",
        restoreId: out?.id || row.target.id,
      });
      console.log(`RESTORED ${row.repo} → ${row.target.id}`);
      save(results);
    } catch (err) {
      const msg = String(err.stderr || err.message || err).slice(0, 300);
      results.errors.push({ repo: row.repo, siteName: row.siteName, error: msg });
      console.error(`FAIL ${row.repo}: ${msg.slice(0, 180)}`);
      save(results);
    }
  }
}

save(results);
console.log("\nSummary:", {
  excludedBlog: results.excludedBlog.length,
  noSite: results.noSite.length,
  skipped: results.skipped.length,
  planned: results.planned.length,
  restored: results.restored.length,
  errors: results.errors.length,
});
console.log("Wrote", OUT);
