import { cleanupTemporaryFiles } from "@/app/edit/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await cleanupTemporaryFiles();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Cleanup cron job failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clean up temporary files" },
      { status: 500 }
    );
  }
}
