import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";

export type MinimalHeroSectionProps = {
  vehicle?: VehicleModel & { tagline?: string }; // allow tagline safely
  galleryImages: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
};

const MinimalHeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  galleryImages = [],
  onBookTestDrive,
  onCarBuilder,
}) => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play slideshow
  useEffect(() => {
    if (!autoPlay || !galleryImages.length) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [autoPlay, galleryImages.length]);

  const TOYOTA_RED = "#EB0A1E";

  return (
    <section className="relative w-full bg-black text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[100vh]">
        {/* === IMAGE AREA === */}
        <div className="relative h-[60vh] md:h-auto overflow-hidden">
          <AnimatePresence mode="wait">
            {galleryImages.length > 0 && (
              <motion.img
                key={current}
                src={galleryImages[current]}
                alt={`Hero ${current + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* Controls (edge aligned) */}
          <div className="absolute inset-y-0 left-3 flex items-center z-20">
            <button
              onClick={() => {
                setAutoPlay(false);
                setCurrent((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="p-2 bg-black/40 hover:bg-black/70 rounded-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center z-20">
            <button
              onClick={() => {
                setAutoPlay(false);
                setCurrent((prev) => (prev + 1) % galleryImages.length);
              }}
              className="p-2 bg-black/40 hover:bg-black/70 rounded-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress dots (mobile only) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 md:hidden">
            {galleryImages.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* === CONTENT AREA === */}
        <div className="flex flex-col justify-center px-6 sm:px-12 md:px-16 py-10 md:py-20 bg-black/90 backdrop-blur-md">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {vehicle?.year} {vehicle?.name || "Toyota GR Carbon"}
          </h1>
          <p className="mt-3 text-white/80 text-base sm:text-lg md:text-xl max-w-lg">
            {vehicle?.tagline || "Electrified performance meets everyday usability"}
          </p>

          {/* Glass spec chips */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {["0–100 km/h 3.2s", "650 km Range", "Dual Motor AWD"].map((spec, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-sm backdrop-blur-sm"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Rectangle CTAs */}
          <div className="flex gap-3 mt-8">
            {onCarBuilder && (
              <motion.button
                onClick={onCarBuilder}
                whileTap={{ scale: 0.96 }}
                className="px-6 py-2 rounded-md text-white font-semibold text-sm shadow-md"
                style={{ backgroundColor: TOYOTA_RED }}
              >
                <Settings className="inline w-4 h-4 mr-2" />
                Configure
              </motion.button>
            )}
            {onBookTestDrive && (
              <motion.button
                onClick={onBookTestDrive}
                whileTap={{ scale: 0.96 }}
                className="px-6 py-2 rounded-md bg-white/10 text-white font-semibold text-sm border border-white/20"
              >
                <Calendar className="inline w-4 h-4 mr-2" />
                Test Drive
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinimalHeroSection;
