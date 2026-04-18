"use client";
import React, { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  scale?: number;
  shine?: boolean;
}

export function TiltCard({
  children,
  className,
  intensity = 10,
  scale = 1.025,
  shine = true,
}: TiltCardProps) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect   = card.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width;
        const y      = (e.clientY - rect.top)  / rect.height;
        const rotX   = (0.5 - y) * intensity;
        const rotY   = (x - 0.5) * intensity;

        card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale},${scale},${scale})`;
        card.style.transition = "transform 0.08s ease-out";

        if (shine && shineRef.current) {
          shineRef.current.style.opacity    = "1";
          shineRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 72%)`;
        }
      });
    },
    [intensity, scale, shine]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    cancelAnimationFrame(rafRef.current);
    card.style.transform  = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    card.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
    if (shine && shineRef.current) {
      shineRef.current.style.opacity    = "0";
      shineRef.current.style.transition = "opacity 0.4s ease-out";
    }
  }, [shine]);

  return (
    <div
      ref={cardRef}
      className={cn("relative will-change-transform", className)}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {shine && (
        <div
          ref={shineRef}
          className="pointer-events-none absolute inset-0 opacity-0 rounded-[inherit]"
          style={{ zIndex: 10 }}
        />
      )}
    </div>
  );
}
