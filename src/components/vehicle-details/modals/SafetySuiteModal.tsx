import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Shield, Eye, AlertTriangle, Car, Zap, Gauge, Users, Heart,
  ChevronRight, CheckCircle2, Play, X
} from "lucide-react";
import {
  MobileOptimizedDialog,
  MobileOptimizedDialogContent,
  MobileOptimizedDialogHeader,
  MobileOptimizedDialogBody,
  MobileOptimizedDialogFooter,
  MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription,
} from "@/components/ui/mobile-optimized-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CollapsibleContent from "@/components/ui/collapsible-content";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

/* -------------------------------------------------------------------------- */
/*                                  Config                                     */
/* -------------------------------------------------------------------------- */

type ScenarioKey = "preCollision" | "laneDrift" | "cruise" | "night";

const IMG_LANE =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true";
const IMG_CRUISE =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/cbbefa79-6002-4f61-94e0-ee097a8dc6c6/items/a7ed1d12-7c0e-4377-84f1-bf4d0230ded6/renditions/4b8651e3-1a7c-4e08-aab5-aa103f6a5b4b?binary=true&mformat=true";
const IMG_NIGHT =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/9200d151-0947-45d4-b2de-99d247bee98a/renditions/d5c695c7-b387-4005-bf45-55b8786bafd7?binary=true&mformat=true";

const YT_PRECOLLISION = "oL6mrPWtZJ4"; // https://www.youtube.com/watch?v=oL6mrPWtZJ4

/* -------------------------------------------------------------------------- */
/*                              Reusable pieces                                */
/* -------------------------------------------------------------------------- */

const ScenarioPills: React.FC<{
  active: ScenarioKey;
  setActive: (k: ScenarioKey) => void;
}> = ({ active, setActive }) => {
  const items: { key: ScenarioKey; label: string; icon: React.ElementType }[] = [
    { key: "preCollision", label: "Pre-Collision", icon: Eye },
    { key: "laneDrift", label: "Lane Assist", icon: AlertTriangle },
    { key: "cruise", label: "Adaptive Cruise", icon: Car },
    { key: "night", label: "Auto High Beam", icon: Zap },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActive(key)}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition",
            active === key
              ? "bg-primary text-primary-foreground border-transparent shadow-sm"
              : "hover:bg-muted border"
          )}
          aria-pressed={active === key}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

