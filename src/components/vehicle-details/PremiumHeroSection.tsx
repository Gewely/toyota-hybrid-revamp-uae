import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Calendar, Settings, Zap, Gauge, Battery, Shield, Info } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";
import { PremiumImage } from "@/components/ui/premium-image";
import { PremiumButton } from "@/components/ui/premium-button";
import AnimatedCounter from "@/components/ui/animated-counter";

export type PremiumHeroSectionProps = {
  vehicle?: VehicleModel & {
    tagline?: string;
    priceFrom?: string; // e.g., "From AED 129,900*"
    badges?: string[]; // e.g., ["Hybrid","EV","GR"]
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
  const [showPriceNote, setShowPriceNote] = useState(false);

  const images = galleryImages.length ? galleryImages : [];
  const title = `${vehicle?.year ? vehicle.year + " " : ""}${vehicle?.name ?? "Toyota"}`;
  const tagline = vehicle?.tagline ?? "Electrified performance. Everyday mastery.";
  const priceFrom = vehicle?.priceFrom;

  // Specs displayed as glass microcards
  const specs = [
    { icon: Zap, value: 268, suffix: " HP", label: "Power" },
    { icon: Gauge, value: 7.1, suffix: " s", label: "0–100 km/h", decimals: 1 },
    { icon: Battery, value: 850, suffix: " km", label: "Range" },
    { icon: Shield, value: 5, suffix: "★", label: "Safety" },
  ] as const;

  // Autoplay while visible
  useEffect(() => {
    if (!autoPlay || !isIntersecting || images.length < 2) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [autoPlay, isIntersecting, images.length]);

  // Preload a couple of slides
  useEffect(() => {
    images.slice(0, 3).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const next = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  // Swipe only (no visible arrows/dots)
  const touchHandlers = useTouchGestures({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 50,
  });

  // Keyboard nav (optional)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (images.length < 2) return;
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  // Safe-area insets used only for padding; nothing sticky
  const safe = {
    top: "env(safe-area-inset-top)",
    bottom: "env(safe-area-inset-bottom)",
  } as const;

  return (
    <section
      ref={targetRef}
      className="relative isolate min-h-[100svh] bg-white text-gray-900"
      {...touchHandlers}
      onKeyDown={onKeyDown}
      tabIndex={0} // enable keyboard arrows when focused
    >
      {/* --- FULL-BLEED STAGE (fills viewport) --- */}
      <div className="relative h-[100svh] w-full overflow-hidden">
        {/* Media layer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={images.length ? images[current] : "placeholder"}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.15, scale: 0.98 }}
            transition={{
              opacity: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
              scale: { duration: prefersReduced ? 0.2 : 5, ease: "linear" }, // subtle Ken Burns
            }}
          >
            {images.length ? (
              <PremiumImage
                src={images[current]}
                alt={`${title} – ${current + 1}`}
                priority={current === 0}
                // If PremiumImage wraps <img>, make sure it forwards these props
                sizes="100vw"
                decoding="async"
                fetchpriority={current === 0 ? "high" : "auto"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 h-full w-full bg-gray-100" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Readability gradient (top & bottom). Pure background; no UI here. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[18%]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0))" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.25), rgba(0,0,0,0))" }}
        />

        {/* --- CONTENT (bottom-aligned, scrolls away; no sticky, no floating) --- */}
        <div className="relative z-[1] flex h-full items-end">
          <div className="w-full">
            <div
              className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
              style={{ paddingBottom: `max(16px, ${safe.bottom})`, paddingTop: safe.top }}
            >
              {/* Badges line (subtle, optional) */}
              {vehicle?.badges && vehicle.badges.length > 0 && (
                <div className="mb-2 text-xs text-white/85">{vehicle.badges.join(" • ")}</div>
              )}

              {/* Content stack */}
              <div className="pb-6 sm:pb-8 lg:pb-12">
                <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                  NEW 2025
                </div>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl line-clamp-2">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-base text-white/90 sm:text-lg line-clamp-2">{tagline}</p>

                {/* Price + disclaimer popover (contained; not sticky) */}
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
                              className="absolute z-10 mt-2 w-72 rounded-xl border border-white/20 bg-white/95 p-3 text-xs text-gray-700 shadow-xl backdrop-blur"
                            >
                              {vehicle.disclaimer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}

                {/* Specs as glass microcards */}
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

                {/* CTA cluster (contained in hero; not sticky) */}
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
        {/* End content */}
      </div>
      {/* End stage */}
    </section>
  );
};

export default PremiumHeroSection;
