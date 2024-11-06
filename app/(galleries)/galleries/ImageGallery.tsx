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
import { useState, useEffect, useRef } from "react";

export type MediaFile = {
  fileId: string;
  name: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  audioCodec?: string;
  videoCodec?: string;
};

export default function MediaGallery({ media }: { media: MediaFile[] }) {
  const [containerWidth, setContainerWidth] = useState(300); // Default width
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth(); // Initial update
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (media.length === 0) {
    return <div>No media found or error occurred while fetching media.</div>;
  }

  const isVideo = (fileType: string) => fileType === "non-image";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((item) => (
        <Card key={item.fileId} className="overflow-hidden" ref={containerRef}>
          <CardHeader>
            <CardTitle className="truncate text-lg">{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9}>
              {item.url && item.url.trim() !== "" ? (
                isVideo(item.fileType) ? (
                  <IKVideo
                    src={item.url}
                    width={containerWidth}
                    height={(containerWidth * 9) / 16}
                    controls={true}
                    className="rounded-md object-cover w-full h-full"
                  />
                ) : (
                  <IKImage
                    src={item.url}
                    alt={item.name}
                    width={containerWidth}
                    height={(containerWidth * 9) / 16}
                    className="rounded-md object-cover w-full h-full"
                  />
                )
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
      ))}
    </div>
  );
}
