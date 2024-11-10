import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";
import { getMediaById } from "../queries";
import MediaDetails from "./MediaDetails";
import { getSession } from "@/lib/auth/session";

export default async function MediaPage({
  params,
}: {
  params: {
    fileId: string;
  };
}) {
  const { fileId } = await params;

  if (!fileId) {
    notFound();
  }

  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const media = await getMediaById(fileId, session.user.id);
  if (!media) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <MediaDetails media={media} userId={session.user.id} />
      </Suspense>
    </div>
  );
}
