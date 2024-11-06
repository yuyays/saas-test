import ImageGallery, { ImageFile } from "./ImageGallery";
import imageKit from "@/lib/iamgeKit";

async function fetchImages(): Promise<ImageFile[]> {
  try {
    const result = await imageKit.listFiles({
      skip: 0,
      limit: 50,
    });

    return result.map((file: any) => ({
      fileId: file.fileId,
      name: file.name,
      url: file.url,
      thumbnail: file.thumbnail,
    }));
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const images = await fetchImages();
  console.log(images[1].url);

  if (images.length === 0) {
    return <div>No images found or error occurred while fetching images.</div>;
  }

  return (
    <div>
      <h1>Image Gallery</h1>
      <div className="image-grid">
        <ImageGallery images={images} />
      </div>
    </div>
  );
}
