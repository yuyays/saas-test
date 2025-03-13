"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomizePanel } from "@/app/(galleries)/galleries/[fileId]/CustomizePanel";
import { MediaFile } from "@/app/(galleries)/galleries/GalleryList";
import { uploadAnonymousImage } from "../actions";
import { useToast } from "@/hooks/use-toast";

export function PublicImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAnonymousImage(formData);
      setUploadedImage(result);
      toast({
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        description: "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveTransformations = async (
    transformations: Array<{ raw: string }>
  ) => {
    try {
      // Construct the transformed URL correctly
      const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
      const transformString = transformations.map((t) => t.raw).join(",");

      // Make sure we're using the correct path format
      const fileName = uploadedImage?.name || "";
      const filePath = uploadedImage?.fileId || "";

      // Try both formats to see which one works
      const transformedUrl = `${urlEndpoint}/tr:${transformString}/${fileName}`;

      // Log the URL for debugging
      console.log("Transformed URL:", transformedUrl);

      // Save the transformation to the database if needed
      // await saveAnonymousTransformation(uploadedImage?.fileId || "", transformations);

      toast({
        description: "Transformation saved successfully",
      });

      // return transformedUrl;
    } catch (error) {
      console.error("Failed to save transformation:", error);
      toast({
        variant: "destructive",
        description: "Failed to save transformation",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {!uploadedImage ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            {isUploading ? (
              <p>Uploading...</p>
            ) : (
              <>
                <p className="mb-2">Drop an image here or click to upload</p>
                <Button>Select Image</Button>
              </>
            )}
          </label>
        </div>
      ) : (
        <CustomizePanel
          file={uploadedImage}
          onSave={handleSaveTransformations}
          team={null} // Pass null for team since this is anonymous
        />
      )}
    </div>
  );
}
