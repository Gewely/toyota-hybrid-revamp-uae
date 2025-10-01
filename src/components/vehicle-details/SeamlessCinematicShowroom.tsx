"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

// ---------------- CONFIG ----------------
const galleryConfig = {
  vehicleName: "Toyota Land Cruiser 300",
  images: [
    "https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg", // design
    "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg", // hero
    "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-2160.jpg", // power
    "https://media.cdntoyota.co.za/toyotacms23/attachments/clp5594z201l0okak4xj2z22v-lc-300-power-hero-1920x1080.desktop.jpg", // interior
    "https://media.cdntoyota.co.za/toyotacms23/attachments/clsojuxxrb5bwcyak1ignyxsb-lc-300-safety-hero-1920x1080-desktop-with-disclaimer.desktop.jpg", // safety
    "https://media.cdntoyota.co.za/toyotacms23/attachments/clpgsz9zr06due4akk95h6lhl-lc-300-tech-side-by-side-02-682x460.desktop.jpg", // tech 1
    "https://media.cdntoyota.co.za/toyotacms23/attachments/clpgtbm92002gg6aktgguhnjg-lc-300-tech-side-by-side-01-682x460.desktop.jpg"  // tech 2
  ],
  hotspots: [
    { id: "grille", x: "50%", y: "40%", label: "Dynamic Grille", detail: "Aggressive fascia with LED accents" },
    { id: "wheels", x: "30%", y: "70%", label: "Alloy Wheels", detail: "Premium 19-inch machined alloys" },
    { id: "lights", x: "70%", y: "35%", label: "LED Headlamps", detail: "Adaptive bi-beam LED technology" }
  ],
  interiorFeatures: [
    { id: "steering", x: "40%", y: "60%", label: "Steering", detail: "Leather-wrapped with multifunction controls" },
    { id: "screen", x: "60%", y: "40%", label: "Infotainment", detail: "12.3-inch HD touch display with wireless CarPlay" },
    { id: "seats", x: "50%", y: "75%", label: "Seats", detail: "Premium ventilated leather seats" }
  ],
  moods: [
    { id: "sport", label: "Sport Mode", gradient: "from-red-900/70 via-black to-black" },
    { id: "urban", label: "Urban Drive", gradient: "from-slate-900/70 via-black to-black" },
    { id: "eco", label: "Eco Mode", gradient: "from-green-900/60 via-black to-black" }
  ],
  lifestyleScenes: [
    { id: "city", label: "City Drive", backdrop: "https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg" },
    { id: "desert", label: "Desert Escape", backdrop: "https://media.cdntoyota.co.za/toyotacms23/attachments/clsojuxxrb5bwcyak1ignyxsb-lc-300-safety-hero-1920x1080-desktop-with-disclaimer.desktop.jpg" },
    { id: "mountain", label: "Mountain Adventure", backdrop: "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg" }
  ]
};

// Scenes
type SceneType = "hero" | "power" | "safety" | "interior" | "tech" | "lifestyle";
const SCENES: SceneType[] = ["hero", "power", "safety", "interior", "tech", "lifestyle"];

// ---------------- CUSTOM SWIPE HOOK ----------------
function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStart = React.useRef<number | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      touchStart.current = e.changedTouches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchStart.current === null) return;
      const diff = e.changedTouches[0].clientX - touchStart.current;
      if (diff > 50) onSwipeRight();
      if (diff < -50) onSwipeLeft();
      touchStart.current = null;
    }
  };
}

