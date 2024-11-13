"use client";

import { useState } from "react";
import { IKImage } from "imagekitio-next";
import { Button } from "@/components/ui/button";
import { TextOverlay } from "./TextOverlay";
import { Plus, Trash2, Download } from "lucide-react";
import { MediaFile } from "../GalleryList";
import { useToast } from "@/hooks/use-toast";

interface CustomizePanelProps {
  file: MediaFile;
  onSave: (transformations: Array<{ raw: string }>) => Promise<void>;
}

type Overlay = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export function CustomizePanel({ file, onSave }: CustomizePanelProps) {
  const { toast } = useToast();

  const [overlays, setOverlays] = useState<Overlay[]>([
    { id: "overlay-1", text: "", x: 0, y: 0 },
  ]);
  const [transformations, setTransformations] = useState<
    Record<string, { raw: string }>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const transformationArray = Object.values(transformations);
      if (transformationArray.length > 0) {
        await onSave(transformationArray);
      }
    } finally {
      setIsSaving(false);
    }
  };
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const transformationArray = Object.values(transformations);

      if (transformationArray.length === 0) {
        toast({
          description: "No transformations to download",
        });
        return;
      }

      // Construct the transformed URL
      const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
      const transformString = transformationArray.map((t) => t.raw).join(",");
      const transformedUrl = `${urlEndpoint}/tr:${transformString}/${file.name}`;

      // Fetch the image as blob
      const response = await fetch(transformedUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();

      // Create object URL from blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create and trigger download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `edited-${file.name}`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        description: "Image downloaded successfully",
      });
    } catch (error) {
      console.error("Failed to download image:", error);
      toast({
        variant: "destructive",
        description: "Failed to download image",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddOverlay = () => {
    const newId = `overlay-${overlays.length + 1}`;
    setOverlays([...overlays, { id: newId, text: "", x: 0, y: 0 }]);
  };

  const handleDeleteOverlay = (overlayId: string) => {
    if (overlays.length === 1) return;

    setOverlays(overlays.filter((overlay) => overlay.id !== overlayId));
    const newTransformations = { ...transformations };
    delete newTransformations[overlayId];
    setTransformations(newTransformations);
  };

  const handleOverlayUpdate = (
    overlayId: string,
    text: string,
    x: number,
    y: number
  ) => {
    setTransformations((current) => ({
      ...current,
      [overlayId]: {
        raw: `l-text,i-${text ?? " "},fs-50,ly-bw_mul_${y.toFixed(
          2
        )},lx-bw_mul_${x.toFixed(2)},l-end`,
      },
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        {overlays.map((overlay, index) => (
          <div key={overlay.id} className="relative">
            <TextOverlay
              id={overlay.id}
              onUpdate={(text, x, y) =>
                handleOverlayUpdate(overlay.id, text, x, y)
              }
            />
            {index > 0 && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2"
                onClick={() => handleDeleteOverlay(overlay.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          onClick={handleAddOverlay}
          variant="outline"
          className="w-full mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Text Overlay
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={Object.keys(transformations).length === 0 || isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            onClick={handleDownload}
            variant="secondary"
            disabled={
              Object.keys(transformations).length === 0 || isDownloading
            }
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>

      <div className="relative aspect-video">
        <IKImage
          src={file.url}
          alt={file.name}
          width={800}
          height={450}
          className="rounded-md object-cover w-full h-full"
          transformation={Object.values(transformations)}
        />
      </div>
    </div>
  );
}
