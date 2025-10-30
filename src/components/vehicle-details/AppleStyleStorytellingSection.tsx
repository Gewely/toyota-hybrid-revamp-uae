"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Zap, Car, Shield, Sparkles, ChevronRight, ChevronDown, Volume2, VolumeX, X, Star } from "lucide-react";
import { useModal } from "@/contexts/ModalProvider";
import { contextualHaptic } from "@/utils/haptic";
import { toast } from "@/hooks/use-toast";

/* ============================================================
   Types
============================================================ */
type CTA = { label: string; action: () => void; variant?: "primary" | "secondary" };
type Stat = { value: number; suffix?: string; label: string; icon?: React.ReactNode };
type Scene = {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundVideoWistiaId?: string;
  cta?: CTA;
  secondaryCta?: CTA;
  stats?: Stat[];
  features?: string[];
};

/* ============================================================
   Audio Manager
============================================================ */
const createAudioManager = (enabled: boolean) => {
  if (typeof Audio === 'undefined') {
    return {
      play: () => {},
      sceneEnter: null,
      badgeHover: null,
      ctaClick: null,
    };
  }
  
  return {
    sceneEnter: new Audio(),
    badgeHover: new Audio(),
    ctaClick: new Audio(),
    play(sound: 'sceneEnter' | 'badgeHover' | 'ctaClick', volume = 0.15) {
      if (!enabled) return;
      const audio = this[sound];
      if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
  };
};

/* ============================================================
   Animated Number
============================================================ */
const AnimatedNumber: React.FC<{ value: number; duration?: number; suffix?: string }> = ({
  value,
  duration = 900,
  suffix = "",
}) => {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState<number>(prefersReduced ? value : 0);

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const next = Number.isInteger(value) ? Math.round(value * t) : Math.round((value * t + Number.EPSILON) * 10) / 10;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, prefersReduced]);

  return (
    <span>
      {Number.isInteger(value) ? display : display.toFixed(1)}
      {suffix}
    </span>
  );
};

/* ============================================================
   Wistia Player Hook
============================================================ */
function useWistiaPlayer(videoId?: string) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoId) return;
    (window as any)._wq = (window as any)._wq || [];
    if (!document.getElementById("wistia-e-v1")) {
      const s = document.createElement("script");
      s.id = "wistia-e-v1";
      s.src = "https://fast.wistia.com/assets/external/E-v1.js";
      s.async = true;
      document.head.appendChild(s);
    }
    (window as any)._wq.push({
      id: videoId,
      onReady: (video: any) => {
        playerRef.current = video;
        try {
          video.mute();
          video.loop(true);
          video.play();
        } catch {}
      },
    });
  }, [videoId]);

  const mute = () => playerRef.current?.mute?.();
  const unmute = () => playerRef.current?.unmute?.();
  const pause = () => playerRef.current?.pause?.();
  const play = () => playerRef.current?.play?.();

  return { mute, unmute, pause, play };
}

/* ============================================================
   Helpers
============================================================ */
const isInteractive = (el: Element | null): boolean => {
  if (!el) return false;
  const target = el as HTMLElement;
  if (target.dataset.interactive === "true") return true;
  return !!target.closest(
    'button, a, input, select, textarea, [role="button"], [role="tab"], [role="link"], [data-interactive="true"]',
  );
};

function coversViewport(el: HTMLElement, topOffsetPx = 0, tol = 6) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  const coverage = visible / Math.min(vh, Math.max(rect.height, 1));
  return coverage >= 0.6 && rect.top <= topOffsetPx + 120 + tol;
}

/* ============================================================
   Props
============================================================ */
interface Props {
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  setIsFinanceOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  galleryImages: string[];
  topOffsetPx?: number;
  forceMotion?: boolean;
}

