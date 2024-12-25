"use server";
import { userMedia } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { MediaFile } from "./GalleryList";
import imageKit from "@/lib/iamgeKit";
import { FileDetailsOptions } from "imagekit/dist/libs/interfaces/FileDetails";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { ratelimit } from "@/lib/db/ratelimit";

export async function fetchMedia(userId: number): Promise<MediaFile[]> {
  try {
    const identifier = `fetchMedia_${userId}`;
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    const userMediaItems = await db
      .select()
      .from(userMedia)
      .where(and(
        eq(userMedia.userId, userId),
        eq(userMedia.status, "active")
      ));

    const mediaPromises = userMediaItems.map(async (item) => {
      try {
        const fileDetails = await imageKit.getFileDetails(item.fileId);
        return {
          fileId: fileDetails.fileId,
          name: fileDetails.name,
          url: fileDetails.url,
          fileType: fileDetails.fileType,
          height: fileDetails.height,
          width: fileDetails.width,
        } as MediaFile;
      } catch (error) {
        // If file not found in ImageKit, mark it as deleted in our database
        if (error instanceof Error && error.message.includes("does not exist")) {
          await markMediaAsDeleted(item.fileId);
        }
        // Skip this media item
        return null;
      }
    });

    const results = await Promise.all(mediaPromises);
    // Filter out null results (deleted media)
    return results.filter((item): item is MediaFile => item !== null);
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
      console.error("Failed due to rate limit:", error);

      throw error;
    }
    console.error("Failed to fetch media:", error);
    throw new Error("Failed to fetch media");
  }
}

async function markMediaAsDeleted(fileId: string) {
  try {
    await db
      .update(userMedia)
      .set({ status: "deleted" })
      .where(eq(userMedia.fileId, fileId));
  } catch (error) {
    console.error("Failed to mark media as deleted:", error);
  }
}

export async function getMediaById(
  fileId: string,
  userId: number
): Promise<MediaFile | null> {
  try {
    const identifier = `getMediaById_${userId}`;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    // First, check if the media belongs to the user and is active
    const mediaItem = await db
      .select()
      .from(userMedia)
      .where(and(
        eq(userMedia.fileId, fileId),
        eq(userMedia.userId, userId),
        eq(userMedia.status, "active")
      ))
      .limit(1);

    if (!mediaItem || mediaItem.length === 0) {
      return null;
    }

    try {
      const fileDetails = await imageKit.getFileDetails(fileId);
      return {
        fileId: fileDetails.fileId,
        name: fileDetails.name,
        url: fileDetails.url,
        fileType: fileDetails.fileType,
        height: fileDetails.height,
        width: fileDetails.width,
      } as MediaFile;
    } catch (error) {
      if (error instanceof Error && error.message.includes("does not exist")) {
        await markMediaAsDeleted(fileId);
      }
      return null;
    }
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
      throw error;
    }
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
      .update(userMedia)
      .set({ status: "deleted" })
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
  {
    try {
      const session = await getSession();
      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      const identifier = `uploadMedia_${session.user.id}`;
      const { success } = await ratelimit.limit(identifier);
      if (!success) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }

      await db.insert(userMedia).values({
        userId: session.user.id,
        ...mediaData,
        status: "active",
      });

      revalidatePath("/galleries");
      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        throw error;
      }
      console.error("Failed to save media:", error);
    }
  }
}
