"use server";
import { userMedia } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { MediaFile } from "./GalleryList";
import imageKit from "@/lib/iamgeKit";

export async function fetchMedia(userId: number): Promise<MediaFile[]> {
  try {
    const userMediaItems = await db
      .select()
      .from(userMedia)
      .where(eq(userMedia.userId, userId));

    const mediaPromises = userMediaItems.map(async (item) => {
      const fileDetails = await imageKit.getFileDetails(item.fileId);
      return {
        fileId: fileDetails.fileId,
        name: fileDetails.name,
        url: fileDetails.url,
        fileType: fileDetails.fileType,
        height: fileDetails.height,
        width: fileDetails.width,
        // audioCodec: fileDetails.audioCodec,
        // videoCodec: fileDetails.videoCodec,
      };
    });

    return await Promise.all(mediaPromises);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return [];
  }
}

export async function getMediaById(
  fileId: string,
  userId: number
): Promise<MediaFile | null> {
  try {
    // First, check if the media belongs to the user
    const mediaItem = await db
      .select()
      .from(userMedia)
      .where(and(eq(userMedia.fileId, fileId), eq(userMedia.userId, userId)))
      .limit(1);

    if (!mediaItem || mediaItem.length === 0) {
      return null;
    }

    const fileDetails = await imageKit.getFileDetails(fileId);

    return {
      fileId: fileDetails.fileId,
      name: fileDetails.name,
      url: fileDetails.url,
      fileType: fileDetails.fileType,
      height: fileDetails.height,
      width: fileDetails.width,
      // audioCodec: fileDetails.audioCodec,
      // videoCodec: fileDetails.videoCodec,
    };
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return null;
  }
}
// export async function updateMedia(
//   fileId: string,
//   userId: number,
//   updates: Partial<MediaFile>
// ) {
//   try {
//     // First verify ownership
//     const mediaItem = await db
//       .select()
//       .from(userMedia)
//       .where(and(eq(userMedia.fileId, fileId), eq(userMedia.userId, userId)))
//       .limit(1);

//     if (!mediaItem || mediaItem.length === 0) {
//       throw new Error("Media not found or unauthorized");
//     }

//     // Update in database
//     await db
//       .update(userMedia)
//       .set({
//         name: updates.name,
//         // Add other updatable fields
//       })
//       .where(and(eq(userMedia.fileId, fileId), eq(userMedia.userId, userId)));

//     // Update in ImageKit
//     // Based on https://imagekit.io/docs/api-reference/digital-asset-management-dam/managing-assets/update-file-details
//     const updateOptions = {
//       extensions: [
//         {
//           name: "google-auto-tagging",
//           maxTags: 5,
//           minConfidence: 95,
//         },
//       ],
//     };

//     await imageKit.updateFileDetails(fileId, updateOptions);

//     return true;
//   } catch (error) {
//     console.error("Failed to update media:", error);
//     throw error;
//   }
// }

type ImageKitUpdateOptions = {
  removeAITags?: boolean;
  webhookUrl?: string;
  extensions?: Array<{
    name: string;
    maxTags?: number;
    minConfidence?: number;
  }>;
  tags?: string[];
  customCoordinates?: string;
  customMetadata?: Record<string, any>;
};

export async function deleteMedia(fileId: string, userId: number) {
  try {
    // First verify ownership
    const mediaItem = await db
      .select()
      .from(userMedia)
      .where(and(eq(userMedia.fileId, fileId), eq(userMedia.userId, userId)))
      .limit(1);

    if (!mediaItem || mediaItem.length === 0) {
      throw new Error("Media not found or unauthorized");
    }

    // Delete from database
    await db
      .delete(userMedia)
      .where(and(eq(userMedia.fileId, fileId), eq(userMedia.userId, userId)));

    // Delete from ImageKit
    await imageKit.deleteFile(fileId);

    return true;
  } catch (error) {
    console.error("Failed to delete media:", error);
    throw error;
  }
}
