"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const AVAILABLE_FONTS = [
  { name: "AbrilFatFace", hasItalic: false, hasBold: false },
  { name: "Amaranth", hasItalic: true, hasBold: true },
  { name: "Arvo", hasItalic: true, hasBold: true },
  { name: "Audiowide", hasItalic: false, hasBold: false },
  { name: "Montserrat", hasItalic: true, hasBold: true },
  { name: "Open Sans", hasItalic: true, hasBold: true },
  { name: "Roboto", hasItalic: true, hasBold: true },
  { name: "Ubuntu", hasItalic: true, hasBold: true },
] as const;

interface TextOverlayProps {
  id: string;
  imageSize: { width: number; height: number } | null;
  onUpdate: (
    text: string,
    x: number,
    y: number,
    bgColor: string,
    font: string,
    fontSize: number
  ) => void;
}

export function TextOverlay({ id, imageSize, onUpdate }: TextOverlayProps) {
  const [textOverlay, setTextOverlay] = useState("");
  const [textOverlayXPosition, setTextOverlayXPosition] = useState(0);
  const [textOverlayYPosition, setTextOverlayYPosition] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [selectedFont, setSelectedFont] = useState("Roboto");
  const [fontSize, setFontSize] = useState(50);

  // Add offset to ensure text is visible at 0,0
  const OFFSET = 10; // 10 pixels offset from edges

  // Convert slider values (0-100) to actual pixel positions with offset
  const xPixelPosition = imageSize
    ? Math.round((textOverlayXPosition / 100) * (imageSize.width - OFFSET * 2)) + OFFSET
    : OFFSET;
  const yPixelPosition = imageSize
    ? Math.round((textOverlayYPosition / 100) * (imageSize.height - OFFSET * 2)) + OFFSET
    : OFFSET;

  const handleUpdate = (
    text: string = textOverlay,
    x: number = xPixelPosition,
    y: number = yPixelPosition,
    bg: string = backgroundColor,
    font: string = selectedFont,
    size: number = fontSize
  ) => {
    const safeText = text.trim() === "" ? " " : text;
    onUpdate(safeText, x, y, bg, font, size);
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <Label htmlFor={`${id}-text`}>Text Overlay</Label>
        <Input
          id={`${id}-text`}
          onChange={(e) => {
            setTextOverlay(e.target.value);
            handleUpdate(e.target.value);
          }}
          value={textOverlay}
          placeholder="Enter text..."
        />
      </div>
      <div>
        <Label htmlFor={`${id}-font`}>Font Family</Label>
        <Select
          value={selectedFont}
          onValueChange={(value) => {
            setSelectedFont(value);
            handleUpdate(
              textOverlay,
              xPixelPosition,
              yPixelPosition,
              backgroundColor,
              value
            );
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_FONTS.map((font) => (
              <SelectItem
                key={font.name}
                value={font.name}
                style={{ fontFamily: font.name }}
              >
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor={`${id}-font-size`}>Font Size</Label>
        <div className="flex items-center gap-4">
          <Slider
            id={`${id}-font-size`}
            min={10}
            max={500}
            step={1}
            value={[fontSize]}
            onValueChange={([value]) => {
              setFontSize(value);
              handleUpdate(
                textOverlay,
                xPixelPosition,
                yPixelPosition,
                backgroundColor,
                selectedFont,
                value
              );
            }}
            className="flex-grow"
          />
          <span className="text-sm font-medium">{fontSize}px</span>
        </div>
      </div>

      <div>
        <Label htmlFor={`${id}-bg`}>Background Color</Label>
        <div className="flex gap-2">
          <Input
            id={`${id}-bg`}
            type="color"
            value={backgroundColor}
            onChange={(e) => {
              setBackgroundColor(e.target.value);
              handleUpdate(
                textOverlay,
                xPixelPosition,
                yPixelPosition,
                e.target.value
              );
            }}
            className="w-12 h-8 p-0"
          />
          <Input
            type="text"
            value={backgroundColor}
            onChange={(e) => {
              setBackgroundColor(e.target.value);
              handleUpdate(
                textOverlay,
                xPixelPosition,
                yPixelPosition,
                e.target.value
              );
            }}
            placeholder="#FFFFFF"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${id}-x`}>
          X Position ({xPixelPosition}px / {imageSize?.width ?? '...'})
        </Label>
        <Slider
          id={`${id}-x`}
          min={0}
          max={100}
          value={[textOverlayXPosition]}
          onValueChange={([v]) => {
            setTextOverlayXPosition(v);
            const newXPixel = imageSize
              ? Math.round((v / 100) * (imageSize.width - OFFSET * 2)) + OFFSET
              : OFFSET;
            handleUpdate(textOverlay, newXPixel, yPixelPosition);
          }}
        />
      </div>

      <div>
        <Label htmlFor={`${id}-y`}>
          Y Position ({yPixelPosition}px / {imageSize?.height ?? '...'})
        </Label>
        <Slider
          id={`${id}-y`}
          min={0}
          max={100}
          value={[textOverlayYPosition]}
          onValueChange={([v]) => {
            setTextOverlayYPosition(v);
            const newYPixel = imageSize
              ? Math.round((v / 100) * (imageSize.height - OFFSET * 2)) + OFFSET
              : OFFSET;
            handleUpdate(textOverlay, xPixelPosition, newYPixel);
          }}
        />
      </div>
    </Card>
  );
}
