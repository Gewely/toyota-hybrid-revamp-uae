import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Settings, Calendar, Pause, Play, ChevronLeft, ChevronRight, Gauge, Battery, Car } from "lucide-react";

// --- CONFIGURABLE DATA ---
const galleryImages = [
  "https://images5.alphacoders.com/116/thumbbig-1162016.webp",
  "https://images7.alphacoders.com/127/thumbbig-1272437.webp",
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-2160.jpg"
];

const HEADLINE = "2026 Toyota GR Carbon";
const TAGLINE = "Electrified performance meets everyday usability";
const SPECS = [
  { label: "0–100 km/h", value: 3.2, unit: "s", icon: <Gauge className="w-5 h-5 text-[#EB0A1E]" /> },
  { label: "Range", value: 650, unit: " km", icon: <Battery className="w-5 h-5 text-[#EB0A1E]" /> },
  { label: "AWD", value: "Dual Motor", icon: <Car className="w-5 h-5 text-[#EB0A1E]" /> }
];

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef });

  // Parallax transforms
  const bgScale = useTransform(scrollY, [0, 450], [1, 1.05]);
  const bgY = useTransform(scrollY, [0, 400], [0, -36]);
  const contentY = useTransform(scrollY, [0, 200], [0, -12]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Autoplay images with progress
  useEffect(() => {
    if (!isAutoPlaying) return;
    const duration = 4800;
    const step = 100;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += step;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        nextImage();
        elapsed = 0;
      }
    }, step);
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentImageIndex]);

  // Swipe controls
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 35) distance > 0 ? nextImage() : prevImage();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  // Animated counter for numbers
  const AnimatedNumber = ({ target, unit }: { target: number; unit: string }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = target;
      const duration = 1200;
      const increment = end / (duration / 16);
      const interval = setInterval(() => {
        start += increment;
        if (start >= end) {
          setVal(end);
          clearInterval(interval);
        } else {
          setVal(start);
        }
      }, 16);
      return () => clearInterval(interval);
    }, [target]);
    return <span className="text-[#EB0A1E] font-bold text-lg">{val.toFixed(0)}{unit}</span>;
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100vh] flex flex-col bg-black overflow-hidden"
      aria-label="Premium Automotive Showcase"
    >
      {/* Background Slideshow */}
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
            loading="lazy"
            className="w-full h-full object-cover object-center absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            draggable={false}
            style={{ filter: "saturate(1.15) contrast(1.1)" }}
          />
        </AnimatePresence>

        {/* Subtle red glow */}
        <div
          className="absolute left-1/2 bottom-0 w-[70vw] h-[30vh] -translate-x-1/2 blur-2xl opacity-25"
          style={{ background: "radial-gradient(circle at center, #EB0A1E 0%, transparent 70%)" }}
        />
      </motion.div>

      {/* Gradient mask for text readability */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />

      {/* Main Content */}
      <motion.div style={{ y: contentY }} className="relative flex-1 flex flex-col justify-between z-20">
        {/* Headline */}
        <div className="mt-24 px-6 sm:px-12 md:px-24">
          <h1
            className="text-white font-black text-4xl sm:text-6xl lg:text-7xl leading-tight"
            style={{ textShadow: "0 4px 16px rgba(0,0,0,0.6), 0 0 32px rgba(235,10,30,0.3)" }}
          >
            {HEADLINE}
          </h1>
          <p className="mt-4 text-white/90 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl">{TAGLINE}</p>
        </div>

        {/* Specs */}
        <div className="w-full px-6 sm:px-12 md:px-24 pb-12 space-y-8">
          <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-x-12">
            {SPECS.map((spec, i) => (
              <div key={i} className="flex items-center space-x-2">
                {spec.icon}
                <span className="text-white/60">{spec.label}</span>
                {typeof spec.value === "number" ? (
                  <AnimatedNumber target={spec.value} unit={spec.unit} />
                ) : (
                  <span className="text-[#EB0A1E] font-bold text-lg">{spec.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              aria-label="Configure and Order"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 bg-[#EB0A1E] rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-[#ff1a1a] hover:shadow-[0_0_20px_rgba(235,10,30,0.3)]"
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Configure & Order
            </motion.button>

            <motion.button
              aria-label="Book Test Drive"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/30 backdrop-blur-md rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-white/20"
            >
              <Calendar className="w-5 h-5" />
              Book Test Drive
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Controls (thumb zones) */}
      <div className="absolute bottom-20 left-4 z-20 flex gap-3">
        <motion.button
          aria-label="Previous Image"
          onClick={prevImage}
          className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="absolute bottom-20 right-4 z-20 flex gap-3">
        <motion.button
          aria-label="Next Image"
          onClick={nextImage}
          className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        <motion.button
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          onClick={() => setIsAutoPlaying((p) => !p)}
          className="p-3 rounded-full bg-black/40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isAutoPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-[#EB0A1E]" />}
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-10 left-0 w-full h-1 bg-white/20">
        <motion.div className="h-1 bg-[#EB0A1E]" style={{ width: `${progress}%` }} />
      </div>

      {/* Swipe Hint (mobile only) */}
      <motion.div
        className="absolute bottom-24 w-full text-center text-white/70 text-xs sm:hidden tracking-wide"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Swipe to explore
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        <ArrowDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </section>
  );
};

// ✅ Correct export
const MinimalHeroSection = HeroSection;
export default MinimalHeroSection;
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Settings, Calendar, Pause, Play, ChevronLeft, ChevronRight, Gauge, Battery, Car } from "lucide-react";

// --- CONFIGURABLE DATA ---
const galleryImages = [
  "https://images5.alphacoders.com/116/thumbbig-1162016.webp",
  "https://images7.alphacoders.com/127/thumbbig-1272437.webp",
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-2160.jpg"
];

const HEADLINE = "2026 Toyota GR Carbon";
const TAGLINE = "Electrified performance meets everyday usability";
const SPECS = [
  { label: "0–100 km/h", value: "3.2s", icon: <Gauge className="w-5 h-5 text-[#EB0A1E]" /> },
  { label: "Range", value: "650 km", icon: <Battery className="w-5 h-5 text-[#EB0A1E]" /> },
  { label: "AWD", value: "Dual Motor", icon: <Car className="w-5 h-5 text-[#EB0A1E]" /> }
];

interface MinimalHeroSectionProps {
  vehicle?: any;
  galleryImages?: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
}

const HeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef });

  // Parallax transforms
  const bgScale = useTransform(scrollY, [0, 450], [1, 1.05]);
  const bgY = useTransform(scrollY, [0, 400], [0, -36]);
  const contentY = useTransform(scrollY, [0, 200], [0, -12]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Autoplay images with progress bar
  useEffect(() => {
    if (!isAutoPlaying) return;
    const duration = 4800;
    const step = 100;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += step;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        nextImage();
        elapsed = 0;
      }
    }, step);
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentImageIndex]);

  // Swipe controls
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 35) {
      distance > 0 ? nextImage() : prevImage();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100vh] flex flex-col bg-black overflow-hidden"
      aria-label="Premium Automotive Showcase"
    >
      {/* Background Slideshow */}
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
            loading="lazy"
            className="w-full h-full object-cover object-center absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            draggable={false}
            style={{
              filter: "saturate(1.15) contrast(1.1)" // vivid without dimming
            }}
          />
        </AnimatePresence>

        {/* Subtle Red Glow */}
        <div
          className="absolute left-1/2 bottom-0 w-[70vw] h-[30vh] -translate-x-1/2 blur-2xl opacity-25"
          style={{
            background: "radial-gradient(circle at center, #EB0A1E 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative flex-1 flex flex-col justify-between z-10"
      >
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 px-6 sm:px-12 md:px-24"
        >
          <h1 className="text-white font-black text-4xl sm:text-6xl lg:text-7xl leading-tight"
            style={{ textShadow: "0 4px 16px rgba(0,0,0,0.6), 0 0 32px rgba(235,10,30,0.3)" }}>
            {HEADLINE}
          </h1>
          <p className="mt-4 text-white/90 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl">
            {TAGLINE}
          </p>
        </motion.div>

        {/* Bottom Section */}
        <div className="w-full px-6 sm:px-12 md:px-24 pb-12 space-y-8">
          {/* Specs Row with Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-x-12 gap-y-4"
          >
            {SPECS.map((spec) => (
              <div key={spec.label} className="flex items-center space-x-3">
                {spec.icon}
                <span className="text-white/60">{spec.label}</span>
                <span className="text-[#EB0A1E] font-bold text-lg">{spec.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              aria-label="Configure and Order"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 bg-[#EB0A1E] rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-[#ff1a1a] hover:shadow-[0_0_20px_rgba(235,10,30,0.3)]"
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Configure & Order
            </motion.button>

            <motion.button
              aria-label="Book Test Drive"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white/20 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/40"
            >
              <Calendar className="w-5 h-5" />
              Book Test Drive
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-6">
        <motion.button
          aria-label="Previous Image"
          onClick={prevImage}
          className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <div className="flex gap-2">
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
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
          aria-label="Next Image"
          onClick={nextImage}
          className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        <motion.button
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          onClick={() => setIsAutoPlaying((p) => !p)}
          className="ml-2 p-2 rounded-full bg-black/40"
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

      {/* Progress Bar */}
      <div className="absolute bottom-10 left-0 w-full h-1 bg-white/20">
        <motion.div
          className="h-1 bg-[#EB0A1E]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Swipe Hint (Mobile only) */}
      <div className="absolute bottom-24 w-full text-center text-white/50 text-sm sm:hidden">
        ← Swipe to explore →
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        <ArrowDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </section>
  );
};

const MinimalHeroSection = HeroSection;
export default MinimalHeroSection;
