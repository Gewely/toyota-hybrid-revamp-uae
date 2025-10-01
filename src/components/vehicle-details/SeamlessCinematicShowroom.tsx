"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "react-swipeable";

/**
 * CONFIG with Land Cruiser images
 */
const galleryConfig = {
  vehicleName: "Toyota Land Cruiser 300",
  scenes: {
    hero: {
      image: "https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg",
    },
    highlights: {
      image: "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg",
    },
    exterior: {
      image: "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-2160.jpg",
    },
    power: {
      image: "https://media.cdntoyota.co.za/toyotacms23/attachments/clp5594z201l0okak4xj2z22v-lc-300-power-hero-1920x1080.desktop.jpg",
    },
    safety: {
      image: "https://media.cdntoyota.co.za/toyotacms23/attachments/clsojuxxrb5bwcyak1ignyxsb-lc-300-safety-hero-1920x1080-desktop-with-disclaimer.desktop.jpg",
    },
    tech1: {
      image: "https://media.cdntoyota.co.za/toyotacms23/attachments/clpgsz9zr06due4akk95h6lhl-lc-300-tech-side-by-side-02-682x460.desktop.jpg",
    },
    tech2: {
      image: "https://media.cdntoyota.co.za/toyotacms23/attachments/clpgtbm92002gg6aktgguhnjg-lc-300-tech-side-by-side-01-682x460.desktop.jpg",
    },
  },
  hotspots: {
    highlights: [
      { id: "grille", x: "50%", y: "40%", label: "Dynamic Grille", detail: "Aggressive fascia with LED accents" },
      { id: "lights", x: "70%", y: "30%", label: "LED Headlights", detail: "Adaptive bi-beam LEDs" },
    ],
    safety: [
      { id: "airbags", x: "60%", y: "50%", label: "Safety Airbags", detail: "Comprehensive 9-airbag system" },
    ],
    tech1: [
      { id: "display", x: "40%", y: "60%", label: "Info Display", detail: "Side-by-side tech view 1" },
    ],
    tech2: [
      { id: "sensors", x: "60%", y: "40%", label: "Sensors", detail: "Advanced safety sensors" },
    ],
  },
};

type SceneKey = keyof typeof galleryConfig.scenes;
const SCENE_KEYS = Object.keys(galleryConfig.scenes) as SceneKey[];

const ModelImmersiveGallery: React.FC = () => {
  const [currentSceneKey, setCurrentSceneKey] = useState<SceneKey>(SCENE_KEYS[0]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Autoplay scenes
  useEffect(() => {
    const timer = setInterval(() => {
      const idx = SCENE_KEYS.indexOf(currentSceneKey);
      const next = SCENE_KEYS[(idx + 1) % SCENE_KEYS.length];
      setCurrentSceneKey(next);
      setActiveHotspot(null); // reset hotspots
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSceneKey]);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 160); // 8s
    return () => clearInterval(iv);
  }, [currentSceneKey]);

  // Swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const idx = SCENE_KEYS.indexOf(currentSceneKey);
      setCurrentSceneKey(SCENE_KEYS[(idx + 1) % SCENE_KEYS.length]);
    },
    onSwipedRight: () => {
      const idx = SCENE_KEYS.indexOf(currentSceneKey);
      setCurrentSceneKey(SCENE_KEYS[(idx - 1 + SCENE_KEYS.length) % SCENE_KEYS.length]);
    },
  });

  // Parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const parallaxX = useTransform(mouseX, [0, 1], [-30, 30]);
  const parallaxY = useTransform(mouseY, [0, 1], [-15, 15]);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <section
      {...swipeHandlers}
      className="relative w-full h-screen overflow-hidden bg-black text-white"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSceneKey}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={galleryConfig.scenes[currentSceneKey].image}
            alt={currentSceneKey}
            className="w-full h-full object-cover"
            style={{ x: parallaxX, y: parallaxY }}
          />

          {/* Hotspots */}
          {galleryConfig.hotspots[currentSceneKey] &&
            galleryConfig.hotspots[currentSceneKey].map((spot) => (
              <motion.div
                key={spot.id}
                className="absolute"
                style={{ left: spot.x, top: spot.y }}
                whileHover={{ scale: 1.2 }}
              >
                <button
                  onClick={() =>
                    setActiveHotspot(activeHotspot === spot.id ? null : spot.id)
                  }
                  className="w-6 h-6 rounded-full bg-white/80 border border-white shadow-lg"
                />
                <AnimatePresence>
                  {activeHotspot === spot.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-black/70 backdrop-blur-xl rounded-xl shadow-xl w-48"
                    >
                      <h3 className="text-sm font-semibold">{spot.label}</h3>
                      <p className="text-xs opacity-70">{spot.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </motion.div>
      </AnimatePresence>

      {/* Scene Navigator (dots) */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-2">
        {SCENE_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setCurrentSceneKey(key)}
            className={`w-3 h-3 rounded-full transition-all ${
              key === currentSceneKey
                ? "bg-white"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <motion.div
          className="h-1 bg-gradient-to-r from-white to-gray-300"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.2 }}
        />
      </div>

      {/* CTA */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg z-50">
        <Button variant="default" size="lg" className="bg-white/20 text-white hover:bg-white/30">
          Reserve
        </Button>
        <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/20">
          Test Drive
        </Button>
        <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/20">
          Configure
        </Button>
      </div>
    </section>
  );
};

export default ModelImmersiveGallery;
