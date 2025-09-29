import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Menu } from "lucide-react";

// --- BEGIN CONFIGURABLE DATA ---

// Reuse your MinimalHeroSection images here:
const galleryImages = [
  // Replace with your real images:
  "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80"
];
// Use the first image as the main hero visual
const HERO_BG = galleryImages[0];

const LOGO_URL =
  "https://svgshare.com/i/14bT.svg"; // Placeholder logo

const NAV_ITEMS = [
  { label: "Models", href: "#models" },
  { label: "Gallery", href: "#gallery" },
  { label: "Specs", href: "#specs" },
  { label: "Build", href: "#build" },
];

const HEADLINE = "2026 Toyota GR Carbon";
const TAGLINE = "Electrified performance meets everyday usability";
const SPECS = [
  { label: "0–100 km/h", value: "3.2s" },
  { label: "Range", value: "650 km" },
  { label: "AWD", value: "Dual Motor" },
];

// --- END CONFIGURABLE DATA ---

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef });
  const bgScale = useTransform(scrollY, [0, 300], [1, 1.035]);
  const bgY = useTransform(scrollY, [0, 300], [0, -40]);
  const contentY = useTransform(scrollY, [0, 200], [0, -24]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  // Framer staggered reveal variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.35,
      },
    },
  };
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 18 } },
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col bg-[#181A1B] overflow-hidden"
      aria-label="Premium Automotive Hero section"
    >
      {/* Sticky Navigation */}
      <nav className="sticky top-0 left-0 w-full z-30 bg-gradient-to-b from-[#141415ed] via-[#181A1Bcc] to-[#181A1B00] backdrop-blur-md flex items-center px-4 sm:px-12 py-4 lg:py-6">
        <a href="/" aria-label="Home" className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Brand Logo"
            className="h-8 w-auto md:h-10 rounded"
            style={{ filter: "drop-shadow(0 2px 4px #1116)" }}
          />
          <span className="sr-only">Go to home</span>
        </a>
        <ul className="hidden md:flex ml-12 space-x-8 text-white/90 text-base font-medium tracking-wide">
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

      {/* Background Image w/ Ken Burns */}
      <motion.div
        style={{
          scale: bgScale,
          y: bgY,
        }}
        className="absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
      >
        <img
          src={HERO_BG}
          alt="Cinematic hero background"
          className="w-full h-full object-cover object-center"
          draggable={false}
          style={{ filter: "brightness(0.82) saturate(1.2)" }}
        />
        {/* Carbon-matte + neon accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-[#181A1Bcc] to-[#181A1B00]" />
        {/* Neon accent glow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60vw] h-[10vw] pointer-events-none z-10"
          style={{
            background: "radial-gradient(ellipse at center, #EB0A1E66 0%, transparent 90%)",
            filter: "blur(36px)",
            opacity: 0.45,
          }}
        />
      </motion.div>

      {/* Hero Content */}
      <motion.main
        id="main-content"
        tabIndex={-1}
        className="relative flex flex-1 items-end justify-center z-20"
        style={{ outline: "none" }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-3xl mx-auto px-4 sm:px-8 pb-16 pt-10 sm:pb-28 flex flex-col items-center"
          style={{ y: contentY }}
        >
          {/* Headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="text-white font-black text-[2.7rem] sm:text-5xl lg:text-6xl leading-tight text-center tracking-tight drop-shadow-[0_4px_32px_#181A1B]"
          >
            {HEADLINE}
          </motion.h1>
          {/* Tagline */}
          <motion.h2
            variants={fadeUpVariants}
            className="mt-3 text-white/85 text-lg sm:text-2xl font-light tracking-wide text-center"
          >
            {TAGLINE}
          </motion.h2>

          {/* CTAs */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <motion.a
              href="#build"
              whileHover={{ y: -4, boxShadow: "0 6px 32px #EB0A1E66", scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 sm:flex-none text-center px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-[#EB0A1E] text-white transition-all duration-200 outline-none border-2 border-[#EB0A1E] hover:bg-[#c10e18] focus:ring-2 focus:ring-[#EB0A1E] focus:ring-offset-2"
              aria-label="Configure and Order"
            >
              Configure & Order
            </motion.a>
            <motion.a
              href="#testdrive"
              whileHover={{ y: -4, boxShadow: "0 4px 28px #181A1B33", scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 sm:flex-none text-center px-8 py-4 rounded-full font-bold text-lg border-2 border-white/70 text-white/80 bg-transparent transition-all duration-200 outline-none hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2"
              aria-label="Book a Test Drive"
            >
              Book a Test Drive
            </motion.a>
          </motion.div>

          {/* Teaser Spec Row */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-white/80 text-base sm:text-lg font-medium"
            aria-label="Key vehicle specs"
          >
            {SPECS.map((spec, i) => (
              <span key={spec.label} className="flex items-center gap-2">
                {spec.label}{" "}
                <span className="font-bold text-white/95">{spec.value}</span>
                {i < SPECS.length - 1 && (
                  <span className="text-[#EB0A1E] font-black px-2">•</span>
                )}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute left-1/2 bottom-5 sm:bottom-7 z-30 -translate-x-1/2 flex flex-col items-center"
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
