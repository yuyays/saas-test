"use server";

import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db/drizzle";
import { userMedia } from "@/lib/db/schema";
import imageKit from "@/lib/iamgeKit";
import { ratelimit } from "@/lib/db/ratelimit";
import { cookies } from "next/headers";
import { MediaFile } from "../../components/galleries/GalleryList";
import { eq, sql } from "drizzle-orm";

export async function uploadAnonymousImage(
  formData: FormData
): Promise<MediaFile> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Generate a unique anonymous user identifier or use existing one from cookies
    const cookieStore = await cookies();
    let anonymousId = cookieStore.get("anonymous_id")?.value;
    if (!anonymousId) {
      anonymousId = `anon_${uuidv4()}`;
      cookieStore.set("anonymous_id", anonymousId, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
    }

    // Apply rate limiting
    const identifier = `uploadAnonymous_${anonymousId}`;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    // Upload to ImageKit
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await imageKit.upload({
      file: buffer, // Pass buffer instead of File object
      fileName: `anon-${anonymousId.substring(0, 8)}-${file.name}`,

      useUniqueFileName: true,
      tags: ["anonymous", "temporary"],
    });

    // Store in database with anonymous flag
    await db.insert(userMedia).values({
      userId: 0, // Special ID for anonymous users
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      url: uploadResponse.url,
      fileType: uploadResponse.fileType,
      height: uploadResponse.height,
      width: uploadResponse.width,
      status: "temporary", // Mark as temporary for cleanup
      createdAt: new Date(),
    });

    return {
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      url: uploadResponse.url,
      fileType: uploadResponse.fileType,
      height: uploadResponse.height,
      width: uploadResponse.width,
    };
  } catch (error) {
    console.error("Failed to upload anonymous image:", error);
    if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
      throw error;
    }
    throw new Error("Failed to upload image");
  }
}

// Add a cleanup function for temporary files
export async function cleanupTemporaryFiles() {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  try {
    // Find temporary files older than 24 hours
    const expiredFiles = await db
      .select()
      .from(userMedia)
      .where(sql`status = 'temporary' AND created_at < ${oneDayAgo}`);

    // Delete from ImageKit and database
    for (const file of expiredFiles) {
      try {
        await imageKit.deleteFile(file.fileId);
      } catch (error) {
        console.error(
          `Failed to delete file ${file.fileId} from ImageKit:`,
          error
        );
      }

      await db
        .update(userMedia)
        .set({ status: "deleted" })
        .where(eq(userMedia.fileId, file.fileId));
    }

    return { success: true, deletedCount: expiredFiles.length };
  } catch (error) {
    console.error("Failed to cleanup temporary files:", error);
    return { success: false, error: "Failed to cleanup temporary files" };
  }
}
