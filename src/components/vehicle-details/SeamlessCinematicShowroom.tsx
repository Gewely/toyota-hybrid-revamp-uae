"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

// ---------------- CONFIG (Toyota LC300) ----------------
const galleryConfig = {
  vehicleName: "Toyota Land Cruiser LC300",
  heroImage: "https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg",
  secondaryHero: "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg",
  interiorImage: "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-2160.jpg",
  powerImage: "https://media.cdntoyota.co.za/toyotacms23/attachments/clp5594z201l0okak4xj2z22v-lc-300-power-hero-1920x1080.desktop.jpg",
  safetyImage: "https://media.cdntoyota.co.za/toyotacms23/attachments/clsojuxxrb5bwcyak1ignyxsb-lc-300-safety-hero-1920x1080-desktop-with-disclaimer.desktop.jpg",
  techImage1: "https://media.cdntoyota.co.za/toyotacms23/attachments/clpgsz9zr06due4akk95h6lhl-lc-300-tech-side-by-side-02-682x460.desktop.jpg",
  techImage2: "https://media.cdntoyota.co.za/toyotacms23/attachments/clpgtbm92002gg6aktgguhnjg-lc-300-tech-side-by-side-01-682x460.desktop.jpg",
  hotspots: [
    { id: "grille", x: "48%", y: "35%", label: "Dynamic Grille", detail: "Aggressive front fascia with LED accents." },
    { id: "wheels", x: "32%", y: "72%", label: "Alloy Wheels", detail: "Premium 19-inch machined alloy wheels." },
    { id: "lights", x: "70%", y: "30%", label: "LED Headlamps", detail: "Adaptive bi-beam LED technology." },
  ],
};

// ---------------- TYPES ----------------
type SceneType = "hero" | "highlights" | "mood" | "interior" | "ambient" | "lifestyle";
const SCENES: SceneType[] = ["hero", "highlights", "mood", "interior", "ambient", "lifestyle"];