/* ============================================================
   Component
============================================================ */
const AppleStyleStorytellingSection: React.FC<Props> = ({
  monthlyEMI,
  setIsBookingOpen,
  setIsFinanceOpen,
  navigate,
  galleryImages,
  topOffsetPx = 0,
  forceMotion = false,
}) => {
  const { open } = useModal();
  const prefersReduced = useReducedMotion();
  const motionAllowed = forceMotion || !prefersReduced;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  
  /* ----------------- Ultra-Premium States ----------------- */
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fps, setFps] = useState(60);
  const [qualityMode, setQualityMode] = useState<'ultra' | 'high' | 'medium'>('ultra');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollTime = useRef(Date.now());
  const [showKeyboardHints, setShowKeyboardHints] = useState(() => {
    return typeof localStorage !== 'undefined' ? !localStorage.getItem('keyboard-hints-seen') : false;
  });
  const sceneEngagement = useRef<Record<string, number>>({});
  const sceneStartTime = useRef(Date.now());
  const [transitionRipple, setTransitionRipple] = useState<{ show: boolean; direction: 'down' | 'up' }>({ 
    show: false, 
    direction: 'down' 
  });
  const [previewScene, setPreviewScene] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageQuality, setImageQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [textColor, setTextColor] = useState('white');
  const [badgeOffsets, setBadgeOffsets] = useState<Record<number, { x: number; y: number }>>({});

  // Motion values
  const scrollY = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);
  const cameraShake = useSpring(0, { stiffness: 400, damping: 30 });

  // Audio manager
  const audioManager = useMemo(() => createAudioManager(soundEnabled), [soundEnabled]);

  /* ----------------- Scenes ----------------- */
  const scenes: Scene[] = useMemo(
    () => [
      {
        id: "hero",
        title: "Redefine Your Journey",
        subtitle: "Power, efficiency, and innovation in perfect harmony.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-005-2160.jpg",
        cta: { label: "Reserve Now", action: () => setIsBookingOpen(true), variant: "primary" },
        secondaryCta: { label: "Explore Finance", action: () => setIsFinanceOpen(true), variant: "secondary" },
        stats: [
          { value: 268, label: "Horsepower", icon: <Zap className="w-6 h-6" aria-hidden="true" /> },
          { value: 7.1, suffix: "s", label: "0–100 km/h", icon: <Car className="w-6 h-6" aria-hidden="true" /> },
          { value: 850, suffix: " km", label: "Range", icon: <Sparkles className="w-6 h-6" aria-hidden="true" /> },
          { value: 4.8, suffix: "★", label: "Owner Rating", icon: <Star className="w-6 h-6" aria-hidden="true" /> },
        ],
      },
      {
        id: "exterior",
        title: "Sculpted for Performance",
        subtitle: "Every curve designed with purpose, every line crafted for excellence.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-2160.jpg",
        cta: {
          label: "Explore Design",
          action: () => document.getElementById("seamless-showroom")?.scrollIntoView({ behavior: "smooth" }),
          variant: "secondary",
        },
        features: ["LED Matrix Headlights", "Active Aero", "Carbon Fiber Accents", "Sport Wheels"],
      },
      {
        id: "interior",
        title: "Luxury Redefined",
        subtitle: "Step into a world where comfort meets cutting-edge technology.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg",
        cta: { label: "Experience Interior", action: () => open('story-interior'), variant: "primary" },
        features: ["Premium Leather", "Ambient Lighting", "Panoramic Roof", "JBL Premium Audio"],
      },
      {
        id: "technology",
        title: "Innovation at Your Fingertips",
        subtitle: "Advanced technology that anticipates your needs.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg",
        cta: { label: "Discover Tech", action: () => open('story-technology'), variant: "secondary" },
        features: ["Hybrid Synergy Drive", "Toyota Safety Sense", "Connected Services", "Wireless Charging"],
      },
    ],
    [monthlyEMI, setIsBookingOpen, setIsFinanceOpen, navigate, open],
  );
  const labels = ["Hero", "Exterior", "Interior", "Tech"];

  /* ----------------- State ----------------- */
  const [index, setIndex] = useState(() => {
    if (typeof sessionStorage !== 'undefined') {
      const saved = sessionStorage.getItem('storytelling-progress');
      if (saved && !isNaN(parseInt(saved))) {
        return Math.min(parseInt(saved), scenes.length - 1);
      }
    }
    return 0;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [manualUnlock, setManualUnlock] = useState(false);

  const active = scenes[index];
  const lastIndex = scenes.length - 1;

  /* ----------------- FPS Monitoring ----------------- */
  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let rafId: number;
    
    const measureFPS = () => {
      frames++;
      const now = performance.now();
      
      if (now >= lastTime + 1000) {
        const currentFps = Math.round(frames * 1000 / (now - lastTime));
        setFps(currentFps);
        frames = 0;
        lastTime = now;
      }
      
      rafId = requestAnimationFrame(measureFPS);
    };
    
    rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Adaptive quality
  useEffect(() => {
    if (fps < 30) setQualityMode('medium');
    else if (fps < 45) setQualityMode('high');
    else setQualityMode('ultra');
  }, [fps]);

  /* ----------------- Keyboard Hints ----------------- */
  useEffect(() => {
    if (showKeyboardHints) {
      const timer = setTimeout(() => {
        setShowKeyboardHints(false);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('keyboard-hints-seen', 'true');
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showKeyboardHints]);

  /* ----------------- Cursor Tracking ----------------- */
  useEffect(() => {
    if (qualityMode === 'medium') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [qualityMode]);

  /* ----------------- Camera Shake for Performance Scene ----------------- */
  useEffect(() => {
    if (active?.id === 'performance' && qualityMode === 'ultra') {
      const interval = setInterval(() => {
        cameraShake.set(Math.random() * 2 - 1);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [active?.id, qualityMode, cameraShake]);

  /* ----------------- Engagement Tracking ----------------- */
  useEffect(() => {
    sceneStartTime.current = Date.now();
    
    return () => {
      const duration = Date.now() - sceneStartTime.current;
      if (active?.id) {
        sceneEngagement.current[active.id] = 
          (sceneEngagement.current[active.id] || 0) + duration;
      }
    };
  }, [active?.id]);

  /* ----------------- Image Brightness Analysis ----------------- */
  const analyzeImageBrightness = useCallback((imgSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, img.height * 0.6, img.width, img.height * 0.4);
        const data = imageData.data;
        
        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        brightness /= (data.length / 4);
        
        setTextColor(brightness > 128 ? '#000000' : '#ffffff');
      } catch (e) {
        setTextColor('#ffffff');
      }
    };
    img.onerror = () => setTextColor('#ffffff');
    img.src = imgSrc;
  }, []);

  /* ----------------- Progressive Image Loading ----------------- */
  useEffect(() => {
    if (!active?.backgroundImage) return;
    
    analyzeImageBrightness(active.backgroundImage);
    setImageLoading(true);
    setImageQuality('low');
    
    const mediumImg = new Image();
    mediumImg.onload = () => {
      setImageQuality('medium');
      
      const highImg = new Image();
      highImg.onload = () => {
        setImageQuality('high');
        setImageLoading(false);
      };
      highImg.src = active.backgroundImage;
    };
    mediumImg.src = active.backgroundImage;
  }, [active?.backgroundImage, analyzeImageBrightness]);

  /* ----------------- Lock evaluator ----------------- */
  const [lockActive, setLockActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const evaluate = () => {
      raf = 0;
      const should = coversViewport(el, topOffsetPx) && index < lastIndex && !manualUnlock;
      setLockActive(should);
    };

    const onScrollResize = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };

    evaluate();
    setTimeout(evaluate, 120);

    window.addEventListener("scroll", onScrollResize, { passive: true });
    window.addEventListener("resize", onScrollResize, { passive: true });
    window.addEventListener("orientationchange", onScrollResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollResize as any);
      window.removeEventListener("resize", onScrollResize as any);
      window.removeEventListener("orientationchange", onScrollResize as any);
    };
  }, [index, lastIndex, manualUnlock, topOffsetPx]);

  /* ----------------- Parallax ----------------- */
  useEffect(() => {
    if (!motionAllowed) return;
    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 16;
      const cy = (e.clientY / window.innerHeight - 0.5) * 16;
      setParallax({ x: cx, y: cy });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [motionAllowed]);

  /* ----------------- Elastic Resistance ----------------- */
  const elasticResistance = useCallback((delta: number, max: number = 100) => {
    return max * (1 - Math.exp(-Math.abs(delta) / 150));
  }, []);

  /* ----------------- Step Navigation ----------------- */
  const step = useCallback(
    (dir: 1 | -1) => {
      if (isTransitioning) return;
      
      contextualHaptic.swipeNavigation();
      audioManager.play('sceneEnter');
      
      setTransitionRipple({ show: true, direction: dir > 0 ? 'down' : 'up' });
      setTimeout(() => setTransitionRipple({ show: false, direction: 'down' }), 600);
      
      // Track velocity
      const now = Date.now();
      const timeDelta = now - lastScrollTime.current;
      if (timeDelta > 0) {
        setScrollVelocity(Math.abs(1000 / timeDelta));
      }
      lastScrollTime.current = now;
      
      setIsTransitioning(true);
      setIndex((i) => Math.max(0, Math.min(lastIndex, i + dir)));
      
      setTimeout(() => setIsTransitioning(false), motionAllowed ? 650 : 220);
    },
    [isTransitioning, lastIndex, motionAllowed, audioManager],
  );

  /* ----------------- Input Handlers ----------------- */
  const wheelHandlerRef = useRef<(e: WheelEvent) => void>();
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    wheelHandlerRef.current = (e: WheelEvent) => {
      const el = sectionRef.current;
      if (!el || !lockActive) return;

      if (isInteractive(e.target as Element)) return;
      const rect = el.getBoundingClientRect();
      const cx = (e as any).clientX ?? rect.left + rect.width / 2;
      const cy = (e as any).clientY ?? rect.top + rect.height / 2;
      if (cx < rect.left || cx > rect.right || cy < rect.top || cy > rect.bottom) return;

      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    };
  }, [lockActive, step]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => wheelHandlerRef.current?.(e);

    const onTouchStart = (e: TouchEvent) => {
      if (!lockActive) return;
      if (isInteractive(e.target as Element)) return;
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!lockActive || touchStartY.current == null) return;
      const currentY = e.touches[0]?.clientY ?? 0;
      const deltaY = Math.abs((touchStartY.current ?? 0) - currentY);
      if (deltaY > 10) e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!lockActive || touchStartY.current == null) return;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      let dy = (touchStartY.current ?? 0) - endY;
      
      // Apply elastic resistance at boundaries
      if ((index === 0 && dy < 0) || (index === lastIndex && dy > 0)) {
        dy = elasticResistance(dy, 50);
      }
      
      touchStartY.current = null;
      if (Math.abs(dy) < 30) return;
      step(dy > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!lockActive) return;
      if (isInteractive(document.activeElement)) return;
      if (!["ArrowDown", "ArrowRight", "PageDown", " ", "ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) return;
      e.preventDefault();
      const dir = e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown" || e.key === " " ? 1 : -1;
      step(dir as 1 | -1);
    };

    el.addEventListener("wheel", onWheel as any, { passive: false });
    el.addEventListener("touchstart", onTouchStart as any, { passive: true });
    el.addEventListener("touchmove", onTouchMove as any, { passive: false });
    el.addEventListener("touchend", onTouchEnd as any, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("wheel", onWheel as any);
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchmove", onTouchMove as any);
      el.removeEventListener("touchend", onTouchEnd as any);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lockActive, step, index, lastIndex, elasticResistance]);

  /* ----------------- Wistia ----------------- */
  const { mute, unmute, pause, play } = useWistiaPlayer(lockActive ? active.backgroundVideoWistiaId : undefined);

  useEffect(() => {
    if (!lockActive) {
      pause();
      return;
    }
    if (active.backgroundVideoWistiaId) {
      if (isMuted) mute();
      else unmute();
      play();
    } else {
      mute();
      pause();
    }
  }, [index, isMuted, active.backgroundVideoWistiaId, lockActive, mute, unmute, play, pause]);

  /* ----------------- Session Persistence ----------------- */
  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('storytelling-progress', index.toString());
    }
  }, [index]);

  /* ----------------- Preload Next ----------------- */
  useEffect(() => {
    const next = scenes[index + 1];
    if (!next?.backgroundImage) return;
    const img = new Image();
    img.src = next.backgroundImage;
  }, [index, scenes]);

  /* ----------------- Parallax Layers ----------------- */
  const parallaxLayers = useMemo(() => {
    if (qualityMode === 'medium') return [];
    
    return [
      { depth: 0.1, blur: 3, opacity: 0.6 },
      { depth: 0.3, blur: 2, opacity: 0.8 },
      { depth: 0.5, blur: 0, opacity: 1 },
    ];
  }, [qualityMode]);

  // Pre-compute parallax transforms (must be at top level, not in map)
  const parallaxTransforms = [
    useTransform(scrollY, [0, 1000], [0, 1000 * 0.1]),
    useTransform(scrollY, [0, 1000], [0, 1000 * 0.3]),
    useTransform(scrollY, [0, 1000], [0, 1000 * 0.5]),
  ];

  /* ----------------- Dolly Zoom ----------------- */
  const dollyProgress = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  /* ----------------- Particles ----------------- */
  const particles = useMemo(() => {
    if (qualityMode !== 'ultra') return [];
    
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      delay: Math.random() * 0.5
    }));
  }, [qualityMode]);

  /* ----------------- Magnetic Badge Effect ----------------- */
  const getMagneticPull = useCallback((badgeRef: React.RefObject<HTMLDivElement>) => {
    if (qualityMode === 'medium' || !badgeRef.current) return { x: 0, y: 0 };
    
    const rect = badgeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.hypot(cursorPos.x - centerX, cursorPos.y - centerY);
    const maxDistance = 100;
    
    if (distance < maxDistance) {
      const strength = 1 - (distance / maxDistance);
      const pullX = (cursorPos.x - centerX) * strength * 0.15;
      const pullY = (cursorPos.y - centerY) * strength * 0.15;
      return { x: pullX, y: pullY };
    }
    
    return { x: 0, y: 0 };
  }, [cursorPos, qualityMode]);

  /* ----------------- UI ----------------- */
  const progressRatio = (index + 1) / scenes.length;
  const isFirst = index === 0;
  const isLast = index === lastIndex;

  return (
    <TooltipProvider>
      <section
        ref={sectionRef}
        className="relative bg-black text-white overflow-hidden select-none"
        style={{
          minHeight: "100vh",
          height: "100vh",
          overscrollBehavior: "contain",
          touchAction: lockActive ? ("pan-y pinch-zoom" as any) : "auto",
          WebkitOverflowScrolling: "touch",
          willChange: isTransitioning ? 'transform, opacity' : 'auto',
        }}
        aria-label="Cinematic automotive storytelling"
        aria-live="polite"
      >
        {/* Sound Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            contextualHaptic.selectionChange();
          }}
          className="fixed top-24 right-4 z-50 bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/80 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>

        {/* Keyboard Hints */}
        <AnimatePresence>
          {showKeyboardHints && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium"
            >
              Use ↑↓ keys or scroll to navigate scenes
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition Ripple */}
        <AnimatePresence>
          {transitionRipple.show && (
            <motion.div
              className="absolute inset-0 z-40 pointer-events-none"
              initial={{ opacity: 0, y: transitionRipple.direction === 'down' ? '-100%' : '100%' }}
              animate={{ opacity: [0.15, 0], y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-full bg-gradient-to-b from-white/30 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wistia Background */}
        {active.backgroundVideoWistiaId && (
          <div className="absolute inset-0 z-0">
            <div
              className="wistia_responsive_padding"
              style={{ padding: "56.25% 0 0 0", position: "relative", height: "100%" }}
            >
              <div className="wistia_responsive_wrapper" style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "100%" }}>
                <div
                  className={`wistia_embed wistia_async_${active.backgroundVideoWistiaId} seo=true videoFoam=true`}
                  style={{ height: "100%", position: "relative", width: "100%" }}
                >
                  <div className="wistia_swatch" style={{ height: "100%", left: 0, opacity: 0, overflow: "hidden", position: "absolute", top: 0, transition: "opacity 200ms", width: "100%" }}>
                    <img
                      src={`https://fast.wistia.com/embed/medias/${active.backgroundVideoWistiaId}/swatch`}
                      style={{ filter: "blur(5px)", height: "100%", objectFit: "contain", width: "100%" }}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {/* Multi-layer Parallax Background */}
            {parallaxLayers.length > 0 ? (
              parallaxLayers.map((layer, i) => (
                <motion.div
                  key={`layer-${i}`}
                  className="absolute inset-0"
                  style={{
                    y: parallaxTransforms[i],
                    filter: `blur(${layer.blur}px)`,
                    opacity: layer.opacity,
                    scale: i === 1 ? dollyProgress : 1,
                  }}
                >
                  {imageLoading && i === 2 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                  )}
                  {i === 2 && (
                    <motion.img
                      src={active.backgroundImage}
                      alt={active.title}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      style={{ 
                        opacity: imageLoading ? 0 : 1,
                        x: cameraShake,
                      }}
                      onLoad={() => setImageLoading(false)}
                    />
                  )}
                </motion.div>
              ))
            ) : (
              <div className="absolute inset-0">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                )}
                <motion.img
                  src={active.backgroundImage}
                  alt={active.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  style={{ 
                    opacity: imageLoading ? 0 : 1,
                  }}
                  onLoad={() => setImageLoading(false)}
                />
              </div>
            )}

            {/* Enhanced Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

            {/* Particle Transition */}
            <AnimatePresence>
              {isTransitioning && qualityMode === 'ultra' && (
                <div className="absolute inset-0 pointer-events-none z-30">
                  {particles.map(p => (
                    <motion.div
                      key={p.id}
                      className="absolute w-1 h-1 bg-white/40 rounded-full"
                      initial={{ x: p.x, y: p.y, opacity: 0 }}
                      animate={{ 
                        x: p.x + (Math.random() * 200 - 100),
                        y: p.y - 200,
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 0.8, delay: p.delay }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Content */}
            <motion.div 
              className="relative h-full flex flex-col items-center justify-end pb-20 px-4 z-10"
              style={{ scale: contentScale }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-4xl w-full space-y-6"
              >
                <motion.h2
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center leading-tight"
                  style={{ 
                    color: textColor,
                    textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)'
                  }}
                >
                  {active.title}
                </motion.h2>

                <motion.p
                  className="text-xl sm:text-2xl text-center opacity-90"
                  style={{ 
                    color: textColor,
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                  }}
                >
                  {active.subtitle}
                </motion.p>

                {/* Animated Stats */}
                {active.stats && active.stats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-6"
                  >
                    {active.stats.map((stat, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <motion.div 
                            className="text-center cursor-pointer"
                            whileHover={{ scale: 1.05, y: -2 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <div 
                              className="text-3xl sm:text-4xl font-bold mb-1"
                              style={{ 
                                color: textColor,
                                textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                              }}
                            >
                              {stat.icon && <span className="inline-block mr-1">{stat.icon}</span>}
                              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div 
                              className="text-sm opacity-80"
                              style={{ 
                                color: textColor,
                                textShadow: '0 1px 5px rgba(0,0,0,0.6)'
                              }}
                            >
                              {stat.label}
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border-white/10">
                          <div className="space-y-1">
                            <p className="text-xs opacity-60">Industry Leading</p>
                            <p className="text-sm font-medium">{stat.label}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </motion.div>
                )}

                {/* Magnetic Feature Badges */}
                {active.features && active.features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap gap-3 justify-center"
                  >
                    {active.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        style={{
                          x: badgeOffsets[i]?.x ?? 0,
                          y: badgeOffsets[i]?.y ?? 0,
                        }}
                        onMouseMove={(e) => {
                          if (qualityMode === 'medium') return;
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          const centerX = rect.left + rect.width / 2;
                          const centerY = rect.top + rect.height / 2;
                          const distance = Math.hypot(cursorPos.x - centerX, cursorPos.y - centerY);
                          const maxDistance = 100;
                          let x = 0, y = 0;
                          if (distance < maxDistance) {
                            const strength = 1 - (distance / maxDistance);
                            x = (cursorPos.x - centerX) * strength * 0.15;
                            y = (cursorPos.y - centerY) * strength * 0.15;
                          }
                          setBadgeOffsets(prev => ({ ...prev, [i]: { x, y } }));
                        }}
                        onMouseLeave={() => {
                          setBadgeOffsets(prev => ({ ...prev, [i]: { x: 0, y: 0 } }));
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <Badge
                          className="bg-white/10 text-white border-white/20 cursor-pointer transition-all hover:bg-white/20 hover:shadow-lg backdrop-blur-sm"
                          style={{
                            color: textColor,
                            borderColor: `${textColor}33`,
                            backgroundColor: `${textColor}1a`
                          }}
                          onClick={() => {
                            contextualHaptic.selectionChange();
                            audioManager.play('badgeHover');
                            toast({
                              title: feature,
                              description: "Available in all grades",
                            });
                          }}
                          onMouseEnter={() => audioManager.play('badgeHover', 0.1)}
                        >
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {feature}
                          </motion.span>
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* CTAs */}
                {(active.cta || active.secondaryCta) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex gap-3 pt-2 justify-center flex-wrap"
                  >
                    {active.cta && (
                      <Button
                        size="lg"
                        variant={active.cta.variant === "primary" ? "default" : "outline"}
                        data-interactive="true"
                        asChild
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            contextualHaptic.buttonPress();
                            audioManager.play('ctaClick');
                            active.cta?.action();
                          }}
                        >
                          {active.cta.label}
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </motion.button>
                      </Button>
                    )}
                    {active.secondaryCta && (
                      <Button
                        size="lg"
                        variant={active.secondaryCta.variant === "primary" ? "default" : "outline"}
                        data-interactive="true"
                        asChild
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            contextualHaptic.buttonPress();
                            audioManager.play('ctaClick');
                            active.secondaryCta?.action();
                          }}
                        >
                          {active.secondaryCta.label}
                        </motion.button>
                      </Button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation UI */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
          {/* Preview on Hover Progress Bar */}
          <div className="relative flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
            {previewScene !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-black/90 rounded-xl backdrop-blur-md"
              >
                <img src={scenes[previewScene].backgroundImage} className="w-48 h-28 object-cover rounded-lg mb-2" alt="" />
                <p className="text-white text-sm font-medium">{scenes[previewScene].title}</p>
                <p className="text-white/60 text-xs">{scenes[previewScene].subtitle}</p>
              </motion.div>
            )}
            
            {scenes.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  contextualHaptic.selectionChange();
                  setIndex(i);
                }}
                onMouseEnter={() => setPreviewScene(i)}
                onMouseLeave={() => setPreviewScene(null)}
                className={`rounded-full mb-1 transition-all ${
                  i === index 
                    ? "bg-white w-12 h-3 sm:w-8 sm:h-2" 
                    : "bg-white/40 hover:bg-white/60 w-5 h-5 sm:w-3 sm:h-3"
                }`}
                aria-label={`Go to ${labels[i]}`}
                aria-current={i === index ? "true" : "false"}
              />
            ))}
          </div>

          {/* Exit/Continue Button */}
          {lockActive && index === lastIndex && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setManualUnlock(true);
                contextualHaptic.exitAction();
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
              }}
              className="bg-black/60 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md hover:bg-black/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
              <span className="text-sm">Continue Scrolling</span>
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Mute Toggle for Video */}
        {active.backgroundVideoWistiaId && (
          <button
            onClick={() => setIsMuted((m) => !m)}
            className="absolute bottom-8 right-8 z-40 bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/60 transition-colors"
            aria-label={isMuted ? "Unmute background video" : "Mute background video"}
            data-interactive="true"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </section>
    </TooltipProvider>
  );
};

export default AppleStyleStorytellingSection;
