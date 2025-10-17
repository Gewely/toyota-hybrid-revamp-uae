"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Wallet } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import type { VehicleModel } from "@/types/vehicle";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/* =========================================================================
   CinematicRelatedVehicles — v10 (Auto-Trim PNG, Mobile-first, Certified)
   - Auto-trim transparent borders for PNGs (canvas, cached)
   - JPGs scenic: object-cover; PNG studio: object-contain (trimmed)
   - Chips (Certified + Price + Monthly) BELOW image
   - Clean, modern, minimal accents. Mobile-first widths + snap.
=========================================================================== */

interface CinematicRelatedVehiclesProps {
  currentVehicle: VehicleModel;
  className?: string;
  title?: string;
}

type EnhancedVehicle = VehicleModel & { image: string; quickFeatures: string[] };

const EASE: number[] = [0.22, 1, 0.36, 1];

// ---- Money / Monthly helpers ------------------------------------------------
function parsePrice(raw: string | number | undefined): number | null {
  if (raw == null) return null;
  if (typeof raw === "number") return raw;
  const n = Number(String(raw).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}
function money(n: number | null, c = "AED") {
  if (n == null) return "—";
  return `${c} ${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n)}`;
}
// Silent assumptions (not shown): 20% down, 3.25% APR, 48m
function estMonthly(raw: string | number | undefined) {
  const p = parsePrice(raw);
  if (p == null) return null;
  const principal = p * 0.8;
  const r = 0.0325 / 12;
  const n = 48;
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -n)));
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ---- Auto-trim PNG (transparent borders) ------------------------------------
const TRIM_CACHE = new Map<string, string>(); // src -> processed dataURL or original src

async function trimTransparentPNG(src: string, alphaThreshold = 8, maxW = 1920, maxH = 1080): Promise<string> {
  if (TRIM_CACHE.has(src)) return TRIM_CACHE.get(src)!;

  // Load image
  const img = new Image();
  // try to allow cross-origin when server sends CORS; if it fails, we fallback
  img.crossOrigin = "anonymous";
  const loaded = await new Promise<HTMLImageElement>((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  }).catch(() => null as unknown as HTMLImageElement);

  if (!loaded) {
    TRIM_CACHE.set(src, src);
    return src;
  }

  try {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("no-ctx");
    ctx.drawImage(img, 0, 0);

    const { data } = ctx.getImageData(0, 0, w, h);

    let minX = w,
      minY = h,
      maxX = -1,
      maxY = -1;
    // scan for non-transparent pixels
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = data[(y * w + x) * 4 + 3];
        if (a > alphaThreshold) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    // If completely transparent or already tight -> return original
    if (maxX < 0 || maxY < 0 || (minX === 0 && minY === 0 && maxX === w - 1 && maxY === h - 1)) {
      TRIM_CACHE.set(src, src);
      return src;
    }

    const trimW = maxX - minX + 1;
    const trimH = maxY - minY + 1;

    // Draw trimmed region
    const out = document.createElement("canvas");
    // downscale huge images to keep dataURL light
    const scale = Math.min(1, maxW / trimW, maxH / trimH);
    out.width = Math.max(1, Math.floor(trimW * scale));
    out.height = Math.max(1, Math.floor(trimH * scale));
    const octx = out.getContext("2d");
    if (!octx) throw new Error("no-ctx2");
    octx.imageSmoothingQuality = "high";
    octx.drawImage(img, minX, minY, trimW, trimH, 0, 0, out.width, out.height);

    const dataURL = out.toDataURL("image/png");
    TRIM_CACHE.set(src, dataURL);
    return dataURL;
  } catch {
    // CORS taint or other issue -> fallback
    TRIM_CACHE.set(src, src);
    return src;
  }
}

function useSmartImage(src: string) {
  const [displaySrc, setDisplaySrc] = useState<string>(src);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");

    const isPng = /\.png(\?.*)?$/i.test(src);

    (async () => {
      try {
        const processed = isPng ? await trimTransparentPNG(src) : src;
        if (!active) return;
        setDisplaySrc(processed);
        setStatus("ready");
      } catch {
        if (!active) return;
        setDisplaySrc(src);
        setStatus("error");
      }
    })();

    return () => {
      active = false;
    };
  }, [src]);

  // Decide fit: if we processed PNG (data URL), use contain; else scenic cover
  const fitClass =
    /\.png(\?.*)?$/i.test(src) && (displaySrc.startsWith("data:image/png") || displaySrc === src)
      ? "object-contain"
      : "object-cover";

  return { displaySrc, fitClass, status };
}

