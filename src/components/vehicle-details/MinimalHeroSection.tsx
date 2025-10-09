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
   Theme
============================================================ */
const ACCENT = "#EB0A1E"; // Toyota red
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

  // pause autoplay off-screen
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.35 });

  // preload first few images
  useEffect(() => {
    galleryImages.slice(0, 4).forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setImageLoaded((p) => ({ ...p, [idx]: true }));
    });
  }, [galleryImages]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || !galleryImages.length || !isIntersecting) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % galleryImages.length), 4200);
    return () => clearInterval(id);
  }, [autoPlay, galleryImages.length, isIntersecting]);

  const handlePrevious = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleNext = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p + 1) % galleryImages.length);
  }, [galleryImages.length]);

  // swipe gestures (your hook)
  const touchHandlers = useTouchGestures({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    threshold: 56,
  });

  // share
  const handleShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `${vehicle?.year ?? ""} ${vehicle?.name ?? "Vehicle"}`.trim(),
        text: vehicle?.tagline || "Check out this vehicle",
        url: typeof window !== "undefined" ? window.location.href : undefined,
      });
    } catch {
      /* cancelled */
    }
  }, [vehicle]);

  // computed
  const title = `${vehicle?.year ? vehicle.year + " " : ""}${vehicle?.name ?? "Toyota"}`;
  const tagline = vehicle?.tagline ?? "Electrified performance. Everyday mastery.";

  // simple count-up for a single highlight spec (0–100)
  const [countUp, setCountUp] = useState(0);
  const [countDone, setCountDone] = useState(false);
  useEffect(() => {
    if (!isIntersecting || countDone) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1100; // ms
    const target = 3.2; // seconds to 100 km/h
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setCountUp(Number((p * target).toFixed(1)));
      if (p < 1) raf = requestAnimationFrame(step);
      else setCountDone(true);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isIntersecting, countDone]);

  // desktop parallax tilt
  const stageRef = useRef<HTMLDivElement | null>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!stageRef.current) return;
    if (window.innerWidth < 1024) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stageRef.current.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-(y * 3)}deg)`;
  };
  const onMouseLeave = () => {
    if (stageRef.current) stageRef.current.style.transform = "";
  };

  const specs = useMemo(
    () => [
      { label: "Range", value: "650 km" },
      { label: "Drive", value: "Dual Motor AWD" },
    ],
    [],
  );

  return (
    <section
      ref={targetRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden"
      style={{
        // light, premium pastel backdrop (very subtle)
        backgroundImage:
          "radial-gradient(1200px 800px at 90% -10%, rgba(235,10,30,0.10), transparent), radial-gradient(900px 600px at 10% -20%, rgba(0,0,0,0.05), transparent)",
        backgroundColor: "#fafafa",
      }}
    >
      {/* ───────────────────────── MOBILE ───────────────────────── */}
      <div className="lg:hidden">
        {/* Top bar */}
        <div className="relative z-20 px-4 pt-4" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
          <div className="flex items-center justify-between">
            <motion.div
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-[11px] font-semibold text-neutral-800 shadow-sm"
            >
              New
            </motion.div>
            <div className="flex items-center gap-2">
              {"share" in navigator && (
                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="w-10 h-10 rounded-full bg-white/80 border border-black/10 grid place-items-center shadow-sm active:scale-95"
                >
                  <Share2 className="w-5 h-5 text-neutral-800" />
                </button>
              )}
              <button
                onClick={() => setIsZoomed((s) => !s)}
                aria-label="Fullscreen"
                className="w-10 h-10 rounded-full bg-white/80 border border-black/10 grid place-items-center shadow-sm active:scale-95"
              >
                <Maximize2 className="w-5 h-5 text-neutral-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="relative z-10 px-4 mt-3">
          <div
            ref={stageRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`relative w-full ${
              isZoomed ? "h-[78vh]" : "h-[66vh]"
            } rounded-3xl overflow-hidden border border-black/10 bg-white shadow-[0_20px_80px_-30px_rgba(0,0,0,0.35)]`}
            {...touchHandlers}
          >
            <AnimatePresence mode="wait">
              {galleryImages.length ? (
                <motion.img
                  key={current}
                  src={galleryImages[current]}
                  alt={`${vehicle?.name ?? "Vehicle"} — ${current + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1.02 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.0 }}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: EASE }}
                  onLoad={() => setImageLoaded((p) => ({ ...p, [current]: true }))}
                  loading={current < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-neutral-500">No images</div>
              )}
            </AnimatePresence>

            {/* bottom glow for depth */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(255,255,255,0.95),rgba(255,255,255,0.0))]" />

            {/* Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/85 border border-black/10 grid place-items-center shadow-sm active:scale-95"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-800" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/85 border border-black/10 grid place-items-center shadow-sm active:scale-95"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-800" />
                </button>
              </>
            )}

            {/* Dots (fill style) */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAutoPlay(false);
                      setCurrent(i);
                    }}
                    aria-label={`Go to ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === current ? "w-8 bg-neutral-900" : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info (title/tagline + single stat) */}
        <div className="relative z-10 px-4 mt-5">
          <div className="rounded-2xl border border-black/10 bg-white/85 backdrop-blur-md p-4 shadow-[0_15px_60px_-28px_rgba(0,0,0,0.35)]">
            <h1 className="text-[32px] leading-[1.1] font-semibold text-neutral-900">{title}</h1>
            <p className="mt-1 text-[15px] text-neutral-600">{tagline}</p>

            {/* single highlight chip with count-up */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-800">
              <span className="text-[11px] uppercase tracking-wide text-neutral-500">0–100 km/h</span>
              <span className="text-sm font-semibold">{countUp.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Sticky CTA (safe-area aware) */}
        <div
          className="fixed left-0 right-0 bottom-0 z-30"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.96),rgba(255,255,255,0.65),transparent)]" />
          <div className="relative mx-4 mb-4 mt-6 grid grid-cols-2 gap-2">
            {onCarBuilder && (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 18px 40px -18px rgba(235,10,30,0.6)" }}
                whileTap={{ scale: 0.99 }}
                onClick={onCarBuilder}
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <Settings className="w-5 h-5" />
                Configure
              </motion.button>
            )}
            <button
              className="col-span-2 text-sm text-neutral-700 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500"
              onClick={() => {
                // anchor to specs section if you have one
                const el = document.getElementById("specs");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See specs →
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────── DESKTOP ───────────────────────── */}
      <div className="hidden lg:grid lg:grid-cols-[62%_38%] min-h-[92vh] items-stretch">
        {/* Stage */}
        <div className="relative p-10">
          <div
            ref={stageRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`relative rounded-3xl overflow-hidden border border-black/10 bg-white shadow-[0_40px_140px_-40px_rgba(0,0,0,0.35)] ${
              isZoomed ? "h-[76vh]" : "h-[68vh]"
            }`}
            style={{ transformStyle: "preserve-3d", perspective: 1400 }}
          >
            <AnimatePresence mode="wait">
              {galleryImages.length ? (
                <motion.img
                  key={current}
                  src={galleryImages[current]}
                  alt={`${vehicle?.name ?? "Vehicle"} — ${current + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1.02 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.0 }}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 1.1, ease: EASE }}
                  loading={current < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-neutral-500">No images</div>
              )}
            </AnimatePresence>

            {/* gradient lift */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgba(255,255,255,0.95),rgba(255,255,255,0))]" />

            {/* Arrows */}
            {galleryImages.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4">
                <button
                  onClick={handlePrevious}
                  className="w-12 h-12 rounded-full bg-white/85 hover:bg-white/95 border border-black/10 grid place-items-center shadow-sm"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-800" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white/85 hover:bg-white/95 border border-black/10 grid place-items-center shadow-sm"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-800" />
                </button>
              </div>
            )}
          </div>

          {/* Dots */}
          {galleryImages.length > 1 && (
            <div className="mt-4 flex items-center gap-2">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAutoPlay(false);
                    setCurrent(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-10 bg-neutral-900" : "w-3 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="relative flex flex-col justify-center p-14 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_60%,#ffffff_100%)] border-l border-neutral-200">
          <div className="max-w-md">
            <h1 className="text-5xl font-semibold leading-[1.05] text-neutral-900">{title}</h1>
            <p className="mt-3 text-lg text-neutral-600">{tagline}</p>

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
                  whileHover={{ scale: 1.01, boxShadow: "0 22px 45px -22px rgba(235,10,30,0.6)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onCarBuilder}
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
                  onClick={onBookTestDrive}
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
