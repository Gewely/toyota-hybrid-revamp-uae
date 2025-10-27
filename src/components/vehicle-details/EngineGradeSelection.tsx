import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { VehicleModel } from "@/types/vehicle";
import VehicleGradeComparison from "./VehicleGradeComparison";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, Car as CarIcon, Check, Star, Wrench } from "lucide-react";
import { useModal } from "@/contexts/ModalProvider";

/* =========================================================
   Luxury Light v6 — Responsive (no sticky anywhere)
   - Reduced red usage (neutral/dark accents)
   - Finance Programs: Drive-on Lease, Hire Purchase, Cash Back
   - Program-aware controls (terms & sliders)
========================================================= */

type EngineOption = {
  name: string;
  power: string;
  torque: string;
  type: string;
  efficiency: string;
};
export interface EngineGradeSelectionProps {
  vehicle: VehicleModel;
  onCarBuilder: (gradeName?: string) => void;
  onTestDrive: () => void;
  onGradeSelect: (gradeName: string) => void;
  onGradeComparison?: () => void;
}
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
type FinanceProgram = "lease" | "hp" | "cashback";
const AEDFmt = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0
});

/* ---------------------- Finance Math ---------------------- */
// Standard amortized payment (Hire Purchase / Cash Back)
function hpMonthly(price: number, opts: {
  downPaymentPct: number;
  annualRate: number;
  termMonths: number;
}): number {
  const {
    downPaymentPct,
    annualRate,
    termMonths
  } = opts;
  const principal = price * (1 - downPaymentPct);
  const r = annualRate / 12;
  if (r <= 0) return Math.round(principal / termMonths);
  const factor = Math.pow(1 + r, termMonths);
  return Math.round(principal * r * factor / (factor - 1));
}

// Simplified lease: monthly = depreciation + finance charge
// moneyFactor ≈ APR(decimal) / 24
function leaseMonthly(price: number, opts: {
  downPaymentPct: number;
  annualRate: number;
  termMonths: number;
  residualPct: number;
}): number {
  const {
    downPaymentPct,
    annualRate,
    termMonths,
    residualPct
  } = opts;
  const capCost = price * (1 - downPaymentPct);
  const residual = price * residualPct;
  const depreciation = (capCost - residual) / termMonths;
  const moneyFactor = annualRate / 24;
  const financeCharge = (capCost + residual) * moneyFactor;
  return Math.max(0, Math.round(depreciation + financeCharge));
}

/* =============================
   Reusable UI
============================= */
const Segmented: React.FC<{
  options: {
    id: string;
    label: string;
  }[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}> = ({
  options,
  value,
  onChange,
  ariaLabel
}) => {
  return <div role="radiogroup" aria-label={ariaLabel} className="relative inline-flex max-w-full items-center gap-1 rounded-3xl bg-white p-1 shadow-sm ring-1 ring-black/5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map(opt => {
      const selected = value === opt.id;
      return <motion.button key={opt.id} role="radio" aria-checked={selected} onClick={() => onChange(opt.id)} className={`relative shrink-0 rounded-2xl px-3 py-2 text-[12px] sm:text-[13px] font-medium ${selected ? "text-white" : "text-foreground"}`} whileTap={{
        scale: 0.98
      }}>
            {selected && <motion.span layoutId="seg-bg" className="absolute inset-0 rounded-2xl"
        // Neutral/dark accent instead of brand red
        style={{
          background: "linear-gradient(180deg,#121212,#1f1f1f)"
        }} />}
            <span className="relative z-10">{opt.label}</span>
          </motion.button>;
    })}
    </div>;
};
const GradeHero: React.FC<{
  vehicleName: string;
  grade: Grade;
}> = ({
  vehicleName,
  grade
}) => <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
    <CardContent className="p-0">
      <div className="relative aspect-[16/9] overflow-hidden">
        <motion.img key={grade.name} src={grade.image} alt={`${vehicleName} ${grade.name}`} className="h-full w-full object-cover" loading="lazy" decoding="async" initial={{
        opacity: 0,
        scale: 1.02
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 1.01
      }} transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }} onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
        {grade.badge && <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            <Badge className={grade.badgeColor}>
              {grade.badge === "Most Popular" && <Star className="mr-1 h-3 w-3" />} {grade.badge}
            </Badge>
          </div>}
      </div>
    </CardContent>
  </Card>;
