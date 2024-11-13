"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface TextOverlayProps {
  id: string;
  onUpdate: (text: string, x: number, y: number) => void;
}

export function TextOverlay({ id, onUpdate }: TextOverlayProps) {
  const [textOverlay, setTextOverlay] = useState("");
  const [textOverlayXPosition, setTextOverlayXPosition] = useState(0);
  const [textOverlayYPosition, setTextOverlayYPosition] = useState(0);

  const xPositionDecimal = textOverlayXPosition / 100;
  const yPositionDecimal = textOverlayYPosition / 100;

  return (
    <Card className="p-4 space-y-4">
      <div>
        <Label htmlFor={`${id}-text`}>Text Overlay</Label>
        <Input
          id={`${id}-text`}
          onChange={(e) => {
            setTextOverlay(e.target.value);
            onUpdate(e.target.value, xPositionDecimal, yPositionDecimal);
          }}
          value={textOverlay}
          placeholder="Enter text..."
        />
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
            onUpdate(textOverlay, v / 100, yPositionDecimal);
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
            onUpdate(textOverlay, xPositionDecimal, v / 100);
          }}
        />
      </div>
    </Card>
  );
}
