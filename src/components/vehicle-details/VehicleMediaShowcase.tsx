// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import type { VehicleModel } from "@/types/vehicle";

/* ================= Brand tokens ================= */
const TOK = {
  red: "#EB0A1E",
  ring: "focus:outline-none focus:ring-2 focus:ring-red-500",
  card: "bg-white shadow-sm border border-zinc-100",
  radius: "rounded-2xl",
  muted: "text-zinc-600",
  container: "mx-auto max-w-[1400px] px-4 md:px-6",
} as const;

const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");

/* ================= Utilities ================= */
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setReduced(!!m.matches);
    upd(); m.addEventListener?.("change", upd);
    return () => m.removeEventListener?.("change", upd);
  }, []);
  return reduced;
}
function useFocusTrap(
  enabled: boolean,
  containerRef: React.RefObject<HTMLElement>,
  firstFocusRef?: React.RefObject<HTMLElement>,
  onRestore?: () => void
) {
  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const prevFocused = document.activeElement as HTMLElement | null;
    firstFocusRef?.current?.focus?.();

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey) {
        if (active === first || !container.contains(active)) { last.focus(); e.preventDefault(); }
      } else {
        if (active === last || !container.contains(active)) { first.focus(); e.preventDefault(); }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      onRestore?.();
      prevFocused?.focus?.();
    };
  }, [enabled, containerRef, firstFocusRef, onRestore]);
}

const ImageSafe: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { cover?: boolean }> = ({ src, alt, className, cover, ...rest }) => {
  const [err, setErr] = useState(!src);
  if (!src || err) {
    return <div className={cx("grid place-items-center bg-zinc-100 text-[11px] text-zinc-400", className)}>Image unavailable</div>;
  }
  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      className={cx(cover ? "object-cover" : "object-contain", "block", className)}
    />
  );
};

