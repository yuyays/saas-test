"use server";
import { userMedia } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { MediaFile } from "./GalleryList";
import imageKit from "@/lib/iamgeKit";
import { FileDetailsOptions } from "imagekit/dist/libs/interfaces/FileDetails";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

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
// update some of the object filed in media(just name for now)
export async function updateMedia(
  fileId: string,
  userId: number,
  updates: Partial<MediaFile>
) {
  try {
    const mediaItem = await db
      .select()
      .from(userMedia)
      .where(and(eq(userMedia.fileId, fileId), eq(userMedia.userId, userId)))
      .limit(1);

    if (!mediaItem || mediaItem.length === 0) {
      throw new Error("Media not found or unauthorized");
    }

    // Update in database
    await db
      .update(userMedia)
      .set({
        name: updates.name,
        // Add other basic fields that can be updated
      })
      .where(and(eq(userMedia.fileId, fileId), eq(userMedia.userId, userId)));

    return true;
  } catch (error) {
    console.error("Failed to update media:", error);
    throw error;
  }
}

// For saving edited image with overlays
export async function saveEditedImage(
  fileId: string,
  userId: number,
  transformations: Array<{ raw: string }>
) {
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

    // Get the original file details
    const fileDetails = await imageKit.getFileDetails(fileId);

    // Generate transformed URL using ImageKit's method
    const transformedUrl = imageKit.url({
      path: `/${fileDetails.name}`,
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
      transformation: transformations,
      transformationPosition: "path",
      queryParameters: {
        version: Date.now().toString(), // Add version to prevent caching
      },
    });

    // Update database with new URL
    await db
      .update(userMedia)
      .set({
        url: transformedUrl,
      })
      .where(and(eq(userMedia.fileId, fileId), eq(userMedia.userId, userId)));

    return {
      success: true,
      data: {
        url: transformedUrl,
        fileId: fileId,
        name: fileDetails.name,
      },
    };
  } catch (error) {
    console.error("Failed to save edited image:", error);
    throw error;
  }
}

// call this when user click upload media button
export async function uploadMediaToDatabase(mediaData: {
  fileId: string;
  name: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    await db.insert(userMedia).values({
      userId: session.user.id,
      ...mediaData,
    });

    revalidatePath("/galleries");
    return { success: true };
  } catch (error) {
    console.error("Failed to save media:", error);
    throw error;
  }
}