// ---------------- MAIN COMPONENT ----------------
const SeamlessCinematicShowroom: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<SceneType>("hero");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Parallax effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const parallaxX = useTransform(mouseX, [0, 1], [-30, 30]);
  const parallaxY = useTransform(mouseY, [0, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Auto cycle scenes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => {
        const idx = SCENES.indexOf(prev);
        return SCENES[(idx + 1) % SCENES.length];
      });
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen bg-black text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ---------------- HERO SCENE ---------------- */}
        {currentScene === "hero" && (
          <motion.div
            key="hero"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.img
              src={galleryConfig.heroImage}
              alt={galleryConfig.vehicleName}
              className="w-full h-full object-cover absolute inset-0"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            />
            <motion.h1
              className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-wider"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {galleryConfig.vehicleName}
            </motion.h1>
            <motion.p
              className="relative z-10 mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Iconic design. Legendary performance. Built to conquer every journey.
            </motion.p>
            <div className="relative z-10 mt-10 flex gap-6">
              <Button className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-xl border border-white/30">
                Watch Launch Video
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl">
                Explore Specs
              </Button>
            </div>
          </motion.div>
        )}

        {/* ---------------- HIGHLIGHTS SCENE ---------------- */}
        {currentScene === "highlights" && (
          <motion.div
            key="highlights"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={galleryConfig.secondaryHero}
              alt="Highlights"
              className="w-full h-full object-cover absolute inset-0"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
            {galleryConfig.hotspots.map((spot) => (
              <motion.div
                key={spot.id}
                className="absolute"
                style={{ left: spot.x, top: spot.y }}
                whileHover={{ scale: 1.2 }}
              >
                <button
                  onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                  className="w-6 h-6 rounded-full bg-red-600 shadow-lg border-2 border-white"
                />
                <AnimatePresence>
                  {activeHotspot === spot.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-black/80 backdrop-blur-xl rounded-xl w-56"
                    >
                      <h3 className="font-semibold text-lg">{spot.label}</h3>
                      <p className="text-sm text-gray-300">{spot.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SeamlessCinematicShowroom;
      <AnimatePresence mode="wait">
        {/* ---------------- MOOD SCENE ---------------- */}
        {currentScene === "mood" && (
          <motion.div
            key="mood"
            className="absolute inset-0 flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={galleryConfig.powerImage}
              alt="Mood Driving Modes"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <motion.div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
            <motion.h2
              className="relative z-10 text-4xl md:text-6xl font-bold"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Choose Your Drive
            </motion.h2>
            <div className="relative z-10 flex gap-6">
              {["Sport", "Eco", "Urban"].map((mode, i) => (
                <Button
                  key={i}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl"
                >
                  {mode} Mode
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ---------------- INTERIOR SCENE ---------------- */}
        {currentScene === "interior" && (
          <motion.div
            key="interior"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={galleryConfig.interiorImage}
              alt="Interior"
              className="w-full h-full object-cover absolute inset-0"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
            <motion.div
              className="relative z-10 text-center"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold">Luxury Interior</h2>
              <p className="mt-4 text-lg text-gray-200 max-w-xl mx-auto">
                Spacious cabin with advanced comfort and technology features.
              </p>
              <Button className="mt-6 bg-white/20 border border-white/40 px-6 py-3 rounded-xl">
                Explore Interior Features
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* ---------------- AMBIENT SCENE ---------------- */}
        {currentScene === "ambient" && (
          <motion.div
            key="ambient"
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={galleryConfig.techImage1}
              alt="Ambient Lighting"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
            <motion.h2
              className="relative z-10 text-3xl md:text-5xl font-bold"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Ambient Lighting
            </motion.h2>
            <div className="relative z-10 flex gap-4">
              {["Pearl White", "Sunset Orange", "Ocean Blue", "Forest Green"].map(
                (color, idx) => (
                  <button
                    key={idx}
                    className="w-12 h-12 rounded-full border-2 border-white/60 shadow-md"
                    style={{
                      background:
                        idx === 0
                          ? "#f9fafb"
                          : idx === 1
                          ? "linear-gradient(135deg, #fb923c, #ef4444)"
                          : idx === 2
                          ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                          : "linear-gradient(135deg, #22c55e, #065f46)",
                    }}
                  />
                )
              )}
            </div>
          </motion.div>
        )}

        {/* ---------------- LIFESTYLE SCENE ---------------- */}
        {currentScene === "lifestyle" && (
          <motion.div
            key="lifestyle"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={galleryConfig.safetyImage}
              alt="Lifestyle"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ x: parallaxX, y: parallaxY }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
            <motion.h2
              className="relative z-10 text-4xl md:text-6xl font-bold mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Adventure Ready
            </motion.h2>
            <div className="relative z-10 flex gap-6">
              {["City", "Desert", "Weekend"].map((scene, i) => (
                <Button
                  key={i}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl"
                >
                  {scene} Drive
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ---------------- PROGRESS BAR ---------------- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SCENES.map((scene, i) => (
          <button
            key={scene}
            onClick={() => setCurrentScene(scene)}
            className={`h-1.5 rounded-full transition-all ${
              currentScene === scene ? "w-10 bg-red-600" : "w-6 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* ---------------- CTA PANEL ---------------- */}
      <motion.div
        className="absolute top-6 right-6 z-30 flex gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">Reserve</Button>
        <Button className="bg-white/20 border border-white/40 px-4 py-2 rounded-lg text-sm">Test Drive</Button>
        <Button className="bg-white/20 border border-white/40 px-4 py-2 rounded-lg text-sm">Configure</Button>
      </motion.div>

      {/* ---------------- MODALS ---------------- */}
      <AnimatePresence>
        {/* Hero Modal: Video */}
        {currentScene === "hero" && activeHotspot === "heroModal" && (
          <motion.div
            key="heroModal"
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full">
              <video src="/videos/lc300-hero.mp4" autoPlay loop controls className="w-full h-auto" />
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-6 right-6 text-white text-xl"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Highlights Modal: Spec Cards */}
        {currentScene === "highlights" && activeHotspot && (
          <motion.div
            key="highlightModal"
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 max-w-4xl w-full">
              {galleryConfig.hotspots.map((spot) => (
                <motion.div
                  key={spot.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h3 className="text-lg font-bold">{spot.label}</h3>
                  <p className="text-sm text-gray-300">{spot.detail}</p>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-6 right-6 text-white text-xl"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Mood Modal: Cinematic Driving Video */}
        {currentScene === "mood" && activeHotspot === "moodModal" && (
          <motion.div
            key="moodModal"
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <video src="/videos/lc300-mood.mp4" autoPlay loop controls className="rounded-xl shadow-2xl w-full max-w-5xl" />
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-6 right-6 text-white text-xl"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Interior Modal: Image Slider */}
        {currentScene === "interior" && activeHotspot === "interiorModal" && (
          <motion.div
            key="interiorModal"
            className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex gap-4 overflow-x-auto p-6 max-w-5xl">
              {[galleryConfig.interiorImage, galleryConfig.techImage1, galleryConfig.techImage2].map(
                (img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Interior ${i}`}
                    className="w-[400px] h-[260px] object-cover rounded-xl shadow-lg"
                  />
                )
              )}
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-6 right-6 text-white text-xl"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Ambient Modal: Gauges */}
        {currentScene === "ambient" && activeHotspot === "ambientModal" && (
          <motion.div
            key="ambientModal"
            className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-2 gap-6 p-8 max-w-3xl">
              {["Brightness", "Color Depth", "Saturation", "Warmth"].map((gauge, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <h4 className="text-lg font-bold mb-2">{gauge}</h4>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-3 bg-red-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${40 + i * 15}%` }}
                      transition={{ duration: 1.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-6 right-6 text-white text-xl"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Lifestyle Modal: Cards */}
        {currentScene === "lifestyle" && activeHotspot === "lifestyleModal" && (
          <motion.div
            key="lifestyleModal"
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl p-6">
              {[
                { title: "City Drive", img: galleryConfig.secondaryHero, desc: "Refined and confident for the modern road." },
                { title: "Desert Escape", img: galleryConfig.powerImage, desc: "Unstoppable in dunes and rugged terrain." },
                { title: "Weekend Adventure", img: galleryConfig.safetyImage, desc: "Versatile for long trips with family." },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-xl"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <img src={card.img} alt={card.title} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{card.title}</h3>
                    <p className="text-sm text-gray-300">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-6 right-6 text-white text-xl"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SeamlessCinematicShowroom;
