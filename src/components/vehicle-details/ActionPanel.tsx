import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Settings, Share2, Calculator, MapPin, FileText } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { openTestDrivePopup } from "@/utils/testDriveUtils";
import { useModal } from "@/contexts/ModalProvider";

/** ─────────────────────────────────────────
 *  GR tokens + matte carbon surface
 *  ───────────────────────────────────────── */
const GR_RED = "#EB0A1E";
const GR_SURFACE = "#0B0B0C";
const GR_EDGE = "#17191B";
const CARBON_URL =
  "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/f33badf4-a2df-4400-81f4-80b38a5461f7/items/6949214d-eddd-4a97-8e93-8c4ed9563ffc/renditions/3d30ccb3-dd72-4e9d-b02a-aa9759450957?binary=true";

const carbonMatte: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.62)), url(" + CARBON_URL + ")",
  backgroundBlendMode: "multiply, normal",
  backgroundSize: "180px 180px, 180px 180px",
  backgroundRepeat: "no-repeat, repeat",
  backgroundPosition: "center, center",
  backgroundColor: GR_SURFACE,
};

/** Shared localStorage key */
const GR_STORAGE_KEY = "toyota.grMode";
function emitGRModeChange(isGR: boolean) {
  const ev = new CustomEvent("toyota:grmode", { detail: { isGR } });
  window.dispatchEvent(ev);
}
function useGRMode() {
  const initial = () => {
    try {
      const q = new URLSearchParams(window.location.search).get("gr");
      if (q === "1" || q === "true") return true;
      const s = localStorage.getItem(GR_STORAGE_KEY);
      return s === "1" || s === "true";
    } catch { return false; }
  };
  const [isGR, setIsGR] = useState<boolean>(() => initial());
  useEffect(() => {
    try { localStorage.setItem(GR_STORAGE_KEY, isGR ? "1" : "0"); emitGRModeChange(isGR); } catch {}
  }, [isGR]);
  const toggleGR = () => setIsGR(v => !v);
  return { isGR, toggleGR };
}

interface ActionPanelProps {
  vehicle: VehicleModel;
  onDownloadBrochure?: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  onDownloadBrochure,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { isGR, toggleGR } = useGRMode();
  const { open } = useModal();

  const fmt = useMemo(
    () => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"),
    []
  );

  const handleTestDrive = () => openTestDrivePopup(vehicle);

