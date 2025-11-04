"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useVehicleData } from "@/hooks/use-vehicle-data";

/* ============================================================
   Types (aligned with your original ShowroomCard + small opts)
============================================================ */
type ModalType = "interior" | "exterior" | "performance" | "safety" | "technology" | null;

type ShowroomCard = {
  id: Exclude<ModalType, null>;
  title: string;
  tagline: string;
  image?: string;
  layout: "tall" | "square" | "wide";
  gridSpan?: { row?: string; col?: string };
  contentPosition: "top" | "bottom" | "overlay";
  // Optional additions for richer UX:
  alt?: string;
  videoSrc?: string; // when present, MobileCarousel renders a <video/> slide
};

/* ============================================================
   Assets you requested
============================================================ */
const SAFETY_VIDEO =
  "https://tmca-media.rotorint.com/lc300/tss_crz_120_compdesktopstitched_a01_landscape_fhd_desktop.mp4";

// Mobile portrait images (carousel)
const MOBILE_IMAGES = [
  "https://www.wsupercars.com/wallpapers-phone/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-2400p.jpg",
  "https://www.wsupercars.com/wallpapers-phone/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-2400p.jpg",
  "https://www.wsupercars.com/wallpapers-phone/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-005-2400p.jpg",
];

// Desktop images (grid)
const DESKTOP_IMAGES = [
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg",
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1536.jpg",
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-005-1536.jpg",
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg",
  "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-006-1536.jpg",
];

