"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MediaUploadComponent from "./UploadMedia";
import { GalleryCard } from "./GalleryCard";
import { useContainerWidth } from "./hooks/useContainerWidth";
import { GalleryHeader } from "./GalleryHeader";
import { GalleryGrid } from "./GalleryGrid";

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

type GalleryListProps = {
  initialMedia: MediaFile[];
};

export default function GalleryList({ initialMedia }: GalleryListProps) {
  const [media, setMedia] = useState<MediaFile[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [containerWidth, containerRef] = useContainerWidth();

  const handleUploadSuccess = (newMedia: MediaFile) => {
    setMedia((prevMedia) => [newMedia, ...prevMedia]);
    setIsUploading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <GalleryHeader
        isUploading={isUploading}
        onUploadClick={() => setIsUploading(true)}
      />

      {isUploading && (
        <div className="mb-6">
          <MediaUploadComponent
            onUploadSuccess={handleUploadSuccess}
            onUploadError={() => setIsUploading(false)}
          />
        </div>
      )}

      <GalleryGrid
        media={media}
        containerWidth={containerWidth}
        containerRef={containerRef}
      />
    </div>
  );
}
