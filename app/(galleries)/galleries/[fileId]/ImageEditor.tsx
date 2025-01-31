"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Team } from "@/lib/db/schema";

import { MediaFile } from "../GalleryList";
import { CustomizePanel } from "./CustomizePanel";

interface ImageEditorProps {
  media: MediaFile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transformations: Array<{ raw: string }>) => Promise<void>;
  team: Team | null;
}

export function ImageEditor({
  media,
  isOpen,
  onClose,
  onSave,
  team: currentTeam,
}: ImageEditorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Edit Image</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-6">
          <CustomizePanel file={media} onSave={onSave} team={currentTeam} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
