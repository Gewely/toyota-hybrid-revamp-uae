import React, { useEffect, useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VehicleModel } from "@/types/vehicle";
import VehicleGradeComparison from "./VehicleGradeComparison";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, Car as CarIcon, Check, Star, Wrench } from "lucide-react";

/* =========================================================
   Luxury Light v4 — "Porcelain+" (no dark mode)
   Upgrades: animated segmented pill, cross-fade hero, finance sliders,
   magnetic CTAs, sticky mobile summary with live monthly, a11y polish
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
      className="relative inline-flex items-center rounded-3xl bg-white p-1 shadow-sm ring-1 ring-black/5"
    >
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className="relative rounded-2xl px-4 py-2 text-sm font-medium text-foreground"
            whileTap={{ scale: 0.98 }}
          >
            {/* animated pill background */}
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
          <div className="absolute left-4 top-4">
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
  <div className="flex items-center justify-between text-sm">
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
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{format ? format(value) : value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-primary"
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
  const isMobile = useIsMobile();
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

  return (
    <section className="bg-[linear-gradient(180deg,#FAFAFC_0%,#F4F6F8_100%)] py-12 lg:py-20">
      <div className="toyota-container">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight">Configure Your {vehicle.name}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Pick an engine, compare grades, and tailor the perfect setup. Finance shown updates live.
          </p>
        </motion.div>

        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* Visual / Gallery */}
          <div className="lg:col-span-7">
            {/* Engine segmented control */}
            <div className="mb-4 flex items-center justify-center lg:justify-start">
              <Segmented
                ariaLabel="Select engine"
                options={engines.map((e) => ({ id: e.name, label: `${e.name} · ${e.type}` }))}
                value={selectedEngine}
                onChange={(id) => setSelectedEngine(id)}
              />
            </div>

            {/* Grade visual with crossfade */}
            {isMobile ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {grades.map((g) => (
                    <CarouselItem key={g.name}>
                      <GradeHero vehicleName={vehicle.name} grade={g} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : (
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
            )}
          </div>

          {/* Decision Panel */}
          <div className="lg:col-span-5">
            <Card className="sticky top-20 rounded-3xl border-0 bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
              <CardContent className="p-6">
                {/* Grade chips with highlight */}
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {grades.map((g) => {
                    const active = g.name === activeGrade.name;
                    return (
                      <motion.button
                        key={g.name}
                        onClick={() => setActiveGradeName(g.name)}
                        className="relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
                        whileTap={{ scale: 0.98 }}
                      >
                        {active && (
                          <motion.span layoutId="grade-bg" className="absolute inset-0 rounded-full bg-primary/10" />
                        )}
                        <span className="relative z-10 font-medium">{g.name}</span>
                        <span
                          className={[
                            "relative z-10 rounded-full px-2 py-0.5 text-[10px]",
                            g.badge === "Most Popular"
                              ? "bg-orange-100 text-orange-700"
                              : g.badge === "Luxury"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700",
                          ].join(" ")}
                        >
                          {g.badge}
                        </span>
                        {active && <Check className="relative z-10 h-4 w-4 text-primary" />}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mb-3">
                  <h3 className="text-xl font-semibold tracking-tight">{activeGrade.name} Grade</h3>
                  <p className="text-sm text-muted-foreground">{activeGrade.description}</p>
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
                      <div className="text-2xl font-bold">{AEDFmt.format(activeGrade.price)}</div>
                      <div className="text-xs text-muted-foreground">
                        From {AEDFmt.format(liveMonthly(activeGrade.price))}/month
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {[36, 48, 60].map((t) => (
                        <Button
                          key={t}
                          variant={term === t ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                          onClick={() => setTerm(t as 36 | 48 | 60)}
                        >
                          {t}m
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
                <ul className="mb-4 grid list-disc grid-cols-1 gap-x-6 gap-y-1 pl-4 text-sm text-muted-foreground sm:grid-cols-2">
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

                {/* CTAs — magnetic */}
                <div className="space-y-3">
                  <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                    <Button
                      className="w-full"
                      onClick={() => onGradeSelect(activeGrade.name)}
                      aria-label={`Select ${activeGrade.name}`}
                    >
                      Select {activeGrade.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                  <div className="flex gap-2">
                    <motion.div className="flex-1" whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                      <Button variant="outline" className="w-full" onClick={() => onCarBuilder(activeGrade.name)}>
                        <Wrench className="mr-1 h-4 w-4" /> Build
                      </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                      <Button variant="outline" className="w-full" onClick={() => onTestDrive()}>
                        <CarIcon className="mr-1 h-4 w-4" /> Drive
                      </Button>
                    </motion.div>
                  </div>
                  <Button variant="ghost" className="w-full" onClick={() => setIsComparisonOpen(true)}>
                    Compare all grades
                  </Button>
                </div>

                <p className="mt-4 text-center text-[11px] leading-tight text-muted-foreground">
                  * Live estimate based on your inputs. Subject to credit approval.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile sticky summary */}
        {isMobile && (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
            <div className="pointer-events-auto rounded-3xl border-0 bg-white p-3 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{activeGrade.name}</div>
                  <div className="text-xs text-muted-foreground">
                    From {AEDFmt.format(liveMonthly(activeGrade.price))}/mo
                  </div>
                </div>
                <div className="text-base font-semibold">{AEDFmt.format(activeGrade.price)}</div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => onGradeSelect(activeGrade.name)}>
                  Select
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsComparisonOpen(true)}>
                  Compare
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Modal */}
        <VehicleGradeComparison
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          engineName={`${vehicle.name} ${selectedEngine}`}
          grades={grades}
          onGradeSelect={(n) => onGradeSelect(n)}
          onCarBuilder={(n) => onCarBuilder(n)}
          onTestDrive={() => onTestDrive()}
        />
      </div>
    </section>
  );
};

export default EngineGradeSelection;
