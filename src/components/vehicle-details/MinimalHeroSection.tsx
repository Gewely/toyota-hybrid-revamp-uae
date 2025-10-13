import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Settings, Calendar, ChevronLeft, ChevronRight, Share2, Maximize2 } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";

/* ============================================================
   Types
============================================================ */
export type MinimalHeroSectionProps = {
  vehicle?: VehicleModel & { tagline?: string };
  galleryImages: string[];
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
};

/* ============================================================
   Theme / Motion
============================================================ */
const ACCENT = "#EB0A1E"; // Toyota Red
const EASE = [0.22, 0.61, 0.36, 1] as const;

/* ============================================================
   Component
============================================================ */
const MinimalHeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  galleryImages = [],
  onBookTestDrive,
  onCarBuilder,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // gallery state
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  // pause autoplay when off-screen
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.5 });

  // preload first few + next image
  useEffect(() => {
    const toPreload = new Set<number>([0, 1, 2, 3, (current + 1) % Math.max(1, galleryImages.length)]);
    toPreload.forEach((idx) => {
      const src = galleryImages[idx];
      if (!src) return;
      const img = new Image();
      img.src = src;
      img.onload = () => setImageLoaded((p) => ({ ...p, [idx]: true }));
    });
  }, [galleryImages, current]);

  // autoplay (paused on interaction, reduced motion, offscreen, or zoom)
  useEffect(() => {
    if (!autoPlay || prefersReducedMotion || !galleryImages.length || !isIntersecting || isZoomed) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % galleryImages.length), 5000);
    return () => clearInterval(id);
  }, [autoPlay, prefersReducedMotion, galleryImages.length, isIntersecting, isZoomed]);

  // keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setAutoPlay(false);
        setCurrent((p) => (p - 1 + galleryImages.length) % galleryImages.length);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setAutoPlay(false);
        setCurrent((p) => (p + 1) % galleryImages.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryImages.length]);

  const handlePrevious = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleNext = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p + 1) % galleryImages.length);
  }, [galleryImages.length]);

  // swipe gestures
  const touchHandlers = useTouchGestures({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    threshold: 48,
  });

  // share
  const handleShare = useCallback(async () => {
    if (!("share" in navigator)) return;
    try {
      await navigator.share({
        title: `${vehicle?.year ? `${vehicle.year} ` : ""}${vehicle?.name ?? "Vehicle"}`,
        text: vehicle?.tagline || "Check this out",
        url: typeof window !== "undefined" ? window.location.href : undefined,
      });
    } catch {
      /* user canceled */
    }
  }, [vehicle]);

  // computed
  const title = `${vehicle?.year ? `${vehicle.year} ` : ""}${vehicle?.name ?? "Toyota"}`;
  const tagline = vehicle?.tagline ?? "Electrified performance. Everyday mastery.";

  // spec: animated highlight 0–100
  const [countUp, setCountUp] = useState(0);
  const [countDone, setCountDone] = useState(false);
  useEffect(() => {
    if (!isIntersecting || countDone || prefersReducedMotion) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const target = 3.2;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setCountUp(Number((p * target).toFixed(1)));
      if (p < 1) raf = requestAnimationFrame(step);
      else setCountDone(true);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isIntersecting, countDone, prefersReducedMotion]);

  const specs = useMemo(
    () => [
      { label: "Range", value: "650 km" },
      { label: "Drive", value: "Dual Motor AWD" },
    ],
    [],
  );

  // subtle 3D tilt (desktop only)
  const stageRef = useRef<HTMLDivElement | null>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!stageRef.current || window.innerWidth < 1024) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stageRef.current.style.transform = `perspective(1200px) rotateY(${x * 3.2}deg) rotateX(${-(y * 2.4)}deg)`;
  };
  const onMouseLeave = () => {
    if (stageRef.current) stageRef.current.style.transform = "";
  };

  const hasImages = galleryImages.length > 0;

  return (
    <section
      ref={targetRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#f8f8f8",
        backgroundImage:
          "radial-gradient(1200px 800px at 85% -10%, rgba(235,10,30,0.06), transparent), radial-gradient(900px 600px at 10% -20%, rgba(0,0,0,0.04), transparent)",
      }}
      aria-label="Vehicle hero section"
    >
      {/* ─────────────── MOBILE ─────────────── */}
      <div className="lg:hidden">
        {/* Top bar */}
        <div className="relative z-20 px-4 pt-4" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
          <div className="flex items-center justify-between">
            <motion.span
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-black/10 text-[11px] font-semibold text-neutral-800 shadow-sm"
            >
              New
            </motion.span>
            <div className="flex items-center gap-2">
              {"share" in navigator && (
                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="w-10 h-10 rounded-full bg-white/85 border border-black/10 grid place-items-center shadow-sm active:scale-95"
                >
                  <Share2 className="w-5 h-5 text-neutral-800" />
                </button>
              )}
              <button
                onClick={() => setIsZoomed((s) => !s)}
                aria-label="Expand"
                className="w-10 h-10 rounded-full bg-white/85 border border-black/10 grid place-items-center shadow-sm active:scale-95"
              >
                <Maximize2 className="w-5 h-5 text-neutral-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="relative z-10 px-4 mt-3" {...touchHandlers}>
          <div
            ref={stageRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`relative w-full ${isZoomed ? "h-[78vh]" : "h-[64vh]"} rounded-3xl overflow-hidden border border-black/10 bg-white shadow-[0_18px_60px_-28px_rgba(0,0,0,0.35)]`}
            role="region"
            aria-roledescription="carousel"
            aria-label="Gallery"
          >
            <AnimatePresence mode="wait">
              {hasImages ? (
                <motion.img
                  key={current}
                  src={galleryImages[current]}
                  alt={`${vehicle?.name ?? "Vehicle"} — ${current + 1}/${galleryImages.length}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 ${imageLoaded[current] ? "blur-0" : "blur-md"}`}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1.01 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.0 }}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: EASE }}
                  onLoad={() => setImageLoaded((p) => ({ ...p, [current]: true }))}
                  loading={current < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-neutral-500">No images</div>
              )}
            </AnimatePresence>

            {/* gradient lift for legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(255,255,255,0.95),rgba(255,255,255,0.0))]" />

            {/* Controls */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 border border-black/10 grid place-items-center shadow-sm active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-900" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 border border-black/10 grid place-items-center shadow-sm active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-900" />
                </button>
              </>
            )}

            {/* Scrubber dots */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAutoPlay(false);
                      setCurrent(i);
                    }}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-neutral-900" : "w-2.5 bg-neutral-300 hover:bg-neutral-400"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info card */}
        <div className="relative z-10 px-4 mt-5">
          <div className="rounded-2xl border border-black/10 bg-white/85 backdrop-blur p-4 shadow-[0_14px_48px_-26px_rgba(0,0,0,0.35)]">
            <h1 className="text-[clamp(24px,5vw,32px)] leading-[1.08] font-semibold text-neutral-900">{title}</h1>
            <p className="mt-1 text-[15px] text-neutral-600">{tagline}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-800">
              <span className="text-[11px] uppercase tracking-wide text-neutral-500">0–100 km/h</span>
              <span className="text-sm font-semibold">{countUp.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div
          className="fixed left-0 right-0 bottom-0 z-30"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.96),rgba(255,255,255,0.65),transparent)]" />
          <div className="relative mx-4 mb-4 mt-6 grid grid-cols-2 gap-2">
            {onCarBuilder && (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 18px 40px -18px rgba(235,10,30,0.55)" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setAutoPlay(false);
                  onCarBuilder();
                }}
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <Settings className="w-5 h-5" />
                Configure
              </motion.button>
            )}
            {onBookTestDrive && (
              <button
                onClick={() => {
                  setAutoPlay(false);
                  onBookTestDrive();
                }}
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold border border-neutral-200 bg-white text-neutral-900"
              >
                <Calendar className="w-5 h-5" />
                Test Drive
              </button>
            )}
            <button
              className="col-span-2 text-sm text-neutral-700 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500"
              onClick={() => document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" })}
            >
              See specs →
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────── DESKTOP ─────────────── */}
      <div className="hidden lg:grid lg:grid-cols-[60%_40%] min-h-[92vh] items-stretch">
        {/* Stage */}
        <div className="relative p-12">
          <div
            ref={stageRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`relative rounded-3xl overflow-hidden border border-black/10 bg-white shadow-[0_36px_120px_-42px_rgba(0,0,0,0.35)] ${isZoomed ? "h-[76vh]" : "h-[68vh]"}`}
            style={{ transformStyle: "preserve-3d", perspective: 1400 }}
            role="region"
            aria-roledescription="carousel"
            aria-label="Gallery"
            onMouseEnter={() => setAutoPlay(false)}
          >
            <AnimatePresence mode="wait">
              {hasImages ? (
                <motion.img
                  key={current}
                  src={galleryImages[current]}
                  alt={`${vehicle?.name ?? "Vehicle"} — ${current + 1}/${galleryImages.length}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 ${imageLoaded[current] ? "blur-0" : "blur-md"}`}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1.015 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 1.1, ease: EASE }}
                  onLoad={() => setImageLoaded((p) => ({ ...p, [current]: true }))}
                  loading={current < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-neutral-500">No images</div>
              )}
            </AnimatePresence>

            {/* Hover controls */}
            {galleryImages.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4">
                <button
                  onClick={handlePrevious}
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white/95 border border-black/10 grid place-items-center shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-900" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white/95 border border-black/10 grid place-items-center shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-900" />
                </button>
              </div>
            )}

            {/* Subtle footer gradient for overlays */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_top,rgba(255,255,255,0.95),rgba(255,255,255,0))]" />
          </div>

          {/* Scrubber */}
          {galleryImages.length > 1 && (
            <div className="mt-4 flex items-center gap-2">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAutoPlay(false);
                    setCurrent(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${i === current ? "w-10 bg-neutral-900" : "w-3 bg-neutral-300 hover:bg-neutral-400"}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="relative flex flex-col justify-center p-16 bg-[linear-gradient(180deg,#ffffff_0%,#f9f9f9_60%,#ffffff_100%)] border-l border-neutral-200">
          <div className="max-w-md">
            <h1 className="text-[clamp(38px,4.6vw,56px)] font-semibold leading-[1.04] text-neutral-900">{title}</h1>
            <p className="mt-3 text-[clamp(16px,1.2vw,18px)] text-neutral-600">{tagline}</p>

            <div id="specs" className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-[11px] uppercase tracking-wide text-neutral-500">0–100 km/h</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">{countUp.toFixed(1)}s</div>
              </div>
              {specs.map((s, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4">
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">{s.label}</div>
                  <div className="mt-1 text-lg font-semibold text-neutral-900">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {onCarBuilder && (
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 22px 45px -22px rgba(235,10,30,0.55)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setAutoPlay(false);
                    onCarBuilder();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Settings className="w-5 h-5" />
                  Build
                </motion.button>
              )}
              {onBookTestDrive && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setAutoPlay(false);
                    onBookTestDrive();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold border border-neutral-200 bg-white text-neutral-900"
                >
                  <Calendar className="w-5 h-5" />
                  Test Drive
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinimalHeroSection;
