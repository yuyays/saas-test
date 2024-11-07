import { NextResponse } from "next/server";
import { userMedia } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  try {
    await db.insert(userMedia).values({
      userId: session.user.id,
      fileId: body.fileId,
      name: body.name,
      url: body.url,
      fileType: body.fileType,
      height: body.height,
      width: body.width,
    });

    return NextResponse.json({ message: "Media saved successfully" });
  } catch (error) {
    console.error("Error saving media:", error);
    return NextResponse.json(
      { error: "Failed to save media" },
      { status: 500 }
    );
  }
}
