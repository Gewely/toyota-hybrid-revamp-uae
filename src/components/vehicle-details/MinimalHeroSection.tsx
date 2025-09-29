import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { Calendar, Shield, Award, ArrowRight, Settings, Play, Pause } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { openTestDrivePopup } from "@/utils/testDriveUtils";
import { OptimizedMotionImage } from "@/components/ui/optimized-motion-image";
import { optimizedSprings } from "@/utils/animation-performance";

interface MinimalHeroSectionProps {
  vehicle: VehicleModel;
  galleryImages: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
}

const MinimalHeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  galleryImages,
  onBookTestDrive,
  onCarBuilder,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, prefersReducedMotion ? 0 : -30]);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef, { margin: '100px' });

  useEffect(() => {
    if (!isHeroInView || !isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5200);
    return () => clearInterval(interval);
  }, [isHeroInView, galleryImages.length, isAutoPlaying]);

  const handleTestDrive = () => {
    openTestDrivePopup(vehicle);
  };

  const isBestSeller =
    vehicle.name === "Toyota Camry" ||
    vehicle.name === "Toyota Corolla Hybrid" ||
    vehicle.name === "Toyota Land Cruiser" ||
    vehicle.name === "Toyota RAV4 Hybrid";

  return (
    <section
      ref={heroRef}
      className="relative min-h-[80vh] md:min-h-[92vh] xl:min-h-[98vh] bg-neutral-950 flex items-end overflow-hidden"
    >
      {/* Background Image */}
      <motion.div
        ref={heroImageRef}
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <AnimatePresence mode="wait">
          <OptimizedMotionImage
            key={`hero-image-${currentImageIndex}`}
            src={galleryImages[currentImageIndex] || ''}
            alt={`${vehicle.name} - View ${currentImageIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            priority={currentImageIndex === 0}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : optimizedSprings.fast}
            enableGPU={!prefersReducedMotion}
          />
        </AnimatePresence>
        {/* Vignette gradient for readability */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
      </motion.div>

      {/* Pause Button */}
      <motion.div
        className="absolute top-8 right-8 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="p-3 rounded-full bg-black/30 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-200 shadow-xl"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white" />
          )}
        </button>
      </motion.div>

      {/* Glassy Floating Content Card */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-full px-4 sm:px-8 pb-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ...optimizedSprings.smooth }}
          className="
            bg-white/80 backdrop-blur-2xl border border-[#ececec] shadow-2xl rounded-2xl
            max-w-2xl w-full
            px-5 py-6 sm:px-10 sm:py-10
            flex flex-col items-center
          "
          style={{
            boxShadow: "0 12px 64px 0 rgba(30,30,30,0.24), 0 2px 8px 0 rgba(30,30,30,0.07)"
          }}
        >
          {/* Badges */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {isBestSeller && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-xs shadow-md rounded">
                <Award className="h-3 w-3 mr-1" />
                Best Seller
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 text-xs shadow-md rounded">
              <Shield className="h-3 w-3 mr-1" />
              5-Star Safety
            </Badge>
          </div>

          {/* Vehicle Title */}
          <h1 className="text-[2.5rem] sm:text-5xl font-black text-[#111] mb-2 leading-tight tracking-tight text-center">
            {vehicle.name}
          </h1>
          <p className="text-lg sm:text-xl text-[#111] font-light mb-4 text-center">
            Starting from AED{" "}
            <span className="font-bold text-2xl sm:text-3xl text-[#EB0A1E]">{vehicle.price.toLocaleString()}</span>
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Button
              onClick={handleTestDrive}
              size="lg"
              className="bg-[#EB0A1E] hover:bg-[#c10e18] text-white text-base font-bold px-8 py-3 rounded-full shadow-lg w-full sm:w-auto"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Test Drive
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              onClick={onCarBuilder}
              variant="outline"
              size="lg"
              className="border-2 border-[#EB0A1E] text-[#EB0A1E] hover:bg-[#EB0A1E] hover:text-white text-base font-bold px-8 py-3 rounded-full w-full sm:w-auto"
            >
              <Settings className="h-5 w-5 mr-2" />
              Configure
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Minimal Image Indicators */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex space-x-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-[#EB0A1E] w-6'
                  : 'bg-[#EB0A1E]/40 w-2 hover:bg-[#EB0A1E]/60'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default MinimalHeroSection;