/** Privacy-enhanced YouTube with poster overlay; loads only on click */
const YoutubeInline: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  const [play, setPlay] = React.useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${play ? "&autoplay=1" : ""}`;
  const poster = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black ring-1 ring-black/5">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {!play && (
          <button
            onClick={() => setPlay(true)}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-95 transition"
              style={{ backgroundImage: `url('${poster}')` }}
            />
            <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm font-medium shadow">
              <Play className="h-4 w-4" />
              Play video
            </div>
          </button>
        )}
        {play && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={src}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

/** Swipeable image gallery with thumbnails & keyboard support */
const ImageGallery: React.FC<{
  images: { src: string; alt: string }[];
  initial?: number;
  caption?: string;
}> = ({ images, initial = 0, caption }) => {
  const [idx, setIdx] = React.useState(initial);
  const prefersReduced = useReducedMotion();
  const canPrev = idx > 0;
  const canNext = idx < images.length - 1;

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" && canNext) setIdx((i) => i + 1);
    if (e.key === "ArrowLeft" && canPrev) setIdx((i) => i - 1);
  };

  return (
    <div
      className="rounded-xl ring-1 ring-black/5 bg-background/60 backdrop-blur-md border overflow-hidden"
      tabIndex={0}
      onKeyDown={onKey}
      aria-label="Image gallery. Use left and right arrow keys to navigate."
    >
      <div className="relative">
        <div className="relative w-full overflow-hidden">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={images[idx].src}
                src={images[idx].src}
                alt={images[idx].alt || ""}
                className="absolute inset-0 h-full w-full object-cover"
                initial={prefersReduced ? {} : { opacity: 0.0, scale: 0.98 }}
                animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
                exit={prefersReduced ? {} : { opacity: 0 }}
                transition={{ duration: 0.25 }}
                loading="lazy"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <button
            aria-label="Previous image"
            disabled={!canPrev}
            onClick={() => canPrev && setIdx((i) => i - 1)}
            className={cn(
              "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
              !canPrev && "opacity-40 pointer-events-none"
            )}
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            disabled={!canNext}
            onClick={() => canNext && setIdx((i) => i + 1)}
            className={cn(
              "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
              !canNext && "opacity-40 pointer-events-none"
            )}
          >
            ›
          </button>
        </div>

        {/* Caption */}
        {caption && (
          <div className="absolute bottom-2 left-2 right-2 text-xs text-white/95">
            <div className="inline-block rounded-md bg-black/45 px-2 py-1 backdrop-blur-sm">
              {caption}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-2 border-t bg-background/70">
        {images.map((im, i) => (
          <button
            key={im.src}
            onClick={() => setIdx(i)}
            className={cn(
              "relative h-14 w-20 rounded-md overflow-hidden ring-1 ring-black/5",
              i === idx && "outline outline-2 outline-primary"
            )}
            aria-label={`Go to image ${i + 1}`}
          >
            <img src={im.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

/* Minimal placeholder card (kept for non-video scenarios if desired later) */
const CardShell: React.FC<{ title: string; subtitle: string; accent?: "blue" | "amber" | "emerald" }> = ({ title, subtitle, accent = "blue" }) => {
  const accentMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-500/0 ring-blue-300/30",
    amber: "from-amber-500/20 to-amber-500/0 ring-amber-300/30",
    emerald: "from-emerald-500/20 to-emerald-500/0 ring-emerald-300/30",
  };
  return (
    <div className={cn("relative rounded-lg p-4 lg:p-6 bg-gradient-to-b ring-1", accentMap[accent])}>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-semibold">{title}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded bg-background/60 border" />
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                           Main Safety Suite Modal                           */
/* -------------------------------------------------------------------------- */

interface SafetySuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  modelName?: string;
  regionLabel?: string;
}

const SafetySuiteModal: React.FC<SafetySuiteModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  modelName = "Toyota Camry",
  regionLabel = "UAE",
}) => {
  useBodyScrollLock(isOpen);

  const prefersReduced = useReducedMotion();
  const [scenario, setScenario] = React.useState<ScenarioKey>("laneDrift");

  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  const safetyFeatures = [
    {
      icon: Eye,
      name: "Pre-Collision System",
      chips: ["Pedestrian", "Auto Brake", "Radar"],
      details:
        "Camera + radar help detect vehicles/pedestrians and can apply brakes if a collision is likely.",
      active: scenario === "preCollision",
    },
    {
      icon: AlertTriangle,
      name: "Lane Departure Alert",
      chips: ["Steering Assist", "Road Edge"],
      details:
        "Monitors lane markers and can provide steering assist to help keep you centered.",
      active: scenario === "laneDrift",
    },
    {
      icon: Car,
      name: "Dynamic Radar Cruise",
      chips: ["Stop & Go", "Distance Set"],
      details:
        "Automatically adjusts speed to maintain a preset following distance.",
      active: scenario === "cruise",
    },
    {
      icon: Zap,
      name: "Automatic High Beams",
      chips: ["Auto Dip", "Camera"],
      details:
        "Optimizes visibility by toggling high/low beams when traffic is detected.",
      active: scenario === "night",
    },
  ] as const;

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      {/* Wider for media clarity */}
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        {/* COMPACT MOBILE HEADER */}
        <MobileOptimizedDialogHeader className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <MobileOptimizedDialogTitle className="text-lg font-semibold leading-tight sm:text-2xl sm:font-bold">
              Toyota Safety Sense 2.0 · {modelName}
            </MobileOptimizedDialogTitle>
            {/* Mobile inline close (desktop keeps default spacing) */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden shrink-0"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Hide description on mobile, show on ≥sm */}
          <MobileOptimizedDialogDescription className="hidden sm:block text-base text-muted-foreground mt-1">
            Real scenarios you can see—then book a test drive.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero area: scenario + media */}
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 lg:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ring-1 ring-primary/20 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-7 w-7 text-primary" />
                <Badge variant="secondary" className="text-xs font-semibold">
                  Standard on most grades
                </Badge>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Left: scenario controls + micro timeline */}
                <div className="lg:w-72 space-y-3">
                  <ScenarioPills active={scenario} setActive={setScenario} />
                  <div className="rounded-lg border p-3 bg-background/60 backdrop-blur">
                    <h4 className="text-sm font-semibold mb-2">Reaction Timeline</h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { t: "0.0s", label: "Detect" },
                        { t: "0.3s", label: "Alert" },
                        { t: "0.5s", label: "Assist" },
                        { t: "0.6s", label: "Stabilize" },
                      ].map((s, i) => (
                        <motion.div
                          key={s.t}
                          initial={{ opacity: 0.4, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-md border p-2 bg-background"
                        >
                          <div className="font-semibold">{s.t}</div>
                          <div className="text-muted-foreground">{s.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: media */}
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    {scenario === "preCollision" && (
                      <motion.div key="pre" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <YoutubeInline videoId={YT_PRECOLLISION} title="Pre-Collision System" />
                      </motion.div>
                    )}

                    {scenario === "laneDrift" && (
                      <motion.div key="lane" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <ImageGallery
                          images={[
                            { src: IMG_LANE, alt: "Lane Assist visualization" },
                            { src: IMG_CRUISE, alt: "Road view – cruise support" },
                            { src: IMG_NIGHT, alt: "Night visibility / Auto High Beam" },
                          ]}
                          initial={0}
                          caption="Lane Assist keeps you centered with gentle steering support."
                        />
                      </motion.div>
                    )}

                    {scenario === "cruise" && (
                      <motion.div key="cruise" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <ImageGallery
                          images={[
                            { src: IMG_CRUISE, alt: "Adaptive Cruise – maintains distance" },
                            { src: IMG_LANE, alt: "Lane guidance context" },
                            { src: IMG_NIGHT, alt: "Night conditions" },
                          ]}
                          initial={0}
                          caption="Adaptive Cruise automatically maintains a safe following distance."
                        />
                      </motion.div>
                    )}

                    {scenario === "night" && (
                      <motion.div key="night" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <ImageGallery
                          images={[
                            { src: IMG_NIGHT, alt: "Auto High Beam – clearer night view" },
                            { src: IMG_CRUISE, alt: "Cruise and visibility" },
                            { src: IMG_LANE, alt: "Lane context at night" },
                          ]}
                          initial={0}
                          caption="Auto High Beam toggles headlights for optimal visibility."
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Core features — compact + progressive */}
            <div>
              <h3 className="text-xl font-bold mb-3">Core Safety Features</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {safetyFeatures.map((f, idx) => (
                  <motion.div
                    key={f.name}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:border-muted-foreground/20 bg-background/60 backdrop-blur",
                      f.active && "border-primary/30 bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-md", f.active ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <f.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold leading-tight">{f.name}</h4>
                          {f.active && <Badge className="h-5 px-2 text-[10px]">Selected</Badge>}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {f.chips.map((c) => (
                            <span key={c} className="px-2 py-0.5 text-[11px] rounded-full bg-muted">{c}</span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{f.details}</p>
                        <CollapsibleContent title="Learn more" className="border-0 mt-1">
                          <p className="text-sm text-muted-foreground">{f.details}</p>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Complete package — compact */}
            <div>
              <h3 className="text-xl font-bold mb-3">Complete Safety Package</h3>
              <div className="space-y-3">
                {[
                  { icon: Gauge, title: "Star Safety System", features: ["VSC", "TRAC", "ABS", "EBD", "BA", "SST"] },
                  { icon: Users, title: "Airbag System", features: ["Front Airbags", "Front Side", "Rear Side", "Curtains"] },
                  { icon: Heart, title: "Active Safety", features: ["Blind Spot Monitor", "Rear Cross-Traffic Alert", "Bird’s Eye View", "Parking Support Brake"] },
                ].map((system, index) => (
                  <CollapsibleContent
                    key={system.title}
                    title={
                      <div className="flex items-center gap-3">
                        <system.icon className="h-5 w-5 text-primary" />
                        <span>{system.title}</span>
                      </div>
                    }
                    defaultOpen={index === 0}
                    className="border bg-background/60 backdrop-blur"
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {system.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs text-muted-foreground mt-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Features may vary by grade/model year and region ({regionLabel}).</span>
                </div>
              </div>
            </div>
          </div>
        </MobileOptimizedDialogBody>

        {/* Single CTA only */}
        <MobileOptimizedDialogFooter className="px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex w-full sm:w-auto sm:ml-auto gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onBookTestDrive}>Book Test Drive</Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default SafetySuiteModal;
