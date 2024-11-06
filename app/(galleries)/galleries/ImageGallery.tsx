"use client";
import { IKImage, IKVideo } from "imagekitio-next";

export type ImageFile = {
  fileId: string;
  name: string;
  url: string;
  thumbnail: string;
};

export default function ImageGallery({ images }: { images: ImageFile[] }) {
  if (images.length === 0) {
    return <div>No images found or error occurred while fetching images.</div>;
  }

  return (
    <div>
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.fileId} className="image-item">
            <p>{image.name}</p>
            {image.url && (
              <IKImage
                src={image.url}
                width={300}
                height={300}
                alt={image.name}
              />
            )}
            {/* {image.url && (
              <IKVideo
                src={image.url}
                width={300}
                height={300}
                controls={true}
              />
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}
