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
  const oneDayAgoIso = oneDayAgo.toISOString();

  try {
    // Find temporary files older than 24 hours
    const expiredFiles = await db
      .select()
      .from(userMedia)
      .where(sql`status = 'temporary' AND created_at < ${oneDayAgoIso}`);
    // Log each expired file's details for debugging
    expiredFiles.forEach((file) => {
      console.log(
        `Expiring file: fileId=${file.fileId}, created_at=${file.createdAt}, status=${file.status}`
      );
    });
    // Delete from ImageKit and database
    for (const file of expiredFiles) {
      let fileDeleted = false;
      try {
        await imageKit.deleteFile(file.fileId);
        fileDeleted = true;
      } catch (error: any) {
        // Gracefully handle 'file does not exist' error from ImageKit
        if (
          error?.message === "The requested file does not exist." ||
          error?.message?.includes("The requested file does not exist.")
        ) {
          console.info(
            `File ${file.fileId} does not exist in ImageKit. Marking as deleted in DB.`
          );
        } else {
          console.error(
            `Failed to delete file ${file.fileId} from ImageKit:`,
            error
          );
          // Optionally, skip DB update if delete failed for other reasons
        }
      }

      // Mark as deleted in DB regardless if file was already deleted in ImageKit
      await db
        .update(userMedia)
        .set({ status: "deleted" })
        .where(eq(userMedia.fileId, file.fileId));
    }
    // NOTE: If files are not being deleted as expected, review the DB date format for created_at. It should be ISO string or compatible with toISOString().

    return { success: true, deletedCount: expiredFiles.length };
  } catch (error) {
    console.error("Failed to cleanup temporary files:", error);
    return { success: false, error: "Failed to cleanup temporary files" };
  }
}
