"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, Maximize2, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

/* ============================================================
   PremiumVirtualShowroom — Futuristic, fully responsive
   - Same name + default export
   - Mobile/desktop responsive on any screen size
   - Safe-area aware, dvh heights, true fullscreen API
   - Clean, premium visuals (no “Mario-era” effects)
   - Shimmer skeleton, gesture hint, watchdog fallback
============================================================ */

interface PremiumVirtualShowroomProps {
  vehicleName: string;
}

const PremiumVirtualShowroom: React.FC<PremiumVirtualShowroomProps> = ({ vehicleName }) => {
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const watchdog = useRef<number | null>(null);

  // Convert vehicle name to URL format
  const urlPath = useMemo(
    () =>
      vehicleName
        .toLowerCase()
        .replace(/toyota\s+/gi, "")
        .replace(/\s+/g, "-"),
    [vehicleName],
  );

  const iframeUrl = `https://www.virtualshowroom.toyota.ae/configurator/${urlPath}/en`;

  const handleActivate = useCallback(() => {
    setIsActive(true);
    setIsLoaded(false);
    setError(null);

    // Mobile gesture hint (brief)
    if (isMobile && !prefersReduced) {
      setTimeout(() => setShowHint(true), 450);
      setTimeout(() => setShowHint(false), 3000);
    }

    // Watchdog: if iframe doesn't load in time, show fallback
    if (watchdog.current) window.clearTimeout(watchdog.current);
    watchdog.current = window.setTimeout(() => {
      if (!isLoaded) setError("Taking longer than usual. You can open the showroom in a new tab.");
    }, 10000);
  }, [iframeUrl, isMobile, prefersReduced, isLoaded]);

  const handleClose = useCallback(() => {
    setIsActive(false);
    setIsFullscreen(false);
    setShowHint(false);
    setError(null);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => void 0);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!shellRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await shellRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {
      // If blocked, open in a new tab as a graceful fallback
      window.open(iframeUrl, "_blank", "noopener,noreferrer");
    }
  }, [iframeUrl]);

  // ESC to close
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isActive, handleClose]);

  // Cleanup watchdog
  useEffect(() => {
    return () => {
      if (watchdog.current) window.clearTimeout(watchdog.current);
    };
  }, []);

  const onIframeLoad = useCallback(() => {
    setIsLoaded(true);
    if (watchdog.current) window.clearTimeout(watchdog.current);
  }, []);

  /* --------------------- Immersive Shell --------------------- */
  if (isActive) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={shellRef}
        className={`${isFullscreen ? "fixed inset-0 z-[70]" : "relative w-full"} bg-black`}
        aria-label={`${vehicleName} Virtual Showroom`}
      >
        {/* Controls Bar (safe-area aware) */}
        <div
          className="absolute top-0 left-0 right-0 z-20"
          style={{
            paddingTop: "max(0.5rem, env(safe-area-inset-top))",
          }}
        >
          <div className="bg-gradient-to-b from-black/80 to-transparent px-3 sm:px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Badge variant="secondary" className="bg-background/20 text-white border-white/15 truncate">
                Virtual Showroom
              </Badge>
              <h3 className="text-white/90 font-medium text-sm sm:text-base truncate">{vehicleName}</h3>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/10"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/10"
                aria-label="Close virtual showroom"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Iframe Container (uses dvh/safe-areas for any screen size) */}
        <div
          className="w-full"
          style={{
            // Use modern viewport units for mobile chrome show/hide; fall back via minHeight
            height: "100dvh",
          }}
        >
          <div className="relative w-full h-full">
            {/* Shimmer skeleton while loading */}
            <AnimatePresence>
              {!isLoaded && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.12),rgba(255,255,255,0.06))] [background-size:200%_100%] animate-[shimmer_1.6s_infinite] rounded-none"
                  style={{
                    // Extra safety for devices with rounded corners/notches
                    paddingBottom: "env(safe-area-inset-bottom)",
                  }}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>

            {/* Error/Fallback HUD */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-1/2 -translate-x-1/2 top-16 z-30 max-w-[92vw] sm:max-w-md"
                >
                  <div className="backdrop-blur-md bg-black/60 border border-white/15 rounded-xl p-4 text-white">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm leading-5">{error}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white text-black hover:bg-white/90"
                            onClick={() => window.open(iframeUrl, "_blank", "noopener,noreferrer")}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open in new tab
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/80 hover:bg-white/10"
                            onClick={() => location.reload()}
                          >
                            Retry
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gesture hint (mobile only, short-lived) */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-30"
                  style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                >
                  <div className="px-3 py-2 rounded-full text-xs sm:text-sm text-white/90 bg-black/50 backdrop-blur-md border border-white/15">
                    Drag to rotate • Pinch to zoom
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Showroom */}
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              title={`${vehicleName} Virtual Showroom`}
              className="w-full h-full border-0 block"
              loading="eager"
              onLoad={onIframeLoad}
              // `onError` is not reliable for cross-origin iframes; watchdog handles it.
              allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Bottom safe-area spacer to avoid UI clipping on devices with gesture bars */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-0"
          style={{ height: "env(safe-area-inset-bottom)" }}
        />
      </motion.section>
    );
  }

  /* --------------------- Launcher (Hero Card) --------------------- */
  return (
    <section
      className="relative px-4 py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background"
      aria-label="Virtual Showroom Launcher"
    >
      {/* Ambient, subtle washes (performance-friendly) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30 bg-foreground/5" />
        <div className="absolute -bottom-28 right-1/5 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-20 bg-primary/10" />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
            Interactive Experience
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            Explore the {vehicleName} in a Virtual Showroom
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-3">
            Zero downloads, instant access, and a refined interface built for any screen size.
          </p>
        </motion.div>

        {/* Card */}
        <motion.button
          type="button"
          onClick={handleActivate}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group relative w-full text-left"
          aria-label={`Enter ${vehicleName} virtual showroom`}
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl">
            {/* Poster / Placeholder */}
            <div className="aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.3/1] w-full">
              <div className="w-full h-full bg-gradient-to-br from-muted/40 to-muted/10" />
            </div>

            {/* Overlay HUD */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-4 sm:p-6 md:p-8 bg-gradient-to-t from-background/80 via-background/30 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Virtual Showroom</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">{vehicleName}</h3>
                  </div>
                  <Button
                    size={isMobile ? "default" : "lg"}
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Enter Virtual Showroom
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
          <span>Optimized for mobile & desktop</span>
          <span className="hidden sm:inline">•</span>
          <span>Fast load with graceful fallback</span>
          <span className="hidden sm:inline">•</span>
          <span>Safe-area & accessibility compliant</span>
        </div>
      </div>
    </section>
  );
};

export default PremiumVirtualShowroom;
