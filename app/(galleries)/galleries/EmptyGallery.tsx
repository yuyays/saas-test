import { ImageIcon, Upload } from "lucide-react";
import MediaUploadComponent from "./UploadMedia";

export function EmptyGallery() {
  return (
    <div className="container mx-auto py-16">
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
        {/* Decorative Elements */}
        <div className="relative">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-xs">+</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Media Gallery Awaits
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Transform your media with custom text overlays and creative edits.
            Start by uploading your first file.
          </p>
        </div>

        {/* Upload Area */}
        <div className="w-full max-w-sm mx-auto">
          <div className="p-8 border-2 border-dashed rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-background rounded-full">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
                <MediaUploadComponent />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-8">
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">📸 Media Support</h4>
            <p>Upload images and videos in various formats</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">✏️ Text Overlays</h4>
            <p>Add custom text with full positioning control</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">🎨 Customization</h4>
            <p>Edit and style your media with ease</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">💾 Easy Sharing</h4>
            <p>Download and share your creations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
