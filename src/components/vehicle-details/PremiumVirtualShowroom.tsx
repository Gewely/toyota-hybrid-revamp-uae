"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, Maximize2, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface PremiumVirtualShowroomProps {
  vehicleName: string;
  /** Optional explicit poster (overrides discovery). */
  posterUrl?: string;
  /** Use "contain" if your poster is a transparent PNG. */
  objectFit?: "cover" | "contain";
}

const PremiumVirtualShowroom: React.FC<PremiumVirtualShowroomProps> = ({
  vehicleName,
  posterUrl,
  objectFit = "cover",
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [discoveredPoster, setDiscoveredPoster] = useState<string | null>(null);
  const [posterTried, setPosterTried] = useState(false);

  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const watchdog = useRef<number | null>(null);

  // Normalize showroom path
  const urlPath = useMemo(
    () =>
      encodeURIComponent(
        vehicleName
          .toLowerCase()
          .replace(/toyota\s+/gi, "")
          .trim()
          .replace(/\s+/g, "-"),
      ),
    [vehicleName],
  );

  const base = `https://www.virtualshowroom.toyota.ae/configurator/${urlPath}`;
  const iframeUrl = `${base}/en`;

  // ---------- Smart Poster Discovery (no CORS fetch; image tag probes) ----------
  useEffect(() => {
    if (posterUrl) {
      setDiscoveredPoster(posterUrl);
      setPosterTried(true);
      return;
    }
    let cancelled = false;

    // Try a handful of common asset patterns used for share/OG images.
    // (Safe to attempt via <img>; onError -> try next.)
    const candidates: string[] = [
      `${base}/share.jpg`,
      `${base}/share.png`,
      `${base}/og-image.jpg`,
      `${base}/og-image.png`,
      `${base}/thumbnail.jpg`,
      `${base}/thumbnail.png`,
      `${base}/poster.jpg`,
      `${base}/poster.png`,
      `${base}/en/share.jpg`,
      `${base}/en/share.png`,
      `${base}/en/og-image.jpg`,
      `${base}/en/og-image.png`,
      `${base}/en/thumbnail.jpg`,
      `${base}/en/thumbnail.png`,
    ];

    const tryIndex = (i: number) => {
      if (cancelled || i >= candidates.length) {
        setPosterTried(true);
        return;
      }
      const probe = new Image();
      probe.decoding = "async";
      probe.loading = "eager";
      probe.src = candidates[i];
      probe.onload = () => {
        if (cancelled) return;
        setDiscoveredPoster(candidates[i]);
        setPosterTried(true);
      };
      probe.onerror = () => tryIndex(i + 1);
    };

    tryIndex(0);
    return () => {
      cancelled = true;
    };
  }, [base, posterUrl]);

  // Reasonable brand-safe default if nothing discovered
  const fallbackPoster = useMemo(() => {
    const name = vehicleName.toLowerCase();
    if (name.includes("land") && name.includes("cruiser")) {
      return "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1920&auto=format&fit=crop";
    }
    return "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1920&auto=format&fit=crop";
  }, [vehicleName]);

  const heroPoster = discoveredPoster || (posterTried ? fallbackPoster : undefined);

  const handleActivate = useCallback(() => {
    setIsActive(true);
    setIsLoaded(false);
    setError(null);

    if (isMobile && !prefersReduced) {
      window.setTimeout(() => setShowHint(true), 350);
      window.setTimeout(() => setShowHint(false), 2400);
    }

    if (watchdog.current) window.clearTimeout(watchdog.current);
    watchdog.current = window.setTimeout(() => {
      if (!isLoaded) setError("Taking longer than usual. You can open the showroom in a new tab.");
    }, 10000);
  }, [isMobile, prefersReduced, isLoaded]);

  const handleClose = useCallback(() => {
    setIsActive(false);
    setIsFullscreen(false);
    setShowHint(false);
    setError(null);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => void 0);
    }
  }, []);

  const supportsFullscreen = useMemo(
    () => typeof document !== "undefined" && (document as any).fullscreenEnabled !== false,
    [],
  );

  const toggleFullscreen = useCallback(async () => {
    if (!shellRef.current) return;
    try {
      if (!supportsFullscreen) {
        window.open(iframeUrl, "_blank", "noopener,noreferrer");
        return;
      }
      if (!document.fullscreenElement) {
        await shellRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {
      window.open(iframeUrl, "_blank", "noopener,noreferrer");
    }
  }, [iframeUrl, supportsFullscreen]);

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

  /* --------------------- Immersive Shell (light UI) --------------------- */
  if (isActive) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={shellRef}
        className={`${isFullscreen ? "fixed inset-0 z-[70]" : "relative w-full"} bg-white`}
        aria-label={`${vehicleName} Virtual Showroom`}
      >
        {/* Light controls bar */}
        <div
          className="absolute top-0 left-0 right-0 z-20"
          style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
        >
          <div className="bg-gradient-to-b from-white/90 to-transparent px-3 sm:px-4 py-3 flex items-center justify-between border-b border-black/5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Badge variant="secondary" className="bg-black/5 text-black border-black/10 rounded-full">
                Virtual Showroom
              </Badge>
              <h3 className="text-black/80 font-medium text-sm sm:text-base truncate">{vehicleName}</h3>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-black hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-black hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20"
                aria-label="Close virtual showroom"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="w-full" style={{ height: "100dvh" }}>
          <div className="relative w-full h-full">
            <AnimatePresence>
              {!isLoaded && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-black/[0.06] via-black/[0.03] to-transparent animate-pulse"
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-1/2 -translate-x-1/2 top-16 z-30 max-w-[92vw] sm:max-w-md"
                  aria-live="polite"
                >
                  <div className="backdrop-blur-md bg-white/90 border border-black/10 rounded-2xl p-4 text-black shadow-xl">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm leading-5">{error}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-[#EB0A1E] text-white hover:opacity-90"
                            onClick={() => window.open(iframeUrl, "_blank", "noopener,noreferrer")}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open in new tab
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => location.reload()}>
                            Retry
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Showroom Iframe */}
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              title={`${vehicleName} Virtual Showroom`}
              className="w-full h-full border-0 block"
              loading="eager"
              onLoad={onIframeLoad}
              allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Bottom safe-area spacer */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-0"
          style={{ height: "env(safe-area-inset-bottom)" }}
        />
      </motion.section>
    );
  }

  /* --------------------- Launcher (Light, with poster) --------------------- */
  return (
    <section
      className="relative px-4 py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-b from-white via-white to-gray-50"
      aria-label="Virtual Showroom Launcher"
    >
      <div className="relative z-10 container mx-auto max-w-6xl">
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <Badge variant="secondary" className="mb-3 bg-black/5 text-black border-black/10 rounded-full">
            Interactive Experience
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            Explore the {vehicleName} in a Virtual Showroom
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-black/60 max-w-2xl mx-auto mt-3">
            Zero downloads, instant access, and a refined interface built for any screen size.
          </p>
        </motion.div>

        {/* Card with poster - Enhanced with 3D flip reveal */}
        <motion.div
          initial={{ opacity: 0, rotateY: 15, y: 30 }}
          whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 80 }}
          className="group relative w-full"
          style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
        >
          <motion.div 
            onClick={handleActivate}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleActivate();
              }
            }}
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] cursor-pointer"
            aria-label={`Enter ${vehicleName} virtual showroom`}
            whileHover={{ 
              y: -8, 
              rotateY: -2,
              boxShadow: '0 20px 60px -15px rgba(0,0,0,0.25)',
              transition: { duration: 0.3 }
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Poster */}
            <div className="aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.3/1] w-full">
              {heroPoster ? (
                <img
                  src={heroPoster}
                  alt={`${vehicleName} preview`}
                  className="w-full h-full object-cover"
                  style={{ objectFit: objectFit }}
                  decoding="async"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-black/[0.06] via-black/[0.03] to-transparent animate-pulse" />
              )}
            </div>

            {/* Overlay HUD */}
            <div className="absolute inset-0 flex items-end pointer-events-none">
              <div className="w-full p-4 sm:p-6 md:p-8 bg-gradient-to-t from-white/90 via-white/40 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs sm:text-sm text-black/60">Virtual Showroom</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">{vehicleName}</h3>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-[#EB0A1E] text-white rounded-lg font-semibold transition-transform group-hover:translate-x-0.5 pointer-events-auto">
                    <ExternalLink className="h-4 w-4" />
                    Enter Virtual Showroom
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-black/60">
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
