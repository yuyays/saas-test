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
  onUpdate: (
    text: string,
    x: number,
    y: number,
    bgColor: string,
    font: string
  ) => void;
}

export function TextOverlay({ id, onUpdate }: TextOverlayProps) {
  const [textOverlay, setTextOverlay] = useState("");
  const [textOverlayXPosition, setTextOverlayXPosition] = useState(0);
  const [textOverlayYPosition, setTextOverlayYPosition] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [selectedFont, setSelectedFont] = useState("Roboto");
  const xPositionDecimal = textOverlayXPosition / 100;
  const yPositionDecimal = textOverlayYPosition / 100;

  const handleUpdate = (
    text: string = textOverlay,
    x: number = xPositionDecimal,
    y: number = yPositionDecimal,
    bg: string = backgroundColor,
    font: string = selectedFont
  ) => {
    const safeText = text.trim() === "" ? " " : text;
    onUpdate(safeText, x, y, bg, font);
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
              xPositionDecimal,
              yPositionDecimal,
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
                xPositionDecimal,
                yPositionDecimal,
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
                xPositionDecimal,
                yPositionDecimal,
                e.target.value
              );
            }}
            placeholder="#FFFFFF"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${id}-x`}>X Position</Label>
        <Slider
          id={`${id}-x`}
          min={0}
          max={100}
          value={[textOverlayXPosition]}
          onValueChange={([v]) => {
            setTextOverlayXPosition(v);
            handleUpdate(textOverlay, v / 100, yPositionDecimal);
          }}
        />
      </div>

      <div>
        <Label htmlFor={`${id}-y`}>Y Position</Label>
        <Slider
          id={`${id}-y`}
          min={0}
          max={100}
          value={[textOverlayYPosition]}
          onValueChange={([v]) => {
            setTextOverlayYPosition(v);
            handleUpdate(textOverlay, xPositionDecimal, v / 100);
          }}
        />
      </div>
    </Card>
  );
}
