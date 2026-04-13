"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PerformanceContextType {
  lowBandwidthMode: boolean;
  reducedMotion: boolean;
  setLowBandwidthMode: (val: boolean) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

/**
 * PerformanceProvider — Manages Saudi enterprise-specific performance states.
 * Automatically detects prefers-reduced-motion and provides manual low-bandwidth toggle.
 */
export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // ── Service Worker Registration ──────────────────────────────────────────
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (reg) => console.log("SW registered"),
          (err) => console.log("SW failed", err)
        );
      });
    }

    // ── Reduced Motion Detection ──────────────────────────────────────────────
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <PerformanceContext.Provider value={{ lowBandwidthMode, reducedMotion, setLowBandwidthMode }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}
