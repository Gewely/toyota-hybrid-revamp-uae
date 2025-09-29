"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Car,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";

interface StoryScene {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundVideo?: "wistia";
  cta?: { label: string; action: () => void; variant?: "primary" | "secondary" };
  stats?: { value: string; label: string; icon?: React.ReactNode }[];
  features?: string[];
}

interface Props {
  setIsBookingOpen: (open: boolean) => void;
  setIsFinanceOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  onInteriorExplore: () => void;
  onConnectivityExplore: () => void;
  heroWistiaVideoId: string;
}

function useWistia(videoId?: string) {
  const playerRef = useRef<any>(null);
  useEffect(() => {
    if (!videoId) return;
    (window as any)._wq = (window as any)._wq || [];
    (window as any)._wq.push({
      id: videoId,
      onReady: (video: any) => {
        playerRef.current = video;
        try {
          video.play();
          video.mute();
          video.loop(true);
        } catch {}
      },
    });
    if (!document.getElementById("wistia-script")) {
      const s = document.createElement("script");
      s.id = "wistia-script";
      s.src = "https://fast.wistia.com/assets/external/E-v1.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [videoId]);

  return {
    mute: () => playerRef.current?.mute(),
    unmute: () => playerRef.current?.unmute(),
  };
}

const StorytellingSection: React.FC<Props> = ({
  setIsBookingOpen,
  setIsFinanceOpen,
  navigate,
  onInteriorExplore,
  onConnectivityExplore,
  heroWistiaVideoId,
}) => {
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { mute, unmute } = useWistia(
    current === 0 ? heroWistiaVideoId : undefined
  );

  const damImages = [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/27c33e82-7b5a-4f89-8e5c-8b9c4c8d5f7a/renditions/e4f5a6b7-8c9d-4e1f-a2b3-c4d5e6f7a8b9?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/f8e9d0c1-b2a3-4c5d-6e7f-a8b9c0d1e2f3/renditions/a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d/renditions/f0e1d2c3-b4a5-968a7-8b9c-0d1e2f3a4b5c?binary=true&mformat=true",
  ];

  const scenes: StoryScene[] = useMemo(
    () => [
      {
        id: "hero",
        title: "Redefine Your Journey",
        subtitle: "Power, efficiency, and innovation in perfect harmony.",
        backgroundImage: damImages[0],
        backgroundVideo: "wistia",
        cta: {
          label: "Reserve Now",
          action: () => setIsBookingOpen(true),
          variant: "primary",
        },
        stats: [
          {
            value: "268",
            label: "Horsepower",
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
          },
          {
            value: "7.1s",
            label: "0–100 km/h",
            icon: <Car className="w-6 h-6 text-blue-400" />,
          },
          {
            value: "850 km",
            label: "Range",
            icon: <Sparkles className="w-6 h-6 text-green-400" />,
          },
          {
            value: "5★",
            label: "Safety",
            icon: <Shield className="w-6 h-6 text-red-400" />,
          },
        ],
      },
      {
        id: "interior",
        title: "Luxury Redefined",
        subtitle: "Comfort meets cutting-edge technology.",
        backgroundImage: damImages[1],
        cta: {
          label: "Experience Interior",
          action: onInteriorExplore,
          variant: "primary",
        },
        features: ["Premium Leather", "Ambient Lighting", "Panoramic Roof", "JBL Audio"],
      },
      {
        id: "technology",
        title: "Innovation at Your Fingertips",
        subtitle: "Smart features for the modern driver.",
        backgroundImage: damImages[2],
        cta: {
          label: "Discover Tech",
          action: onConnectivityExplore,
          variant: "secondary",
        },
        features: ["Hybrid Drive", "Safety Sense", "Connected Services", "Wireless Charging"],
      },
      {
        id: "finance",
        title: "Smart Finance Options",
        subtitle: "Flexible plans tailored to your journey.",
        backgroundImage: damImages[3],
        cta: {
          label: "Explore Finance",
          action: () => setIsFinanceOpen(true),
          variant: "secondary",
        },
      },
    ],
    [damImages, onInteriorExplore, onConnectivityExplore, setIsBookingOpen, setIsFinanceOpen]
  );

  /* Scroll-jacking logic */
  const isLocked = current < scenes.length - 1;
  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (!isLocked || isTransitioning) return;
      e.preventDefault();
      setIsTransitioning(true);
      setCurrent((c) => {
        const dir = e.deltaY > 0 ? 1 : -1;
        return Math.min(Math.max(c + dir, 0), scenes.length - 1);
      });
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isLocked, isTransitioning, scenes.length]
  );

  useEffect(() => {
    if (isLocked) {
      window.addEventListener("wheel", onWheel, { passive: false });
    }
    return () => window.removeEventListener("wheel", onWheel as any);
  }, [isLocked, onWheel]);

  useEffect(() => {
    if (isMuted) mute();
    else unmute();
  }, [isMuted, mute, unmute]);

  const active = scenes[current];
  const progress = ((current + 1) / scenes.length) * 100;

  return (
    <section className="relative h-screen overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.6 }}
        >
          {active.backgroundVideo === "wistia" ? (
            <div className="absolute inset-0">
              <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <div
                  className={`wistia_embed wistia_async_${heroWistiaVideoId} videoFoam=true`}
                  style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
                />
              </div>
            </div>
          ) : (
            <img
              src={active.backgroundImage}
              alt={active.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-10 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-extralight mb-4">{active.title}</h2>
          <p className="text-base md:text-2xl text-white/90 mb-6">{active.subtitle}</p>

          {active.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {active.stats.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-center mb-2">{s.icon}</div>
                  <div className="text-xl md:text-3xl">{s.value}</div>
                  <div className="text-sm text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {active.features && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {active.features.map((f, i) => (
                <Badge key={i} className="bg-white/10 border border-white/20 backdrop-blur-sm">
                  {f}
                </Badge>
              ))}
            </div>
          )}

          {active.cta && (
            <Button
              onClick={active.cta.action}
              className={`px-6 py-3 ${
                active.cta.variant === "primary"
                  ? "bg-white text-black hover:bg-white/90"
                  : "border border-white/40 text-white hover:bg-white/10"
              }`}
            >
              {active.cta.label}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Sound toggle */}
      {active.backgroundVideo === "wistia" && (
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="absolute top-6 left-6 z-20 bg-black/50 p-2 rounded-full"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {scenes.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "bg-white w-8" : "bg-white/40 hover:bg-white/60 w-2"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-red-600 z-20"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4 }}
      />

      {/* Scroll hint */}
      {current === 0 && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-white/80 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="mb-2">Scroll to explore</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <ChevronDown className="w-6 h-6 mx-auto" />
          </motion.div>
        </motion.div>
      )}

      {/* Load wistia JSONP for hero */}
      {active.backgroundVideo === "wistia" && heroWistiaVideoId && (
        <script async src={`https://fast.wistia.com/embed/medias/${heroWistiaVideoId}.jsonp`} />
      )}
    </section>
  );
};

export default StorytellingSection;