// ---------------- COMPONENT ----------------
const SeamlessCinematicShowroom: React.FC<{
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}> = ({ onReserve, onTestDrive, onConfigure }) => {
  const [currentScene, setCurrentScene] = useState<SceneType>("hero");
  const [progress, setProgress] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [activeInterior, setActiveInterior] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState("sport");
  const [selectedLifestyle, setSelectedLifestyle] = useState(0);

  // Autoplay timeline
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => {
        const idx = SCENES.indexOf(prev);
        return SCENES[(idx + 1) % SCENES.length];
      });
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 180);
    return () => clearInterval(interval);
  }, [currentScene]);

  // Swipe
  const swipeHandlers = useSwipe(
    () => {
      const idx = SCENES.indexOf(currentScene);
      setCurrentScene(SCENES[(idx + 1) % SCENES.length]);
    },
    () => {
      const idx = SCENES.indexOf(currentScene);
      setCurrentScene(SCENES[(idx - 1 + SCENES.length) % SCENES.length]);
    }
  );

  // Parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const parallaxX = useTransform(mouseX, [0, 1], [-40, 40]);
  const parallaxY = useTransform(mouseY, [0, 1], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section {...swipeHandlers} className="relative w-full h-screen overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        {/* HERO Scene */}
        {currentScene === "hero" && (
          <motion.div
            key="hero"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={galleryConfig.images[1]}
              alt="Hero"
              className="w-[90%] max-w-6xl object-contain drop-shadow-2xl"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-5xl md:text-7xl font-serif tracking-wide"
            >
              {galleryConfig.vehicleName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-lg text-white/70 mt-4"
            >
              Where Luxury Meets Power
            </motion.p>
          </motion.div>
        )}
        {/* POWER Scene */}
        {currentScene === "power" && (
          <motion.div
            key="power"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={galleryConfig.images[2]}
              alt="Power"
              className="w-[85%] max-w-5xl object-contain drop-shadow-2xl"
              style={{ x: parallaxX, y: parallaxY }}
            />
            {/* Cinematic Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-24 text-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-xl">
                Raw Power, Refined
              </h2>
              <p className="text-lg md:text-2xl text-white/70 mt-2">
                Twin-turbo V6 delivering unstoppable performance
              </p>
            </motion.div>
            {/* Spec Cards */}
            <div className="absolute bottom-16 flex gap-6">
              {[
                { label: "Horsepower", value: "409 hp" },
                { label: "Torque", value: "650 Nm" },
                { label: "Efficiency", value: "10.3 L/100km" }
              ].map((spec, idx) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + idx * 0.2, type: "spring", stiffness: 100 }}
                  className="px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl"
                >
                  <p className="text-sm uppercase text-white/70">{spec.label}</p>
                  <p className="text-xl font-bold text-white">{spec.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SAFETY Scene (Hotspots) */}
        {currentScene === "safety" && (
          <motion.div
            key="safety"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-[85%] max-w-6xl">
              <motion.img
                src={galleryConfig.images[4]}
                alt="Safety"
                className="w-full h-auto object-contain"
                style={{ x: parallaxX, y: parallaxY }}
              />
              {galleryConfig.hotspots.map((spot) => (
                <motion.div
                  key={spot.id}
                  className="absolute"
                  style={{ left: spot.x, top: spot.y }}
                  whileHover={{ scale: 1.2 }}
                >
                  <button
                    onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                    className="w-6 h-6 rounded-full bg-white/70 border border-white/90 shadow-lg"
                  />
                  <AnimatePresence>
                    {activeHotspot === spot.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-xl rounded-xl shadow-xl w-48"
                      >
                        <h3 className="font-semibold text-sm">{spot.label}</h3>
                        <p className="text-xs opacity-70">{spot.detail}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* INTERIOR Scene */}
        {currentScene === "interior" && (
          <motion.div
            key="interior"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-[85%] max-w-6xl">
              <motion.img
                src={galleryConfig.images[3]}
                alt="Interior"
                className="w-full h-auto rounded-3xl shadow-2xl object-cover"
                style={{ x: parallaxX, y: parallaxY }}
              />
              {galleryConfig.interiorFeatures.map((f) => (
                <motion.div
                  key={f.id}
                  className="absolute"
                  style={{ left: f.x, top: f.y }}
                  whileHover={{ scale: 1.2 }}
                >
                  <button
                    onClick={() => setActiveInterior(activeInterior === f.id ? null : f.id)}
                    className="w-6 h-6 rounded-full bg-white/70 border border-white/90 shadow-lg"
                  />
                  <AnimatePresence>
                    {activeInterior === f.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute left-8 top-1/2 -translate-y-1/2 px-4 py-3 bg-gradient-to-br from-black/70 to-black/40 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-56"
                      >
                        <h3 className="font-semibold text-sm">{f.label}</h3>
                        <p className="text-xs opacity-80">{f.detail}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TECH Scene */}
        {currentScene === "tech" && (
          <motion.div
            key="tech"
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={galleryConfig.images[5]}
              alt="Tech 1"
              className="w-[70%] max-w-4xl rounded-xl shadow-2xl object-cover"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <motion.img
              src={galleryConfig.images[6]}
              alt="Tech 2"
              className="w-[70%] max-w-4xl rounded-xl shadow-2xl object-cover"
              style={{ x: parallaxX, y: parallaxY }}
            />
            {/* Floating Glass Spec Cards */}
            <div className="absolute bottom-12 flex gap-6">
              {[
                { label: "Infotainment", value: "12.3-inch HD Touch" },
                { label: "Safety Suite", value: "Toyota Safety Sense" },
                { label: "Connectivity", value: "Wireless CarPlay" }
              ].map((spec, idx) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.2 }}
                  className="px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg"
                >
                  <p className="text-sm text-white/70">{spec.label}</p>
                  <p className="text-lg font-bold text-white">{spec.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* LIFESTYLE Scene */}
        {currentScene === "lifestyle" && (
          <motion.div
            key="lifestyle"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0">
              <motion.img
                src={galleryConfig.lifestyleScenes[selectedLifestyle].backdrop}
                alt={galleryConfig.lifestyleScenes[selectedLifestyle].label}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ x: parallaxX, y: parallaxY }}
              />
            </div>
            <motion.img
              src={galleryConfig.images[1]}
              alt={galleryConfig.vehicleName}
              className="w-[80%] max-w-5xl object-contain drop-shadow-2xl z-20"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <h2 className="absolute bottom-24 text-3xl md:text-5xl font-semibold drop-shadow-xl z-30">
              {galleryConfig.lifestyleScenes[selectedLifestyle].label}
            </h2>
            <div className="absolute bottom-8 flex gap-4 z-40">
              {galleryConfig.lifestyleScenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedLifestyle(idx)}
                  className={`px-6 py-3 rounded-xl backdrop-blur-xl border ${
                    selectedLifestyle === idx
                      ? "bg-white/20 border-white"
                      : "bg-white/5 border-white/30"
                  }`}
                >
                  {scene.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/20 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-1 bg-gradient-to-r from-white to-gray-300"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.2 }}
        />
      </motion.div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg z-[100]"
      >
        <Button onClick={onReserve} variant="default" size="lg" className="bg-white/20 text-white hover:bg-white/30">
          Reserve
        </Button>
        <Button onClick={onTestDrive} variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/20">
          Test Drive
        </Button>
        <Button onClick={onConfigure} variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/20">
          Configure
        </Button>
      </motion.div>
    </section>
  );
};

export default SeamlessCinematicShowroom;
