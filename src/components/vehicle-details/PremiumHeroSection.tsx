import React, { useState, useEffect, useCallback, useRef } from "react";
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
  vehicle?: VehicleModel & { tagline?: string; priceFrom?: string; badges?: string[]; disclaimer?: string };
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
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPriceNote, setShowPriceNote] = useState(false);
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.35 });
  const hasImages = galleryImages.length > 0;

  // preload first 3
  useEffect(() => {
    galleryImages.slice(0, 3).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [galleryImages]);

  // autoplay only when visible
  useEffect(() => {
    if (!autoPlay || !isIntersecting || galleryImages.length < 2) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % galleryImages.length), 5000);
    return () => clearInterval(id);
  }, [autoPlay, isIntersecting, galleryImages.length]);

  const prev = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const next = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p + 1) % galleryImages.length);
  }, [galleryImages.length]);

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
  const priceFrom = vehicle?.priceFrom; // e.g., "From AED 129,900*"

  const specs = [
    { icon: Zap, value: 268, suffix: " HP", label: "Power" },
    { icon: Gauge, value: 7.1, suffix: " s", label: "0–100 km/h", decimals: 1 },
    { icon: Fuel, value: 850, suffix: " km", label: "Range" },
    { icon: Shield, value: 5, suffix: "★", label: "Safety" },
  ] as const;

  // Safe-area insets (no sticky usage anywhere)
  const safe = {
    top: "env(safe-area-inset-top)",
    bottom: "env(safe-area-inset-bottom)",
  } as const;

  return (
    <section ref={targetRef} className="relative isolate overflow-hidden bg-white text-gray-900" {...touchHandlers}>
      {/* ===== Mobile: immersive stage with non-sticky UI ===== */}
      <div className="lg:hidden relative w-full min-h-[100svh]">
        {/* top util (not sticky; scoped inside hero only) */}
        <div className="absolute left-0 right-0 flex items-center justify-between p-4" style={{ top: safe.top }}>
          <button
            onClick={handleShare}
            className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 backdrop-blur"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <div className="text-xs text-gray-500">{vehicle?.badges?.join(" • ")}</div>
        </div>

        {/* media */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hasImages ? galleryImages[current] : "placeholder"}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.1, scale: 0.98 }}
            transition={{ duration: prefersReduced ? 0.2 : 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {hasImages ? (
              <PremiumImage
                src={galleryImages[current]}
                alt={`${title} – ${current + 1}`}
                priority={current === 0}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* arrows */}
        {galleryImages.length > 1 && (
          <>
            <motion.button
              onClick={prev}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/25 p-3 backdrop-blur border border-white/25"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </motion.button>
            <motion.button
              onClick={next}
              whileTap={{ scale: 0.95 }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/25 p-3 backdrop-blur border border-white/25"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </motion.button>
          </>
        )}

        {/* dots */}
        {galleryImages.length > 1 && (
          <div className="absolute left-0 right-0 bottom-40 flex items-center justify-center gap-2">
            {galleryImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all ${i === current ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}

        {/* content block (bottom), not sticky */}
        <motion.div
          className="absolute left-0 right-0 rounded-t-3xl bg-white p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.12)]"
          style={{ bottom: `max(0px, ${safe.bottom})` }}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            NEW 2025
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-base text-gray-600">{tagline}</p>

          {/* price + disclaimer popover (tap to toggle) */}
          {priceFrom && (
            <div className="mt-3 flex items-center gap-2">
              <div className="text-sm font-medium text-gray-900">{priceFrom}</div>
              {vehicle?.disclaimer && (
                <div className="relative">
                  <button
                    onClick={() => setShowPriceNote((s) => !s)}
                    className="rounded-full border border-gray-300 p-1"
                    aria-expanded={showPriceNote}
                    aria-controls="price-note"
                  >
                    <Info className="h-4 w-4 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {showPriceNote && (
                      <motion.div
                        id="price-note"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute z-10 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg"
                      >
                        {vehicle.disclaimer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* specs */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {specs.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ y: 12, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <Icon className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-lg font-semibold">
                      <AnimatedCounter
                        value={s.value as number}
                        suffix={s.suffix}
                        decimals={(s as any).decimals || 0}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTAs (clustered; not sticky) */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <PremiumButton
              onClick={onBookTestDrive}
              className="h-14 flex-1 rounded-2xl bg-red-600 text-white hover:bg-red-600/90"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Test Drive
            </PremiumButton>
            <PremiumButton
              onClick={onCarBuilder}
              variant="outline"
              className="h-14 flex-1 rounded-2xl border-2 border-gray-300 text-gray-900 hover:bg-gray-50"
            >
              <Settings className="mr-2 h-5 w-5" />
              Configure
            </PremiumButton>
          </div>
        </motion.div>
      </div>

      {/* ===== Desktop: split layout, no sticky elements ===== */}
      <div className="hidden h-[calc(100vh)] w-full grid-cols-12 lg:grid">
        {/* stage */}
        <div className="relative col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={hasImages ? galleryImages[current] : "placeholder-d"}
              className="absolute inset-0"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.3 }}
              transition={{ duration: prefersReduced ? 0.2 : 0.6 }}
            >
              {hasImages ? (
                <PremiumImage
                  src={galleryImages[current]}
                  alt={`${title} – ${current + 1}`}
                  priority={current === 0}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-100" />
              )}
              {/* subtle hover light sweep */}
              {!prefersReduced && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  whileHover={{
                    background: [
                      "radial-gradient(800px 400px at 0% 50%, rgba(255,255,255,0.12), transparent 60%)",
                      "radial-gradient(800px 400px at 100% 50%, rgba(255,255,255,0.12), transparent 60%)",
                    ],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {galleryImages.length > 1 && (
            <>
              <motion.button
                onClick={prev}
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-8 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/25 p-4 backdrop-blur"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </motion.button>
              <motion.button
                onClick={next}
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg:black/25 p-4 backdrop-blur"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </motion.button>

              {/* thumbs */}
              <div className="absolute bottom-8 left-8 right-8 flex gap-2 overflow-x-auto">
                {galleryImages.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => {
                      setAutoPlay(false);
                      setCurrent(i);
                    }}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      i === current ? "border-red-600" : "border-white/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} className="h-full w-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* content */}
        <div className="relative col-span-5 flex items-center bg-gradient-to-br from-gray-50 to-white p-12">
          <div className="w-full max-w-xl">
            <div className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
              NEW 2025
            </div>

            <h1 className="mt-4 text-6xl font-bold tracking-tight">{title}</h1>
            <p className="mt-3 max-w-prose text-xl text-gray-600">{tagline}</p>

            {/* price + note */}
            {priceFrom && (
              <div className="mt-4 flex items-center gap-2">
                <div className="text-base font-medium text-gray-900">{priceFrom}</div>
                {vehicle?.disclaimer && (
                  <div className="relative">
                    <button
                      onClick={() => setShowPriceNote((s) => !s)}
                      className="rounded-full border border-gray-300 p-1"
                      aria-expanded={showPriceNote}
                    >
                      <Info className="h-4 w-4 text-gray-500" />
                    </button>
                    <AnimatePresence>
                      {showPriceNote && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute z-10 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg"
                        >
                          {vehicle.disclaimer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* specs */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {specs.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ y: 16, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: 0.06 * i }}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-6 hover:bg-gray-100"
                  >
                    <Icon className="mb-3 h-6 w-6 text-red-600" />
                    <div className="text-3xl font-bold">
                      <AnimatedCounter
                        value={s.value as number}
                        suffix={s.suffix}
                        decimals={(s as any).decimals || 0}
                      />
                    </div>
                    <div className="text-sm text-gray-600">{s.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-4">
              <PremiumButton
                className="h-16 rounded-2xl bg-red-600 text-white hover:bg-red-600/90"
                onClick={onBookTestDrive}
              >
                <Calendar className="mr-2 h-6 w-6" />
                Book Test Drive
              </PremiumButton>
              <PremiumButton
                variant="outline"
                className="h-16 rounded-2xl border-2 border-gray-300 text-gray-900 hover:bg-gray-50"
                onClick={onCarBuilder}
              >
                <Settings className="mr-2 h-6 w-6" />
                Configure Your Vehicle
              </PremiumButton>
            </div>
          </div>

          {/* watermark */}
          <div className="pointer-events-none absolute bottom-10 right-10 text-9xl font-black tracking-tight text-gray-200/60">
            TOYOTA
          </div>
        </div>
      </div>

      {/* ===== Fullscreen image modal (optional) ===== */}
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
            {hasImages ? (
              <img src={galleryImages[current]} alt={title} className="h-full w-full object-contain" />
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
