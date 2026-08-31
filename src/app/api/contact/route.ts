import { NextResponse } from "next/server";
import { parseLeadBody } from "@/lib/lead-submission";
import {
  appendContactToSheet,
  writeSubmissionToSheetSafely,
} from "@/lib/sheetSubmissions";
import { SITE_EMAIL } from "@/lib/site";

/**
 * Contact intake: soft-fail Sheets (shared GOOGLE_SHEET_TAB_NAME + Form Type)
 * and soft-fail email. Always succeeds after validation so the client can
 * fire /api/submit-lead (webhook-only).
 */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const lead = parseLeadBody(body);
    if (!lead) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    await writeSubmissionToSheetSafely(
      () => appendContactToSheet(lead),
      "contact"
    );

    // Soft-fail email: no Resend on this site — log for ops, never fail the request
    console.log("Contact submission received:", {
      fullName: lead.fullName,
      email: lead.email,
      formType: "Contact",
      notify: SITE_EMAIL,
    });

    return NextResponse.json({
      ok: true,
      success: true,
      message: "Inquiry logged securely.",
    });
  } catch (error) {
    console.error("contact error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
