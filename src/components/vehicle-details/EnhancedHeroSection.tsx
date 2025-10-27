import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { Calendar, Shield, Award, ArrowRight, Settings, Play, Pause } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import YouTubeEmbed from "@/components/ui/youtube-embed";
import AnimatedCounter from "@/components/ui/animated-counter";
import { openTestDrivePopup } from "@/utils/testDriveUtils";
import { OptimizedMotionImage } from "@/components/ui/optimized-motion-image";
import { optimizedSprings } from "@/utils/animation-performance";

interface EnhancedHeroSectionProps {
  vehicle: VehicleModel;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
}

const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({
  vehicle,
  onBookTestDrive,
  onCarBuilder,
}) => {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Scroll-based transforms
  const y = useTransform(scrollYProgress, [0, 0.3], [0, prefersReducedMotion ? 0 : -60]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1.04, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const handleTestDrive = () => openTestDrivePopup(vehicle);

  const isBestSeller =
    vehicle.name === "Toyota Camry" ||
    vehicle.name === "Toyota Corolla Hybrid" ||
    vehicle.name === "Toyota Land Cruiser" ||
    vehicle.name === "Toyota RAV4 Hybrid";
  const isHybrid = vehicle.name.toLowerCase().includes('hybrid');
  const isElectric = vehicle.name.toLowerCase().includes('bz4x') || vehicle.category === 'Electric';
  
  const monthlyEMI = Math.round((vehicle.price || 0) * 0.02);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[80vh] md:min-h-[92vh] xl:min-h-[98vh] bg-neutral-950 overflow-hidden flex items-end"
    >
      {/* Hero Background with Parallax */}
      <motion.div
        style={{ y, scale, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/60 to-[#0b0b12]/80 z-10"></div>
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Glassy vignette */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        {/* Luxury "bloom" effect */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[60vw] h-[24vw] rounded-full bg-[#fff9]/10 blur-3xl opacity-50 pointer-events-none z-20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-30 w-full">
        <div className="max-w-screen-xl mx-auto px-4 pt-16 pb-6 md:py-24 flex flex-col justify-end h-full">

          {/* Luxury Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.55)] border border-white/10 px-4 py-8 md:px-10 md:py-12 max-w-2xl mx-auto w-full"
          >
            {/* Badges */}
            <div className="flex gap-3 mb-3 justify-center flex-wrap">
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-2 py-1 text-xs font-semibold shadow-md">
                <Award className="h-3 w-3 mr-1" /> {isBestSeller ? "Best Seller" : "Signature Edition"}
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-2 py-1 text-xs font-semibold shadow-md">
                <Shield className="h-3 w-3 mr-1" /> 5-Star Safety
              </Badge>
              {isHybrid && (
                <Badge className="bg-gradient-to-r from-green-500 to-lime-400 text-white px-2 py-1 text-xs font-semibold shadow-md">
                  Hybrid Power
                </Badge>
              )}
              {isElectric && (
                <Badge className="bg-gradient-to-r from-fuchsia-500 to-blue-400 text-white px-2 py-1 text-xs font-semibold shadow-md">
                  100% Electric
                </Badge>
              )}
              <Badge className="bg-neutral-900/60 text-white px-2 py-1 text-xs font-semibold shadow-md border border-white/10">
                {vehicle.year || "2025"} Model
              </Badge>
            </div>

            <h1 className="text-center text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg mb-2">
              {vehicle.name}
            </h1>
            <div className="text-center text-lg md:text-2xl text-neutral-200 font-light mb-6">
              The new benchmark for luxury hybrid. <span className="hidden md:inline">Redefining comfort and innovation.</span>
            </div>

            {/* Pricing & Stats */}
            <div className="flex flex-col md:flex-row md:justify-center gap-3 mb-6">
              <div className="flex-1 text-center">
                <div className="text-xs text-white/80 uppercase font-medium mb-1">Starting From</div>
                <div className="text-2xl md:text-3xl font-black text-white drop-shadow-sm">
                  AED <AnimatedCounter value={vehicle.price} duration={2.5} />
                </div>
                <div className="text-xs text-white/60">*VAT Included</div>
              </div>
              <div className="hidden md:block w-px bg-white/15 my-2"></div>
              <div className="flex-1 text-center">
                <div className="text-xs text-white/80 uppercase font-medium mb-1">Monthly EMI</div>
                <div className="text-2xl md:text-3xl font-black text-white drop-shadow-sm">
                  AED <AnimatedCounter value={monthlyEMI} duration={2} />
                  <span className="text-sm font-normal text-white/80">/mo</span>
                </div>
                <div className="text-xs text-white/60">*80% financing</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-6">
              <div className="flex-1 text-center">
                <div className="text-lg md:text-xl font-black text-white">
                  <AnimatedCounter value={isHybrid ? 25.2 : isElectric ? 450 : 22.2} decimals={1} duration={2} />
                  <span className="text-sm font-normal text-white/80 ml-1">{isElectric ? "km" : "km/L"}</span>
                </div>
                <div className="text-xs text-white/70">{isElectric ? "Range" : "Fuel Efficiency"}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-lg md:text-xl font-black text-white">
                  <AnimatedCounter value={isHybrid ? 218 : isElectric ? 201 : 203} duration={2} />
                  <span className="text-sm font-normal text-white/80 ml-1">HP</span>
                </div>
                <div className="text-xs text-white/70">Total Power</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                onClick={handleTestDrive}
                size="lg"
                className="bg-[#EB0A1E] hover:bg-[#c10e18] text-white text-base font-bold px-8 py-3 rounded-full shadow-xl group flex-1 transition-all duration-300"
              >
                <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Book Test Drive
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                onClick={onCarBuilder}
                variant="outline"
                size="lg"
                className="border-2 border-[#EB0A1E] text-[#EB0A1E] hover:bg-[#EB0A1E] hover:text-white text-base font-bold px-8 py-3 rounded-full transition-all duration-300 flex-1"
              >
                <Settings className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Configure Your Car
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
