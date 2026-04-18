"use client";
import { useRef, useEffect, useState } from "react";

export function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// Uses CSS keyframe animation (fadeSlideUp defined in globals.css)
// Much more reliable than CSS transitions — animation always plays from its start frame
export function staggerStyle(index: number, inView: boolean, baseDelay = 60): React.CSSProperties {
  if (!inView) return { opacity: 0 };
  return {
    animation: `fadeSlideUp 0.55s ease-out both`,
    animationDelay: `${index * baseDelay}ms`,
  };
}

// For single elements (no stagger)
export function fadeInStyle(inView: boolean, delay = 0): React.CSSProperties {
  if (!inView) return { opacity: 0 };
  return {
    animation: `fadeSlideUp 0.55s ease-out ${delay}ms both`,
  };
}

// Returns className string for simpler cases
export function staggerClass(index: number, inView: boolean, baseDelay = 60): string {
  if (!inView) return "opacity-0";
  return "animate-[fadeSlideUp_0.55s_ease-out_both]";
}
