import { IKImage, IKVideo } from "imagekitio-next";
import { MediaFile } from "./GalleryList";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useState } from "react";

export function GalleryMedia({
  item,
  containerWidth,
}: {
  item: MediaFile;
  containerWidth: number;
}) {
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
}