const WistiaEmbed: React.FC<{ id: string; aspect?: number; autoPlay?: boolean; muted?: boolean; className?: string; }> = ({ id, aspect = 16 / 9, autoPlay, muted, className }) => {
  // KEEP VIDEO UNTOUCHED
  const qs = new URLSearchParams({
    seo: "false",
    videoFoam: "true",
    autoplay: autoPlay ? "true" : "false",
    muted: muted ? "true" : "false",
    controlsVisibleOnLoad: "true",
  }).toString();
  return (
    <div className={cx("relative w-full overflow-hidden", className)} style={{ aspectRatio: String(aspect) }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://fast.wistia.net/embed/iframe/${id}?${qs}`}
        title="Wistia video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

/* ================= Types ================= */
type DetailBlock = { overview?: string; specs?: string[]; features?: string[]; tech?: string[] };
type Slide = { url: string; title: string; description?: string; details?: DetailBlock };

type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";
type VariantStyle = { accent: string; slab: string; chip: string };

type MediaItem = {
  id: "v6" | "interior" | "safety" | "handling" | "quality" | "connect";
  category: string;
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: Slide[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  badges?: string[];
  variant: Variant;
};

const VARIANT: Record<Variant, VariantStyle> = {
  performance: { accent: "text-red-600", slab: "bg-red-50/70", chip: "bg-red-100" },
  safety:      { accent: "text-blue-700", slab: "bg-blue-50/70", chip: "bg-blue-100" },
  interior:    { accent: "text-amber-700", slab: "bg-amber-50/70", chip: "bg-amber-100" },
  quality:     { accent: "text-zinc-700", slab: "bg-zinc-50/70", chip: "bg-zinc-100" },
  technology:  { accent: "text-cyan-700", slab: "bg-cyan-50/70", chip: "bg-cyan-100" },
  handling:    { accent: "text-emerald-700", slab: "bg-emerald-50/70", chip: "bg-emerald-100" },
};

/* ================= Demo media (DAM only) ================= */
const DEMO: MediaItem[] = [
  {
    id: "v6",
    category: "Performance",
    title: "V6 Twin-Turbo",
    summary: "400+ hp, broad torque band, efficient cruising.",
    kind: "image",
    variant: "performance",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Cooling Strategy",
        description: "Dual-path cooling keeps temps stable under load.",
        details: {
          overview: "3.5L V6 TT engineered for instant response and sustained performance.",
          specs: ["3.5L V6 TT", "400+ hp", "0–60 in 4.2s"],
          features: ["Direct injection", "VVT", "Aluminum block"],
          tech: ["Closed-loop boost", "Knock learning", "Smart thermal mgmt"],
        },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
        title: "Turbo Detail",
        description: "Low-inertia turbines widen usable torque.",
        details: { specs: ["VGT turbines", "Low-mass impellers"], features: ["Wider band", "Low lag"], tech: ["Charge-air cooling"] },
      },
    ],
    badges: ["3.5L V6 TT", "400+ hp", "Instant response"],
  },
  {
    id: "interior",
    category: "Interior",
    title: "Driver-Focused Cabin",
    summary: "Premium materials, intuitive controls, low distraction.",
    kind: "image",
    variant: "interior",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Center Console",
        description: "Clear haptics with storage within reach.",
        details: {
          overview: "Ergonomics tuned for clarity, reach, and minimal eye-off-road time.",
          specs: ['12.3" display', "Tri-zone climate"],
          features: ["Voice control", "Wireless charging"],
          tech: ["Low-latency HMI", "OTA themes"],
        },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
        title: "Seating",
        description: "Supportive geometry; ventilation; memory.",
        details: { specs: ["Heated/ventilated", "Multi-way adjust"], features: ["Memory", "Lumbar"] },
      },
    ],
    badges: ['12.3" display', "Comfort"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Camera+radar fusion, assistance when you need it.",
    kind: "video",
    variant: "safety",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm", autoplay: true },
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Sensors",
        description: "Wide FOV camera and radar coverage.",
        details: { overview: "ADAS suite: PCS, LTA, ACC, BSM.", specs: ["PCS", "LTA", "ACC", "BSM"] },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Alerts",
        description: "Clear visuals and tones minimize distraction.",
        details: { specs: ["Road Sign Assist", "Auto High Beam"] },
      },
    ],
    badges: ["PCS", "LTA", "ACC"],
  },
  {
    id: "handling",
    category: "Performance",
    title: "Chassis Dynamics",
    summary: "Adaptive damping and precise control.",
    kind: "image",
    variant: "handling",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Adaptive Dampers",
        description: "Millisecond-level response for composure.",
        details: { specs: ["Active dampers", "Torque vectoring"], features: ["AWD grip", "Drive modes"] },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
        title: "Lightweight Chassis",
        description: "Stiff shell with targeted compliance.",
        details: { specs: ["HS steel", "Aluminium subframes"] },
      },
    ],
    badges: ["AWD", "Sport mode"],
  },
  {
    id: "quality",
    category: "Quality",
    title: "Build Quality",
    summary: "High-strength materials and precise assembly.",
    kind: "image",
    variant: "quality",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
        title: "Materials",
        description: "Premium substrates and coatings.",
        details: { specs: ["HS steel", "Multi-stage paint"], features: ["Laser gap checks", "Robotic assembly"] },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
        title: "QC",
        description: "End-of-line validation ensures consistency.",
        details: { features: ["NVH test", "Rain leak test"] },
      },
    ],
    badges: ["Durability", "Refinement"],
  },
  {
    id: "connect",
    category: "Technology",
    title: "Connected Services",
    summary: "CarPlay/Android Auto, OTA updates.",
    kind: "image",
    variant: "technology",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
        title: "Infotainment",
        description: "Fast pairing and voice control.",
        details: { specs: ["Apple CarPlay", "Android Auto", "Wi-Fi hotspot"], tech: ["Cloud services", "OTA"] },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
        title: "Remote",
        description: "Start, lock, and schedule via app.",
        details: { features: ["Remote start", "Geofencing"] },
      },
    ],
    badges: ["CarPlay", "OTA"],
  },
];

/* ================= Props ================= */
interface Props { vehicle: VehicleModel; }

/* ================= Small helpers ================= */
const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2 text-sm">
    <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: TOK.red }} />
    <span className="text-zinc-700">{children}</span>
  </li>
);

function buildSlides(item: MediaItem): (Slide & { _isVideo?: boolean })[] {
  // If video exists, represent it as the first "slide"
  const imgs = [...(item.gallery || [])];
  if (imgs.length < 2 && item.thumbnail) {
    imgs.push({ url: item.thumbnail, title: item.title + " — Overview", description: item.summary });
  }
  if (imgs.length < 2 && imgs[0]) {
    imgs.push({ ...imgs[0], title: imgs[0].title + " (detail)" });
  }
  const slides = imgs;
  return (item.video ? [{ url: "", title: "Video", description: "", details: {}, _isVideo: true } as any, ...slides] : slides) as any;
}

