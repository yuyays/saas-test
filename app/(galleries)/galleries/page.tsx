import { getUser } from "@/lib/db/queries";
import MediaGallery from "./ImageGallery";
import { MediaFile } from "./ImageGallery";
import imageKit from "@/lib/iamgeKit";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

async function fetchMedia(): Promise<MediaFile[]> {
  try {
    const result = await imageKit.listFiles({
      skip: 0,
      limit: 50,
    });

    return result
      .filter((file: any) => file.url && file.url.trim() !== "")
      .map((file: MediaFile) => ({
        fileId: file.fileId,
        name: file.name,
        url: file.url,
        fileType: file.fileType,
        height: file.height,
        width: file.width,
        audioCodec: file.audioCodec,
        videoCodec: file.videoCodec,
      }));
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
  const mediaItems = await fetchMedia();

  if (mediaItems.length === 0) {
    return <div>No media found or error occurred while fetching media.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Media Gallery</h1>
      <MediaGallery media={mediaItems} />
    </div>
  );
}
