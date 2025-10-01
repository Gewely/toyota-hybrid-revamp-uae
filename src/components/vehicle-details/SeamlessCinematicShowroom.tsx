import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Gauge, Palette, Shield, Mountain, Info } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";

interface SeamlessCinematicShowroomProps {
  vehicleName: string;
  onReserve: () => void;
  onTestDrive: () => void;
  onConfigure: () => void;
}

type SceneType = "hero" | "performance" | "design" | "interior" | "safety" | "lifestyle";
type DriveMode = "eco" | "sport" | "sand";
type LifestyleMode = "desert" | "city" | "weekend";

const scenes: SceneType[] = ["hero", "performance", "design", "interior", "safety", "lifestyle"];

const SeamlessCinematicShowroom: React.FC<SeamlessCinematicShowroomProps> = ({
  vehicleName,
  onReserve,
  onTestDrive,
  onConfigure,
}) => {
  const [currentScene, setCurrentScene] = useState<SceneType>("hero");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<SceneType | null>(null);
  const [driveMode, setDriveMode] = useState<DriveMode>("eco");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [lifestyleMode, setLifestyleMode] = useState<LifestyleMode>("desert");
  const [imageLoaded, setImageLoaded] = useState(false);

  const sceneIndex = scenes.indexOf(currentScene);

  const nextScene = useCallback(() => {
    if (sceneIndex < scenes.length - 1) {
      setCurrentScene(scenes[sceneIndex + 1]);
      setImageLoaded(false);
    }
  }, [sceneIndex]);

  const prevScene = useCallback(() => {
    if (sceneIndex > 0) {
      setCurrentScene(scenes[sceneIndex - 1]);
      setImageLoaded(false);
    }
  }, [sceneIndex]);

  const swipeHandlers = useSwipeable({
    onSwipeLeft: nextScene,
    onSwipeRight: prevScene,
    trackMouse: false,
  });

  const openModal = (scene: SceneType) => {
    setModalContent(scene);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalContent(null), 300);
  };

  const sceneVariants = {
    enter: { opacity: 0, scale: 1.05, filter: "blur(20px)" },
    center: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.95, filter: "blur(20px)" },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black" {...swipeHandlers}>
      <AnimatePresence mode="wait">
        {/* Hero Scene */}
        {currentScene === "hero" && (
          <motion.section
            key="hero"
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0">
              <img
                src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg"
                alt="Land Cruiser Hero"
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            <div className="relative z-10 text-center text-white px-6 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{vehicleName}</h1>
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-[hsl(var(--luxury-gold))]">409</div>
                    <div className="text-sm uppercase tracking-wider text-white/80">HP</div>
                  </div>
                  <div className="w-px h-12 bg-white/30" />
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-[hsl(var(--luxury-gold))]">650</div>
                    <div className="text-sm uppercase tracking-wider text-white/80">Nm</div>
                  </div>
                </div>
                <button
                  onClick={() => openModal("hero")}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-300"
                >
                  <span className="text-lg font-medium">Explore Design</span>
                  <Info className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Performance Scene */}
        {currentScene === "performance" && (
          <motion.section
            key="performance"
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0">
              <img
                src="https://media.cdntoyota.co.za/toyotacms23/attachments/clp5594z201l0okak4xj2z22v-lc-300-power-hero-1920x1080.desktop.jpg"
                alt="Performance"
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            <div className="relative z-10 px-6 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 mb-8 cursor-pointer" onClick={() => openModal("performance")}>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.2)" strokeWidth="20" fill="none" />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="hsl(var(--luxury-gold))"
                      strokeWidth="20"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(409 / 600) * 502.4} 502.4`}
                      initial={{ strokeDasharray: "0 502.4" }}
                      animate={{ strokeDasharray: `${(409 / 600) * 502.4} 502.4` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="text-5xl font-bold">409</div>
                    <div className="text-sm uppercase tracking-wider opacity-80">Horsepower</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {(["eco", "sport", "sand"] as DriveMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDriveMode(mode)}
                      className={`px-6 py-3 rounded-full font-medium transition-all ${
                        driveMode === mode
                          ? "bg-[hsl(var(--luxury-gold))] text-black"
                          : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-white space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">Unleashed Power</h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  Experience the raw power of 409 HP and 650 Nm of torque. Switch between drive modes to adapt to any terrain.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Design Slider Scene */}
        {currentScene === "design" && (
          <motion.section
            key="design"
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <img
                  src="https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg"
                  alt="Design Before"
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
              <div className="absolute inset-0">
                <img
                  src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-2160.jpg"
                  alt="Design After"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-20 w-full h-1 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-2xl [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[hsl(var(--luxury-gold))]"
              />

              <button
                onClick={() => openModal("design")}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all"
              >
                View Design Details
              </button>

              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
            </div>
          </motion.section>
        )}

        {/* Interior Scene */}
        {currentScene === "interior" && (
          <motion.section
            key="interior"
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0">
              <img
                src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpgsz9zr06due4akk95h6lhl-lc-300-tech-side-by-side-02-682x460.desktop.jpg"
                alt="Interior"
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 px-6 w-full max-w-7xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">Luxury Interior</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { id: "steering", label: "Premium Steering", icon: "🎮" },
                  { id: "infotainment", label: "Infotainment", icon: "📱" },
                  { id: "seats", label: "Luxury Seats", icon: "💺" },
                ].map((hotspot) => (
                  <motion.button
                    key={hotspot.id}
                    onClick={() => openModal("interior")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative p-8 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-3xl transition-all"
                  >
                    <div className="text-6xl mb-4">{hotspot.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{hotspot.label}</h3>
                    <div className="text-white/60">Click to explore</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Safety Scene */}
        {currentScene === "safety" && (
          <motion.section
            key="safety"
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <img
                src="https://media.cdntoyota.co.za/toyotacms23/attachments/clsojuxxrb5bwcyak1ignyxsb-lc-300-safety-hero-1920x1080-desktop-with-disclaimer.desktop.jpg"
                alt="Safety"
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 px-6 md:px-12 h-full flex items-center">
              <div className="max-w-2xl text-white space-y-8">
                <h2 className="text-5xl md:text-6xl font-bold leading-tight">Safety First, Always</h2>
                <p className="text-xl text-white/80 leading-relaxed">
                  Advanced safety systems that protect you and your loved ones on every journey.
                </p>
                <button
                  onClick={() => openModal("safety")}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all"
                >
                  <Shield className="w-6 h-6" />
                  <span className="text-lg font-medium">Explore Safety Features</span>
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Lifestyle Scene */}
        {currentScene === "lifestyle" && (
          <motion.section
            key="lifestyle"
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <motion.img
                key={lifestyleMode}
                src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpgtbm92002gg6aktgguhnjg-lc-300-tech-side-by-side-01-682x460.desktop.jpg"
                alt="Lifestyle"
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between py-12 px-6">
              <div className="text-center text-white">
                <motion.h2
                  key={lifestyleMode}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  {lifestyleMode === "desert" && "Desert Escape"}
                  {lifestyleMode === "city" && "Urban Explorer"}
                  {lifestyleMode === "weekend" && "Weekend Warrior"}
                </motion.h2>
              </div>

              <div className="flex justify-center gap-4">
                {(["desert", "city", "weekend"] as LifestyleMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setLifestyleMode(mode)}
                    className={`px-6 py-3 rounded-full font-medium transition-all ${
                      lifestyleMode === mode
                        ? "bg-[hsl(var(--luxury-gold))] text-black"
                        : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20"
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => openModal("lifestyle")}
                className="mx-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all"
              >
                View Gallery
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        {scenes.map((scene, idx) => (
          <button
            key={scene}
            onClick={() => {
              setCurrentScene(scene);
              setImageLoaded(false);
            }}
            className={`transition-all ${
              idx === sceneIndex
                ? "w-12 h-3 bg-[hsl(var(--luxury-gold))]"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
            } rounded-full`}
            aria-label={`Go to ${scene} scene`}
          />
        ))}
      </div>

      {/* CTA Bar - Red only for Reserve */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-6">
        <button
          onClick={onReserve}
          className="px-8 py-4 bg-[hsl(var(--toyota-red))] hover:bg-[hsl(var(--toyota-red))]/90 text-white font-semibold rounded-full shadow-2xl transition-all hover:scale-105"
        >
          Reserve
        </button>
        <button
          onClick={onTestDrive}
          className="px-8 py-4 bg-[hsl(var(--toyota-graphite))] hover:bg-[hsl(var(--toyota-graphite))]/90 text-white font-semibold rounded-full shadow-2xl transition-all hover:scale-105"
        >
          Test Drive
        </button>
        <button
          onClick={onConfigure}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full transition-all hover:scale-105"
        >
          Configure
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[hsl(var(--toyota-graphite))] to-[hsl(var(--toyota-charcoal))] rounded-3xl p-8 md:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {modalContent === "hero" && <HeroModal />}
              {modalContent === "performance" && <PerformanceModal />}
              {modalContent === "design" && <DesignModal />}
              {modalContent === "interior" && <InteriorModal />}
              {modalContent === "safety" && <SafetyModal />}
              {modalContent === "lifestyle" && <LifestyleModal />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal Components
const HeroModal = () => (
  <div className="text-white space-y-8">
    <h2 className="text-5xl font-bold mb-6">The Legend Continues</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img
          src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg"
          alt="Design"
          className="w-full h-64 object-cover rounded-2xl mb-4"
        />
        <h3 className="text-2xl font-bold mb-3">Iconic Design</h3>
        <p className="text-white/70">A perfect blend of rugged capability and modern luxury.</p>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="text-xl font-bold mb-2 text-[hsl(var(--luxury-gold))]">Power Specs</h4>
          <ul className="space-y-2 text-white/80">
            <li>• 409 HP Twin-Turbo V6</li>
            <li>• 650 Nm of Torque</li>
            <li>• 0-100 km/h in 6.7s</li>
            <li>• Top Speed: 210 km/h</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PerformanceModal = () => (
  <div className="text-white space-y-8">
    <h2 className="text-5xl font-bold mb-6">Performance Engineering</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {["Eco Mode", "Sport Mode", "Sand Mode"].map((mode, idx) => (
        <div key={mode} className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-4xl font-bold text-[hsl(var(--luxury-gold))] mb-2">{idx === 0 ? "⚡" : idx === 1 ? "🏁" : "🏜️"}</div>
          <h3 className="text-xl font-bold mb-3">{mode}</h3>
          <p className="text-white/70">Optimized performance for every condition.</p>
        </div>
      ))}
    </div>
  </div>
);

const DesignModal = () => (
  <div className="text-white space-y-8">
    <h2 className="text-5xl font-bold mb-6">Design Philosophy</h2>
    <p className="text-xl text-white/80 mb-8">Every curve, every line tells a story of strength and elegance.</p>
    <div className="grid md:grid-cols-2 gap-8">
      <img
        src="https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg"
        alt="Exterior"
        className="w-full h-96 object-cover rounded-2xl"
      />
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Aerodynamic Excellence</h3>
        <ul className="space-y-3 text-white/80">
          <li>• LED Matrix Headlights</li>
          <li>• Sculpted Body Lines</li>
          <li>• 20" Alloy Wheels</li>
          <li>• Dual Exhaust System</li>
        </ul>
      </div>
    </div>
  </div>
);

const InteriorModal = () => (
  <div className="text-white space-y-8">
    <h2 className="text-5xl font-bold mb-6">Luxury Interior</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold mb-3 text-[hsl(var(--luxury-gold))]">Premium Materials</h3>
          <p className="text-white/70">Hand-stitched leather, real wood trim, and brushed aluminum accents.</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold mb-3 text-[hsl(var(--luxury-gold))]">Technology</h3>
          <p className="text-white/70">14" touchscreen, 360° camera, and premium sound system.</p>
        </div>
      </div>
      <img
        src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpgsz9zr06due4akk95h6lhl-lc-300-tech-side-by-side-02-682x460.desktop.jpg"
        alt="Interior"
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  </div>
);

const SafetyModal = () => (
  <div className="text-white space-y-8">
    <h2 className="text-5xl font-bold mb-6">Advanced Safety</h2>
    <div className="grid md:grid-cols-2 gap-6">
      {[
        "Pre-Collision System",
        "Lane Departure Alert",
        "Adaptive Cruise Control",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "10 Airbags",
      ].map((feature) => (
        <div key={feature} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          <Shield className="w-8 h-8 text-[hsl(var(--luxury-gold))] mb-3" />
          <h3 className="text-lg font-bold">{feature}</h3>
        </div>
      ))}
    </div>
  </div>
);

const LifestyleModal = () => (
  <div className="text-white space-y-8">
    <h2 className="text-5xl font-bold mb-6">Your Adventure Awaits</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { title: "Desert Escape", emoji: "🏜️" },
        { title: "Urban Explorer", emoji: "🌆" },
        { title: "Weekend Warrior", emoji: "⛰️" },
      ].map((item) => (
        <div key={item.title} className="relative group overflow-hidden rounded-2xl aspect-[4/3]">
          <img
            src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpgtbm92002gg6aktgguhnjg-lc-300-tech-side-by-side-01-682x460.desktop.jpg"
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <div className="text-4xl mb-2">{item.emoji}</div>
            <h3 className="text-2xl font-bold">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SeamlessCinematicShowroom;
