"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Info, Star, Wrench, Car as CarIcon, ArrowRight, ChevronDown } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";
import VehicleGradeComparison from "./VehicleGradeComparison";

/* =========================================================
   Platinum Light v2 — Premium full-stage design
   - Desktop: poster (7/12) + finance (5/12), finance always visible
   - Mobile: poster + compact header; single collapsible for finance
   - All functions preserved; arrows/chips only change grade
   - Light theme, porcelain surfaces, amber primary, subtle depth
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

/* --------- Formatters + Finance --------- */

const AEDFmt = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

const roundToStep = (n: number, step = 10) => Math.round(n / step) * step;

function hpMonthly(price: number, opts: { downPaymentPct: number; annualRate: number; termMonths: number }): number {
  const { downPaymentPct, annualRate, termMonths } = opts;
  const principal = price * (1 - downPaymentPct);
  const r = annualRate / 12;
  if (r <= 0) return roundToStep(principal / termMonths);
  const f = Math.pow(1 + r, termMonths);
  return roundToStep((principal * r * f) / (f - 1));
}

function leaseMonthly(
  price: number,
  opts: { downPaymentPct: number; annualRate: number; termMonths: number; residualPct: number },
): number {
  const { downPaymentPct, annualRate, termMonths, residualPct } = opts;
  const capCost = price * (1 - downPaymentPct);
  const residual = price * residualPct;
  const depreciation = (capCost - residual) / termMonths;
  const moneyFactor = annualRate / 24; // APR(decimal)/24
  const financeCharge = (capCost + residual) * moneyFactor;
  return Math.max(0, roundToStep(depreciation + financeCharge));
}

/* --------- UI atoms --------- */

