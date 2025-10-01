"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "@/hooks/use-swipeable";

/**
 * CONFIG — Replace with Toyota DAM assets
 */
const galleryConfig = {
  vehicleName: "Toyota Crown",
  heroImage: "/images/crown-exterior.png",
  interiorImage: "/images/crown-interior.png",
  hotspots: [
    { id: "grille", x: "50%", y: "40%", label: "Dynamic Grille", detail: "Aggressive fascia with LED accents" },
    { id: "wheels", x: "30%", y: "70%", label: "Alloy Wheels", detail: "Premium 19-inch machined alloys" },
    { id: "lights", x: "70%", y: "35%", label: "LED Headlamps", detail: "Adaptive bi-beam LED technology" },
  ],
  moods: [
    { id: "sport", label: "Sport Mode", gradient: "from-red-900/70 via-black to-black" },
    { id: "urban", label: "Urban Drive", gradient: "from-slate-900/70 via-black to-black" },
    { id: "eco", label: "Eco Mode", gradient: "from-green-900/60 via-black to-black" },
  ],
  interiorFeatures: [
    { id: "steering", x: "40%", y: "60%", label: "Steering", detail: "Leather-wrapped with multifunction controls" },
    { id: "screen", x: "60%", y: "40%", label: "Infotainment", detail: "12.3-inch HD touch display with wireless CarPlay" },
    { id: "seats", x: "50%", y: "75%", label: "Seats", detail: "Premium ventilated leather seats" },
  ],
  ambientColors: [
    { label: "Pearl White", gradient: "from-slate-100/20 to-white/10" },
    { label: "Sunset Orange", gradient: "from-orange-500/30 to-red-500/20" },
    { label: "Ocean Blue", gradient: "from-blue-500/30 to-cyan-500/20" },
    { label: "Forest Green", gradient: "from-green-500/30 to-emerald-500/20" },
  ],
  lifestyleScenes: [
    { id: "city", label: "City Drive", backdrop: "/images/crown-city.jpg", foreground: "/images/crown-city-fg.png" },
    { id: "desert", label: "Desert Escape", backdrop: "/images/crown-desert.jpg", foreground: "/images/crown-desert-fg.png" },
    { id: "weekend", label: "Weekend Journey", backdrop: "/images/crown-weekend.jpg", foreground: "/images/crown-weekend-fg.png" },
  ],
};

type SceneType = "hero" | "highlights" | "mood" | "interior" | "ambient" | "lifestyle";

const SCENES: SceneType[] = ["hero", "highlights", "mood", "interior", "ambient", "lifestyle"];

interface SeamlessCinematicShowroomProps {
  vehicleName: string;
  galleryImages: { url: string; alt: string; category: string; }[];
  onReserve: () => void;
  onTestDrive: () => void;
  onConfigure: () => void;
}

const ModelImmersiveGallery: React.FC<SeamlessCinematicShowroomProps> = ({
  vehicleName,
  onReserve,
  onTestDrive,
  onConfigure
}) => {
  const [currentScene, setCurrentScene] = useState<SceneType>("hero");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [activeInterior, setActiveInterior] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState("sport");
  const [selectedAmbient, setSelectedAmbient] = useState(0);
  const [selectedLifestyle, setSelectedLifestyle] = useState(0);
  const [progress, setProgress] = useState(0);

  // Autoplay timeline
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => {
        const idx = SCENES.indexOf(prev);
        return SCENES[(idx + 1) % SCENES.length];
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Progress bar animation
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 160); // 8s total
    return () => clearInterval(interval);
  }, [currentScene]);

  // Swipe support (mobile)
  const swipeHandlers = useSwipeable({
    onSwipeLeft: () => {
      const idx = SCENES.indexOf(currentScene);
      setCurrentScene(SCENES[(idx + 1) % SCENES.length]);
    },
    onSwipeRight: () => {
      const idx = SCENES.indexOf(currentScene);
      setCurrentScene(SCENES[(idx - 1 + SCENES.length) % SCENES.length]);
    },
  });

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
        {/* Hero */}
        {currentScene === "hero" && (
          <motion.div
            key="hero"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.img
              src={galleryConfig.heroImage}
              alt={galleryConfig.vehicleName}
              className="w-[90%] max-w-6xl object-contain drop-shadow-2xl"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-5xl md:text-7xl font-serif tracking-wide"
            >
              {vehicleName}
            </motion.h1>
          </motion.div>
        )}

        {/* Highlights */}
        {currentScene === "highlights" && (
          <motion.div
            key="highlights"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-[85%] max-w-6xl">
              <motion.img
                src={galleryConfig.heroImage}
                alt="Highlights"
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

        {/* Mood */}
        {currentScene === "mood" && (
          <motion.div
            key="mood"
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${
                galleryConfig.moods.find((m) => m.id === selectedMood)?.gradient
              }`}
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.img
              src={galleryConfig.heroImage}
              alt="Mood Scene"
              className="w-[80%] max-w-5xl object-contain drop-shadow-2xl"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <div className="flex gap-4 z-20">
              {galleryConfig.moods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  className={`px-6 py-3 rounded-2xl backdrop-blur-xl border ${
                    selectedMood === m.id ? "bg-white/20 border-white" : "bg-white/5 border-white/30"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interior */}
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
                src={galleryConfig.interiorImage}
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

        {/* Ambient */}
        {currentScene === "ambient" && (
          <motion.div
            key="ambient"
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div className="w-[85%] max-w-5xl rounded-3xl overflow-hidden shadow-xl">
              <img src={galleryConfig.interiorImage} alt="Ambient" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex gap-4 z-20">
              {galleryConfig.ambientColors.map((c, idx) => (
                <button
                  key={c.label}
                  onClick={() => setSelectedAmbient(idx)}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.gradient} border ${
                    selectedAmbient === idx ? "border-white scale-110" : "border-white/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Lifestyle with Parallax */}
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
              {galleryConfig.lifestyleScenes[selectedLifestyle].foreground && (
                <motion.img
                  src={galleryConfig.lifestyleScenes[selectedLifestyle].foreground}
                  alt="foreground"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ x: parallaxX, y: parallaxY }}
                />
              )}
            </div>
            <motion.img
              src={galleryConfig.heroImage}
              alt={vehicleName}
              className="w-[80%] max-w-5xl object-contain drop-shadow-2xl z-20"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <h2 className="absolute bottom-24 text-3xl md:text-5xl font-semibold drop-shadow-xl z-30">
              {galleryConfig.lifestyleScenes[selectedLifestyle].label}
            </h2>
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
        <Button onClick={onReserve} variant="default" size="lg" className="bg-white/20 text-white hover:bg-white/30">Reserve</Button>
        <Button onClick={onTestDrive} variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/20">Test Drive</Button>
        <Button onClick={onConfigure} variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/20">Configure</Button>
      </motion.div>
    </section>
  );
};

export default ModelImmersiveGallery;
