"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaFile } from "../GalleryList";
import { CustomizePanel } from "./CustomizePanel";

interface ImageEditorProps {
  media: MediaFile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transformations: Array<{ raw: string }>) => Promise<void>;
}

export function ImageEditor({
  media,
  isOpen,
  onClose,
  onSave,
}: ImageEditorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <CustomizePanel file={media} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}
