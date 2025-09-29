import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Menu, ArrowRight, Settings, Calendar, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";

// Enhanced configurable data with more details
const GALLERY_IMAGES = [
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/cbbefa79-6002-4f61-94e0-ee097a8dc6c6/items/e79b990a-9343-4559-b7cc-772c1c52696b/renditions/3964658f-a7d0-4b11-8b8a-cf5b70fe2bff?binary=true&mformat=true",
    alt: "Toyota GR Carbon Front View"
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/5103fe2b-5c90-47cc-a37a-9b9d2dbc1c2e/items/278810b0-4e58-400a-8510-158e058c3ca1/renditions/5a278171-17e4-4c66-b4f7-f13c6a6254db?binary=true&mformat=true",
    alt: "Toyota GR Carbon Side View"
  },
  {
    url: "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-2160.jpg",
    alt: "Toyota GR Carbon Rear View"
  }
];

const NAV_ITEMS = [
  { label: "Models", href: "#models", icon: "🚗" },
  { label: "Gallery", href: "#gallery", icon: "🖼" },
  { label: "Specs", href: "#specs", icon: "📊" },
  { label: "Build", href: "#build", icon: "🔧" }
];

const VEHICLE_DATA = {
  headline: "2026 Toyota GR Carbon",
  tagline: "Electrified performance meets everyday usability",
  price: "Starting at $89,900",
  specs: [
    { label: "0–100 km/h", value: "3.2s", icon: "⚡️" },
    { label: "Range", value: "650 km", icon: "🔋" },
    { label: "AWD", value: "Dual Motor", icon: "⚙️" },
    { label: "Power", value: "670 hp", icon: "💪" }
  ]
};

const LuxuryHeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef });
  
  // Enhanced parallax effects
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.08]);
  const bgY = useTransform(scrollY, [0, 600], [0, -50]);
  const contentY = useTransform(scrollY, [0, 300], [0, -25]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Enhanced touch controls
  const touchRef = useRef({ start: 0, end: 0 });
  const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right'>(null);

  useEffect(() => {
    if (!isAutoPlaying || isHovering) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering]);

  const handleImageChange = (direction: 'next' | 'prev') => {
    setIsAutoPlaying(false);
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current.start = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchRef.current.end = e.touches[0].clientX;
    const diff = touchRef.current.start - touchRef.current.end;
    setSwipeDirection(diff > 50 ? 'left' : diff < -50 ? 'right' : null);
  };

  const handleTouchEnd = () => {
    if (swipeDirection === 'left') handleImageChange('next');
    if (swipeDirection === 'right') handleImageChange('prev');
    setSwipeDirection(null);
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Enhanced Navigation */}
      <motion.nav
        style={{ opacity: navOpacity }}
        className="fixed top-0 left-0 w-full z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="group relative text-white/90 hover:text-white text-sm font-medium tracking-wider"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="inline-block mr-1">{item.icon}</span>
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#EB0A1E]"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>
          <button className="lg:hidden text-white/90 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Enhanced Image Gallery */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ scale: bgScale, y: bgY }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img
              src={GALLERY_IMAGES[currentImageIndex].url}
              alt={GALLERY_IMAGES[currentImageIndex].alt}
              className="w-full h-full object-cover"
              style={{
                filter: "brightness(0.85) contrast(1.1) saturate(1.2)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Gallery Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {GALLERY_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? "w-8 bg-[#EB0A1E]"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white
                     backdrop-blur-sm transition-all duration-300"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Enhanced Content Section */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col justify-center items-center px-4"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            {VEHICLE_DATA.headline}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6">
            {VEHICLE_DATA.tagline}
          </p>
          <p className="text-lg text-[#EB0A1E] font-semibold mb-8">
            {VEHICLE_DATA.price}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {VEHICLE_DATA.specs.map((spec) => (
              <motion.div
                key={spec.label}
                className="flex items-center space-x-2 text-white/90"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-lg">{spec.icon}</span>
                <span className="font-medium">{spec.label}:</span>
                <span className="text-[#EB0A1E] font-bold">{spec.value}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#EB0A1E] text-white rounded-full font-semibold
                       flex items-center space-x-2 shadow-lg shadow-[#EB0A1E]/20
                       hover:bg-[#ff0b22] transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
              <span>Configure & Order</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/20 text-white rounded-full
                       font-semibold flex items-center space-x-2 hover:bg-white/10
                       backdrop-blur-sm transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Test Drive</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};

export default LuxuryHeroSection;
