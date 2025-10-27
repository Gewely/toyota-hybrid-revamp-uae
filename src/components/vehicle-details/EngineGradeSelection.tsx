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
  Sparkles,
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
          "bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0",
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
          "bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0",
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
        "bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0",
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
        "bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0",
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
        "bg-gradient-to-br from-purple-600 to-pink-500 text-white border-0",
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Mobile-first header */}
        <div className="px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                    {vehicle.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Configure your dream vehicle</p>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-3 py-1 text-xs whitespace-nowrap">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </Badge>
              </div>

              {/* Engine selector - mobile optimized */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
                {engines.map((eng) => (
                  <motion.button
                    key={eng.name}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedEngine(eng.name)}
                    className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all shadow-lg ${
                      selectedEngine === eng.name
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-200"
                        : "bg-white/80 backdrop-blur text-gray-700 hover:bg-white shadow-gray-200"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-black">{eng.name}</div>
                    <div className="text-[10px] sm:text-xs opacity-90">{eng.power}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main content - mobile-first layout */}
        <div className="px-3 sm:px-4 lg:px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            {/* Mobile: Stacked layout */}
            <div className="lg:hidden space-y-4">
              {/* Vehicle showcase card */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                {/* Grade selector - mobile horizontal scroll */}
                <div className="mb-3 overflow-x-auto scrollbar-hide -mx-3 px-3">
                  <div className="inline-flex gap-2 min-w-full pb-2">
                    {grades.map((g, i) => (
                      <motion.button
                        key={g.name}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectIndex(i)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                          i === activeIndex
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-200"
                            : "bg-white/70 backdrop-blur text-gray-700 hover:bg-white"
                        }`}
                      >
                        {g.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Image card with rounded corners */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-300/50 overflow-hidden border border-white/50">
                  {/* Badge overlay */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <Badge className={`${activeGrade.badgeColor} shadow-lg px-3 py-1.5 text-xs font-bold`}>
                      {activeGrade.badge === "Most Popular" && <Star className="mr-1.5 h-3.5 w-3.5 fill-current" />}
                      {activeGrade.badge}
                    </Badge>
                    <div className="bg-white/95 backdrop-blur rounded-full px-3 py-1.5 text-xs font-black text-gray-900 shadow-lg">
                      {AEDFmt.format(activeGrade.price)}
                    </div>
                  </div>

                  {/* Navigation arrows */}
                  <button
                    onClick={() => selectIndex(activeIndex - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-white transition-all active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-900" />
                  </button>
                  <button
                    onClick={() => selectIndex(activeIndex + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-white transition-all active:scale-95"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-900" />
                  </button>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeGrade.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="aspect-[4/3] sm:aspect-[16/9]"
                    >
                      <img
                        src={activeGrade.image}
                        alt={`${vehicle.name} ${activeGrade.name}`}
                        className="w-full h-full object-contain p-4"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Specs grid - mobile 2x2 */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { icon: Zap, label: "Power", value: activeGrade.specs.power, color: "from-blue-500 to-cyan-500" },
                    {
                      icon: Gauge,
                      label: "0-100",
                      value: activeGrade.specs.acceleration,
                      color: "from-amber-500 to-orange-500",
                    },
                    {
                      icon: Fuel,
                      label: "Economy",
                      value: activeGrade.specs.fuelEconomy,
                      color: "from-emerald-500 to-teal-500",
                    },
                    {
                      icon: Settings,
                      label: "Trans",
                      value: activeGrade.specs.transmission,
                      color: "from-purple-500 to-pink-500",
                    },
                  ].map((spec, idx) => {
                    const Icon = spec.icon;
                    return (
                      <motion.div
                        key={idx}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/70 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/50"
                      >
                        <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${spec.color} mb-2`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-lg sm:text-xl font-black text-gray-900">{spec.value}</div>
                        <div className="text-[11px] text-gray-600 font-medium">{spec.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Price & Info card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Starting from</div>
                    <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {AEDFmt.format(priceForDisplay)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Per month</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {AEDFmt.format(estMonthly)}
                    </div>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-bold text-gray-900 mb-3">Key Features</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {activeGrade.features.slice(0, 6).map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs text-gray-700 font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA buttons - mobile stacked */}
                <div className="space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onCarBuilder(activeGrade.name)}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Wrench className="h-4 w-4" />
                    Start Configuration
                  </motion.button>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={onTestDrive}
                      className="py-3 px-4 bg-white/90 backdrop-blur text-gray-900 rounded-2xl font-bold text-sm shadow-lg hover:bg-white transition-all"
                    >
                      Test Drive
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setFinanceDrawerOpen(true)}
                      className="py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 flex items-center justify-center gap-1"
                    >
                      Finance
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Desktop: Side-by-side layout */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  {/* Grade selector */}
                  <div className="absolute top-6 left-6 right-6 z-20 flex justify-center">
                    <div className="inline-flex gap-3 p-2 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50">
                      {grades.map((g, i) => (
                        <motion.button
                          key={g.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => selectIndex(i)}
                          className={`relative px-8 py-3 rounded-2xl font-bold transition-all ${
                            i === activeIndex ? "text-white" : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          {i === activeIndex && (
                            <motion.div
                              layoutId="desktopActiveGrade"
                              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <span className="relative z-10">{g.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="absolute top-6 left-6 z-20">
                    <Badge className={`${activeGrade.badgeColor} shadow-2xl px-5 py-2 text-sm font-bold`}>
                      {activeGrade.badge === "Most Popular" && <Star className="mr-2 h-4 w-4 fill-current" />}
                      {activeGrade.badge}
                    </Badge>
                  </div>

                  <button
                    onClick={() => selectIndex(activeIndex - 1)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/90 backdrop-blur shadow-2xl hover:bg-white transition-all hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-900" />
                  </button>
                  <button
                    onClick={() => selectIndex(activeIndex + 1)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/90 backdrop-blur shadow-2xl hover:bg-white transition-all hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-900" />
                  </button>

                  <div className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden">
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
                          className="w-full h-full object-contain p-8"
                        />
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-8 left-8 right-8 grid grid-cols-4 gap-4">
                      {[
                        {
                          icon: Zap,
                          label: "Power",
                          value: activeGrade.specs.power,
                          color: "from-blue-500 to-cyan-500",
                        },
                        {
                          icon: Gauge,
                          label: "0-100",
                          value: activeGrade.specs.acceleration,
                          color: "from-amber-500 to-orange-500",
                        },
                        {
                          icon: Fuel,
                          label: "Economy",
                          value: activeGrade.specs.fuelEconomy,
                          color: "from-emerald-500 to-teal-500",
                        },
                        {
                          icon: Settings,
                          label: "Trans",
                          value: activeGrade.specs.transmission,
                          color: "from-purple-500 to-pink-500",
                        },
                      ].map((spec, idx) => {
                        const Icon = spec.icon;
                        return (
                          <motion.div
                            key={idx}
                            whileHover={{ y: -8, scale: 1.05 }}
                            className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50"
                          >
                            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${spec.color} mb-2`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-xl font-black text-gray-900">{spec.value}</div>
                            <div className="text-xs text-gray-600 font-medium">{spec.label}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onCarBuilder(activeGrade.name)}
                      className="flex-1 py-5 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-300 hover:shadow-3xl transition-all"
                    >
                      <Wrench className="inline-block mr-2 h-5 w-5" />
                      Start Configuration
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onTestDrive}
                      className="py-5 px-8 bg-white/90 backdrop-blur-xl text-gray-900 rounded-2xl font-bold border-2 border-gray-200 hover:bg-white hover:border-gray-300 transition-all shadow-xl"
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
                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
                    <div className="text-xs text-gray-500 mb-2">Starting from</div>
                    <div className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                      {AEDFmt.format(priceForDisplay)}
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50">
                      <div className="text-sm text-gray-700 font-medium">Monthly from</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {AEDFmt.format(estMonthly)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
                    <h3 className="text-gray-900 font-black text-xl mb-4">Key Features</h3>
                    <div className="space-y-3">
                      {activeGrade.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFinanceDrawerOpen(true)}
                    className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold shadow-2xl shadow-orange-300 hover:shadow-3xl transition-all"
                  >
                    Customize Finance Options
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </motion.button>

                  <button
                    onClick={() => {
                      setIsComparisonOpen(true);
                      onGradeComparison?.();
                    }}
                    className="w-full py-3 text-gray-600 hover:text-gray-900 transition-all text-sm font-semibold"
                  >
                    Compare all grades →
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Drawer */}
      <AnimatePresence>
        {financeDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFinanceDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 w-full lg:max-w-2xl bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 z-50 overflow-y-auto rounded-t-3xl lg:rounded-none shadow-2xl"
            >
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Finance Options</h2>
                  <button
                    onClick={() => setFinanceDrawerOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-all"
                  >
                    <X className="h-6 w-6 text-gray-900" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="text-gray-700 text-sm font-bold mb-3 block">Finance Program</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { id: "lease", label: "Lease" },
                      { id: "hp", label: "Hire Purchase" },
                      { id: "cashback", label: "Cash Back" },
                    ].map((opt) => (
                      <motion.button
                        key={opt.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProgram(opt.id as FinanceProgram)}
                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm ${
                          program === opt.id
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-gray-700 text-sm font-bold mb-3 block">Loan Term</label>
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {allowedTerms.map((t) => (
                      <motion.button
                        key={t}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTerm(t)}
                        className={`flex-1 min-w-[80px] p-3 sm:p-4 rounded-xl sm:rounded-2xl font-bold transition-all text-sm ${
                          term === t
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200"
                            : "bg-white text-gray-700 border-2 border-gray-200"
                        }`}
                      >
                        {t}m
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5 mb-6">
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex justify-between mb-3">
                      <label className="text-gray-700 text-sm font-bold">Down Payment</label>
                      <span className="text-gray-900 font-black">{Math.round(dpPct * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={program === "lease" ? 0 : 0.1}
                      max={0.5}
                      step={0.05}
                      value={dpPct}
                      onChange={(e) => setDpPct(parseFloat(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex justify-between mb-3">
                      <label className="text-gray-700 text-sm font-bold">Interest Rate (APR)</label>
                      <span className="text-gray-900 font-black">{(apr * 100).toFixed(2)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.02}
                      max={0.06}
                      step={0.0025}
                      value={apr}
                      onChange={(e) => setApr(parseFloat(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {program === "lease" && (
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="flex justify-between mb-3">
                        <label className="text-gray-700 text-sm font-bold">Residual Value</label>
                        <span className="text-gray-900 font-black">{Math.round(residualPct * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.25}
                        max={0.65}
                        step={0.01}
                        value={residualPct}
                        onChange={(e) => setResidualPct(parseFloat(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  )}

                  {program === "cashback" && (
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="flex justify-between mb-3">
                        <label className="text-gray-700 text-sm font-bold">Cashback</label>
                        <span className="text-gray-900 font-black">{Math.round(cashbackPct * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={0.1}
                        step={0.01}
                        value={cashbackPct}
                        onChange={(e) => setCashbackPct(parseFloat(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-5 sm:p-6 mb-6 border border-amber-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                    <div className="text-gray-700 font-bold">Estimated Monthly Payment</div>
                    <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {AEDFmt.format(estMonthly)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <Info className="h-4 w-4 flex-shrink-0" />
                    <span>Estimates are illustrative and may vary by market conditions</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setFinanceDrawerOpen(false);
                    onCarBuilder(activeGrade.name);
                  }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-300 hover:shadow-3xl transition-all"
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
