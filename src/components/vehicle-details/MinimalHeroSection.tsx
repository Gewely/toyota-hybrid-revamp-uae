import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Settings, Calendar, ChevronLeft, ChevronRight, Heart, Share2, Maximize2 } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";

export type MinimalHeroSectionProps = {
  vehicle?: VehicleModel & { tagline?: string };
  galleryImages: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
};

const MinimalHeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  galleryImages = [],
  isFavorite = false,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
}) => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const prefersReducedMotion = useReducedMotion();
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.3 });

  // Preload first 3 images
  useEffect(() => {
    galleryImages.slice(0, 3).forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageLoaded(prev => ({ ...prev, [idx]: true }));
      };
    });
  }, [galleryImages]);

  // Auto-play with intersection observer optimization
  useEffect(() => {
    if (!autoPlay || !galleryImages.length || !isIntersecting) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(id);
  }, [autoPlay, galleryImages.length, isIntersecting]);

  const handlePrevious = useCallback(() => {
    setAutoPlay(false);
    setCurrent((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleNext = useCallback(() => {
    setAutoPlay(false);
    setCurrent((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const touchHandlers = useTouchGestures({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    threshold: 60
  });

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle?.year} ${vehicle?.name}`,
          text: vehicle?.tagline || "Check out this amazing vehicle",
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  }, [vehicle]);

  const TOYOTA_RED = "hsl(0, 86%, 55%)";

  // Specs data
  const specs = [
    { label: "0–100 km/h", value: "3.2s" },
    { label: "Range", value: "650 km" },
    { label: "Power", value: "Dual Motor AWD" }
  ];

  return (
    <section 
      ref={targetRef}
      className="relative w-full bg-neutral-900 text-white overflow-hidden"
    >
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Full-Screen Gallery */}
        <div 
          className="relative h-[75vh] overflow-hidden touch-pan-y"
          {...touchHandlers}
        >
          <AnimatePresence mode="wait">
            {galleryImages.length > 0 && (
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                {/* Skeleton Loader */}
                {!imageLoaded[current] && (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
                )}
                <img
                  src={galleryImages[current]}
                  alt={`${vehicle?.name} - View ${current + 1}`}
                  className="w-full h-full object-cover"
                  loading={current < 3 ? "eager" : "lazy"}
                  decoding="async"
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [current]: true }))}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Controls */}
          <div className="absolute top-safe-area-inset-top top-4 left-4 right-4 flex justify-between items-start z-20">
            <div className="flex gap-2">
              {onToggleFavorite && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggleFavorite}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                  />
                </motion.button>
              )}
              {navigator.share && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center"
                  aria-label="Share"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsZoomed(!isZoomed)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center z-20 active:scale-95 transition-transform"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center z-20 active:scale-95 transition-transform"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Animated Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${((current + 1) / galleryImages.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content Panel with Gradient */}
        <div className="relative px-5 py-6 bg-gradient-to-b from-black via-neutral-900 to-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {vehicle?.year} {vehicle?.name || "Toyota GR Carbon"}
            </h1>
            <p className="mt-2 text-white/70 text-base leading-relaxed">
              {vehicle?.tagline || "Electrified performance meets everyday usability"}
            </p>

            {/* Spec Chips */}
            <div className="flex gap-2 mt-5 flex-wrap">
              {specs.map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="text-xs text-white/60">{spec.label}</div>
                  <div className="text-sm font-semibold">{spec.value}</div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mt-6">
              {onCarBuilder && (
                <motion.button
                  onClick={onCarBuilder}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-lg active:shadow-md transition-shadow touch-manipulation"
                  style={{ backgroundColor: TOYOTA_RED }}
                >
                  <Settings className="inline w-4 h-4 mr-2" />
                  Configure
                </motion.button>
              )}
              {onBookTestDrive && (
                <motion.button
                  onClick={onBookTestDrive}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-white/10 font-semibold text-sm border border-white/20 backdrop-blur-sm active:bg-white/15 transition-colors touch-manipulation"
                >
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Test Drive
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[65%_35%] min-h-[90vh]">
        {/* Image Gallery */}
        <div className="relative overflow-hidden bg-neutral-950">
          <AnimatePresence mode="wait">
            {galleryImages.length > 0 && (
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                <img
                  src={galleryImages[current]}
                  alt={`${vehicle?.name} - View ${current + 1}`}
                  className="w-full h-full object-cover"
                  loading={current < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-black/40" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-8 left-8 right-8 flex gap-3 overflow-x-auto scrollbar-hide">
            {galleryImages.slice(0, 6).map((img, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setAutoPlay(false);
                  setCurrent(idx);
                }}
                whileHover={{ scale: 1.05 }}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  current === idx ? 'border-white' : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>

          {/* Navigation */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 flex justify-between pointer-events-none">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex flex-col justify-center px-16 py-20 bg-gradient-to-br from-black via-neutral-900 to-neutral-950">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Header Actions */}
            <div className="flex gap-3 mb-8">
              {onToggleFavorite && (
                <button
                  onClick={onToggleFavorite}
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/70'}`} />
                </button>
              )}
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white/70" />
                </button>
              )}
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-4">
              {vehicle?.year} {vehicle?.name || "Toyota GR Carbon"}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              {vehicle?.tagline || "Electrified performance meets everyday usability"}
            </p>

            {/* Animated Spec Cards */}
            <div className="space-y-3 mb-10">
              {specs.map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm text-white/60">{spec.label}</span>
                  <span className="text-lg font-semibold">{spec.value}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              {onCarBuilder && (
                <motion.button
                  onClick={onCarBuilder}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-shadow"
                  style={{ backgroundColor: TOYOTA_RED }}
                >
                  <Settings className="inline w-5 h-5 mr-2" />
                  Configure Your Vehicle
                </motion.button>
              )}
              {onBookTestDrive && (
                <motion.button
                  onClick={onBookTestDrive}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 rounded-xl bg-white/10 font-semibold border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors"
                >
                  <Calendar className="inline w-5 h-5 mr-2" />
                  Book a Test Drive
                </motion.button>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mt-10">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAutoPlay(false);
                    setCurrent(idx);
                  }}
                  className={`h-1 rounded-full transition-all ${
                    idx === current ? 'w-10 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MinimalHeroSection;
