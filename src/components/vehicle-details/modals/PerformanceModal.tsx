"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Zap, Gauge, Timer, Cog, Info } from "lucide-react";

/* =====================================================================================
   Inline Hook: Safe Touch Gestures (no crash when options omitted)
===================================================================================== */
type TouchGesturesOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  axis?: "x" | "y" | "both";
};
function useTouchGestures(opts: TouchGesturesOptions = {}) {
  const { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 60, axis = "x" } = opts;
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onTouchStart: React.TouchEventHandler = (e) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
  };
  const onTouchEnd: React.TouchEventHandler = (e) => {
    if (startX.current == null || startY.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    startX.current = null;
    startY.current = null;

    if (axis === "x" || (axis === "both" && ax >= ay)) {
      if (ax >= threshold) (dx < 0 ? onSwipeLeft : onSwipeRight)?.();
      return;
    }
    if (axis === "y" || (axis === "both" && ay > ax)) {
      if (ay >= threshold) (dy < 0 ? onSwipeUp : onSwipeDown)?.();
    }
  };
  return { onTouchStart, onTouchEnd };
}

/* =====================================================================================
   Types
===================================================================================== */
type ModeSpec = {
  id: string;
  label: string;
  desc?: string;
  hp?: number;
  speed?: number; // km/h
  torque?: number; // Nm
  acceleration?: number; // 0–100 km/h in seconds
};

export interface PerformanceModalProps {
  onClose: () => void;
  vehicleName?: string;
  heroImageSrc?: string;
  vehicle?: any; // if provided, we try to derive performance
  performance?: {
    hp?: number;
    torque?: number;
    topSpeed?: number;
    zeroTo100?: number;
    transmission?: string;
    drivetrain?: string;
    fuelEconomy?: string;
    electricRangeKm?: number;
    batteryCapacityKwh?: number;
    co2?: string;
    modes?: ModeSpec[];
  };
  /** Optional: show demo data when nothing provided (kept off by default) */
  enableDemoFallback?: boolean;
}

/* =====================================================================================
   Utilities & Derivers
===================================================================================== */
const MAX_SPEED = 320;
const MAX_HP = 1000;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const fmt = (v?: number | string, fallback = "—") =>
  v == null || v === "" ? fallback : typeof v === "number" ? new Intl.NumberFormat("en-AE").format(v) : v;

const modeGradient = (id: string) => {
  const k = id.toLowerCase();
  if (k.includes("eco") || k.includes("comfort")) return "from-emerald-500/80 to-teal-600/80";
  if (k.includes("sport") || k.includes("power")) return "from-rose-500/80 to-red-600/80";
  if (k.includes("normal") || k.includes("auto")) return "from-sky-500/80 to-cyan-600/80";
  return "from-zinc-500/60 to-zinc-700/60";
};

// Extract number from strings like "300 hp", "6.5s", "260 km/h"
const toNum = (v?: any): number | undefined => {
  if (v == null) return undefined;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const m = String(v)
    .replace(",", ".")
    .match(/[\d.]+/g);
  return m ? Number(m.join("")) : undefined;
};

