import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  Settings,
  Calendar,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Battery,
  Car,
  Star,
} from "lucide-react";

/* ============================
   Lightweight types
============================ */
export type VehicleModel = {
  name?: string;
  year?: number | string;
  tagline?: string;
};

export type MinimalHeroSectionProps = {
  vehicle?: VehicleModel;
  galleryImages?: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  /** Hex/RGB for accent (no red); default sky blue */
  accentHex?: string;
};

/* ============================
   Helpers
============================ */
function useAnimatedNumber(
  target: number,
  opts?: { duration?: number; start?: boolean; reduce?: boolean }
) {
  const duration = opts?.duration ?? 1200;
  const start = opts?.start ?? true;
  const prefersReduced = !!opts?.reduce;

  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);
  const t0 = useRef<number | null>(null);

  useEffect(() => {
    if (!start) {
      setVal(0);
      return;
    }
    if (prefersReduced) {
      setVal(target);
      return;
    }
    if (raf.current) cancelAnimationFrame(raf.current);
    t0.current = null;

    const tick = (ts: number) => {
      if (t0.current == null) t0.current = ts;
      const p = Math.min(1, (ts - t0.current) / duration);
      setVal(target * p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, start, prefersReduced]);

  return val;
}

/* ============================
   Component
============================ */
export default function MinimalHeroSection({
  vehicle,
  galleryImages = [],
  isFavorite = false,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  accentHex = "#3B82F6", // sky-500. No red anywhere.
}: MinimalHeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll mapping that feels consistent: hero viewport → transforms
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.06]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -24]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const computedHeadline =
    (vehicle?.year ? `${vehicle.year} ` : "") + (vehicle?.name || "Toyota GR Carbon");
  const computedTagline = vehicle?.tagline || "Electrified performance meets everyday usability";

  // Safe advance (used by autoplay & user actions)
  const advanceImage = useCallback(
    (dir: 1 | -1) => {
      if (!galleryImages.length) return;
      setCurrentImageIndex((prev) => (prev + dir + galleryImages.length) % galleryImages.length);
      setProgress(0);
    },
    [galleryImages.length]
  );

  // Manual next/prev → pause autoplay (so it doesn’t “fight” the user)
  const userNext = () => {
    setIsAutoPlaying(false);
    advanceImage(1);
  };
  const userPrev = () => {
    setIsAutoPlaying(false);
    advanceImage(-1);
  };

  // Keyboard arrows for accessibility
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      userNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      userPrev();
    }
  };

  // Autoplay with progress bar (only when enabled)
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion || !galleryImages.length) return;
    const duration = 4800;
    const step = 100;
    let elapsed = 0;
    const id = window.setInterval(() => {
      elapsed += step;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        advanceImage(1);
        elapsed = 0;
      }
    }, step);
    return () => window.clearInterval(id);
  }, [isAutoPlaying, prefersReducedMotion, galleryImages.length, advanceImage]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const dx = touchStart - touchEnd;
    if (Math.abs(dx) > 35) (dx > 0 ? userNext() : userPrev());
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Numbers animate once when specs come into view
  const specsRef = useRef<HTMLDivElement>(null);
  const specsInView = useInView(specsRef, { amount: 0.35, once: true });
  const zeroTo100 = useAnimatedNumber(3.2, {
    duration: 900,
    start: specsInView,
    reduce: !!prefersReducedMotion,
  });
  const evRange = useAnimatedNumber(650, {
    duration: 1100,
    start: specsInView,
    reduce: !!prefersReducedMotion,
  });

  const ACCENT = accentHex;

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100vh] flex flex-col bg-black overflow-hidden focus:outline-none"
      aria-label="Premium Automotive Showcase"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Background slideshow */}
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="absolute inset-0 w-full h-full z-0 will-change-transform"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          {galleryImages.length ? (
            <motion.img
              key={currentImageIndex}
              src={galleryImages[currentImageIndex]}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.0, scale: prefersReducedMotion ? 1 : 0.985 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeInOut" }}
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Top readability gradient */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />

      {/* Favorite toggle (top-right) */}
      <button
        type="button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={onToggleFavorite}
        className="absolute right-4 top-4 z-20 p-2 rounded-full bg-black/40 border border-white/10 hover:bg-black/60 transition"
        style={{ color: ACCENT }}
      >
        <Star className={`w-5 h-5 ${isFavorite ? "" : "opacity-60"}`} />
      </button>

      {/* Content */}
      <motion.div style={{ y: contentY }} className="relative flex-1 flex flex-col justify-between z-20">
        {/* Headline / Tagline */}
        <div className="mt-24 px-6 sm:px-12 md:px-24">
          <h1 className="text-white font-black text-4xl sm:text-6xl lg:text-7xl leading-tight drop-shadow-lg">
            {computedHeadline}
          </h1>
          <p className="mt-4 text-white/90 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl">
            {computedTagline}
          </p>
        </div>

        {/* Specs + CTAs */}
        <div ref={specsRef} className="w-full px-6 sm:px-12 md:px-24 pb-12 space-y-8">
          {/* Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-x-12 text-center sm:text-left">
            {/* 0–100 */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5" style={{ color: ACCENT }} />
                <span className="text-white/60 text-sm sm:text-base">0–100 km/h</span>
              </div>
              <span className="text-lg font-bold" style={{ color: ACCENT }} aria-live="polite">
                {zeroTo100.toFixed(1)}s
              </span>
            </div>

            {/* Range */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2">
                <Battery className="w-5 h-5" style={{ color: ACCENT }} />
                <span className="text-white/60 text-sm sm:text-base">Range</span>
              </div>
              <span className="text-lg font-bold" style={{ color: ACCENT }} aria-live="polite">
                {evRange.toFixed(0)} km
              </span>
            </div>

            {/* AWD */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5" style={{ color: ACCENT }} />
                <span className="text-white/60 text-sm sm:text-base">AWD</span>
              </div>
              <span className="text-lg font-bold" style={{ color: ACCENT }}>Dual Motor</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              type="button"
              onClick={onCarBuilder}
              aria-label="Configure and Order"
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02, y: prefersReducedMotion ? 0 : -2 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300"
              style={{ backgroundColor: ACCENT, boxShadow: `0 0 20px ${ACCENT}80` }}
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Configure &amp; Order
            </motion.button>

            <motion.button
              type="button"
              onClick={onBookTestDrive}
              aria-label="Book Test Drive"
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02, y: prefersReducedMotion ? 0 : -2 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/30 backdrop-blur-md rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-white/20"
            >
              <Calendar className="w-5 h-5" />
              Book Test Drive
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Progress bar (only when autoplaying) */}
      {isAutoPlaying && (
        <div className="absolute bottom-10 left-0 w-full h-1 bg-white/20">
          <motion.div className="h-1" style={{ width: `${progress}%`, backgroundColor: ACCENT }} />
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-20 left-4 z-20 flex gap-3">
        <motion.button
          type="button"
          aria-label="Previous Image"
          onClick={userPrev}
          className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white"
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.08 }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.96 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="absolute bottom-20 right-4 z-20 flex gap-3">
        <motion.button
          type="button"
          aria-label="Next Image"
          onClick={userNext}
          className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white"
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.08 }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.96 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        <motion.button
          type="button"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          onClick={() => {
            setIsAutoPlaying((p) => !p);
            setProgress(0);
          }}
          className="p-3 rounded-full bg-black/40"
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.08 }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.96 }}
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4" style={{ color: ACCENT }} />
          )}
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [0, 10, 0] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
      >
        <ArrowDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </section>
  );
}

const MinimalHeroSection = HeroSection;
export default MinimalHeroSection;
