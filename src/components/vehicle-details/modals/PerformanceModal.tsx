import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Zap, Gauge, Timer, Cog, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import ModalWrapper from "./ModalWrapper";

/* =========================================================================
   PerformanceModal — Universal, Responsive, Mode-Optional
   - Works whether the vehicle has drive modes or not.
   - Mobile-first layout, scales up cleanly to any screen size.
   - Graceful fallbacks when data is missing.
   - Reuses optional heroImage if provided.
============================================================================ */

type ModeSpec = {
  id: string;
  label: string;
  desc?: string;
  hp?: number;
  speed?: number; // km/h top speed
  torque?: number; // Nm
  acceleration?: number; // 0–100 km/h in seconds
};

export interface PerformanceModalProps {
  onClose: () => void;
  vehicleName?: string;
  heroImageSrc?: string;
  /** Base performance (shown if no modes; used as default for modes if fields missing) */
  performance?: {
    hp?: number;
    torque?: number;
    topSpeed?: number;
    zeroTo100?: number;
    transmission?: string;
    drivetrain?: string; // e.g., AWD, RWD, FWD
    fuelEconomy?: string; // e.g., 6.1 L/100km or 18 km/l
    electricRangeKm?: number;
    batteryCapacityKwh?: number;
    co2?: string; // g/km
    modes?: ModeSpec[]; // optional drive modes
  };
}

/* ---------------------- Helpers ---------------------- */
const MAX_SPEED = 320; // cap for gauge scaling
const MAX_HP = 1000; // cap for gauge fallback when no speed

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const formatNumber = (v?: number | string, fallback = "—") =>
  v == null || v === "" ? fallback : typeof v === "number" ? new Intl.NumberFormat("en-AE").format(v) : v;

const toTitle = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* Optional gradient by mode id for visual distinction */
const modeGradient = (id: string) => {
  const k = id.toLowerCase();
  if (k.includes("eco") || k.includes("comfort")) return "from-emerald-500/80 to-teal-600/80";
  if (k.includes("sport") || k.includes("power")) return "from-rose-500/80 to-red-600/80";
  if (k.includes("normal") || k.includes("auto")) return "from-sky-500/80 to-cyan-600/80";
  return "from-zinc-500/60 to-zinc-700/60";
};

const buildModeStat = (base: PerformanceModalProps["performance"], mode?: ModeSpec) => {
  const hp = mode?.hp ?? base?.hp;
  const speed = mode?.speed ?? base?.topSpeed;
  const torque = mode?.torque ?? base?.torque;
  const acceleration = mode?.acceleration ?? base?.zeroTo100;

  return { hp, speed, torque, acceleration };
};

const statRows = (perf?: PerformanceModalProps["performance"]) => {
  return [
    { icon: Cog, label: "Transmission", value: perf?.transmission },
    { icon: Gauge, label: "Drivetrain", value: perf?.drivetrain },
    { icon: Zap, label: "Fuel Economy", value: perf?.fuelEconomy },
    perf?.electricRangeKm != null
      ? { icon: Gauge, label: "Electric Range", value: `${formatNumber(perf?.electricRangeKm)} km` }
      : null,
    perf?.batteryCapacityKwh != null
      ? { icon: Zap, label: "Battery", value: `${formatNumber(perf?.batteryCapacityKwh)} kWh` }
      : null,
    { icon: Info, label: "CO₂ Emissions", value: perf?.co2 },
  ].filter(Boolean) as { icon: any; label: string; value?: string }[];
};

