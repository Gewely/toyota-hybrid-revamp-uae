// EnhancedLifestyleGallery.tsx
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VehicleModel } from "@/types/vehicle";
import { Users, Coffee, Heart, Star, Mountain, Waves, Volume2, VolumeX, Sparkles } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";
import { useDeviceInfo } from "@/hooks/use-device-info";

export type LifestyleScenario = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  image: string;
  gradient: string;
  accentColor: string;
};

interface EnhancedLifestyleGalleryProps {
  vehicle: VehicleModel;
  scenarios?: LifestyleScenario[];
  defaultIndex?: number;
  onScenarioChange?: (scenario: LifestyleScenario, index: number) => void;
  className?: string;
}

const DEFAULT_SCENARIOS: LifestyleScenario[] = [
  {
    id: "family-adventure",
    title: "Family Adventures",
    shortTitle: "Family",
    description: "Create lasting memories with spacious comfort and advanced safety",
    icon: <Users className="h-4 w-4" aria-hidden="true" />,
    features: ["7-seater capacity", "Safety Sense 3.0", "Panoramic sunroof"],
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    accentColor: "bg-emerald-500",
  },
  {
    id: "urban-professional",
    title: "Urban Professional",
    shortTitle: "Pro",
    description: "Navigate city life with hybrid efficiency and connected technology",
    icon: <Coffee className="h-4 w-4" aria-hidden="true" />,
    features: ["Hybrid efficiency", "Wireless connectivity", "Premium interior"],
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    accentColor: "bg-blue-500",
  },
  {
    id: "coastal-escape",
    title: "Coastal Escapes",
    shortTitle: "Coast",
    description: "Drive to stunning coastlines with confidence and style",
    icon: <Waves className="h-4 w-4" aria-hidden="true" />,
    features: ["All-weather capability", "Premium sound", "Comfortable seating"],
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    gradient: "from-cyan-500 via-blue-400 to-teal-500",
    accentColor: "bg-cyan-500",
  },
  {
    id: "desert-exploration",
    title: "Desert Exploration",
    shortTitle: "Desert",
    description: "Discover UAE's landscapes with rugged capability",
    icon: <Mountain className="h-4 w-4" aria-hidden="true" />,
    features: ["AWD capability", "Ground clearance", "Durable build"],
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    accentColor: "bg-orange-500",
  },
];

