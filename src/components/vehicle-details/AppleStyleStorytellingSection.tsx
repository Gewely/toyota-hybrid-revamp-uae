"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Car, Shield, Sparkles, ChevronRight, ChevronDown, Volume2, VolumeX } from "lucide-react";

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
   Animated Number (reduced-motion aware)
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
function pointInRect(x: number, y: number, r: DOMRect) {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}
function coversViewport(el: HTMLElement, topOffsetPx = 0, tol = 6) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  // Consider sticky header via topOffsetPx
  return rect.top <= topOffsetPx + tol && rect.bottom >= vh - tol;
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
  onHybridTechExplore: () => void; // kept for API compatibility
  onSafetyExplore: () => void; // kept for API compatibility
  galleryImages: string[];
  /** Height of any sticky header that occupies the top of the viewport */
  topOffsetPx?: number;
  /** Force step-scroll even if user prefers-reduced-motion is on (debug only) */
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
  onInteriorExplore,
  onConnectivityExplore,
  onHybridTechExplore: _onHybridTechExplore,
  onSafetyExplore: _onSafetyExplore,
  galleryImages,
  topOffsetPx = 0,
  forceMotion = false,
}) => {
  const prefersReduced = useReducedMotion();
  const motionAllowed = forceMotion || !prefersReduced;

  const sectionRef = useRef<HTMLElement | null>(null);
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
        cta: { label: "Reserve Now", action: () => setIsBookingOpen(true), variant: "primary" },
        secondaryCta: { label: "Explore Finance", action: () => setIsFinanceOpen(true), variant: "secondary" },
        stats: [
          { value: 268, label: "Horsepower", icon: <Zap className="w-6 h-6" aria-hidden="true" /> },
          { value: 7.1, suffix: "s", label: "0–100 km/h", icon: <Car className="w-6 h-6" aria-hidden="true" /> },
          { value: 850, suffix: " km", label: "Range", icon: <Sparkles className="w-6 h-6" aria-hidden="true" /> },
          { value: 5, suffix: "★", label: "Safety", icon: <Shield className="w-6 h-6" aria-hidden="true" /> },
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
        cta: { label: "Experience Interior", action: onInteriorExplore, variant: "primary" },
        features: ["Premium Leather", "Ambient Lighting", "Panoramic Roof", "JBL Premium Audio"],
      },
      {
        id: "technology",
        title: "Innovation at Your Fingertips",
        subtitle: "Advanced technology that anticipates your needs.",
        backgroundImage:
          "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg",
        cta: { label: "Discover Tech", action: onConnectivityExplore, variant: "secondary" },
        features: ["Hybrid Synergy Drive", "Toyota Safety Sense", "Connected Services", "Wireless Charging"],
      },
    ],
    [monthlyEMI, setIsBookingOpen, setIsFinanceOpen, navigate, onInteriorExplore, onConnectivityExplore, galleryImages],
  );
  const labels = ["Hero", "Exterior", "Interior", "Tech"];

  /* ----------------- State ----------------- */
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [lockActive, setLockActive] = useState(false); // recalculated live

  const active = scenes[index];
  const lastIndex = scenes.length - 1;

  /* ----------------- Lock evaluator (rAF-throttled on scroll/resize + index) ----------- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let ticking = false;
    const evalLock = () => {
      ticking = false;
      const fully = coversViewport(el, topOffsetPx, 10);
      // Enable lock when section is in view AND not on last slide AND motion allowed
      const shouldLock = fully && index < lastIndex && motionAllowed;
      console.log('🔒 Lock eval:', { fully, index, lastIndex, motionAllowed, shouldLock });
      setLockActive(shouldLock);
    };
    const onScrollResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(evalLock);
      }
    };

    // Initial evaluation with slight delay to ensure DOM is ready
    setTimeout(evalLock, 100);
    evalLock();
    
    window.addEventListener("scroll", onScrollResize, { passive: true });
    window.addEventListener("resize", onScrollResize, { passive: true });
    window.addEventListener("orientationchange", onScrollResize);

    return () => {
      window.removeEventListener("scroll", onScrollResize as any);
      window.removeEventListener("resize", onScrollResize as any);
      window.removeEventListener("orientationchange", onScrollResize as any);
    };
  }, [index, lastIndex, topOffsetPx, motionAllowed]);

  /* ----------------- Parallax (off for reduced motion) ----------------- */
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

  /* ----------------- Step navigation ----------------- */
  const step = useCallback(
    (dir: 1 | -1) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setIndex((i) => Math.max(0, Math.min(lastIndex, i + dir)));
      setTimeout(() => setIsTransitioning(false), motionAllowed ? 700 : 200);
    },
    [isTransitioning, lastIndex, motionAllowed],
  );

  // Window-level handlers (always attached; guard inside)
  const onWheel = useCallback(
    (e: WheelEvent) => {
      const el = sectionRef.current;
      if (!el || !lockActive) return;

      const rect = el.getBoundingClientRect();
      // Some browsers provide clientX/Y=0 for wheel; fallback to center
      const cx = (e as any).clientX ?? rect.left + rect.width / 2;
      const cy = (e as any).clientY ?? rect.top + rect.height / 2;
      if (!pointInRect(cx, cy, rect)) return;

      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    },
    [lockActive, step],
  );

  const touchStartY = useRef<number | null>(null);
  const touchActiveInSection = useRef(false);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const t = e.touches[0];
    touchActiveInSection.current = pointInRect(t.clientX, t.clientY, rect);
    touchStartY.current = t.clientY;
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!lockActive || !touchActiveInSection.current || touchStartY.current === null) return;
      const currentY = e.touches[0].clientY;
      const deltaY = Math.abs(touchStartY.current - currentY);
      if (deltaY > 10) e.preventDefault();
    },
    [lockActive],
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!lockActive || !touchActiveInSection.current || touchStartY.current === null) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      touchActiveInSection.current = false;
      if (Math.abs(dy) < 50) return;
      step(dy > 0 ? 1 : -1);
    },
    [lockActive, step],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lockActive) return;
      if (!["ArrowDown", "ArrowRight", "PageDown", " ", "ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) return;
      e.preventDefault();
      const dir = e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown" || e.key === " " ? 1 : -1;
      step(dir as 1 | -1);
    },
    [lockActive, step],
  );

  useEffect(() => {
    window.addEventListener("wheel", onWheel as any, { passive: false });
    window.addEventListener("touchstart", onTouchStart as any, { passive: true });
    window.addEventListener("touchmove", onTouchMove as any, { passive: false });
    window.addEventListener("touchend", onTouchEnd as any, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onWheel, onTouchStart, onTouchMove, onTouchEnd, onKeyDown]);

  /* ----------------- Wistia reacts to visibility & index ----------------- */
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

  /* ----------------- Preload next background ----------------- */
  useEffect(() => {
    const next = scenes[index + 1];
    if (!next?.backgroundImage) return;
    const img = new Image();
    img.src = next.backgroundImage;
  }, [index, scenes]);

  /* ----------------- UI ----------------- */
  const progressRatio = (index + 1) / scenes.length;
  const isFirst = index === 0;
  const isLast = index === lastIndex;

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white overflow-hidden select-none"
      style={{
        minHeight: "100vh",
        height: "100vh",
        overscrollBehavior: "contain",
        touchAction: lockActive ? "none" : "auto",
        scrollSnapAlign: "start",
      }}
      aria-label="Cinematic automotive storytelling"
      aria-live="polite"
    >
      {/* MEDIA LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="absolute inset-0 will-change-transform"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            x: motionAllowed ? parallax.x * 0.3 : 0,
            y: motionAllowed ? parallax.y * 0.3 : 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionAllowed ? 0.5 : 0.18 }}
        >
          <img
            src={active.backgroundImage}
            alt={active.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {active.backgroundVideoWistiaId && (
            <div className="absolute inset-0">
              <div
                className={`wistia_embed wistia_async_${active.backgroundVideoWistiaId} videoFoam=true`}
                style={{ width: "100%", height: "100%" }}
                aria-hidden="true"
              />
            </div>
          )}
          {/* overlays */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-blue-600/30 mix-blend-overlay pointer-events-none"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* SOUND TOGGLE */}
      {active.backgroundVideoWistiaId && (
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="absolute top-6 left-6 z-20 bg-black/60 text-white p-3 rounded-full hover:bg-black/75 transition focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label={isMuted ? "Unmute background video" : "Mute background video"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* CONTENT LAYER */}
      <div className="absolute bottom-0 left-0 w-full z-10 flex justify-start px-6 md:px-10 pb-[max(5.5rem,env(safe-area-inset-bottom))]">
        <motion.div
          key={`content-${active.id}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: motionAllowed ? 0.5 : 0.18 }}
          className="max-w-3xl text-left"
        >
          <div className="inline-block rounded-2xl bg-black/28 backdrop-blur-md px-5 py-5 md:px-10 md:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <h2 className="text-3xl md:text-6xl font-extralight mb-3 md:mb-4">{active.title}</h2>
            <p className="text-base md:text-2xl text-white/90 mb-5 md:mb-6">{active.subtitle}</p>

            {/* Stats */}
            {active.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-5 md:mb-6">
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
              <div className="flex flex-wrap justify-center gap-2 mb-5 md:mb-6">
                {active.features.map((f, i) => (
                  <Badge key={i} className="bg-white/10 text-white border-white/20" aria-label={f}>
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
                  className={`px-6 py-3 transition-transform hover:scale-[1.03] focus:ring-2 focus:ring-white/60 ${
                    active.cta.variant === "primary"
                      ? "bg-white text-black hover:bg-white/90"
                      : "border border-white/40 text-white hover:bg-white/10"
                  }`}
                >
                  {active.cta.label}
                  <ChevronRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Button>
              )}
              {active.secondaryCta && (
                <Button
                  onClick={active.secondaryCta.action}
                  variant="outline"
                  className="px-6 py-3 border border-white/40 text-white hover:bg-white/10 transition-transform hover:scale-[1.03] focus:ring-2 focus:ring-white/60"
                >
                  {active.secondaryCta.label}
                  <ChevronRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* PROGRESS DOTS */}
      <div className="absolute bottom-[max(2.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] left-1/2 -translate-x-1/2 z-20 flex space-x-6">
        {scenes.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center">
            <button
              onClick={() => setIndex(i)}
              aria-label={`Go to ${labels[i]} section`}
              aria-current={i === index ? "true" : "false"}
              className={`rounded-full mb-1 transition-all focus:outline-none focus:ring-2 focus:ring-white/60 ${
                i === index ? "bg-white w-8 h-2" : "bg-white/40 hover:bg-white/60 w-3 h-3"
              }`}
            />
            <span className={`text-xs ${i === index ? "text-white" : "text-white/60"}`}>{labels[i]}</span>
          </div>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
        <motion.div
          className="h-full bg-red-600 origin-left will-change-transform"
          animate={{ scaleX: progressRatio }}
          initial={false}
          transition={{ duration: motionAllowed ? 0.45 : 0.18 }}
        />
      </div>

      {/* SCROLL HINT */}
      {(isFirst || isLast) && motionAllowed && (
        <motion.div
          className="absolute bottom-[max(4.25rem,calc(env(safe-area-inset-bottom)+2.75rem))] left-1/2 -translate-x-1/2 z-20 text-center text-white/85 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isFirst ? (
            <>
              <p className="mb-2">Scroll to explore</p>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                <ChevronDown className="w-6 h-6 mx-auto" aria-hidden="true" />
              </motion.div>
            </>
          ) : (
            <p>Scroll to continue</p>
          )}
        </motion.div>
      )}
    </section>
  );
};

export default AppleStyleStorytellingSection;
