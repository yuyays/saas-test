"use client";

import { IKUpload } from "imagekitio-next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import { uploadMediaToDatabase } from "./queries";
import { useToast } from "@/hooks/use-toast";
import ErrorMessage from "./ErrorMessage";

export default function MediaUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      <Button onClick={() => setIsOpen(true)} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Media"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <div className="space-y-4">
            <DialogTitle className="text-lg font-semibold">
              Upload Media
            </DialogTitle>

            {uploading && (
              <div className="flex items-center justify-center p-4">
                <LoadingSpinner />
              </div>
            )}
            {error && <ErrorMessage message={error} />}
            <IKUpload
              fileName="test-upload.png"
              onError={onError}
              onSuccess={onSuccess}
              onUploadStart={() => setUploading(true)}
              className="w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
