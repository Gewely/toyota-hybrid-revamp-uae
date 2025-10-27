"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Info, Star, Check, Wrench, Car as CarIcon, ChevronDown, ArrowRight } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import VehicleGradeComparison from "./VehicleGradeComparison";

/* =========================================================
   Luxury Light v7 — "Showroom Porcelain" (No Dark Mode)
   - Hero: big uppercase headline + amber CTA, right poster
   - Desktop: 7/5 grid (Grade tiles + Decision panel)
   - Mobile: poster-style carousel + compact decision panel
   - Zero sticky; card click only selects (Build stops propagation)
========================================================= */

type EngineOption = {
  name: string;
  power: string;
  torque: string;
  type: string;
  efficiency: string;
};

type GradeSpec = {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  acceleration: string;
  fuelEconomy: string;
};

type Grade = {
  name: string;
  description: string;
  price: number;
  monthlyFrom: number;
  badge: "Value" | "Most Popular" | "Luxury";
  badgeColor: string;
  image: string;
  features: string[];
  specs: GradeSpec;
};

export interface EngineGradeSelectionProps {
  vehicle: VehicleModel;
  onCarBuilder: (gradeName?: string) => void;
  onTestDrive: () => void;
  onGradeSelect: (gradeName: string) => void;
  onGradeComparison?: () => void;
}

type FinanceProgram = "lease" | "hp" | "cashback";

const AEDFmt = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

/* ---------------------- Helpers & Finance ---------------------- */

function roundToStep(n: number, step = 10) {
  return Math.round(n / step) * step;
}

function hpMonthly(price: number, opts: { downPaymentPct: number; annualRate: number; termMonths: number }): number {
  const { downPaymentPct, annualRate, termMonths } = opts;
  const principal = price * (1 - downPaymentPct);
  const r = annualRate / 12;
  if (r <= 0) return roundToStep(principal / termMonths);
  const factor = Math.pow(1 + r, termMonths);
  return roundToStep((principal * r * factor) / (factor - 1));
}

function leaseMonthly(
  price: number,
  opts: { downPaymentPct: number; annualRate: number; termMonths: number; residualPct: number },
): number {
  const { downPaymentPct, annualRate, termMonths, residualPct } = opts;
  const capCost = price * (1 - downPaymentPct);
  const residual = price * residualPct;
  const depreciation = (capCost - residual) / termMonths;
  const moneyFactor = annualRate / 24;
  const financeCharge = (capCost + residual) * moneyFactor;
  return Math.max(0, roundToStep(depreciation + financeCharge));
}

function useDebouncedNumber(value: number, delay = 150) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function track(_event: string, _payload?: Record<string, unknown>) {
  // wire up your analytics here if needed
}

/* ---------------------- Reusable UI ---------------------- */