/** Derive normalized performance from a loose `vehicle` shape */
function derivePerformanceFromVehicle(vehicle?: any): PerformanceModalProps["performance"] | undefined {
  if (!vehicle) return undefined;

  const specs = vehicle.specs || vehicle.performance || vehicle.details || {};
  const hp = specs.powerHp ?? specs.hp ?? toNum(specs.power) ?? toNum(vehicle.hp);
  const torque = specs.torqueNm ?? toNum(specs.torque) ?? toNum(vehicle.torque);
  const topSpeed = specs.topSpeedKmh ?? toNum(specs.topSpeed) ?? toNum(vehicle.topSpeed);
  const zeroTo100 =
    specs.zeroTo100Sec ?? specs.acceleration0to100 ?? toNum(specs.zeroTo100) ?? toNum(specs.acceleration);
  const transmission = specs.transmission ?? vehicle.transmission;
  const drivetrain = specs.drivetrain ?? specs.drive ?? vehicle.drivetrain;
  const fuelEconomy =
    specs.fuelEconomy ??
    specs.consumption ??
    (vehicle.fuelEconomyLper100km ? `${vehicle.fuelEconomyLper100km} L/100km` : undefined);
  const electricRangeKm = specs.rangeKm ?? toNum(specs.electricRangeKm) ?? toNum(vehicle.electricRangeKm);
  const batteryCapacityKwh = specs.batteryKwh ?? toNum(specs.batteryCapacityKwh) ?? toNum(vehicle.batteryCapacityKwh);
  const co2 = specs.co2 ?? vehicle.co2;

  const rawModes = vehicle.modes || vehicle.driveModes || specs.modes || specs.driveModes || [];
  const modes: ModeSpec[] | undefined = Array.isArray(rawModes)
    ? rawModes.map((m: any, i: number) => ({
        id: String(m.id ?? m.key ?? m.label ?? `mode-${i}`),
        label: String(m.label ?? m.name ?? m.id ?? `Mode ${i + 1}`),
        desc: m.desc ?? m.description,
        hp: toNum(m.hp ?? m.power ?? m.powerHp),
        speed: toNum(m.topSpeed ?? m.speed),
        torque: toNum(m.torque ?? m.torqueNm),
        acceleration: toNum(m.zeroTo100 ?? m.acceleration),
      }))
    : undefined;

  const any =
    hp ??
    torque ??
    topSpeed ??
    zeroTo100 ??
    transmission ??
    drivetrain ??
    fuelEconomy ??
    electricRangeKm ??
    batteryCapacityKwh ??
    co2;
  if (!any && !modes?.length) return undefined;

  return {
    hp,
    torque,
    topSpeed,
    zeroTo100,
    transmission,
    drivetrain,
    fuelEconomy,
    electricRangeKm,
    batteryCapacityKwh,
    co2,
    modes,
  };
}

function buildModeStat(base?: PerformanceModalProps["performance"], mode?: ModeSpec) {
  const hp = mode?.hp ?? base?.hp;
  const speed = mode?.speed ?? base?.topSpeed;
  const torque = mode?.torque ?? base?.torque;
  const acceleration = mode?.acceleration ?? base?.zeroTo100;
  return { hp, speed, torque, acceleration };
}

function secondaryRows(perf?: PerformanceModalProps["performance"]) {
  return [
    { Icon: Cog, label: "Transmission", value: perf?.transmission },
    { Icon: Gauge, label: "Drivetrain", value: perf?.drivetrain },
    { Icon: Zap, label: "Fuel Economy", value: perf?.fuelEconomy },
    perf?.electricRangeKm != null
      ? { Icon: Gauge, label: "Electric Range", value: `${fmt(perf.electricRangeKm)} km` }
      : null,
    perf?.batteryCapacityKwh != null
      ? { Icon: Zap, label: "Battery", value: `${fmt(perf.batteryCapacityKwh)} kWh` }
      : null,
    { Icon: Info, label: "CO₂ Emissions", value: perf?.co2 },
  ].filter(Boolean) as { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; value?: string }[];
}

/* =====================================================================================
   Modal Shell: backdrop, ESC close, focus mgmt, scroll lock
===================================================================================== */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const originalOverflow = document.body.style.overflow;
    const originalPadRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadRight;
    };
  }, [active]);
}

