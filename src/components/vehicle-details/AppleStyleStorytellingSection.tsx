"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Car, Shield, Sparkles, ChevronRight, ChevronDown, Volume2, VolumeX, X } from "lucide-react";
import { useModal } from "@/contexts/ModalProvider";

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
   Wistia Player Hook (lazy + robust)
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
    [monthlyEMI, setIsBookingOpen, setIsFinanceOpen, navigate, open, galleryImages],
  );
  const labels = ["Hero", "Exterior", "Interior", "Tech"];

  /* ----------------- State ----------------- */
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [manualUnlock, setManualUnlock] = useState(false);

  const active = scenes[index];
  const lastIndex = scenes.length - 1;

  /* ----------------- Lock evaluator (Intersection + heuristics) ----------- */
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

    // Initial + delayed evaluation (layout settle)
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
      // cooldown to avoid accidental multiple steps
      setTimeout(() => setIsTransitioning(false), motionAllowed ? 650 : 220);
    },
    [isTransitioning, lastIndex, motionAllowed],
  );

  /* ----------------- Scoped wheel / touch / keys on the section ---------- */
  const wheelHandlerRef = useRef<(e: WheelEvent) => void>();
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    wheelHandlerRef.current = (e: WheelEvent) => {
      const el = sectionRef.current;
      if (!el || !lockActive) return;

      if (isInteractive(e.target as Element)) return; // don't hijack over buttons/links
      // Only if pointer is within section bounds
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
      if (isInteractive(e.target as Element)) return; // let taps on CTAs through
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!lockActive || touchStartY.current == null) return;
      const currentY = e.touches[0]?.clientY ?? 0;
      const deltaY = Math.abs((touchStartY.current ?? 0) - currentY);
      // Allow small moves (scrolling content inside buttons), block big swipes for step
      if (deltaY > 10) e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!lockActive || touchStartY.current == null) return;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dy = (touchStartY.current ?? 0) - endY;
      touchStartY.current = null;
      if (Math.abs(dy) < 48) return;
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

    // Important: passive:false to allow preventDefault
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
  }, [lockActive, step]);

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
        // pan-y improves iOS Safari; still allows our touch listeners
        touchAction: lockActive ? ("pan-y pinch-zoom" as any) : "auto",
        WebkitOverflowScrolling: "touch",
      }}
      aria-label="Cinematic automotive storytelling"
      aria-live="polite"
    >
      {/* MEDIA LAYER (z-0, pointer-events: none so it never blocks clicks) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="absolute inset-0 z-0 pointer-events-none will-change-transform"
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
            className="absolute inset-0 w-full h-full object-cover object-center"
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
            className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-blue-600/30 mix-blend-overlay"
            style={{ pointerEvents: "none" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
            style={{ pointerEvents: "none" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"
            style={{ pointerEvents: "none" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* SOUND + EXIT CONTROLS (top-left / top-right) */}
      <div className="absolute top-[max(1rem,calc(env(safe-area-inset-top)+0.5rem))] left-0 right-0 z-30 flex items-center justify-between px-4 md:px-6">
        {active.backgroundVideoWistiaId ? (
          <button
            data-interactive="true"
            onClick={() => setIsMuted((m) => !m)}
            className="bg-black/60 text-white p-3 rounded-full hover:bg-black/75 transition focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label={isMuted ? "Unmute background video" : "Mute background video"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        ) : (
          <div />
        )}
        <button
          data-interactive="true"
          onClick={() => setManualUnlock((v) => !v)}
          className="bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black/75 transition focus:outline-none focus:ring-2 focus:ring-white/60 flex items-center gap-2"
          aria-label={manualUnlock ? "Re-enter cinematic mode" : "Exit cinematic mode"}
          title={manualUnlock ? "Re-enter cinematic" : "Exit cinematic"}
        >
          <X className="w-4 h-4" />
          <span className="text-sm">{manualUnlock ? "Re-enter" : "Exit"}</span>
        </button>
      </div>

      {/* CONTENT LAYER (z-20) */}
      <div className="absolute bottom-0 left-0 w-full z-20 flex justify-start px-4 md:px-10 pb-[max(5.5rem,env(safe-area-inset-bottom))]">
        <motion.div
          key={`content-${active.id}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: motionAllowed ? 0.5 : 0.18 }}
          className="max-w-[min(92vw,60rem)]"
        >
          <div className="inline-block rounded-2xl bg-black/28 backdrop-blur-md px-5 py-4 md:px-10 md:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <h2
              className="font-extralight mb-2 md:mb-3 leading-tight"
              style={{ fontSize: "clamp(1.75rem, 4.8vw, 3.5rem)" }}
            >
              {active.title}
            </h2>
            <p className="text-white/90 mb-4 md:mb-6" style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.5rem)" }}>
              {active.subtitle}
            </p>

            {/* Stats */}
            {active.stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5 mb-4 md:mb-6">
                {active.stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="flex justify-center mb-2">{s.icon}</div>
                    <div className="font-light" style={{ fontSize: "clamp(1.1rem, 3.2vw, 2rem)" }}>
                      <AnimatedNumber value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs md:text-sm text-white/70">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Features */}
            {active.features && (
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {active.features.map((f, i) => (
                  <Badge
                    key={i}
                    className="bg-white/10 text-white border-white/20"
                    aria-label={f}
                    data-interactive="true"
                  >
                    {f}
                  </Badge>
                ))}
              </div>
            )}

            {/* CTAs (explicitly marked interactive so gestures never swallow taps) */}
            <div className="flex flex-wrap items-center gap-3">
              {active.cta && (
                <Button
                  data-interactive="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    active.cta?.action();
                  }}
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
                  data-interactive="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    active.secondaryCta?.action();
                  }}
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

      {/* PROGRESS DOTS (z-30) */}
      <div className="absolute bottom-[max(2.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] left-1/2 -translate-x-1/2 z-30 flex space-x-6">
        {scenes.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center">
            <button
              data-interactive="true"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Go to ${labels[i]} section`}
              aria-current={i === index ? "true" : "false"}
              className={`rounded-full mb-1 transition-all focus:outline-none focus:ring-2 focus:ring-white/60 ${
                i === index ? "bg-white w-8 h-2" : "bg-white/40 hover:bg-white/60 w-3 h-3"
              }`}
            />
            <span className={`text-[11px] ${i === index ? "text-white" : "text-white/60"}`}>{labels[i]}</span>
          </div>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
        <motion.div
          className="h-full bg-red-600 origin-left will-change-transform"
          animate={{ scaleX: progressRatio }}
          initial={false}
          transition={{ duration: motionAllowed ? 0.45 : 0.18 }}
        />
      </div>

      {/* SCROLL HINT */}
      {(isFirst || isLast) && motionAllowed && !manualUnlock && (
        <motion.div
          className="absolute bottom-[max(4.25rem,calc(env(safe-area-inset-bottom)+2.75rem))] left-1/2 -translate-x-1/2 z-30 text-center text-white/85 text-sm"
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
