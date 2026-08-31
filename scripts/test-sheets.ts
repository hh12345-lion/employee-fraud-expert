/**
 * Test Google Sheets connection. Run: npx tsx scripts/test-sheets.ts
 * Loads GOOGLE_* from .env.local (never commit that file).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  appendRow,
  getSpreadsheetInfo,
  readRows,
} from "../src/lib/google-sheets";
import { BRAND_NAME, LEAD_SHEET_HEADERS } from "../src/lib/lead-submission";

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.warn("No .env.local found - set GOOGLE_* env vars manually.");
  }
}

async function test() {
  loadEnvLocal();
  console.log("--- Testing Google Sheets Connection ---\n");
  console.log("Expected headers:", LEAD_SHEET_HEADERS.join(" | "));

  try {
    const info = await getSpreadsheetInfo();
    console.log("✅ Spreadsheet found:", info.title);
    console.log("   Tabs:", info.sheets?.map((s) => s.name).join(", "));
  } catch (error) {
    console.error("❌ Failed to read spreadsheet info:", error);
    process.exit(1);
  }

  try {
    const phone = "+15555550100";
    const row = [
      new Date().toISOString(),
      BRAND_NAME,
      "Contact",
      "Test Entry",
      "test@example.com",
      phone.startsWith("+") ? `'${phone}` : phone,
      "Test Employer Inc",
      "Employer / HR / Finance",
      "Test row from scripts/test-sheets.ts",
    ];
    const result = await appendRow(row);
    console.log("✅ Row written:", result.updatedRange);
    console.log("   Brand:", BRAND_NAME, "| Form Type: Contact");
  } catch (error) {
    console.error("❌ Failed to write row:", error);
    process.exit(1);
  }

  try {
    const result = await readRows();
    console.log(
      `✅ Read ${result.rows.length} rows (including header if present)`
    );
    if (result.rows.length > 0) {
      console.log("   Last row:", result.rows[result.rows.length - 1]);
    }
  } catch (error) {
    console.error("❌ Failed to read rows:", error);
  }

  console.log("\n--- Done ---");
}

test();
