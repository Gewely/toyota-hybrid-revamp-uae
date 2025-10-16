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

/* =========================================================
   Luxury Light v5 — "Porcelain+" (No Sticky Anywhere)
   - CSS-gated hero to avoid SSR mismatch
   - Full-width mobile carousel items
   - Smaller mobile typography and controls
   - Clean finance copy; no floating/sticky UI
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
  monthlyFrom: number; // base, overridden by live finance controls in UI
  badge: "Value" | "Most Popular" | "Luxury";
  badgeColor: string;
  image: string;
  features: string[];
  specs: GradeSpec;
};

const AEDFmt = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

function monthlyPayment(
  price: number,
  opts: { downPaymentPct?: number; annualRate?: number; termMonths?: number } = {},
): number {
  const { downPaymentPct = 0.2, annualRate = 0.035, termMonths = 60 } = opts;
  const principal = price * (1 - downPaymentPct);
  const r = annualRate / 12;
  if (r <= 0) return Math.round(principal / termMonths);
  const factor = Math.pow(1 + r, termMonths);
  return Math.round((principal * r * factor) / (factor - 1));
}

/* =============================
   Reusable UI
============================= */
const Segmented: React.FC<{
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}> = ({ options, value, onChange, ariaLabel }) => {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="relative inline-flex max-w-full items-center gap-1 rounded-3xl bg-white p-1 shadow-sm ring-1 ring-black/5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className="relative shrink-0 rounded-2xl px-3 py-2 text-[12.5px] sm:text-[13px] font-medium text-foreground"
            whileTap={{ scale: 0.98 }}
          >
            {selected && (
              <motion.span
                layoutId="seg-bg"
                className="absolute inset-0 rounded-2xl"
                style={{ background: "#EB0A1E" }}
              />
            )}
            <span className={selected ? "relative z-10 text-white" : "relative z-10"}>{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

const GradeHero: React.FC<{ vehicleName: string; grade: Grade }> = ({ vehicleName, grade }) => (
  <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
    <CardContent className="p-0">
      <div className="relative aspect-[16/9] overflow-hidden">
        <motion.img
          key={grade.name}
          src={grade.image}
          alt={`${vehicleName} ${grade.name}`}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        {grade.badge && (
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            <Badge className={grade.badgeColor}>
              {grade.badge === "Most Popular" && <Star className="mr-1 h-3 w-3" />} {grade.badge}
            </Badge>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-[12.5px] sm:text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
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
}> = ({ label, min, max, step, value, onChange, format }) => (
  <div className="grid gap-1">
    <div className="flex items-center justify-between text-[12px] sm:text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{format ? format(value) : String(value)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-primary"
      aria-label={label}
    />
  </div>
);

/* =============================
   Main
============================= */
const EngineGradeSelection: React.FC<EngineGradeSelectionProps> = ({
  vehicle,
  onCarBuilder,
  onTestDrive,
  onGradeSelect,
}) => {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // live finance controls
  const [term, setTerm] = useState<36 | 48 | 60>(60);
  const [dpPct, setDpPct] = useState(0.2);
  const [apr, setApr] = useState(0.035);

  const engines = useMemo<EngineOption[]>(
    () => [
      { name: "3.5L", power: "295 HP", torque: "263 lb-ft", type: "V6 Dynamic Force", efficiency: "9.2L/100km" },
      { name: "4.0L", power: "270 HP", torque: "278 lb-ft", type: "V6 1GR-FE", efficiency: "11.8L/100km" },
    ],
    [],
  );

  const [selectedEngine, setSelectedEngine] = useState<string>(engines[0].name);
  const [activeGradeName, setActiveGradeName] = useState<string>("XLE");

  const grades: Grade[] = useMemo(() => {
    const baseImage = vehicle.image;
    const basePrice = vehicle.price ?? 0;

    if (selectedEngine === "4.0L") {
      return [
        {
          name: "TRD Off-Road",
          description: "Adventure-focused capability with TRD hardware.",
          price: basePrice + 20000,
          monthlyFrom: monthlyPayment(basePrice + 20000, { termMonths: term, downPaymentPct: dpPct, annualRate: apr }),
          badge: "Value",
          badgeColor: "bg-blue-100 text-blue-700",
          image: baseImage,
          features: ["Crawl Control", "Multi-Terrain Select", "Skid Plates", "TRD Wheels"],
          specs: {
            engine: "4.0L V6 1GR-FE",
            power: "270 HP",
            torque: "278 lb-ft",
            transmission: "5AT",
            acceleration: "8.1s",
            fuelEconomy: "11.8L/100km",
          },
        },
        {
          name: "TRD Pro",
          description: "Ultimate off-road performance with premium finish.",
          price: basePrice + 50000,
          monthlyFrom: monthlyPayment(basePrice + 50000, { termMonths: term, downPaymentPct: dpPct, annualRate: apr }),
          badge: "Most Popular",
          badgeColor: "bg-orange-100 text-orange-700",
          image: baseImage,
          features: ["Fox Racing Shocks", "TRD Pro Wheels", "Premium Interior", "LED Light Bar"],
          specs: {
            engine: "4.0L V6 1GR-FE",
            power: "270 HP",
            torque: "278 lb-ft",
            transmission: "5AT",
            acceleration: "8.1s",
            fuelEconomy: "11.8L/100km",
          },
        },
      ];
    }

    return [
      {
        name: "SE",
        description: "Essential features for everyday driving.",
        price: basePrice,
        monthlyFrom: monthlyPayment(basePrice, { termMonths: term, downPaymentPct: dpPct, annualRate: apr }),
        badge: "Value",
        badgeColor: "bg-blue-100 text-blue-700",
        image: baseImage,
        features: ["LED Headlights", "Smart Key", '8" Display', "Toyota Safety Sense"],
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8AT",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km",
        },
      },
      {
        name: "XLE",
        description: "Comfort + technology sweet spot.",
        price: basePrice + 20000,
        monthlyFrom: monthlyPayment(basePrice + 20000, { termMonths: term, downPaymentPct: dpPct, annualRate: apr }),
        badge: "Most Popular",
        badgeColor: "bg-orange-100 text-orange-700",
        image: baseImage,
        features: ["Sunroof", "Premium Audio", "Heated Seats", "Wireless Charging", "360° Camera"],
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8AT",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km",
        },
      },
      {
        name: "Limited",
        description: "Luxury features with advanced technology.",
        price: basePrice + 40000,
        monthlyFrom: monthlyPayment(basePrice + 40000, { termMonths: term, downPaymentPct: dpPct, annualRate: apr }),
        badge: "Luxury",
        badgeColor: "bg-purple-100 text-purple-700",
        image: baseImage,
        features: ["Leather Interior", "JBL", "Head-up Display", "Adaptive Cruise", "Premium Paint"],
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8AT",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km",
        },
      },
    ];
  }, [selectedEngine, term, dpPct, apr, vehicle.image, vehicle.price]);

  const activeGrade = grades.find((g) => g.name === activeGradeName) ?? grades[0];

  useEffect(() => {
    if (!grades.some((g) => g.name === activeGradeName)) setActiveGradeName(grades[0]?.name);
  }, [grades, activeGradeName]);

  const liveMonthly = (price: number) =>
    monthlyPayment(price, { termMonths: term, downPaymentPct: dpPct, annualRate: apr });

  const termLabel = (t: 36 | 48 | 60) => (t === 36 ? "3 yrs" : t === 48 ? "4 yrs" : "5 yrs");
  const monthsLabel = (t: 36 | 48 | 60) => `${t} months`;

  return (
    <section className="bg-[linear-gradient(180deg,#FAFAFC_0%,#F4F6F8_100%)] py-10 md:py-16">
      <div className="toyota-container mx-auto max-w-7xl px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8 text-center"
        >
          <h2 className="text-[22px] sm:text-3xl md:text-4xl font-bold tracking-tight">
            Configure Your {vehicle.name}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-[12.5px] sm:text-sm text-muted-foreground">
            Pick an engine, compare grades, and tailor the perfect setup. Finance shown updates live.
          </p>
        </motion.div>

        <div className="grid items-start gap-5 md:gap-6 lg:grid-cols-12">
          {/* Visual / Gallery */}
          <div className="lg:col-span-7">
            {/* Engine segmented control */}
            <div className="mb-3 md:mb-4 flex items-center justify-center lg:justify-start">
              <Segmented
                ariaLabel="Select engine"
                options={engines.map((e) => ({ id: e.name, label: `${e.name} · ${e.type}` }))}
                value={selectedEngine}
                onChange={(id) => setSelectedEngine(id)}
              />
            </div>

            {/* Grade visual */}
            <div className="block lg:hidden">
              <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
                <CarouselContent>
                  {grades.map((g) => (
                    <CarouselItem key={g.name} className="basis-full">
                      <GradeHero vehicleName={vehicle.name} grade={g} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            <div className="hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${activeGrade.name}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  <GradeHero vehicleName={vehicle.name} grade={activeGrade} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Decision Panel (normal flow, NOT sticky) */}
          <div className="lg:col-span-5">
            <Card className="rounded-3xl border-0 bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
              <CardContent className="p-4 sm:p-6">
                {/* Grade chips */}
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {grades.map((g) => {
                    const active = g.name === activeGrade.name;
                    return (
                      <motion.button
                        key={g.name}
                        onClick={() => setActiveGradeName(g.name)}
                        className="relative flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[12.5px] sm:text-sm"
                        whileTap={{ scale: 0.98 }}
                        aria-pressed={active}
                      >
                        {active && (
                          <motion.span layoutId="grade-bg" className="absolute inset-0 rounded-full bg-primary/10" />
                        )}
                        <span className="relative z-10 font-medium">{g.name}</span>
                        {active && <Check className="relative z-10 h-4 w-4 text-primary" />}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{activeGrade.name} Grade</h3>
                  <p className="text-[12.5px] sm:text-sm text-muted-foreground">{activeGrade.description}</p>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                  <SpecRow label="Engine" value={activeGrade.specs.engine} />
                  <SpecRow label="Power/Torque" value={`${activeGrade.specs.power} • ${activeGrade.specs.torque}`} />
                  <SpecRow label="Transmission" value={activeGrade.specs.transmission} />
                  <SpecRow label="Economy" value={activeGrade.specs.fuelEconomy} />
                </div>

                <Separator className="my-4" />

                {/* Finance — interactive */}
                <div className="mb-4 grid gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold">{AEDFmt.format(activeGrade.price)}</div>
                      <div
                        className="text-[12px] sm:text-xs text-muted-foreground"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        From {AEDFmt.format(liveMonthly(activeGrade.price))}/mo{" "}
                        <span className="opacity-70" title="Based on your term, APR, and down payment">
                          (est.)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {[36, 48, 60].map((t) => (
                        <Button
                          key={t}
                          variant={term === t ? "default" : "outline"}
                          size="sm"
                          className="rounded-full px-3 py-2"
                          onClick={() => setTerm(t as 36 | 48 | 60)}
                        >
                          <div className="leading-tight text-left">
                            <div className="text-[11px] sm:text-xs font-semibold">{termLabel(t as 36 | 48 | 60)}</div>
                            <div className="text-[10px] opacity-70">{monthsLabel(t as 36 | 48 | 60)}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <RangeControl
                    label="Down payment"
                    min={0.1}
                    max={0.5}
                    step={0.05}
                    value={dpPct}
                    onChange={setDpPct}
                    format={(v) => `${Math.round(v * 100)}%`}
                  />
                  <RangeControl
                    label="APR"
                    min={0.02}
                    max={0.06}
                    step={0.0025}
                    value={apr}
                    onChange={setApr}
                    format={(v) => `${(v * 100).toFixed(2)}%`}
                  />
                </div>

                {/* Features */}
                <ul className="mb-4 grid list-disc grid-cols-1 gap-x-6 gap-y-1 pl-4 text-[12.5px] sm:text-sm text-muted-foreground sm:grid-cols-2">
                  {activeGrade.features.slice(0, 6).map((f, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {f}
                    </motion.li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="space-y-3">
                  <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                    <Button className="w-full" onClick={() => onCarBuilder(activeGrade.name)}>
                      <Wrench className="mr-2 h-4 w-4" />
                      Build your {vehicle.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>

                  <div className="flex gap-2">
                    <motion.div className="flex-1" whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                      <Button
                        variant="outline"
                        className="w-full text-[13px]"
                        onClick={() => onCarBuilder(activeGrade.name)}
                      >
                        <Wrench className="mr-1 h-4 w-4" /> Build
                      </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                      <Button variant="outline" className="w-full text-[13px]" onClick={onTestDrive}>
                        <CarIcon className="mr-1 h-4 w-4" /> Drive
                      </Button>
                    </motion.div>
                  </div>

                  <Button variant="ghost" className="w-full" onClick={() => setIsComparisonOpen(true)}>
                    Compare all grades
                  </Button>
                </div>

                <p className="mt-4 text-center text-[10.5px] sm:text-[11px] leading-tight text-muted-foreground">
                  * Live estimate based on your inputs. Subject to credit approval.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparison Modal */}
        <VehicleGradeComparison
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          engineName={`${vehicle.name} ${selectedEngine}`}
          grades={grades}
          onGradeSelect={(n) => onGradeSelect(n)}
          onCarBuilder={(n) => onCarBuilder(n)}
          onTestDrive={onTestDrive}
        />
      </div>
    </section>
  );
};

export default EngineGradeSelection;
