"use client";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VenueCarouselProps {
  images: string[];
  className?: string;
  /** Auto-advance interval in ms (default 3500) */
  interval?: number;
  /** Overlay content rendered on top of the image */
  children?: React.ReactNode;
  /** Gradient overlay at bottom — pass false to disable */
  bottomGradient?: boolean;
}

export function VenueCarousel({
  images,
  className = "",
  interval = 3500,
  children,
  bottomGradient = true,
}: VenueCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const pausedRef              = useRef(false);

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % images.length;
      });
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  // Clear the exiting slide after animation finishes
  useEffect(() => {
    if (prev === null) return;
    const id = setTimeout(() => setPrev(null), 580);
    return () => clearTimeout(id);
  }, [prev]);

  if (!images.length) return null;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Exiting slide — flies out to the left */}
      {prev !== null && (
        <div
          className="absolute inset-0 bg-cover bg-center carousel-exit"
          style={{ backgroundImage: `url(${images[prev]})` }}
          aria-hidden="true"
        />
      )}

      {/* Entering slide — slides in from the right */}
      <div
        key={current}
        className="absolute inset-0 bg-cover bg-center carousel-enter"
        style={{ backgroundImage: `url(${images[current]})` }}
      />

      {/* Bottom gradient */}
      {bottomGradient && (
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/65 to-transparent pointer-events-none z-10" />
      )}

      {/* Overlay content (badges, titles, buttons, etc.) */}
      {children && (
        <div className="relative z-20 h-full">
          {children}
        </div>
      )}

      {/* Progress dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-30">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Photo ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setPrev(current);
                setCurrent(i);
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-4 h-1.5 bg-white shadow"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      )}

      {/* Photo counter — top-right */}
      <div className="absolute top-2 right-2 z-30 flex items-center gap-1 text-[10px] text-white/90 bg-black/35 backdrop-blur-sm px-1.5 py-0.5 rounded-full select-none">
        <span className="font-medium">{current + 1}</span>
        <span className="text-white/50">/</span>
        <span>{images.length}</span>
      </div>
    </div>
  );
}
