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
  Star,
} from "lucide-react";

export type MinimalHeroSectionProps = {
   vehicle?: VehicleModel;
  galleryImages: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
};

export default function MinimalHeroSection({
  galleryImages = [],
  isFavorite = false,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
}: MinimalHeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Smooth parallax transforms
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);
  const bgY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Image change logic
  const advanceImage = useCallback(
    (dir: 1 | -1) => {
      if (!galleryImages.length) return;
      setCurrentImageIndex((prev) => (prev + dir + galleryImages.length) % galleryImages.length);
      setProgress(0);
    },
    [galleryImages.length]
  );

  const userNext = () => {
    setIsAutoPlaying(false);
    advanceImage(1);
  };
  const userPrev = () => {
    setIsAutoPlaying(false);
    advanceImage(-1);
  };

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion || !galleryImages.length) return;
    const duration = 5000;
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

  const TOYOTA_RED = "#EB0A1E";

  return (
    <section
      className="relative w-full min-h-[100vh] flex flex-col bg-black overflow-hidden"
      aria-label="Toyota Cinematic Hero"
    >
      {/* Background slideshow */}
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <AnimatePresence mode="wait">
          {galleryImages.length ? (
            <motion.img
              key={currentImageIndex}
              src={galleryImages[currentImageIndex]}
              alt={`Toyota showcase ${currentImageIndex + 1}`}
              loading="lazy"
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Gradient mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-10" />

      {/* Favorite toggle */}
      {onToggleFavorite && (
        <button
          type="button"
          onClick={onToggleFavorite}
          className="absolute right-6 top-6 z-20 p-3 rounded-full bg-black/40 border border-white/20 hover:bg-black/70 transition"
          style={{ color: TOYOTA_RED }}
        >
          <Star className={`w-6 h-6 ${isFavorite ? "fill-current" : "opacity-70"}`} />
        </button>
      )}

      {/* Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative flex-1 flex flex-col justify-end z-20 px-6 sm:px-12 md:px-24 pb-24"
      >
        {/* Glassmorphism Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {["0–100 km/h: 3.2s", "Range: 650 km", "AWD: Dual Motor"].map((spec, i) => (
            <div
              key={i}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white flex flex-col items-center sm:items-start shadow-lg"
            >
              <span className="text-lg font-bold text-white">{spec}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          {onCarBuilder && (
            <motion.button
              onClick={onCarBuilder}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 px-10 py-4 rounded-full text-white font-semibold text-lg transition-all"
              style={{
                backgroundColor: TOYOTA_RED,
                boxShadow: `0 0 30px ${TOYOTA_RED}80`,
              }}
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Configure &amp; Order
            </motion.button>
          )}
          {onBookTestDrive && (
            <motion.button
              onClick={onBookTestDrive}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-10 py-4 bg-white/10 border border-white/30 backdrop-blur-lg rounded-full text-white font-semibold text-lg transition-all hover:bg-white/20"
            >
              <Calendar className="w-5 h-5" />
              Book Test Drive
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-1"
            style={{ width: `${progress}%`, backgroundColor: TOYOTA_RED }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-24 left-6 z-20 flex gap-3">
        <motion.button
          onClick={userPrev}
          className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>
      <div className="absolute bottom-24 right-6 z-20 flex gap-3">
        <motion.button
          onClick={userNext}
          className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => {
            setIsAutoPlaying((p) => !p);
            setProgress(0);
          }}
          className="p-3 rounded-full bg-black/40"
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4" style={{ color: TOYOTA_RED }} />
          )}
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="w-6 h-6 text-white/70" />
      </motion.div>
    </section>
  );
}
