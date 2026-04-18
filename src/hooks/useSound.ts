"use client";
import { useRef, useCallback } from "react";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, endFreq: number, duration: number, gain: number, type: OscillatorType = "sine", delay = 0) => {
      const ctx = getCtx();
      if (!ctx) return;

      const play = () => {
        try {
          const osc = ctx.createOscillator();
          const vol = ctx.createGain();

          osc.connect(vol);
          vol.connect(ctx.destination);

          osc.type = type;
          const t0 = ctx.currentTime + delay;
          osc.frequency.setValueAtTime(freq, t0);
          osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), t0 + duration);

          vol.gain.setValueAtTime(0, t0);
          vol.gain.linearRampToValueAtTime(gain, t0 + 0.01);
          vol.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

          osc.start(t0);
          osc.stop(t0 + duration + 0.01);
        } catch {
          /* audio not available */
        }
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(play).catch(() => {});
      } else {
        play();
      }
    },
    [getCtx]
  );

  const playHover = useCallback(() => {
    tone(1400, 1100, 0.04, 0.025);
  }, [tone]);

  const playClick = useCallback(() => {
    tone(1200, 600, 0.14, 0.035);
    tone(600, 350, 0.14, 0.020, "triangle", 0.02);
  }, [tone]);

  const playNav = useCallback(() => {
    tone(440, 880, 0.10, 0.025);
  }, [tone]);

  const playSuccess = useCallback(() => {
    tone(880,  880,  0.18, 0.04, "sine", 0);
    tone(1109, 1109, 0.18, 0.04, "sine", 0.06);
    tone(1320, 1320, 0.22, 0.04, "sine", 0.12);
  }, [tone]);

  /** Rich pocket-card-reveal: low thump → mid whoosh → high sparkle → resolution */
  const playCardReveal = useCallback(() => {
    tone(90,   55,   0.30, 0.045, "sine",     0);      // deep thump
    tone(280,  780,  0.28, 0.030, "sine",     0.04);   // mid swoosh
    tone(2200, 1400, 0.18, 0.022, "sine",     0.12);   // high glint 1
    tone(3000, 1800, 0.12, 0.014, "sine",     0.17);   // high glint 2
    tone(880,  880,  0.22, 0.028, "triangle", 0.22);   // warm resolution
  }, [tone]);

  return { playHover, playClick, playNav, playSuccess, playCardReveal };
}
