"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Gauge, Route, Activity, Scan, X, Camera, Radar, Radio } from "lucide-react";
import { adasTokens } from "./adasTokens";

type FeatureIcon = "AlertTriangle" | "Gauge" | "Route" | "Activity" | "Scan";
type SensorType = "camera" | "radar" | "sonar" | "ultrasonic";

export interface SplitSystemADASProps {
  theme?: "light" | "dark";
  brand?: Partial<typeof adasTokens.color>;
  media?: {
    sourceType: "video" | "image";
    src?: string;
    poster?: string;
    alt?: string;
  };
  features?: { id: string; label: string; icon?: FeatureIcon }[];
  microClips?: { id: string; title: string; thumb?: string; loopSrc?: string }[];
  sensors?: {
    pins: {
      id: string;
      label: string;
      type: SensorType;
      side: "front" | "rear" | "rear-left" | "rear-right";
    }[];
  };
  bullets?: string[];
  compareNudge?: string;
  onAction?: (evt: { type: "chip" | "clip" | "sensor" | "lightbox"; id?: string }) => void;
}

const iconMap = {
  AlertTriangle,
  Gauge,
  Route,
  Activity,
  Scan,
};

const sensorIconMap = {
  camera: Camera,
  radar: Radar,
  sonar: Radio,
  ultrasonic: Radio,
};

