import React, { useCallback, useEffect, useMemo, useRef, useState, startTransition } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, RotateCcw, LogOut, CheckCircle2, CircleHelp, Image as ImageIcon } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory } from "@/hooks/use-device-info";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";

/* ---------- Types ---------- */
export type StockStatus = "no-stock" | "pipeline" | "available";

export interface MobileBuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
  stockStatus: StockStatus;
}

export interface MobileCarBuilderProps {
  vehicle: VehicleModel;
  step: number;
  totalSteps: number;
  config: MobileBuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<MobileBuilderConfig>>;
  showConfirmation?: boolean; // optional; we always show confirm on mobile below
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goBack: () => void;
  goNext: () => void;
  onClose: () => void;
  onReset: () => void;
  deviceCategory: DeviceCategory;
}

/* ---------- Data ---------- */
const YEARS = ["2024", "2025", "2026"];
const ENGINES = ["3.5L V6", "4.0L V6", "2.5L Hybrid"];

const COLORS = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#f5f5f5" },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#101010" },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", swatch: "#c7c9cc" },
  { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#0c3c74" },
  { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#8a1111" },
];

const GRADES = ["Base", "SE", "XLE", "Limited", "Platinum"];
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
  { name: "Alloy Wheels", price: 900, desc: "Lightweight alloy wheels." },
] as const;

/* ---------- Grade-specific color availability ---------- */
const GRADE_COLOR_MAP: Record<string, string[]> = {
  Base: ["Pearl White", "Silver Metallic"],
  SE: ["Pearl White", "Midnight Black", "Silver Metallic"],
  XLE: ["Pearl White", "Midnight Black", "Silver Metallic", "Deep Blue"],
  Limited: ["Pearl White", "Midnight Black", "Silver Metallic", "Ruby Red"],
  Platinum: ["Pearl White", "Midnight Black", "Deep Blue", "Ruby Red"],
};
const allowedColorsFor = (grade: string) => GRADE_COLOR_MAP[grade] ?? COLORS.map((c) => c.name);

/* ---------- Grade images (static) ---------- */
const GRADE_IMAGES: Record<string, string> = {
  Base: COLORS[0].image,
  SE: COLORS[1].image,
  XLE: COLORS[2].image,
  Limited: COLORS[3].image,
  Platinum: COLORS[4].image,
};

/* ---------- Spin frames per exterior color (sample set) ---------- */
const SAMPLE_SPIN: string[] = [
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/f89996df-2223-47bc-b673-b213a50cc5e3.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/f0a94ef4-133b-408a-aae2-224e0348574e.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/3834e0d5-2f50-4f01-af58-23cbf763ae37.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/af5a96ed-370a-419c-aedf-db4ff7fc786f.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/3834e0d5-2f50-4f01-af58-23cbf763ae37.720",
];

const SPIN_SETS: Record<string, string[]> = {
  "Pearl White": SAMPLE_SPIN,
  "Midnight Black": SAMPLE_SPIN,
  "Silver Metallic": SAMPLE_SPIN,
  "Deep Blue": SAMPLE_SPIN,
  "Ruby Red": SAMPLE_SPIN,
};

/* ---------- Haptics ---------- */
const hapticSelect = () => {
  if (typeof contextualHaptic.selectionChange === "function") contextualHaptic.selectionChange();
  else if (typeof contextualHaptic.buttonPress === "function") contextualHaptic.buttonPress();
};

/* ---------- Finance ---------- */
const APR = 0.0349;
const DOWN_PCT = 0.2;
const reserveAmount = (status: StockStatus) => (status === "available" ? 2000 : 5000);
const emi = (price: number, years: number) => {
  const down = price * DOWN_PCT;
  const principal = Math.max(price - down, 0);
  const r = APR / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  const m = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(m);
};