const SpecRow: React.FC<{
  label: string;
  value: string;
}> = ({
  label,
  value
}) => <div className="flex items-center justify-between text-[12px] sm:text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>;
const RangeControl: React.FC<{
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format
}) => <div className="grid gap-1">
    <div className="flex items-center justify-between text-[11px] sm:text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{format ? format(value) : String(value)}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full accent-zinc-900" aria-label={label} />
  </div>;

/* =============================
   Main
============================= */
const EngineGradeSelection: React.FC<EngineGradeSelectionProps> = ({
  vehicle,
  onCarBuilder,
  onTestDrive,
  onGradeSelect
}) => {
  // Finance program & state
  const [program, setProgram] = useState<FinanceProgram>("hp");
  const [term, setTerm] = useState<24 | 36 | 48 | 60>(60);
  const [dpPct, setDpPct] = useState(0.2);
  const [apr, setApr] = useState(0.035);
  const [residualPct, setResidualPct] = useState(0.45); // Lease only
  const [cashbackPct, setCashbackPct] = useState(0.05); // Cash Back only (5%)

  // Program-aware defaults and term guard
  useEffect(() => {
    if (program === "lease") {
      if (![24, 36, 48].includes(term)) setTerm(36);
      setDpPct(v => v !== 0.1 ? 0.1 : v);
      setApr(v => v !== 0.029 ? 0.029 : v);
      setResidualPct(v => v !== 0.45 ? 0.45 : v);
    } else if (program === "hp") {
      if (![36, 48, 60].includes(term)) setTerm(60);
      setDpPct(v => v !== 0.2 ? 0.2 : v);
      setApr(v => v !== 0.035 ? 0.035 : v);
    } else {
      // cashback
      if (![36, 48, 60].includes(term)) setTerm(60);
      setDpPct(v => v !== 0.2 ? 0.2 : v);
      setApr(v => v !== 0.0325 ? 0.0325 : v);
      setCashbackPct(v => v !== 0.05 ? 0.05 : v);
    }
  }, [program]); // eslint-disable-line react-hooks/exhaustive-deps

  const allowedTerms = useMemo(() => program === "lease" ? [24, 36, 48] : [36, 48, 60] as const, [program]);

  // Engine & grade
  const engines = useMemo<EngineOption[]>(() => [{
    name: "3.5L",
    power: "295 HP",
    torque: "263 lb-ft",
    type: "V6 Dynamic Force",
    efficiency: "9.2L/100km"
  }, {
    name: "4.0L",
    power: "270 HP",
    torque: "278 lb-ft",
    type: "V6 1GR-FE",
    efficiency: "11.8L/100km"
  }], []);
  const [selectedEngine, setSelectedEngine] = useState<string>(engines[0].name);
  const [activeGradeName, setActiveGradeName] = useState<string>("XLE");
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Monthly calc handler (program-aware)
  const liveMonthly = (price: number) => {
    if (program === "lease") {
      return leaseMonthly(price, {
        termMonths: term,
        downPaymentPct: dpPct,
        annualRate: apr,
        residualPct
      });
    }
    if (program === "cashback") {
      const effective = Math.max(0, price * (1 - cashbackPct));
      return hpMonthly(effective, {
        termMonths: term,
        downPaymentPct: dpPct,
        annualRate: apr
      });
    }
    return hpMonthly(price, {
      termMonths: term,
      downPaymentPct: dpPct,
      annualRate: apr
    });
  };
  const grades: Grade[] = useMemo(() => {
    const baseImage = vehicle.image;
    const basePrice = vehicle.price ?? 0;
    const build = (name: string, delta: number, badge: Grade["badge"], badgeColor: string, features: string[], specs: GradeSpec): Grade => {
      const price = basePrice + delta;
      return {
        name,
        description: name === "SE" ? "Essential features for everyday driving." : name === "XLE" ? "Comfort + technology sweet spot." : name === "Limited" ? "Luxury features with advanced technology." : name === "TRD Off-Road" ? "Adventure-focused capability with TRD hardware." : "Ultimate off-road performance with premium finish.",
        price,
        monthlyFrom: liveMonthly(price),
        badge,
        badgeColor,
        image: baseImage,
        features,
        specs
      };
    };
    if (selectedEngine === "4.0L") {
      return [build("TRD Off-Road", 20000, "Value", "bg-blue-100 text-blue-700", ["Crawl Control", "Multi-Terrain Select", "Skid Plates", "TRD Wheels"], {
        engine: "4.0L V6 1GR-FE",
        power: "270 HP",
        torque: "278 lb-ft",
        transmission: "5AT",
        acceleration: "8.1s",
        fuelEconomy: "11.8L/100km"
      }), build("TRD Pro", 50000, "Most Popular", "bg-orange-100 text-orange-700", ["Fox Racing Shocks", "TRD Pro Wheels", "Premium Interior", "LED Light Bar"], {
        engine: "4.0L V6 1GR-FE",
        power: "270 HP",
        torque: "278 lb-ft",
        transmission: "5AT",
        acceleration: "8.1s",
        fuelEconomy: "11.8L/100km"
      })];
    }
    return [build("SE", 0, "Value", "bg-blue-100 text-blue-700", ["LED Headlights", "Smart Key", '8" Display', "Toyota Safety Sense"], {
      engine: "3.5L V6 Dynamic Force",
      power: "295 HP",
      torque: "263 lb-ft",
      transmission: "8AT",
      acceleration: "7.2s",
      fuelEconomy: "9.2L/100km"
    }), build("XLE", 20000, "Most Popular", "bg-orange-100 text-orange-700", ["Sunroof", "Premium Audio", "Heated Seats", "Wireless Charging", "360° Camera"], {
      engine: "3.5L V6 Dynamic Force",
      power: "295 HP",
      torque: "263 lb-ft",
      transmission: "8AT",
      acceleration: "7.2s",
      fuelEconomy: "9.2L/100km"
    }), build("Limited", 40000, "Luxury", "bg-purple-100 text-purple-700", ["Leather Interior", "JBL", "Head-up Display", "Adaptive Cruise", "Premium Paint"], {
      engine: "3.5L V6 Dynamic Force",
      power: "295 HP",
      torque: "263 lb-ft",
      transmission: "8AT",
      acceleration: "7.2s",
      fuelEconomy: "9.2L/100km"
    })];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEngine, vehicle.image, vehicle.price, program, term, dpPct, apr, residualPct, cashbackPct]);
  const activeGrade = grades.find(g => g.name === activeGradeName) ?? grades[0];
  useEffect(() => {
    if (!grades.some(g => g.name === activeGradeName)) setActiveGradeName(grades[0]?.name);
  }, [grades, activeGradeName]);
  const termLabel = (t: 24 | 36 | 48 | 60) => t === 24 ? "2 yrs" : t === 36 ? "3 yrs" : t === 48 ? "4 yrs" : "5 yrs";
  const monthsLabel = (t: 24 | 36 | 48 | 60) => `${t} months`;

  // Program labels
  const PROGRAM_OPTS = [{
    id: "lease",
    label: "Drive-on Lease"
  }, {
    id: "hp",
    label: "Hire Purchase"
  }, {
    id: "cashback",
    label: "Cash Back"
  }] as const;
  const priceForDisplay = program === "cashback" ? Math.max(0, activeGrade.price * (1 - cashbackPct)) : activeGrade.price;
  return <section className="relative bg-gradient-to-b from-background via-muted/20 to-background py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="toyota-container relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8">
        {/* Title */}
        <motion.div initial={{
        opacity: 0,
        y: 16
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }} className="mb-8 sm:mb-10 md:mb-12 text-center">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Configure Your {vehicle.name}
          </motion.h2>
          <motion.p 
            className="mx-auto mt-3 max-w-3xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Select your engine, explore premium grades, and experience luxury in every detail.
          </motion.p>
        </motion.div>

        {/* Engine selector */}
        <motion.div 
          className="mb-8 sm:mb-10 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Segmented ariaLabel="Select engine" options={engines.map(e => ({
            id: e.name,
            label: `${e.name} · ${e.type}`
          }))} value={selectedEngine} onChange={id => setSelectedEngine(id)} />
        </motion.div>

        {/* DESKTOP: Wide horizontal carousel */}
        <div className="hidden lg:block">
          <motion.div 
            className="relative mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="flex items-center gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent [&::-webkit-scrollbar]:h-2">
              {grades.map((g, idx) => {
                const isActive = g.name === activeGrade.name;
                return (
                  <motion.div
                    key={g.name}
                    onClick={() => setActiveGradeName(g.name)}
                    className="flex-shrink-0 w-[420px] snap-center cursor-pointer group"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card className={`overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-primary shadow-2xl shadow-primary/20 ring-4 ring-primary/10' 
                        : 'border-border hover:border-primary/50 shadow-lg hover:shadow-xl'
                    }`}>
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                          <motion.img
                            src={g.image}
                            alt={`${vehicle.name} ${g.name}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                          {g.badge && (
                            <div className="absolute left-4 top-4">
                              <Badge className={`${g.badgeColor} shadow-lg`}>
                                {g.badge === "Most Popular" && <Star className="mr-1 h-3 w-3" />} {g.badge}
                              </Badge>
                            </div>
                          )}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-primary/10"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold mb-2">{g.name} Grade</h3>
                          <p className="text-sm text-muted-foreground mb-3">{g.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-primary">{AEDFmt.format(g.price)}</div>
                              <div className="text-xs text-muted-foreground">or {AEDFmt.format(g.monthlyFrom)}/mo</div>
                            </div>
                            {isActive && <Check className="h-6 w-6 text-primary" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* MOBILE: Carousel */}
        <div className="block lg:hidden mb-8">
          <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
            <CarouselContent className="-ml-4">
              {grades.map((g, idx) => {
                const isActive = g.name === activeGrade.name;
                return (
                  <CarouselItem key={g.name} className="pl-4 basis-[85%] sm:basis-[70%]" onClick={() => setActiveGradeName(g.name)}>
                    <Card className={`overflow-hidden rounded-3xl border-2 transition-all ${
                      isActive ? 'border-primary shadow-xl' : 'border-border'
                    }`}>
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={g.image} alt={`${vehicle.name} ${g.name}`} className="w-full h-full object-cover" />
                          {g.badge && (
                            <div className="absolute left-3 top-3">
                              <Badge className={g.badgeColor}>
                                {g.badge === "Most Popular" && <Star className="mr-1 h-3 w-3" />} {g.badge}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-1">{g.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{g.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xl font-bold text-primary">{AEDFmt.format(g.price)}</div>
                              <div className="text-xs text-muted-foreground">{AEDFmt.format(g.monthlyFrom)}/mo</div>
                            </div>
                            {isActive && <Check className="h-5 w-5 text-primary" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-12 mt-8">
          {/* Decision Panel */}
          <div className="lg:col-span-5 min-w-0">
            <Card className="rounded-3xl border-0 bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
              <CardContent className="p-4 sm:p-6">
                {/* Grade chips */}
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {grades.map(g => {
                  const active = g.name === activeGrade.name;
                  return <motion.button key={g.name} onClick={() => setActiveGradeName(g.name)} className="relative flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[12px] sm:text-sm" whileTap={{
                    scale: 0.98
                  }} aria-pressed={active}>
                        {active && <motion.span layoutId="grade-bg" className="absolute inset-0 rounded-full bg-zinc-900/10" />}
                        <span className="relative z-10 font-medium">{g.name}</span>
                        {active && <Check className="relative z-10 h-4 w-4 text-zinc-900" />}
                      </motion.button>;
                })}
                </div>

                <div className="mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{activeGrade.name} Grade</h3>
                  <p className="text-[12px] sm:text-sm text-muted-foreground">{activeGrade.description}</p>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                  <SpecRow label="Engine" value={activeGrade.specs.engine} />
                  <SpecRow label="Power/Torque" value={`${activeGrade.specs.power} • ${activeGrade.specs.torque}`} />
                  <SpecRow label="Transmission" value={activeGrade.specs.transmission} />
                  <SpecRow label="Economy" value={activeGrade.specs.fuelEconomy} />
                </div>

                <Separator className="my-4" />

                {/* Finance Program */}
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-[12px] sm:text-sm text-muted-foreground">Finance Program</div>
                  <Segmented ariaLabel="Select finance program" options={PROGRAM_OPTS as unknown as {
                  id: string;
                  label: string;
                }[]} value={program} onChange={id => setProgram(id as FinanceProgram)} />
                </div>

                {/* Finance — interactive */}
                <div className="mb-4 grid gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-bold">{AEDFmt.format(priceForDisplay)}</div>
                      <div className="text-[12px] sm:text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
                        From {AEDFmt.format(liveMonthly(activeGrade.price))}/mo{" "}
                        <span className="opacity-70" title="Based on your term, APR, program, and down payment">
                          (est.)
                        </span>
                      </div>
                      {program === "cashback" && <div className="mt-1 text-[11px] sm:text-xs text-emerald-700">
                          Cashback applied: {Math.round(cashbackPct * 100)}% (
                          {AEDFmt.format(activeGrade.price * cashbackPct)})
                        </div>}
                      {program === "lease" && <div className="mt-1 text-[11px] sm:text-xs text-zinc-700">
                          Lease residual: {Math.round(residualPct * 100)}% of MSRP
                        </div>}
                    </div>

                    {/* Terms */}
                    <div className="flex flex-wrap items-center gap-2">
                      {allowedTerms.map(t => <Button key={t} variant={term === t ? "secondary" : "outline"} size="sm" className="rounded-full px-3 py-2" onClick={() => setTerm(t)}>
                          <div className="leading-tight text-left">
                            <div className="text-[11px] sm:text-xs font-semibold">{termLabel(t)}</div>
                            <div className="text-[10px] opacity-70">{monthsLabel(t)}</div>
                          </div>
                        </Button>)}
                    </div>
                  </div>

                  {/* Down payment */}
                  <RangeControl label="Down payment" min={program === "lease" ? 0 : 0.1} max={0.5} step={0.05} value={dpPct} onChange={setDpPct} format={v => `${Math.round(v * 100)}%`} />
                  {/* APR */}
                  <RangeControl label={program === "lease" ? "APR (for MF calc)" : "APR"} min={0.02} max={0.06} step={0.0025} value={apr} onChange={setApr} format={v => `${(v * 100).toFixed(2)}%`} />
                  {/* Residual for Lease */}
                  {program === "lease" && <RangeControl label="Residual value" min={0.25} max={0.65} step={0.01} value={residualPct} onChange={setResidualPct} format={v => `${Math.round(v * 100)}%`} />}
                  {/* Cashback for Cash Back */}
                  {program === "cashback" && <RangeControl label="Cashback" min={0} max={0.1} step={0.01} value={cashbackPct} onChange={setCashbackPct} format={v => `${Math.round(v * 100)}%`} />}
                </div>

                {/* Features */}
                <ul className="mb-4 grid list-disc grid-cols-1 gap-x-6 gap-y-1 pl-4 text-[12px] sm:text-sm text-muted-foreground sm:grid-cols-2">
                  {activeGrade.features.slice(0, 6).map((f, i) => <motion.li key={i} initial={{
                  opacity: 0,
                  x: -6
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: i * 0.04
                }}>
                      {f}
                    </motion.li>)}
                </ul>

                {/* CTAs */}
                <div className="space-y-2 sm:space-y-3">
                  <motion.div whileHover={{
                  y: -1
                }} whileTap={{
                  y: 0
                }}>
                    
                  </motion.div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.div className="flex-1" whileHover={{
                    y: -1
                  }} whileTap={{
                    y: 0
                  }}>
                      <Button variant="outline" className="w-full h-9 sm:h-10 text-[13px] border-zinc-300 hover:bg-zinc-50" onClick={() => onCarBuilder(activeGrade.name)}>
                        <Wrench className="mr-1 h-4 w-4" /> Build
                      </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{
                    y: -1
                  }} whileTap={{
                    y: 0
                  }}>
                      <Button variant="outline" className="w-full h-9 sm:h-10 text-[13px] border-zinc-300 hover:bg-zinc-50" onClick={onTestDrive}>
                        <CarIcon className="mr-1 h-4 w-4" /> Drive
                      </Button>
                    </motion.div>
                  </div>

                  <Button variant="ghost" className="w-full h-9 sm:h-10" onClick={() => setIsComparisonOpen(true)}>
                    Compare all grades
                  </Button>
                </div>

                <p className="mt-4 text-center text-[10.5px] sm:text-[11px] leading-tight text-muted-foreground">
                  * Estimates for illustration. Actual offers subject to credit approval & program terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparison Modal */}
        <VehicleGradeComparison isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} engineName={`${vehicle.name} ${selectedEngine}`} grades={grades} onGradeSelect={n => onGradeSelect(n)} onCarBuilder={n => onCarBuilder(n)} onTestDrive={onTestDrive} />
      </div>
    </section>;
};
export default EngineGradeSelection;