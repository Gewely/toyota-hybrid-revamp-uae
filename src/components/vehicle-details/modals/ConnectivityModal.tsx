import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Wifi, Smartphone, Navigation, Radio, X, Play, ChevronRight, ShieldCheck, Info, HelpCircle, CheckCircle2
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
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type MediaTab = "image" | "video";

type Hotspot = {
  id: string;
  x: number; // 0..100 (% from left)
  y: number; // 0..100 (% from top)
  label: string;
  short?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  details?: string[]; // compact lines
};

interface ConnectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  modelName?: string;     // e.g., "Camry Hybrid"
  regionLabel?: string;   // e.g., "UAE"
}

/* -------------------------------------------------------------------------- */
/*                            Hotspot Demo (inline)                            */
/* -------------------------------------------------------------------------- */

const HotspotDemo: React.FC<{
  mediaTab: MediaTab;
  imageSrc: string;
  youtubeId?: string;
  hotspots: Hotspot[];
}> = ({ mediaTab, imageSrc, youtubeId, hotspots }) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const active = hotspots.find((h) => h.id === activeId);

  // Close any open hotspot when switching to "video"
  React.useEffect(() => {
    if (mediaTab !== "image" && activeId) setActiveId(null);
  }, [mediaTab, activeId]);

  const enter = prefersReduced ? {} : { opacity: 0, scale: 0.96 };
  const entered = prefersReduced ? {} : { opacity: 1, scale: 1 };

  const ytSrc = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`
    : "";

  // Only apply pointer-events suppression if image + active card
  const mediaPointer =
    mediaTab === "image" && active ? "pointer-events-none" : "pointer-events-auto";

  return (
    <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-black/5 bg-black">
      {/* 16:9 aspect container */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {/* Media */}
        {mediaTab === "image" ? (
          <img
            src={imageSrc}
            alt=""
            className={cn("absolute inset-0 h-full w-full object-cover", mediaPointer)}
            loading="lazy"
          />
        ) : (
          <iframe
            className={cn("absolute inset-0 w-full h-full", mediaPointer)}
            src={ytSrc}
            title="Connectivity Video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}

        {/* HOTSPOTS — render ONLY on image tab */}
        {mediaTab === "image" &&
          hotspots.map((h) => (
            <button
              key={h.id}
              aria-label={h.label}
              onClick={() => setActiveId((prev) => (prev === h.id ? null : h.id))}
              className={cn(
                "absolute z-20 -translate-x-1/2 -translate-y-1/2",
                "h-9 w-9 rounded-full bg-white/90 backdrop-blur text-foreground",
                "shadow hover:shadow-md border border-black/5",
                "flex items-center justify-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              {h.icon ? <h.icon className="h-4 w-4" /> : <span className="text-sm font-semibold">+</span>}
            </button>
          ))}

        {/* Desktop popover (md+) — ONLY on image tab */}
        <AnimatePresence>
          {mediaTab === "image" && active && (
            <motion.div
              initial={enter}
              animate={entered}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block absolute z-30"
              style={{
                left: `min(calc(${active.x}% + 20px), calc(100% - 280px))`,
                top: `min(calc(${active.y}% + 20px), calc(100% - 180px))`,
                width: 280,
              }}
            >
              <div className="rounded-xl border bg-background shadow-lg">
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-2">
                    {active.icon && <active.icon className="h-4 w-4 text-blue-600" />}
                    <span className="text-sm font-medium">{active.label}</span>
                  </div>
                  <button
                    className="p-1 rounded hover:bg-muted"
                    onClick={() => setActiveId(null)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  {active.short && <p className="text-sm text-muted-foreground">{active.short}</p>}
                  {active.details && active.details.length > 0 && (
                    <ul className="text-sm space-y-1">
                      {active.details.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile sheet (sm and below) — ONLY on image tab */}
        <AnimatePresence>
          {mediaTab === "image" && active && (
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="md:hidden absolute z-30 bottom-0 left-0 right-0"
            >
              <div className="rounded-t-2xl border bg-background shadow-2xl">
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-2">
                    {active.icon && <active.icon className="h-4 w-4 text-blue-600" />}
                    <span className="text-sm font-medium">{active.label}</span>
                  </div>
                  <button
                    className="p-1 rounded hover:bg-muted"
                    onClick={() => setActiveId(null)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  {active.short && <p className="text-sm text-muted-foreground">{active.short}</p>}
                  {active.details && active.details.length > 0 && (
                    <ul className="text-sm space-y-1">
                      {active.details.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                          Main Connectivity Modal                            */
/* -------------------------------------------------------------------------- */

const DAM_IMAGE =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true";

// YouTube video from your request
const YT_ID = "cCOszP-VQcc";

const ConnectivityModal: React.FC<ConnectivityModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  modelName = "Toyota Camry",
  regionLabel = "UAE",
}) => {
  useBodyScrollLock(isOpen);

  const [mediaTab, setMediaTab] = React.useState<MediaTab>("image");
  const prefersReducedMotion = useReducedMotion();

  const enter = prefersReducedMotion ? {} : { opacity: 0, y: 16 };
  const entered = prefersReducedMotion ? {} : { opacity: 1, y: 0 };

  const hotspots: Hotspot[] = [
    {
      id: "carplay",
      x: 52,
      y: 62,
      label: "Apple CarPlay / Android Auto",
      short: "Your apps on the car screen.",
      icon: Smartphone,
      details: ["Wireless pairing", "Maps & messages", "Voice control"],
    },
    {
      id: "wifi",
      x: 74,
      y: 30,
      label: "Wi-Fi Hotspot",
      short: "4G LTE for up to 5 devices.",
      icon: Wifi,
      details: ["Secure cabin Wi-Fi", "Shareable QR", "Data plan required"],
    },
    {
      id: "nav",
      x: 60,
      y: 50,
      label: "Connected Navigation",
      short: "Live traffic & smarter routes.",
      icon: Navigation,
      details: ["Dynamic rerouting", "Weather layer", "Fresh POIs"],
    },
    {
      id: "sxm",
      x: 46,
      y: 70,
      label: "SiriusXM & Services",
      short: "Premium audio + vehicle status.",
      icon: Radio,
      details: ["360+ channels", "Health alerts", "Travel Link"],
    },
  ];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      {/* Wider modal for better media */}
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        <MobileOptimizedDialogHeader>
          <MobileOptimizedDialogTitle className="text-2xl lg:text-3xl font-bold">
            Connected Services · {modelName}
          </MobileOptimizedDialogTitle>
          <MobileOptimizedDialogDescription className="text-base line-clamp-2">
            Explore key features via hotspots—switch between image and video. Then book a test drive.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Multimedia Switcher */}
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 lg:p-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent ring-1 ring-blue-200/40"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs font-semibold bg-blue-100 text-blue-700">
                  Multimedia
                </Badge>
                <div className="ml-auto flex gap-2">
                  {(["image", "video"] as MediaTab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setMediaTab(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition",
                        mediaTab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                      )}
                      aria-pressed={mediaTab === t}
                    >
                      {t === "image" ? "Image (Hotspots)" : (
                        <span className="inline-flex items-center gap-1">
                          Video <Play className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotspot demo (now hides hotspots on video) */}
              <HotspotDemo
                mediaTab={mediaTab}
                imageSrc={DAM_IMAGE}
                youtubeId={YT_ID}
                hotspots={hotspots}
              />

              {/* Micro trust row */}
              <div className="mt-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  <span>Privacy controls available in Settings.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" aria-hidden />
                  <span>Features vary by grade/year in {regionLabel}.</span>
                </div>
              </div>
            </motion.div>

            {/* At a glance */}
            <div className="rounded-xl border">
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold mb-3">At a glance</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {[
                    "Remote start & comfy cabin",
                    "Smarter routes, fewer delays",
                    "Hands-free calls & texts",
                    "Wi-Fi for work & play",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" aria-hidden />
                      <span className="text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick answers */}
            <div className="rounded-xl border">
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold mb-3">Quick answers</h3>
                <div className="space-y-2">
                  {[
                    { q: "Need a data plan?", a: "Only for the Wi-Fi hotspot. Most features use your phone’s data." },
                    { q: "Is my data private?", a: "Yes—sharing is user-controlled. Opt out anytime." },
                    { q: "Available here?", a: `Specs reflect ${regionLabel}. Availability may vary by grade/model year.` },
                  ].map((item) => (
                    <details key={item.q} className="group rounded-lg border p-3">
                      <summary className="flex cursor-pointer list-none items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{item.q}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition group-open:rotate-90" />
                      </summary>
                      <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MobileOptimizedDialogBody>

        {/* Single CTA only */}
        <MobileOptimizedDialogFooter>
          <div className="flex w-full sm:w-auto sm:ml-auto gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onBookTestDrive}>Book Test Drive</Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default ConnectivityModal;
