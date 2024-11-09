import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaFile } from "./GalleryList";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { GalleryMedia } from "./GalleryMedia";
//GalleryCard focuses on displaying individual media items
export function GalleryCard({
  item,
  containerWidth,
}: {
  item: MediaFile;
  containerWidth: number;
}) {
  const isVideo = (fileType: string) => fileType === "non-image";

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="truncate text-lg">{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={16 / 9}>
          {item.url && item.url.trim() !== "" ? (
            <Suspense
              fallback={
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              }
            >
              <GalleryMedia item={item} containerWidth={containerWidth} />
            </Suspense>
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </AspectRatio>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {isVideo(item.fileType) ? "Video" : "Image"} • {item.width}x
        {item.height}
      </CardFooter>
    </Card>
  );
}
