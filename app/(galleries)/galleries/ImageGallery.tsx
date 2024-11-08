"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import MediaUploadComponent from "./UploadMedia";
import { GalleryCard } from "./GalleryCard";

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

export default function MediaGallery({
  initialMedia,
}: {
  initialMedia: MediaFile[];
}) {
  const [media, setMedia] = useState<MediaFile[]>(initialMedia);
  const [containerWidth, setContainerWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleUploadSuccess = (newMedia: MediaFile) => {
    setMedia((prevMedia) => [newMedia, ...prevMedia]);
    setIsUploading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Gallery</h1>
        <Button onClick={() => setIsUploading(true)} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Media"}
        </Button>
      </div>

      {isUploading && (
        <div className="mb-6">
          <MediaUploadComponent
            onUploadSuccess={handleUploadSuccess}
            onUploadError={() => setIsUploading(false)}
          />
        </div>
      )}

      {media.length === 0 ? (
        <div>No media found. Start by uploading some content!</div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          ref={containerRef}
        >
          {media.map((item) => (
            <GalleryCard
              key={item.fileId}
              item={item}
              containerWidth={containerWidth}
            />
          ))}
        </div>
      )}
    </div>
  );
}
