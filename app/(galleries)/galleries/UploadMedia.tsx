"use client";
import { IKUpload } from "imagekitio-next";
import { useState } from "react";
import { MediaFile } from "./ImageGallery";

type MediaUploadComponentProps = {
  onUploadSuccess: (newMedia: MediaFile) => void;
  onUploadError: () => void;
};

const MediaUploadComponent: React.FC<MediaUploadComponentProps> = ({
  onUploadSuccess,
  onUploadError,
}) => {
  const [uploading, setUploading] = useState(false);

  const onError = (err: any) => {
    console.log("Error", err);
    setUploading(false);
    onUploadError();
  };

  const onSuccess = async (res: any) => {
    console.log("Success", res);
    setUploading(false);

    try {
      const response = await fetch("/api/media/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: res.fileId,
          name: res.name,
          url: res.url,
          fileType: res.fileType,
          height: res.height,
          width: res.width,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save media");
      }

      console.log("Media saved to database");
      onUploadSuccess({
        fileId: res.fileId,
        name: res.name,
        url: res.url,
        fileType: res.fileType,
        height: res.height,
        width: res.width,
      });
    } catch (error) {
      console.error("Error saving media to database:", error);
      onUploadError();
    }
  };

  return (
    <IKUpload
      fileName="test-upload.png"
      onError={onError}
      onSuccess={onSuccess}
      onUploadStart={() => setUploading(true)}
    />
  );
};

export default MediaUploadComponent;
