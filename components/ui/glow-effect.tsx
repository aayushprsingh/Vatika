"use client";

import { useRef, useEffect } from "react";

export function GlowEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      container.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      container.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-2xl"
      style={{
        background: `radial-gradient(
          1200px circle at var(--mouse-x) var(--mouse-y),
          hsl(var(--primary) / 0.06),
          transparent 50%
        )`
      }}
    />
  );
}