import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Calendar, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MinimalHeroSectionProps = {
  vehicle?: VehicleModel & { tagline?: string };
  galleryImages: string[];
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
};

const MinimalHeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  galleryImages = [],
  onBookTestDrive,
  onCarBuilder,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  // Auto-rotate images
  useEffect(() => {
    if (prefersReducedMotion || galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryImages.length, prefersReducedMotion]);

  const next = () => setCurrent((prev) => (prev + 1) % galleryImages.length);
  const prev = () => setCurrent((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const touchHandlers = useTouchGestures({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 50,
  });

  const specs = [
    { label: "Fuel Economy", value: "22 km/L" },
    { label: "Power", value: "268 HP" },
    { label: "Transmission", value: "CVT" },
    { label: "Drive", value: "AWD" },
    { label: "Seating", value: "5 Seats" },
  ];

  const badges = [];
  if (vehicle?.category?.toLowerCase().includes("hybrid")) badges.push("HYBRID");
  if (vehicle?.year === 2025) badges.push("2025");
  if (vehicle?.category === "sedan") badges.push("SEDAN");

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Container */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 min-h-screen">
        <div className="grid lg:grid-cols-[40%_60%] min-h-screen items-center gap-8 lg:gap-12 py-12 lg:py-0">
          {/* LEFT: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:pr-8 z-10"
          >
            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              {vehicle?.name || "Model X"}
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed">
              {vehicle?.tagline || "Effortless electric range"}
            </p>

            {/* Badge Pills */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-4 py-2 rounded-full border-2 border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="text-3xl sm:text-4xl font-semibold text-gray-900">
              From AED {vehicle?.price?.toLocaleString() || "129,900"}
              <span className="text-base text-gray-500 ml-1">*</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={onBookTestDrive}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 bg-[#EB0A1E] hover:bg-[#CC0000] text-white text-lg font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Test Drive
              </Button>
              {onCarBuilder && (
                <Button
                  onClick={onCarBuilder}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 border-2 border-gray-300 text-gray-900 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Configure
                </Button>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
            {...touchHandlers}
          >
            <div className="relative aspect-[4/3] lg:aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={galleryImages[current] || "/placeholder.svg"}
                  alt={`${vehicle?.name || "Vehicle"} - Image ${current + 1}`}
                  className="w-full h-full object-contain"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  loading="eager"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-white transition-colors flex items-center justify-center z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-900" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-white transition-colors flex items-center justify-center z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-900" />
                  </button>
                </>
              )}
            </div>

            {/* Simple Dots */}
            {galleryImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === current ? "bg-gray-900 w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
                    )}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* BOTTOM STATS BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 py-4 lg:py-6"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 text-center">
            {specs.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="rounded-xl bg-gray-50 px-3 py-3 lg:px-4 lg:py-4 hover:bg-gray-100 transition-colors"
              >
                <div className="text-xs text-gray-500 mb-1">{spec.label}</div>
                <div className="text-base lg:text-lg font-semibold text-gray-900 tabular-nums">
                  {spec.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default MinimalHeroSection;