/* ---------- Stock evaluator ---------- */
const computeStock = (grade: string, exterior: string, interior: string): StockStatus => {
  if (!grade || !exterior || !interior) return "pipeline";
  if (!allowedColorsFor(grade).includes(exterior)) return "no-stock";
  if (grade === "Platinum" && exterior === "Ruby Red" && interior === "Beige Leather") return "no-stock";
  if (exterior === "Deep Blue" || interior === "Gray Fabric") return "pipeline";
  return "available";
};

/* ---------- Lightweight MobileModal (no portal; avoids mobile Safari quirks) ---------- */
const MobileModal: React.FC<{ open: boolean; onClose: () => void; title?: string; children: React.ReactNode; actions?: React.ReactNode; className?: string; }>=({ open, onClose, title, children, actions, className })=>{
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`absolute inset-x-3 top-[10vh] rounded-2xl border border-border/30 bg-background shadow-xl ${className||""}`} role="dialog" aria-modal="true">
        {title && <div className="px-4 py-3 border-b border-border/20 text-sm font-semibold">{title}</div>}
        <div className="px-4 py-3 text-sm">{children}</div>
        {actions && <div className="px-4 py-3 border-t border-border/20 flex items-center justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
};

const MobileCarBuilder: React.FC<MobileCarBuilderProps> = ({
  vehicle,
  step,
  totalSteps,
  config,
  setConfig,
  showConfirmation,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose,
  onReset,
}) => {
  const backRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoItem, setInfoItem] = useState<(typeof ACCESSORIES)[number] | null>(null);
  const [heroMode, setHeroMode] = useState<"exterior" | "interior">("exterior");
  const [exteriorView, setExteriorView] = useState<"photo" | "spin">("photo");
  const [imageLoadedKey, setImageLoadedKey] = useState<string>("");

  // Reset flow control
  const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);
  const resettingRef = useRef(false);

  useEffect(() => {
    [backRef, closeRef, exitRef].forEach((r) => r.current && addLuxuryHapticToButton(r.current, { type: "luxuryPress", onPress: true }));
    if (resetRef.current) addLuxuryHapticToButton(resetRef.current, { type: "premiumError", onPress: true });
  }, []);

  const exteriorObj = useMemo(() => COLORS.find((c) => c.name === config.exteriorColor) || COLORS[0], [config.exteriorColor]);
  const interiorObj = useMemo(() => INTERIORS.find((i) => i.name === config.interiorColor), [config.interiorColor]);

  // Preload *only current* still; avoid preloading all colors on mobile
  useEffect(() => {
    if (resettingRef.current) return;
    const img = new Image();
    img.decoding = "async" as any;
    img.loading = "lazy" as any;
    img.src = exteriorObj.image;
    if (interiorObj?.img) { const im = new Image(); im.decoding = "async" as any; im.loading = "lazy" as any; im.src = interiorObj.img; }
  }, [exteriorObj.image, interiorObj?.img]);

  // Preload spin frames for current color (idle; gated during reset)
  const currentSpinFrames = useMemo(() => SPIN_SETS[config.exteriorColor] || [], [config.exteriorColor]);
  useEffect(() => {
    if (resettingRef.current || heroMode !== "exterior") return;
    const id = (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(() => {
          currentSpinFrames.forEach((src) => { const im = new Image(); (im as any).decoding = "async"; (im as any).loading = "lazy"; im.src = src; });
        })
      : setTimeout(() => {
          currentSpinFrames.forEach((src) => { const im = new Image(); (im as any).decoding = "async"; (im as any).loading = "lazy"; im.src = src; });
        }, 0);
    return () => {
      if ((window as any).cancelIdleCallback && typeof id === "number") (window as any).cancelIdleCallback(id);
      else clearTimeout(id as any);
    };
  }, [currentSpinFrames, heroMode]);

  // Reset sub-toggle when leaving exterior
  useEffect(() => {
    if (heroMode !== "exterior" && exteriorView !== "photo") setExteriorView("photo");
  }, [heroMode, exteriorView]);

  // Unique key for skeleton/transition
  const heroKey = `${exteriorObj.image}-${config.grade}-${config.modelYear}-${heroMode}-${interiorObj?.img ?? "no-int"}-${exteriorView}`;

  // ---- setters (keep stock synced) ----
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

  const setInterior = useCallback((i: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, interiorColor: i, stockStatus: computeStock(c.grade, c.exteriorColor, i) }));
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

  // Safe reset flow (always confirmed on mobile)
  const handleResetSafe = useCallback(() => {
    if (resettingRef.current) return;
    resettingRef.current = true;
    setInfoOpen(false);
    setHeroMode("exterior");
    setExteriorView("photo");
    setImageLoadedKey("");

    startTransition(() => {
      onReset();
    });

    setTimeout(() => {
      resettingRef.current = false;
    }, 0);
  }, [onReset]);

  const readyStep1 = Boolean(config.modelYear && config.engine);
  const readyStep2 = Boolean(config.grade && config.exteriorColor && config.interiorColor);

  const onContinue = () => {
    if (step === 1) { if (readyStep1) goNext(); return; }
    if (step === 2) { if (!readyStep2) return; if (config.stockStatus === "no-stock") { handlePayment(); return; } goNext(); return; }
    if (step === 3) { handlePayment(); }
  };

  const primaryText = step === 1 ? "Continue" : step === 2 ? (config.stockStatus === "no-stock" ? "Register your interest" : "Continue") : (config.stockStatus === "pipeline" ? "Reserve now" : "Buy now");
  const disablePrimary = (step === 1 && !readyStep1) || (step === 2 && !readyStep2);

  const total = calculateTotalPrice();
  const monthly3 = emi(total, 3);
  const monthly5 = emi(total, 5);
  const reserve = reserveAmount(config.stockStatus);

  /* Allowed colors list (hide non-allowed) */
  const visibleExteriorColors = useMemo(() => {
    if (!config.grade) return [] as typeof COLORS;
    const allowed = allowedColorsFor(config.grade);
    return COLORS.filter((c) => allowed.includes(c.name));
  }, [config.grade]);

  return (
    <motion.div className="relative w-full min-h-screen flex flex-col bg-[hsl(var(--neutral-50))]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header - Compact */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--toyota-platinum))]/20 sticky top-0 z-30 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2">
          <button ref={step > 1 ? backRef : closeRef} onClick={() => (step > 1 ? goBack() : onClose())} className="rounded-xl border border-border/60 p-2.5 hover:bg-muted/50 active:scale-95 transition-all min-h-[40px] min-w-[40px] touch-manipulation" aria-label={step > 1 ? "Back" : "Close"} type="button">
            {step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
          <button ref={resetRef} onClick={() => setConfirmResetOpen(true)} className="rounded-xl border border-border/60 p-2.5 hover:bg-muted/50 active:scale-95 transition-all min-h-[40px] min-w-[40px] touch-manipulation text-destructive" aria-label="Reset Configuration" type="button">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center select-none">
          <div className="text-sm font-bold leading-none">Build <span className="text-primary">{vehicle.name}</span></div>
          <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">Step {step} of {totalSteps}</div>
        </div>
        <button ref={exitRef} onClick={onClose} className="rounded-xl border border-border/60 p-2.5 hover:bg-muted/50 active:scale-95 transition-all min-h-[40px] min-w-[40px] touch-manipulation" aria-label="Exit Builder" type="button">
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Mode Toggle + Photo/360 sub-toggle */}
      <div className="px-3 pt-2">
        <div className="inline-flex border border-[hsl(var(--toyota-platinum))]/40 rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-1">
          {(["exterior","interior"] as const).map(m => (
            <button key={m} type="button" onClick={() => setHeroMode(m)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[36px] touch-manipulation ${heroMode === m ? "bg-[hsl(var(--toyota-graphite))] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]" : "border border-transparent hover:bg-[hsl(var(--neutral-100))] active:scale-95 text-[hsl(var(--toyota-graphite))]"}`} aria-pressed={heroMode === m}>
              {m === "exterior" ? "Exterior" : "Interior"}
            </button>
          ))}

          {heroMode === "exterior" && (
            <div className="ml-1 flex items-center gap-1 pl-2 border-l border-[hsl(var(--toyota-platinum))]/30">
              {(["photo", "spin"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setExteriorView(v)} className={`px-2.5 py-2 rounded-xl text-[11px] font-semibold transition-all min-h-[36px] ${exteriorView === v ? "bg-[hsl(var(--neutral-200))] border border-[hsl(var(--toyota-platinum))]/50 text-[hsl(var(--toyota-graphite))]" : "hover:bg-[hsl(var(--neutral-100))] text-[hsl(var(--toyota-stone))]"}`} aria-pressed={exteriorView === v}>
                  {v === "photo" ? "Photo" : "360"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero Section (shorter) */}
      <div className="relative w-full bg-gradient-to-b from-muted/20 to-background border-b border-border/20 overflow-hidden">
        <div className="relative w-full h-56 sm:h-64 md:h-72 flex items-center justify-center">
          {!imageLoadedKey || imageLoadedKey !== heroKey ? (<div className="absolute inset-0 m-3 rounded-xl bg-muted/20 animate-pulse" aria-hidden />) : null}

          {heroMode === "exterior" ? (
            exteriorView === "spin" ? (
              <SpinViewer key={`spin-${config.exteriorColor}-${config.grade}-${config.modelYear}`} frames={currentSpinFrames} fallbackStill={exteriorObj.image} className="w-full h-full object-contain p-3 select-none" alt={`${config.exteriorColor} ${vehicle.name}`} onFirstFrameLoad={() => setImageLoadedKey(heroKey)} />
            ) : (
              <motion.img key={`${heroKey}-photo`} src={exteriorObj.image} alt={`${config.exteriorColor} ${vehicle.name}`} className="w-full h-full object-contain p-3" initial={{ opacity: 0, scale: 0.98, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26, duration: 0.5 }} decoding="async" loading="lazy" onLoad={() => setImageLoadedKey(heroKey)} onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
            )
          ) : (
            <motion.img key={`${heroKey}-interior`} src={interiorObj?.img || exteriorObj.image} alt={`${config.interiorColor} ${vehicle.name}`} className="w-full h-full object-contain p-3" initial={{ opacity: 0, scale: 0.98, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26, duration: 0.5 }} decoding="async" loading="lazy" onLoad={() => setImageLoadedKey(heroKey)} onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
          )}
        </div>

        {heroMode === "interior" && config.interiorColor && (
          <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm border border-border/40 rounded-lg px-2.5 py-1.5 shadow-sm">
            <span className="text-[11px] font-medium">{config.interiorColor}</span>
          </div>
        )}
      </div>

      {/* Summary Card (compact) */}
      <div className="px-3 pt-3">
        <div className="px-3 py-2.5 rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold truncate text-foreground">{config.modelYear || "Year"} {vehicle.name}</div>
              <div className="text-[11px] text-muted-foreground truncate mt-0.5">{(config.grade || "Select Grade")} • {(config.engine || "Choose Engine")}</div>
              {config.exteriorColor && (<div className="text-[11px] text-primary/80 truncate mt-0.5">{config.exteriorColor}</div>)}
            </div>
            <div className="text-right">
              <div className="text-base font-black text-primary leading-tight">AED {total.toLocaleString()}</div>
              <StockBadge status={config.stockStatus} compact />
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Step 1: Year + Engine (FINANCE REMOVED from content) */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold mb-2 text-foreground">Model Year</div>
              <div className="flex items-center gap-2 flex-wrap">
                {YEARS.map((y) => (
                  <button key={y} onClick={() => setYear(y)} className={`rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all min-h-[40px] min-w-[72px] touch-manipulation ${config.modelYear === y ? "border-primary bg-primary/10 text-primary" : "border-border/60 hover:border-border hover:bg-muted/30 active:scale-95"}`} type="button">{y}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2 text-foreground">Engine</div>
              <div className="space-y-2">
                {ENGINES.map((e) => (
                  <button key={e} onClick={() => setEngine(e)} className={`w-full rounded-xl border p-3.5 text-left transition-all min-h-[48px] touch-manipulation ${config.engine === e ? "border-primary bg-primary/10" : "border-border/60 hover:border-border hover:bg-muted/30 active:scale-[0.98]"}`} type="button">
                    <div className="text-[13px] font-medium">{e}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{e.includes("Hybrid") ? "Fuel efficient hybrid technology" : e.includes("4.0L") ? "Enhanced performance engine" : "Standard gasoline engine"}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div className="space-y-3">
              <div className="text-sm font-semibold text-foreground">Grade Selection</div>
              <div className="grid grid-cols-2 gap-2.5">
                {GRADES.map((g) => {
                  const active = config.grade === g;
                  return (
                    <button key={g} onClick={() => setGrade(g)} type="button" className={`rounded-xl border text-left transition-all touch-manipulation active:scale-[0.98] ${active ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/60 hover:border-border hover:bg-muted/30"}`}>
                      <div className="aspect-[16/10] w-full rounded-t-xl overflow-hidden bg-muted/50"><img src={GRADE_IMAGES[g]} alt={g} className="w-full h-full object-cover" loading="lazy" /></div>
                      <div className="px-3 py-2.5">
                        <div className="flex items-center justify-between"><span className="text-[13px] font-semibold">{g}</span>{active && <CheckCircle2 className="h-4 w-4 text-primary" />}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{g === "Base" ? "Essential features" : g === "SE" ? "Sport enhanced" : g === "XLE" ? "Extra luxury" : g === "Limited" ? "Premium comfort" : "Top of the line"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exterior Colors */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-foreground">Exterior Colors</div>
              {!config.grade ? (
                <div className="text-[12px] text-muted-foreground p-3 bg-muted/30 rounded-xl text-center">Select a grade to view available colors</div>
              ) : (
                <>
                  <div className="text-[12px] text-muted-foreground">{visibleExteriorColors.length} colors available for {config.grade}</div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {visibleExteriorColors.map((c) => {
                      const isActive = config.exteriorColor === c.name;
                      return (
                        <button key={c.name} onClick={() => setColor(c.name)} className={`relative rounded-xl border p-2.5 text-center transition-all touch-manipulation active:scale-95 ${isActive ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/60 hover:border-border hover:bg-muted/30"}`} aria-label={c.name} title={c.name} type="button">
                          <div className="w-7 h-7 rounded-full mx-auto mb-1.5 border border-border/40" style={{ background: c.swatch }} />
                          <div className="text-[11px] font-medium truncate">{c.name}</div>
                          {isActive && (<div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-primary rounded-full flex items-center justify-center"><CheckCircle2 className="h-3 w-3 text-primary-foreground" /></div>)}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Interior */}
            {config.grade && config.exteriorColor && (
              <div>
                <div className="text-sm font-semibold mb-1.5">Interior</div>
                <div className="grid grid-cols-3 gap-2">
                  {INTERIORS.map((i) => (
                    <button key={i.name} onClick={() => setInterior(i.name)} className={`rounded-xl border p-2 ${config.interiorColor === i.name ? "border-primary/60 bg-primary/5" : "border-border/60 hover:border-border"}`} type="button">
                      <div className="h-16 rounded-lg overflow-hidden bg-muted">{i.img ? (<img src={i.img} alt={i.name} className="w-full h-full object-cover" loading="lazy" />) : (<div className="w-full h-full grid place-items-center text-muted-foreground"><ImageIcon className="w-5 h-5" /></div>)}</div>
                      <div className="mt-1 text-[11px] font-medium">{i.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Accessories */}
            {config.grade && config.exteriorColor && config.interiorColor && (
              <div>
                <div className="text-sm font-semibold mb-1.5">Accessories</div>
                <div className="grid grid-cols-2 gap-2">
                  {ACCESSORIES.map((a) => {
                    const selected = config.accessories.includes(a.name);
                    return (
                      <div key={a.name} className={`rounded-xl border p-2 flex items-start gap-2 ${selected ? "border-primary bg-primary/5" : "border-border/60"}`}>
                        <button type="button" onClick={() => toggleAccessory(a.name)} className="shrink-0 w-5 h-5 rounded border flex items-center justify-center">{selected && <CheckCircle2 className="w-4 h-4 text-primary" />}</button>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold truncate">{a.name}</div>
                          <div className="text-[11px] text-muted-foreground">AED {a.price.toLocaleString()}</div>
                          <button type="button" onClick={() => { setInfoItem(a); setInfoOpen(true); }} className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary"><CircleHelp className="w-3 h-3" /> Learn more</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock */}
            {config.grade && config.exteriorColor && config.interiorColor && (
              <div>
                <div className="text-sm font-semibold mb-1.5">Stock</div>
                <StockBadge status={config.stockStatus} />
              </div>
            )}
          </>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl border overflow-hidden"><div className="aspect-[16/9] bg-muted"><img src={exteriorObj.image} alt={config.exteriorColor} className="w-full h-full object-contain" /></div><div className="px-3 py-2 text-sm font-semibold">Exterior: {config.exteriorColor}</div></div>
              <div className="rounded-2xl border overflow-hidden"><div className="aspect-[16/9] bg-muted">{interiorObj?.img ? (<img src={interiorObj.img} alt={config.interiorColor} className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-muted-foreground"><ImageIcon className="w-6 h-6" /></div>)}</div><div className="px-3 py-2 text-sm font-semibold">Interior: {config.interiorColor}</div></div>
            </div>

            {([["Year", config.modelYear],["Engine", config.engine],["Grade", config.grade],["Accessories", config.accessories.length ? config.accessories.join(", ") : "None"],["Availability", config.stockStatus === "no-stock"? "No stock" : config.stockStatus === "pipeline"? "Pipeline stock" : "Available"]] as const).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border rounded-xl px-3 py-2"><span className="text-sm text-muted-foreground">{label}</span><span className="text-sm font-semibold">{value}</span></div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA (compact) — shows total + finance info only here */}
      <div className="border-t border-border/20 px-3 py-3 pb-[max(env(safe-area-inset-bottom),14px)] sticky bottom-0 bg-background/98 backdrop-blur-lg supports-[backdrop-filter]:bg-background/90">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-black text-primary">AED {total.toLocaleString()}</div>
            <div className="text-[11px] text-muted-foreground leading-tight">Reserve AED {reserve.toLocaleString()} • EMI from AED {Math.min(monthly3, monthly5).toLocaleString()}/mo</div>
          </div>
          <div className="flex items-center gap-2">
            {step > 1 && (<button type="button" onClick={goBack} className="rounded-xl border border-border/60 px-3.5 py-2.5 text-sm font-medium hover:bg-muted/50 active:scale-95 transition-all min-h-[40px] touch-manipulation">Back</button>)}
            <button type="button" onClick={onContinue} disabled={disablePrimary} className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all min-h-[40px] min-w-[112px] touch-manipulation ${disablePrimary ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/20"}`}>{primaryText}</button>
          </div>
        </div>
      </div>

      {/* Reset confirmation (custom mobile modal) */}
      <MobileModal open={confirmResetOpen} onClose={() => setConfirmResetOpen(false)} title="Reset your build?" actions={<>
        <button type="button" onClick={() => setConfirmResetOpen(false)} className="rounded-xl border border-border/60 px-4 py-2 text-sm hover:bg-muted/50">Cancel</button>
        <button type="button" onClick={() => { setConfirmResetOpen(false); handleResetSafe(); }} className="rounded-xl bg-destructive text-destructive-foreground px-4 py-2 text-sm hover:bg-destructive/90">Reset</button>
      </>}>
        This will clear your selections (year, engine, grade, colors and accessories).
      </MobileModal>

      {/* Accessory info (custom mobile modal) */}
      <MobileModal open={infoOpen} onClose={() => setInfoOpen(false)} title={infoItem?.name || "Accessory details"}>
        <div className="rounded-xl overflow-hidden border mb-3"><div className="aspect-[16/9] bg-muted"><img src={exteriorObj.image} alt="Accessory visual" className="w-full h-full object-cover" /></div></div>
        <div className="text-sm">{infoItem?.desc}</div>
        <div className="text-sm font-semibold mt-2">Price: AED {infoItem ? infoItem.price.toLocaleString() : 0}</div>
      </MobileModal>
    </motion.div>
  );
};

/* ---------- SpinViewer (manual only: drag / wheel / arrows; NO autoplay) ---------- */
interface SpinViewerProps { frames: string[]; fallbackStill: string; className?: string; alt?: string; onFirstFrameLoad?: () => void; }
const SpinViewer: React.FC<SpinViewerProps> = ({ frames, fallbackStill, className, alt, onFirstFrameLoad }) => {
  const hasFrames = frames && frames.length > 0;
  const [index, setIndex] = useState(0);
  const startXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const SENS = 6; // pixels per frame
  const clampIndex = useCallback((i: number) => { if (!hasFrames) return 0; const len = frames.length; return ((i % len) + len) % len; }, [frames, hasFrames]);
  const step = useCallback((delta: number) => { setIndex((cur) => clampIndex(cur + delta)); }, [clampIndex]);
  const firstLoadedRef = useRef(false);
  const onFirstLoad = () => { if (!firstLoadedRef.current) { firstLoadedRef.current = true; onFirstFrameLoad?.(); } };
  const onPointerDown = (e: React.PointerEvent) => { (e.target as Element).setPointerCapture?.(e.pointerId); startXRef.current = e.clientX; };
  const onPointerMove = (e: React.PointerEvent) => { if (startXRef.current == null) return; const dx = e.clientX - startXRef.current; if (Math.abs(dx) >= SENS) { const framesDelta = Math.trunc(dx / SENS); step(framesDelta); startXRef.current = e.clientX; } };
  const onPointerUp = (e: React.PointerEvent) => { (e.target as Element).releasePointerCapture?.(e.pointerId); startXRef.current = null; };
  const onWheel = (e: React.WheelEvent) => { if (!hasFrames) return; e.preventDefault(); const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY; step(delta > 0 ? 1 : -1); };
  
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
  
  useEffect(() => { 
    setIndex(0); 
  }, [frames]);
  
  // Early return AFTER all hooks
  if (!hasFrames) { 
    return (<img src={fallbackStill} alt={alt} className={className} draggable={false} onLoad={onFirstLoad} loading="lazy" decoding="async" />); 
  }
  
  return (
    <div ref={containerRef} className="w-full h-full outline-none" role="img" aria-label={alt} tabIndex={0} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel}>
      <img src={frames[index]} alt={alt} className={className} draggable={false} onLoad={onFirstLoad} loading="lazy" decoding="async" />
    </div>
  );
};

/* ---------- Small UI bits ---------- */
const StockBadge: React.FC<{ status: StockStatus; compact?: boolean }> = ({ status, compact = false }) => {
  const base = compact ? "inline-block text-[10px] rounded-full border px-2 py-0.5" : "inline-block text-xs rounded-full border px-3 py-1";
  const cls = status === "no-stock" ? " border-destructive/30 text-destructive bg-destructive/10" : status === "pipeline" ? " border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10" : " border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10";
  const label = compact ? (status === "no-stock" ? "No stock" : status === "pipeline" ? "Pipeline" : "Available") : (status === "no-stock" ? "No stock" : status === "pipeline" ? "Pipeline stock" : "Available");
  return <span className={base + " " + cls}>{label}</span>;
};

export default MobileCarBuilder;