// -----------------------------------------------------------------------------

export default function CinematicRelatedVehicles({
  currentVehicle,
  className,
  title = "You may also like",
}: CinematicRelatedVehiclesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  // Prepare items
  const items: EnhancedVehicle[] = useMemo(() => {
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

  const railRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  // Desktop: wheel → horizontal
  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // keep native vertical on mobile
    const rail = railRef.current;
    if (!rail) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      rail.scrollBy({ left: e.deltaY, behavior: "smooth" });
    }
  }, []);

  // Keep rail snapped initially
  useEffect(() => {
    const rail = railRef.current;
    const card = firstCardRef.current;
    if (!rail || !card) return;
    const snap = () => rail.scrollTo({ left: 0 });
    snap();
    const ro = new ResizeObserver(snap);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative py-14 md:py-18 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden",
        className,
      )}
      aria-roledescription="carousel"
      aria-label="Related vehicles"
    >
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="mb-8 md:mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60">
                {title}
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Curated picks from our {currentVehicle.category} range—full view imagery, modern UI.
            </p>
          </div>

          {/* Desktop nudge */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => railRef.current?.scrollBy({ left: -400, behavior: "smooth" })}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => railRef.current?.scrollBy({ left: 400, behavior: "smooth" })}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Rail */}
        <div
          ref={railRef}
          onWheel={onWheel}
          className={cn(
            "flex gap-5 md:gap-7 overflow-x-auto pb-3 snap-x snap-mandatory",
            "scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0",
          )}
          style={{ scrollPaddingLeft: "1rem" }}
          role="group"
          aria-label="Vehicle cards"
        >
          {items.map((v, i) => {
            const price = parsePrice(v.price);
            const monthly = estMonthly(v.price);

            const { displaySrc, fitClass, status } = useSmartImage(v.image);

            return (
              <motion.article
                key={v.name}
                ref={i === 0 ? firstCardRef : undefined}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.995 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-15% 0px -10% 0px" }}
                transition={{ duration: 0.35, delay: i * 0.03, ease: EASE }}
                className={cn("flex-none snap-start w-[92vw] xs:w-[88vw] sm:w-[70vw] md:w-[36rem] lg:w-[38rem]")}
                aria-label={`${v.name} ${v.category}`}
              >
                <Card className="h-full rounded-2xl border bg-gradient-to-br from-card to-card/95 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* MEDIA: 16:9, centered; PNGs trimmed + contain, JPGs cover */}
                    <div className="relative rounded-t-2xl">
                      <div className="aspect-[16/9] w-full grid place-items-center bg-muted/20">
                        {status === "loading" && (
                          <div className="absolute inset-0 animate-pulse bg-muted/30 rounded-t-2xl" />
                        )}
                        <img
                          src={displaySrc}
                          alt={v.name}
                          loading="lazy"
                          decoding="async"
                          className={cn("w-full h-full", fitClass)}
                          style={{ objectPosition: "center" }}
                          sizes="(max-width: 640px) 92vw, (max-width: 768px) 70vw, 36rem"
                        />
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="p-5 md:p-6">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-xl md:text-2xl font-semibold leading-tight">{v.name}</h3>
                          <p className="mt-1 text-[12px] uppercase tracking-wider text-muted-foreground">
                            {v.category}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground transition"
                          asChild
                          aria-label={`Open ${v.name} details`}
                        >
                          <Link to={`/vehicle/${slugify(v.name)}`}>
                            <ArrowRight className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>

                      {/* CHIPS — away from image */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 text-xs font-medium">
                          <ShieldCheck className="h-4 w-4" />
                          Certified
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 text-xs font-medium">
                          {money(price)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold">
                          <Wallet className="h-4 w-4" />
                          {monthly ? `Est. ${money(monthly)} / mo` : "Est. — / mo"}
                        </span>
                      </div>

                      {/* Features */}
                      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {v.quickFeatures.map((f, idx) => (
                          <li
                            key={`${v.name}-${idx}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
                            {f}
                          </li>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
