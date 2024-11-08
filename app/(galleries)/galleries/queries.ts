import { userMedia } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
