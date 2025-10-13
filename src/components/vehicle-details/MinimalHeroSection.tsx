import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Share2,
  Maximize2,
  X,
  Info,
  Gauge,
  Sparkles,
  Shield,
  BatteryCharging,
  Wallet,
  Activity,
} from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";

/* ============================================================
   Props
============================================================ */
export type MinimalHeroSectionProps = {
  vehicle?: VehicleModel & { tagline?: string };
  galleryImages: string[];
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
};

/* ============================================================
   Theme / Motion
============================================================ */
const ACCENT = "#EB0A1E"; // Toyota red
const EASE = [0.22, 0.61, 0.36, 1] as const;

/* ============================================================
   Crescent HUD v4
============================================================ */
const MinimalHeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  galleryImages = [],
  onBookTestDrive,
  onCarBuilder,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // gallery state
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  // pause autoplay off-screen
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.4 });

  // preload neighbors
  useEffect(() => {
    const buf = new Set([0, 1, current, (current + 1) % Math.max(1, galleryImages.length)]);
    buf.forEach((i: any) => {
      const src = galleryImages[i];
      if (!src) return;
      const img = new Image();
      img.src = src;
      img.onload = () => setImageLoaded((p) => ({ ...p, [i]: true }));
    });
  }, [galleryImages, current]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || !galleryImages.length || !isIntersecting || isZoomed || prefersReducedMotion) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % galleryImages.length), 5200);
    return () => clearInterval(id);
  }, [autoPlay, galleryImages.length, isIntersecting, isZoomed, prefersReducedMotion]);

  const prev = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const next = useCallback(() => {
    setAutoPlay(false);
    setCurrent((p) => (p + 1) % galleryImages.length);
  }, [galleryImages.length]);

  // swipe
  const touchHandlers = useTouchGestures({
    onSwipeLeft: next,
    onSwipeRight: prev,
    threshold: 56,
  });

  // share
  const handleShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `${vehicle?.year ? vehicle.year + " " : ""}${vehicle?.name ?? "Vehicle"}`,
        text: vehicle?.tagline || "Check out this vehicle",
        url: typeof window !== "undefined" ? window.location.href : undefined,
      });
    } catch {}
  }, [vehicle]);

  // computed text
  const title = `${vehicle?.year ? vehicle.year + " " : ""}${vehicle?.name ?? "Toyota"}`;
  const tagline = vehicle?.tagline ?? "Electrified performance. Everyday mastery.";

  // animated stat
  const [countUp, setCountUp] = useState(0);
  const [countDone, setCountDone] = useState(false);
  useEffect(() => {
    if (!isIntersecting || countDone || prefersReducedMotion) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const target = 3.2;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setCountUp(Number((p * target).toFixed(1)));
      if (p < 1) raf = requestAnimationFrame(step);
      else setCountDone(true);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isIntersecting, countDone, prefersReducedMotion]);

  // tilt
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltFrame = useRef<number | null>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!stageRef.current || window.innerWidth < 1024) return;
    if (tiltFrame.current) cancelAnimationFrame(tiltFrame.current);
    const el = stageRef.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tiltFrame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1200px) rotateY(${x * 3.2}deg) rotateX(${-(y * 2.4)}deg)`;
    });
  };
  const onMouseLeave = () => {
    if (stageRef.current) stageRef.current.style.transform = "";
  };

  // contexts (affect Spec Tower only)
  type Ctx = "overview" | "performance" | "ownership" | "finance";
  const [ctx, setCtx] = useState<Ctx>("overview");

  const specs = useMemo(() => {
    const base = [
      { label: "0–100 km/h", value: `${countUp.toFixed(1)}s` },
      { label: "Range", value: "650 km" },
      { label: "Drive", value: "Dual Motor AWD" },
    ];
    const perf = [
      { label: "Power", value: "380 kW" },
      { label: "Torque", value: "700 Nm" },
      { label: "0–100 km/h", value: `${countUp.toFixed(1)}s` },
    ];
    const own = [
      { label: "Warranty", value: "8 yrs HV" },
      { label: "Service", value: "10k km / 12 mo" },
      { label: "Charging", value: "Home + Public" },
    ];
    const fin = [
      { label: "EMI (36 mo)", value: "—" }, // clarify tenure
      { label: "EMI (48 mo)", value: "—" },
      { label: "Downpayment", value: "—" },
    ];
    return ctx === "overview" ? base : ctx === "performance" ? perf : ctx === "ownership" ? own : fin;
  }, [ctx, countUp]);

  const hasImages = galleryImages.length > 0;

  return (
    <section
      ref={targetRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden"
      style={
        {
          // tokenize accent for easy theming
          // @ts-ignore
          "--accent": ACCENT,
          backgroundColor: "#f6f7f8",
          backgroundImage:
            "radial-gradient(1200px 800px at 90% -10%, rgba(235,10,30,0.06), transparent), radial-gradient(900px 600px at 10% -20%, rgba(0,0,0,0.04), transparent)",
        } as React.CSSProperties
      }
      aria-label="Vehicle hero"
    >
      {/* Ambient pulled from current image */}
      {hasImages && (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <img
            src={galleryImages[current]}
            alt=""
            className="absolute -inset-10 h-[120%] w-[120%] scale-110 object-cover blur-[30px] opacity-20"
            loading="lazy"
          />
        </div>
      )}

      {/* Top utilities */}
      <div className="relative z-20 px-4 pt-4 lg:px-8" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-neutral-800 shadow-sm">
            <Sparkles className="h-4 w-4" /> New
          </div>
          <div className="flex items-center gap-2">
            {"share" in navigator && (
              <button
                onClick={handleShare}
                aria-label="Share"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/85 shadow-sm active:scale-95"
              >
                <Share2 className="h-5 w-5 text-neutral-800" />
              </button>
            )}
            <button
              onClick={() => setIsZoomed(true)}
              aria-label="Fullscreen"
              className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/85 shadow-sm active:scale-95"
            >
              <Maximize2 className="h-5 w-5 text-neutral-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="relative z-10 mt-3 lg:mt-6">
        <div
          ref={stageRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className={`relative mx-4 lg:mx-8 ${isZoomed ? "h-[78vh]" : "h-[88vh]"} rounded-3xl overflow-hidden border border-black/10 bg-white shadow-[0_30px_120px_-40px_rgba(0,0,0,0.35)]`}
          {...touchHandlers}
          role="region"
          aria-roledescription="carousel"
          aria-label="Gallery"
        >
          {/* Image */}
          <AnimatePresence mode="wait">
            {hasImages ? (
              <motion.img
                key={current}
                src={galleryImages[current]}
                alt={`${vehicle?.name ?? "Vehicle"} — ${current + 1}/${galleryImages.length}`}
                className="absolute inset-0 h-full w-full object-cover"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1.012 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 1.0, ease: EASE }}
                onLoad={() => setImageLoaded((p) => ({ ...p, [current]: true }))}
                loading={current < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-neutral-500">No images</div>
            )}
          </AnimatePresence>

          {/* Legibility gradients */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.92),rgba(255,255,255,0))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_top,rgba(255,255,255,0.96),rgba(255,255,255,0))]" />

          {/* Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/90 shadow-sm active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6 text-neutral-900" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/90 shadow-sm active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6 text-neutral-900" />
              </button>
            </>
          )}

          {/* Spec Tower (desktop) */}
          <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 w-[320px]">
            <div className="rounded-2xl border border-neutral-200 bg-white/85 backdrop-blur-md p-4 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.35)]">
              {/* Orbital-style context tabs with icons */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { k: "overview", icon: Sparkles },
                  { k: "performance", icon: Activity },
                  { k: "ownership", icon: Shield },
                  { k: "finance", icon: Wallet },
                ].map(({ k, icon: Icon }) => (
                  <button
                    key={k}
                    onClick={() => setCtx(k as Ctx)}
                    className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 ${
                      ctx === (k as Ctx)
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {(k as string).slice(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>

              {/* KPIs */}
              <div className="mt-3 grid grid-cols-1 gap-3">
                {specs.map((s, i) => (
                  <div key={i} className="rounded-xl border border-neutral-200 bg-white p-3">
                    <div className="text-[11px] uppercase tracking-wide text-neutral-500">{s.label}</div>
                    <div className="mt-1 text-lg font-semibold text-neutral-900 tabular-nums">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-neutral-600">
                  <Gauge className="h-4 w-4" /> Live stat
                </span>
                <button
                  onClick={() => document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-1 text-neutral-800 hover:underline"
                >
                  Full specs <Info className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Command Dock */}
          <div className="absolute left-1/2 bottom-5 -translate-x-1/2 w-[min(1080px,94%)]">
            <div className="rounded-2xl border border-neutral-200 bg-white/85 backdrop-blur-md p-4 lg:p-5 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.35)]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <h1 className="text-[clamp(22px,4vw,36px)] font-semibold text-neutral-900">{title}</h1>
                  <p className="text-[clamp(13px,1.2vw,16px)] text-neutral-600">{tagline}</p>
                  {/* context chips */}
                  <div className="mt-2 hidden gap-2 lg:flex">
                    <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700">
                      Design
                    </span>
                    <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700">
                      Technology
                    </span>
                    <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700">
                      Safety
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {onCarBuilder && (
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 22px 44px -22px rgba(235,10,30,0.55)" }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setAutoPlay(false);
                        onCarBuilder();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      <Settings className="h-5 w-5" />
                      Configure
                    </motion.button>
                  )}
                  {onBookTestDrive && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setAutoPlay(false);
                        onBookTestDrive();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 font-semibold text-neutral-900"
                    >
                      <Calendar className="h-5 w-5" />
                      Test Drive
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Segmented scrub with labels */}
              {galleryImages.length > 1 && (
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex w-full items-center gap-2" aria-label="Image scrub bar">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setAutoPlay(false);
                          setCurrent(i);
                        }}
                        aria-label={`Go to ${i + 1}`}
                        className={`h-1.5 flex-1 rounded-full transition-all ${i === current ? "bg-neutral-900" : "bg-neutral-300 hover:bg-neutral-400"}`}
                      />
                    ))}
                  </div>
                  <div className="hidden min-w-[240px] shrink-0 lg:flex items-center justify-end gap-3 text-sm text-neutral-600">
                    <span>Overview</span>•<span>Performance</span>•<span>Ownership</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile mini spec pills above dock */}
          <div className="lg:hidden absolute left-1/2 bottom-[92px] -translate-x-1/2 w-[min(980px,92%)]">
            <div className="grid grid-cols-3 gap-2">
              {specs.slice(0, 3).map((s, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white/85 backdrop-blur-md p-3">
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">{s.label}</div>
                  <div className="mt-1 text-sm font-semibold text-neutral-900 tabular-nums">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom overlay */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <button
            onClick={() => setIsZoomed(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-[60] grid h-10 w-10 place-items-center rounded-full bg-white/90"
            style={{ marginTop: "max(0px, env(safe-area-inset-top))" }}
          >
            <X className="h-5 w-5 text-neutral-900" />
          </button>
          <div className="flex h-full w-full items-center justify-center p-6">
            <div className="relative h-full w-full max-w-7xl">
              <img
                src={galleryImages[current]}
                alt=""
                className="h-full w-full rounded-2xl object-contain shadow-2xl"
              />
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/90"
                  >
                    <ChevronLeft className="h-6 w-6 text-neutral-900" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/90"
                  >
                    <ChevronRight className="h-6 w-6 text-neutral-900" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Specs anchor */}
      <div id="specs" className="h-1" />
    </section>
  );
};

export default MinimalHeroSection;