/* ================= Light, distinct interactions ================= */
function PerformanceUX({ value, setValue }: { value: number; setValue: (n: number) => void }) {
  const reduced = usePrefersReducedMotion();
  const torque = Math.round(50 + value * 0.6);
  const resp = Math.round(55 + value * 0.4);
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-red-600">Boost</span>
        <span className="text-zinc-500">{value}%</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={(e)=>setValue(Number(e.target.value))} className="w-full accent-red-600" aria-label="Boost"/>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        {[
          { label: "Torque", val: torque },
          { label: "Response", val: resp },
        ].map(({label, val}) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between"><span>{label}</span><span>{val}%</span></div>
            <div className="h-2 rounded-full bg-zinc-100"><div className="h-2 rounded-full" style={{width:`${val}%`, background:TOK.red, transition: reduced ? "none" : "width .4s"}}/></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function SafetyUX() {
  const [scene, setScene] = useState<"city"|"highway"|"night">("city");
  const presets = { city: ["PCS", "LTA", "AEB pedestrian"], highway: ["ACC", "LTA", "BSM"], night: ["AHS", "PCS (low light)"] } as const;
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 text-sm font-semibold text-blue-700">Scenario</div>
      <div className="mb-3 flex flex-wrap gap-2">
        {(["city","highway","night"] as const).map(k=>(
          <button key={k} onClick={()=>setScene(k)} className={cx("rounded-full border px-3 py-1 text-xs", scene===k ? "border-blue-300 bg-blue-50" : "hover:bg-zinc-50")}>
            {k[0].toUpperCase()+k.slice(1)}
          </button>
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-2 text-xs">
        {presets[scene].map(f=> <li key={f} className="rounded-lg border border-blue-200 px-2 py-1">{f}</li>)}
      </ul>
    </div>
  );
}
function InteriorUX({ ambient, setAmbient }: { ambient: boolean; setAmbient: (b: boolean)=>void }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-amber-700">Ambience</div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={ambient} onChange={(e)=>setAmbient(e.target.checked)} className="accent-amber-700"/>
          <span>Ambient lighting</span>
        </label>
      </div>
      <style>{`
        .interior-ambient { background:
          radial-gradient(120px 80px at 20% 80%, rgba(255,200,0,.25), transparent 60%),
          radial-gradient(120px 80px at 80% 60%, rgba(0,180,255,.2), transparent 60%);
          pointer-events:none;
        }
      `}</style>
    </div>
  );
}
function QualityUX() {
  const steps = ["Materials","Paint","Assembly","QC"];
  const [i,setI] = useState(0);
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 text-sm font-semibold text-zinc-700">Process</div>
      <div className="flex flex-wrap gap-2">
        {steps.map((s,idx)=>(
          <button key={s} onClick={()=>setI(idx)} className={cx("rounded-full border px-3 py-1 text-xs", i===idx ? "bg-zinc-50" : "hover:bg-zinc-50")}>{idx+1}. {s}</button>
        ))}
      </div>
    </div>
  );
}
function TechnologyUX() {
  const [open, setOpen] = useState<Record<string, boolean>>({ carplay: true, android: false, ota: true, wifi: false });
  const row = (k:string, label:string, body:string) => (
    <div className="rounded-lg border">
      <button onClick={()=>setOpen(p=>({...p,[k]:!p[k]}))} className="flex w-full items-center justify-between px-3 py-2 text-sm">
        <span>{label}</span><span className="text-zinc-500">{open[k] ? "−" : "+"}</span>
      </button>
      {open[k] && <div className="px-3 pb-3 text-xs text-zinc-600">{body}</div>}
    </div>
  );
  return (
    <div className="space-y-2">
      {row("carplay","Apple CarPlay","Connect your iPhone for maps, calls, and music.")}
      {row("android","Android Auto","Use Google Assistant, Maps, and your favorite apps.")}
      {row("ota","OTA Updates","Vehicle software updates install seamlessly in the background.")}
      {row("wifi","Wi-Fi Hotspot","Provide internet access for passengers and devices.")}
    </div>
  );
}
function HandlingUX({ mode, setMode }: { mode: "eco"|"normal"|"sport"|"trail"; setMode: (m:any)=>void }) {
  const opts = ["eco","normal","sport","trail"] as const;
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 text-sm font-semibold text-emerald-700">Drive Mode</div>
      <div className="flex flex-wrap gap-2">
        {opts.map(o=>(
          <button key={o} onClick={()=>setMode(o)} className={cx("rounded-full border px-3 py-1 text-xs", mode===o ? "border-emerald-300 bg-emerald-50" : "hover:bg-zinc-50")}>
            {o[0].toUpperCase()+o.slice(1)}
          </button>
        ))}
      </div>
      <style>{`
        .mode-eco{ filter: saturate(0.9) brightness(1.05) }
        .mode-normal{ filter: none }
        .mode-sport{ filter: contrast(1.1) saturate(1.1) brightness(0.98) }
        .mode-trail{ filter: saturate(1.15) hue-rotate(-5deg) }
      `}</style>
    </div>
  );
}

/* ================= Component ================= */
const VehicleMediaShowcase: React.FC<Props> = () => {
  const items = useMemo(() => DEMO.slice(0, 6), []);
  const topWistiaId = "kvdhnonllm";
  const prefersReduced = usePrefersReducedMotion();

  // Modal
  const [open, setOpen] = useState<MediaItem | null>(null);
  const [idx, setIdx] = useState(0);
  useBodyScrollLock(!!open);
  const openerRef = useRef<HTMLElement | null>(null);

  // Per-modal derived slides (include video as slide 0 if present)
  const slides = useMemo(() => (open ? buildSlides(open) : []), [open]);

  // Variant lightweight states
  const [perfBoost, setPerfBoost] = useState(60);
  const [handlingMode, setHandlingMode] = useState<"eco"|"normal"|"sport"|"trail">("normal");
  const [interiorAmbient, setInteriorAmbient] = useState(true);

  const total = slides.length;
  const visualIsVideo = open?.video && slides[idx]?._isVideo;

  const currentSlide = slides[idx] || null;

  const next = useCallback(() => { if (!open) return; setIdx((p) => (p + 1) % total); }, [open, total]);
  const prev = useCallback(() => { if (!open) return; setIdx((p) => (p - 1 + total) % total); }, [open, total]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); openerRef.current?.focus?.(); }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  // Touch swipe
  const tStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (tStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (tStart.current == null) return;
    const dx = e.changedTouches[0].clientX - tStart.current;
    if (dx > 40) prev();
    if (dx < -40) next();
    tStart.current = null;
  };

  const openBooking = () => {
    try {
      window.dispatchEvent(new CustomEvent("open-booking", { detail: { source: "VehicleMediaShowcase" } }));
      (document.querySelector("[data-open-booking]") as HTMLButtonElement | null)?.click();
    } catch {}
  };

  const mobWrapRef = useRef<HTMLDivElement>(null);
  const [mobIndex, setMobIndex] = useState(0);
  useEffect(() => {
    const el = mobWrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = (el.firstElementChild as HTMLElement | null)?.clientWidth || 1;
      const gap = 16;
      setMobIndex(Math.round(el.scrollLeft / (w + gap)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const thumbOf = (m: MediaItem) => m.thumbnail || m.gallery[0]?.url || "";

  // Focus trap
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(!!open, modalRef, firstFocusRef, () => openerRef.current?.focus?.());

  /* ================= Render ================= */
  return (
    <section className={TOK.container}>
      {/* Video card (untouched) */}
      <div className={cx(TOK.card, TOK.radius, "relative z-0 p-3 md:p-4 mb-12 md:mb-16")}>
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold">Video</span>
          <h2 className="text-2xl font-bold md:text-3xl">Highlights</h2>
        </div>
        <div className="overflow-hidden rounded-xl">
          <WistiaEmbed id={topWistiaId} aspect={16 / 9} muted autoPlay />
        </div>
      </div>

      {/* MOBILE: ONLY the carousel (no tiles duplication) */}
      <div className="mb-6 md:hidden">
        <div ref={mobWrapRef} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2" style={{ WebkitOverflowScrolling: "touch" }}>
          {items.map((m) => (
            <button
              key={m.id}
              onClick={(e) => { openerRef.current = e.currentTarget; setOpen(m); setIdx(0); }}
              className={cx(TOK.card, TOK.radius, TOK.ring, "snap-start min-w-[86%] overflow-hidden text-left")}
            >
              <div className="relative">
                <ImageSafe src={thumbOf(m)} alt={m.title} cover className="h-44 w-full" />
                <div className="absolute left-0 top-0 h-1 rounded-tl-[16px]" style={{ background: TOK.red, width: 72 }} />
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{m.category}</span>
                  {m.badges?.slice(0, 2).map((b) => (
                    <span key={b} className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px]">{b}</span>
                  ))}
                </div>
                <h3 className="text-base font-semibold">{m.title}</h3>
                <p className={cx("mt-1 text-sm", TOK.muted)}>{m.summary}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-2">
          {items.map((_, i) => (
            <span key={i} className={cx("h-1.5 w-1.5 rounded-full", i === mobIndex ? "" : "bg-zinc-300")} style={{ background: i === mobIndex ? TOK.red : undefined }} />
          ))}
        </div>
      </div>

      {/* DESKTOP/TABLET GRID (hidden on mobile) */}
      <div className="relative z-[1] hidden grid-cols-2 gap-6 md:grid lg:grid-cols-3">
        {items.map((m) => (
          <button
            key={m.id}
            onClick={(e) => { openerRef.current = e.currentTarget; setOpen(m); setIdx(0); }}
            className={cx(TOK.card, TOK.radius, TOK.ring, "overflow-hidden text-left transition-shadow hover:shadow-md")}
          >
            <div className="relative">
              <ImageSafe src={thumbOf(m)} alt={m.title} cover className="h-56 w-full md:h-64" />
              <div className="absolute left-0 top-0 h-1 rounded-tl-[16px]" style={{ background: TOK.red, width: 82 }} />
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{m.category}</span>
                {m.badges?.slice(0, 3).map((b) => (
                  <span key={b} className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px]">{b}</span>
                ))}
              </div>
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <p className={cx("mt-1 text-sm", TOK.muted)}>{m.summary}</p>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL – SIMPLE, MOBILE-FIRST */}
      {open && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
          role="dialog" aria-modal="true" aria-labelledby="media-modal-title"
          onClick={() => { setOpen(null); openerRef.current?.focus?.(); }}
        >
          <div
            ref={modalRef}
            // Use dvh with svh fallback for mobile Safari; keep content scrollable and footer fixed
            className={cx("bg-white w-full md:max-w-[1300px] md:rounded-2xl overflow-hidden flex flex-col")}
            style={{ height: "100dvh" } as React.CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 border-b bg-white/95 px-3 py-3 backdrop-blur md:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 id="media-modal-title" className="truncate text-base font-bold md:text-2xl">{open.title}</h4>
                  <p className="text-xs text-zinc-500 md:text-sm">{open.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs md:text-sm">{idx + 1}/{total}</span>
                  <button ref={firstFocusRef} type="button" onClick={() => { setOpen(null); openerRef.current?.focus?.(); }} className="rounded-full border px-3 py-2 hover:bg-zinc-50">Close</button>
                </div>
              </div>
            </div>

            {/* Body (ONLY this area scrolls) */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* Visual */}
              <div
                className="relative bg-black"
                onTouchStart={(e)=>{ const t=e.touches[0]?.clientX; (tStart as any).current = t; }}
                onTouchEnd={(e)=>{ const s=tStart.current; if(s==null) return; const dx=e.changedTouches[0].clientX - s; if(dx>40) prev(); if(dx<-40) next(); tStart.current=null; }}
              >
                {visualIsVideo ? (
                  open.video?.provider === "wistia" ? (
                    <WistiaEmbed id={open.video.id} autoPlay={open.video.autoplay} muted className="h-full w-full" />
                  ) : (
                    <div className="relative h-full w-full" style={{ aspectRatio: "16/9" }}>
                      <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube.com/embed/${open.video?.id}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1`} title="Video" allow="autoplay; encrypted-media; picture-in-picture" />
                    </div>
                  )
                ) : (
                  <div className={cx("relative w-full", "md:rounded-tl-2xl")}>
                    <div className="w-full" style={{ aspectRatio: "16/9", maxHeight: "56dvh" }}>
                      <ImageSafe
                        src={(currentSlide?.url || open.thumbnail) as string}
                        alt={(currentSlide?.title || open.title) as string}
                        cover
                        className={cx("h-full w-full", open.variant === "handling" ? `mode-${handlingMode}` : "")}
                      />
                      {open.variant === "interior" && interiorAmbient && <div className="interior-ambient absolute inset-0" />}
                    </div>
                  </div>
                )}

                {/* Arrows (hide on very small screens to keep it clean) */}
                {total > 1 && (
                  <>
                    <button type="button" aria-label="Previous" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 hidden rounded-full bg-white px-3 py-2 text-zinc-900 shadow xs:block">‹</button>
                    <button type="button" aria-label="Next" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 hidden rounded-full bg-white px-3 py-2 text-zinc-900 shadow xs:block">›</button>
                  </>
                )}
              </div>

              {/* Slide tabs (Video + images) */}
              {total > 1 && (
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
                  <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-2 md:px-6">
                    {slides.map((s, i) => (
                      <button
                        key={(s._isVideo ? "video" : s.url) + i}
                        onClick={() => setIdx(i)}
                        className={cx(
                          "whitespace-nowrap rounded-full border px-3 py-1 text-xs",
                          i === idx ? "border-zinc-900" : "hover:bg-zinc-50"
                        )}
                      >
                        {s._isVideo ? "Video" : (s.title || `Slide ${i + 1}`)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Per-slide content */}
              <div className="px-3 py-4 md:px-6">
                <div className={cx("mb-3 rounded-xl border p-4", VARIANT[open.variant].slab)}>
                  <h5 className={cx("mb-1 text-lg font-semibold", VARIANT[open.variant].accent)}>{currentSlide?.title || open.title}</h5>
                  <p className={TOK.muted}>{currentSlide?.description || open.summary}</p>
                </div>

                {/* Bullets by category */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {currentSlide?.details?.specs && (
                    <div className={cx(TOK.card,"rounded-xl p-4")}>
                      <h6 className="mb-2 text-sm font-semibold">Specifications</h6>
                      <ul className="space-y-1">{currentSlide.details.specs.slice(0,6).map((s,i)=>(<Bullet key={i}>{s}</Bullet>))}</ul>
                    </div>
                  )}
                  {currentSlide?.details?.features && (
                    <div className={cx(TOK.card,"rounded-xl p-4")}>
                      <h6 className="mb-2 text-sm font-semibold">Features</h6>
                      <ul className="space-y-1">{currentSlide.details.features.slice(0,6).map((s,i)=>(<Bullet key={i}>{s}</Bullet>))}</ul>
                    </div>
                  )}
                  {currentSlide?.details?.tech && (
                    <div className={cx(TOK.card,"rounded-xl p-4")}>
                      <h6 className="mb-2 text-sm font-semibold">Technology</h6>
                      <ul className="space-y-1">{currentSlide.details.tech.slice(0,6).map((s,i)=>(<Bullet key={i}>{s}</Bullet>))}</ul>
                    </div>
                  )}
                </div>

                {/* Variant micro-interaction (simple & different per modal) */}
                <div className="mt-4 space-y-4">
                  {open.variant === "performance" && <PerformanceUX value={perfBoost} setValue={setPerfBoost} />}
                  {open.variant === "safety" && <SafetyUX />}
                  {open.variant === "interior" && <InteriorUX ambient={interiorAmbient} setAmbient={setInteriorAmbient} />}
                  {open.variant === "quality" && <QualityUX />}
                  {open.variant === "technology" && <TechnologyUX />}
                  {open.variant === "handling" && <HandlingUX mode={handlingMode} setMode={setHandlingMode} />}
                </div>
              </div>
            </div>

            {/* Footer (fixed) */}
            <div className="shrink-0 border-t bg-white/95 px-3 py-3 backdrop-blur md:px-6">
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => { setOpen(null); openerRef.current?.focus?.(); }} className="rounded-full border px-4 py-2 hover:bg-zinc-50">Close</button>
                <button type="button" onClick={openBooking} className="rounded-full px-4 py-2 font-semibold text-white" style={{ background: TOK.red }}>Book Test Drive</button>
              </div>
              <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default VehicleMediaShowcase;
