"use client";
import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Shield, Eye, AlertTriangle, Car, Zap, Gauge, Users, Heart, Play, X
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

const YT_PRECOLLISION = "oL6mrPWtZJ4";

/* -------------------------------------------------------------------------- */
/*                             Reusable Components                             */
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
            "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition overflow-hidden",
            active === key
              ? "bg-primary text-primary-foreground border-transparent shadow"
              : "hover:bg-muted border"
          )}
          aria-pressed={active === key}
        >
          <Icon className="h-4 w-4" />
          {label}
          {active === key && (
            <motion.span
              layoutId="active-pill"
              className="absolute inset-0 rounded-full ring-2 ring-primary/40"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

const YoutubeInline: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  const [play, setPlay] = React.useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${play ? "&autoplay=1" : ""}`;
  const poster = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-xl">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {!play ? (
          <button
            onClick={() => setPlay(true)}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-95 transition"
              style={{ backgroundImage: `url('${poster}')` }}
            />
            <div className="relative z-10 flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 backdrop-blur text-sm font-medium shadow-lg">
              <Play className="h-4 w-4" />
              Play video
            </div>
          </button>
        ) : (
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

const ImageGallery: React.FC<{
  images: { src: string; alt: string }[];
  initial?: number;
  caption?: string;
}> = ({ images, initial = 0, caption }) => {
  const [idx, setIdx] = React.useState(initial);
  const prefersReduced = useReducedMotion();
  const canPrev = idx > 0;
  const canNext = idx < images.length - 1;

  return (
    <div
      className="rounded-2xl ring-1 ring-white/10 bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-md border border-white/10 overflow-hidden shadow-xl"
    >
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={images[idx].src}
            src={images[idx].src}
            alt={images[idx].alt || ""}
            className="absolute inset-0 h-full w-full object-cover"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.97 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
          />
        </AnimatePresence>
      </div>
      {/* Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3">
        <button
          aria-label="Previous image"
          disabled={!canPrev}
          onClick={() => canPrev && setIdx((i) => i - 1)}
          className={cn(
            "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border hover:scale-105 transition",
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
            "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border hover:scale-105 transition",
            !canNext && "opacity-40 pointer-events-none"
          )}
        >
          ›
        </button>
      </div>
      {/* Caption */}
      {caption && (
        <div className="absolute bottom-2 left-2 right-2 text-sm text-white">
          <div className="inline-block rounded-md bg-black/50 px-3 py-1 backdrop-blur">
            {caption}
          </div>
        </div>
      )}
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
  onCompareGrades?: () => void;
  onSeeOffers?: () => void;
}

const SafetySuiteModal: React.FC<SafetySuiteModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  modelName = "Toyota Camry",
  regionLabel = "UAE",
  onCompareGrades,
  onSeeOffers,
}) => {
  const prefersReduced = useReducedMotion();
  const [scenario, setScenario] = React.useState<ScenarioKey>("laneDrift");

  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  const taglines: Record<ScenarioKey, string> = {
    preCollision: "Eyes that never blink.",
    laneDrift: "Confidence in every lane.",
    cruise: "Relax, your pace is matched.",
    night: "Brighter nights, smarter lights.",
  };

  const scenarioIndex: Record<ScenarioKey, number> = {
    preCollision: 0,
    laneDrift: 1,
    cruise: 2,
    night: 3,
  };

  const progress = ((scenarioIndex[scenario] + 1) / 4) * 100;

  const safetyFeatures = [
    {
      icon: Eye,
      name: "Pre-Collision System",
      chips: ["Pedestrian", "Auto Brake", "Radar"],
      details: "Camera + radar help detect vehicles/pedestrians and can apply brakes if a collision is likely.",
      active: scenario === "preCollision",
    },
    {
      icon: AlertTriangle,
      name: "Lane Departure Alert",
      chips: ["Steering Assist", "Road Edge"],
      details: "Monitors lane markers and can provide steering assist to help keep you centered.",
      active: scenario === "laneDrift",
    },
    {
      icon: Car,
      name: "Dynamic Radar Cruise",
      chips: ["Stop & Go", "Distance Set"],
      details: "Automatically adjusts speed to maintain a preset following distance.",
      active: scenario === "cruise",
    },
    {
      icon: Zap,
      name: "Automatic High Beams",
      chips: ["Auto Dip", "Camera"],
      details: "Optimizes visibility by toggling high/low beams when traffic is detected.",
      active: scenario === "night",
    },
  ] as const;

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <MobileOptimizedDialogHeader className="px-4 py-3 sm:px-6 sm:py-5 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-t-3xl">
          <div className="flex items-center justify-between gap-2">
            <MobileOptimizedDialogTitle className="text-xl font-bold sm:text-2xl">
              Toyota Safety Sense 2.0 · {modelName}
            </MobileOptimizedDialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <MobileOptimizedDialogDescription className="hidden sm:block text-base text-gray-300 mt-1">
            Real scenarios you can see—then book a test drive.
          </MobileOptimizedDialogDescription>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
              initial={false}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            />
          </div>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody className="bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
          <div className="space-y-8">
            {/* Scenario Section */}
            <motion.section
              initial={enter}
              animate={entered}
              transition={{ duration: 0.35 }}
              className="rounded-3xl p-5 lg:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ring-1 ring-primary/20 backdrop-blur-xl"
            >
              <ScenarioPills active={scenario} setActive={setScenario} />
              <motion.p
                key={scenario}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="mt-3 text-lg font-semibold italic text-primary"
              >
                {taglines[scenario]}
              </motion.p>
              <div className="mt-6 flex flex-col lg:flex-row gap-6">
                {/* Timeline */}
                <div className="lg:w-72 space-y-3">
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
                        transition={{ delay: i * 0.08 }}
                        className="rounded-md border p-2 bg-background/60 backdrop-blur"
                      >
                        <div className="font-semibold">{s.t}</div>
                        <div className="text-muted-foreground">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Media */}
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    {scenario === "preCollision" && (
                      <motion.div key="pre" initial={enter} animate={entered} exit={{ opacity: 0 }}>
                        <YoutubeInline videoId={YT_PRECOLLISION} title="Pre-Collision System" />
                      </motion.div>
                    )}
                    {scenario === "laneDrift" && (
                      <motion.div key="lane" initial={enter} animate={entered} exit={{ opacity: 0 }}>
                        <ImageGallery
                          images={[
                            { src: IMG_LANE, alt: "Lane Assist visualization" },
                            { src: IMG_CRUISE, alt: "Road view – cruise support" },
                            { src: IMG_NIGHT, alt: "Night visibility / Auto High Beam" },
                          ]}
                          caption="Lane Assist keeps you centered with gentle steering support."
                        />
                      </motion.div>
                    )}
                    {scenario === "cruise" && (
                      <motion.div key="cruise" initial={enter} animate={entered} exit={{ opacity: 0 }}>
                        <ImageGallery
                          images={[
                            { src: IMG_CRUISE, alt: "Adaptive Cruise – maintains distance" },
                            { src: IMG_LANE, alt: "Lane guidance context" },
                            { src: IMG_NIGHT, alt: "Night conditions" },
                          ]}
                          caption="Adaptive Cruise automatically maintains a safe following distance."
                        />
                      </motion.div>
                    )}
                    {scenario === "night" && (
                      <motion.div key="night" initial={enter} animate={entered} exit={{ opacity: 0 }}>
                        <ImageGallery
                          images={[
                            { src: IMG_NIGHT, alt: "Auto High Beam – clearer night view" },
                            { src: IMG_CRUISE, alt: "Cruise and visibility" },
                            { src: IMG_LANE, alt: "Lane context at night" },
                          ]}
                          caption="Auto High Beam toggles headlights for optimal visibility."
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.section>

            {/* Core Features */}
            <section>
              <h3 className="text-xl font-bold mb-3">Core Safety Features</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {safetyFeatures.map((f, idx) => (
                  <motion.div
                    key={f.name}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:border-primary/40 bg-background/60 backdrop-blur",
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
            </section>

            {/* Complete Package */}
            <section>
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
            </section>
          </div>
        </MobileOptimizedDialogBody>

        {/* Footer */}
        <MobileOptimizedDialogFooter className="px-4 py-4 sm:px-6 sm:py-6 bg-black/80 rounded-b-3xl border-t border-white/10">
          <div className="flex w-full flex-col sm:flex-row sm:justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/40 text-white hover:bg-white/10"
            >
              Close
            </Button>
            <Button onClick={onBookTestDrive} className="bg-primary text-primary-foreground">
              Book Test Drive
            </Button>
            {onCompareGrades && (
              <Button variant="secondary" onClick={onCompareGrades}>
                Compare Grades
              </Button>
            )}
            {onSeeOffers && (
              <Button variant="secondary" onClick={onSeeOffers}>
                See Offers
              </Button>
            )}
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default SafetySuiteModal;
