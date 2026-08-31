import { NextResponse } from "next/server";
import { parseLeadBody } from "@/lib/lead-submission";
import {
  appendInstructToSheet,
  writeSubmissionToSheetSafely,
} from "@/lib/sheetSubmissions";

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

    // Soft-fail Sheets — never 500/502 because Sheets failed
    await writeSubmissionToSheetSafely(
      () => appendInstructToSheet(lead),
      "instruct"
    );

    // Soft-fail email: no Resend configured on this site; log for ops
    console.log("Instruct submission received:", {
      fullName: lead.fullName,
      email: lead.email,
      formType: "Instruct",
    });

    return NextResponse.json({
      success: true,
      message: "Instruction received.",
    });
  } catch (error) {
    console.error("instruct error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
