"use client";

import { useState, useEffect } from "react";
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

type ImageEffects = {
  contrast: boolean;
  sharpness: number;
  grayscale: boolean;
  blur: number;
  cropKeyword: string;
};

export function CustomizePanel({ file, onSave }: CustomizePanelProps) {
  const { toast } = useToast();

  const [effects, setEffects] = useState<ImageEffects>({
    contrast: false,
    sharpness: 0,
    grayscale: false,
    blur: 0,
    cropKeyword: "",
  });

  const [overlays, setOverlays] = useState<Overlay[]>([
    { id: "overlay-1", text: "", x: 0, y: 0, backgroundColor: "#FFFFFF" },
  ]);
  const [transformations, setTransformations] = useState<
    Record<string, { raw: string }>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = file.url;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, [file.url]);

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

  const handleEffectChange = (
    effect: keyof ImageEffects,
    value: string | number | boolean
  ) => {
    setEffects((prev) => ({ ...prev, [effect]: value }));
    
    if (effect === "cropKeyword") {
      if (typeof value === "string" && value.trim()) {
        setTransformations((prev) => ({
          ...prev,
          crop: {
            raw: `fo-${value.trim()}`,
          },
        }));
      } else {
        // Remove crop transformation if keyword is empty
        const { crop, ...rest } = transformations;
        setTransformations(rest);
      }
    } else {
      const newEffects = { ...effects, [effect]: value };
      setEffects(newEffects);

      // Update transformations based on effects while preserving existing transformations
      const newTransformations = { ...transformations };

      // Handle effects
      if (newEffects.contrast) {
        newTransformations.contrast = { raw: "e-contrast" };
      } else {
        delete newTransformations.contrast;
      }

      if (newEffects.sharpness !== 0) {
        newTransformations.sharpness = {
          raw: `e-sharpen${newEffects.sharpness > 0 ? "" : "-soft"}-${Math.abs(
            newEffects.sharpness
          )}`,
        };
      } else {
        delete newTransformations.sharpness;
      }

      if (newEffects.grayscale) {
        newTransformations.grayscale = { raw: "e-grayscale" };
      } else {
        delete newTransformations.grayscale;
      }

      if (newEffects.blur > 0) {
        newTransformations.blur = { raw: `bl-${newEffects.blur}` };
      } else {
        delete newTransformations.blur;
      }

      setTransformations(newTransformations);
    }
  };

  const handleOverlayUpdate = (
    overlayId: string,
    text: string,
    x: number,
    y: number,
    backgroundColor: string,
    font: string,
    fontSize: number
  ) => {
    setOverlays((prev) =>
      prev.map((overlay) =>
        overlay.id === overlayId
          ? { ...overlay, text, x, y, backgroundColor }
          : overlay
      )
    );

    // Update transformations while preserving effects
    const newTransformations = { ...transformations };

    // Use absolute pixel positions directly
    newTransformations[overlayId] = {
      raw: `l-text,i-${text || "_"},ff-${font},fs-${fontSize},ly-${y},lx-${x},bg-${backgroundColor.replace(
        "#",
        ""
      )},l-end`,
    };

    setTransformations(newTransformations);
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
                imageSize={imageSize}
                onUpdate={(text, x, y, bgColor, font, fontsize) =>
                  handleOverlayUpdate(
                    overlay.id,
                    text,
                    x,
                    y,
                    bgColor,
                    font,
                    fontsize
                  )
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

        {/* Image Effects */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={effects.contrast}
              onChange={(e) => handleEffectChange("contrast", e.target.checked)}
              id="contrast"
            />
            <label htmlFor="contrast" className="text-sm font-medium">
              Contrast
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Sharpness ({effects.sharpness})
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={effects.sharpness}
              onChange={(e) =>
                handleEffectChange("sharpness", parseInt(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Blur ({effects.blur})</label>
            <input
              type="range"
              min="0"
              max="100"
              value={effects.blur}
              onChange={(e) => handleEffectChange("blur", parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={effects.grayscale}
              onChange={(e) => handleEffectChange("grayscale", e.target.checked)}
              id="grayscale"
            />
            <label htmlFor="grayscale" className="text-sm font-medium">
              Grayscale
            </label>
          </div>

          {/* Object-aware Cropping */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Object-aware Cropping</label>
            <input
              placeholder="Enter object keyword (e.g., face, person, car)"
              value={effects.cropKeyword}
              onChange={(e) =>
                handleEffectChange("cropKeyword", e.target.value)
              }
            />
            <p className="text-sm text-muted-foreground">
              Enter a keyword to crop the image focusing on that object
            </p>
          </div>
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
