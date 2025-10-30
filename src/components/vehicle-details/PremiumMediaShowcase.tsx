import React, { useEffect, useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Info,
  Shield,
  Zap,
  Heart,
  Wifi,
  Award,
  Star,
  X,
  Car,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────── */
type Variant =
  | "performance"
  | "safety"
  | "interior"
  | "quality"
  | "technology"
  | "handling";

interface SceneDetails {
  overview?: string;
  hotspots?: Array<{ x: number; y: number; label: string; body: string }>;
}
interface Scene {
  url: string;
  title: string;
  description?: string;
  details?: SceneDetails;
}
interface MediaItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: Scene[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  tags?: string[];
  variant: Variant;
}

const FALLBACK =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop";
const cn = (...a: (string | false | null | undefined)[]) =>
  a.filter(Boolean).join(" ");

/* ─────────────────────────────────────────────────────────
   Utilities
────────────────────────────────────────────────────────── */
function Hotspot({
  x,
  y,
  label,
  body,
  dark,
}: {
  x: number;
  y: number;
  label: string;
  body: string;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "absolute w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold shadow",
          dark ? "bg-white/95 text-black" : "bg-black/80 text-white"
        )}
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-label={label}
      >
        i
      </button>
      {open && (
        <div
          className={cn(
            "absolute max-w-[220px] text-xs rounded p-2 shadow",
            dark ? "bg-white/95 text-gray-900" : "bg-black/85 text-white"
          )}
          style={{ left: `calc(${x}% + 14px)`, top: `calc(${y}% - 6px)` }}
        >
          <div className="font-semibold">{label}</div>
          <div className="mt-0.5">{body}</div>
        </div>
      )}
    </>
  );
}

function useLockBodyScroll() {
  useEffect(() => {
    const b = document.body;
    const prev = b.style.overflow;
    b.style.overflow = "hidden";
    return () => {
      b.style.overflow = prev;
    };
  }, []);
}

/* ─────────────────────────────────────────────────────────
   Modals
────────────────────────────────────────────────────────── */

// 1. Performance
function PerformanceModal({
  item,
  onClose,
  onBook,
}: {
  item: MediaItem;
  onClose: () => void;
  onBook?: () => void;
}) {
  const [i, setI] = useState(0);
  const s = item.gallery[i];
  useLockBodyScroll();

  return (
    <div className="fixed inset-0 z-50 bg-black/85">
      <button
        className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute inset-0 grid md:grid-cols-[360px_1fr]">
        <aside className="hidden md:flex flex-col gap-3 p-4 text-white/90">
          <Badge className="bg-gradient-to-r from-red-600 to-red-700 border-0 text-white mb-2">
            <Zap className="h-3.5 w-3.5 mr-1" /> Performance
          </Badge>
          <div className="text-sm font-semibold">{s?.title}</div>
          <div className="text-xs opacity-90 mt-1">
            {s?.description || item.summary}
          </div>
          {s?.details?.hotspots?.map((h, idx) => (
            <div
              key={idx}
              className="rounded-lg px-3 py-2 text-xs bg-zinc-900/70 border border-white/10"
            >
              {h.label}
            </div>
          ))}
        </aside>

        <div className="relative">
          <img
            src={s?.url || FALLBACK}
            alt={s?.title || item.title}
            className="absolute inset-0 w-full h-full object-contain"
          />
          {s?.details?.hotspots?.map((h, idx) => (
            <Hotspot
              key={idx}
              x={h.x}
              y={h.y}
              label={h.label}
              body={h.body}
              dark
            />
          ))}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 bg-zinc-950 border-t border-white/10 px-4 py-3 flex flex-col sm:flex-row gap-2 items-center">
        <p className="text-white/80 text-sm grow">{item.summary}</p>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button className="bg-[#EB0A1E]" onClick={onBook}>
          <Car className="h-4 w-4 mr-2" /> Book Test Drive
        </Button>
      </div>
    </div>
  );
}

