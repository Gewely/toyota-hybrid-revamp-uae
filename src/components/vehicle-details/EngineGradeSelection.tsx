"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Star,
  Wrench,
  ArrowRight,
  Zap,
  Gauge,
  Fuel,
  Settings,
  X,
  Check,
} from "lucide-react";

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
  vehicle: any;
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

const roundToStep = (n: number, step = 10) => Math.round(n / step) * step;

function hpMonthly(price: number, opts: { downPaymentPct: number; annualRate: number; termMonths: number }): number {
  const downPaymentPct = opts.downPaymentPct;
  const annualRate = opts.annualRate;
  const termMonths = opts.termMonths;
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
  const downPaymentPct = opts.downPaymentPct;
  const annualRate = opts.annualRate;
  const termMonths = opts.termMonths;
  const residualPct = opts.residualPct;
  const capCost = price * (1 - downPaymentPct);
  const residual = price * residualPct;
  const depreciation = (capCost - residual) / termMonths;
  const moneyFactor = annualRate / 24;
  const financeCharge = (capCost + residual) * moneyFactor;
  return Math.max(0, roundToStep(depreciation + financeCharge));
}

const EngineGradeSelection: React.FC<EngineGradeSelectionProps> = (props) => {
  const vehicle = props.vehicle;
  const onCarBuilder = props.onCarBuilder;
  const onTestDrive = props.onTestDrive;
  const onGradeSelect = props.onGradeSelect;
  const onGradeComparison = props.onGradeComparison;

  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [financeDrawerOpen, setFinanceDrawerOpen] = useState(false);
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

  const allowedTerms = useMemo(() => {
    if (program === "lease") {
      return [24, 36, 48] as const;
    }
    return [36, 48, 60] as const;
  }, [program]);

  const engines = useMemo<EngineOption[]>(
    () => [
      { name: "3.5L", power: "295 HP", torque: "263 lb-ft", type: "V6 Dynamic Force", efficiency: "9.2L/100km" },
      { name: "4.0L", power: "270 HP", torque: "278 lb-ft", type: "V6 1GR-FE", efficiency: "11.8L/100km" },
    ],
    [],
  );

  const [selectedEngine, setSelectedEngine] = useState<string>(engines[0].name);

  const monthly = useCallback(
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

  const [activeGradeName, setActiveGradeName] = useState<string>("Limited");

  const grades: Grade[] = useMemo(() => {
    const baseImage = vehicle?.image || vehicle?.heroImage || "/images/vehicle-fallback.png";
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
          "bg-blue-500/10 text-blue-400 border-blue-400/30",
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
          "bg-amber-500/10 text-amber-400 border-amber-400/30",
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
        "bg-blue-500/10 text-blue-400 border-blue-400/30",
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
        "bg-amber-500/10 text-amber-400 border-amber-400/30",
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
        "bg-purple-500/10 text-purple-400 border-purple-400/30",
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

  useEffect(() => {
    if (!grades.some((g) => g.name === activeGradeName)) {
      setActiveGradeName(grades[0]?.name ?? "");
    }
  }, [grades, activeGradeName]);

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

  const priceForDisplay =
    program === "cashback" ? Math.max(0, activeGrade.price * (1 - cashbackPct)) : activeGrade.price;
  const estMonthly = useMemo(() => monthly(activeGrade.price), [activeGrade.price, monthly]);

  useEffect(() => {
    grades.slice(0, 3).forEach((g) => {
      if (!g?.image) return;
      const img = new Image();
      img.src = g.image;
    });
  }, [grades]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">{vehicle.name}</h1>
            <p className="text-slate-400 mt-1">Configure your perfect drive</p>
          </div>

          <div className="flex gap-2">
            {engines.map((eng) => (
              <motion.button
                key={eng.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEngine(eng.name)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${selectedEngine === eng.name ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50" : "bg-white/5 text-slate-400 hover:bg-white/10 backdrop-blur-xl border border-white/10"}`}
              >
                <div className="text-sm">{eng.name}</div>
                <div className="text-xs opacity-75">{eng.power}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="absolute top-6 left-6 right-6 z-20 flex justify-center">
                <div className="flex gap-3 p-2 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-x-auto">
                  {grades.map((g, i) => (
                    <motion.button
                      key={g.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => selectIndex(i)}
                      className={`relative px-6 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap ${i === activeIndex ? "text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      {i === activeIndex && (
                        <motion.div
                          layoutId="activeGrade"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{g.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="absolute top-6 left-6 z-20">
                <Badge className={`${activeGrade.badgeColor} border backdrop-blur-xl px-4 py-2 text-sm font-semibold`}>
                  {activeGrade.badge === "Most Popular" && <Star className="mr-2 h-4 w-4 fill-current" />}
                  {activeGrade.badge}
                </Badge>
              </div>

              <button
                onClick={() => selectIndex(activeIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-black/60 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => selectIndex(activeIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-black/60 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGrade.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-[16/9]"
                  >
                    <img
                      src={activeGrade.image}
                      alt={`${vehicle.name} ${activeGrade.name}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10"
                  >
                    <Zap className="h-5 w-5 text-blue-400 mb-2" />
                    <div className="text-white font-bold text-lg">{activeGrade.specs.power}</div>
                    <div className="text-slate-400 text-xs">Power</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10"
                  >
                    <Gauge className="h-5 w-5 text-amber-400 mb-2" />
                    <div className="text-white font-bold text-lg">{activeGrade.specs.acceleration}</div>
                    <div className="text-slate-400 text-xs">0-100</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10"
                  >
                    <Fuel className="h-5 w-5 text-green-400 mb-2" />
                    <div className="text-white font-bold text-lg">{activeGrade.specs.fuelEconomy}</div>
                    <div className="text-slate-400 text-xs">Economy</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10"
                  >
                    <Settings className="h-5 w-5 text-purple-400 mb-2" />
                    <div className="text-white font-bold text-lg">{activeGrade.specs.transmission}</div>
                    <div className="text-slate-400 text-xs">Trans</div>
                  </motion.div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCarBuilder(activeGrade.name)}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
                >
                  <Wrench className="inline-block mr-2 h-5 w-5" />
                  Start Configuration
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onTestDrive}
                  className="py-4 px-6 bg-white/5 backdrop-blur-xl text-white rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all"
                >
                  Test Drive
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-8 space-y-4"
            >
              <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10">
                <div className="text-slate-400 text-sm mb-2">Starting from</div>
                <div className="text-5xl font-bold text-white mb-4">{AEDFmt.format(priceForDisplay)}</div>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl">
                  <div className="text-slate-400">Monthly from</div>
                  <div className="text-2xl font-bold text-amber-400">{AEDFmt.format(estMonthly)}/mo</div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10">
                <h3 className="text-white font-bold text-xl mb-4">Key Features</h3>
                <div className="space-y-3">
                  {activeGrade.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFinanceDrawerOpen(true)}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 transition-all"
              >
                Customize Finance Options
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </motion.button>

              <button
                onClick={() => {
                  setIsComparisonOpen(true);
                  onGradeComparison?.();
                }}
                className="w-full py-3 text-slate-400 hover:text-white transition-all text-sm"
              >
                Compare all grades →
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {financeDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFinanceDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 z-50 overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Finance Options</h2>
                  <button
                    onClick={() => setFinanceDrawerOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                <div className="mb-8">
                  <label className="text-slate-400 text-sm mb-3 block">Finance Program</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "lease", label: "Lease" },
                      { id: "hp", label: "Hire Purchase" },
                      { id: "cashback", label: "Cash Back" },
                    ].map((opt) => (
                      <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProgram(opt.id as FinanceProgram)}
                        className={`p-4 rounded-2xl font-semibold transition-all ${program === opt.id ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg" : "bg-white/5 text-slate-400 border border-white/10"}`}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-slate-400 text-sm mb-3 block">Loan Term</label>
                  <div className="flex gap-3">
                    {allowedTerms.map((t) => (
                      <motion.button
                        key={t}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTerm(t)}
                        className={`flex-1 p-4 rounded-2xl font-semibold transition-all ${term === t ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white" : "bg-white/5 text-slate-400 border border-white/10"}`}
                      >
                        {t} months
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-slate-400 text-sm">Down Payment</label>
                      <span className="text-white font-bold">{Math.round(dpPct * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={program === "lease" ? 0 : 0.1}
                      max={0.5}
                      step={0.05}
                      value={dpPct}
                      onChange={(e) => setDpPct(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-slate-400 text-sm">Interest Rate (APR)</label>
                      <span className="text-white font-bold">{(apr * 100).toFixed(2)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.02}
                      max={0.06}
                      step={0.0025}
                      value={apr}
                      onChange={(e) => setApr(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {program === "lease" && (
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-slate-400 text-sm">Residual Value</label>
                        <span className="text-white font-bold">{Math.round(residualPct * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.25}
                        max={0.65}
                        step={0.01}
                        value={residualPct}
                        onChange={(e) => setResidualPct(parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  )}

                  {program === "cashback" && (
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-slate-400 text-sm">Cashback</label>
                        <span className="text-white font-bold">{Math.round(cashbackPct * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={0.1}
                        step={0.01}
                        value={cashbackPct}
                        onChange={(e) => setCashbackPct(parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-8 p-6 bg-black/40 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-slate-400">Estimated Monthly Payment</div>
                    <div className="text-4xl font-bold text-amber-400">{AEDFmt.format(estMonthly)}</div>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Estimates are illustrative and may vary by market conditions
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFinanceDrawerOpen(false);
                    onCarBuilder(activeGrade.name);
                  }}
                  className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold shadow-lg"
                >
                  Apply & Continue to Configuration
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EngineGradeSelection;
