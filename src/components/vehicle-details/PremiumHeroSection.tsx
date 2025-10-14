import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Settings,
  Share2,
  Info,
  Zap,
  Gauge,
  Fuel,
  Shield,
} from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";
import { PremiumImage } from "@/components/ui/premium-image";
import { PremiumButton } from "@/components/ui/premium-button";
import AnimatedCounter from "@/components/ui/animated-counter";

export type PremiumHeroSectionProps = {
  vehicle?: VehicleModel & {
    tagline?: string;
    priceFrom?: string; // "From AED 129,900*"
    badges?: string[]; // ["Hybrid","EV","GR"]
    disclaimer?: string; // price footnote
    year?: number;
  };
  galleryImages: string[];
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
};

const PremiumHeroSection: React.FC<PremiumHeroSectionProps> = ({
  vehicle,
  galleryImages = [],
  onBookTestDrive,
  onCarBuilder,
}) => {
  const prefersReduced = useReducedMotion();
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.35 });

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPriceNote, setShowPriceNote] = useState(false);

  const images = galleryImages.length ? galleryImages : [];

  // Preload first 3 images
  useEffect(() => {
    images.slice(0, 3).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Autoplay while in view
  useEffect(() => {
    if (!autoPlay || !isIntersecting || images.length < 2) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [autoPlay, isIntersecting, images.length]);

  const prev = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p + 1) % images.length);
  }, [images.length]);

  const touchHandlers = useTouchGestures({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 50,
  });

  const handleShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `${vehicle?.year ? vehicle.year + " " : ""}${vehicle?.name ?? "Vehicle"}`,
        text: vehicle?.tagline || "Check this out",
        url: typeof window !== "undefined" ? window.location.href : undefined,
      });
    } catch {
      /* noop */
    }
  }, [vehicle]);

  const title = `${vehicle?.year ? vehicle.year + " " : ""}${vehicle?.name ?? "Toyota"}`;
  const tagline = vehicle?.tagline ?? "Electrified performance. Everyday mastery.";
  const priceFrom = vehicle?.priceFrom;

  const specs = [
    { icon: Zap, value: 268, suffix: " HP", label: "Power" },
    { icon: Gauge, value: 7.1, suffix: " s", label: "0–100 km/h", decimals: 1 },
    { icon: Fuel, value: 850, suffix: " km", label: "Range" },
    { icon: Shield, value: 5, suffix: "★", label: "Safety" },
  ] as const;

  // Safe-area insets (for notch devices; nothing sticky)
  const safe = {
    top: "env(safe-area-inset-top)",
    bottom: "env(safe-area-inset-bottom)",
  } as const;

  return (
    <section ref={targetRef} className="relative isolate min-h-[100svh] bg-white text-gray-900" {...touchHandlers}>
      {/* ===== FULL-BLEED STAGE (single layout for all breakpoints) ===== */}
      <div className="relative h-[100svh] w-full overflow-hidden">
        {/* Media */}
        <AnimatePresence mode="wait">
          <motion.div
            key={images.length ? images[current] : "placeholder"}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.15, scale: 0.98 }}
            transition={{ duration: prefersReduced ? 0.2 : 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {images.length ? (
              <PremiumImage
                src={images[current]}
                alt={`${title} – ${current + 1}`}
                priority={current === 0}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 h-full w-full bg-gray-100" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Readability gradients (bottom + top) */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-[45%] bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 top-0 z-10 h-[18%] bg-gradient-to-b from-black/15 via-black/0 to-transparent" />

        {/* Top utilities (not sticky, just inside hero) */}
        <div className="absolute left-0 right-0 z-20 flex items-center justify-between p-4" style={{ top: safe.top }}>
          <div className="text-xs text-white/90">{vehicle?.badges?.join(" • ")}</div>
          <button
            onClick={handleShare}
            className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 backdrop-blur"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={prev}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/30 p-3 backdrop-blur"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </motion.button>
            <motion.button
              onClick={next}
              whileTap={{ scale: 0.95 }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/30 p-3 backdrop-blur"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </motion.button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-[32%] left-0 right-0 z-20 flex items-center justify-center gap-2 px-6">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all ${i === current ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}

        {/* ===== Overlay Content: centered-left on desktop, centered on mobile ===== */}
        <div className="absolute inset-x-0 bottom-0 z-30" style={{ paddingBottom: `max(16px, ${safe.bottom})` }}>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="pb-6 sm:pb-8 lg:pb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                NEW 2025
              </div>

              {/* Title / Tagline */}
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-base text-white/90 sm:text-lg">{tagline}</p>

              {/* Price + disclaimer */}
              {priceFrom && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="text-sm font-medium text-white">{priceFrom}</div>
                  {vehicle?.disclaimer && (
                    <div className="relative">
                      <button
                        onClick={() => setShowPriceNote((s) => !s)}
                        className="rounded-full border border-white/40 bg-white/10 p-1 backdrop-blur"
                        aria-expanded={showPriceNote}
                        aria-controls="price-note"
                      >
                        <Info className="h-4 w-4 text-white/80" />
                      </button>
                      <AnimatePresence>
                        {showPriceNote && (
                          <motion.div
                            id="price-note"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="absolute z-40 mt-2 w-72 rounded-xl border border-white/20 bg-white/95 p-3 text-xs text-gray-700 shadow-xl backdrop-blur"
                          >
                            {vehicle.disclaimer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {/* Specs row */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-4">
                {specs.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ y: 12, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white backdrop-blur"
                    >
                      <Icon className="h-5 w-5 text-red-300" />
                      <div>
                        <div className="text-lg font-semibold">
                          <AnimatedCounter
                            value={s.value as number}
                            suffix={s.suffix}
                            decimals={(s as any).decimals || 0}
                          />
                        </div>
                        <div className="text-xs text-white/80">{s.label}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="mt-5 flex flex-col gap-3 sm:max-w-xl sm:flex-row">
                <PremiumButton
                  onClick={onBookTestDrive}
                  className="h-14 flex-1 rounded-2xl bg-red-600 text-white shadow-2xl shadow-red-600/30 hover:bg-red-600/90"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Test Drive
                </PremiumButton>
                <PremiumButton
                  onClick={onCarBuilder}
                  variant="outline"
                  className="h-14 flex-1 rounded-2xl border-2 border-white/70 bg-white/10 text-white hover:bg-white/20 backdrop-blur"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Configure
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Optional: fullscreen view when zoomed ===== */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute right-8 top-8 z-10 rounded-full bg-white/10 p-3 backdrop-blur"
              aria-label="Close"
            >
              <Maximize2 className="h-6 w-6 text-white" />
            </button>
            {images.length ? (
              <img src={images[current]} alt={title} className="h-full w-full object-contain" />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PremiumHeroSection;