export default function EnhancedLifestyleGallery({
  vehicle,
  scenarios = DEFAULT_SCENARIOS,
  defaultIndex = 0,
  onScenarioChange,
  className,
}: EnhancedLifestyleGalleryProps) {
  const [selected, setSelected] = useState(Math.min(Math.max(defaultIndex, 0), scenarios.length - 1));
  const [imgReady, setImgReady] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { isMobile } = useDeviceInfo();
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = useReducedMotion();
  const panelId = useId();
  const tablistId = useId();

  const current = scenarios[selected];

  const modelToken = useMemo(() => {
    const safeName = vehicle?.name || "Your Vehicle";
    const parts = safeName.trim().split(/\s+/);
    return parts[parts.length - 1] || safeName;
  }, [vehicle?.name]);

  // tiny UI ping (can replace with your own asset)
  useEffect(() => {
    if (!audioRef.current) {
      const el = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAZGF0YQAAAAA=");
      el.volume = 0.15;
      audioRef.current = el;
    }
  }, []);
  const playUiPing = useCallback(() => {
    if (audioOn && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [audioOn]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = (index + scenarios.length) % scenarios.length;
      setSelected(clamped);
      setImgReady(false);
      onScenarioChange?.(scenarios[clamped], clamped);
      if (navigator?.vibrate) navigator.vibrate(8);
      playUiPing();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ux:scenario_view", { detail: { id: scenarios[clamped].id } }));
      }
    },
    [onScenarioChange, scenarios, playUiPing]
  );
  const goNext = useCallback(() => goTo(selected + 1), [goTo, selected]);
  const goPrev = useCallback(() => goTo(selected - 1), [goTo, selected]);

  // Swipe (mobile)
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      setSwiped(true);
      goNext();
    },
    onSwipeRight: () => {
      setSwiped(true);
      goPrev();
    },
    threshold: 28,
    preventDefaultTouchmoveEvent: false,
  });

  // Auto-scroll mobile tabs
  useEffect(() => {
    if (scrollRef.current && isMobile) {
      const el = scrollRef.current;
      const tabWidth = el.scrollWidth / scenarios.length;
      const scrollPosition = selected * tabWidth - el.clientWidth / 2 + tabWidth / 2;
      el.scrollTo({ left: Math.max(0, scrollPosition), behavior: "smooth" });
    }
  }, [selected, isMobile, scenarios.length]);

  // deep link (?scenario=id)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = new URLSearchParams(window.location.search).get("scenario");
    if (id) {
      const idx = scenarios.findIndex((s) => s.id === id);
      if (idx >= 0) setSelected(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("scenario", current.id);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [current.id]);

  // a11y keyboard nav
  const onKeyDownTabs = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const key = e.key;
      if (key === "ArrowRight") {
        e.preventDefault();
        const next = (selected + 1) % scenarios.length;
        tabRefs.current[next]?.focus();
        goTo(next);
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        const prev = (selected - 1 + scenarios.length) % scenarios.length;
        tabRefs.current[prev]?.focus();
        goTo(prev);
      } else if (key === "Home") {
        e.preventDefault();
        tabRefs.current[0]?.focus();
        goTo(0);
      } else if (key === "End") {
        e.preventDefault();
        tabRefs.current[scenarios.length - 1]?.focus();
        goTo(scenarios.length - 1);
      }
    },
    [goTo, scenarios.length, selected]
  );

  const springy = useMemo(() => ({ type: "spring", stiffness: 220, damping: 24, mass: 0.8 }), []);
  const fade = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } };

  // parallax tilt + spotlight coordinates
  const onMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -8;
    const ry = (px - 0.5) * 8;
    e.currentTarget.style.setProperty("--rx", `${rx}deg`);
    e.currentTarget.style.setProperty("--ry", `${ry}deg`);
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"} transition={springy}>
      <section
        aria-label="Lifestyle gallery"
        className={"relative overflow-hidden bg-gradient-to-br from-background to-muted/30 " + (className ?? "")}
      >
        {/* ambient sparkles */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-muted/60 blur-3xl" />
        </div>

        {/* header */}
        <div className="px-4 md:px-6 py-6 md:py-10 text-center">
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs md:text-sm font-medium inline-flex items-center gap-2">
              <Heart className="h-3 w-3" aria-hidden="true" />
              Your Lifestyle, Elevated
            </Badge>
            <button
              type="button"
              onClick={() => setAudioOn((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-pressed={audioOn}
              aria-label={audioOn ? "Mute UI sounds" : "Enable UI sounds"}
            >
              {audioOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              {audioOn ? "Sound on" : "Sound off"}
            </button>
          </div>
          <h2 className="mt-4 text-2xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">{modelToken}</span> Lifestyle
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
            Discover how your {vehicle?.name ?? "vehicle"} seamlessly integrates into every aspect of your life.
          </p>
        </div>

        <div className="toyota-container px-4 md:px-6 pb-10 grid lg:grid-cols-3 gap-6 lg:gap-12 items-start">
          {/* desktop radial orbit; mobile pills fallback */}
          <div className="lg:col-span-1">
            <div className="hidden lg:grid place-items-center">
              <div
                role="tablist"
                aria-label="Choose your adventure"
                id={tablistId}
                onKeyDown={onKeyDownTabs}
                className="relative h-[320px] w-[320px] rounded-full border border-border/60 bg-card/50 backdrop-blur"
              >
                {/* Progress ring — must not intercept clicks */}
                <svg className="pointer-events-none absolute inset-0" viewBox="0 0 100 100" aria-hidden>
                  <circle cx="50" cy="50" r="48" className="fill-none stroke-muted" strokeWidth="3" pointerEvents="none" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="48"
                    className="fill-none stroke-primary"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                      strokeDasharray: `${((selected + 1) / scenarios.length) * 2 * Math.PI * 48} ${2 * Math.PI * 48}`,
                    }}
                    style={{ rotate: -90, transformOrigin: "50% 50%" }}
                    pointerEvents="none"
                  />
                </svg>

                {/* Orbit buttons (interactive) */}
                {scenarios.map((s, i) => {
                  const angle = (i / scenarios.length) * Math.PI * 2;
                  const x = 120 * Math.cos(angle);
                  const y = 120 * Math.sin(angle);
                  const isActive = i === selected;
                  return (
                    <button
                      key={s.id}
                      id={`${tablistId}-tab-${s.id}`}
                      ref={(el) => (tabRefs.current[i] = el)}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${panelId}-panel`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => goTo(i)}
                      className={
                        "z-10 group absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background/80 " +
                        "backdrop-blur px-3 py-2 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
                        (isActive ? "ring-2 ring-primary" : "hover:bg-muted/60")
                      }
                      style={{ left: 160 + x, top: 160 + y }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-foreground" aria-hidden>
                          {s.icon}
                        </span>
                        <span className="text-sm font-semibold">{s.shortTitle}</span>
                      </div>
                    </button>
                  );
                })}

                {/* Center label — visual only; must not block clicks */}
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" /> {selected + 1}/{scenarios.length}
                    </div>
                    <div className="mt-2 text-sm font-medium">Choose Your Adventure</div>
                  </div>
                </div>
              </div>
            </div>

            {/* mobile pills */}
            <div
              className="lg:hidden space-y-2"
              role="tablist"
              aria-label="Choose your adventure"
              id={`${tablistId}-mobile`}
              onKeyDown={onKeyDownTabs}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold">Choose Your Adventure</h3>
                <span className="text-xs text-muted-foreground">
                  {selected + 1}/{scenarios.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {scenarios.map((s, i) => {
                  const active = i === selected;
                  return (
                    <button
                      key={s.id}
                      id={`${tablistId}-tab-${s.id}-mobile`}
                      ref={(el) => (tabRefs.current[i] = el)}
                      role="tab"
                      aria-selected={active}
                      onClick={() => goTo(i)}
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition border",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active ? `bg-primary text-primary-foreground border-transparent` : "bg-card hover:bg-muted/60",
                      ].join(" ")}
                    >
                      <span aria-hidden>{s.icon}</span>
                      <span>{s.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* content panel */}
          <div className="lg:col-span-2" ref={swipeableRef} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={fade.initial} animate={fade.animate} exit={fade.exit}>
                <Card
                  className="overflow-hidden border-0 shadow-2xl will-change-transform"
                  role="tabpanel"
                  id={`${panelId}-panel`}
                  aria-labelledby={`${tablistId}-tab-${current.id}`}
                  onMouseMove={prefersReducedMotion ? undefined : onMouseMoveCard}
                  style={{
                    transform: "perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                  }}
                >
                  <div className="relative">
                    <div className="aspect-[16/10] md:aspect-[4/3] overflow-hidden relative">
                      {!imgReady && <div className="absolute inset-0 animate-pulse bg-muted/60" />}
                      <motion.img
                        src={current.image}
                        alt={`${current.title} lifestyle hero for ${vehicle?.name ?? "vehicle"}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 66vw, 100vw"
                        onLoad={() => setImgReady(true)}
                        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                        transition={{ duration: prefersReducedMotion ? 0.2 : 1.2, ease: "easeOut" }}
                        style={{ transform: "translate3d(var(--tx,0), var(--ty,0), 0)" }}
                      />
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-20`} />
                      {!prefersReducedMotion && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100"
                          style={{
                            maskImage: "radial-gradient(200px_200px_at_var(--mx,50%)_var(--my,50%),white,transparent)",
                            WebkitMaskImage:
                              "radial-gradient(200px_200px_at_var(--mx,50%)_var(--my,50%),white,transparent)",
                            background: "radial-gradient(closest-side,rgba(255,255,255,0.12),transparent)",
                          }}
                        />
                      )}

                      {!swiped && (
                        <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20 text-xs">
                          Swipe to explore →
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex gap-1">
                        {scenarios.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${i === selected ? "bg-white scale-125" : "bg-white/60"}`}
                            aria-hidden
                          />
                        ))}
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                      <Badge className={`${current.accentColor} text-white border-0 px-3 py-1.5`}>
                        <Star className="h-3 w-3 mr-1.5" aria-hidden="true" /> Featured
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 md:p-8">
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl ${current.accentColor} flex items-center justify-center text-white shadow-lg`}
                        aria-hidden="true"
                      >
                        {current.icon}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground">{current.title}</h3>
                        <p className="text-sm md:text-base text-muted-foreground">{current.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {current.features.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20px" }}
                          transition={{ delay: prefersReducedMotion ? 0 : 0.06 * idx }}
                          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-background/70"
                        >
                          <span className={`inline-block w-2 h-2 rounded-full ${current.accentColor}`} aria-hidden="true" />
                          <span className="font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div key={current.id + "-bar"} className="mt-6 h-1 w-full rounded bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((selected + 1) / scenarios.length) * 100}%` }}
                        transition={{ type: "spring", stiffness: 180, damping: 22 }}
                        className={`h-full ${current.accentColor}`}
                      />
                    </motion.div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <MagneticButton className="bg-primary text-primary-foreground">Book a Test Drive</MagneticButton>
                      <MagneticButton variant="outline">Download Brochure</MagneticButton>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* mobile bottom thumbnails */}
            <div className="mt-4 md:hidden">
              <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {scenarios.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className={`relative h-12 w-20 rounded-lg overflow-hidden border ${i === selected ? "ring-2 ring-primary" : ""}`}
                    aria-label={`View ${s.title}`}
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white line-clamp-1">{s.shortTitle}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

// Magnetic CTA with ripple
function MagneticButton({
  children,
  className = "",
  variant = "solid",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "outline";
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const prefersReducedMotion = useReducedMotion();

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width / 2;
    const my = e.clientY - r.top - r.height / 2;
    t.animate([{ transform: `translate(${mx * 0.08}px, ${my * 0.08}px)` }, { transform: "translate(0,0)" }], {
      duration: 350,
      easing: "cubic-bezier(.2,.8,.2,1)",
    });
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setRipples((prev) => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => setRipples((prev) => prev.slice(1)), 450);
    if (navigator?.vibrate) navigator.vibrate(10);
  };

  const base =
    "relative inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  const look = variant === "outline" ? "border hover:bg-muted/50" : "bg-primary text-primary-foreground hover:brightness-105";

  return (
    <button ref={ref} className={[base, look, className].join(" ")} onMouseMove={onMouseMove} onClick={onClick}>
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute inline-block h-10 w-10 rounded-full bg-white/40"
            style={{ left: r.x - 20, top: r.y - 20, transform: "scale(0)", animation: "rpl 450ms ease-out forwards" }}
          />
        ))}
      </span>
      <style>{`@keyframes rpl { to { transform: scale(2.6); opacity: 0; } }`}</style>
    </button>
  );
}
