"use client";

import { useState } from "react";
import { IKImage } from "imagekitio-next";
import { Button } from "@/components/ui/button";
import { TextOverlay } from "./TextOverlay";
import { Plus, Trash2, Download, Check, Copy } from "lucide-react";
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
  backgroundColor: string;
};

export function CustomizePanel({ file, onSave }: CustomizePanelProps) {
  const { toast } = useToast();

  const [overlays, setOverlays] = useState<Overlay[]>([
    { id: "overlay-1", text: "", x: 0, y: 0, backgroundColor: "#FFFFFF" },
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
    setOverlays([
      ...overlays,
      { id: newId, text: "", x: 0, y: 0, backgroundColor: "#FFFFFF" },
    ]);
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
    y: number,
    backgroundColor: string,
    font: string
  ) => {
    setTransformations((current) => ({
      ...current,
      [overlayId]: {
        raw: `l-text,i-${text ?? " "},ff-${font},fs-50,ly-bw_mul_${y.toFixed(
          2
        )},lx-bw_mul_${x.toFixed(2)},bg-${backgroundColor.replace(
          "#",
          ""
        )},l-end`,
      },
    }));
  };

  const [isCopied, setIsCopied] = useState(false);

  const getTransformedUrl = () => {
    const transformationArray = Object.values(transformations);
    if (transformationArray.length === 0) return null;

    const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
    const transformString = transformationArray.map((t) => t.raw).join(",");
    return `${urlEndpoint}/tr:${transformString}/${file.name}`;
  };

  const handleCopyUrl = async () => {
    const transformedUrl = getTransformedUrl();
    if (!transformedUrl) {
      toast({
        description: "No transformations to copy",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(transformedUrl);
      setIsCopied(true);
      toast({
        description: "URL copied to clipboard",
      });

      // Reset copy state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to copy URL",
      });
    }
  };

  return (
    <div className="grid grid-cols-[350px_1fr] gap-8 h-full">
      <div className="space-y-4 overflow-y-auto">
        {/* Controls Section */}
        <div className="space-y-4">
          {overlays.map((overlay, index) => (
            <div key={overlay.id} className="relative">
              <TextOverlay
                id={overlay.id}
                onUpdate={(text, x, y, bgColor, font) =>
                  handleOverlayUpdate(overlay.id, text, x, y, bgColor, font)
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
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleAddOverlay}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Text Overlay
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleCopyUrl}
              className="flex-1 gap-2"
              disabled={Object.keys(transformations).length === 0}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy URL
                </>
              )}
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
      </div>

      {/* Preview Section */}
      <div className="relative flex items-center justify-center bg-gray-100 rounded-lg p-4">
        <div className="relative max-w-full max-h-full">
          <IKImage
            src={file.url}
            alt={file.name}
            width={1200}
            height={800}
            className="rounded-md object-contain max-h-[70vh]"
            transformation={Object.values(transformations)}
          />
        </div>
      </div>
    </div>
  );
}
