"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Team } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Save, Trash2 } from "lucide-react";

import { GalleryMedia } from "../GalleryMedia";
import { MediaFile } from "../GalleryList";
import {
  deleteMedia,
  saveEditedImage,
  updateMedia,
} from "../../../app/(galleries)/galleries/queries";
import { ImageEditor } from "./ImageEditor";

type MediaDetailsProps = {
  media: MediaFile;
  userId: number;
  team: Team | null;
};

export default function MediaDetails({
  media,
  userId,
  team: currentTeam,
}: MediaDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [editedMedia, setEditedMedia] = useState(media);

  const containerWidth = 1024; // You can make this dynamic if needed
  const aspectRatio = 16 / 9;
  const calculatedHeight = Math.round(containerWidth / aspectRatio);

  const handleSave = async () => {
    try {
      await updateMedia(media.fileId, userId, editedMedia);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update media:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMedia(media.fileId, userId);
      router.push("/galleries");
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  const handleImageEdit = async (transformations: Array<{ raw: string }>) => {
    try {
      await saveEditedImage(media.fileId, userId, transformations);
      setIsImageEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to save edited image:", error);
    }
  };

  const handleEditClick = () => {
    if (media.fileType.includes("video")) {
      setIsEditing(true);
    } else {
      setIsImageEditing(true);
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
        <div className="flex gap-2">
          <Button
            onClick={isEditing ? handleSave : handleEditClick}
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
                Edit {media.fileType.includes("video") ? "Details" : "Image"}
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Media Display */}
      <div className="aspect-video w-full max-w-4xl mx-auto">
        <GalleryMedia item={media} containerWidth={1024} />
      </div>

      {/* Image Editor */}
      {!media.fileType.includes("video") && (
        <ImageEditor
          media={media}
          isOpen={isImageEditing}
          onClose={() => setIsImageEditing(false)}
          onSave={handleImageEdit}
          team={currentTeam}
        />
      )}

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
