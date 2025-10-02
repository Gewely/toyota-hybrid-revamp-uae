"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
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

/* ============================================================
   Types
============================================================ */
type CTA = {
  label: string;
  action: () => void;
  variant?: "primary" | "secondary";
};

type Stat = {
  value: number;
  suffix?: string;
  label: string;
  icon?: React.ReactNode;
};

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
   Animated Number Counter
============================================================ */
const AnimatedNumber: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
}> = ({ value, duration = 900, suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * t * 100) / 100);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span>
      {Number.isInteger(value)
        ? Math.round(display)
        : display.toFixed(1)}
      {suffix}
    </span>
  );
};

/* ============================================================
   Wistia Video Player Hook
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
function mostlyVisible(el: HTMLElement, threshold = 0.8) {
  const rect = el.getBoundingClientRect();
  const vh =
    window.innerHeight || document.documentElement.clientHeight;
  const visibleHeight =
    Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return visibleHeight / vh >= threshold;
}

/* ============================================================
   Props
============================================================ */
interface Props {
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  setIsFinanceOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  onInteriorExplore: () => void;
  onConnectivityExplore: () => void;
  onHybridTechExplore: () => void;
  onSafetyExplore: () => void;
  galleryImages: string[];
}

/* ============================================================
   Storytelling Section
============================================================ */
const StorytellingSection: React.FC<Props> = ({
  monthlyEMI,
  setIsBookingOpen,
  setIsFinanceOpen,
  navigate,
  onInteriorExplore,
  onConnectivityExplore,
  onHybridTechExplore,
  onSafetyExplore,
  galleryImages,
}) => {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisibleEnough, setIsVisibleEnough] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  /* ----------------- Scenes ----------------- */
  const scenes: Scene[] = useMemo(
    () => [
      {
        id: "hero",
        title: "Redefine Your Journey",
        subtitle: "Power, efficiency, and innovation in perfect harmony.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-005-2160.jpg",
        cta: {
          label: "Reserve Now",
          action: () => setIsBookingOpen(true),
          variant: "primary",
        },
        secondaryCta: {
          label: "Explore Finance",
          action: () => setIsFinanceOpen(true),
          variant: "secondary",
        },
        stats: [
          {
            value: 268,
            label: "Horsepower",
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
          },
          {
            value: 7.1,
            suffix: "s",
            label: "0–100 km/h",
            icon: <Car className="w-6 h-6 text-blue-400" />,
          },
          {
            value: 850,
            suffix: " km",
            label: "Range",
            icon: <Sparkles className="w-6 h-6 text-green-400" />,
          },
          {
            value: 5,
            suffix: "★",
            label: "Safety",
            icon: <Shield className="w-6 h-6 text-red-400" />,
          },
        ],
      },
      {
        id: "exterior",
        title: "Sculpted for Performance",
        subtitle:
          "Every curve designed with purpose, every line crafted for excellence.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-2160.jpg",
        cta: {
          label: "Explore Design",
          action: () => navigate("/design"),
          variant: "secondary",
        },
        features: [
          "LED Matrix Headlights",
          "Active Aero",
          "Carbon Fiber Accents",
          "Sport Wheels",
        ],
      },
      {
        id: "interior",
        title: "Luxury Redefined",
        subtitle:
          "Step into a world where comfort meets cutting-edge technology.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg",
        cta: {
          label: "Experience Interior",
          action: onInteriorExplore,
          variant: "primary",
        },
        features: [
          "Premium Leather",
          "Ambient Lighting",
          "Panoramic Roof",
          "JBL Premium Audio",
        ],
      },
      {
        id: "technology",
        title: "Innovation at Your Fingertips",
        subtitle: "Advanced technology that anticipates your needs.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg",
        cta: {
          label: "Discover Tech",
          action: onConnectivityExplore,
          variant: "secondary",
        },
        features: [
          "Hybrid Synergy Drive",
          "Toyota Safety Sense",
          "Connected Services",
          "Wireless Charging",
        ],
      },
    ],
    [
      monthlyEMI,
      setIsBookingOpen,
      setIsFinanceOpen,
      navigate,
      onInteriorExplore,
      onConnectivityExplore,
      galleryImages,
    ]
  );

  const labels = ["Hero", "Exterior", "Interior", "Tech"];

  /* ----------------- State ----------------- */
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const isLocked = index < scenes.length - 1; // unlock scroll after last
  const active = scenes[index];

  /* ----------------- Visibility watcher (restart at scene 0) ----------------- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = () => {
      const visible = mostlyVisible(el, 0.8);
      if (visible && !isVisibleEnough) setIndex(0);
      setIsVisibleEnough(visible);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isVisibleEnough]);

  /* ----------------- Parallax ----------------- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 16;
      const cy = (e.clientY / window.innerHeight - 0.5) * 16;
      setParallax({ x: cx, y: cy });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ----------------- Scroll Handlers ----------------- */
  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (!isLocked) return;
      e.preventDefault();
      if (isTransitioning) return;
      setIsTransitioning(true);
      const dir = e.deltaY > 0 ? 1 : -1;
      setIndex((i) =>
        Math.max(0, Math.min(scenes.length - 1, i + dir))
      );
      setTimeout(
        () => setIsTransitioning(false),
        prefersReduced ? 250 : 750
      );
    },
    [isLocked, isTransitioning, scenes.length, prefersReduced]
  );

  const touchStartY = useRef<number | null>(null);
  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isLocked) return;
      if (
        Math.abs(
          (touchStartY.current ?? e.touches[0].clientY) -
            e.touches[0].clientY
        ) > 10
      ) {
        e.preventDefault();
      }
    },
    [isLocked]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isLocked || touchStartY.current === null) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(dy) < 50 || isTransitioning) return;
      setIsTransitioning(true);
      const dir = dy > 0 ? 1 : -1;
      setIndex((i) =>
        Math.max(0, Math.min(scenes.length - 1, i + dir))
      );
      setTimeout(
        () => setIsTransitioning(false),
        prefersReduced ? 250 : 750
      );
    },
    [isLocked, isTransitioning, scenes.length, prefersReduced]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isLocked) return;
      if (
        ![
          "ArrowDown",
          "ArrowRight",
          "PageDown",
          " ",
          "ArrowUp",
          "ArrowLeft",
          "PageUp",
        ].includes(e.key)
      )
        return;
      e.preventDefault();
      if (isTransitioning) return;
      setIsTransitioning(true);
      const dir =
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        e.key === " "
          ? 1
          : -1;
      setIndex((i) =>
        Math.max(0, Math.min(scenes.length - 1, i + dir))
      );
      setTimeout(
        () => setIsTransitioning(false),
        prefersReduced ? 250 : 750
      );
    },
    [isLocked, isTransitioning, scenes.length, prefersReduced]
  );

  /* ----------------- Attach handlers ----------------- */
  useEffect(() => {
    if (isLocked) {
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
      window.removeEventListener("keydown", onKeyDown as any);
    };
  }, [isLocked, onWheel, onTouchStart, onTouchMove, onTouchEnd, onKeyDown]);

  /* ----------------- Wistia Player ----------------- */
  const { mute, unmute, pause, play } = useWistiaPlayer(
    active.backgroundVideoWistiaId
  );

  useEffect(() => {
    if (active.backgroundVideoWistiaId) {
      if (isMuted) mute();
      else unmute();
      play();
    } else {
      mute();
      pause();
    }
  }, [index, isMuted, active.backgroundVideoWistiaId]);

  /* ----------------- UI ----------------- */
  const progressPct = ((index + 1) / scenes.length) * 100;
  const isFirst = index === 0;
  const isLast = index === scenes.length - 1;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] bg-black text-white overflow-hidden"
      aria-label="Cinematic automotive storytelling"
    >
      {/* MEDIA LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            x: parallax.x * 0.3,
            y: parallax.y * 0.3,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.2 : 0.6 }}
        >
          <img
            src={active.backgroundImage}
            alt={active.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {active.backgroundVideoWistiaId && (
            <div className="absolute inset-0">
              <div
                className={`wistia_embed wistia_async_${active.backgroundVideoWistiaId} videoFoam=true`}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-blue-600/30 mix-blend-overlay"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* SOUND TOGGLE */}
      {active.backgroundVideoWistiaId && (
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="absolute top-6 left-6 z-20 bg-black/55 text-white p-2 rounded-full hover:bg-black/70 transition"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* CONTENT LAYER */}
      <div className="absolute bottom-0 left-0 w-full z-10 flex justify-start px-10 pb-20">
        <motion.div
          key={`content-${active.id}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: prefersReduced ? 0.2 : 0.6 }}
          className="max-w-3xl text-left"
        >
          <div className="inline-block rounded-2xl bg-black/28 backdrop-blur-md px-6 py-6 md:px-10 md:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <h2 className="text-3xl md:text-6xl font-extralight mb-4">
              {active.title}
            </h2>
            <p className="text-base md:text-2xl text-white/90 mb-6">{active.subtitle}</p>

            {/* Stats */}
            {active.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                {active.stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="flex justify-center mb-2">{s.icon}</div>
                    <div className="text-xl md:text-3xl font-light">
                      <AnimatedNumber value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs md:text-sm text-white/70">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Features */}
            {active.features && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {active.features.map((f, i) => (
                  <Badge key={i} className="bg-white/10 text-white border-white/20">
                    {f}
                  </Badge>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3">
              {active.cta && (
                <Button
                  onClick={active.cta.action}
                  className={`px-6 py-3 transition-transform hover:scale-[1.03] ${
                    active.cta.variant === "primary"
                      ? "bg-white text-black hover:bg-white/90"
                      : "border border-white/40 text-white hover:bg-white/10"
                  }`}
                >
                  {active.cta.label}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              )}
              {active.secondaryCta && (
                <Button
                  onClick={active.secondaryCta.action}
                  variant="outline"
                  className="px-6 py-3 border border-white/40 text-white hover:bg-white/10 transition-transform hover:scale-[1.03]"
                >
                  {active.secondaryCta.label}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* PROGRESS DOTS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-6">
        {scenes.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center">
            <button
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full mb-1 transition-all ${
                i === index ? "bg-white w-8" : "bg-white/40 hover:bg-white/60 w-2"
              }`}
            />
            <span className={`text-xs ${i === index ? "text-white" : "text-white/50"}`}>
              {labels[i]}
            </span>
          </div>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-red-600 z-20"
        animate={{ width: `${progressPct}%` }}
        transition={{ duration: prefersReduced ? 0.2 : 0.45 }}
      />

      {/* SCROLL HINT */}
      {(isFirst || isLast) && (
        <motion.div
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 text-center text-white/80 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isFirst && (
            <>
              <p className="mb-2">Scroll to explore</p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                <ChevronDown className="w-6 h-6 mx-auto" />
              </motion.div>
            </>
          )}
          {isLast && <p>Scroll to continue</p>}
        </motion.div>
      )}
    </section>
  );
};

export default StorytellingSection;
