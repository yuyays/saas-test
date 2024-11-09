"use client";

import { Button } from "@/components/ui/button";

type GalleryHeaderProps = {
  isUploading: boolean;
  onUploadClick: () => void;
};

export function GalleryHeader({
  isUploading,
  onUploadClick,
}: GalleryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Media Gallery</h1>
      <Button onClick={onUploadClick} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Media"}
      </Button>
    </div>
  );
}
