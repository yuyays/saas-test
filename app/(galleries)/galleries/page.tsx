import MediaGallery from "./ImageGallery";
import { MediaFile } from "./ImageGallery";
import imageKit from "@/lib/iamgeKit";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { userMedia } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";

async function fetchMedia(userId: number): Promise<MediaFile[]> {
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

export default async function GalleryPage() {
  const session = await getSession();
  session ? { user: session.user } : null;
  console.log(session, session?.user);

  if (!session) {
    redirect("/sign-in");
  }
  const mediaItems = await fetchMedia(session.user.id);
  if (mediaItems.length === 0) {
    return (
      <div>
        please singin/login. No media found or error occurred while fetching
        media.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <MediaGallery initialMedia={mediaItems} />
    </div>
  );
}
