"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { Car, Zap, Shield, Sparkles, ChevronRight, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* -------------------------------
   Interfaces
--------------------------------*/
interface StoryScene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundVideo?: string;
  cta?: {
    label: string;
    action: () => void;
    variant?: "primary" | "secondary" | "ghost";
  };
  stats?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  features?: string[];
}

interface StorytellingProps {
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
  onSafetyExplore: () => void;
  onConnectivityExplore: () => void;
  onHybridTechExplore: () => void;
  onInteriorExplore: () => void;
  galleryImages?: string[];
}

/* -------------------------------
   Progress Dots
--------------------------------*/
const ProgressDots: React.FC<{
  scenes: StoryScene[];
  currentIndex: number;
  onSceneSelect: (index: number) => void;
}> = ({ scenes, currentIndex, onSceneSelect }) => (
  <div className="flex justify-center space-x-3" role="tablist" aria-label="Story navigation">
    {scenes.map((scene, index) => (
      <button
        key={scene.id}
        role="tab"
        aria-selected={index === currentIndex}
        aria-label={`Go to scene ${index + 1}: ${scene.title}`}
        className={`h-2 rounded-full transition-all duration-300 ${
          index === currentIndex ? "bg-white w-8" : "bg-white/40 hover:bg-white/60 w-2"
        }`}
        onClick={() => onSceneSelect(index)}
      />
    ))}
  </div>
);

