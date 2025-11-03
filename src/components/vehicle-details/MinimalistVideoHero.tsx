"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { VehicleModel } from "@/types/vehicle";
import { PremiumButton } from "@/components/ui/premium-button";
import { Info, Share2, Images as ImagesIcon, Play, Pause, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

/* ============================================================
   MinimalistVideoHero — Mobile-Compact
   - Smaller text & controls on mobile; scale up at md:
   - YouTube "cover" background + true play/pause (JS API)
   - Hybrid media (video/images), thumb strip + lightbox
   - Variant toggle, WLTP bottom sheet, sticky mobile CTA
============================================================ */

/* ---------------------- Utilities ---------------------- */

function formatPrice(price?: string | number, fallback = "AED 18,090") {
  if (price == null) return fallback;
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
  return price;
}

/* -------------------- CoverYouTube --------------------- */
function CoverYouTube({ videoId, playing, className = "" }: { videoId: string; playing: boolean; className?: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const sendYT = (cmd: "playVideo" | "pauseVideo") => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: cmd, args: [] }), "*");
  };

  useEffect(() => {
    const t = setTimeout(() => {
      playing ? sendYT("playVideo") : sendYT("pauseVideo");
    }, 50);
    return () => clearTimeout(t);
  }, [playing]);

  const src = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams({
      autoplay: "1", // Always autoplay for background video
      mute: "1",
      controls: "0",
      rel: "0",
      showinfo: "0",
      modestbranding: "1",
      enablejsapi: "1",
      playsinline: "1", // Critical for iOS
      iv_load_policy: "3",
      loop: "1",
      playlist: videoId,
      origin,
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <iframe
        ref={iframeRef}
        title="Background video"
        src={src}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen={false}
        frameBorder={0}
        loading="eager"
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[100vw] h-[56.25vw]
          min-w-[177.78vh] min-h-[100vh]
          pointer-events-none
        "
        style={{
          border: 'none',
          display: 'block'
        }}
      />
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
  );
}

/* ------------------ Lightbox & Strip ------------------ */