const Segmented: React.FC<{
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}> = ({ options, value, onChange, ariaLabel }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="relative inline-flex max-w-full items-center gap-1 rounded-3xl bg-white p-1 shadow-sm ring-1 ring-black/5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <AnimatePresence initial={false}>
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <motion.button
              key={opt.id}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.id)}
              className={`relative shrink-0 rounded-2xl px-3 py-2 text-[12px] sm:text-[13px] font-semibold ${
                selected ? "text-white" : "text-zinc-900"
              }`}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
            >
              {selected && (
                <motion.span
                  layoutId="seg-bg"
                  className="absolute inset-0 rounded-2xl"
                  transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                  style={{ background: "linear-gradient(180deg,#161616,#2a2a2a)" }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-[12px] sm:text-sm">
    <span className="text-zinc-600">{label}</span>
    <span className="font-medium text-zinc-900">{value}</span>
  </div>
);

const RangeControl: React.FC<{
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}> = ({ label, min, max, step, value, onChange, format }) => {
  const [input, setInput] = useState<number>(value);
  useEffect(() => setInput(value), [value]);
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs">
        <span className="text-zinc-600">{label}</span>
        <div className="flex items-center gap-2">
          <input
            aria-label={`${label} numeric input`}
            className="h-7 w-20 rounded-md border px-2 text-right text-[11px] sm:text-xs"
            type="number"
            step={step}
            min={min}
            max={max}
            value={Number.isFinite(input) ? input : 0}
            onChange={(e) => setInput(Number(e.target.value))}
            onBlur={() => {
              const clamped = Math.min(max, Math.max(min, Number(input)));
              setInput(clamped);
              onChange(clamped);
            }}
          />
          <span className="font-medium text-zinc-900">{format ? format(value) : String(value)}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-zinc-900"
        aria-label={label}
      />
    </div>
  );
};

const PaymentDonut: React.FC<{ a: number; b: number; label: string }> = ({ a, b, label }) => {
  const total = Math.max(1, a + b);
  const aPct = (a / total) * 100;
  const bPct = 100 - aPct;
  const R = 18;
  const C = 2 * Math.PI * R;
  const aLen = (aPct / 100) * C;
  const bLen = C - aLen;
  return (
    <div className="flex items-center gap-3">
      <svg width="48" height="48" viewBox="0 0 48 48" aria-label={`${label} breakdown`}>
        <circle cx="24" cy="24" r={R} fill="none" stroke="hsl(0 0% 90%)" strokeWidth="6" />
        <circle
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="hsl(0 0% 15%)"
          strokeWidth="6"
          strokeDasharray={`${aLen} ${C - aLen}`}
          strokeDashoffset={C * 0.25}
          strokeLinecap="round"
        />
        <circle
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="hsl(38 92% 50%)"
          strokeWidth="6"
          strokeDasharray={`${bLen} ${C - bLen}`}
          strokeDashoffset={C * 0.25 + aLen}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-[11px] sm:text-xs">
        <div className="font-medium text-zinc-900">{label}</div>
        <div className="text-zinc-600">
          A {aPct.toFixed(0)}% · B {bPct.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Grade Tile (bug-safe) ---------------------- */

const GradeTile: React.FC<{
  vehicleName: string;
  grade: Grade;
  selected: boolean;
  onSelect: () => void;
  onBuild: () => void;
}> = ({ vehicleName, grade, selected, onSelect, onBuild }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30 rounded-3xl"
      aria-pressed={selected}
    >
      <Card
        className={`overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
          selected
            ? "border-amber-400/80 shadow-2xl shadow-amber-200/40 ring-4 ring-amber-200/40"
            : "border-zinc-200 hover:border-amber-300 shadow-lg hover:shadow-xl"
        }`}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-zinc-50 to-white">
            <img
              src={grade.image}
              alt={`${vehicleName} ${grade.name}`}
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />

            {grade.badge && (
              <div className="absolute left-4 top-4">
                <Badge className={`${grade.badgeColor} shadow`}>{grade.badge}</Badge>
              </div>
            )}

            {/* price chip */}
            <div className="absolute right-4 top-4">
              <div className="rounded-full bg-white/95 backdrop-blur border px-3 py-1 text-[12px] font-semibold shadow-sm">
                {AEDFmt.format(grade.price)}
              </div>
            </div>

            {/* hover build (desktop only) */}
            <div className="pointer-events-none absolute inset-0 hidden items-end justify-end p-4 group-hover:flex">
              <Button
                variant="outline"
                size="sm"
                className="pointer-events-auto rounded-full border-zinc-300 bg-white/95 backdrop-blur"
                onClick={(e) => {
                  e.stopPropagation();
                  onBuild();
                }}
              >
                <Wrench className="mr-1 h-4 w-4" /> Build
              </Button>
            </div>

            {/* bottom info band */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/95 via-white/60 to-transparent">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold tracking-wide text-zinc-900 uppercase">{grade.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-700">{grade.description}</p>
                </div>
                {selected && <Check className="h-5 w-5 text-amber-500" aria-label="Selected" />}
              </div>
              <div className="mt-2 text-xs text-zinc-700">from {AEDFmt.format(grade.monthlyFrom)}/mo (est.)</div>
            </div>

            {selected && <div className="absolute inset-0 ring-2 ring-amber-300/70 pointer-events-none" />}
          </div>
        </CardContent>
      </Card>
    </button>
  );
};

/* =============================
   Main Component
============================= */

const EngineGradeSelection: React.FC<EngineGradeSelectionProps> = ({
  vehicle,
  onCarBuilder,
  onTestDrive,
  onGradeSelect,
  onGradeComparison,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // anchor for "Explore the model"
  const gradesRef = useRef<HTMLDivElement | null>(null);

  // Finance state
  const [program, setProgram] = useState<FinanceProgram>("hp");
  const [term, setTerm] = useState<24 | 36 | 48 | 60>(60);
  const [dpPctRaw, setDpPctRaw] = useState(0.2);
  const [aprRaw, setAprRaw] = useState(0.035);
  const [residualPctRaw, setResidualPctRaw] = useState(0.45);
  const [cashbackPctRaw, setCashbackPctRaw] = useState(0.05);

  const dpPct = useDebouncedNumber(dpPctRaw);
  const apr = useDebouncedNumber(aprRaw);
  const residualPct = useDebouncedNumber(residualPctRaw);
  const cashbackPct = useDebouncedNumber(cashbackPctRaw);

  // program-aware defaults & term guard
  useEffect(() => {
    if (program === "lease") {
      if (![24, 36, 48].includes(term)) setTerm(36);
      setDpPctRaw((v) => (v !== 0.1 ? 0.1 : v));
      setAprRaw((v) => (v !== 0.029 ? 0.029 : v));
      setResidualPctRaw((v) => (v !== 0.45 ? 0.45 : v));
    } else if (program === "hp") {
      if (![36, 48, 60].includes(term)) setTerm(60);
      setDpPctRaw((v) => (v !== 0.2 ? 0.2 : v));
      setAprRaw((v) => (v !== 0.035 ? 0.035 : v));
    } else {
      if (![36, 48, 60].includes(term)) setTerm(60);
      setDpPctRaw((v) => (v !== 0.2 ? 0.2 : v));
      setAprRaw((v) => (v !== 0.0325 ? 0.0325 : v));
      setCashbackPctRaw((v) => (v !== 0.05 ? 0.05 : v));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  const allowedTerms = useMemo(
    () => (program === "lease" ? ([24, 36, 48] as const) : ([36, 48, 60] as const)),
    [program],
  );

  // engines
  const engines = useMemo<EngineOption[]>(
    () => [
      { name: "3.5L", power: "295 HP", torque: "263 lb-ft", type: "V6 Dynamic Force", efficiency: "9.2L/100km" },
      { name: "4.0L", power: "270 HP", torque: "278 lb-ft", type: "V6 1GR-FE", efficiency: "11.8L/100km" },
    ],
    [],
  );
  const [selectedEngine, setSelectedEngine] = useState<string>(engines[0]?.name ?? "");

  // monthly calc
  const liveMonthly = useCallback(
    (price: number) => {
      if (program === "lease") {
        return leaseMonthly(price, { termMonths: term, downPaymentPct: dpPct, annualRate: apr, residualPct });
      }
      if (program === "cashback") {
        const effective = Math.max(0, price * (1 - cashbackPct));
        return hpMonthly(effective, { termMonths: term, downPaymentPct: dpPct, annualRate: apr });
      }
      return hpMonthly(price, { termMonths: term, downPaymentPct: dpPct, annualRate: apr });
    },
    [program, term, dpPct, apr, residualPct, cashbackPct],
  );

  // grades
  const [activeGradeName, setActiveGradeName] = useState<string>("XLE");
  const grades: Grade[] = useMemo(() => {
    const baseImage = (vehicle as any).image || (vehicle as any).heroImage || "";
    const basePrice = vehicle.price ?? 0;

    const build = (
      name: string,
      delta: number,
      badge: Grade["badge"],
      badgeColor: string,
      features: string[],
      specs: GradeSpec,
    ): Grade => {
      const price = basePrice + delta;
      return {
        name,
        description:
          name === "SE"
            ? "Essential features for everyday driving."
            : name === "XLE"
              ? "Comfort + technology sweet spot."
              : name === "Limited"
                ? "Luxury features with advanced technology."
                : name === "TRD Off-Road"
                  ? "Adventure-focused capability with TRD hardware."
                  : "Ultimate off-road performance with premium finish.",
        price,
        monthlyFrom: liveMonthly(price),
        badge,
        badgeColor,
        image: baseImage,
        features,
        specs,
      };
    };

    if (selectedEngine === "4.0L") {
      return [
        build(
          "TRD Off-Road",
          20000,
          "Value",
          "bg-blue-100 text-blue-700",
          ["Crawl Control", "Multi-Terrain Select", "Skid Plates", "TRD Wheels", "Locking Rear Diff", "Hill Descent"],
          {
            engine: "4.0L V6 1GR-FE",
            power: "270 HP",
            torque: "278 lb-ft",
            transmission: "5AT",
            acceleration: "8.1s",
            fuelEconomy: "11.8L/100km",
          },
        ),
        build(
          "TRD Pro",
          50000,
          "Most Popular",
          "bg-orange-100 text-orange-700",
          ["Fox Racing Shocks", "TRD Pro Wheels", "Premium Interior", "LED Light Bar", "Skid Plates", "TRD Intake"],
          {
            engine: "4.0L V6 1GR-FE",
            power: "270 HP",
            torque: "278 lb-ft",
            transmission: "5AT",
            acceleration: "8.1s",
            fuelEconomy: "11.8L/100km",
          },
        ),
      ];
    }

    return [
      build(
        "SE",
        0,
        "Value",
        "bg-blue-100 text-blue-700",
        ["LED Headlights", "Smart Key", '8" Display', "Toyota Safety Sense", '17" Alloys', "Rear Camera"],
        {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8AT",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km",
        },
      ),
      build(
        "XLE",
        20000,
        "Most Popular",
        "bg-orange-100 text-orange-700",
        ["Sunroof", "Premium Audio", "Heated Seats", "Wireless Charging", "360° Camera", "Power Tailgate"],
        {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8AT",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km",
        },
      ),
      build(
        "Limited",
        40000,
        "Luxury",
        "bg-purple-100 text-purple-700",
        ["Leather Interior", "JBL", "Head-up Display", "Adaptive Cruise", "Premium Paint", "Ventilated Seats"],
        {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8AT",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km",
        },
      ),
    ];
  }, [selectedEngine, vehicle, liveMonthly]);

  const activeGrade = grades.find((g) => g.name === activeGradeName) ?? grades[0];

  useEffect(() => {
    if (!grades.some((g) => g.name === activeGradeName)) {
      setActiveGradeName(grades[0]?.name ?? "");
    }
  }, [grades, activeGradeName]);

  const termLabel = (t: 24 | 36 | 48 | 60) => (t === 24 ? "2 yrs" : t === 36 ? "3 yrs" : t === 48 ? "4 yrs" : "5 yrs");
  const monthsLabel = (t: 24 | 36 | 48 | 60) => `${t} months`;

  const PROGRAM_OPTS = [
    { id: "lease", label: "Drive-on Lease" },
    { id: "hp", label: "Hire Purchase" },
    { id: "cashback", label: "Cash Back" },
  ] as const;

  const priceForDisplay =
    program === "cashback" ? Math.max(0, activeGrade.price * (1 - (cashbackPct || 0))) : activeGrade.price;
  const estMonthly = liveMonthly(activeGrade.price);

  // preload first few images
  useEffect(() => {
    grades.slice(0, 3).forEach((g) => {
      if (!g?.image) return;
      const img = new Image();
      img.src = g.image;
    });
  }, [grades]);

  /* ---------------------- UI ---------------------- */

  return (
    <section className="relative bg-gradient-to-b from-white via-zinc-50 to-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8">
        {/* HERO — light, showroom-inspired */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center py-10 sm:py-14 md:py-16">
          {/* Left copy */}
          <div className="lg:col-span-6">
            <p className="text-sm font-semibold tracking-[0.2em] text-zinc-600 uppercase">Configure your</p>
            <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight uppercase text-zinc-900">
              {vehicle.name} {activeGrade?.name ?? ""}
            </h1>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="h-12 rounded-xl px-5 text-base font-bold bg-amber-400 hover:bg-amber-500 text-zinc-900"
                onClick={() => onCarBuilder(activeGrade?.name)}
              >
                {/* inline package icon to avoid lucide version issues */}
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="M3.29 7L12 12l8.71-5M12 22V12" />
                </svg>
                Start Configuration
              </Button>

              <Button
                variant="outline"
                className="h-12 rounded-xl px-5 text-base font-bold border-zinc-300 hover:bg-zinc-50"
                onClick={() => {
                  gradesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Explore the Model
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Engine selector */}
            <div className="mt-8">
              <Segmented
                ariaLabel="Select engine"
                options={engines.map((e) => ({ id: e.name, label: `${e.name} · ${e.type}` }))}
                value={selectedEngine}
                onChange={(id) => {
                  setSelectedEngine(id);
                  track("engine_select", { engine: id });
                }}
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                <Info className="h-3.5 w-3.5" />
                <span>Figures are illustrative and may vary by market.</span>
              </div>
            </div>
          </div>

          {/* Right poster */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-tr from-amber-200/40 to-white blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] bg-white ring-1 ring-zinc-200 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
                <div className="aspect-[16/9]">
                  <img
                    src={activeGrade?.image}
                    alt={`${vehicle.name} poster`}
                    className="h-full w-full object-contain"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== CONTENT: DESKTOP grid / MOBILE carousel + Decision Panel ====== */}
        <div id="grades-start" ref={gradesRef} className="py-8 sm:py-10">
          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Grade grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-3 gap-6">
                {grades.map((g) => (
                  <GradeTile
                    key={g.name}
                    vehicleName={vehicle.name}
                    grade={g}
                    selected={g.name === activeGrade.name}
                    onSelect={() => {
                      setActiveGradeName(g.name);
                      onGradeSelect(g.name);
                    }}
                    onBuild={() => onCarBuilder(g.name)}
                  />
                ))}
              </div>
            </div>

            {/* Decision panel */}
            <div className="lg:col-span-5">
              <Card className="rounded-3xl border-0 bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-2">
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-900">{activeGrade.name}</h3>
                    <p className="text-sm text-zinc-600">{activeGrade.description}</p>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <SpecRow label="Engine" value={activeGrade.specs.engine} />
                    <SpecRow label="Power/Torque" value={`${activeGrade.specs.power} • ${activeGrade.specs.torque}`} />
                    <SpecRow label="Transmission" value={activeGrade.specs.transmission} />
                    <SpecRow label="Economy" value={activeGrade.specs.fuelEconomy} />
                  </div>

                  <Separator className="my-4" />

                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-[12px] sm:text-sm text-zinc-600">Finance Program</div>
                    <Segmented
                      ariaLabel="Select finance program"
                      options={PROGRAM_OPTS as unknown as { id: string; label: string }[]}
                      value={program}
                      onChange={(id) => {
                        setProgram(id as FinanceProgram);
                        track("program_select", { program: id });
                      }}
                    />
                  </div>

                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold leading-none text-zinc-900">
                        {AEDFmt.format(priceForDisplay)}
                      </div>
                      <div className="mt-1 text-[12px] sm:text-xs text-zinc-600" aria-live="polite" aria-atomic="true">
                        From {AEDFmt.format(estMonthly)}/mo <span className="opacity-70">(est.)</span>
                      </div>
                      {program === "cashback" && (
                        <div className="mt-1 text-[11px] sm:text-xs text-emerald-700">
                          Cashback: {Math.round((cashbackPct || 0) * 100)}% (
                          {AEDFmt.format(activeGrade.price * (cashbackPct || 0))})
                        </div>
                      )}
                      {program === "lease" && (
                        <div className="mt-1 text-[11px] sm:text-xs text-zinc-700">
                          Residual: {Math.round((residualPct || 0) * 100)}% of MSRP
                        </div>
                      )}
                    </div>
                    {program === "lease" ? (
                      <PaymentDonut a={60} b={40} label="Lease: Depreciation vs Finance" />
                    ) : (
                      <PaymentDonut a={75} b={25} label="HP: Principal vs Interest" />
                    )}
                  </div>

                  <div className="mb-4 grid gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {allowedTerms.map((t) => (
                        <Button
                          key={t}
                          variant={term === t ? "secondary" : "outline"}
                          size="sm"
                          className="rounded-full px-3 py-2"
                          onClick={() => {
                            setTerm(t);
                            track("term_change", { term: t });
                          }}
                        >
                          <div className="leading-tight text-left">
                            <div className="text-[11px] sm:text-xs font-semibold">{termLabel(t)}</div>
                            <div className="text-[10px] opacity-70">{monthsLabel(t)}</div>
                          </div>
                        </Button>
                      ))}
                    </div>

                    <RangeControl
                      label="Down payment"
                      min={program === "lease" ? 0 : 0.1}
                      max={0.5}
                      step={0.05}
                      value={dpPctRaw}
                      onChange={(v) => {
                        setDpPctRaw(v);
                        track("dp_change", { v });
                      }}
                      format={(v) => `${Math.round(v * 100)}%`}
                    />

                    <RangeControl
                      label={program === "lease" ? "APR (for MF calc)" : "APR"}
                      min={0.02}
                      max={0.06}
                      step={0.0025}
                      value={aprRaw}
                      onChange={(v) => {
                        setAprRaw(v);
                        track("apr_change", { v });
                      }}
                      format={(v) => `${(v * 100).toFixed(2)}%`}
                    />

                    {program === "lease" && (
                      <RangeControl
                        label="Residual value"
                        min={0.25}
                        max={0.65}
                        step={0.01}
                        value={residualPctRaw}
                        onChange={(v) => {
                          setResidualPctRaw(v);
                          track("residual_change", { v });
                        }}
                        format={(v) => `${Math.round(v * 100)}%`}
                      />
                    )}

                    {program === "cashback" && (
                      <RangeControl
                        label="Cashback"
                        min={0}
                        max={0.1}
                        step={0.01}
                        value={cashbackPctRaw}
                        onChange={(v) => {
                          setCashbackPctRaw(v);
                          track("cashback_change", { v });
                        }}
                        format={(v) => `${Math.round(v * 100)}%`}
                      />
                    )}
                  </div>

                  <ul className="mb-4 grid list-disc grid-cols-2 gap-x-6 gap-y-1 pl-4 text-[12px] sm:text-sm text-zinc-700">
                    {activeGrade.features.slice(0, 6).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        className="w-full h-10 text-[13px] border-zinc-300 hover:bg-zinc-50"
                        onClick={() => {
                          onCarBuilder(activeGrade.name);
                          track("cta_build_click", {
                            grade: activeGrade.name,
                            price: activeGrade.price,
                            program,
                            term,
                            dpPct,
                            apr,
                          });
                        }}
                      >
                        <Wrench className="mr-1 h-4 w-4" /> Build
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-10 text-[13px] border-zinc-300 hover:bg-zinc-50"
                        onClick={() => {
                          onTestDrive();
                          track("cta_testdrive_click", { grade: activeGrade.name });
                        }}
                      >
                        <CarIcon className="mr-1 h-4 w-4" /> Test Drive
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full h-10"
                      onClick={() => {
                        setIsComparisonOpen(true);
                        track("compare_open", { engine: selectedEngine });
                        onGradeComparison?.();
                      }}
                    >
                      Compare all grades
                    </Button>
                  </div>

                  <p className="mt-4 text-center text-[10.5px] sm:text-[11px] leading-tight text-zinc-600">
                    * Illustrative estimates. Actual offers subject to credit approval & program terms.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile */}
          <div className="block lg:hidden">
            <div className="mb-6">
              <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
                <CarouselContent className="-ml-4">
                  {grades.map((g) => (
                    <CarouselItem key={g.name} className="pl-4 basis-[85%] sm:basis-[70%]">
                      <GradeTile
                        vehicleName={vehicle.name}
                        grade={g}
                        selected={g.name === activeGrade.name}
                        onSelect={() => {
                          setActiveGradeName(g.name);
                          onGradeSelect(g.name);
                        }}
                        onBuild={() => onCarBuilder(g.name)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            <Card className="rounded-3xl border-0 bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-zinc-900">{activeGrade.name}</h3>
                  <p className="text-[13px] text-zinc-600">{activeGrade.description}</p>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-3 text-[13px]">
                  <SpecRow label="Engine" value={activeGrade.specs.engine} />
                  <SpecRow label="Power/Torque" value={`${activeGrade.specs.power} • ${activeGrade.specs.torque}`} />
                  <SpecRow label="Transmission" value={activeGrade.specs.transmission} />
                  <SpecRow label="Economy" value={activeGrade.specs.fuelEconomy} />
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] text-zinc-600">Finance Program</span>
                  <Segmented
                    ariaLabel="Select finance program"
                    options={PROGRAM_OPTS as unknown as { id: string; label: string }[]}
                    value={program}
                    onChange={(id) => {
                      setProgram(id as FinanceProgram);
                      track("program_select", { program: id });
                    }}
                  />
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-extrabold text-zinc-900">{AEDFmt.format(priceForDisplay)}</div>
                  <div className="text-[12px] text-zinc-600">
                    From {AEDFmt.format(estMonthly)}/mo <span className="opacity-70">(est.)</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <MobileCollapsible title="Term & Down Payment" defaultOpen>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {allowedTerms.map((t) => (
                        <Button
                          key={t}
                          variant={term === t ? "secondary" : "outline"}
                          size="sm"
                          className="rounded-full px-3 py-2"
                          onClick={() => setTerm(t)}
                        >
                          <div className="leading-tight text-left">
                            <div className="text-[11px] font-semibold">{termLabel(t)}</div>
                            <div className="text-[10px] opacity-70">{monthsLabel(t)}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <RangeControl
                      label="Down payment"
                      min={program === "lease" ? 0 : 0.1}
                      max={0.5}
                      step={0.05}
                      value={dpPctRaw}
                      onChange={setDpPctRaw}
                      format={(v) => `${Math.round(v * 100)}%`}
                    />
                  </MobileCollapsible>

                  <MobileCollapsible title="Rate & Program Options">
                    <RangeControl
                      label={program === "lease" ? "APR (for MF calc)" : "APR"}
                      min={0.02}
                      max={0.06}
                      step={0.0025}
                      value={aprRaw}
                      onChange={setAprRaw}
                      format={(v) => `${(v * 100).toFixed(2)}%`}
                    />
                    {program === "lease" && (
                      <div className="mt-3">
                        <RangeControl
                          label="Residual value"
                          min={0.25}
                          max={0.65}
                          step={0.01}
                          value={residualPctRaw}
                          onChange={setResidualPctRaw}
                          format={(v) => `${Math.round(v * 100)}%`}
                        />
                      </div>
                    )}
                    {program === "cashback" && (
                      <div className="mt-3">
                        <RangeControl
                          label="Cashback"
                          min={0}
                          max={0.1}
                          step={0.01}
                          value={cashbackPctRaw}
                          onChange={setCashbackPctRaw}
                          format={(v) => `${Math.round(v * 100)}%`}
                        />
                      </div>
                    )}
                  </MobileCollapsible>
                </div>

                <ul className="mt-4 mb-4 grid list-disc grid-cols-1 gap-x-6 gap-y-1 pl-4 text-[13px] text-zinc-700 sm:grid-cols-2">
                  {activeGrade.features.slice(0, 6).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full h-10 text-[13px] border-zinc-300 hover:bg-zinc-50"
                    onClick={() => onCarBuilder(activeGrade.name)}
                  >
                    <Wrench className="mr-1 h-4 w-4" /> Build
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-10 text-[13px] border-zinc-300 hover:bg-zinc-50"
                    onClick={onTestDrive}
                  >
                    <CarIcon className="mr-1 h-4 w-4" /> Test Drive
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-10"
                    onClick={() => {
                      setIsComparisonOpen(true);
                      onGradeComparison?.();
                    }}
                  >
                    Compare all grades
                  </Button>
                </div>

                <p className="mt-4 text-center text-[11px] leading-tight text-zinc-600">
                  * Illustrative estimates. Actual offers subject to credit approval & program terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <VehicleGradeComparison
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        engineName={`${vehicle.name} ${selectedEngine}`}
        grades={grades}
        onGradeSelect={(n) => {
          setIsComparisonOpen(false);
          setActiveGradeName(n);
          onGradeSelect(n);
        }}
        onCarBuilder={(n) => onCarBuilder(n)}
        onTestDrive={onTestDrive}
      />
    </section>
  );
};

/* Compact mobile collapsible (light theme) */
const MobileCollapsible: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border rounded-xl bg-white">
      <button
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-zinc-900"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 pb-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EngineGradeSelection;
