import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Battery, Zap, Gauge, Leaf, Car, RotateCcw, TrendingUp, X, Play, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MobileOptimizedDialog,
  MobileOptimizedDialogContent,
  MobileOptimizedDialogHeader,
  MobileOptimizedDialogBody,
  MobileOptimizedDialogFooter,
  MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription,
} from "@/components/ui/mobile-optimized-dialog";
import CollapsibleContent from "@/components/ui/collapsible-content";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

/* ----------------------------------------------------------------------------
   Brand & Assets
---------------------------------------------------------------------------- */
const BRAND_RED = "#cb0017";

const IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* ----------------------------------------------------------------------------
   Types
---------------------------------------------------------------------------- */
interface HybridTechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  videoIds?: string[]; // optional; shows Videos tab only if provided
}

type TabKey = "overview" | "diagrams" | "images" | "videos";
type FlowMode = "EV" | "Hybrid" | "Charge";

/* ----------------------------------------------------------------------------
   Content mapped to images (drives dynamic copy)
---------------------------------------------------------------------------- */
const mediaStories = [
  {
    src: IMG_A,
    alt: "Hybrid exterior highlight",
    headline: "Quiet starts, smooth pull-away",
    sub: "In traffic or parking lots, the motor does the work — you glide forward using electric power.",
    bullets: ["Zero tailpipe emissions at low speeds", "Smooth, quiet take-off", "Great for city driving"],
    diagramMode: "EV" as FlowMode,
    caption: "Tip: Swipe the image — content updates below.",
  },
  {
    src: IMG_B,
    alt: "Hybrid cluster and energy info",
    headline: "Smart blend at speed",
    sub: "On the move, the system blends engine and electric power for the best balance of performance and efficiency.",
    bullets: ["Engine + motor work together", "Seamless transitions you don’t feel", "Battery tops up as you drive"],
    diagramMode: "Hybrid" as FlowMode,
    caption: "Tip: Tap a thumbnail to switch the story.",
  },
];