function ModalShell({
  title,
  onClose,
  heroImageSrc,
  children,
}: {
  title: string;
  onClose: () => void;
  heroImageSrc?: string;
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const el = panelRef.current;
    const first = el?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={panelRef}
          className="relative w-full max-w-[1100px] rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden"
          initial={{ y: prefersReducedMotion ? 0 : 30, scale: prefersReducedMotion ? 1 : 0.98 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: prefersReducedMotion ? 0 : 30, scale: prefersReducedMotion ? 1 : 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero / Title Strip */}
          <div className="relative h-24 sm:h-32 md:h-36 w-full overflow-hidden">
            {heroImageSrc ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImageSrc})` }}
                aria-hidden
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
            <div className="absolute left-4 right-16 bottom-3 sm:left-6 sm:right-20">
              <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h2>
              <p className="text-zinc-300 text-[11px] sm:text-xs">
                Real-world specs may vary by grade, options, and environment.
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          {children}
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}

/* =====================================================================================
   Stat Card
===================================================================================== */
function StatCard({
  Icon,
  label,
  value,
  suffix,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value?: string | number;
  suffix?: string;
}) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-200 mb-2 sm:mb-3" />
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-none">
        {value ?? "—"}{" "}
        {value != null && suffix ? (
          <span className="text-base sm:text-lg font-medium text-zinc-300">{suffix}</span>
        ) : null}
      </div>
      <div className="text-[11px] sm:text-xs text-zinc-400">{label}</div>
    </div>
  );
}

/* =====================================================================================
   Main Component
===================================================================================== */
const PerformanceModal: React.FC<PerformanceModalProps> = ({
  onClose,
  vehicleName,
  heroImageSrc,
  vehicle,
  performance,
  enableDemoFallback = false,
}) => {
  // 1) Build usable performance object
  const perf = useMemo<PerformanceModalProps["performance"] | undefined>(() => {
    const derived = performance ?? derivePerformanceFromVehicle(vehicle);
    if (derived) return derived;

    if (enableDemoFallback) {
      return {
        hp: 300,
        torque: 500,
        topSpeed: 260,
        zeroTo100: 6.5,
        transmission: "8-speed Automatic",
        drivetrain: "AWD",
        fuelEconomy: "6.1 L/100km",
        electricRangeKm: 120,
        batteryCapacityKwh: 89,
        co2: "95 g/km",
        modes: [
          {
            id: "eco",
            label: "Eco",
            hp: 220,
            torque: 380,
            speed: 200,
            acceleration: 8.4,
            desc: "Optimized for efficiency and range.",
          },
          {
            id: "normal",
            label: "Normal",
            hp: 270,
            torque: 450,
            speed: 235,
            acceleration: 7.1,
            desc: "Balanced daily driving.",
          },
          {
            id: "sport",
            label: "Sport",
            hp: 300,
            torque: 500,
            speed: 260,
            acceleration: 6.5,
            desc: "Maximum responsiveness and power.",
          },
        ],
      };
    }
    return undefined;
  }, [performance, vehicle, enableDemoFallback]);

  // 2) Modes & current stats
  const modes = perf?.modes?.length ? perf!.modes! : [];
  const hasModes = modes.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (activeIndex > modes.length - 1) setActiveIndex(0);
  }, [modes.length, activeIndex]);

  const activeMode = hasModes ? modes[activeIndex] : undefined;
  const current = useMemo(() => buildModeStat(perf, activeMode), [perf, activeMode]);

  const nextMode = useCallback(
    () => hasModes && setActiveIndex((i) => (i + 1) % modes.length),
    [hasModes, modes.length],
  );
  const prevMode = useCallback(
    () => hasModes && setActiveIndex((i) => (i - 1 + modes.length) % modes.length),
    [hasModes, modes.length],
  );

  // keyboard nav for modes
  useEffect(() => {
    if (!hasModes) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextMode();
      if (e.key === "ArrowLeft") prevMode();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasModes, nextMode, prevMode]);

  // touch gestures (pass empty object if no modes)
  const touchHandlers = useTouchGestures(
    hasModes ? { onSwipeLeft: nextMode, onSwipeRight: prevMode, threshold: 50, axis: "x" } : {},
  );

  // 3) Gauge
  const prefersReducedMotion = useReducedMotion();
  const gaugeValue = current.speed ?? (current.hp ? (current.hp / MAX_HP) * MAX_SPEED : undefined);
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const progress = gaugeValue != null ? clamp(gaugeValue, 0, MAX_SPEED) / MAX_SPEED : 0;
  const dashOffset = circumference - circumference * progress;

  const rows = secondaryRows(perf);
  const titleText = vehicleName ? `${vehicleName} Performance` : "Performance Overview";
  const hasAnyPrimary =
    current.hp != null || current.torque != null || current.acceleration != null || current.speed != null;

  return (
    <ModalShell
      title={titleText}
      onClose={onClose}
      heroImageSrc={heroImageSrc ?? vehicle?.images?.hero ?? vehicle?.gallery?.[0]}
    >
      <div className="px-5 sm:px-6 md:px-10 pb-8 sm:pb-10" {...touchHandlers}>
        {/* Mode Selector (hidden if no modes) */}
        {hasModes && (
          <div className="flex items-center justify-center gap-2 mt-4 mb-6 sm:mb-8">
            <button
              aria-label="Previous mode"
              onClick={prevMode}
              className="rounded-full p-2 bg-zinc-800/70 hover:bg-zinc-700 transition"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[70vw] sm:max-w-none">
              {modes.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setActiveIndex(idx)}
                  className={[
                    "whitespace-nowrap rounded-full border px-3 sm:px-4 py-1.5 text-xs sm:text-sm transition",
                    idx === activeIndex
                      ? "bg-white text-black border-white shadow"
                      : "bg-zinc-900/70 text-zinc-200 border-zinc-700 hover:bg-zinc-800",
                  ].join(" ")}
                >
                  {cap(m.label ?? m.id)}
                </button>
              ))}
            </div>

            <button
              aria-label="Next mode"
              onClick={nextMode}
              className="rounded-full p-2 bg-zinc-800/70 hover:bg-zinc-700 transition"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Gauge */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />
              <defs>
                <linearGradient id="perfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#bbbbbb" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke="url(#perfGradient)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                transform="rotate(-90 100 100)"
                initial={false}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, ease: "easeOut" }}
              />
            </svg>

            {/* Center Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hasModes ? modes[activeIndex]?.id : "base"}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-none">
                    {gaugeValue != null ? Math.round(gaugeValue) : "—"}
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-400 mt-1">
                    {current.speed != null ? "km/h" : current.hp != null ? "hp (scaled)" : "No data"}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mode badge */}
            {hasModes && (
              <div
                className={[
                  "absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs rounded-full px-3 py-1 border text-white",
                  "bg-gradient-to-r",
                  modeGradient(modes[activeIndex]?.id ?? ""),
                ].join(" ")}
              >
                {cap(modes[activeIndex]?.label ?? modes[activeIndex]?.id ?? "Mode")}
              </div>
            )}
          </div>
        </div>

        {/* Primary Stats */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hasModes ? modes[activeIndex]?.id : "base-stats"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            <StatCard Icon={Zap} label="Horsepower" value={fmt(current.hp)} />
            <StatCard Icon={Cog} label="Torque (Nm)" value={fmt(current.torque)} />
            <StatCard
              Icon={Timer}
              label="0–100 km/h"
              value={current.acceleration != null ? `${current.acceleration}s` : "—"}
            />
            <StatCard
              Icon={Gauge}
              label="Top Speed"
              value={fmt(current.speed)}
              suffix={current.speed != null ? "km/h" : undefined}
            />
          </motion.div>
        </AnimatePresence>

        {/* Secondary Specs */}
        <div className="mt-6 sm:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {rows.map(({ Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm text-zinc-400">{label}</div>
                  <div className="text-sm sm:text-base text-zinc-100 truncate">{value ?? "—"}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-6 sm:mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
              {hasModes
                ? `${cap(modes[activeIndex]?.label ?? modes[activeIndex]?.id ?? "Mode")} Mode`
                : "Performance Summary"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {hasAnyPrimary
                ? hasModes
                  ? (modes[activeIndex]?.desc ??
                    "Tuned calibration for throttle response and power delivery. Actual behavior may vary by grade and region.")
                  : "Core performance figures shown. Availability of specific features (e.g., drive modes) varies by model and trim."
                : "Specs are not available for this model yet."}
            </p>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

export default PerformanceModal;