/* -------------------------------
   Scene Media
--------------------------------*/
const SceneMedia: React.FC<{ scene: StoryScene; isActive: boolean; isMuted: boolean }> = ({
  scene,
  isActive,
  isMuted,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scene.backgroundVideo && isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [isActive, scene.backgroundVideo]);

  return (
    <div className="absolute inset-0">
      {scene.backgroundVideo && !shouldReduceMotion ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={scene.backgroundImage}
          muted={isMuted}
          loop
          playsInline
        >
          <source src={scene.backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <img src={scene.backgroundImage} alt={scene.title} className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/40" />
    </div>
  );
};

/* -------------------------------
   Scene Content
--------------------------------*/
const SceneContent: React.FC<{ scene: StoryScene; isActive: boolean }> = ({ scene, isActive }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="relative z-20 h-full flex items-center justify-center"
      initial={{ opacity: 0, y: 40 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <div className="max-w-5xl mx-auto px-6 text-center text-white">
        <motion.h2
          className="text-4xl md:text-6xl font-extralight tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          {scene.title}
        </motion.h2>

        <motion.p
          className="text-lg md:text-2xl text-white/90 mb-8 font-light max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          {scene.subtitle}
        </motion.p>

        {scene.stats && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            {scene.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <motion.div
                  className="text-2xl md:text-3xl font-light"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {scene.features && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            {scene.features.map((feature, i) => (
              <Badge key={i} className="bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition">
                {feature}
              </Badge>
            ))}
          </motion.div>
        )}

        {scene.cta && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ delay: 0.6 }}>
            <Button
              onClick={scene.cta.action}
              size="lg"
              className={`px-8 py-3 min-w-[200px] transition-transform duration-200 hover:scale-105 ${
                scene.cta.variant === "primary"
                  ? "bg-white text-black hover:bg-white/90"
                  : "border border-white/40 text-white hover:bg-white/10"
              }`}
            >
              {scene.cta.label}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/* -------------------------------
   Main Storytelling Section
--------------------------------*/
const StorytellingSection: React.FC<StorytellingProps> = ({
  setIsBookingOpen,
  navigate,
  onInteriorExplore,
  onConnectivityExplore,
  galleryImages = [],
}) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  /* DAM images */
  const damImages = [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/27c33e82-7b5a-4f89-8e5c-8b9c4c8d5f7a/renditions/e4f5a6b7-8c9d-4e1f-a2b3-c4d5e6f7a8b9?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/f8e9d0c1-b2a3-4c5d-6e7f-a8b9c0d1e2f3/renditions/a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d/renditions/f0e1d2c3-b4a5-968a7-8b9c-0d1e2f3a4b5c?binary=true&mformat=true",
  ];
  const usedImages = galleryImages.length ? galleryImages : damImages;

  /* Story Scenes */
  const storyScenes: StoryScene[] = useMemo(
    () => [
      {
        id: "hero",
        title: "Redefine Your Journey",
        subtitle: "Experience the perfect harmony of power, efficiency, and innovation.",
        backgroundImage: usedImages[0],
        backgroundVideo: "/videos/hero.mp4", // Example video (replace with DAM link if available)
        cta: {
          label: "Reserve Now",
          action: () => setIsBookingOpen(true),
          variant: "primary",
        },
        stats: [
          { value: "268", label: "Horsepower", icon: <Zap className="w-6 h-6 text-yellow-400" /> },
          { value: "7.1s", label: "0-100 km/h", icon: <Car className="w-6 h-6 text-blue-400" /> },
          { value: "850km", label: "Range", icon: <Sparkles className="w-6 h-6 text-green-400" /> },
          { value: "5★", label: "Safety", icon: <Shield className="w-6 h-6 text-red-400" /> },
        ],
      },
      {
        id: "interior",
        title: "Luxury Redefined",
        subtitle: "Step into a world where comfort meets technology.",
        backgroundImage: usedImages[2],
        cta: {
          label: "Experience Interior",
          action: onInteriorExplore,
          variant: "primary",
        },
        features: ["Premium Leather", "Ambient Lighting", "Panoramic Roof", "Premium Audio"],
      },
      {
        id: "technology",
        title: "Innovation at Your Fingertips",
        subtitle: "Advanced technology that anticipates your needs.",
        backgroundImage: usedImages[3],
        cta: {
          label: "Discover Tech",
          action: onConnectivityExplore,
          variant: "secondary",
        },
        features: ["Hybrid Synergy Drive", "Safety Sense", "Connected Services", "Wireless Charging"],
      },
    ],
    [usedImages, setIsBookingOpen, onInteriorExplore, onConnectivityExplore]
  );

  /* -------------------------------
     Scroll-jacking logic
  --------------------------------*/
  const isLocked = currentScene < storyScenes.length - 1;

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isLocked) return;
      e.preventDefault();
      if (e.deltaY > 0 && currentScene < storyScenes.length - 1) {
        setCurrentScene((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentScene > 0) {
        setCurrentScene((prev) => prev - 1);
      }
    },
    [currentScene, isLocked, storyScenes.length]
  );

  const handleTouch = useRef<{ startY: number | null }>({ startY: null });

  const onTouchStart = (e: TouchEvent) => {
    handleTouch.current.startY = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!isLocked) return;
    if (handleTouch.current.startY === null) return;
    const deltaY = handleTouch.current.startY - e.changedTouches[0].clientY;
    if (deltaY > 50 && currentScene < storyScenes.length - 1) {
      setCurrentScene((prev) => prev + 1);
    } else if (deltaY < -50 && currentScene > 0) {
      setCurrentScene((prev) => prev - 1);
    }
    handleTouch.current.startY = null;
  };

  useEffect(() => {
    if (isLocked) {
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
    } else {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleWheel, isLocked]);

  /* Progress bar width */
  const progress = ((currentScene + 1) / storyScenes.length) * 100;

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-black" role="region" aria-label="Cinematic automotive storytelling">
      <AnimatePresence mode="wait">
        {storyScenes.map(
          (scene, i) =>
            i === currentScene && (
              <motion.div
                key={scene.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <SceneMedia scene={scene} isActive={i === currentScene} isMuted={isMuted} />
              </motion.div>
            )
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-10">
        {storyScenes.map((scene, i) => (
          <SceneContent key={scene.id} scene={scene} isActive={i === currentScene} />
        ))}
      </div>

      {/* Sound Toggle */}
      {storyScenes[currentScene]?.backgroundVideo && (
        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="absolute top-8 left-8 z-30 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      )}

      {/* Progress + Counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <ProgressDots scenes={storyScenes} currentIndex={currentScene} onSceneSelect={setCurrentScene} />
      </div>
      <div className="absolute top-8 right-8 z-30 text-white/70 text-sm">
        {currentScene + 1} / {storyScenes.length}
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-red-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Scroll Hint */}
      {currentScene === 0 && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="mb-2">Scroll to explore</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-6 h-6 mx-auto text-white/80" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default StorytellingSection;