function MediaStrip({
  images,
  activeIndex,
  onSelect,
}: {
  images: { src: string; alt: string }[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  if (!images?.length) return null;
  return (
    <div className="flex max-w-full gap-2 overflow-x-auto rounded-xl bg-black/20 p-2 backdrop-blur-sm">
      {images.map((img, i) => (
        <button
          key={img.src + i}
          onClick={() => onSelect(i)}
          aria-label={`Open image ${i + 1}`}
          className={`relative h-14 w-20 md:h-16 md:w-24 flex-none overflow-hidden rounded-md ring-offset-2 focus:outline-none focus:ring-2 focus:ring-white/60 ${
            i === activeIndex ? "ring-2 ring-white/70" : "ring-0"
          }`}
        >
          <motion.img
            src={img.src}
            alt={img.alt}
            className="h-full w-full object-cover"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </button>
      ))}
    </div>
  );
}

function Lightbox({
  isOpen,
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  isOpen: boolean;
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute right-3 top-3 md:right-4 md:top-4 z-[1001] rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <div className="flex h-full w-full items-center justify-center p-3 md:p-4">
            <motion.img
              key={images[index]?.src}
              src={images[index]?.src}
              alt={images[index]?.alt || "Gallery image"}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              initial={{ opacity: 0.2, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              draggable={false}
            />
          </div>

          <button onClick={onPrev} aria-label="Previous image" className="absolute left-0 top-0 h-full w-1/3" />
          <button onClick={onNext} aria-label="Next image" className="absolute right-0 top-0 h-full w-1/3" />

          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/80">
            <ChevronLeft className="h-7 w-7 md:h-8 md:w-8" />
          </div>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/80">
            <ChevronRight className="h-7 w-7 md:h-8 md:w-8" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------- Bottom Sheet -------------------- */

function BottomSheet({
  open,
  onClose,
  title = "Efficiency & Legal",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[900] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-[901] rounded-t-2xl bg-white p-5 md:p-6 shadow-2xl sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:max-h-[80vh] sm:w-[640px] sm:-translate-x-1/2 sm:rounded-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className="mb-2 md:mb-3 flex items-center justify-between">
              <h3 className="text-base md:text-lg font-medium">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-foreground/70 hover:bg-foreground/5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
            <div className="prose prose-[0.9rem] md:prose-sm max-w-none text-muted-foreground">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* --------------------- Main Component ------------------ */

export type MinimalistVideoHeroProps = {
  vehicle?: VehicleModel & {
    videoId?: string;
    priceFrom?: string | number;
    modelYear?: number;
  };
  heroImages?: { src: string; alt?: string }[];
  defaultVariant?: "original" | "modellista";
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onInfoClick?: () => void;
  onShareClick?: () => void;
};

const DEFAULT_VIDEO_ID = "E-TmuQuQwVI";
const DEFAULT_TITLE = "TOYOTA";
const FALLBACK_IMAGES: { src: string; alt?: string }[] = [
  {
    src: "https://toyota.jp/pages/contents/landcruiser300/004_p_001/image/customizecar/top/original1_01.jpg",
    alt: "Land Cruiser 300 — Original kit",
  },
  {
    src: "https://toyota.jp/pages/contents/landcruiser300/004_p_001/image/customizecar/top/modellista1_01.jpg",
    alt: "Land Cruiser 300 — Modellista kit",
  },
  {
    src: "https://toyota.jp/pages/contents/landcruiser300/004_p_001/image/design/gallery_10.jpg",
    alt: "Land Cruiser 300 — Exterior gallery",
  },
];

export default function MinimalistVideoHero({
  vehicle,
  heroImages = FALLBACK_IMAGES,
  defaultVariant = "original",
  onBookTestDrive,
  onCarBuilder,
  onInfoClick,
  onShareClick,
}: MinimalistVideoHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  // Only respect reduced motion, not saveData - users want to see videos
  const prefersImage = useMemo(() => {
    return Boolean(shouldReduceMotion);
  }, [shouldReduceMotion]);

  // Always start with video mode unless reduced motion is preferred
  const [mode, setMode] = useState<"video" | "image">(prefersImage ? "image" : "video");
  const [activeIndex, setActiveIndex] = useState(defaultVariant === "modellista" ? 1 : 0);
  const [videoPlaying, setVideoPlaying] = useState(!prefersImage);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const title = (vehicle?.name ?? DEFAULT_TITLE).toUpperCase();
  const price = formatPrice(vehicle?.priceFrom);
  const videoId = vehicle?.videoId ?? (vehicle as any)?.videoUrl ?? DEFAULT_VIDEO_ID;
  const rawPrice = typeof vehicle?.priceFrom === 'number' ? vehicle.priceFrom : parseFloat(String(vehicle?.priceFrom || '0').replace(/[^\d.]/g, '')) || 0;

  const images = useMemo(
    () =>
      (heroImages?.length ? heroImages : FALLBACK_IMAGES).map((im) => ({
        src: im.src,
        alt: im.alt || `${title} gallery`,
      })),
    [heroImages, title],
  );

  useEffect(() => {
    if (images?.[0]?.src) {
      const i = new Image();
      i.src = images[0].src;
    }
  }, [images]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (!visible) setVideoPlaying(false);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!topSentinelRef.current) return;
    const io = new IntersectionObserver((entries) => setStickyVisible(!entries[0].isIntersecting), { threshold: 0 });
    io.observe(topSentinelRef.current);
    return () => io.disconnect();
  }, []);

  const specs: Array<{ label: string; value: string }> = [
    { label: "Fuel consumption (combined)", value: "4.8–5.0 L/100 km" },
    { label: "CO₂ emissions (combined)", value: "108–124 g/km" },
    { label: "CO₂ class", value: "C" },
  ];

  const handleInfo = () => {
    if (onInfoClick) return onInfoClick();
    setSheetOpen(true);
  };

  const doShare = async () => {
    if (onShareClick) return onShareClick();
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("media", mode);
      url.searchParams.set("image", String(activeIndex));
      if (navigator.share) {
        await navigator.share({ title, text: `${title} — Build & Price`, url: url.toString() });
      } else {
        await navigator.clipboard.writeText(url.toString());
        setShareHint("Link copied");
        setTimeout(() => setShareHint(null), 1500);
      }
    } catch {
      setShareHint("Could not share");
      setTimeout(() => setShareHint(null), 1500);
    }
  };

  const toggleMode = () => setMode((m) => (m === "video" ? "image" : "video"));
  const openLightbox = (i: number) => {
    setActiveIndex(i);
    setLightboxOpen(true);
  };

  return (
    <section
      ref={sectionRef as any}
      role="region"
      aria-labelledby="video-hero-heading"
      className="relative h-screen min-h-[100svh] w-full overflow-hidden bg-background"
      data-analytics-id="hero"
    >
      <div ref={topSentinelRef} aria-hidden="true" className="absolute -top-1 h-1 w-1" />

      {/* Background Media with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: backgroundScale }}>
        {mode === "video" ? (
          <CoverYouTube videoId={videoId} playing={!shouldReduceMotion && videoPlaying} />
        ) : (
          <>
            <img
              src={images[activeIndex]?.src}
              alt={images[activeIndex]?.alt || `${title} hero image`}
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/30" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/30 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
            />
          </>
        )}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6 lg:p-12">
        {/* Top: Title + Price with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ y: titleY, opacity: contentOpacity }}
          className="space-y-1"
        >
          <motion.h1
            id="video-hero-heading"
            className="text-[clamp(1.6rem,6vw,2.25rem)] md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-wide text-white leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>

          {vehicle?.modelYear && (
            <motion.div 
              className="text-xs md:text-sm text-white/80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Model Year {vehicle.modelYear}
            </motion.div>
          )}

          <div className="text-xs md:text-sm text-white/90">
            <span className="font-light">Starting from (incl. VAT)</span>
          </div>
          <motion.div 
            className="text-xl md:text-2xl lg:text-3xl font-light text-white" 
            aria-live="polite"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <AnimatedCounter value={rawPrice} duration={1.5} prefix="AED " />
          </motion.div>
        </motion.div>

        {/* Bottom: CTAs + Variant + Media Strip + Specs */}
        <div className="space-y-4 md:space-y-5 pb-[max(env(safe-area-inset-bottom),1rem)] md:pb-[max(env(safe-area-inset-bottom),1.25rem)]">
          {/* CTAs with stagger */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ opacity: contentOpacity }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-2.5 md:flex-row md:gap-4"
          >
            <motion.div
              custom={0}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <PremiumButton
                onClick={onCarBuilder}
                aria-label="Open Car Builder"
                className="h-10 md:h-12 px-5 md:px-8 text-sm md:text-base bg-white text-foreground hover:bg-white/90"
                data-analytics-id="cta-build"
              >
                Build & Price
              </PremiumButton>
            </motion.div>

            <motion.div
              custom={1}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <PremiumButton
                onClick={onBookTestDrive}
                aria-label="Book a Test Drive"
                variant="outline"
                className="h-10 md:h-12 border-2 border-white bg-transparent px-5 md:px-8 text-sm md:text-base text-white hover:bg-white/10"
                data-analytics-id="cta-testdrive"
              >
                Book a Test Drive
              </PremiumButton>
            </motion.div>
          </motion.div>

          {/* Variant Toggle */}
          {images.length >= 2 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(0);
                  setMode("image");
                }}
                className={`rounded-full px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/60 ${
                  activeIndex === 0 ? "bg-white text-foreground" : "bg-white/10 text-white hover:bg-white/20"
                }`}
                aria-pressed={activeIndex === 0}
              >
                Original
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(1);
                  setMode("image");
                }}
                className={`rounded-full px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/60 ${
                  activeIndex === 1 ? "bg-white text-foreground" : "bg-white/10 text-white hover:bg-white/20"
                }`}
                aria-pressed={activeIndex === 1}
              >
                Modellista
              </button>
            </div>
          )}

          {/* Media controls + Strip */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleMode}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label={mode === "video" ? "Switch to images" : "Switch to video"}
              >
                {mode === "video" ? (
                  <ImagesIcon className="h-4 w-4" />
                ) : videoPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {mode === "video" ? "View Images" : "View Video"}
              </button>

              {mode === "video" && (
                <button
                  type="button"
                  onClick={() => setVideoPlaying((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label={videoPlaying ? "Pause video" : "Play video"}
                >
                  {videoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {videoPlaying ? "Pause" : "Play"}
                </button>
              )}
            </div>

            {mode === "image" && (
              <>
                <MediaStrip images={images} activeIndex={activeIndex} onSelect={(i) => setActiveIndex(i)} />
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => openLightbox(activeIndex)}
                    className="rounded-full bg-white/10 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                    aria-label="Open image full screen"
                  >
                    Open Full Screen
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 text-[11px] md:text-xs lg:text-sm text-white/90"
            >
              {specs.map((s, i) => (
                <div key={`${s.label}-${i}`} className="flex items-center gap-1.5 md:gap-2">
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
                onClick={() => (onInfoClick ? onInfoClick() : setSheetOpen(true))}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/50 text-[10px] md:text-xs text-white/90 hover:bg-white/10"
                aria-label="Open more information"
                title="More information"
                data-analytics-id="specs-info"
              >
                i
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Top-right utilities (smaller on mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="absolute right-4 top-4 md:right-6 md:top-6 z-20 flex flex-col gap-2.5 md:gap-3 lg:right-12 lg:top-12"
      >
        <button
          type="button"
          onClick={() => (onInfoClick ? onInfoClick() : setSheetOpen(true))}
          className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="More information"
          title="More information"
        >
          <Info className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={async () => {
              if (onShareClick) return onShareClick();
              try {
                const url = new URL(window.location.href);
                url.searchParams.set("media", mode);
                url.searchParams.set("image", String(activeIndex));
                if (navigator.share) {
                  await navigator.share({ title, text: `${title} — Build & Price`, url: url.toString() });
                } else {
                  await navigator.clipboard.writeText(url.toString());
                  setShareHint("Link copied");
                  setTimeout(() => setShareHint(null), 1500);
                }
              } catch {
                setShareHint("Could not share");
                setTimeout(() => setShareHint(null), 1500);
              }
            }}
            className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Share"
            title="Share"
            data-analytics-id="share"
          >
            <Share2 className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <AnimatePresence>
            {shareHint && (
              <motion.div
                className="absolute -left-2 top-11 md:top-12 rounded-md bg-black/80 px-2 py-1 text-[11px] md:text-xs text-white"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                {shareHint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        index={activeIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
        onNext={() => setActiveIndex((i) => (i + 1) % images.length)}
      />

      {/* WLTP Bottom Sheet */}
      {!onInfoClick && (
        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Efficiency & Legal">
          <ul className="mb-3 list-disc pl-5">
            <li>Fuel consumption and CO₂ figures are based on WLTP combined cycle.</li>
            <li>Actual values may vary depending on driving style, conditions, and vehicle configuration.</li>
            <li>Images may include optional accessories and can vary by market.</li>
          </ul>
          <p>
            For full specifications and disclaimers, please refer to the official brochure or contact your nearest
            showroom.
          </p>
        </BottomSheet>
      )}

      {/* Sticky Mobile CTA (already compact) */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 bg-black/70 px-3 md:px-4 py-2.5 md:py-3 text-white backdrop-blur-md md:hidden"
            initial={{ y: 64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 64, opacity: 0 }}
          >
            <div className="min-w-0">
              <div className="truncate text-[11px] text-white/80">Starting from (incl. VAT)</div>
              <div className="truncate text-sm font-medium" aria-live="polite">
                {price}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <PremiumButton
                onClick={onCarBuilder}
                className="h-8 px-3 bg-white text-foreground hover:bg-white/90"
                data-analytics-id="cta-build-sticky"
              >
                Build
              </PremiumButton>
              <PremiumButton
                onClick={onBookTestDrive}
                variant="outline"
                className="h-8 border-2 border-white bg-transparent px-3 text-white hover:bg-white/10"
                data-analytics-id="cta-testdrive-sticky"
              >
                Test Drive
              </PremiumButton>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[env(safe-area-inset-bottom)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
