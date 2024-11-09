"use client";

import { GalleryCard } from "./GalleryCard";
import { MediaFile } from "./GalleryList";
//GalleryGrid handles the layout and organization of cards

type GalleryGridProps = {
  media: MediaFile[];
  containerWidth: number;
  containerRef: React.RefObject<HTMLDivElement>;
};

export function GalleryGrid({
  media,
  containerWidth,
  containerRef,
}: GalleryGridProps) {
  if (media.length === 0) {
    return <div>No media found. Start by uploading some content!</div>;
  }

  return (
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
  );
}