/* ----------------------------------------------------------------------------
   Tabs (simple, no deps)
---------------------------------------------------------------------------- */
const Tabs: React.FC<{
  active: TabKey;
  onChange: (k: TabKey) => void;
  items: { key: TabKey; label: string }[];
}> = ({ active, onChange, items }) => (
  <div className="relative">
    <div className="flex gap-1 p-1 rounded-xl border bg-white/70 backdrop-blur">
      {items.map((it) => {
        const selected = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={cn(
              "flex-1 px-3 py-1.5 rounded-lg text-sm transition border",
              selected
                ? "bg-black text-white border-black"
                : "bg-transparent hover:bg-black/5 border-transparent"
            )}
            aria-pressed={selected}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  </div>
);

/* ----------------------------------------------------------------------------
   Image Gallery that controls content (idx → story)
---------------------------------------------------------------------------- */
const ImageGalleryControlled: React.FC<{
  items: typeof mediaStories;
  idx: number;
  setIdx: (n: number) => void;
}> = ({ items, idx, setIdx }) => {
  const prefersReduced = useReducedMotion();
  const canPrev = idx > 0;
  const canNext = idx < items.length - 1;

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" && canNext) setIdx(idx + 1);
    if (e.key === "ArrowLeft" && canPrev) setIdx(idx - 1);
  };

  return (
    <div
      className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 overflow-hidden"
      tabIndex={0}
      onKeyDown={onKey}
      aria-label="Media gallery. Use left and right arrow keys to navigate."
    >
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={items[idx].src}
            src={items[idx].src}
            alt={items[idx].alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.98 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            loading="lazy"
          />
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
        <button
          aria-label="Previous image"
          disabled={!canPrev}
          onClick={() => canPrev && setIdx(idx - 1)}
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
          onClick={() => canNext && setIdx(idx + 1)}
          className={cn(
            "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
            !canNext && "opacity-40 pointer-events-none"
          )}
        >
          ›
        </button>
      </div>

      {/* Caption + dots */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="text-xs text-white">
          <span className="inline-block rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
            {items[idx].caption}
          </span>
        </div>
        <div className="flex gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={cn("h-2 w-2 rounded-full", i === idx ? "bg-white" : "bg-white/50")}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-2 border-t bg-white/80">
        {items.map((im, i) => (
          <button
            key={im.src}
            onClick={() => setIdx(i)}
            className={cn(
              "relative h-14 w-20 rounded-md overflow-hidden ring-1 ring-black/5",
              i === idx && "outline outline-2"
            )}
            style={i === idx ? { outlineColor: BRAND_RED } : {}}
            aria-label={`Select image ${i + 1}`}
          >
            <img src={im.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------------
   YouTube (privacy, lazy)
---------------------------------------------------------------------------- */
const YoutubeInline: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  const [play, setPlay] = React.useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${play ? "&autoplay=1" : ""}`;
  const poster = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black ring-1 ring-black/5">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {!play && (
          <button onClick={() => setPlay(true)} aria-label="Play video" className="absolute inset-0 flex items-center justify-center group">
            <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-95 transition" style={{ backgroundImage: `url('${poster}')` }} />
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

/* ----------------------------------------------------------------------------
   Energy Flow Figure (NO background; with guidance)
---------------------------------------------------------------------------- */
const EnergyFlowFigure: React.FC<{ mode: FlowMode; setMode: (m: FlowMode) => void }> = ({ mode, setMode }) => {
  const prefersReduced = useReducedMotion();
  const arrows = prefersReduced ? {} : { opacity: [0.35, 1, 0.35] };

  const chip = (label: FlowMode) => {
    const active = mode === label;
    return (
      <button
        key={label}
        onClick={() => setMode(label)}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs border transition",
          active ? "bg-black text-white border-black" : "hover:bg-black/5"
        )}
        aria-pressed={active}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-3 lg:p-4 ring-1 ring-black/5">
      {/* Guidance bar */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Info className="h-4 w-4" />
        <span>Choose a mode. Watch how power moves through the car.</span>
      </div>

      <div className="flex gap-2 mb-3">{(["EV", "Hybrid", "Charge"] as FlowMode[]).map(chip)}</div>

      {/* Clean canvas, no grid */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
          {/* blocks */}
          <rect x="55" y="40" width="60" height="38" rx="6" fill="rgba(0,0,0,.06)" />
          <text x="85" y="62" textAnchor="middle" className="fill-black/80 text-[10px] font-semibold">ENGINE</text>

          <rect x="205" y="40" width="60" height="38" rx="6" fill="rgba(0,0,0,.06)" />
          <text x="235" y="62" textAnchor="middle" className="fill-black/80 text-[10px] font-semibold">BATTERY</text>

          <rect x="130" y="95" width="60" height="38" rx="6" fill="rgba(0,0,0,.04)" />
          <text x="160" y="117" textAnchor="middle" className="fill-black/80 text-[10px] font-semibold">MOTOR</text>

          {/* wheels */}
          <circle cx="90" cy="145" r="12" fill="rgba(0,0,0,.08)" />
          <circle cx="225" cy="145" r="12" fill="rgba(0,0,0,.08)" />

          {/* flows */}
          <AnimatePresence>
            {mode === "EV" && (
              <g>
                <motion.path d="M235,78 L160,114" stroke={BRAND_RED} strokeWidth="3" fill="none" animate={arrows} transition={{ duration: 1.4, repeat: Infinity }} />
                <motion.path d="M160,114 L90,145" stroke={BRAND_RED} strokeWidth="3" fill="none" animate={arrows} transition={{ duration: 1.4, repeat: Infinity, delay: .2 }} />
                <motion.path d="M160,114 L225,145" stroke={BRAND_RED} strokeWidth="3" fill="none" animate={arrows} transition={{ duration: 1.4, repeat: Infinity, delay: .4 }} />
              </g>
            )}
            {mode === "Hybrid" && (
              <g>
                <motion.path d="M85,78 L160,114" stroke={BRAND_RED} strokeWidth="3" fill="none" animate={arrows} transition={{ duration: 1.2, repeat: Infinity }} />
                <motion.path d="M235,78 L160,114" stroke={BRAND_RED} strokeWidth="3" fill="none" animate={arrows} transition={{ duration: 1.2, repeat: Infinity, delay: .2 }} />
                <motion.path d="M160,114 L225,145" stroke={BRAND_RED} strokeWidth="3" fill="none" animate={arrows} transition={{ duration: 1.2, repeat: Infinity, delay: .4 }} />
              </g>
            )}
            {mode === "Charge" && (
              <g>
                <motion.path d="M160,114 L235,78" stroke={BRAND_RED} strokeWidth="3" fill="none" animate={arrows} transition={{ duration: 1.2, repeat: Infinity }} />
              </g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Guided steps */}
      <div className="mt-3 grid gap-2 sm:grid-cols-3 text-[12px]">
        {mode === "EV" && (
          <>
            <div><span className="font-semibold">1. Start</span> — Motor moves the car silently.</div>
            <div><span className="font-semibold">2. City pace</span> — Great for traffic & parking.</div>
            <div><span className="font-semibold">3. Save fuel</span> — Engine rests; emissions drop.</div>
          </>
        )}
        {mode === "Hybrid" && (
          <>
            <div><span className="font-semibold">1. Blend</span> — Engine + motor share the load.</div>
            <div><span className="font-semibold">2. Smooth</span> — Transitions you barely feel.</div>
            <div><span className="font-semibold">3. Recover</span> — Battery charges while cruising.</div>
          </>
        )}
        {mode === "Charge" && (
          <>
            <div><span className="font-semibold">1. Brake</span> — Wheels turn the motor.</div>
            <div><span className="font-semibold">2. Generate</span> — Energy flows back to battery.</div>
            <div><span className="font-semibold">3. Re-use</span> — Next pull-away uses stored power.</div>
          </>
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------------
   Modal
---------------------------------------------------------------------------- */
const HybridTechModal: React.FC<HybridTechModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  videoIds = [],
}) => {
  useBodyScrollLock(isOpen);

  const prefersReduced = useReducedMotion();
  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  // image-driven content selection
  const [storyIdx, setStoryIdx] = React.useState(0);
  const story = mediaStories[storyIdx];

  // diagram mode follows the selected story (images guide the diagram)
  const [mode, setMode] = React.useState<FlowMode>(story.diagramMode);
  React.useEffect(() => {
    setMode(story.diagramMode);
  }, [storyIdx]);

  // accessible live region for dynamic content changes
  const liveRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (liveRef.current) {
      liveRef.current.innerText = `${story.headline}. ${story.sub}`;
    }
  }, [story.headline, story.sub]);

  // components & modes (kept compact)
  const hybridComponents = [
    {
      icon: Car,
      name: "2.5L 4-Cylinder Engine",
      description: "Optimized for smooth, efficient hybrid operation.",
      details: "Atkinson-cycle design, direct injection and variable valve timing deliver smart efficiency without giving up usable power.",
      specs: ["176 HP", "Atkinson Cycle", "Direct Injection", "VVT-i"],
    },
    {
      icon: Zap,
      name: "Electric Motor System",
      description: "Instant torque with energy recovery.",
      details: "Dual motors provide quiet starts and capture braking energy for later acceleration.",
      specs: ["118 HP combined", "Instant torque", "Regenerative braking"],
    },
    {
      icon: Battery,
      name: "Hybrid Battery Pack",
      description: "Compact, long-life lithium-ion.",
      details: "Optimized placement improves balance and preserves cabin space with minimal maintenance.",
      specs: ["Lithium-ion", "8-Year warranty", "Compact design"],
    },
    {
      icon: RotateCcw,
      name: "Power Control Unit",
      description: "Blends engine and motors seamlessly.",
      details: "Real-time logic orchestrates sources for efficiency, response and smoothness.",
      specs: ["Seamless switching", "Predictive logic", "Smart management"],
    },
  ];

  const drivingModes = [
    { icon: Leaf, title: "EV Mode", description: "Pure electric for short trips", features: ["Silent start", "Zero tailpipe emissions"] },
    { icon: TrendingUp, title: "Eco Mode", description: "Maximize range", features: ["Gentle throttle", "Eco coaching"] },
    { icon: Gauge, title: "Normal Mode", description: "Balanced everyday drive", features: ["Auto switching", "Smooth response"] },
    { icon: Zap, title: "Sport Mode", description: "Sharper response", features: ["Quicker acceleration"] },
  ];

  // tabs
  const tabItems = (videoIds.length
    ? [
        { key: "overview", label: "Overview" },
        { key: "diagrams", label: "Diagrams" },
        { key: "images", label: "Images" },
        { key: "videos", label: "Videos" },
      ]
    : [
        { key: "overview", label: "Overview" },
        { key: "diagrams", label: "Diagrams" },
        { key: "images", label: "Images" },
      ]) as { key: TabKey; label: string }[];

  const [tab, setTab] = React.useState<TabKey>("overview");

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        {/* Compact header on mobile */}
        <MobileOptimizedDialogHeader className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <MobileOptimizedDialogTitle className="text-lg font-semibold leading-tight sm:text-2xl sm:font-bold">
              Hybrid Synergy Drive®
            </MobileOptimizedDialogTitle>
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <MobileOptimizedDialogDescription className="hidden sm:block text-base mt-1">
            Hybrid made simple — see how images, diagrams, and videos all connect.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero: tabs + image-driven story */}
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 lg:p-6 border bg-white/70 backdrop-blur ring-1 ring-black/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <Battery className="h-7 w-7" style={{ color: BRAND_RED }} />
                <Badge variant="secondary" className="text-xs font-semibold" style={{ background: "#fff", border: "1px solid #eee" }}>
                  25+ Years of Innovation
                </Badge>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 mb-3">
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xl lg:text-2xl font-bold">{story.headline}</h3>
                  <p className="text-sm text-muted-foreground">{story.sub}</p>
                  <ul className="text-sm space-y-1">
                    {story.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: BRAND_RED }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* live region for a11y announcements when story changes */}
                  <div ref={liveRef} aria-live="polite" className="sr-only" />
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <Tabs active={tab} onChange={setTab} items={tabItems} />

                  <AnimatePresence mode="wait">
                    {tab === "overview" && (
                      <motion.div key="overview" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        {/* Image controls the story */}
                        <ImageGalleryControlled items={mediaStories} idx={storyIdx} setIdx={setStoryIdx} />
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                          <Info className="h-3.5 w-3.5" />
                          Content above updates when you change the image.
                        </div>
                      </motion.div>
                    )}

                    {tab === "diagrams" && (
                      <motion.div key="diagrams" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <EnergyFlowFigure mode={mode} setMode={setMode} />
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                          <Info className="h-3.5 w-3.5" />
                          Pick a mode to see how power flows. The current image suggests: <b>{story.diagramMode}</b>.
                        </div>
                      </motion.div>
                    )}

                    {tab === "images" && (
                      <motion.div key="images" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <ImageGalleryControlled items={mediaStories} idx={storyIdx} setIdx={setStoryIdx} />
                      </motion.div>
                    )}

                    {tab === "videos" && (videoIds?.length ?? 0) > 0 && (
                      <motion.div key="videos" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {videoIds!.map((id) => (
                            <YoutubeInline key={id} videoId={id} title="Hybrid video" />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Components */}
            <div>
              <h3 className="text-xl font-bold mb-3">Hybrid System Components</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {hybridComponents.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: i * 0.04 }}
                    className="p-4 rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md text-white" style={{ background: BRAND_RED }}>
                        <c.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold leading-tight">{c.name}</h4>
                          <Badge className="h-5 px-2 text-[10px]" variant="secondary">Hybrid Core</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.description}</p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {c.specs.map((s) => (
                            <span key={s} className="px-2 py-0.5 text-[11px] rounded-full bg-white border">
                              {s}
                            </span>
                          ))}
                        </div>

                        <CollapsibleContent title="Technical details" className="border-0 mt-2">
                          <p className="text-sm text-muted-foreground">{c.details}</p>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Modes */}
            <div>
              <h3 className="text-xl font-bold mb-3">Intelligent Driving Modes</h3>

              {/* mobile swipe */}
              <div className="sm:hidden -mx-3 px-3">
                <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                  {drivingModes.map((m, i) => (
                    <motion.div
                      key={m.title}
                      initial={enter}
                      animate={entered}
                      transition={{ delay: i * 0.05 }}
                      className="min-w-[78%] snap-center p-4 rounded-xl border bg-white"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <m.icon className="h-5 w-5 text-black/70" />
                        <h4 className="font-semibold">{m.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{m.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.features.map((f) => (
                          <span key={f} className="px-2 py-0.5 text-[11px] rounded-full bg-black/[.04] border">{f}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* desktop grid */}
              <div className="hidden sm:grid gap-3 sm:grid-cols-2">
                {drivingModes.map((m, i) => (
                  <motion.div
                    key={m.title}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border bg-white"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <m.icon className="h-5 w-5 text-black/70" />
                      <h4 className="font-semibold">{m.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{m.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.features.map((f) => (
                        <span key={f} className="px-2 py-0.5 text-[11px] rounded-full bg-black/[.04] border">{f}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </MobileOptimizedDialogBody>

        {/* CTA */}
        <MobileOptimizedDialogFooter className="px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex w-full sm:w-auto sm:ml-auto gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onBookTestDrive} style={{ background: BRAND_RED }}>
              Book Test Drive
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default HybridTechModal;
