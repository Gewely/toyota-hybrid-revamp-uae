"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { VehicleModel } from "@/types/vehicle";
import { PremiumButton } from "@/components/ui/premium-button";
import YouTubeEmbed from "@/components/ui/youtube-embed";
import { Info, Share2 } from "lucide-react";

/* ============================================================
   MinimalistVideoHero (EN)
   - Fullscreen background video with top & bottom scrims
   - Clear, English-only labels
   - Safe-area aware for mobile toolbars / notches
   - Accessible roles, aria labels, keyboard-friendly buttons
   - Reduced-motion aware (disables autoplay if user prefers)
============================================================ */

export type MinimalistVideoHeroProps = {
  vehicle?: VehicleModel & {
    videoId?: string; // YouTube ID (e.g., "E-TmuQuQwVI")
    priceFrom?: string | number;
    modelYear?: number;
  };
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onInfoClick?: () => void;
  onShareClick?: () => void;
};

const DEFAULT_VIDEO_ID = "E-TmuQuQwVI";
const DEFAULT_TITLE = "TOYOTA";
const DEFAULT_PRICE = "AED 18,090";

function formatPrice(price?: string | number) {
  if (price == null) return DEFAULT_PRICE;
  if (typeof price === "number") {
    try {
      return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      return `AED ${Math.round(price).toLocaleString("en-US")}`;
    }
  }
  return price; // assume already formatted
}

const MinimalistVideoHero: React.FC<MinimalistVideoHeroProps> = ({
  vehicle,
  onBookTestDrive,
  onCarBuilder,
  onInfoClick,
  onShareClick,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const title = (vehicle?.name ?? DEFAULT_TITLE).toUpperCase();
  const price = formatPrice(vehicle?.priceFrom);

  // Example English specs — replace with real props when available
  const specs: Array<{ label: string; value: string }> = [
    { label: "Fuel consumption (combined)", value: "4.8–5.0 L/100 km" },
    { label: "CO₂ emissions (combined)", value: "108–124 g/km" },
    { label: "CO₂ class", value: "C" },
  ];

  const videoId = vehicle?.videoId ?? DEFAULT_VIDEO_ID;

  return (
    <section
      role="region"
      aria-labelledby="video-hero-heading"
      className="relative w-full overflow-hidden bg-background
                 h-screen min-h-[100svh] md:min-h-screen"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <YouTubeEmbed
          videoId={videoId}
          autoplay={!shouldReduceMotion}
          muted
          controls={false}
          className="h-full w-full"
        />
        {/* Readability overlays */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/30" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-12">
        {/* Top: Title + Price */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-1"
        >
          <h1 id="video-hero-heading" className="text-4xl font-light tracking-wide text-white lg:text-5xl xl:text-6xl">
            {title}
          </h1>

          {vehicle?.modelYear && <div className="text-sm text-white/80">Model Year {vehicle.modelYear}</div>}

          <div className="text-sm text-white/90">
            <span className="font-light">Starting from (incl. VAT)</span>
          </div>
          <div className="text-2xl font-light text-white lg:text-3xl" aria-live="polite">
            {price}
          </div>
        </motion.div>

        {/* Bottom: CTAs + Specs */}
        <div className="space-y-6 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <PremiumButton
              onClick={onCarBuilder}
              aria-label="Open Car Builder"
              className="h-12 bg-white px-8 text-base font-medium text-foreground hover:bg-white/90"
            >
              Build & Price
            </PremiumButton>

            <PremiumButton
              onClick={onBookTestDrive}
              aria-label="Book a Test Drive"
              variant="outline"
              className="h-12 border-2 border-white bg-transparent px-8 text-base font-medium text-white hover:bg-white/10"
            >
              Book a Test Drive
            </PremiumButton>
          </motion.div>

          {/* Specs Row */}
          {specs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/90 lg:text-sm"
            >
              {specs.map((s, i) => (
                <div key={`${s.label}-${i}`} className="flex items-center gap-2">
                  <span className="font-light">{s.label}:</span>
                  <span className="font-medium">{s.value}</span>
                  {i < specs.length - 1 && (
                    <span aria-hidden="true" className="text-white/50">
                      |
                    </span>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={onInfoClick}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/50 text-xs text-white/90 hover:bg-white/10"
                aria-label="Open more information"
                title="More information"
              >
                i
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Top-right utilities */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="absolute right-6 top-6 z-20 flex flex-col gap-3 lg:right-12 lg:top-12"
      >
        <button
          type="button"
          onClick={onInfoClick}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="More information"
          title="More information"
        >
          <Info className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onShareClick}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="Share"
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </motion.div>
    </section>
  );
};

export default MinimalistVideoHero;
