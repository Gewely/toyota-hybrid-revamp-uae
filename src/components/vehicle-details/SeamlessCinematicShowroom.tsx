"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "@/hooks/use-swipeable";

/**
 * CONFIG — Toyota Land Cruiser 300 Scenes
 */
const galleryConfig = {
  vehicleName: "Toyota Land Cruiser 300",
  scenes: {
    hero: {
      title: "Design",
      subtitle: "Sculpted strength with elegance",
      image:
        "https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg",
    },
    highlights: {
      title: "Highlights",
      subtitle: "Every detail crafted for presence",
      image:
        "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg",
    },
    exterior: {
      title: "Exterior",
      subtitle: "Commanding stance, unmistakable Toyota DNA",
      image:
        "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-2160.jpg",
    },
    power: {
      title: "Performance",
      subtitle: "Unstoppable power, refined control",
      image:
        "https://media.cdntoyota.co.za/toyotacms23/attachments/clp5594z201l0okak4xj2z22v-lc-300-power-hero-1920x1080.desktop.jpg",
    },
    safety: {
      title: "Safety",
      subtitle: "Advanced protection for every journey",
      image:
        "https://media.cdntoyota.co.za/toyotacms23/attachments/clsojuxxrb5bwcyak1ignyxsb-lc-300-safety-hero-1920x1080-desktop-with-disclaimer.desktop.jpg",
    },
    tech1: {
      title: "Technology",
      subtitle: "Smart features for seamless driving",
      image:
        "https://media.cdntoyota.co.za/toyotacms23/attachments/clpgsz9zr06due4akk95h6lhl-lc-300-tech-side-by-side-02-682x460.desktop.jpg",
    },
    tech2: {
      title: "Technology",
      subtitle: "Innovation that enhances every drive",
      image:
        "https://media.cdntoyota.co.za/toyotacms23/attachments/clpgtbm92002gg6aktgguhnjg-lc-300-tech-side-by-side-01-682x460.desktop.jpg",
    },
  },
  hotspots: {
    highlights: [
      {
        id: "grille",
        x: "50%",
        y: "40%",
        label: "Dynamic Grille",
        detail: "Aggressive fascia with LED accents",
      },
      {
        id: "lights",
        x: "70%",
        y: "30%",
        label: "LED Headlights",
        detail: "Adaptive bi-beam LEDs",
      },
    ],
    safety: [
      {
        id: "airbags",
        x: "60%",
        y: "50%",
        label: "Safety Airbags",
        detail: "Comprehensive 9-airbag system",
      },
    ],
  },
};

type SceneKey = keyof typeof galleryConfig.scenes;
const SCENE_KEYS = Object.keys(galleryConfig.scenes) as SceneKey[];

const ModelImmersiveGallery: React.FC = () => {
  const [currentSceneKey, setCurrentSceneKey] = useState<SceneKey>(SCENE_KEYS[0]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Autoplay (8s per scene)
  useEffect(() => {
    const timer = setInterval(() => {
      const idx = SCENE_KEYS.indexOf(currentSceneKey);
      const next = SCENE_KEYS[(idx + 1) % SCENE_KEYS.length];
      setCurrentSceneKey(next);
      setActiveHotspot(null);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSceneKey]);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 160);
    return () => clearInterval(iv);
  }, [currentSceneKey]);

  // Swipe (mobile)
  const swipeHandlers = useSwipeable({
    onSwipeLeft: () => {
      const idx = SCENE_KEYS.indexOf(currentSceneKey);
      setCurrentSceneKey(SCENE_KEYS[(idx + 1) % SCENE_KEYS.length]);
    },
    onSwipeRight: () => {
      const idx = SCENE_KEYS.indexOf(currentSceneKey);
      setCurrentSceneKey(
        SCENE_KEYS[(idx - 1 + SCENE_KEYS.length) % SCENE_KEYS.length]
      );
    },
    threshold: 50,
  });

  // Parallax (desktop hover)
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
          {/* Scene Background */}
          <motion.img
            src={galleryConfig.scenes[currentSceneKey].image}
            alt={currentSceneKey}
            className="w-full h-full object-cover"
            style={{ x: parallaxX, y: parallaxY }}
          />

          {/* Scene Overlay Title */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-serif tracking-wide drop-shadow-xl"
            >
              {galleryConfig.scenes[currentSceneKey].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-2xl opacity-80"
            >
              {galleryConfig.scenes[currentSceneKey].subtitle}
            </motion.p>
          </div>

          {/* Hotspots with HUD animation */}
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
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-10 top-1/2 -translate-y-1/2 px-4 py-3 bg-gradient-to-br from-black/70 to-black/40 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-56"
                    >
                      <h3 className="text-sm font-semibold">{spot.label}</h3>
                      <p className="text-xs opacity-80">{spot.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </motion.div>
      </AnimatePresence>

      {/* Thumbnail Navigator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {SCENE_KEYS.map((key) => (
          <motion.button
            key={key}
            onClick={() => setCurrentSceneKey(key)}
            whileHover={{ scale: 1.05 }}
            className={`w-20 h-12 rounded-md overflow-hidden border-2 ${
              key === currentSceneKey ? "border-white" : "border-white/30"
            }`}
          >
            <img
              src={galleryConfig.scenes[key].image}
              alt={key}
              className="w-full h-full object-cover"
            />
          </motion.button>
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

      {/* Floating CTA */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg z-50">
        <Button
          variant="default"
          size="lg"
          className="bg-white/20 text-white hover:bg-white/30"
        >
          Reserve
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-white border-white/40 hover:bg-white/20"
        >
          Test Drive
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-white border-white/40 hover:bg-white/20"
        >
          Configure
        </Button>
      </div>
    </section>
  );
};

export default ModelImmersiveGallery;
