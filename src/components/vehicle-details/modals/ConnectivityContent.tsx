import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Wifi, Smartphone, Navigation, Radio, X, Play, ChevronRight, ShieldCheck, Info, HelpCircle, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type MediaTab = "image" | "video";

type Hotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
  short?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  details?: string[];
};

interface ConnectivityContentProps {
  onClose: () => void;
  onBookTestDrive?: () => void;
  vehicle?: any;
}

const DAM_IMAGE =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true";
const YT_ID = "cCOszP-VQcc";

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

const ConnectivityContent: React.FC<ConnectivityContentProps> = ({ onClose, onBookTestDrive, vehicle }) => {
  const [mediaTab, setMediaTab] = React.useState<MediaTab>("image");
  const prefersReducedMotion = useReducedMotion();

  const enter = prefersReducedMotion ? {} : { opacity: 0, y: 16 };
  const entered = prefersReducedMotion ? {} : { opacity: 1, y: 0 };

  return (
    <div className="p-4 sm:p-6 space-y-6">
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

        <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-black/5 bg-black">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            {mediaTab === "image" ? (
              <img
                src={DAM_IMAGE}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${YT_ID}?rel=0&modestbranding=1&playsinline=1`}
                title="Connectivity Video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            <span>Privacy controls available in Settings.</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" aria-hidden />
            <span>Features vary by grade/year.</span>
          </div>
        </div>
      </motion.div>

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

      <div className="rounded-xl border">
        <div className="p-4 sm:p-5">
          <h3 className="text-lg font-semibold mb-3">Quick answers</h3>
          <div className="space-y-2">
            {[
              { q: "Need a data plan?", a: "Only for the Wi-Fi hotspot. Most features use your phone's data." },
              { q: "Is my data private?", a: "Yes—sharing is user-controlled. Opt out anytime." },
              { q: "Available here?", a: "Specs reflect UAE. Availability may vary by grade/model year." },
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
  );
};

export default ConnectivityContent;
