import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Settings, Calendar, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";

// --- CONFIGURABLE DATA ---
const galleryImages = [
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/cbbefa79-6002-4f61-94e0-ee097a8dc6c6/items/e79b990a-9343-4559-b7cc-772c1c52696b/renditions/3964658f-a7d0-4b11-8b8a-cf5b70fe2bff?binary=true&mformat=true",
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/5103fe2b-5c90-47cc-a37a-9b9d2dbc1c2e/items/278810b0-4e58-400a-8510-158e058c3ca1/renditions/5a278171-17e4-4c66-b4f7-f13c6a6254db?binary=true&mformat=true",
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-2160.jpg"
];

const HEADLINE = "2026 Toyota GR Carbon";
const TAGLINE = "Electrified performance meets everyday usability";
const SPECS = [
  { label: "0–100 km/h", value: "3.2s" },
  { label: "Range", value: "650 km" },
  { label: "AWD", value: "Dual Motor" }
];

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef });
  const bgScale = useTransform(scrollY, [0, 450], [1, 1.05]);
  const bgY = useTransform(scrollY, [0, 400], [0, -36]);
  const contentY = useTransform(scrollY, [0, 200], [0, -12]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Enhanced touch controls
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart && e.targetTouches[0].clientX) {
      const diff = touchStart - e.targetTouches[0].clientX;
      setSwipeDirection(diff > 0 ? 'left' : 'right');
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 35) {
      if (distance > 0) nextImage();
      else prevImage();
    }
    setTouchStart(null);
    setTouchEnd(null);
    setSwipeDirection(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    setIsAutoPlaying(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setIsAutoPlaying(false);
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen flex flex-col bg-black overflow-hidden"
      aria-label="Premium Automotive Showcase"
    >
      {/* Enhanced Background Slideshow */}
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="absolute inset-0 w-full h-full z-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={galleryImages[currentImageIndex]}
            alt={`Toyota GR Carbon View ${currentImageIndex + 1}`}
            className="w-full h-full object-cover object-center absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.01 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            draggable={false}
            style={{
              filter: "brightness(0.85) saturate(1.2) contrast(1.1)",
            }}
          />
        </AnimatePresence>

        {/* Enhanced Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        
        {/* Dynamic Light Effect */}
        <div 
          className="absolute left-[5vw] bottom-0 w-[90vw] h-[40vh] rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle at center, #EB0A1E 0%, transparent 70%)",
            transform: `translateX(${(currentImageIndex * 10)}%)`
          }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col justify-between z-10">
        {/* Enhanced Headline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 px-6 sm:px-12 md:px-24"
        >
          <h1 className="text-white font-black text-5xl sm:text-7xl tracking-tight leading-none"
              style={{ textShadow: "0 4px 32px rgba(235, 10, 30, 0.3)" }}>
            {HEADLINE}
          </h1>
          <p className="mt-4 text-white/90 text-xl sm:text-2xl font-light max-w-2xl">
            {TAGLINE}
          </p>
        </motion.div>

        {/* Enhanced Bottom Section */}
        <div className="w-full px-6 sm:px-12 md:px-24 pb-12 space-y-8">
          {/* Specs Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-x-12 gap-y-4"
          >
            {SPECS.map((spec, i) => (
              <div key={spec.label} className="flex items-center space-x-3">
                <span className="text-white/60">{spec.label}</span>
                <span className="text-[#EB0A1E] font-bold text-lg">{spec.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 bg-[#EB0A1E] rounded-full text-white font-semibold text-lg
                         transition-all duration-300 hover:bg-[#ff1a1a] hover:shadow-[0_0_20px_rgba(235,10,30,0.3)]"
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Configure & Order
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white/20 rounded-full
                         text-white font-semibold text-lg transition-all duration-300
                         hover:bg-white/10 hover:border-white/40"
            >
              <Calendar className="w-5 h-5" />
              Book Test Drive
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Image Controls */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
        onMouseEnter={() => setIsHoveringControls(true)}
        onMouseLeave={() => setIsHoveringControls(false)}
      >
        <motion.button
          onClick={prevImage}
          className="p-2 text-white/80 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <div className="flex gap-2">
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentImageIndex
                  ? 'w-8 bg-[#EB0A1E]'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <motion.button
          onClick={nextImage}
          className="p-2 text-white/80 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={() => setIsAutoPlaying(p => !p)}
          className={`ml-2 p-2 rounded-full transition-all duration-300 ${
            isAutoPlaying ? 'bg-white/20' : 'bg-[#EB0A1E]/20'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-[#EB0A1E]" />
          )}
        </motion.button>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <ArrowDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
