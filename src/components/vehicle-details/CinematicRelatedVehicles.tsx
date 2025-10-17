"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star, ArrowRight, Eye, Shield, X } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import type { VehicleModel } from "@/types/vehicle";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/* =========================================================================
   CinematicRelatedVehicles — Premium v7 (single file)
   - Mobile-first, neutral glass theme, minimal primary accents
   - Scroll-snap carousel, wheel-to-horizontal, swipe, keyboard support
   - Progress bar, active index, shimmer skeleton, reduced-motion aware
   - In-file Quick View modal (lightweight)
=========================================================================== */

interface CinematicRelatedVehiclesProps {
  currentVehicle: VehicleModel;
  className?: string;
  title?: string;
}

type EnhancedVehicle = VehicleModel & {
  image: string;
  quickFeatures: string[];
};

function formatPrice(value: string | number | undefined) {
  if (value == null) return "—";
  const n = typeof value === "number" ? value : parseFloat(String(value).replace(/[^\d.]/g, ""));
  if (Number.isFinite(n)) return new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);
  return String(value);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CinematicRelatedVehicles({
  currentVehicle,
  className,
  title = "You may also like",
}: CinematicRelatedVehiclesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  // Related vehicles
  const enhancedVehicles: EnhancedVehicle[] = useMemo(() => {
    const related = vehicles
      .filter((v) => v.category === currentVehicle.category && v.name !== currentVehicle.name)
      .slice(0, 12);
    return related.map((v) => ({
      ...v,
      image: (v as any).image || "/placeholder.svg",
      quickFeatures: [
        v.features?.[0] || "Premium Interior",
        v.features?.[1] || "Advanced Safety",
        v.features?.[2] || "Hybrid Efficiency",
      ],
    }));
  }, [currentVehicle]);

  const [hovered, setHovered] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(360);
  const [gapX, setGapX] = useState(24);
  const [quickView, setQuickView] = useState<VehicleModel | null>(null);
  const [imgLoaded, setImgLoaded] = useState<Record<string, boolean>>({});

  // Measure card width + gap for precise index calc
  useEffect(() => {
    const el = cardRef.current;
    const list = scrollerRef.current;
    if (!el || !list) return;

    const compute = () => {
      const w = el.getBoundingClientRect().width;
      // gap from computed style of parent flex
      const style = window.getComputedStyle(list);
      const gap = parseFloat(style.columnGap || style.gap || "24");
      setCardWidth(w);
      setGapX(Number.isFinite(gap) ? gap : 24);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // Scroll → active index
  useEffect(() => {
    const list = scrollerRef.current;
    if (!list) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const step = cardWidth + gapX;
        const idx = step > 0 ? Math.round(list.scrollLeft / step) : 0;
        setActiveIndex(Math.max(0, Math.min(enhancedVehicles.length - 1, idx)));
      });
    };

    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener("scroll", onScroll);
    };
  }, [cardWidth, gapX, enhancedVehicles.length]);

  // Wheel -> horizontal
  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const list = scrollerRef.current;
    if (!list) return;
    // If vertical scroll exists in parent, we only hijack when horizontal container is hovered
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      list.scrollBy({ left: e.deltaY, behavior: "smooth" });
    }
  }, []);

  // Keyboard nav on focus
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    scrollByCards(dir);
  }, []);

  const scrollByCards = (dir: number) => {
    const list = scrollerRef.current;
    if (!list) return;
    const step = cardWidth + gapX;
    list.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  const scroll = (dir: "left" | "right") => scrollByCards(dir === "left" ? -1 : 1);

  const openQuick = (v: VehicleModel) => setQuickView(v);
  const closeQuick = () => setQuickView(null);

  if (!enhancedVehicles.length) return null;

  // Progress (0..1)
  const progress = enhancedVehicles.length > 1 ? activeIndex / (enhancedVehicles.length - 1) : 0;

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background",
        className,
      )}
      aria-roledescription="carousel"
      aria-label="Related vehicles"
    >
      {/* Subtle grid mask */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-10%,rgba(0,0,0,0.08),transparent_70%)]" />

      <div className="toyota-container container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Discover more from our {currentVehicle.category} collection—curated for a refined driving experience.
            </p>
          </div>

          {/* Controls (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="h-11 w-11 rounded-xl border hover:bg-primary/10 hover:border-primary transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="h-11 w-11 rounded-xl border hover:bg-primary/10 hover:border-primary transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            ref={scrollerRef}
            onWheel={onWheel}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="group"
            aria-label="Vehicle cards"
            className={cn(
              "flex overflow-x-auto gap-6 md:gap-8 pb-6 md:pb-8 snap-x snap-mandatory",
              "scrollbar-hide focus:outline-none px-2 -mx-2",
            )}
            style={{ scrollPaddingLeft: "1rem" }}
          >
            {enhancedVehicles.map((v, idx) => (
              <motion.article
                key={v.name}
                ref={idx === 0 ? cardRef : undefined}
                className={cn(
                  "group flex-none snap-start w-[78vw] xs:w-[70vw] sm:w-[56vw] md:w-[38rem] lg:w-[30rem] xl:w-[32rem]",
                  "cursor-pointer",
                )}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.45, delay: 0.05 * idx, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHovered(v.name)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`${v.name} ${v.category}`}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-md">
                  <CardContent className="p-0">
                    {/* Media */}
                    <div className="relative overflow-hidden rounded-t-2xl">
                      {/* Image skeleton */}
                      {!imgLoaded[v.name] && (
                        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 via-muted/20 to-transparent" />
                      )}
                      <motion.img
                        src={(v as any).image}
                        alt={v.name}
                        loading="lazy"
                        onLoad={() => setImgLoaded((s) => ({ ...s, [v.name]: true }))}
                        className="h-56 sm:h-64 md:h-72 w-full object-cover will-change-transform"
                        sizes="(max-width: 640px) 78vw, (max-width: 768px) 56vw, (max-width: 1024px) 38rem, 32rem"
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />

                      {/* Overlay gradient */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Price pill */}
                      <div className="absolute top-4 right-4">
                        <div className="rounded-xl border border-white/15 bg-white/15 text-white px-3 py-1.5 backdrop-blur-md text-sm font-semibold shadow-sm">
                          AED {formatPrice(v.price)}
                        </div>
                      </div>

                      {/* Featured badge (subtle) */}
                      <div className="absolute top-4 left-4">
                        <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 backdrop-blur-md text-[12px] font-medium text-white">
                          <Star className="h-3.5 w-3.5" />
                          Featured
                        </div>
                      </div>

                      {/* Quick actions on hover (desktop) */}
                      <AnimatePresence>
                        {hovered === v.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-4 left-4 right-4 hidden md:flex gap-2"
                          >
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-md"
                              onClick={() => openQuick(v)}
                              aria-label={`Quick view ${v.name}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Quick View
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-xl sm:text-2xl font-semibold leading-tight group-hover:text-primary transition-colors">
                            {v.name}
                          </h3>
                          <p className="mt-1 text-[12px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                            {v.category}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground transition"
                          asChild
                          aria-label={`Go to ${v.name} details`}
                        >
                          <Link to={`/vehicle/${slugify(v.name)}`}>
                            <ArrowRight className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>

                      {/* Quick features */}
                      <ul className="mt-4 space-y-2">
                        {v.quickFeatures.map((f, i) => (
                          <motion.li
                            key={`${v.name}-${f}-${i}`}
                            initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                            whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10% 0px" }}
                            transition={{ duration: 0.35, delay: 0.05 * i }}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/80" />
                            {f}
                          </motion.li>
                        ))}
                      </ul>

                      {/* Actions */}
                      <div className="mt-5 flex gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
                        >
                          <Link to={`/vehicle/${slugify(v.name)}`}>Explore Details</Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="px-3 hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
                          onClick={() => openQuick(v)}
                          aria-label={`Configure ${v.name}`}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-background to-transparent" />

          {/* Progress bar */}
          <div className="mt-6 md:mt-8">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary/70"
                style={{
                  width: `${Math.max(6, (100 * 1) / enhancedVehicles.length)}%`,
                }}
                animate={{ x: `${progress * 100}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
              />
            </div>
            {/* Dots (accessible) */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {enhancedVehicles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const list = scrollerRef.current;
                    if (!list) return;
                    const step = cardWidth + gapX;
                    list.scrollTo({ left: step * i, behavior: "smooth" });
                  }}
                  aria-label={`Go to item ${i + 1}`}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition",
                    i === activeIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/60",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Mobile controls (compact) */}
          <div className="mt-4 flex md:hidden justify-center gap-3">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={() => scroll("left")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={() => scroll("right")}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view ${quickView.name}`}
            className="fixed inset-0 z-[80] grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeQuick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[81] w-full max-w-3xl rounded-2xl bg-card shadow-2xl border"
            >
              <button
                onClick={closeQuick}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition"
                aria-label="Close quick view"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="overflow-hidden rounded-t-2xl">
                <img
                  src={(quickView as any).image || "/placeholder.svg"}
                  alt={quickView.name}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold">{quickView.name}</h3>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{quickView.category}</p>
                  </div>
                  <div className="rounded-xl border bg-muted px-3 py-1.5 text-sm font-semibold">
                    AED {formatPrice(quickView.price)}
                  </div>
                </div>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {(
                    quickView.features?.slice(0, 6) || ["Premium Interior", "Advanced Safety", "Hybrid Efficiency"]
                  ).map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-2">
                  <Button asChild className="flex-1">
                    <Link to={`/vehicle/${slugify(quickView.name)}`}>Open Full Details</Link>
                  </Button>
                  <Button variant="outline" onClick={closeQuick}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