const defaultProps: SplitSystemADASProps = {
  theme: "light",
  media: {
    sourceType: "image",
    poster: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect fill='%23E6E8EC' width='800' height='450'/%3E%3Ctext x='400' y='225' font-family='sans-serif' font-size='24' fill='%23475569' text-anchor='middle'%3EADAS View%3C/text%3E%3C/svg%3E",
    alt: "ADAS System View",
  },
  features: [
    { id: "pre-collision", label: "Pre-Collision", icon: "AlertTriangle" },
    { id: "adaptive-cruise", label: "Adaptive Cruise", icon: "Gauge" },
    { id: "lane-trace", label: "Lane Trace", icon: "Route" },
  ],
  microClips: [
    { id: "pedestrian", title: "Pedestrian Detect", thumb: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 224 128'%3E%3Crect fill='%23F7F7F7' width='224' height='128'/%3E%3Ccircle cx='112' cy='64' r='30' fill='%231BBE7A'/%3E%3C/svg%3E" },
    { id: "acc-gap", title: "ACC Gap Set", thumb: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 224 128'%3E%3Crect fill='%23F7F7F7' width='224' height='128'/%3E%3Crect x='62' y='44' width='100' height='40' fill='%2319B5F1' rx='8'/%3E%3C/svg%3E" },
    { id: "lane-assist", title: "Lane Assist", thumb: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 224 128'%3E%3Crect fill='%23F7F7F7' width='224' height='128'/%3E%3Cpath d='M 50 100 Q 112 20 174 100' stroke='%23F4A70D' stroke-width='4' fill='none'/%3E%3C/svg%3E" },
  ],
  sensors: {
    pins: [
      { id: "cam-front", label: "Front Camera", type: "camera", side: "front" },
      { id: "rad-front", label: "Front Radar", type: "radar", side: "front" },
      { id: "son-rl", label: "Rear-Left Sonar", type: "sonar", side: "rear-left" },
      { id: "son-rr", label: "Rear-Right Sonar", type: "sonar", side: "rear-right" },
    ],
  },
  bullets: [
    "Helps reduce low-speed frontal collisions in city traffic.",
    "Keeps your set gap to the car ahead on highways.",
    "Assists lane centering on marked roads.",
  ],
  compareNudge: "This trim adds Blind-Spot Monitor",
};

export default function SplitSystemADAS(props?: SplitSystemADASProps) {
  const mergedProps = { ...defaultProps, ...(props || {}) };
  const { theme = "light", media, features, microClips, sensors, bullets, compareNudge, onAction } = mergedProps;
  
  const colors = theme === "dark" ? adasTokens.color.dark : adasTokens.color.light;
  const [activeFeature, setActiveFeature] = useState(features[0]?.id || "pre-collision");
  const [hoveredSensor, setHoveredSensor] = useState<string | null>(null);
  const [lightboxClip, setLightboxClip] = useState<string | null>(null);
  const [focusedClip, setFocusedClip] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          },
          { threshold: 0.5 }
        );
        observer.observe(video);
        return () => observer.disconnect();
      }
    });
  }, [microClips]);

  const handleChipClick = (id: string) => {
    setActiveFeature(id);
    const clipIndex = features.findIndex((f) => f.id === id);
    if (clipIndex >= 0 && microClips[clipIndex]) {
      setFocusedClip(microClips[clipIndex].id);
      setTimeout(() => setFocusedClip(null), 600);
    }
    onAction?.({ type: "chip", id });
  };

  const handleClipClick = (id: string) => {
    setLightboxClip(id);
    onAction?.({ type: "clip", id });
  };

  const handleSensorHover = (id: string | null) => {
    setHoveredSensor(id);
    onAction?.({ type: "sensor", id: id || undefined });
  };

  const closeLightbox = () => {
    setLightboxClip(null);
    onAction?.({ type: "lightbox" });
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: colors.surface }}>
      <div className={`${adasTokens.grid.max} mx-auto p-6 md:p-10`}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left 60% - MediaHero */}
          <div className={`w-full ${adasTokens.grid.colLeft}`}>
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden" style={{ backgroundColor: colors.border }}>
              {media.sourceType === "video" && media.src ? (
                <video
                  className="w-full h-full object-cover"
                  src={media.src}
                  poster={media.poster}
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="metadata"
                  aria-label={media.alt}
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={media.poster}
                  alt={media.alt || "ADAS View"}
                />
              )}

              {/* SVG Overlay */}
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 800 450"
                role="img"
                aria-label={`${activeFeature} visualization`}
              >
                {/* Lane lines */}
                <motion.line
                  x1="250"
                  y1="450"
                  x2="280"
                  y2="0"
                  stroke={colors.adasLine}
                  strokeWidth="2"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.line
                  x1="550"
                  y1="450"
                  x2="520"
                  y2="0"
                  stroke={colors.adasLine}
                  strokeWidth="2"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4 }}
                />

                {activeFeature === "pre-collision" && (
                  <motion.path
                    d="M 400 450 L 300 200 L 500 200 Z"
                    fill={colors.adasBlue}
                    stroke={colors.adasLine}
                    strokeWidth="2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                {activeFeature === "adaptive-cruise" && (
                  <motion.rect
                    x="300"
                    y="150"
                    width="200"
                    height="100"
                    rx="20"
                    fill={colors.adasBlue}
                    stroke={colors.adasLine}
                    strokeWidth="2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                {activeFeature === "lane-trace" && (
                  <>
                    <motion.path
                      d="M 250 450 Q 280 225 280 0"
                      fill="none"
                      stroke={colors.adasLine}
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.path
                      d="M 550 450 Q 520 225 520 0"
                      fill="none"
                      stroke={colors.adasLine}
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </>
                )}

                {/* Sensor hover pulse */}
                {hoveredSensor && (
                  <motion.circle
                    cx="400"
                    cy="350"
                    r="60"
                    fill={colors.adasBlue}
                    stroke={colors.adasLine}
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.svg>

              {/* HUD */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white font-mono">
                <span className="text-2xl font-bold drop-shadow-lg">65</span>
                <div className="flex gap-1">
                  <div className="w-2 h-6 bg-green-400 rounded-sm" />
                  <div className="w-2 h-6 bg-green-400 rounded-sm" />
                  <div className="w-2 h-6 bg-yellow-400 rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Right 40% - System Stack */}
          <div className={`w-full ${adasTokens.grid.colRight} space-y-6`}>
            {/* ProofBar */}
            <div className="flex flex-wrap gap-2">
              {features.map((feature, idx) => {
                const Icon = feature.icon ? iconMap[feature.icon] : Activity;
                const isActive = activeFeature === feature.id;
                return (
                  <button
                    key={feature.id}
                    onClick={() => handleChipClick(feature.id)}
                    onKeyDown={(e) => handleKeyDown(e, () => handleChipClick(feature.id))}
                    aria-pressed={isActive}
                    className="flex items-center gap-2 h-9 px-4 rounded-full border transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? colors.chipHover : "transparent",
                      borderColor: colors.border,
                      color: isActive ? colors.ink : colors.muted,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = colors.chipHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Icon size={16} />
                    <span className={adasTokens.type.cap}>{feature.label}</span>
                  </button>
                );
              })}
            </div>

            {/* DemoUI Rail */}
            <div className="grid grid-cols-3 gap-3">
              {microClips.slice(0, 3).map((clip, idx) => {
                const Icon = idx === 0 ? AlertTriangle : idx === 1 ? Gauge : Route;
                const isFocused = focusedClip === clip.id;
                return (
                  <motion.button
                    key={clip.id}
                    onClick={() => handleClipClick(clip.id)}
                    onKeyDown={(e) => handleKeyDown(e, () => handleClipClick(clip.id))}
                    className="relative w-full aspect-[224/128] rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      backgroundColor: colors.surface,
                      boxShadow: `0 6px 24px ${colors.cardShadow}`,
                    }}
                    animate={isFocused ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {clip.loopSrc ? (
                      <video
                        ref={(el) => (videoRefs.current[clip.id] = el)}
                        className="w-full h-full object-cover"
                        src={clip.loopSrc}
                        muted
                        playsInline
                        loop
                        preload="metadata"
                      />
                    ) : (
                      <img src={clip.thumb} alt={clip.title} className="w-full h-full object-cover" />
                    )}
                    <div
                      className="absolute top-0 left-0 right-0 h-6 flex items-center px-2"
                      style={{ backgroundColor: colors.border }}
                    >
                      <Icon size={12} style={{ color: colors.muted }} />
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 p-2 text-left"
                      style={{ backgroundColor: colors.surface, color: colors.ink }}
                    >
                      <p className={adasTokens.type.cap}>{clip.title}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* SensorMap */}
            <div
              className="relative w-full h-[420px] rounded-2xl p-6"
              style={{
                backgroundColor: colors.surface,
                boxShadow: `0 6px 24px ${colors.cardShadow}`,
              }}
            >
              <svg viewBox="0 0 280 360" className="w-full h-full">
                {/* Car body */}
                <rect x="80" y="120" width="120" height="180" rx="20" fill={colors.border} />
                <rect x="90" y="140" width="100" height="140" rx="10" fill={colors.surface} />

                {/* Sensors */}
                {sensors.pins.map((pin) => {
                  const SensorIcon = sensorIconMap[pin.type];
                  let x = 140,
                    y = 200;
                  if (pin.side === "front") {
                    y = 100;
                  } else if (pin.side === "rear") {
                    y = 320;
                  } else if (pin.side === "rear-left") {
                    x = 70;
                    y = 280;
                  } else if (pin.side === "rear-right") {
                    x = 210;
                    y = 280;
                  }

                  const pinColor =
                    pin.type === "camera"
                      ? colors.sensorGreen
                      : pin.type === "radar"
                      ? colors.sensorCyan
                      : colors.sensorAmber;

                  return (
                    <g key={pin.id}>
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill={pinColor}
                        className="cursor-pointer"
                        onMouseEnter={() => handleSensorHover(pin.id)}
                        onMouseLeave={() => handleSensorHover(null)}
                        animate={hoveredSensor === pin.id ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      {pin.type === "camera" && (
                        <motion.path
                          d={`M ${x} ${y} L ${x - 20} ${y - 30} L ${x + 20} ${y - 30} Z`}
                          fill={pinColor}
                          opacity="0.2"
                          animate={hoveredSensor === pin.id ? { opacity: [0.2, 0.4, 0.2] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                      {pin.type === "radar" && (
                        <motion.path
                          d={`M ${x} ${y} Q ${x - 25} ${y - 25} ${x - 30} ${y - 40} L ${x + 30} ${y - 40} Q ${x + 25} ${y - 25} ${x} ${y} Z`}
                          fill={pinColor}
                          opacity="0.2"
                          animate={hoveredSensor === pin.id ? { opacity: [0.2, 0.4, 0.2] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.sensorGreen }} />
                  <span className={adasTokens.type.cap} style={{ color: colors.muted }}>
                    Camera
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.sensorCyan }} />
                  <span className={adasTokens.type.cap} style={{ color: colors.muted }}>
                    Radar
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.sensorAmber }} />
                  <span className={adasTokens.type.cap} style={{ color: colors.muted }}>
                    Sonar
                  </span>
                </div>
              </div>
            </div>

            {/* Bullets3 */}
            <ul className="space-y-2">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: colors.muted }} />
                  <p className={adasTokens.type.body} style={{ color: colors.ink }}>
                    {bullet}
                  </p>
                </li>
              ))}
            </ul>

            {/* CompareNudge */}
            {compareNudge && (
              <div
                className="px-4 py-3 rounded-full text-center"
                style={{ backgroundColor: colors.border, color: colors.muted }}
              >
                <p className={adasTokens.type.cap}>{compareNudge}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxClip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeLightbox}
            onKeyDown={(e) => e.key === "Escape" && closeLightbox()}
            tabIndex={0}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-[75vw] aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: colors.surface }}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close lightbox"
              >
                <X size={24} />
              </button>
              {microClips.find((c) => c.id === lightboxClip)?.loopSrc ? (
                <video
                  className="w-full h-full object-cover"
                  src={microClips.find((c) => c.id === lightboxClip)?.loopSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={microClips.find((c) => c.id === lightboxClip)?.thumb}
                  alt={microClips.find((c) => c.id === lightboxClip)?.title}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { adasTokens };
