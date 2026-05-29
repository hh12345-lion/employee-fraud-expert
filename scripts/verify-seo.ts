/**
 * Verifies public/sitemap.xml matches buildPublicUrlInventory().
 * Run: npm run seo:verify
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { buildPublicUrlInventory } from "../src/lib/seo/publicUrlInventory";

function parseSitemapLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    locs.push(match[1].trim());
  }
  return locs.sort();
}

async function main() {
  const sitemapPath = join(process.cwd(), "public", "sitemap.xml");
  let xml: string;
  try {
    xml = await readFile(sitemapPath, "utf8");
  } catch {
    console.error(
      "Missing public/sitemap.xml - run npm run seo:generate first."
    );
    process.exit(1);
  }

  const inventory = buildPublicUrlInventory();
  const expected = [...inventory.allUrls].sort();
  const actual = parseSitemapLocs(xml);

  const missing = expected.filter((url) => !actual.includes(url));
  const extra = actual.filter((url) => !expected.includes(url));

  if (missing.length === 0 && extra.length === 0) {
    console.log(
      `OK: sitemap.xml matches inventory (${actual.length} URLs).`
    );
    process.exit(0);
  }

  if (missing.length > 0) {
    console.error("URLs in inventory but missing from sitemap.xml:");
    missing.forEach((u) => console.error(`  - ${u}`));
  }
  if (extra.length > 0) {
    console.error("URLs in sitemap.xml but not in inventory:");
    extra.forEach((u) => console.error(`  - ${u}`));
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
