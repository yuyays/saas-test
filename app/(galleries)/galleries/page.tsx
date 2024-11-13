import GalleryList from "./GalleryList";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { fetchMedia } from "./queries";
import MediaUploadComponent from "./UploadMedia";
import { EmptyGallery } from "./EmptyGallery";

export default async function GalleryPage() {
  const session = await getSession();
  session ? { user: session.user } : null;

  if (!session) {
    redirect("/sign-in");
  }
  const mediaItems = await fetchMedia(session.user.id);

  if (mediaItems.length === 0) {
    return <EmptyGallery />;
  }

  return (
    <div className="container mx-auto py-8">
      <GalleryList initialMedia={mediaItems} />
    </div>
  );
}