/* ============================================================
   Simple breakpoint hook (no external deps)
============================================================ */
function useBreakpoint(query = "(min-width: 1024px)") {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ============================================================
   Desktop Safety Banner (outside the grid)
============================================================ */
const SafetyBanner: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="relative aspect-[16/6] rounded-3xl overflow-hidden bg-black">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={SAFETY_VIDEO}
            playsInline
            muted
            loop
            autoPlay={!reduce}
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <div className="absolute left-8 bottom-8 right-8 flex items-end justify-between gap-6">
            <div className="max-w-[60%]">
              <h2 className="text-white text-3xl xl:text-4xl font-semibold tracking-tight">Toyota Safety Sense</h2>
              <p className="mt-2 text-white/80 text-base xl:text-lg">
                Proactive protection, intelligent awareness — watch it in action.
              </p>
            </div>
            <button
              onClick={onExplore}
              className="shrink-0 rounded-xl bg-white/10 backdrop-blur px-5 py-3 text-white border border-white/20 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore Safety
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   Mobile Carousel (inline component)
============================================================ */
const MobileCarousel: React.FC<{
  cards: ShowroomCard[];
  onCardClick: (id: ShowroomCard["id"]) => void;
}> = ({ cards, onCardClick }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const reduce = useReducedMotion();

  // Sync index with scroll position
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      if (i !== index) setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [index]);

  const to = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-[calc(100svh-24px)]"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        aria-roledescription="carousel"
        aria-label="Showroom carousel"
      >
        {cards.map((card, i) => (
          <article
            key={card.id}
            className="relative shrink-0 w-full h-full snap-start"
            aria-roledescription="slide"
            aria-label={`${card.title} (${i + 1} of ${cards.length})`}
          >
            {/* Visual */}
            <div className="absolute inset-0">
              {card.videoSrc ? (
                <video
                  className="h-full w-full object-cover"
                  src={card.videoSrc}
                  playsInline
                  muted
                  loop
                  autoPlay={!reduce}
                  preload="metadata"
                  poster={card.image}
                />
              ) : (
                <img
                  className="h-full w-full object-cover"
                  src={card.image}
                  alt={card.alt || card.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  {...(i === 0 ? { fetchPriority: "high" as const } : {})}
                  sizes="100vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: index === i ? 1 : 0.6, y: index === i ? 0 : 10 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative h-full flex flex-col justify-end px-5 pb-[max(env(safe-area-inset-bottom),16px)]"
            >
              <div className="max-w-[92%]">
                <h3 className="text-white text-xl font-semibold leading-tight">{card.title}</h3>
                <p className="text-white/80 text-sm mt-1 line-clamp-2">{card.tagline}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => onCardClick(card.id)}
                  className="rounded-lg bg-white/90 text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore
                </button>
              </div>
            </motion.div>
          </article>
        ))}
      </div>

      {/* Dots */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-3 flex items-center justify-center gap-2">
        {cards.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${index === i ? "w-6 bg-white" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>

      {/* Prev/Next */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
        <button
          aria-label="Previous"
          className="rounded-full bg-black/30 text-white px-3 py-2 backdrop-blur border border-white/20"
          onClick={() => to(Math.max(0, index - 1))}
        >
          ‹
        </button>
        <button
          aria-label="Next"
          className="rounded-full bg-black/30 text-white px-3 py-2 backdrop-blur border border-white/20"
          onClick={() => to(Math.min(cards.length - 1, index + 1))}
        >
          ›
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   Desktop Grid (inline component) - Enhanced with 3D scroll animations
============================================================ */
const DesktopGrid: React.FC<{
  cards: ShowroomCard[];
  onCardClick: (id: ShowroomCard["id"]) => void;
}> = ({ cards, onCardClick }) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  
  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10">
      <div ref={gridRef} className="grid grid-cols-12 gap-6" style={{ perspective: '1500px' }}>
        {cards.map((card, i) => {
          const aspect =
            card.layout === "tall" ? "aspect-[4/5]" : card.layout === "square" ? "aspect-square" : "aspect-[16/9]";
          const span = card.layout === "tall" ? "col-span-4" : card.layout === "square" ? "col-span-4" : "col-span-8";

          return (
            <motion.button
              key={card.id}
              onClick={() => onCardClick(card.id)}
              className={`group relative ${span} ${aspect} overflow-hidden rounded-3xl bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800`}
              aria-label={`${card.title}: ${card.tagline}`}
              initial={{ opacity: 0, rotateX: -15, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              whileHover={{ 
                y: -8,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
            >
              <motion.img
                src={card.image}
                alt={card.alt || card.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                sizes={span.includes("8") ? "(min-width:1024px) 66vw" : "(min-width:1024px) 33vw"}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-95" />
              <div
                className={`absolute inset-0 p-6 flex ${
                  card.contentPosition === "top"
                    ? "items-start"
                    : card.contentPosition === "bottom"
                      ? "items-end"
                      : "items-end"
                }`}
              >
                <motion.div 
                  className="max-w-[80%]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                >
                  <h3 className="text-white text-2xl font-semibold">{card.title}</h3>
                  <p className="text-white/80 mt-1">{card.tagline}</p>
                </motion.div>
                <motion.span 
                  className="absolute right-6 bottom-6 rounded-xl bg-white/10 text-white text-sm px-3 py-2 border border-white/20 backdrop-blur group-hover:bg-white/15"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  Explore
                </motion.span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   Main component - now using useModal hook
============================================================ */
const SeamlessCinematicShowroom: React.FC = () => {
  const { galleryImages } = useVehicleData();
  const isDesktop = useBreakpoint();

  // Build cards. On mobile, the Safety slide has a videoSrc so it plays as a <video/> slide.
  const showroomCards: ShowroomCard[] = useMemo(() => {
    if (isDesktop) {
      return [
        // Desktop grid (safety card will be filtered out below; video is shown as banner)
        {
          id: "interior",
          title: "Refined Interior",
          tagline: "Crafted for luxury and functionality",
          image: DESKTOP_IMAGES[0] || galleryImages[0],
          layout: "tall",
          gridSpan: { row: "row-span-2" },
          contentPosition: "top",
          alt: "Premium interior detailing",
        },
        {
          id: "exterior",
          title: "Commanding Presence",
          tagline: "Bold design meets rugged capability",
          image: DESKTOP_IMAGES[1] || galleryImages[1],
          layout: "square",
          gridSpan: {},
          contentPosition: "overlay",
          alt: "GR-Sport exterior",
        },
        {
          id: "performance",
          title: "Unstoppable Power",
          tagline: "Legendary performance and capability",
          image: DESKTOP_IMAGES[2] || galleryImages[2],
          layout: "wide",
          gridSpan: { col: "col-span-2" },
          contentPosition: "bottom",
          alt: "Performance on dunes",
        },
        {
          id: "technology",
          title: "Connected Experience",
          tagline: "Intuitive infotainment and connectivity",
          image: DESKTOP_IMAGES[3] || galleryImages[1],
          layout: "square",
          gridSpan: {},
          contentPosition: "overlay",
          alt: "Infotainment & cluster",
        },
        // Keep a safety object for consistency if needed
        {
          id: "safety",
          title: "Toyota Safety Sense",
          tagline: "Advanced protection for every journey",
          image: DESKTOP_IMAGES[4] || galleryImages[0],
          layout: "tall",
          gridSpan: { row: "row-span-2" },
          contentPosition: "top",
          alt: "Toyota Safety Sense",
          videoSrc: SAFETY_VIDEO,
        },
      ];
    }

    // Mobile: include Safety with video slide
    return [
      {
        id: "safety",
        title: "Toyota Safety Sense",
        tagline: "Advanced protection for every journey",
        image: MOBILE_IMAGES[0] || galleryImages[0], // poster/fallback
        layout: "tall",
        gridSpan: { row: "row-span-2" },
        contentPosition: "top",
        alt: "Toyota Safety Sense",
        videoSrc: SAFETY_VIDEO,
      },
      {
        id: "interior",
        title: "Refined Interior",
        tagline: "Crafted for luxury and functionality",
        image: MOBILE_IMAGES[1] || galleryImages[0],
        layout: "tall",
        gridSpan: { row: "row-span-2" },
        contentPosition: "top",
        alt: "Premium interior",
      },
      {
        id: "exterior",
        title: "Commanding Presence",
        tagline: "Bold design meets rugged capability",
        image: MOBILE_IMAGES[2] || galleryImages[1],
        layout: "square",
        gridSpan: {},
        contentPosition: "overlay",
        alt: "GR-Sport exterior",
      },
      {
        id: "performance",
        title: "Unstoppable Power",
        tagline: "Legendary performance and capability",
        image: MOBILE_IMAGES[0] || galleryImages[2],
        layout: "wide",
        gridSpan: { col: "col-span-2" },
        contentPosition: "bottom",
        alt: "Performance on dunes",
      },
      {
        id: "technology",
        title: "Connected Experience",
        tagline: "Intuitive infotainment and connectivity",
        image: MOBILE_IMAGES[1] || galleryImages[1],
        layout: "wide",
        gridSpan: { col: "col-span-2" },
        contentPosition: "bottom",
        alt: "Infotainment & cluster",
      },
    ];
  }, [isDesktop, galleryImages]);

  const handleCardClick = (id: string) => console.log('Card clicked:', id);

  return (
    <section className="w-full bg-[hsl(var(--neutral-50))] min-h-screen">
      {/* Desktop: show Safety video banner OUTSIDE grid, and grid without safety */}
      {isDesktop ? (
        <>
          <SafetyBanner onExplore={() => handleCardClick("safety")} />
          <DesktopGrid cards={showroomCards.filter((c) => c.id !== "safety")} onCardClick={handleCardClick} />
        </>
      ) : (
        // Mobile: carousel includes safety video slide
        <MobileCarousel cards={showroomCards} onCardClick={handleCardClick} />
      )}
    </section>
  );
};

export default SeamlessCinematicShowroom;
