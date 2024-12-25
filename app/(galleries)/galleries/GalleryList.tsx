"use client";

import MediaUploadComponent from "./UploadMedia";
import { useContainerWidth } from "./hooks/useContainerWidth";
import { GalleryGrid } from "./GalleryGrid";

export type MediaFile = {
  fileId: string;
  name: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  status?: "active" | "deleted";
  audioCodec?: string;
  videoCodec?: string;
  filePath?: string;
};

export default function GalleryList({
  initialMedia,
}: {
  initialMedia: MediaFile[];
}) {
  const [containerWidth, containerRef] = useContainerWidth();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Gallery</h1>
        <MediaUploadComponent />
      </div>

      <GalleryGrid
        media={initialMedia}
        containerWidth={containerWidth}
        containerRef={containerRef}
      />
    </div>
  );
}
