import GalleryList, {
  MediaFile,
} from "../../../components/galleries/GalleryList";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { fetchMedia } from "./queries";
import { EmptyGallery } from "../../../components/galleries/EmptyGallery";
import ErrorMessage from "../../../components/galleries/ErrorMessage";

export default async function GalleryPage() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  let mediaItems: MediaFile[] = [];
  let error: string | null = null;

  try {
    mediaItems = await fetchMedia(session.user.id);
  } catch (e) {
    if (e instanceof Error && e.message === "RATE_LIMIT_EXCEEDED") {
      error = "Rate limit exceeded. Please try again later.";
    } else {
      error = "An error occurred while fetching media.";
    }
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (mediaItems.length === 0) {
    return <EmptyGallery />;
  }

  return (
    <div className="container mx-auto py-8">
      <GalleryList initialMedia={mediaItems} />
    </div>
  );
}
