"use client";

import { IKUpload } from "imagekitio-next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import { uploadMediaToDatabase } from "../../app/(galleries)/galleries/queries";
import { useToast } from "@/hooks/use-toast";
import ErrorMessage from "./ErrorMessage";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";

export default function MediaUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const onError = (err: any) => {
    console.error("Upload Error:", err);
    setUploading(false);
    toast({
      description: "Failed to upload media",
    });
  };

  const onSuccess = async (res: any) => {
    setError(null); // Clear any previous errors
    setUploading(false);

    try {
      await uploadMediaToDatabase({
        fileId: res.fileId,
        name: res.name,
        url: res.url,
        fileType: res.fileType,
        height: res.height,
        width: res.width,
      });

      toast({
        description: "Media uploaded successfully",
      });
      setIsOpen(false);
    } catch (error) {
      let errorMessage = "An error occurred while saving media.";

      if (error instanceof Error) {
        if (error.message === "RATE_LIMIT_EXCEEDED") {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={uploading}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading..." : "Upload Media"}
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!uploading) setIsOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Media
            </DialogTitle>
            <DialogDescription>
              Upload your images or videos. Supported formats: JPG, PNG, GIF,
              MP4.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={cn(
                "relative rounded-lg border-2 border-dashed p-8 transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25",
                uploading && "opacity-50 pointer-events-none"
              )}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDrop={() => setDragActive(false)}
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <LoadingSpinner />
                  <p className="text-sm text-muted-foreground">
                    Uploading your media...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="rounded-full bg-muted p-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 10MB
                  </p>
                </div>
              )}

              <IKUpload
                fileName="test-upload.png"
                onError={onError}
                onSuccess={onSuccess}
                onUploadStart={() => {
                  setUploading(true);
                  setError(null);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*,video/*"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Upload Progress (optional) */}
            {uploading && (
              <div className="space-y-2">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary animate-progress w-full" />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Uploading...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => !uploading && setIsOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                disabled={uploading}
                onClick={() =>
                  document
                    .querySelector<HTMLInputElement>('input[type="file"]')
                    ?.click()
                }
              >
                Select File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
