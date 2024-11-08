"use client";

import { IKImage, IKVideo } from "imagekitio-next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaFile } from "./ImageGallery";
import { Suspense, useState } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";

type GalleryCardProps = {
  item: MediaFile;
  containerWidth: number;
};

const MediaComponent = ({ item, containerWidth }: GalleryCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const isVideo = (fileType: string) => fileType === "non-image";

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
      {isVideo(item.fileType) ? (
        <IKVideo
          src={item.url}
          width={containerWidth}
          height={(containerWidth * 9) / 16}
          controls={true}
          className="rounded-md object-cover w-full h-full"
          onLoadedData={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      ) : (
        <IKImage
          src={item.url}
          alt={item.name}
          width={containerWidth}
          height={(containerWidth * 9) / 16}
          className="rounded-md object-cover w-full h-full"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};

export function GalleryCard({ item, containerWidth }: GalleryCardProps) {
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
              <MediaComponent item={item} containerWidth={containerWidth} />
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
