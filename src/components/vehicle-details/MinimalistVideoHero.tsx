import React from "react";
import { motion } from "framer-motion";
import type { VehicleModel } from "@/types/vehicle";
import { PremiumButton } from "@/components/ui/premium-button";
import YouTubeEmbed from "@/components/ui/youtube-embed";

export type MinimalistVideoHeroProps = {
  vehicle?: VehicleModel & {
    videoUrl?: string;
    priceFrom?: string;
    year?: number;
  };
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
};

const MinimalistVideoHero: React.FC<MinimalistVideoHeroProps> = ({
  vehicle,
  onBookTestDrive,
  onCarBuilder,
}) => {
  const title = (vehicle?.name ?? "TOYOTA").toUpperCase();
  const priceLabel = "ab inkl. MwSt.";
  const price = vehicle?.priceFrom || "18.090,00 €";

  // Specs for bottom display
  const specs = [
    { label: "Energieverbrauch kombiniert", value: "4,8-5,0 l/100 km" },
    { label: "CO2-Emissionen kombiniert", value: "108-124 g/km" },
    { label: "CO2-Klasse", value: "C" },
  ];

  const videoId = vehicle?.videoUrl || "E-TmuQuQwVI";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 z-0">
        <YouTubeEmbed
          videoId={videoId}
          autoplay
          muted
          controls={false}
          className="h-full w-full"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-12">
        {/* Top Left: Title & Price */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-1"
        >
          <h1 className="text-4xl font-light tracking-wide text-white lg:text-5xl xl:text-6xl">
            {title}
          </h1>
          <div className="text-sm text-white/90">
            <span className="font-light">{priceLabel}</span>
          </div>
          <div className="text-2xl font-light text-white lg:text-3xl">
            {price}
          </div>
        </motion.div>

        {/* Bottom Content */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <PremiumButton
              onClick={onCarBuilder}
              className="h-12 bg-white px-8 text-base font-medium text-foreground hover:bg-white/90"
            >
              Jetzt konfigurieren
            </PremiumButton>
            <PremiumButton
              onClick={onBookTestDrive}
              variant="outline"
              className="h-12 border-2 border-white bg-transparent px-8 text-base font-medium text-white hover:bg-white/10"
            >
              Angebote entdecken
            </PremiumButton>
          </motion.div>

          {/* Bottom Specs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/90 lg:text-sm"
          >
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-light">{spec.label}:</span>
                <span className="font-medium">{spec.value}</span>
                {index < specs.length - 1 && (
                  <span className="text-white/50">|</span>
                )}
              </div>
            ))}
            <button
              className="flex h-5 w-5 items-center justify-center rounded-full border border-white/50 text-xs hover:bg-white/10"
              aria-label="More information"
            >
              ⓘ
            </button>
          </motion.div>
        </div>
      </div>

      {/* Top Right Icons (optional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute right-6 top-6 z-20 flex flex-col gap-3 lg:right-12 lg:top-12"
      >
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          aria-label="Info"
        >
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" d="M12 16v-4M12 8h.01" />
          </svg>
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          aria-label="Share"
        >
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </motion.div>
    </section>
  );
};

export default MinimalistVideoHero;
