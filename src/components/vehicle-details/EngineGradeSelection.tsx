import React, { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
   Luxury Light v3 — "Porcelain" theme (no dark mode)
   - Softer radii, airy spacing, premium shadows
   - Clear hierarchy; sticky mobile summary; proper engine selector
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
  const id = useId();
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      id={id}
      className="relative inline-flex items-center rounded-3xl border bg-white p-1 shadow-sm ring-1 ring-black/5"
    >
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={[
              "relative z-10 px-4 py-2 text-sm font-medium transition-all",
              "rounded-2xl",
              selected ? "text-white" : "text-foreground hover:bg-muted",
            ].join(" ")}
            style={selected ? { background: "#EB0A1E" } : undefined}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

const GradeHero: React.FC<{ vehicleName: string; grade: Grade }> = ({ vehicleName, grade }) => (
  <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
    <CardContent className="p-0">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={grade.image}
          alt={`${vehicleName} ${grade.name}`}
          className="h-full w-full object-cover transition-transform duration-500 will-change-transform hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        {grade.badge && (
          <div className="absolute left-4 top-4">
            <Badge
              className={
                grade.badge === "Most Popular"
                  ? "bg-orange-100 text-orange-700"
                  : grade.badge === "Luxury"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
              }
            >
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
  const [term, setTerm] = useState<36 | 48 | 60>(60);

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
          monthlyFrom: monthlyPayment(basePrice + 20000, { termMonths: term }),
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
          monthlyFrom: monthlyPayment(basePrice + 50000, { termMonths: term }),
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
        monthlyFrom: monthlyPayment(basePrice, { termMonths: term }),
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
        monthlyFrom: monthlyPayment(basePrice + 20000, { termMonths: term }),
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
        monthlyFrom: monthlyPayment(basePrice + 40000, { termMonths: term }),
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
  }, [selectedEngine, term, vehicle.image, vehicle.price]);

  const activeGrade = grades.find((g) => g.name === activeGradeName) ?? grades[0];

  React.useEffect(() => {
    if (!grades.some((g) => g.name === activeGradeName)) setActiveGradeName(grades[0]?.name);
  }, [grades, activeGradeName]);

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
            Pick an engine, compare grades, and tailor the perfect setup. Finance shown is an estimate.*
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

            {/* Grade visual */}
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
              <GradeHero vehicleName={vehicle.name} grade={activeGrade} />
            )}
          </div>

          {/* Decision Panel */}
          <div className="lg:col-span-5">
            <Card className="sticky top-20 rounded-3xl border-0 bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
              <CardContent className="p-6">
                {/* Grade chips */}
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {grades.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => setActiveGradeName(g.name)}
                      className={[
                        "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                        g.name === activeGrade.name ? "border-primary bg-primary/10" : "hover:bg-muted",
                      ].join(" ")}
                    >
                      <span className="font-medium">{g.name}</span>
                      {g.badge && (
                        <span
                          className={[
                            "rounded-full px-2 py-0.5 text-[10px]",
                            g.badge === "Most Popular"
                              ? "bg-orange-100 text-orange-700"
                              : g.badge === "Luxury"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700",
                          ].join(" ")}
                        >
                          {g.badge}
                        </span>
                      )}
                      {g.name === activeGrade.name && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
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

                {/* Finance */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{AEDFmt.format(activeGrade.price)}</div>
                    <div className="text-xs text-muted-foreground">
                      From {AEDFmt.format(activeGrade.monthlyFrom)}/month
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

                {/* Features */}
                <ul className="mb-4 grid grid-cols-1 gap-x-6 gap-y-1 pl-4 text-sm text-muted-foreground sm:grid-cols-2 list-disc">
                  {activeGrade.features.slice(0, 6).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => onGradeSelect(activeGrade.name)}
                    aria-label={`Select ${activeGrade.name}`}
                  >
                    Select {activeGrade.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => onCarBuilder(activeGrade.name)}>
                      <Wrench className="mr-1 h-4 w-4" /> Build
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => onTestDrive()}>
                      <CarIcon className="mr-1 h-4 w-4" /> Drive
                    </Button>
                  </div>
                  <Button variant="ghost" className="w-full" onClick={() => setIsComparisonOpen(true)}>
                    Compare all grades
                  </Button>
                </div>

                <p className="mt-4 text-center text-[11px] leading-tight text-muted-foreground">
                  * Estimate based on 20% down payment, 3.5% APR, selected term. Subject to credit approval.
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
                  <div className="text-xs text-muted-foreground">From {AEDFmt.format(activeGrade.monthlyFrom)}/mo</div>
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
