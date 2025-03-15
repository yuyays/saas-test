import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";
import { getSession } from "@/lib/auth/session";
import { getTeamForUser, getUser } from "@/lib/db/queries";

import { getMediaById } from "../queries";
import MediaDetails from "../../../../components/galleries/fileId/MediaDetails";
import { MediaFile } from "../../../../components/galleries/GalleryList";
import ErrorMessage from "../../../../components/galleries/ErrorMessage";

export default async function MediaPage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  //const fileId = (await params).fileId;
  const user = await getUser();
  let currentTeam = null;

  if (user) {
    currentTeam = await getTeamForUser(user.id);
  }

  if (!fileId) {
    notFound();
  }

  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  let media: MediaFile | null = null;
  let error: string | null = null;

  try {
    media = await getMediaById(fileId, session.user.id);
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
  if (!media) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <MediaDetails
          media={media}
          userId={session.user.id}
          team={currentTeam}
        />
      </Suspense>
    </div>
  );
}
