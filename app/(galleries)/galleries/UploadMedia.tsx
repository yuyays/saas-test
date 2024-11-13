"use client";

import { IKUpload } from "imagekitio-next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import { uploadMediaToDatabase } from "./queries";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function MediaUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const onError = (err: any) => {
    console.error("Upload Error:", err);
    setUploading(false);
    toast({
      description: "Failed to upload media",
    });
  };

  const onSuccess = async (res: any) => {
    console.log("Upload Success:", res);
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
      console.error("Error saving media to database:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your upload.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
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
            <h2 className="text-lg font-semibold">Upload Media</h2>

            {uploading && (
              <div className="flex items-center justify-center p-4">
                <LoadingSpinner />
              </div>
            )}

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
