import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  Settings,
  Calendar,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Battery,
  Car,
} from "lucide-react";

interface MinimalHeroSectionProps {
  vehicle: any;
  galleryImages: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
}

const HEADLINE = "2026 Toyota GR Carbon";
const TAGLINE = "Electrified performance meets everyday usability";
const SPECS = [
  { label: "0–100 km/h", value: 3.2, unit: "s", icon: <Gauge className="w-5 h-5 text-sky-400" /> },
  { label: "Range", value: 650, unit: " km", icon: <Battery className="w-5 h-5 text-sky-400" /> },
  { label: "AWD", value: "Dual Motor", icon: <Car className="w-5 h-5 text-sky-400" /> },
];

const HeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  galleryImages,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef });

  const bgScale = useTransform(scrollY, [0, 450], [1, 1.05]);
  const bgY = useTransform(scrollY, [0, 400], [0, -36]);
  const contentY = useTransform(scrollY, [0, 200], [0, -12]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

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
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setProgress(0);
  };

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
    return (
      <span className="text-sky-400 font-bold text-lg">
        {val.toFixed(0)}
        {unit}
      </span>
    );
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
            className="w-full h-full object-cover absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>

      {/* Gradient mask */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/40 to-transparent z-10" />

      {/* Main Content */}
      <motion.div style={{ y: contentY }} className="relative flex-1 flex flex-col justify-between z-20">
        <div className="mt-24 px-6 sm:px-12 md:px-24">
          <h1 className="text-white font-black text-4xl sm:text-6xl lg:text-7xl leading-tight drop-shadow-lg">
            {HEADLINE}
          </h1>
          <p className="mt-4 text-white/90 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl">{TAGLINE}</p>
        </div>

        {/* Specs */}
        <div className="w-full px-6 sm:px-12 md:px-24 pb-12 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-x-12 text-center sm:text-left">
            {SPECS.map((spec, i) => (
              <div key={i} className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  {spec.icon}
                  <span className="text-white/60 text-sm sm:text-base">{spec.label}</span>
                </div>
                {typeof spec.value === "number" ? (
                  <AnimatedNumber target={spec.value} unit={spec.unit} />
                ) : (
                  <span className="text-sky-400 font-bold text-lg">{spec.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={onCarBuilder}
              aria-label="Configure and Order"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-8 py-4 bg-sky-500 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-sky-600 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Configure & Order
            </motion.button>

            <motion.button
              onClick={onBookTestDrive}
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

      {/* Progress Bar */}
      <div className="absolute bottom-10 left-0 w-full h-1 bg-white/20">
        <motion.div className="h-1 bg-sky-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Controls */}
      <div className="absolute bottom-20 left-4 z-20 flex gap-3">
        <motion.button onClick={prevImage} className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>
      <div className="absolute bottom-20 right-4 z-20 flex gap-3">
        <motion.button onClick={nextImage} className="p-3 rounded-full bg-black/40 text-white/80 hover:text-white">
          <ChevronRight className="w-6 h-6" />
        </motion.button>
        <motion.button onClick={() => setIsAutoPlaying((p) => !p)} className="p-3 rounded-full bg-black/40">
          {isAutoPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-sky-400" />}
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </section>
  );
};

const MinimalHeroSection = HeroSection;
export default MinimalHeroSection;
