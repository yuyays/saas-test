"use client";

import { useState, useEffect, useRef, RefObject } from "react";

export function useContainerWidth(
  initialWidth = 300
): [number, RefObject<HTMLDivElement>] {
  const [width, setWidth] = useState(initialWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return [width, containerRef];
}
