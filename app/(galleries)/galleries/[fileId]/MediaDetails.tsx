"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { GalleryMedia } from "../GalleryMedia";
import { ArrowLeft, Edit2, Save } from "lucide-react"; // Optional: for icons
import { useRouter } from "next/navigation";
import { MediaFile } from "../GalleryList";
import { deleteMedia } from "../queries";

type MediaDetailsProps = {
  media: MediaFile;
  userId: number;
};

export default function MediaDetails({ media, userId }: MediaDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMedia, setEditedMedia] = useState(media);

  const handleSave = async () => {
    try {
      //await updateMedia(media.fileId, userId, editedMedia);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update media:", error);
    }
  };
  const handleDelete = async () => {
    try {
      await deleteMedia(media.fileId, userId);
      router.push("/galleries"); // Redirect to gallery list
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Button>
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              Edit Details
            </>
          )}
        </Button>
        <Button
          onClick={isEditing ? handleDelete : () => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              delete Details
            </>
          )}
        </Button>
      </div>

      {/* Media Display */}
      <div className="aspect-video w-full max-w-4xl mx-auto">
        <GalleryMedia
          item={media}
          containerWidth={1024} // You might want to calculate this
        />
      </div>

      {/* Media Details */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          {isEditing ? (
            <Input
              value={editedMedia.name}
              onChange={(e) =>
                setEditedMedia({ ...editedMedia, name: e.target.value })
              }
            />
          ) : (
            <p className="text-lg">{media.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <p>{media.fileType === "non-image" ? "Video" : "Image"}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Dimensions</label>
            <p>
              {media.width} × {media.height}
            </p>
          </div>
        </div>

        {media.fileType === "non-image" && (
          <div className="grid grid-cols-2 gap-4">
            {media.audioCodec && (
              <div>
                <label className="text-sm font-medium">Audio Codec</label>
                <p>{media.audioCodec}</p>
              </div>
            )}
            {media.videoCodec && (
              <div>
                <label className="text-sm font-medium">Video Codec</label>
                <p>{media.videoCodec}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}