const Segmented: React.FC<{
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}> = ({ options, value, onChange, ariaLabel }) => {
  const rm = useReducedMotion();
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-3xl bg-white p-1 shadow-sm ring-1 ring-black/5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <AnimatePresence initial={false}>
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <motion.button
              key={opt.id}
              role="radio"
              aria-checked={selected}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`relative shrink-0 rounded-2xl px-3 py-2 text-[12px] sm:text-[13px] font-semibold ${
                selected ? "text-white" : "text-zinc-900"
              }`}
              whileTap={{ scale: rm ? 1 : 0.98 }}
            >
              {selected && (
                <motion.span
                  layoutId="seg-bg"
                  className="absolute inset-0 rounded-2xl"
                  transition={{ duration: rm ? 0 : 0.2 }}
                  // black pill when selected (like your ref)
                  style={{ background: "linear-gradient(180deg,#111,#232323)" }}
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
  onChange: (v: number) => void;
  format?: (v: number) => string;
}> = ({ label, min, max, step, value, onChange, format }) => (
  <div className="grid gap-2">
    <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs">
      <span className="text-zinc-600">{label}</span>
      <span className="font-medium text-zinc-900">{format ? format(value) : String(value)}</span>
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

/* --------- Mobile collapsible --------- */

const MobileCollapsible: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 rounded-xl border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold"
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
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // --- Finance state
  const [program, setProgram] = useState<FinanceProgram>("hp");
  const [term, setTerm] = useState<24 | 36 | 48 | 60>(60);
  const [dpPct, setDpPct] = useState(0.2);
  const [apr, setApr] = useState(0.035);
  const [residualPct, setResidualPct] = useState(0.45);
  const [cashbackPct, setCashbackPct] = useState(0.05);

  useEffect(() => {
    if (program === "lease") {
      if (![24, 36, 48].includes(term)) setTerm(36);
      setDpPct(0.1);
      setApr(0.029);
      setResidualPct(0.45);
    } else if (program === "hp") {
      if (![36, 48, 60].includes(term)) setTerm(60);
      setDpPct(0.2);
      setApr(0.035);
    } else {
      if (![36, 48, 60].includes(term)) setTerm(60);
      setDpPct(0.2);
      setApr(0.0325);
      setCashbackPct(0.05);
    }
  }, [program, term]);

  const allowedTerms = useMemo(
    () => (program === "lease" ? ([24, 36, 48] as const) : ([36, 48, 60] as const)),
    [program],
  );

  // --- Engines
  const engines = useMemo<EngineOption[]>(
    () => [
      { name: "3.5L", power: "295 HP", torque: "263 lb-ft", type: "V6 Dynamic Force", efficiency: "9.2L/100km" },
      { name: "4.0L", power: "270 HP", torque: "278 lb-ft", type: "V6 1GR-FE", efficiency: "11.8L/100km" },
    ],
    [],
  );
  const [selectedEngine, setSelectedEngine] = useState<string>(engines[0].name);

  // --- Monthly calc
  const monthly = useCallback(
    (price: number) => {
      if (program === "lease")
        return leaseMonthly(price, { termMonths: term, downPaymentPct: dpPct, annualRate: apr, residualPct });
      if (program === "cashback") {
        const effective = Math.max(0, price * (1 - cashbackPct));
        return hpMonthly(effective, { termMonths: term, downPaymentPct: dpPct, annualRate: apr });
      }
      return hpMonthly(price, { termMonths: term, downPaymentPct: dpPct, annualRate: apr });
    },
    [program, term, dpPct, apr, residualPct, cashbackPct],
  );

  // --- Grades (engine-aware)
  const [activeGradeName, setActiveGradeName] = useState<string>("Limited");
  const grades: Grade[] = useMemo(() => {
    const baseImage = (vehicle as any)?.image || (vehicle as any)?.heroImage || "/images/vehicle-fallback.png";
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
        monthlyFrom: monthly(price),
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
  }, [selectedEngine, vehicle, monthly]);

  // keep active grade valid after engine change
  useEffect(() => {
    if (!grades.some((g) => g.name === activeGradeName)) {
      setActiveGradeName(grades[0]?.name ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grades]);

  const activeIndex = Math.max(
    0,
    grades.findIndex((g) => g.name === activeGradeName),
  );
  const activeGrade = grades[activeIndex] ?? grades[0];

  const selectIndex = (i: number) => {
    const next = (i + grades.length) % grades.length;
    const name = grades[next].name;
    setActiveGradeName(name);
    onGradeSelect(name);
  };

  const termLabel = (t: 24 | 36 | 48 | 60) => (t === 24 ? "3 yrs" : t === 36 ? "4 yrs" : t === 48 ? "5 yrs" : "5 yrs");

  const programOpts = [
    { id: "lease", label: "Lease" },
    { id: "hp", label: "Hire Purchase" },
    { id: "cashback", label: "Cash Back" },
  ] as const;

  const priceForDisplay =
    program === "cashback" ? Math.max(0, activeGrade.price * (1 - cashbackPct)) : activeGrade.price;

  const estMonthly = useMemo(() => monthly(activeGrade.price), [activeGrade.price, monthly]);

  // preload poster images
  useEffect(() => {
    grades.slice(0, 3).forEach((g) => {
      if (!g?.image) return;
      const img = new Image();
      img.src = g.image;
    });
  }, [grades]);

  return (
    <section className="bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(253,224,71,0.10),transparent)]">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {/* Top controls */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Grade chips */}
          <div className="flex overflow-x-auto gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {grades.map((g, i) => (
              <button
                key={g.name}
                type="button"
                onClick={() => selectIndex(i)}
                className={`rounded-full border px-3 py-2 text-sm font-medium shadow-sm ${
                  i === activeIndex
                    ? "border-amber-300 bg-amber-50 text-zinc-900"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
                aria-pressed={i === activeIndex}
              >
                {g.name}
              </button>
            ))}
          </div>

          {/* Engine Selector - ULTRA COMPACT */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">Select Your Engine</h3>
            
            {/* Horizontal Toggle Buttons */}
            <div className="flex gap-2 mb-3">
              {engines.map((engine) => {
                const isSelected = selectedEngine === engine.name;
                return (
                  <button
                    key={engine.name}
                    onClick={() => setSelectedEngine(engine.name)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white shadow-lg'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {engine.name}
                  </button>
                );
              })}
            </div>

            {/* Selected Engine Details - Compact */}
            <AnimatePresence mode="wait">
              {engines.filter(e => e.name === selectedEngine).map(engine => (
                <motion.div
                  key={engine.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[10px] text-zinc-600 uppercase tracking-wide">{engine.type}</div>
                      <div className="text-base font-bold text-zinc-900">{engine.name}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5">
                      {engine.efficiency}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 backdrop-blur rounded-lg p-2">
                      <div className="text-[9px] text-zinc-500">Power</div>
                      <div className="text-lg font-bold text-amber-600">{engine.power}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur rounded-lg p-2">
                      <div className="text-[9px] text-zinc-500">Torque</div>
                      <div className="text-lg font-bold text-amber-600">{engine.torque}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ====== Desktop: poster + finance ====== */}
        <div className="mt-6 hidden lg:block">
          <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* Poster */}
            <div className="col-span-7">
              <div className="relative h-full overflow-hidden rounded-[28px] ring-1 ring-zinc-200 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
                {/* arrows — change grade only */}
                <button
                  type="button"
                  aria-label="Previous grade"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectIndex(activeIndex - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/90 backdrop-blur p-2 shadow hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next grade"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectIndex(activeIndex + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/90 backdrop-blur p-2 shadow hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Badge + price chip */}
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                  {activeGrade.badge && (
                    <Badge className={`${activeGrade.badgeColor}`}>
                      {activeGrade.badge === "Most Popular" && <Star className="mr-1 h-3 w-3" />}
                      {activeGrade.badge}
                    </Badge>
                  )}
                  <div className="rounded-full bg-white/95 backdrop-blur border px-3 py-1 text-[12px] font-semibold shadow-sm">
                    {AEDFmt.format(activeGrade.price)}
                  </div>
                </div>

                {/* Poster image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGrade.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="aspect-[16/9] w-full">
                      <img
                        src={activeGrade.image}
                        alt={`${vehicle.name} ${activeGrade.name}`}
                        className="h-full w-full object-contain"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Start Configuration — big amber CTA under poster */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                  <Button
                    type="button"
                    className="rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-900 shadow-lg"
                    onClick={() => onCarBuilder(activeGrade.name)}
                  >
                    Start Configuration <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Finance panel */}
            <div className="col-span-5">
              <Card className="rounded-[28px] border-0 bg-white p-1 shadow-[0_16px_44px_rgba(0,0,0,0.08)] h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 uppercase">
                        {vehicle.name} {activeGrade.name}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-600">{activeGrade.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">From</div>
                      <div className="text-2xl font-extrabold text-zinc-900">
                        {AEDFmt.format(
                          program === "cashback"
                            ? Math.max(0, activeGrade.price * (1 - cashbackPct))
                            : activeGrade.price,
                        )}
                      </div>
                      <div className="text-xs text-zinc-600">{AEDFmt.format(estMonthly)}/mo est.</div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <SpecRow label="Engine" value={activeGrade.specs.engine} />
                    <SpecRow label="Power/Torque" value={`${activeGrade.specs.power} • ${activeGrade.specs.torque}`} />
                    <SpecRow label="Transmission" value={activeGrade.specs.transmission} />
                    <SpecRow label="Economy" value={activeGrade.specs.fuelEconomy} />
                  </div>

                  <Separator className="my-5" />

                  {/* Program segmented */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">Finance Program</span>
                    <Segmented
                      ariaLabel="Select finance program"
                      options={programOpts as unknown as { id: string; label: string }[]}
                      value={program}
                      onChange={(id) => setProgram(id as FinanceProgram)}
                    />
                  </div>

                  {/* Terms + sliders */}
                  <div className="mt-4 grid gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {allowedTerms.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTerm(t)}
                          className={`rounded-full px-3 py-2 text-sm border ${
                            term === t ? "bg-red-500 text-white border-red-500" : "border-zinc-300 hover:bg-zinc-50"
                          }`}
                          aria-pressed={term === t}
                        >
                          {t === 24 ? "3 yrs" : t === 36 ? "4 yrs" : t === 48 ? "5 yrs" : "5 yrs"}
                        </button>
                      ))}
                    </div>

                    <RangeControl
                      label="Down payment"
                      min={program === "lease" ? 0 : 0.1}
                      max={0.5}
                      step={0.05}
                      value={dpPct}
                      onChange={setDpPct}
                      format={(v) => `${Math.round(v * 100)}%`}
                    />
                    <RangeControl
                      label={program === "lease" ? "APR (MF base)" : "APR"}
                      min={0.02}
                      max={0.06}
                      step={0.0025}
                      value={apr}
                      onChange={setApr}
                      format={(v) => `${(v * 100).toFixed(2)}%`}
                    />
                    {program === "lease" && (
                      <RangeControl
                        label="Residual value"
                        min={0.25}
                        max={0.65}
                        step={0.01}
                        value={residualPct}
                        onChange={setResidualPct}
                        format={(v) => `${Math.round(v * 100)}%`}
                      />
                    )}
                    {program === "cashback" && (
                      <RangeControl
                        label="Cashback"
                        min={0}
                        max={0.1}
                        step={0.01}
                        value={cashbackPct}
                        onChange={setCashbackPct}
                        format={(v) => `${Math.round(v * 100)}%`}
                      />
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mt-4 grid list-disc grid-cols-2 gap-x-6 gap-y-1 pl-4 text-[12px] sm:text-sm text-zinc-700">
                    {activeGrade.features.slice(0, 6).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="mt-auto pt-5 grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => onCarBuilder(activeGrade.name)}
                    >
                      <Wrench className="mr-1 h-4 w-4" /> Build
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                      onClick={onTestDrive}
                    >
                      <CarIcon className="mr-1 h-4 w-4" /> Test Drive
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-10 rounded-xl text-red-600 hover:text-red-700"
                      onClick={() => {
                        setIsComparisonOpen(true);
                        onGradeComparison?.();
                      }}
                    >
                      Compare all grades
                    </Button>
                  </div>

                  <p className="mt-3 text-[11px] text-zinc-600">
                    <Info className="inline-block -mt-1 mr-1 h-3.5 w-3.5" />
                    Figures are illustrative and may vary by market.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* ====== Mobile: compact ====== */}
        <div className="mt-6 lg:hidden">
          <div className="overflow-hidden rounded-[22px] ring-1 ring-zinc-200 bg-white shadow">
            <div className="relative">
              {/* arrows — grade only */}
              <button
                type="button"
                aria-label="Previous grade"
                onClick={() => selectIndex(activeIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/90 backdrop-blur p-1.5 shadow"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next grade"
                onClick={() => selectIndex(activeIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/90 backdrop-blur p-1.5 shadow"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* badge & price */}
              <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                {activeGrade.badge && (
                  <Badge className={`${activeGrade.badgeColor}`}>
                    {activeGrade.badge === "Most Popular" && <Star className="mr-1 h-3 w-3" />}
                    {activeGrade.badge}
                  </Badge>
                )}
                <div className="rounded-full bg-white/95 backdrop-blur border px-2.5 py-1 text-[11px] font-semibold shadow-sm">
                  {AEDFmt.format(activeGrade.price)}
                </div>
              </div>

              <img
                src={activeGrade.image}
                alt={`${vehicle.name} ${activeGrade.name}`}
                className="w-full h-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </div>

            <Card className="border-0 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold uppercase">{activeGrade.name}</h2>
                    <p className="text-xs text-zinc-600 line-clamp-2">{activeGrade.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500">From</div>
                    <div className="text-base font-extrabold">{AEDFmt.format(priceForDisplay)}</div>
                    <div className="text-[11px] text-zinc-600">{AEDFmt.format(estMonthly)}/mo</div>
                  </div>
                </div>

                {/* grade chips */}
                <div className="mt-3 flex overflow-x-auto gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {grades.map((g, i) => (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => selectIndex(i)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] ${
                        i === activeIndex ? "border-amber-300 bg-amber-50" : "border-zinc-300"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>

                {/* concise specs */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                  <SpecRow label="Engine" value={activeGrade.specs.engine} />
                  <SpecRow label="Power/Torque" value={`${activeGrade.specs.power} • ${activeGrade.specs.torque}`} />
                </div>

                {/* single collapsible keeps mobile short */}
                <MobileCollapsible title="Finance Options">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[13px] text-zinc-600">Program</span>
                    <Segmented
                      ariaLabel="Select finance program"
                      options={[
                        { id: "lease", label: "Lease" },
                        { id: "hp", label: "HP" },
                        { id: "cashback", label: "Cash" },
                      ]}
                      value={program}
                      onChange={(id) => setProgram(id as FinanceProgram)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {allowedTerms.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTerm(t)}
                          className={`rounded-full px-3 py-2 text-sm border ${
                            term === t ? "bg-red-500 text-white border-red-500" : "border-zinc-300"
                          }`}
                          aria-pressed={term === t}
                        >
                          {t === 24 ? "3 yrs" : t === 36 ? "4 yrs" : t === 48 ? "5 yrs" : "5 yrs"}
                        </button>
                      ))}
                    </div>

                    <RangeControl
                      label="Down payment"
                      min={program === "lease" ? 0 : 0.1}
                      max={0.5}
                      step={0.05}
                      value={dpPct}
                      onChange={setDpPct}
                      format={(v) => `${Math.round(v * 100)}%`}
                    />
                    <RangeControl
                      label={program === "lease" ? "APR (MF)" : "APR"}
                      min={0.02}
                      max={0.06}
                      step={0.0025}
                      value={apr}
                      onChange={setApr}
                      format={(v) => `${(v * 100).toFixed(2)}%`}
                    />
                    {program === "lease" && (
                      <RangeControl
                        label="Residual"
                        min={0.25}
                        max={0.65}
                        step={0.01}
                        value={residualPct}
                        onChange={setResidualPct}
                        format={(v) => `${Math.round(v * 100)}%`}
                      />
                    )}
                    {program === "cashback" && (
                      <RangeControl
                        label="Cashback"
                        min={0}
                        max={0.1}
                        step={0.01}
                        value={cashbackPct}
                        onChange={setCashbackPct}
                        format={(v) => `${Math.round(v * 100)}%`}
                      />
                    )}
                  </div>
                </MobileCollapsible>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-red-300 text-red-600"
                    onClick={() => onCarBuilder(activeGrade.name)}
                  >
                    <Wrench className="mr-1 h-4 w-4" /> Build
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-red-300 text-red-600"
                    onClick={onTestDrive}
                  >
                    <CarIcon className="mr-1 h-4 w-4" /> Drive
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="col-span-2 h-10 text-red-600"
                    onClick={() => {
                      setIsComparisonOpen(true);
                      onGradeComparison?.();
                    }}
                  >
                    Compare all grades
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Comparison modal/sheet */}
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

export default EngineGradeSelection;
