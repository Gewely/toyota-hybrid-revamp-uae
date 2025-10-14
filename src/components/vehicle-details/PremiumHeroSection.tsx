import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Calendar, Settings, Zap, Gauge, Fuel, Shield } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";
import { PremiumImage } from "@/components/ui/premium-image";
import { PremiumButton } from "@/components/ui/premium-button";
import AnimatedCounter from "@/components/ui/animated-counter";

export type PremiumHeroSectionProps = {
  vehicle?: VehicleModel & { tagline?: string };
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
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.35 });

  // Preload first 3 images
  useEffect(() => {
    galleryImages.slice(0, 3).forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setImageLoaded(p => ({ ...p, [idx]: true }));
    });
  }, [galleryImages]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || !isIntersecting) return;
    const id = setInterval(() => setCurrent(p => (p + 1) % galleryImages.length), 5000);
    return () => clearInterval(id);
  }, [autoPlay, isIntersecting, galleryImages.length]);

  const handlePrevious = useCallback(() => {
    setAutoPlay(false);
    setCurrent(p => (p - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleNext = useCallback(() => {
    setAutoPlay(false);
    setCurrent(p => (p + 1) % galleryImages.length);
  }, [galleryImages.length]);

  // Touch gestures
  const touchHandlers = useTouchGestures({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    threshold: 50,
  });

  const handleShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `${vehicle?.year ?? ""} ${vehicle?.name ?? "Vehicle"}`.trim(),
        text: vehicle?.tagline || "Check out this vehicle",
        url: window.location.href,
      });
    } catch {}
  }, [vehicle]);

  const title = `${vehicle?.year ? vehicle.year + " " : ""}${vehicle?.name ?? "Toyota"}`;
  const tagline = vehicle?.tagline ?? "Electrified performance. Everyday mastery.";

  const specs = [
    { icon: Zap, value: 268, suffix: " HP", label: "Power" },
    { icon: Gauge, value: 7.1, suffix: "s", label: "0-100 km/h", decimals: 1 },
    { icon: Fuel, value: 850, suffix: " km", label: "Range" },
    { icon: Shield, value: 5, suffix: "★", label: "Safety" }
  ];

  return (
    <section
      ref={targetRef}
      className="relative min-h-[100svh] lg:min-h-screen bg-white text-gray-900 overflow-hidden"
      {...touchHandlers}
    >
      {/* MOBILE: Full-screen immersive gallery */}
      <div className="lg:hidden relative w-full h-[100svh]">
        {/* Gallery */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <PremiumImage
              src={galleryImages[current]}
              alt={`${title} - Image ${current + 1}`}
              priority={current === 0}
              className="w-full h-full"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Glass-morphism controls */}
        <div className="absolute top-safe-area-inset-top left-0 right-0 p-4 flex items-center justify-between">
          <motion.button
            onClick={handlePrevious}
            className="touch-target rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            whileTap={{ scale: 0.9 }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="touch-target rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            whileTap={{ scale: 0.9 }}
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Progress bar */}
        <div className="absolute top-[calc(env(safe-area-inset-top)+4rem)] left-4 right-4 flex gap-1">
          {galleryImages.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: idx === current ? "100%" : idx < current ? "100%" : "0%" }}
                transition={{ duration: idx === current ? 5 : 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Content panel */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 pb-safe-area space-y-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div
            className="inline-block px-3 py-1 rounded-full bg-[#EB0A1E] text-white text-xs font-semibold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            NEW 2025
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            {title}
          </h1>

          <p className="text-lg text-white/90 max-w-md">
            {tagline}
          </p>

          {/* Animated specs */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {specs.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <Icon className="w-5 h-5 text-[#EB0A1E]" />
                  <div>
                    <div className="text-xl font-bold text-white">
                      <AnimatedCounter
                        value={spec.value}
                        suffix={spec.suffix}
                        decimals={spec.decimals || 0}
                      />
                    </div>
                    <div className="text-xs text-white/70">{spec.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <PremiumButton
              onClick={onBookTestDrive}
              className="flex-1 h-14 bg-[#EB0A1E] hover:bg-[#EB0A1E]/90 text-white rounded-2xl text-base font-semibold shadow-2xl"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Test Drive
            </PremiumButton>

            <PremiumButton
              onClick={onCarBuilder}
              variant="outline"
              className="flex-1 h-14 border-2 border-white/20 text-white hover:bg-white/10 rounded-2xl text-base font-semibold backdrop-blur-xl"
            >
              <Settings className="w-5 h-5 mr-2" />
              Configure
            </PremiumButton>
          </div>
        </motion.div>
      </div>

      {/* DESKTOP: Split-screen layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left: Gallery (60%) */}
        <div className="relative w-[60%] h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PremiumImage
                src={galleryImages[current]}
                alt={`${title} - Image ${current + 1}`}
                priority={current === 0}
                className="w-full h-full"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <motion.button
            onClick={handlePrevious}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-black/40 transition-colors"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-black/40 transition-colors"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-8 left-8 right-8 flex gap-2 overflow-x-auto premium-scrollbar">
            {galleryImages.map((img, idx) => (
              <motion.button
                key={idx}
                onClick={() => { setCurrent(idx); setAutoPlay(false); }}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === current ? 'border-[#EB0A1E] scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
                whileHover={{ scale: idx === current ? 1.05 : 1.02 }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Content (40%) */}
        <div className="relative w-[40%] h-full bg-gradient-to-br from-gray-50 to-white p-12 flex flex-col justify-center">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="space-y-8"
          >
            <motion.div
              className="inline-block px-4 py-2 rounded-full bg-[#EB0A1E] text-white text-sm font-semibold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              NEW 2025
            </motion.div>

            <div>
              <h1 className="text-6xl xl:text-7xl font-bold leading-tight mb-4 text-gray-900">
                {title}
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                {tagline}
              </p>
            </div>

            {/* Desktop specs grid */}
            <div className="grid grid-cols-2 gap-4">
              {specs.map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <motion.div
                    key={idx}
                    className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Icon className="w-6 h-6 text-[#EB0A1E] mb-3" />
                    <div className="text-3xl font-bold mb-1 text-gray-900">
                      <AnimatedCounter
                        value={spec.value}
                        suffix={spec.suffix}
                        decimals={spec.decimals || 0}
                      />
                    </div>
                    <div className="text-sm text-gray-600">{spec.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="flex flex-col gap-4 pt-4">
              <PremiumButton
                onClick={onBookTestDrive}
                className="h-16 bg-[#EB0A1E] hover:bg-[#EB0A1E]/90 text-white rounded-2xl text-lg font-semibold shadow-2xl"
              >
                <Calendar className="w-6 h-6 mr-2" />
                Book Test Drive
              </PremiumButton>

              <PremiumButton
                onClick={onCarBuilder}
                variant="outline"
                className="h-16 border-2 border-gray-300 text-gray-900 hover:bg-gray-50 rounded-2xl text-lg font-semibold"
              >
                <Settings className="w-6 h-6 mr-2" />
                Configure Your Vehicle
              </PremiumButton>
            </div>
          </motion.div>

          {/* Toyota emblem watermark */}
          <div className="absolute bottom-12 right-12 opacity-5 text-gray-200 text-9xl font-bold pointer-events-none">
            TOYOTA
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
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
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center z-10"
            >
              <Maximize2 className="w-6 h-6 text-white" />
            </button>
            <img
              src={galleryImages[current]}
              alt={title}
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PremiumHeroSection;
