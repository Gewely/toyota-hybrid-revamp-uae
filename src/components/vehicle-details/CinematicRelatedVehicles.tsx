import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { vehicles } from "@/data/vehicles";
import type { VehicleModel } from "@/types/vehicle";
import DiscoveryGrid from "./DiscoveryGrid";
import VehicleComparisonDrawer from "./VehicleComparisonDrawer";
import QuickPreviewSheet from "./QuickPreviewSheet";

interface CinematicRelatedVehiclesProps {
  currentVehicle: VehicleModel;
  className?: string;
  title?: string;
}

type EnhancedVehicle = VehicleModel & {
  image: string;
  quickFeatures?: string[];
};

// Utility: parse price
const parsePrice = (raw: string | number | undefined): number | null => {
  if (raw == null) return null;
  const n = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/[^\d.]/g, ""));
  return isNaN(n) ? null : n;
};

// Format currency
const money = (n: number | null, c = "AED"): string => {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(n);
};

// Estimate monthly (simple ~5 year @ 3.5%)
const estMonthly = (raw: string | number | undefined): number | null => {
  const p = parsePrice(raw);
  if (!p) return null;
  const principal = p * 0.8;
  const r = 0.035 / 12;
  const n = 60;
  const factor = Math.pow(1 + r, n);
  return Math.round((principal * r * factor) / (factor - 1));
};

// URL-safe slug
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const CinematicRelatedVehicles: React.FC<CinematicRelatedVehiclesProps> = ({
  currentVehicle,
  className = "",
  title = "You Might Also Like",
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Smooth scroll position tracking
  const scrollX = useMotionValue(0);
  const smoothScroll = useSpring(scrollX, { stiffness: 100, damping: 30 });

  // Related vehicles
  const [comparisonVehicles, setComparisonVehicles] = useState<VehicleModel[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickViewVehicle, setQuickViewVehicle] = useState<VehicleModel | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const related: EnhancedVehicle[] = vehicles
    .filter((v) => v.id !== currentVehicle.id && v.category === currentVehicle.category)
    .slice(0, 6)
    .map((v) => ({
      ...v,
      image: v.image,
      quickFeatures: ["Premium Interior", "Advanced Safety", "Hybrid Available"],
    }));

  if (related.length === 0) return null;

  const handleCompare = (vehicleIds: string[]) => {
    const selectedVehicles = vehicles.filter(v => vehicleIds.includes(v.id));
    setComparisonVehicles(selectedVehicles);
    setIsCompareOpen(true);
  };

  const handleQuickView = (vehicle: VehicleModel) => {
    setQuickViewVehicle(vehicle);
    setIsQuickViewOpen(true);
  };

  const handleNavigate = (vehicleId: string) => {
    navigate(`/vehicle/${slugify(vehicleId)}`);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.querySelector(".vehicle-card")?.clientWidth || 380;
    const scrollAmount = cardWidth + 24; // card + gap
    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Update scroll position
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      scrollX.set(container.scrollLeft);
    };
    
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollX]);

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 sm:py-20 md:py-28 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background ${className}`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="toyota-container relative">
        {/* Header */}
        <motion.div
          className="mb-10 md:mb-14 flex items-end justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground"
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore similar vehicles in the {currentVehicle.category} category
            </motion.p>
          </div>

          {/* Desktop nav buttons */}
          <div className="hidden lg:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Use DiscoveryGrid instead of scroll container */}
        <DiscoveryGrid
          vehicles={related}
          onCompare={handleCompare}
          onQuickView={handleQuickView}
          onNavigate={handleNavigate}
        />

        {/* Comparison Drawer */}
        <VehicleComparisonDrawer
          vehicles={comparisonVehicles}
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          onClearAll={() => setComparisonVehicles([])}
        />

        {/* Quick Preview Sheet */}
        {quickViewVehicle && (
          <QuickPreviewSheet
            vehicle={quickViewVehicle}
            isOpen={isQuickViewOpen}
            onClose={() => {
              setIsQuickViewOpen(false);
              setQuickViewVehicle(null);
            }}
          />
        )}
      </div>
    </section>
  );
};

// Enhanced Vehicle Card Component
const VehicleCardEnhanced: React.FC<{
  vehicle: EnhancedVehicle;
  index: number;
  inView: boolean;
  onNavigate: () => void;
}> = ({ vehicle, index, inView, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const price = parsePrice(vehicle.price);
  const monthly = estMonthly(vehicle.price);

  return (
    <motion.div
      className="vehicle-card flex-shrink-0 w-[340px] sm:w-[380px] md:w-[420px] snap-center"
                  initial={{ opacity: 0, rotateY: 45, scale: 0.9 }}
                  whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1200px'
                  }}
                >
        <Card className="group relative overflow-hidden rounded-3xl border-2 border-border hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl h-full">
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: -3,
              boxShadow: '0 30px 80px -15px rgba(0,0,0,0.4)',
              transition: { duration: 0.3 }
            }}
          >
            <CardContent className="p-0 h-full flex flex-col">
          {/* Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted via-muted/50 to-muted/30">
            <motion.img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
              animate={{ 
                scale: isHovered ? 1.15 : 1,
                rotateZ: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Overlay gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {vehicle.category && (
                <Badge className="bg-primary/90 backdrop-blur-sm shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  {vehicle.category}
                </Badge>
              )}
              {price && price > 500000 && (
                <Badge className="bg-orange-500/90 backdrop-blur-sm shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>

            {/* Hover CTA */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={onNavigate}
                size="lg"
                className="shadow-2xl hover:scale-105 transition-transform"
              >
                Explore Details
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              Experience luxury and performance in perfect harmony
            </p>

            {/* Quick Features */}
            {vehicle.quickFeatures && (
              <div className="flex flex-wrap gap-2 mb-4">
                {vehicle.quickFeatures.slice(0, 3).map((feat, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 rounded-full bg-muted text-xs font-medium flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 text-primary" />
                    {feat}
                  </div>
                ))}
              </div>
            )}

            {/* Pricing */}
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Starting from</div>
                  <div className="text-2xl font-bold text-primary">
                    {money(price)}
                  </div>
                  {monthly && (
                    <div className="text-xs text-muted-foreground mt-1">
                      or {money(monthly)}/month
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNavigate}
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
            </CardContent>
          </motion.div>
        </Card>
    </motion.div>
  );
};

export default CinematicRelatedVehicles;