  const handleShare = async () => {
    const sharePayload = {
      title: `${vehicle.name} - Toyota UAE`,
      text: `Check out this ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
      url: window.location.href,
    };
    try {
      if ((navigator as any).canShare && (navigator as any).canShare(sharePayload)) {
        await (navigator as any).share(sharePayload); return;
      }
      if ((navigator as any).share) { await (navigator as any).share(sharePayload); return; }
      await navigator.clipboard.writeText(sharePayload.url);
      toast({ title: "Link copied", description: "URL copied to clipboard." });
    } catch {
      try {
        const ok = window.confirm("Sharing not available. Copy link to clipboard?");
        if (ok) {
          await navigator.clipboard.writeText(sharePayload.url);
          toast({ title: "Link copied", description: "URL copied to clipboard." });
        }
      } catch {}
    }
  };

  const handleDownloadBrochure =
    onDownloadBrochure ??
    (() => {
      const url = (vehicle as any)?.brochureUrl || (vehicle as any)?.assets?.brochureUrl || "";
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      else {
        toast({
          title: "Brochure unavailable",
          description: "This model doesn't have a brochure link yet.",
          variant: "destructive",
        });
      }
    });

  if (isMobile) return null;

  /** Sizing: smaller panel + smaller buttons, icons unchanged (16/18px) */
  const panelStyle: React.CSSProperties = {
    // @ts-ignore custom properties
    "--panel-h": "clamp(46px, 4.8vw, 56px)",        // was 50–60
    "--panel-h-md": "clamp(52px, 4.4vw, 64px)",      // was 58–70
    "--btn-h": "clamp(30px, 2.3vw, 36px)",           // button height down
    "--btn-h-md": "clamp(34px, 2.1vw, 40px)",
    "--btn-px": "clamp(8px, 1.2vw, 12px)",           // tighter padding
    "--btn-px-md": "clamp(10px, 1.1vw, 14px)",
    "--btn-minw-primary": "clamp(100px, 10vw, 126px)",
    "--btn-minw-secondary": "clamp(94px, 9.5vw, 120px)",
    "--btn-minw-brochure": "clamp(100px, 10vw, 126px)",
    "--btn-icon": "clamp(30px, 2.4vw, 36px)",

    // fixed icon sizes
    "--icon": "16px",
    "--icon-md": "18px",

    ...(isGR ? { ...carbonMatte, borderColor: GR_EDGE, boxShadow: "0 -10px 24px rgba(0,0,0,.38)" } : {}),
  } as React.CSSProperties;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={panelStyle}
      className={[
        "fixed left-0 right-0 bottom-0 z-40",
        isGR
          ? "border-t h-[var(--panel-h)] md:h-[var(--panel-h-md)]"
          : "bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg border-t border-gray-200/60 shadow-2xl h-[var(--panel-h)] md:h-[var(--panel-h-md)]",
        "overflow-hidden",
      ].join(" ")}
      aria-label="Vehicle action panel"
    >
      <div className="w-full max-w-[2560px] mx-auto h-full px-2 sm:px-3 lg:px-6 xl:px-8 2xl:px-12">
        <div className="h-full flex items-center gap-1.5 md:gap-2">
          {/* Price */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 leading-none">
              <span
                className={[
                  "font-black truncate",
                  "text-[clamp(13px,1.25vw,15px)] md:text-[clamp(14px,1.1vw,17px)]",
                  isGR ? "text-red-300" : "text-primary",
                ].join(" ")}
              >
                AED {fmt.format(vehicle.price)}
              </span>
              <span
                className={[
                  "line-through",
                  "text-[clamp(9px,0.85vw,11px)] md:text-[clamp(10px,0.8vw,12px)]",
                  isGR ? "text-neutral-400/80" : "text-muted-foreground",
                ].join(" ")}
              >
                AED {fmt.format(Math.round(vehicle.price * 1.15))}
              </span>
            </div>
            <p
              className={[
                "hidden md:block leading-none mt-1",
                "text-[clamp(10px,0.8vw,12px)]",
                isGR ? "text-neutral-400" : "text-muted-foreground",
              ].join(" ")}
            >
              Starting price • Finance from AED 899/mo
            </p>
          </div>

          {/* Actions */}
          <div className="flex-1 flex items-center justify-end flex-wrap gap-1.5 md:gap-2">
            {/* Primary */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {/* Neutral primary button - reserve red for critical actions only */}
              <Button
                onClick={handleTestDrive}
                className={[
                  "rounded-xl transition-colors duration-200",
                  "h-[var(--btn-h)] md:h-[var(--btn-h-md)]",
                  "px-[var(--btn-px)] md:px-[var(--btn-px-md)]",
                  "text-[clamp(11px,0.95vw,13px)] font-semibold",
                  "min-w-[var(--btn-minw-primary)]",
                  "border-2",
                  isGR
                    ? "bg-[#1D1F22] text-white hover:bg-[#202328] border-[#1F2226] focus:ring-2 focus:ring-red-500"
                    : "bg-gray-900 text-white hover:bg-gray-800 border-gray-900 focus:ring-2 focus:ring-gray-500",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
              >
                <Car
                  className="mr-1"
                  style={{ width: "var(--icon)", height: "var(--icon)" }}
                />
                <span className="md:hidden">Test Drive</span>
                <span className="hidden md:inline">Book Test Drive</span>
              </Button>

              {/* Use red ONLY for high-value action: Car Builder */}
              <Button
                onClick={onCarBuilder}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "rounded-xl",
                  "h-[var(--btn-h)] md:h-[var(--btn-h-md)]",
                  "px-[var(--btn-px)] md:px-[var(--btn-px-md)]",
                  "text-[clamp(11px,0.95vw,13px)] font-semibold",
                  "min-w-[var(--btn-minw-secondary)]",
                  isGR
                    ? "text-neutral-200 hover:bg-[#141618] border border-[#1F2124] focus:ring-2 focus:ring-red-500"
                    : "bg-white/85 backdrop-blur-sm border-2 border-[#EB0A1E] text-[#EB0A1E] hover:bg-[#EB0A1E] hover:text-white focus:ring-2 focus:ring-red-500",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
              >
                <Settings style={{ width: "var(--icon)", height: "var(--icon)" }} className="mr-1" />
                Build & Price
              </Button>
            </div>

            {/* Secondary / icon group */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                onClick={onFinanceCalculator}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "rounded-xl flex items-center justify-center font-semibold",
                  "h-[var(--btn-h)] md:h-[var(--btn-h-md)]",
                  "px-[calc(var(--btn-px)-2px)] md:px-[var(--btn-px-md)]",
                  "text-[clamp(11px,0.95vw,13px)]",
                  "min-w-[var(--btn-minw-secondary)]",
                  isGR
                    ? "text-red-300 border-2 border-[#C4252A] hover:bg-[#141618] focus:ring-2 focus:ring-red-500"
                    : "bg-white/85 backdrop-blur-sm border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-500",
                ].join(" ")}
                aria-label="Finance calculator"
                title="Finance calculator"
              >
                <Calculator style={{ width: "var(--icon)", height: "var(--icon)" }} className="mr-1.5" />
                Finance
              </Button>

              {/* Neutral brochure button */}
              <Button
                onClick={handleDownloadBrochure}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "rounded-xl flex items-center justify-center font-semibold",
                  "h-[var(--btn-h)] md:h-[var(--btn-h-md)]",
                  "px-[var(--btn-px)] md:px-[var(--btn-px-md)]",
                  "text-[clamp(11px,0.95vw,13px)]",
                  "min-w-[var(--btn-minw-brochure)]",
                  isGR
                    ? "text-neutral-100 bg-[#1D1F22] border border-[#1F2124] hover:bg-[#202328]"
                    : "bg-gray-700 text-white hover:bg-gray-600 border border-gray-700",
                ].join(" ")}
                aria-label="Download brochure (PDF)"
                title="Download brochure (PDF)"
              >
                <FileText style={{ width: "var(--icon)", height: "var(--icon)" }} className="mr-1.5" />
                Brochure
              </Button>

              {/* Neutral share button */}
              <Button
                onClick={handleShare}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "p-0 rounded-xl",
                  "h-[var(--btn-icon)] w-[var(--btn-icon)] md:h-[calc(var(--btn-icon)+2px)] md:w-[calc(var(--btn-icon)+2px)]",
                  isGR
                    ? "text-neutral-200 hover:bg-[#141618] border border-[#1F2124]"
                    : "bg-white/85 backdrop-blur-sm border border-gray-300 text-gray-600 hover:bg-gray-100",
                ].join(" ")}
                aria-label="Share"
                title="Share"
              >
                <Share2 style={{ width: "var(--icon)", height: "var(--icon)" }} />
              </Button>

              {/* GR toggle chip (desktop only) */}
              <button
                type="button"
                onClick={toggleGR}
                role="switch"
                aria-checked={isGR}
                title="Toggle GR Performance mode"
                className={[
                  "hidden md:inline-flex items-center rounded-full",
                  "h-[calc(var(--btn-h)-2px)] md:h-[calc(var(--btn-h-md)-2px)]",
                  "px-[calc(var(--btn-px)-4px)] md:px-[calc(var(--btn-px-md)-4px)]",
                  "text-[clamp(10px,0.85vw,12px)] font-semibold",
                  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                  isGR ? "border border-[#17191B] text-red-300" : "bg-gray-200/70 text-gray-900",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
              >
                GR
              </button>
            </div>
          </div>
        </div>

        {/* Quick links row (anchors to main sections) */}
        <div
          className={[
            "hidden xl:flex absolute left-1/2 -translate-x-1/2 bottom-1 items-center gap-4",
            "text-[clamp(9px,0.78vw,11px)]",
            isGR ? "text-neutral-300" : "text-muted-foreground",
          ].join(" ")}
        >
          {[
            { id: "hero", label: "Overview" },
            { id: "seamless-showroom", label: "Showroom" },
            { id: "media-showcase", label: "Media" },
            { id: "virtual-showroom", label: "Virtual" },
            { id: "configuration", label: "Grades" },
            { id: "related", label: "Related" },
            { id: "faq", label: "FAQ" },
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="pointer-events-auto hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ActionPanel;
