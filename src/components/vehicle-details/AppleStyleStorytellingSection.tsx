"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Car,
  Zap,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StoryScene {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundVideo?: string;
  cta?: {
    label: string;
    action: () => void;
    variant?: "primary" | "secondary";
  };
  stats?: { value: number; label: string; icon?: React.ReactNode }[];
  features?: string[];
}

interface Props {
  setIsBookingOpen: (open: boolean) => void;
  setIsFinanceOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  onInteriorExplore: () => void;
  onConnectivityExplore: () => void;
}

const StorytellingSection: React.FC<Props> = ({
  setIsBookingOpen,
  setIsFinanceOpen,
  navigate,
  onInteriorExplore,
  onConnectivityExplore,
}) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [scrolling, setScrolling] = useState(false);

  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  /* Parallax */
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 300], [0, -60]);

  /* Animated counters */
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);

  const animateCounters = (stats?: { value: number }[]) => {
    if (!stats) return;
    let frame = 0;
    const duration = 60; // ~1s at 60fps
    const values = stats.map(() => 0);
    const animate = () => {
      frame++;
      const progress = Math.min(frame / duration, 1);
      const newValues = stats.map((stat, i) =>
        Math.floor(stat.value * progress)
      );
      setAnimatedValues(newValues);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    animateCounters(scenes[currentScene].stats);
  }, [currentScene]);

  /* Scroll lock */
  const handleScroll = useCallback(
    (deltaY: number) => {
      if (scrolling) return;
      setScrolling(true);

      if (deltaY > 0 && currentScene < scenes.length - 1) {
        setCurrentScene((s) => s + 1);
      } else if (deltaY < 0 && currentScene > 0) {
        setCurrentScene((s) => s - 1);
      }

      setTimeout(() => setScrolling(false), 1000);
    },
    [scrolling, currentScene]
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    };
    if (currentScene < scenes.length - 1) {
      window.addEventListener("wheel", onWheel, { passive: false });
    }
    return () => window.removeEventListener("wheel", onWheel);
  }, [currentScene, handleScroll]);

  /* Scenes with DAM images & video */
  const scenes: StoryScene[] = [
    {
      id: "hero",
      title: "Redefine Your Journey",
      subtitle: "Experience the harmony of power, efficiency, and innovation",
      backgroundImage:
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa.../hero-poster.jpg",
      backgroundVideo:
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa.../hero-video.mp4",
      cta: {
        label: "Reserve Now",
        action: () => setIsBookingOpen(true),
        variant: "primary",
      },
      stats: [
        { value: 268, label: "Horsepower", icon: <Zap className="w-6 h-6 text-yellow-400" /> },
        { value: 7, label: "0-100 km/h (s)", icon: <Car className="w-6 h-6 text-blue-400" /> },
        { value: 850, label: "Range (km)", icon: <Sparkles className="w-6 h-6 text-green-400" /> },
        { value: 5, label: "Safety ★", icon: <Shield className="w-6 h-6 text-red-400" /> },
      ],
    },
    {
      id: "interior",
      title: "Luxury Redefined",
      subtitle: "Step into a world of comfort & cutting-edge technology",
      backgroundImage:
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa.../interior.jpg",
      cta: {
        label: "Explore Interior",
        action: onInteriorExplore,
        variant: "secondary",
      },
      features: ["Premium Leather", "Ambient Lighting", "Panoramic Roof", "Premium Audio"],
    },
    {
      id: "technology",
      title: "Innovation at Your Fingertips",
      subtitle: "Smart features that enhance every drive",
      backgroundImage:
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa.../tech.jpg",
      cta: {
        label: "Discover Tech",
        action: onConnectivityExplore,
        variant: "primary",
      },
      features: ["Hybrid Drive", "Safety Sense", "Connected Services", "Wireless Charging"],
    },
    {
      id: "finance",
      title: "Smart Finance Options",
      subtitle: "Tailored solutions for your journey",
      backgroundImage:
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa.../finance.jpg",
      cta: {
        label: "Explore Finance",
        action: () => setIsFinanceOpen(true),
        variant: "secondary",
      },
    },
  ];

  const progress = ((currentScene + 1) / scenes.length) * 100;

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={scenes[currentScene].id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {scenes[currentScene].backgroundVideo && !reducedMotion ? (
            <motion.video
              style={{ y: yParallax }}
              className="w-full h-full object-cover"
              src={scenes[currentScene].backgroundVideo}
              poster={scenes[currentScene].backgroundImage}
              muted={isMuted}
              autoPlay
              loop
              playsInline
            />
          ) : (
            <motion.img
              style={{ y: yParallax }}
              src={scenes[currentScene].backgroundImage}
              alt={scenes[currentScene].title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full px-6 text-center">
        <motion.h2
          key={scenes[currentScene].title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-light mb-4"
        >
          {scenes[currentScene].title}
        </motion.h2>
        <motion.p
          key={scenes[currentScene].subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-white/80 mb-6"
        >
          {scenes[currentScene].subtitle}
        </motion.p>

        {scenes[currentScene].stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {scenes[currentScene].stats.map((stat, i) => (
              <div key={i}>
                <div>{stat.icon}</div>
                <p className="text-2xl md:text-3xl">
                  {animatedValues[i] ?? 0}
                  {stat.label.includes("★") ? "★" : ""}
                </p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {scenes[currentScene].features && (
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {scenes[currentScene].features.map((f, i) => (
              <Badge
                key={i}
                className="bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2"
              >
                {f}
              </Badge>
            ))}
          </div>
        )}

        {scenes[currentScene].cta && (
          <Button
            onClick={scenes[currentScene].cta.action}
            className={`px-6 py-3 backdrop-blur-md ${
              scenes[currentScene].cta.variant === "primary"
                ? "bg-white text-black hover:bg-white/90"
                : "border border-white/40 text-white hover:bg-white/10"
            }`}
          >
            {scenes[currentScene].cta.label}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Sound toggle */}
      {scenes[currentScene].backgroundVideo && (
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="absolute top-6 left-6 z-30 bg-black/50 p-2 rounded-full"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* Scroll hint */}
      {currentScene === 0 && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Scroll to explore</p>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-6 h-6 mx-auto" />
          </motion.div>
        </motion.div>
      )}

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-red-600"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4 }}
      />
    </section>
  );
};

export default StorytellingSection;