// 2. Safety
function SafetyModal({
  item,
  onClose,
  onBook,
}: {
  item: MediaItem;
  onClose: () => void;
  onBook?: () => void;
}) {
  useLockBodyScroll();
  const v = item.video;
  const src = v
    ? v.provider === "youtube"
      ? `https://www.youtube.com/embed/${v.id}`
      : `https://fast.wistia.net/embed/iframe/${v.id}`
    : null;

  return (
    <div className="fixed inset-0 z-50 grid grid-rows-[48px_1fr_56px] bg-[#081622] text-white">
      <header className="px-4 flex items-center justify-between border-b border-white/10">
        <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white">
          <Shield className="h-3.5 w-3.5 mr-1" /> Safety
        </Badge>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </header>
      <div className="relative bg-black">
        {src ? (
          <iframe
            title={item.title}
            className="absolute inset-0 w-full h-full"
            src={src}
            allowFullScreen
          />
        ) : (
          <img
            src={item.gallery[0]?.url || FALLBACK}
            alt="Safety"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      <footer className="px-3 py-2 border-t border-white/10 bg-white/5 flex gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button className="bg-[#EB0A1E]" onClick={onBook}>
          <Car className="h-4 w-4 mr-2" /> Book Test Drive
        </Button>
      </footer>
    </div>
  );
}

// 3. Interior
function InteriorModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  useLockBodyScroll();
  const [i, setI] = useState(0);
  const s = item.gallery[i];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:mx-auto md:w-[96vw] bg-[#1b1408] text-amber-50 rounded-t-2xl md:rounded-2xl overflow-hidden">
        <button
          className="absolute right-3 top-3 bg-amber-900/50 rounded-full p-2"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="grid md:grid-cols-2">
          <div className="relative h-[56vh] md:h-[70vh]">
            <img
              src={s?.url || FALLBACK}
              alt={s?.title || item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4 md:p-6">
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 border-0 text-black mb-2">
              <Heart className="h-3.5 w-3.5 mr-1" /> Interior
            </Badge>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm mt-2">{s?.description || item.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Quality
function QualityModal({
  item,
  onClose,
  onBook,
}: {
  item: MediaItem;
  onClose: () => void;
  onBook?: () => void;
}) {
  useLockBodyScroll();
  const img = item.gallery[0]?.url || FALLBACK;
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <header className="flex items-center justify-between border-b border-stone-200 px-4 py-2">
        <Badge className="bg-gradient-to-r from-stone-700 to-stone-800 border-0 text-white">
          <Award className="h-3.5 w-3.5 mr-1" /> Quality
        </Badge>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </header>
      <div className="p-4 grid md:grid-cols-2 gap-3">
        <img
          src={img}
          alt="Quality"
          className="rounded-xl w-full h-full object-cover"
        />
      </div>
      <footer className="px-4 py-2 border-t border-stone-200 bg-white flex gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button className="bg-[#EB0A1E]" onClick={onBook}>
          <Car className="h-4 w-4 mr-2" /> Book Test Drive
        </Button>
      </footer>
    </div>
  );
}

// 5. Technology
function TechnologyModal({
  item,
  onClose,
  onBook,
}: {
  item: MediaItem;
  onClose: () => void;
  onBook?: () => void;
}) {
  useLockBodyScroll();
  const img = item.gallery[0]?.url || FALLBACK;
  return (
    <div className="fixed inset-0 z-50 grid md:grid-cols-[1fr_340px] bg-[#071a1e] text-cyan-50">
      <button
        className="absolute top-3 right-3 bg-white/10 rounded-full p-2"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>
      <div className="relative">
        <img
          src={img}
          alt="Technology"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <aside className="hidden md:flex flex-col border-l border-white/10 bg-cyan-900/30 p-4 gap-3">
        <Badge className="bg-gradient-to-r from-cyan-600 to-cyan-700 border-0 text-white">
          <Wifi className="h-3.5 w-3.5 mr-1" /> Technology
        </Badge>
        <div className="mt-auto flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-[#EB0A1E]" onClick={onBook}>
            <Car className="h-4 w-4 mr-2" /> Book Test Drive
          </Button>
        </div>
      </aside>
    </div>
  );
}

// 6. Handling
function HandlingModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  useLockBodyScroll();
  const [mode, setMode] = useState(item.gallery[0]?.title || "Normal");
  const s = item.gallery.find((g) => g.title === mode) ?? item.gallery[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#07170f] text-emerald-50">
      <header className="h-12 px-4 flex items-center justify-between border-b border-white/10">
        <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-0 text-white">
          <Star className="h-3.5 w-3.5 mr-1" /> Handling
        </Badge>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </header>
      <div className="relative h-[calc(100%-48px)]">
        <img
          src={s?.url || FALLBACK}
          alt={s?.title || "Handling"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute left-3 right-3 bottom-3 grid grid-cols-3 gap-2">
          {item.gallery.map((g) => (
            <button
              key={g.title}
              onClick={() => setMode(g.title)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium",
                mode === g.title
                  ? "bg-emerald-600 text-white"
                  : "bg-white/20 text-white"
              )}
            >
              {g.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Showcase
────────────────────────────────────────────────────────── */
interface Props {
  vehicle: VehicleModel;
  items?: MediaItem[];
  onBookTestDrive?: () => void;
}

const PremiumMediaShowcase: React.FC<Props> = ({
  vehicle,
  items,
  onBookTestDrive,
}) => {
  const data = items?.length ? items : [];
  const [active, setActive] = useState<MediaItem | null>(null);
  const [step, setStep] = useState(0);
  const total = data.length;
  const current = data[step];
  const progress = total ? ((step + 1) / total) * 100 : 0;

  if (!current) return null; // ✅ ensure section mounts only if data exists

  const sectionRef = useRef<HTMLDivElement>(null);
  
  return (
    <section ref={sectionRef} className="py-10 md:py-16">
      <div
        className="relative mx-auto max-w-7xl h-[75vh] md:h-[85vh] min-h-[600px] overflow-hidden rounded-3xl border border-border/30 bg-muted/30"
      >
        <motion.div
          key={current.id}
          className="snap-start h-full w-full relative"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={current.gallery[0]?.url || current.thumbnail}
            alt={`${current.category} ${current.title}`}
            className="w-full h-full object-cover"
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.1 }}
            transition={{ 
              duration: 8, 
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute inset-x-0 bottom-0 p-5 md:p-8 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="mb-3 bg-primary text-primary-foreground border-0">
                {current.category}
              </Badge>
            </motion.div>
            <motion.h3 
              className="text-2xl md:text-4xl font-black leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {current.title}
            </motion.h3>
            <motion.p 
              className="mt-2 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {current.summary}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button onClick={() => setActive(current)} className="mt-3">
                Explore details
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-1 bg-[#EB0A1E]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Modals */}
      {active?.variant === "performance" && (
        <PerformanceModal item={active} onClose={() => setActive(null)} onBook={onBookTestDrive} />
      )}
      {active?.variant === "safety" && (
        <SafetyModal item={active} onClose={() => setActive(null)} onBook={onBookTestDrive} />
      )}
      {active?.variant === "interior" && (
        <InteriorModal item={active} onClose={() => setActive(null)} />
      )}
      {active?.variant === "quality" && (
        <QualityModal item={active} onClose={() => setActive(null)} onBook={onBookTestDrive} />
      )}
      {active?.variant === "technology" && (
        <TechnologyModal item={active} onClose={() => setActive(null)} onBook={onBookTestDrive} />
      )}
      {active?.variant === "handling" && (
        <HandlingModal item={active} onClose={() => setActive(null)} />
      )}
    </section>
  );
};


export default PremiumMediaShowcase;
