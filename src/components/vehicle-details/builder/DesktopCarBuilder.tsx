// DesktopCarBuilder.tsx — end‑to‑end with 360° exterior spin (no autoplay) + Photo/360 sub‑toggle
// - Keeps original UI/UX/CX (panels, header, finance, accessories, etc.)
// - 360 viewer shows ONLY when: Mode=Exterior AND sub‑toggle=“360”
// - Default is Exterior → Photo (still image)
// - No autoplay. Manual interactions only (drag / wheel / arrow keys)
// - Fixes TS2367 by avoiding cross‑literal comparisons inside narrowed branches

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, X, RotateCcw, CheckCircle2, Info, CircleHelp, Image as ImageIcon } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/* ---------- Types ---------- */
export type StockStatus = "no-stock" | "pipeline" | "available";

export interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
  stockStatus: StockStatus;
}

export interface DesktopCarBuilderProps {
  vehicle: VehicleModel;
  step: number;
  totalSteps: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  showConfirmation: boolean;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goBack: () => void;
  goNext: () => void;
  onClose: () => void;
  onReset: () => void;
  variant?: "desktop" | "tablet";
}

/* ---------- Data ---------- */
const YEARS = ["2024", "2025", "2026"];
const ENGINES = [
  { name: "3.5L V6", tag: "Gasoline" },
  { name: "4.0L V6", tag: "Performance" },
  { name: "2.5L Hybrid", tag: "Hybrid" },
];
const GRADES = [
  { name: "Base", badge: "Everyday Essentials" },
  { name: "SE", badge: "Sport Enhanced" },
  { name: "XLE", badge: "Extra Luxury" },
  { name: "Limited", badge: "Premium" },
  { name: "Platinum", badge: "Top of the Line" },
];
const EXTERIOR_IMAGES = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#f5f5f5" },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#101010" },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", swatch: "#c7c9cc" },
  { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#0c3c74" },
  { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#8a1111" },
];

const INTERIORS = [
  { name: "Black Leather", img: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/4046322b-9927-490d-b88a-3c18e7b590f3/renditions/c1fbcc4b-eac8-4440-af33-866cf99a0c93?binary=true" },
  { name: "Beige Leather", img: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/09d2d87f-cf9c-45ca-babb-53d872f8858e/renditions/9fc0d676-3a74-4b78-b56d-aff36dc710c1?binary=true" },
  { name: "Gray Fabric", img: "" },
];

const ACCESSORIES = [
  { name: "Premium Sound System", price: 1200, desc: "Upgraded speakers and amplifier tuned for the cabin." },
  { name: "Sunroof", price: 800, desc: "Panoramic glass roof with tilt and slide." },
  { name: "Navigation System", price: 600, desc: "Built-in maps, voice guidance, live traffic." },
  { name: "Heated Seats", price: 400, desc: "Front-row seat heating with 3 levels." },
  { name: "Backup Camera", price: 300, desc: "Wide-angle rear camera with dynamic guidelines." },
  { name: "Alloy Wheels", price: 900, desc: "Lightweight alloy wheels for style and handling." },
] as const;

const GRADE_COLOR_MAP: Record<string, string[]> = {
  Base: ["Pearl White", "Silver Metallic"],
  SE: ["Pearl White", "Midnight Black", "Silver Metallic"],
  XLE: ["Pearl White", "Midnight Black", "Silver Metallic", "Deep Blue"],
  Limited: ["Pearl White", "Midnight Black", "Silver Metallic", "Ruby Red"],
  Platinum: ["Pearl White", "Midnight Black", "Deep Blue", "Ruby Red"],
};

const GRADE_IMAGES: Record<string, string> = {
  Base: EXTERIOR_IMAGES[0].image,
  SE: EXTERIOR_IMAGES[1].image,
  XLE: EXTERIOR_IMAGES[2].image,
  Limited: EXTERIOR_IMAGES[3].image,
  Platinum: EXTERIOR_IMAGES[4].image,
};

/* ---------- NEW: Spin frames per exterior color (wired with your sample links) ---------- */
// If your DAM is sequential, you can use buildFrames() later.
const pad = (n: number, width = 3) => n.toString().padStart(width, "0");
const buildFrames = (
  base: string,
  count: number,
  {
    prefix = "angle-",
    start = 1,
    step = 1,
    padWidth = 3,
    ext = "jpg",
    query = "",
  }: { prefix?: string; start?: number; step?: number; padWidth?: number; ext?: string; query?: string } = {}
) =>
  Array.from({ length: count }, (_, i) => {
    const idx = start + i * step;
    return `${base}/${prefix}${pad(idx, padWidth)}.${ext}${query}`;
  });

// Sample set from your provided URLs (Pearl White)
const PEARL_WHITE_FRAMES: string[] = [
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/f89996df-2223-47bc-b673-b213a50cc5e3.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/f0a94ef4-133b-408a-aae2-224e0348574e.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/3834e0d5-2f50-4f01-af58-23cbf763ae37.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/af5a96ed-370a-419c-aedf-db4ff7fc786f.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/3834e0d5-2f50-4f01-af58-23cbf763ae37.720",
];

const SPIN_SETS: Record<string, string[]> = {
  "Pearl White": PEARL_WHITE_FRAMES,
  "Midnight Black": PEARL_WHITE_FRAMES,
  "Silver Metallic": PEARL_WHITE_FRAMES,
  "Deep Blue": PEARL_WHITE_FRAMES,
  "Ruby Red": PEARL_WHITE_FRAMES,
};

/* ---------- Finance & helpers ---------- */
const APR = 0.0349;
const DOWN_PCT = 0.2;
const spring = { type: "spring", stiffness: 320, damping: 32, mass: 1.05 } as const;

function reserveAmount(status: StockStatus) { return status === "available" ? 2000 : 5000; }

function emi(price: number, years: number) {
  const down = price * DOWN_PCT;
  const principal = Math.max(price - down, 0);
  const r = APR / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  const m = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(m);
}

function allowedColorsFor(grade: string) {
  return GRADE_COLOR_MAP[grade] ?? EXTERIOR_IMAGES.map((c) => c.name);
}

function computeStock(grade: string, exterior: string, interior: string): StockStatus {
  if (!grade || !exterior || !interior) return "pipeline";
  if (!allowedColorsFor(grade).includes(exterior)) return "no-stock";
  if (grade === "Platinum" && exterior === "Ruby Red" && interior === "Beige Leather") return "no-stock";
  if (exterior === "Deep Blue" || interior === "Gray Fabric") return "pipeline";
  return "available";
}

function hapticSelect() {
  if (typeof contextualHaptic.selectionChange === "function") contextualHaptic.selectionChange();
  else if (typeof contextualHaptic.buttonPress === "function") contextualHaptic.buttonPress();
}

/* ---------- Component ---------- */
const DesktopCarBuilder: React.FC<DesktopCarBuilderProps> = ({
  vehicle, step, totalSteps, config, setConfig,
  showConfirmation, calculateTotalPrice, handlePayment,
  goBack, goNext, onClose, onReset, variant = "desktop",
}) => {
  const backRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoItem, setInfoItem] = useState<typeof ACCESSORIES[number] | null>(null);
  const [heroMode, setHeroMode] = useState<"exterior" | "interior">("exterior");
  const [imageLoadedKey, setImageLoadedKey] = useState<string>("");

  // NEW: Photo/360 sub-toggle (exterior only)
  const [exteriorView, setExteriorView] = useState<"photo" | "spin">("photo");

  useEffect(() => {
    [backRef, closeRef].forEach((r) => r.current && addLuxuryHapticToButton(r.current, { type: "luxuryPress", onPress: true, onHover: true }));
    if (resetRef.current) addLuxuryHapticToButton(resetRef.current, { type: "premiumError", onPress: true, onHover: true });
  }, []);

  const exteriorObj = useMemo(() => EXTERIOR_IMAGES.find((c) => c.name === config.exteriorColor) || EXTERIOR_IMAGES[0], [config.exteriorColor]);
  const interiorObj = useMemo(() => INTERIORS.find((i) => i.name === config.interiorColor), [config.interiorColor]);
  const heroKey = `${exteriorObj.image}-${config.grade}-${config.modelYear}-${heroMode}-${interiorObj?.img ?? "no-int"}-${exteriorView}`;

  // Preload stills
  useEffect(() => {
    EXTERIOR_IMAGES.forEach(({ image }) => { const i = new Image(); i.src = image; });
    INTERIORS.filter((i) => i.img).forEach(({ img }) => { const im = new Image(); if (img) im.src = img; });
  }, []);

  // Preload spin frames for current color when Exterior is active
  const currentSpinFrames = useMemo(() => SPIN_SETS[config.exteriorColor] || [], [config.exteriorColor]);
  useEffect(() => {
    if (heroMode !== "exterior") return;
    currentSpinFrames.forEach((src) => { const im = new Image(); im.src = src; });
  }, [currentSpinFrames, heroMode]);

  // Reset sub-toggle to Photo when leaving Exterior
  useEffect(() => {
    if (heroMode !== "exterior" && exteriorView !== "photo") setExteriorView("photo");
  }, [heroMode, exteriorView]);

  // setters
  const setYear = useCallback((y: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, modelYear: y, stockStatus: computeStock(c.grade, c.exteriorColor, c.interiorColor) }));
  }, [setConfig]);

  const setEngine = useCallback((e: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, engine: e, stockStatus: computeStock(c.grade, c.exteriorColor, c.interiorColor) }));
  }, [setConfig]);

  const setGrade = useCallback((g: string) => {
    hapticSelect();
    setConfig((c) => {
      const allowed = allowedColorsFor(g);
      const nextExterior = allowed.includes(c.exteriorColor) ? c.exteriorColor : allowed[0];
      return { ...c, grade: g, exteriorColor: nextExterior, stockStatus: computeStock(g, nextExterior, c.interiorColor) };
    });
  }, [setConfig]);

  const setColor = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, exteriorColor: name, stockStatus: computeStock(c.grade, name, c.interiorColor) }));
  }, [setConfig]);

  const setInterior = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, interiorColor: name, stockStatus: computeStock(c.grade, c.exteriorColor, name) }));
    setHeroMode("interior");
  }, [setConfig]);

  const toggleAccessory = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => {
      const exists = c.accessories.includes(name);
      const accessories = exists ? c.accessories.filter((a) => a !== name) : [...c.accessories, name];
      return { ...c, accessories };
    });
  }, [setConfig]);

  // CTA
  const readyStep1 = Boolean(config.modelYear && config.engine);
  const readyStep2 = Boolean(config.grade && config.exteriorColor && config.interiorColor);

  const onContinue = () => {
    if (step === 1) return readyStep1 && goNext();
    if (step === 2) {
      if (!readyStep2) return;
      if (config.stockStatus === "no-stock") return handlePayment();
      return goNext();
    }
    if (step === 3) return handlePayment();
  };

  const primaryText = step === 1
    ? "Continue"
    : step === 2
      ? (config.stockStatus === "no-stock" ? "Register your interest" : "Continue")
      : (config.stockStatus === "pipeline" ? "Reserve now" : "Buy now");

  const disablePrimary = (step === 1 && !readyStep1) || (step === 2 && !readyStep2);

  // balanced panels: step 1 gives more space to the right side to avoid whitespace
  const panel = variant === "tablet"
    ? (step === 1 ? { left: "w-[52%]", right: "w-[48%]" } : { left: "w-[56%]", right: "w-[44%]" })
    : (step === 1 ? { left: "w-[52%]", right: "w-[48%]" } : { left: "w-[58%]", right: "w-[42%]" });

  const total = calculateTotalPrice();
  const monthly3 = useMemo(() => emi(total, 3), [total]);
  const monthly5 = useMemo(() => emi(total, 5), [total]);
  const reserve = useMemo(() => reserveAmount(config.stockStatus), [config.stockStatus]);

  const visibleExteriorColors = useMemo(() => {
    if (!config.grade) return [] as typeof EXTERIOR_IMAGES;
    const allowed = allowedColorsFor(config.grade);
    return EXTERIOR_IMAGES.filter((c) => allowed.includes(c.name));
  }, [config.grade]);

  return (
    <motion.div className="relative h-screen w-full bg-[hsl(var(--neutral-50))] flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Visual theater */}
      <div className={`${panel.left} h-full relative overflow-hidden bg-gradient-to-br from-[hsl(var(--neutral-100))] to-[hsl(var(--neutral-50))]`}>
        {/* Mode Toggle + Exterior sub-toggle */}
        <div className="absolute top-6 left-6 z-20 border border-[hsl(var(--toyota-platinum))]/40 rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center gap-1">
          {(["exterior", "interior"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setHeroMode(m)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${heroMode === m ? "bg-[hsl(var(--toyota-graphite))] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]" : "border border-transparent hover:bg-[hsl(var(--neutral-100))] text-[hsl(var(--toyota-graphite))]"}`}
              role="tab"
              aria-selected={heroMode === m}
            >
              {m === "exterior" ? "Exterior" : "Interior"}
            </button>
          ))}

          {/* Only render the Photo/360 toggle when Exterior is active */}
          {heroMode === "exterior" && (
            <div className="ml-2 flex items-center gap-1 pl-2 border-l border-[hsl(var(--toyota-platinum))]/30">
              {(["photo", "spin"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setExteriorView(v)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${exteriorView === v ? "bg-[hsl(var(--neutral-200))] border border-[hsl(var(--toyota-platinum))]/50 text-[hsl(var(--toyota-graphite))]" : "hover:bg-[hsl(var(--neutral-100))] text-[hsl(var(--toyota-stone))]"}`}
                  aria-pressed={exteriorView === v}
                >
                  {v === "photo" ? "Photo" : "360"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Image / Spin Viewer */}
        <div className="relative w-full h-full bg-gradient-to-b from-muted/20 to-background/50 flex items-center justify-center">
          {!imageLoadedKey || imageLoadedKey !== heroKey ? (
            <div className="absolute inset-0 m-8 rounded-2xl bg-muted/20 animate-pulse" aria-hidden />
          ) : null}

          {heroMode === "exterior" ? (
            exteriorView === "spin" ? (
              <SpinViewer
                key={`spin-${config.exteriorColor}-${config.grade}-${config.modelYear}`}
                frames={currentSpinFrames}
                fallbackStill={exteriorObj.image}
                className="w-full h-full object-contain p-6 md:p-8 select-none"
                alt={`${config.exteriorColor} ${vehicle.name}`}
                onFirstFrameLoad={() => setImageLoadedKey(heroKey)}
                prefersReducedMotion={!!prefersReducedMotion}
              />
            ) : (
              <motion.img
                key={`${heroKey}-photo`}
                src={exteriorObj.image}
                alt={`${config.exteriorColor} ${vehicle.name}`}
                className="w-full h-full object-contain p-6 md:p-8"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 30, duration: 0.7 }}
                decoding="async"
                loading="eager"
                onLoad={() => setImageLoadedKey(heroKey)}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
              />
            )
          ) : (
            <motion.img
              key={`${heroKey}-interior`}
              src={interiorObj?.img || exteriorObj.image}
              alt={`${config.interiorColor} ${vehicle.name}`}
              className="w-full h-full object-contain p-6 md:p-8"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 30, duration: 0.7 }}
              decoding="async"
              loading="eager"
              onLoad={() => setImageLoadedKey(heroKey)}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
            />
          )}
        </div>

        {heroMode === "interior" && config.interiorColor && (
          <div className="absolute bottom-6 left-6 z-20 rounded-2xl border border-border/40 bg-background/95 backdrop-blur-sm px-4 py-2.5 shadow-sm">
            <span className="text-sm font-medium">{config.interiorColor}</span>
          </div>
        )}
      </div>

      {/* Right configuration panel */}
      <div className={`${panel.right} h-full min-h-0 flex flex-col border-l border-border/10`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <div className="flex items-center gap-3">
            <button
              ref={step > 1 ? backRef : closeRef}
              onClick={() => (step > 1 ? goBack() : onClose())}
              className="p-3 rounded-2xl border border-border/60 hover:bg-muted/50 transition-all min-h-[48px] min-w-[48px]"
              aria-label={step > 1 ? "Back" : "Close"}
              type="button"
            >
              {step > 1 ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
            <button
              ref={resetRef}
              onClick={onReset}
              className="p-3 rounded-2xl border border-border/60 hover:bg-muted/50 transition-all min-h-[48px] min-w-[48px] text-destructive"
              aria-label="Reset Configuration"
              type="button"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Build Your <span className="text-primary">{vehicle.name}</span></h1>
            <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <StepDots current={step} total={totalSteps} />
            </div>
          </div>
          <div className="w-32" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scroll-pb-[220px] scroll-pt-2">
          {/* STEP 1 */}
          {step === 1 && (
            <Section title="Model Year & Powertrain" subtitle="Pick your year and engine to begin" dense>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompactSegmented label="Model Year" options={YEARS} value={config.modelYear} onChange={setYear} />
                <CompactSegmented label="Engine" options={ENGINES.map((e) => e.name)} value={config.engine} onChange={setEngine} meta={(name) => ENGINES.find((e) => e.name === name)?.tag} />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <FinanceCard label="Reserve" value={`AED ${reserve.toLocaleString()}`} hint={config.stockStatus === "available" ? "Pay now to secure" : "Refundable pre-order"} large />
                <FinanceCard label="EMI from" value={`AED ${Math.min(monthly3, monthly5).toLocaleString()}/mo`} hint="20% down · 3.49% APR · up to 5y" large />
              </div>
            </Section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Section title="Grade" subtitle="Select trim level">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {GRADES.map((g) => (
                    <SelectableCard key={g.name} selected={config.grade === g.name} onClick={() => setGrade(g.name)} image={GRADE_IMAGES[g.name]} label={g.name} caption={g.badge} />
                  ))}
                </div>
              </Section>

              <Section title="Exterior" subtitle={config.grade ? "Choose a color available for your grade" : "Select a grade to view colors"}>
                {!config.grade ? (
                  <div className="text-xs text-muted-foreground">Choose a grade above.</div>
                ) : (
                  <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Exterior color">
                    {visibleExteriorColors.map((c) => {
                      const isActive = config.exteriorColor === c.name;
                      return (
                        <button
                          key={c.name}
                          onClick={() => setColor(c.name)}
                          type="button"
                          className={`relative w-12 h-12 rounded-full border outline-none focus-visible:ring-2 ${isActive ? "border-primary ring-primary/30" : "border-border/60 hover:border-border"}`}
                          title={c.name}
                          aria-label={c.name}
                          role="radio"
                          aria-checked={isActive}
                        >
                          <span className="absolute inset-0 rounded-full" style={{ background: c.swatch }} />
                          <span className="sr-only">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Section>

              {config.grade && config.exteriorColor && (
                <Section title="Interior" subtitle="Choose your cabin finish">
                  <div className="grid grid-cols-3 gap-3">
                    {INTERIORS.map((i) => {
                      const selected = config.interiorColor === i.name;
                      return (
                        <button
                          key={i.name}
                          onClick={() => setInterior(i.name)}
                          type="button"
                          className={`rounded-2xl border p-2 text-left transition focus-visible:ring-2 focus-visible:ring-primary ${selected ? "border-primary bg-primary/5" : "border-border/60 hover:border-border"}`}
                        >
                          <div className="h-24 w-full rounded-xl overflow-hidden bg-muted">
                            {i.img ? (
                              <img src={i.img} alt={i.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full grid place-items-center text-muted-foreground">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-sm font-semibold truncate">{i.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Stock under Interior */}
              {config.grade && config.exteriorColor && config.interiorColor && (
                <Section title="Stock" subtitle="Availability depends on color and interior">
                  <StockPill status={config.stockStatus} />
                </Section>
              )}

              {/* Accessories */}
              {config.grade && config.exteriorColor && config.interiorColor && (
                <Section title="Accessories" subtitle="Personalize your ride">
                  <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
                    {ACCESSORIES.map((a) => {
                      const selected = config.accessories.includes(a.name);
                      return (
                        <motion.div
                          key={a.name}
                          className={`rounded-xl border p-3 md:p-3.5 flex items-start gap-3 transition-all ${selected ? "border-primary bg-primary/5" : "border-border/60 hover:border-border"}`}
                          animate={{ scale: selected ? 1.02 : 1 }}
                          transition={spring}
                        >
                          <button type="button" onClick={() => toggleAccessory(a.name)} className="shrink-0 w-5 h-5 rounded border flex items-center justify-center" aria-pressed={selected} aria-label={`Toggle ${a.name}`}>
                            {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </button>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{a.name}</div>
                            <div className="text-xs text-muted-foreground">AED {a.price.toLocaleString()}</div>
                            <button type="button" onClick={() => { setInfoItem(a); setInfoOpen(true); }} className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                              <CircleHelp className="w-3 h-3" /> Learn more
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Section>
              )}
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <Section title="Confirm your configuration" subtitle="Review and place your order">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border overflow-hidden">
                  <div className="aspect-[16/9] bg-muted">
                    <img src={exteriorObj.image} alt={config.exteriorColor} className="w-full h-full object-contain" />
                  </div>
                  <div className="px-3 py-2 text-sm font-semibold">Exterior: {config.exteriorColor}</div>
                </div>
                <div className="rounded-2xl border overflow-hidden">
                  <div className="aspect-[16/9] bg-muted">
                    {interiorObj?.img ? (
                      <img src={interiorObj.img} alt={config.interiorColor} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-muted-foreground"><ImageIcon className="w-6 h-6" /></div>
                    )}
                  </div>
                  <div className="px-3 py-2 text-sm font-semibold">Interior: {config.interiorColor}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                <SummaryRow label="Year" value={config.modelYear} />
                <SummaryRow label="Engine" value={config.engine} />
                <SummaryRow label="Grade" value={config.grade} />
                <SummaryRow label="Accessories" value={config.accessories.length ? config.accessories.join(", ") : "None"} />
                <SummaryRow label="Availability" value={<StockPill status={config.stockStatus} compact />} />
              </div>
            </Section>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-border/10 p-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-black">AED {total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Reserve AED {reserve.toLocaleString()} · EMI from AED {Math.min(monthly3, monthly5).toLocaleString()}/mo</div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={goBack} className="rounded-xl border px-4 py-3 hover:bg-muted/30 transition">Back</button>
              <button type="button" onClick={onContinue} disabled={disablePrimary} className="rounded-xl bg-primary text-primary-foreground px-5 py-3 font-semibold shadow hover:opacity-90 disabled:opacity-50 transition">{primaryText}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessory info dialog */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{infoItem?.name}</DialogTitle>
            <DialogDescription>Details & specifications</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border mb-3">
            <div className="aspect-[16/9] bg-muted">
              <img src={exteriorObj.image} alt="Accessory visual" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-sm">{infoItem?.desc}</div>
          <div className="text-sm font-semibold mt-2">Price: AED {infoItem ? infoItem.price.toLocaleString() : 0}</div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

/* ---------- SpinViewer (manual only: drag / wheel / arrows; NO autoplay) ---------- */
interface SpinViewerProps {
  frames: string[]; // ordered
  fallbackStill: string;
  className?: string;
  alt?: string;
  onFirstFrameLoad?: () => void;
  prefersReducedMotion?: boolean;
}

const SpinViewer: React.FC<SpinViewerProps> = ({
  frames,
  fallbackStill,
  className,
  alt,
  onFirstFrameLoad,
}) => {
  const hasFrames = frames && frames.length > 0;
  const [index, setIndex] = useState(0);
  const startXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const SENS = 6; // pixels per frame

  const clampIndex = useCallback((i: number) => {
    if (!hasFrames) return 0;
    const len = frames.length;
    return ((i % len) + len) % len;
  }, [frames, hasFrames]);

  const step = useCallback((delta: number) => {
    setIndex((cur) => clampIndex(cur + delta));
  }, [clampIndex]);

  const firstLoadedRef = useRef(false);
  const onFirstLoad = () => {
    if (!firstLoadedRef.current) {
      firstLoadedRef.current = true;
      onFirstFrameLoad?.();
    }
  };

  // Drag
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startXRef.current = e.clientX;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startXRef.current == null) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) >= SENS) {
      const framesDelta = Math.trunc(dx / SENS);
      step(framesDelta);
      startXRef.current = e.clientX;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    startXRef.current = null;
  };

  // Wheel
  const onWheel = (e: React.WheelEvent) => {
    if (!hasFrames) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    step(delta > 0 ? 1 : -1);
  };

  // Keyboard arrows
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [step]);

  // Reset on frames change
  useEffect(() => { setIndex(0); }, [frames]);

  if (!hasFrames) {
    return (
      <img src={fallbackStill} alt={alt} className={className} draggable={false} onLoad={onFirstLoad} />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full outline-none"
      role="img"
      aria-label={alt}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <img
        src={frames[index]}
        alt={alt}
        className={className}
        draggable={false}
        onLoad={onFirstLoad}
      />
    </div>
  );
};

/* ---------- UI bits ---------- */
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; dense?: boolean }> = ({ title, subtitle, children, dense }) => (
  <section className={`px-6 ${dense ? "py-6" : "py-8"} border-b border-border/10`}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-bold leading-tight">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <Info className="h-4 w-4 text-muted-foreground/70" />
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

const CompactSegmented: React.FC<{ label: string; options: string[]; value: string; onChange: (v: string) => void; meta?: (opt: string) => string | undefined; }> = ({ label, options, value, onChange, meta }) => (
  <div>
    <div className="text-sm font-bold mb-2">{label}</div>
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-2 text-base transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? "border-primary bg-primary/5" : "border-border/70 hover:border-border"}`}
            aria-pressed={active}
            role="radio"
            aria-checked={active}
          >
            <span className="font-medium">{opt}</span>
            {meta?.(opt) && <span className="ml-2 text-sm text-muted-foreground">{meta(opt)}</span>}
          </button>
        );
      })}
    </div>
  </div>
);

const FinanceCard: React.FC<{ label: string; value: string; hint?: string; large?: boolean }> = ({ label, value, hint, large }) => (
  <div className={`rounded-2xl border border-border/60 p-4 ${large ? "min-h-[96px]" : ""}`}>
    <div className="text-[11px] text-muted-foreground">{label}</div>
    <div className="text-xl font-bold leading-tight">{value}</div>
    {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
  </div>
);

const StepDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`h-1.5 rounded-full transition-all ${i + 1 <= current ? "bg-primary w-8" : "bg-muted-foreground/30 w-3"}`} />
    ))}
  </div>
);

const SelectableCard: React.FC<{ selected?: boolean; onClick?: () => void; image: string; label: string; caption?: string }> = ({ selected, onClick, image, label, caption }) => (
  <button
    onClick={onClick}
    type="button"
    className={`group relative overflow-hidden rounded-2xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selected ? "border-primary/60 bg-primary/5" : "border-border/50 hover:border-border"}`}
  >
    <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
      <motion.img src={image} alt={label} className="w-full h-full object-cover" initial={{ scale: 1.04 }} whileHover={{ scale: 1.08 }} transition={{ type: "spring", stiffness: 180, damping: 16 }} loading="lazy" decoding="async" />
    </div>
    <div className="p-3">
      <div className="text-sm font-semibold leading-tight flex items-center gap-2">
        {label}
        {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
      </div>
      {caption && <div className="text-xs text-muted-foreground">{caption}</div>}
    </div>
  </button>
);

const StockPill: React.FC<{ status: StockStatus; compact?: boolean }> = ({ status, compact }) => {
  const map = {
    "no-stock": { text: "No stock", cls: "bg-destructive/10 text-destructive border-destructive/30" },
    pipeline: { text: "Pipeline stock", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
    available: { text: "Available", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  } as const;
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 ${compact ? "py-0.5 text-xs" : "py-1 text-sm"} ${m.cls}`}>{m.text}</span>
  );
};

const SummaryRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between border rounded-xl px-3 py-2">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold">{value}</span>
  </div>
);

export default DesktopCarBuilder;
