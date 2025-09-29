import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Menu, ArrowRight, Settings, Calendar, Pause, Play } from "lucide-react";

// --- CONFIGURABLE DATA ---

const galleryImages = [
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/cbbefa79-6002-4f61-94e0-ee097a8dc6c6/items/e79b990a-9343-4559-b7cc-772c1c52696b/renditions/3964658f-a7d0-4b11-8b8a-cf5b70fe2bff?binary=true&mformat=true",
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/5103fe2b-5c90-47cc-a37a-9b9d2dbc1c2e/items/278810b0-4e58-400a-8510-158e058c3ca1/renditions/5a278171-17e4-4c66-b4f7-f13c6a6254db?binary=true&mformat=true",
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-2160.jpg"
];

const NAV_ITEMS = [
  { label: "Models", href: "#models" },
  { label: "Gallery", href: "#gallery" },
  { label: "Specs", href: "#specs" },
  { label: "Build", href: "#build" }
];

const HEADLINE = "2026 Toyota GR Carbon";
const TAGLINE = "Electrified performance meets everyday usability";
const SPECS = [
  { label: "0–100 km/h", value: "3.2s" },
  { label: "Range", value: "650 km" },
  { label: "AWD", value: "Dual Motor" }
];

// --- END CONFIGURABLE DATA ---

// Framer Motion variants for luxury effect
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.35,
    },
  },
};
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef });
  const bgScale = useTransform(scrollY, [0, 450], [1, 1.05]);
  const bgY = useTransform(scrollY, [0, 400], [0, -36]);
  const contentY = useTransform(scrollY, [0, 200], [0, -12]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  // Slideshow state & logic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Touch controls for swipe gallery on mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const distance = touchStart - touchEnd;
    if (distance > 35) nextImage();
    if (distance < -35) prevImage();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  // Navigation
  const handleConfigure = () => { window.location.href = "/car-builder"; };
  const handleTestDrive = () => { window.location.href = "/test-drive"; };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col bg-black overflow-hidden"
      aria-label="Premium Automotive Hero section"
    >
      {/* Sticky Navigation */}
      <nav className="sticky top-0 left-0 w-full z-30 bg-gradient-to-b from-[#141415ea] via-[#1a1c1fbe] to-[#1a1c1f00] backdrop-blur-md flex items-center px-4 sm:px-10 py-4 lg:py-6">
        <ul className="flex ml-0 space-x-8 text-white/90 text-base font-semibold tracking-wide">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="transition-colors duration-200 hover:text-[#EB0A1E] focus:outline-none focus:text-[#EB0A1E]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="ml-auto md:hidden text-white/80" aria-label="Open Menu">
          <Menu className="h-7 w-7" />
        </button>
      </nav>

      {/* Cinematic Background slideshow */}
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={galleryImages[currentImageIndex]}
            src={galleryImages[currentImageIndex]}
            alt={`Cinematic hero car view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover object-center absolute inset-0 transition-all duration-700"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.01 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            draggable={false}
            style={{ filter: "saturate(1.25) contrast(1.14) brightness(1.01)" }}
          />
        </AnimatePresence>
        {/* Strong bottom gradient for text readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        {/* Neon accent streak (luxury feel) */}
        <div className="absolute left-[10vw] bottom-12 w-[60vw] h-[8vw] rounded-xl blur-2xl opacity-40 pointer-events-none z-10"
          style={{
            background: "linear-gradient(90deg,#EB0A1E88 0%,#fff0 80%)",
          }}
        />
      </motion.div>

      {/* Luxury: Headline and tag centered, buttons bottom left */}
      <motion.main
        id="main-content"
        tabIndex={-1}
        className="relative flex flex-1 items-end justify-start z-20"
        style={{ outline: "none" }}
      >
        {/* Headline/Tagline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full px-4 pt-20 sm:px-0 md:pt-28 flex flex-col items-center pointer-events-none select-none"
          style={{ y: contentY }}
        >
          <motion.h1
            variants={fadeUpVariants}
            className="text-white font-black text-4xl sm:text-6xl xl:text-7xl tracking-tight leading-tight text-center drop-shadow-[0_4px_32px_#181A1B] uppercase"
            style={{ letterSpacing: '0.04em', textShadow: "0 2px 32px #EB0A1E22" }}
          >
            {HEADLINE}
          </motion.h1>
          <motion.h2
            variants={fadeUpVariants}
            className="mt-4 text-white/90 text-lg sm:text-2xl xl:text-3xl font-light tracking-wide text-center"
            style={{ textShadow: "0 2px 20px #181A1B" }}
          >
            {TAGLINE}
          </motion.h2>
        </motion.div>

        {/* Buttons & Specs: luxury left-bottom position */}
        <div className="absolute left-0 bottom-0 z-30 w-full sm:w-auto px-4 pb-10 sm:pb-16 flex flex-col items-start justify-end">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              type="button"
              onClick={handleConfigure}
              whileHover={{ y: -3, boxShadow: "0 8px 32px #EB0A1E99", scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-[#EB0A1E] text-white transition-all duration-200 outline-none border-2 border-[#EB0A1E] hover:bg-[#c10e18] focus:ring-2 focus:ring-[#EB0A1E] focus:ring-offset-2"
              aria-label="Configure and Order"
            >
              <Settings className="h-5 w-5" />
              Configure & Order
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            <motion.button
              type="button"
              onClick={handleTestDrive}
              whileHover={{ y: -3, boxShadow: "0 6px 32px #fff4", scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg border-2 border-white/70 text-white/90 bg-transparent transition-all duration-200 outline-none hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2"
              aria-label="Book a Test Drive"
            >
              <Calendar className="h-5 w-5" />
              Book a Test Drive
            </motion.button>
          </motion.div>
          {/* Specs row */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-white/90 text-base sm:text-lg font-semibold"
            aria-label="Key vehicle specs"
          >
            {SPECS.map((spec, i) => (
              <span key={spec.label} className="flex items-center gap-2">
                {spec.label}{" "}
                <span className="font-bold text-[#EB0A1E]">{spec.value}</span>
                {i < SPECS.length - 1 && (
                  <span className="text-[#EB0A1E] font-black px-2">•</span>
                )}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.main>

      {/* Image indicators & pause/play */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 flex flex-row items-center gap-2"
        aria-label="Change hero image"
      >
        <AnimatePresence>
          {galleryImages.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              aria-label={`Show image ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIndex
                  ? 'bg-[#EB0A1E] w-7'
                  : 'bg-[#EB0A1E]/40 w-2 hover:bg-[#EB0A1E]/60'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
            />
          ))}
        </AnimatePresence>
        <button
          className="ml-4 p-2 rounded-full bg-black/40 hover:bg-black/70 transition-all border border-white/20 text-white"
          onClick={() => setIsAutoPlaying((p) => !p)}
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute left-1/2 bottom-2 sm:bottom-5 z-30 -translate-x-1/2 flex flex-col items-center"
        style={{ opacity: scrollIndicatorOpacity }}
        aria-hidden="true"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <ArrowDown className="h-8 w-8 text-[#EB0A1E] drop-shadow-[0_2px_8px_#EB0A1E77]" />
        </motion.div>
        <span className="sr-only">Scroll Down</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