/* ---------------------- Component ---------------------- */
const PerformanceModal: React.FC<PerformanceModalProps> = ({ onClose, vehicleName, heroImageSrc, performance }) => {
  const prefersReducedMotion = useReducedMotion();

  // Modes presence is optional
  const modes = performance?.modes?.length ? performance!.modes : [];
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure active index is always valid if modes change
  useEffect(() => {
    if (activeIndex > modes.length - 1) setActiveIndex(0);
  }, [modes.length, activeIndex]);

  const hasModes = modes.length > 0;
  const activeMode = hasModes ? modes[activeIndex] : undefined;
  const current = useMemo(() => buildModeStat(performance, activeMode), [performance, activeMode]);

  const nextMode = () => hasModes && setActiveIndex((i) => (i + 1) % modes.length);
  const prevMode = () => hasModes && setActiveIndex((i) => (i - 1 + modes.length) % modes.length);

  // Keyboard navigation for modes
  useEffect(() => {
    if (!hasModes) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextMode();
      if (e.key === "ArrowLeft") prevMode();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasModes]);

  // Touch gestures only when multiple modes
  const touchHandlers = useTouchGestures(
    hasModes
      ? {
          onSwipeLeft: nextMode,
          onSwipeRight: prevMode,
          threshold: 50,
        }
      : undefined,
  );

  // Gauge uses speed if available, else hp as a fallback
  const gaugeValue = current.speed ?? (current.hp ? (current.hp / MAX_HP) * MAX_SPEED : undefined);

  // Arc math
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const progress = gaugeValue != null ? clamp(gaugeValue, 0, MAX_SPEED) / MAX_SPEED : 0;
  const dashOffset = circumference - circumference * progress;

  /* ------------ UI ------------ */
  return (
    <ModalWrapper title="Performance" onClose={onClose} background="bg-zinc-950">
      {/* HERO / TITLE STRIP */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          {heroImageSrc ? (
            <div
              className="h-36 sm:h-44 md:h-56 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImageSrc})` }}
              aria-hidden
            />
          ) : (
            <div className="h-24 sm:h-28 md:h-32 w-full bg-gradient-to-r from-zinc-800 to-zinc-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
        </div>
        <div className="relative px-5 sm:px-6 md:px-10 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {vehicleName ? `${vehicleName} Performance` : "Performance Overview"}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300">
                Real-world specs may vary by grade, options, and environment.
              </p>
            </div>

            {/* Mode Pills (hidden if no modes) */}
            {hasModes && (
              <div className="flex items-center gap-2">
                <button
                  aria-label="Previous mode"
                  onClick={prevMode}
                  className="rounded-full p-2 bg-zinc-800/70 hover:bg-zinc-700 transition"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[60vw] sm:max-w-none">
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
                      {toTitle(m.label ?? m.id)}
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
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-5 sm:px-6 md:px-10 pb-8 sm:pb-10" {...touchHandlers}>
        {/* Gauge + Value */}
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
                  key={hasModes ? activeMode?.id : "base"}
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
                  modeGradient(activeMode?.id ?? ""),
                ].join(" ")}
              >
                {toTitle(activeMode?.label ?? activeMode?.id ?? "Mode")}
              </div>
            )}
          </div>
        </div>

        {/* Primary Stats */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hasModes ? activeMode?.id : "base-stats"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            <StatCard icon={Zap} label="Horsepower" value={formatNumber(current.hp)} />
            <StatCard icon={Cog} label="Torque (Nm)" value={formatNumber(current.torque)} />
            <StatCard
              icon={Timer}
              label="0–100 km/h"
              value={current.acceleration != null ? `${current.acceleration}s` : "—"}
            />
            <StatCard
              icon={Gauge}
              label="Top Speed"
              value={formatNumber(current.speed)}
              suffix={current.speed != null ? "km/h" : undefined}
            />
          </motion.div>
        </AnimatePresence>

        {/* Secondary / Meta Specs */}
        <div className="mt-6 sm:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {statRows(performance).map(({ icon: I, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3"
              >
                <I className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm text-zinc-400">{label}</div>
                  <div className="text-sm sm:text-base text-zinc-100 truncate">{value ?? "—"}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description / Mode Copy */}
          <div className="mt-6 sm:mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
              {hasModes ? `${toTitle(activeMode?.label ?? activeMode?.id ?? "Mode")} Mode` : "Performance Summary"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {hasModes
                ? (activeMode?.desc ??
                  "Tuned calibration for throttle response and power delivery. Actual behavior may vary by grade and region.")
                : "Core performance figures shown. Availability of specific features (e.g., drive modes) varies by model and trim."}
            </p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

/* ---------------------- Subcomponents ---------------------- */
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ComponentType<React.ComponentProps<"svg">>;
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

export default PerformanceModal;
