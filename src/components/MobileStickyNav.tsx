import React, { useCallback, useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Car,
  Menu,
  ShoppingBag,
  Battery,
  Truck,
  Settings,
  Star,
  Phone,
  X,
  Share2,
  Sliders,
  ChevronUp,
  Download,
  Bolt,
  ChevronRight,
  Calculator,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOptimizedDeviceInfo } from "@/hooks/use-optimized-device-info";
import { useNavigationState } from "@/hooks/use-navigation-state";
import { useToast } from "@/hooks/use-toast";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contextualHaptic } from "@/utils/haptic";
import { Z } from "@/lib/z-index";

const GR_RED = "#EB0A1E";
const GR_EDGE = "#17191B";
const GR_TEXT = "#E6E7E9";
const GR_MUTED = "#9DA2A6";

const carbonMatte: React.CSSProperties = {
  backgroundImage: "url('/lovable-uploads/5dc5accb-0a25-49ca-a064-30844fa8836a.png')",
  backgroundSize: "280px 280px",
  backgroundRepeat: "repeat",
  backgroundPosition: "center",
  backgroundColor: "#0B0B0C",
};

const GR_BTN_PRIMARY =
  "bg-gradient-to-b from-[#EB0A1E] to-[#B10D19] text-white shadow-[0_6px_18px_rgba(235,10,30,.25)] hover:from-[#FF2A3C] hover:to-[#D21320] focus-visible:ring-2 focus-visible:ring-[#EB0A1E]";
const GR_BTN_SURFACE =
  "bg-[#111315] border border-[#17191B] text-[#E6E7E9] hover:bg-[#141618] focus-visible:ring-2 focus-visible:ring-[#EB0A1E]";

const NAV_BLEED_PX = 12;

function useGRMode() {
  const initial = () => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("gr");
      if (p === "1" || p === "true") return true;
      const s = localStorage.getItem("toyota.grMode");
      if (s === "1" || s === "true") return true;
    }
    return false;
  };
  const [isGR, setIsGR] = useState<boolean>(initial);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("toyota.grMode", isGR ? "1" : "0");
    }
  }, [isGR]);
  const toggleGR = () => setIsGR((v) => !v);
  return { isGR, toggleGR };
}

interface MobileStickyNavProps {
  activeItem?: string;
  onMenuToggle?: () => void;
  vehicle?: VehicleModel;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
}

const vehicleCategories = [
  { id: "all", name: "All", icon: <Car className="h-5 w-5" /> },
  { id: "sedan", name: "Sedan", icon: <Car className="h-5 w-5" /> },
  { id: "suv", name: "SUV", icon: <Truck className="h-5 w-5" /> },
  { id: "hybrid", name: "Hybrid", icon: <Battery className="h-5 w-5" /> },
  { id: "performance", name: "GR Performance", icon: <Star className="h-5 w-5" /> },
  { id: "commercial", name: "Commercial", icon: <ShoppingBag className="h-5 w-5" /> },
];

const searchSuggestions = [
  { term: "Camry Hybrid", category: "Sedan", icon: <Car className="h-5 w-5" /> },
  { term: "RAV4", category: "SUV", icon: <Truck className="h-5 w-5" /> },
  { term: "Corolla", category: "Sedan", icon: <Car className="h-5 w-5" /> },
  { term: "Highlander", category: "SUV", icon: <Truck className="h-5 w-5" /> },
  { term: "Prius", category: "Hybrid", icon: <Battery className="h-5 w-5" /> },
  { term: "GR Supra", category: "Performance", icon: <Star className="h-5 w-5" /> },
];

const preOwnedVehicles = [
  {
    name: "2022 Toyota Camry LE",
    price: 89000,
    mileage: "25,000 km",
    year: 2022,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    category: "sedan",
  },
  {
    name: "2021 Toyota RAV4 XLE",
    price: 95000,
    mileage: "35,000 km",
    year: 2021,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    category: "suv",
  },
  {
    name: "2023 Toyota Prius Hybrid",
    price: 78000,
    mileage: "15,000 km",
    year: 2023,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    category: "hybrid",
  },
  {
    name: "2020 Toyota Corolla SE",
    price: 65000,
    mileage: "45,000 km",
    year: 2020,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    category: "sedan",
  },
  {
    name: "2022 Toyota Highlander Limited",
    price: 145000,
    mileage: "20,000 km",
    year: 2022,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    category: "suv",
  },
  {
    name: "2021 Toyota GR Supra 3.0",
    price: 185000,
    mileage: "12,000 km",
    year: 2021,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    category: "performance",
  },
];

/** Detect the real scroll container so padding goes to the element that actually scrolls */
function getScrollRoot(): HTMLElement {
  const marked = document.querySelector("[data-scroll-root]") as HTMLElement | null;
  if (marked) return marked;

  const radixViewport = document.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
  if (radixViewport) return radixViewport;

  const main = document.querySelector("main[role='main']") as HTMLElement | null;
  if (main) return main;

  const root = document.getElementById("root");
  if (root) return root;

  return (document.scrollingElement as HTMLElement) || document.body;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  activeItem = "home",
  vehicle,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
}) => {
  const deviceInfo = useOptimizedDeviceInfo();
  const { toast } = useToast();
  const navigationState = useNavigationState();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 200000]);

  const { isGR, toggleGR } = useGRMode();
  const [userTouchedCategory, setUserTouchedCategory] = useState(false);

  // Add body class when mobile nav is shown
  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldShowNav = deviceInfo.isInitialized && (deviceInfo.isMobile || window.innerWidth <= 500);
    if (shouldShowNav) {
      document.body.classList.add("has-mobile-nav");
      return () => {
        document.body.classList.remove("has-mobile-nav");
      };
    }
  }, [deviceInfo.isInitialized, deviceInfo.isMobile]);

  // Reduced motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    mq.addListener?.(apply);
    return () => {
      mq.removeEventListener?.("change", apply);
      mq.removeListener?.(apply);
    };
  }, []);

  // GR preset for category
  useEffect(() => {
    if (isGR && !userTouchedCategory) setSelectedCategory("performance");
  }, [isGR, userTouchedCategory]);

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE", {
        maximumFractionDigits: 0,
      }),
    [],
  );

  // Reset section on route change
  useEffect(() => {
    navigationState.resetNavigation();
  }, [location.pathname]);

  const filteredVehicles = useMemo(
    () =>
      vehicles
        .filter((v) => selectedCategory === "all" || (v.category ?? "").toLowerCase() === selectedCategory)
        .slice(0, 12),
    [selectedCategory],
  );

  const searchResults = useMemo(
    () => vehicles.filter((v) => (v.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8),
    [searchQuery],
  );

  const filteredPreOwnedVehicles = useMemo(
    () =>
      preOwnedVehicles.filter((v) => {
        const categoryMatch = selectedCategory === "all" || v.category === selectedCategory;
        const priceMatch = v.price >= priceRange[0] && v.price <= priceRange[1];
        return categoryMatch && priceMatch;
      }),
    [selectedCategory, priceRange],
  );

  const handleSectionToggle = useCallback(
    (section: string) => {
      contextualHaptic.stepProgress();
      if (navigationState.activeSection === section) {
        navigationState.resetNavigation();
      } else {
        navigationState.setActiveSection(section);
      }
    },
    [navigationState],
  );

  const handleCategoryClick = useCallback((id: string) => {
    contextualHaptic.buttonPress();
    setSelectedCategory(id);
    setUserTouchedCategory(true);
  }, []);

  const toggleMenu = useCallback(() => {
    contextualHaptic.stepProgress();
    if (navigationState.isMenuOpen) {
      navigationState.resetNavigation();
    } else {
      navigationState.setActiveSection("quick-actions");
      navigationState.setMenuOpen(true);
    }
  }, [navigationState]);

  // Helper: inline flex-basis (avoids Tailwind purge)
  const getCardBasisStyle = (): React.CSSProperties => {
    switch (deviceInfo.deviceCategory) {
      case "smallMobile":
        return { flexBasis: "80%" }; // 4/5
      case "standardMobile":
        return { flexBasis: "66.6667%" }; // 2/3
      case "largeMobile":
      case "extraLargeMobile":
      case "tablet":
        return { flexBasis: "50%" }; // 1/2
      default:
        return { flexBasis: "66.6667%" };
    }
  };

  const getTouchTargetSize = () => {
    switch (deviceInfo.deviceCategory) {
      case "smallMobile":
        return "min-h-[44px] min-w-[44px] p-2";
      case "standardMobile":
        return "min-h-[48px] min-w-[48px] p-2.5";
      default:
        return "min-h-[52px] min-w-[52px] p-3";
    }
  };

  const handleShare = useCallback(async () => {
    if (!vehicle || typeof window === "undefined") return;
    contextualHaptic.buttonPress();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "Vehicle link has been copied to clipboard." });
      }
    } catch {
      /* user cancelled share */
    }
  }, [vehicle, fmt, toast]);

  const handleBrochureDownload = useCallback(() => {
    if (!vehicle) return;
    contextualHaptic.buttonPress();
    toast({
      title: "Brochure Download",
      description: "Your brochure is being prepared and will be downloaded shortly.",
    });
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${vehicle.name} brochure has been downloaded.`,
      });
    }, 1500);
  }, [vehicle, toast]);

  const shouldShowNav = deviceInfo.isInitialized && deviceInfo.isMobile;

  const spring = isGR
    ? { type: "spring", stiffness: 420, damping: 28, mass: 0.7 }
    : { type: "spring", stiffness: 260, damping: 20 };

  // Fixed nav sizing + padding the real scroll container
  const navRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const scroller = getScrollRoot();

    const applyOffsets = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      const nav = navRef.current;
      if (!nav) return;

      const navHeight = Math.round(nav.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--mobile-nav-height", `${navHeight}px`);
      document.documentElement.style.setProperty("--mobile-nav-total", `var(--mobile-nav-height, ${navHeight}px)`);
      document.documentElement.style.setProperty("--mobile-nav-overlap", `${NAV_BLEED_PX}px`);

      // Pad the element that actually scrolls, but allow a small overlap
      scroller.classList.add("with-mobile-nav");
      (scroller.style as any).paddingBottom =
        `calc(var(--mobile-nav-total) - var(--mobile-nav-overlap, ${NAV_BLEED_PX}px))`;
    };

    applyOffsets();

    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const onVV = () => applyOffsets();

    window.addEventListener("resize", applyOffsets);
    window.addEventListener("orientationchange", applyOffsets);
    window.addEventListener("pageshow", applyOffsets);
    vv?.addEventListener?.("resize", onVV);
    vv?.addEventListener?.("scroll", onVV);

    return () => {
      window.removeEventListener("resize", applyOffsets);
      window.removeEventListener("orientationchange", applyOffsets);
      window.removeEventListener("pageshow", applyOffsets);
      vv?.removeEventListener?.("resize", onVV);
      vv?.removeEventListener?.("scroll", onVV);
      const scroller = getScrollRoot();
      scroller.classList.remove("with-mobile-nav");
      (scroller.style as any).paddingBottom = "";
    };
  }, []);

  /**
   * ATTRACT ANIMATION
   */
  const [attractOn, setAttractOn] = useState(false);
  const [showCoachmark, setShowCoachmark] = useState(false);

  useEffect(() => {
    if (!deviceInfo.isInitialized || !deviceInfo.isMobile) return;
    if (reduceMotion) return;
    if (navigationState.isActionsExpanded || navigationState.isMenuOpen) return;

    let idleTimer: number | null = null;
    let cycleTimer: number | null = null;
    let interacted = false;
    let cycles = 0;

    const reset = () => {
      interacted = true;
      setAttractOn(false);
      setShowCoachmark(false);
      if (idleTimer) window.clearTimeout(idleTimer);
      if (cycleTimer) window.clearInterval(cycleTimer);
    };

    const kickOff = () => {
      if (interacted) return;
      setShowCoachmark(true);
      setAttractOn(true);
      cycles = 1;

      cycleTimer = window.setInterval(() => {
        cycles += 1;
        if (cycles >= 3) {
          if (cycleTimer) window.clearInterval(cycleTimer);
          setAttractOn(false);
          setShowCoachmark(false);
        } else {
          setAttractOn(false);
          requestAnimationFrame(() => setAttractOn(true));
        }
      }, 4000);
    };

    const arm = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(kickOff, 6000);
    };

    const onUserInteract = () => reset();
    const onScroll = () => reset();

    window.addEventListener("pointerdown", onUserInteract, { passive: true });
    window.addEventListener("keydown", onUserInteract);
    window.addEventListener("scroll", onScroll, { passive: true });

    arm();

    return () => {
      window.removeEventListener("pointerdown", onUserInteract);
      window.removeEventListener("keydown", onUserInteract);
      window.removeEventListener("scroll", onScroll);
      if (idleTimer) window.clearTimeout(idleTimer);
      if (cycleTimer) window.clearInterval(cycleTimer);
    };
  }, [
    deviceInfo.isInitialized,
    deviceInfo.isMobile,
    reduceMotion,
    navigationState.isActionsExpanded,
    navigationState.isMenuOpen,
  ]);

  const coachVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 18 } },
    exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } },
  };

  const attractVariants = {
    rest: { scale: 1, rotate: 0, filter: "drop-shadow(0 0 0 rgba(235,10,30,0))" },
    attract: reduceMotion
      ? { scale: 1, rotate: 0, filter: "drop-shadow(0 0 0 rgba(235,10,30,0))" }
      : {
          scale: [1, 1.06, 1],
          rotate: [0, -4, 4, 0],
          filter: [
            "drop-shadow(0 0 0 rgba(235,10,30,0))",
            "drop-shadow(0 6px 12px rgba(235,10,30,.35))",
            "drop-shadow(0 0 0 rgba(235,10,30,0))",
          ],
          transition: { duration: 0.9, times: [0, 0.5, 1], ease: "easeInOut" },
        },
  };

  const pulseVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: reduceMotion
      ? { opacity: 0, scale: 0.8 }
      : {
          opacity: [0, 0.8, 0],
          scale: [1, 1.6, 2],
          transition: { duration: 1.2, times: [0, 0.5, 1], ease: "easeInOut" },
        },
  };

  if (!shouldShowNav) return null;

  return (
    <>
      {/* Backdrop for overlays */}
      <AnimatePresence>
        {(navigationState.isMenuOpen || navigationState.isActionsExpanded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60"
            style={{ zIndex: Z.overlay }}
            onClick={navigationState.resetNavigation}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Actions sheet */}
      <AnimatePresence>
        {navigationState.isActionsExpanded && vehicle && (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={reduceMotion ? { duration: 0.1 } : spring}
            className={cn(
              "fixed left-4 right-4 rounded-2xl shadow-2xl border",
              deviceInfo.deviceCategory === "smallMobile" ? "p-3" : "p-4",
              isGR ? "" : "bg-white/95 backdrop-blur-xl border-gray-200/50",
            )}
            style={{
              ...(isGR ? carbonMatte : undefined),
              zIndex: Z.drawer,
              bottom: `calc(var(--mobile-nav-total, 56px) + 12px)`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Vehicle quick actions"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={cn("font-bold", isGR ? "text-white" : "text-gray-900")}>{vehicle.name}</h3>
                <span className={cn("text-lg font-bold", isGR ? "text-red-400" : "text-gray-900 dark:text-gray-100")}>
                  AED {fmt.format(vehicle.price)}
                </span>
              </div>
              <Button
                type="button"
                onClick={() => navigationState.setActionsExpanded(false)}
                variant="outline"
                size="sm"
                className={cn(
                  "p-2 rounded-full",
                  getTouchTargetSize(),
                  isGR ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800" : "",
                )}
                aria-label="Collapse actions"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                type="button"
                onClick={() => {
                  onBookTestDrive?.();
                  navigationState.setActionsExpanded(false);
                }}
                className={cn(
                  "w-full py-3 rounded-xl text-sm font-medium",
                  getTouchTargetSize(),
                  isGR
                    ? GR_BTN_PRIMARY
                    : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                )}
              >
                <Car className="h-4 w-4 mr-2" />
                Test Drive
              </Button>

              <Button
                type="button"
                onClick={() => {
                  onCarBuilder?.();
                  navigationState.setActionsExpanded(false);
                }}
                className={cn(
                  "w-full py-3 rounded-xl text-sm font-medium",
                  getTouchTargetSize(),
                  isGR
                    ? GR_BTN_SURFACE
                    : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white/70 focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                )}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                onClick={() => {
                  onFinanceCalculator?.();
                  navigationState.setActionsExpanded(false);
                }}
                variant="outline"
                className={cn(
                  "w-full py-2 rounded-lg text-xs",
                  getTouchTargetSize(),
                  isGR
                    ? GR_BTN_SURFACE
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/70 focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                )}
              >
                <Calculator className="h-4 w-4 mb-1" />
                Finance
              </Button>

              <Button
                type="button"
                onClick={() => {
                  handleBrochureDownload();
                  navigationState.setActionsExpanded(false);
                }}
                variant="outline"
                className={cn(
                  "w-full py-2 rounded-lg text-xs",
                  getTouchTargetSize(),
                  isGR
                    ? GR_BTN_SURFACE
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/70 focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                )}
              >
                <Download className="h-4 w-4 mb-1" />
                Brochure
              </Button>

              <Button
                type="button"
                onClick={() => {
                  handleShare();
                  navigationState.setActionsExpanded(false);
                }}
                variant="outline"
                className={cn(
                  "w-full py-2 rounded-lg text-xs",
                  getTouchTargetSize(),
                  isGR
                    ? GR_BTN_SURFACE
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/70 focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                )}
                aria-label="Share vehicle"
              >
                <Share2 className="h-4 w-4 mb-1" />
                Share
              </Button>
            </div>

            <div className={cn("mt-4 pt-3 border-t", isGR ? "border-neutral-800" : "border-gray-200")}>
              <p className={cn("text-xs text-center", isGR ? "text-neutral-400" : "text-muted-foreground")}>
                From AED 899/month • Free delivery • 7-day return
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main menu sheet */}
      <AnimatePresence>
        {navigationState.isMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={reduceMotion ? { duration: 0.2 } : spring}
            className={cn(
              "fixed left-0 right-0 rounded-t-3xl shadow-2xl overflow-hidden border-t",
              deviceInfo.deviceCategory === "smallMobile" ? "max-h-[70vh]" : "max-h-[80vh]",
              isGR ? "border-[1px]" : "border-t-4",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Toyota Connect menu"
            style={{
              ...(isGR ? carbonMatte : { backgroundColor: "white", border: "1px solid #e5e7eb" }),
              zIndex: Z.drawer,
              bottom: "var(--mobile-nav-total)",
            }}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={isGR ? { ...carbonMatte, borderColor: GR_EDGE } : undefined}
            >
              <div>
                <h3
                  className={cn("font-bold text-lg", isGR ? "text-white" : "text-gray-900 dark:text-gray-100")}
                  style={{ letterSpacing: ".02em" }}
                >
                  Toyota Connect
                </h3>
                <p className={cn("text-sm", isGR ? "text-neutral-300" : "text-gray-600 dark:text-gray-400")}>
                  {isGR ? "GR Performance Hub" : "Your gateway to Toyota"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleGR}
                  aria-pressed={isGR}
                  aria-label="Toggle GR performance mode"
                  className={cn(
                    "inline-flex items-center h-8 rounded-full px-3 text-xs font-semibold transition-colors",
                    getTouchTargetSize(),
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                    isGR
                      ? "bg-[#1a1c1f] text-[#E6E7E9] hover:bg-[#16181A]"
                      : "bg-gray-200/70 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                  )}
                  title="GR Mode"
                >
                  GR
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={navigationState.resetNavigation}
                  className={cn(
                    "rounded-full h-8 w-8 p-0",
                    getTouchTargetSize(),
                    isGR
                      ? "text-[#E6E7E9] hover:bg-[#16181A]"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  )}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto">
              {navigationState.activeSection === "quick-actions" && (
                <motion.div
                  className={cn("p-6", deviceInfo.deviceCategory === "smallMobile" && "p-4")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4
                    className={cn(
                      "text-lg font-semibold mb-4",
                      isGR ? "text-neutral-200" : "text-gray-800 dark:text-gray-200",
                    )}
                  >
                    Quick Actions
                  </h4>

                  <Carousel opts={{ align: "start" }} className="w-full mb-6">
                    <CarouselContent>
                      {[
                        {
                          id: "test-drive",
                          title: "Book Test Drive",
                          icon: <Car className="h-7 w-7" />,
                          link: "/test-drive",
                          description: "Experience Toyota firsthand",
                        },
                        {
                          id: "offers",
                          title: "Latest Offers",
                          icon: <ShoppingBag className="h-7 w-7" />,
                          link: "/offers",
                          description: "Exclusive deals available",
                        },
                        {
                          id: "configure",
                          title: "Build & Price",
                          icon: <Settings className="h-7 w-7" />,
                          link: "/configure",
                          description: "Customize your Toyota",
                        },
                        {
                          id: "service",
                          title: "Service Booking",
                          icon: <Phone className="h-7 w-7" />,
                          link: "/service",
                          description: "Professional maintenance",
                        },
                      ].map((card) => (
                        <CarouselItem key={card.id} className="pl-4" style={getCardBasisStyle()}>
                          <Link
                            to={card.link}
                            onClick={navigationState.resetNavigation}
                            aria-label={card.title}
                            className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EB0A1E] rounded-xl block"
                          >
                            <motion.div
                              whileHover={reduceMotion ? {} : { scale: 1.02 }}
                              whileTap={reduceMotion ? {} : { scale: 0.98 }}
                            >
                              {isGR ? (
                                <div
                                  className="h-32 overflow-hidden rounded-2xl border"
                                  style={{ ...carbonMatte, borderColor: GR_EDGE }}
                                >
                                  <div className="flex flex-col justify-between h-full p-4 text-[#E6E7E9]">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <h3 className="font-semibold text-base">{card.title}</h3>
                                        <p className="text-xs opacity-90">{card.description}</p>
                                      </div>
                                      <div className="opacity-90">{card.icon}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className="h-[3px] w-24 rounded-full bg-gray-700/30" />
                                      <ChevronRight className="h-4 w-4 opacity-90" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Card className="h-32 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                                  <CardContent className="flex flex-col justify-between h-full p-4 text-white">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <h3 className="font-semibold text-base">{card.title}</h3>
                                        <p className="text-xs opacity-90">{card.description}</p>
                                      </div>
                                      <div className="opacity-90">{card.icon}</div>
                                    </div>
                                    <div className="flex justify-end">
                                      <ChevronRight className="h-4 w-4 opacity-90" />
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </motion.div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      className={cn(
                        "h-12 text-left justify-start",
                        getTouchTargetSize(),
                        isGR ? GR_BTN_SURFACE : "focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                      )}
                      onClick={() => handleSectionToggle("models")}
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Browse Models
                    </Button>

                    <Button
                      type="button"
                      className={cn(
                        "h-12 text-left justify-start",
                        getTouchTargetSize(),
                        isGR ? GR_BTN_SURFACE : "focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                      )}
                      onClick={() => handleSectionToggle("search")}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Vehicle
                    </Button>
                  </div>
                </motion.div>
              )}

              {navigationState.activeSection === "models" && (
                <motion.div
                  className={cn("p-6", deviceInfo.deviceCategory === "smallMobile" && "p-4")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4
                    className={cn(
                      "text-lg font-semibold mb-4",
                      isGR ? "text-neutral-200" : "text-gray-800 dark:text-gray-200",
                    )}
                  >
                    Browse Models
                  </h4>

                  <div className="mb-6">
                    <Carousel opts={{ align: "start" }} className="w-full">
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="pl-3" style={{ flexBasis: "auto" }}>
                            <motion.button
                              type="button"
                              onClick={() => handleCategoryClick(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl transition-all",
                                getTouchTargetSize(),
                                deviceInfo.deviceCategory === "smallMobile" ? "min-w-[70px]" : "min-w-[80px]",
                                selectedCategory === category.id
                                  ? isGR
                                    ? "shadow-[0_0_0_1px_rgba(235,10,30,.5)]"
                                    : "text-white shadow-lg scale-105"
                                  : isGR
                                    ? "hover:bg-[#121416]"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700",
                              )}
                              style={
                                isGR
                                  ? {
                                      ...carbonMatte,
                                      color: selectedCategory === category.id ? GR_TEXT : GR_MUTED,
                                      border: `1px solid ${GR_EDGE}`,
                                    }
                                  : selectedCategory === category.id
                                    ? { background: "linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%)" }
                                    : undefined
                              }
                              whileHover={reduceMotion ? {} : { scale: 1.05 }}
                              whileTap={reduceMotion ? {} : { scale: 0.95 }}
                              aria-pressed={selectedCategory === category.id}
                              aria-label={`Filter ${category.name}`}
                            >
                              <span className="mb-2">{category.icon}</span>
                              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                            </motion.button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                      {filteredVehicles.map((v) => (
                        <CarouselItem key={v.name} className="pl-4" style={getCardBasisStyle()}>
                          <Link
                            to={`/vehicle/${encodeURIComponent((v.name ?? "").toLowerCase().replace(/\s+/g, "-"))}`}
                            onClick={navigationState.resetNavigation}
                            aria-label={`View ${v.name}`}
                            className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EB0A1E] rounded-xl block"
                          >
                            <motion.div
                              whileHover={reduceMotion ? {} : { scale: 1.02 }}
                              whileTap={reduceMotion ? {} : { scale: 0.98 }}
                            >
                              {isGR ? (
                                <div
                                  className="overflow-hidden rounded-2xl border"
                                  style={{ ...carbonMatte, borderColor: GR_EDGE }}
                                >
                                  <div className="aspect-[16/10] w-full relative" style={carbonMatte}>
                                    {v.image && (
                                      <img
                                        src={v.image}
                                        alt={v.name}
                                        className="w-full h-full object-cover mix-blend-screen opacity-90"
                                        loading="lazy"
                                        decoding="async"
                                        sizes="(max-width: 640px) 66vw, (max-width: 768px) 50vw, 33vw"
                                      />
                                    )}
                                  </div>
                                  <div className="p-4">
                                    <h3 className="font-semibold text-base mb-1" style={{ color: GR_TEXT }}>
                                      {v.name}
                                    </h3>
                                    <p className="text-sm mb-3" style={{ color: GR_MUTED }}>
                                      From AED {fmt.format(v.price)}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <span
                                        className="text-xs px-2 py-1 rounded-full font-medium"
                                        style={{
                                          backgroundColor: "#15171A",
                                          border: `1px solid ${GR_EDGE}`,
                                          color: GR_MUTED,
                                        }}
                                      >
                                        {v.category}
                                      </span>
                                      <span
                                        className="text-sm font-semibold flex items-center"
                                        style={{ color: GR_RED }}
                                      >
                                        View <ChevronRight className="h-3 w-3 ml-1" />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                    {v.image && (
                                      <img
                                        src={v.image}
                                        alt={v.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                        sizes="(max-width: 640px) 66vw, (max-width: 768px) 50vw, 33vw"
                                      />
                                    )}
                                  </div>
                                  <CardContent className="p-4">
                                    <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-gray-100">
                                      {v.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                      From AED {fmt.format(v.price)}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full font-medium">
                                        {v.category}
                                      </span>
                                      <span className="text-gray-900 dark:text-gray-100 text-sm font-semibold flex items-center">
                                        View <ChevronRight className="h-3 w-3 ml-1" />
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </motion.div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="mt-6 text-center">
                    <Link
                      to={`/new-cars${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
                      className={cn(
                        "font-semibold flex items-center justify-center rounded-lg",
                        isGR
                          ? "text-red-400 hover:text-red-300"
                          : "text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300",
                      )}
                      onClick={navigationState.resetNavigation}
                    >
                      View All{" "}
                      {selectedCategory !== "all" ? vehicleCategories.find((c) => c.id === selectedCategory)?.name : ""}{" "}
                      Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {navigationState.activeSection === "search" && (
                <motion.div
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4
                    className={cn(
                      "text-lg font-semibold mb-4",
                      isGR ? "text-neutral-200" : "text-gray-800 dark:text-gray-200",
                    )}
                  >
                    Find Your Toyota
                  </h4>

                  <div className="relative mb-6" role="search">
                    <Search
                      className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                        isGR ? "text-neutral-400" : "text-gray-400",
                      )}
                    />
                    <input
                      type="text"
                      placeholder="Search models, features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent focus:ring-[#EB0A1E]",
                        isGR
                          ? "border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-500"
                          : "border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
                      )}
                      aria-label="Search vehicles"
                    />
                  </div>

                  {searchQuery ? (
                    <div className="space-y-3">
                      <h5
                        className={cn(
                          "text-sm font-medium",
                          isGR ? "text-neutral-400" : "text-gray-600 dark:text-gray-400",
                        )}
                      >
                        Search Results
                      </h5>
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                          {searchResults.map((v) => (
                            <CarouselItem key={v.name} className="pl-4" style={{ flexBasis: "66.6667%" }}>
                              <Link
                                to={`/vehicle/${encodeURIComponent((v.name ?? "").toLowerCase().replace(/\s+/g, "-"))}`}
                                onClick={navigationState.resetNavigation}
                                className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EB0A1E] rounded-xl"
                                aria-label={`View ${v.name}`}
                              >
                                {isGR ? (
                                  <div
                                    className="h-24 overflow-hidden rounded-2xl border"
                                    style={{ ...carbonMatte, borderColor: GR_EDGE }}
                                  >
                                    <div className="flex items-center h-full p-4">
                                      <div
                                        className="w-16 h-12 rounded-lg mr-3 flex-shrink-0 overflow-hidden"
                                        style={carbonMatte}
                                      >
                                        {v.image && (
                                          <img
                                            src={v.image}
                                            alt={v.name}
                                            className="w-full h-full object-cover rounded-lg mix-blend-screen opacity-90"
                                            loading="lazy"
                                            decoding="async"
                                          />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm truncate" style={{ color: GR_TEXT }}>
                                          {v.name}
                                        </h3>
                                        <p className="text-xs" style={{ color: GR_MUTED }}>
                                          AED {fmt.format(v.price)}
                                        </p>
                                      </div>
                                      <ChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                                    </div>
                                  </div>
                                ) : (
                                  <Card className="h-24 overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardContent className="flex items-center h-full p-4">
                                      <div className="w-16 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg mr-3 flex-shrink-0">
                                        {v.image && (
                                          <img
                                            src={v.image}
                                            alt={v.name}
                                            className="w-full h-full object-cover rounded-lg"
                                            loading="lazy"
                                            decoding="async"
                                          />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                          {v.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          AED {fmt.format(v.price)}
                                        </p>
                                      </div>
                                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    </CardContent>
                                  </Card>
                                )}
                              </Link>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h5
                        className={cn(
                          "text-sm font-medium",
                          isGR ? "text-neutral-400" : "text-gray-600 dark:text-gray-400",
                        )}
                      >
                        Popular Searches
                      </h5>
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                          {searchSuggestions.map((s) => (
                            <CarouselItem key={s.term} className="pl-3" style={{ flexBasis: "auto" }}>
                              <button
                                type="button"
                                onClick={() => setSearchQuery(s.term)}
                                className={cn(
                                  "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
                                  isGR
                                    ? "border border-neutral-800 bg-neutral-950 text-neutral-100 hover:bg-neutral-900"
                                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
                                )}
                                aria-label={`Search ${s.term}`}
                              >
                                {s.icon}
                                <span className="text-sm">{s.term}</span>
                              </button>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  )}
                </motion.div>
              )}

              {navigationState.activeSection === "pre-owned" && (
                <motion.div
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4
                    className={cn(
                      "text-lg font-semibold mb-4",
                      isGR ? "text-neutral-200" : "text-gray-800 dark:text-gray-200",
                    )}
                  >
                    Pre-Owned Vehicles
                  </h4>

                  <div className="mb-6">
                    <Carousel opts={{ align: "start" }} className="w-full">
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="pl-3" style={{ flexBasis: "auto" }}>
                            <motion.button
                              type="button"
                              onClick={() => handleCategoryClick(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl transition-all min-w-[80px]",
                                selectedCategory === category.id
                                  ? isGR
                                    ? "shadow-[0_0_0_1px_rgba(235,10,30,.5)]"
                                    : "text-white shadow-lg scale-105"
                                  : isGR
                                    ? "hover:bg-[#121416]"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700",
                              )}
                              style={
                                isGR
                                  ? {
                                      ...carbonMatte,
                                      color: selectedCategory === category.id ? GR_TEXT : GR_MUTED,
                                      border: `1px solid ${GR_EDGE}`,
                                    }
                                  : selectedCategory === category.id
                                    ? { background: "linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%)" }
                                    : undefined
                              }
                              whileHover={{ scale: reduceMotion ? 1 : 1.05 }}
                              whileTap={{ scale: reduceMotion ? 1 : 0.95 }}
                              aria-pressed={selectedCategory === category.id}
                              aria-label={`Filter ${category.name}`}
                            >
                              <span className="mb-2">{category.icon}</span>
                              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                            </motion.button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  <div
                    className={cn("mb-6 p-4 rounded-xl", isGR ? "border" : "bg-gray-50 dark:bg-gray-800")}
                    style={isGR ? { ...carbonMatte, borderColor: GR_EDGE } : undefined}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5
                        className={cn(
                          "text-sm font-medium",
                          isGR ? "text-neutral-200" : "text-gray-700 dark:text-gray-300",
                        )}
                      >
                        Price Range
                      </h5>
                      <span className={cn("text-sm", isGR ? "text-neutral-400" : "text-gray-500 dark:text-gray-400")}>
                        AED {fmt.format(priceRange[0])} - AED {fmt.format(priceRange[1])}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sliders className="h-5 w-5" style={{ color: isGR ? GR_RED : "#CC0000" }} />
                      <label className="sr-only" htmlFor="minPrice">
                        Minimum price
                      </label>
                      <input
                        id="minPrice"
                        type="range"
                        min={30000}
                        max={300000}
                        step={10000}
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Math.min(parseInt(e.target.value, 10), priceRange[1]), priceRange[1]])
                        }
                        className={cn(
                          "flex-1 h-2 rounded-lg appearance-none cursor-pointer",
                          isGR ? "bg-neutral-800" : "bg-gray-200",
                        )}
                        aria-label="Minimum price"
                      />
                      <label className="sr-only" htmlFor="maxPrice">
                        Maximum price
                      </label>
                      <input
                        id="maxPrice"
                        type="range"
                        min={30000}
                        max={300000}
                        step={10000}
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Math.max(parseInt(e.target.value, 10), priceRange[0])])
                        }
                        className={cn(
                          "flex-1 h-2 rounded-lg appearance-none cursor-pointer",
                          isGR ? "bg-neutral-800" : "bg-gray-200",
                        )}
                        aria-label="Maximum price"
                      />
                    </div>
                  </div>

                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                      {filteredPreOwnedVehicles.map((v) => (
                        <CarouselItem key={v.name} className="pl-4" style={{ flexBasis: "66.6667%" }}>
                          <Link
                            to={`/pre-owned/${encodeURIComponent((v.name ?? "").toLowerCase().replace(/\s+/g, "-"))}`}
                            onClick={navigationState.resetNavigation}
                            aria-label={`View ${v.name}`}
                            className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-700 rounded-xl"
                          >
                            <motion.div
                              whileHover={{ scale: reduceMotion ? 1 : 1.02 }}
                              whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                            >
                              {isGR ? (
                                <div
                                  className="overflow-hidden rounded-2xl border"
                                  style={{ ...carbonMatte, borderColor: GR_EDGE }}
                                >
                                  <div className="aspect-[16/10] w-full relative" style={carbonMatte}>
                                    <img
                                      src={v.image}
                                      alt={v.name}
                                      className="w-full h-full object-cover mix-blend-screen opacity-90"
                                      loading="lazy"
                                      decoding="async"
                                      sizes="(max-width: 640px) 66vw, (max-width: 768px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <span
                                        className="text-white px-2 py-1 rounded-full text-xs font-medium shadow-md"
                                        style={{ backgroundColor: "#1a1c1f", border: `1px solid ${GR_EDGE}` }}
                                      >
                                        {v.year}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="p-4">
                                    <h3 className="font-semibold text-base mb-1" style={{ color: GR_TEXT }}>
                                      {v.name}
                                    </h3>
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="text-sm font-bold" style={{ color: GR_RED }}>
                                        AED {fmt.format(v.price)}
                                      </p>
                                      <p className="text-xs" style={{ color: GR_MUTED }}>
                                        {v.mileage}
                                      </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span
                                        className="text-xs px-2 py-1 rounded-full font-medium"
                                        style={{
                                          backgroundColor: "#15171A",
                                          border: `1px solid ${GR_EDGE}`,
                                          color: GR_MUTED,
                                        }}
                                      >
                                        Certified Pre-Owned
                                      </span>
                                      <span
                                        className="text-sm font-semibold flex items-center"
                                        style={{ color: GR_RED }}
                                      >
                                        View <ChevronRight className="h-3 w-3 ml-1" />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative">
                                    <img
                                      src={v.image}
                                      alt={v.name}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      decoding="async"
                                      sizes="(max-width: 640px) 66vw, (max-width: 768px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <span className="bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                                        {v.year}
                                      </span>
                                    </div>
                                  </div>
                                  <CardContent className="p-4">
                                    <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-gray-100">
                                      {v.name}
                                    </h3>
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                        AED {fmt.format(v.price)}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{v.mileage}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full font-medium">
                                        Certified Pre-Owned
                                      </span>
                                      <span className="text-gray-900 dark:text-gray-100 text-sm font-semibold flex items-center">
                                        View <ChevronRight className="h-3 w-3 ml-1" />
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </motion.div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="mt-6 text-center">
                    <Link
                      to={`/pre-owned${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
                      className={cn(
                        "font-semibold flex items-center justify-center rounded-lg",
                        isGR
                          ? "text-red-400 hover:text-red-300"
                          : "text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300",
                      )}
                      onClick={navigationState.resetNavigation}
                    >
                      View All Pre-Owned{" "}
                      {selectedCategory !== "all" ? vehicleCategories.find((c) => c.id === selectedCategory)?.name : ""}{" "}
                      Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav (fixed height, no shrink) */}
      <motion.nav
        ref={navRef}
        className={cn("backdrop-blur-xl left-0 right-0 fixed")}
        style={{
          bottom: 0,
          zIndex: Z.stickyNav,
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reduceMotion ? { duration: 0.1 } : spring}
        aria-label="Bottom navigation"
      >
        <div
          className={cn("rounded-t-2xl")}
          style={{
            ...(isGR
              ? { ...carbonMatte, borderColor: GR_EDGE, boxShadow: "0 -12px 30px rgba(0,0,0,.45)" }
              : {
                  background: "linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)",
                  boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.12), 0 -2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(200, 200, 200, 0.3)",
                  borderBottom: "none",
                }),
            // Compact, safe-area aware bar
            paddingBottom: "calc(4px + env(safe-area-inset-bottom))",
            paddingTop: "0px",
          }}
        >
          <div
            className={cn(
              "grid items-center",
              vehicle ? "grid-cols-5" : "grid-cols-4",
              "gap-1 px-2 sm:gap-1.5 sm:px-3 md:gap-2 md:px-4",
            )}
            style={{ minHeight: "48px" }}
          >
            <NavItem
              asButton
              icon={<Car className={cn(isGR ? "text-neutral-100" : "text-red-600", "h-4 w-4")} />}
              label="Models"
              onClick={() => handleSectionToggle("models")}
              isActive={activeItem === "models" || navigationState.activeSection === "models"}
              grMode={isGR}
              deviceCategory={deviceInfo.deviceCategory}
            />
            <NavItem
              asButton
              icon={<ShoppingBag className={cn(isGR ? "text-neutral-100" : "text-gray-900", "h-4 w-4")} />}
              label="Pre-Owned"
              onClick={() => handleSectionToggle("pre-owned")}
              isActive={activeItem === "pre-owned" || navigationState.activeSection === "pre-owned"}
              grMode={isGR}
              deviceCategory={deviceInfo.deviceCategory}
            />

            {vehicle && (
              <div className="relative">
                {/* Coachmark bubble */}
                <AnimatePresence>
                  {showCoachmark && !navigationState.isActionsExpanded && (
                    <motion.div
                      className={cn(
                        "absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
                        isGR
                          ? "bg-[#16181A] text-neutral-100 border border-[#212428]"
                          : "bg-white text-gray-900 border border-gray-200",
                      )}
                      variants={coachVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      Try Actions
                      <div
                        className={cn(
                          "absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8",
                          isGR
                            ? "border-t-[#16181A] border-l-transparent border-r-transparent"
                            : "border-t-white border-l-transparent border-r-transparent",
                        )}
                        aria-hidden="true"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <NavItem
                  asButton
                  icon={
                    <motion.div
                      className="relative"
                      variants={attractVariants}
                      animate={attractOn ? "attract" : "rest"}
                    >
                      {/* soft pulse halo */}
                      <AnimatePresence>
                        {attractOn && !reduceMotion && (
                          <motion.span
                            className="absolute inset-0 rounded-full"
                            variants={pulseVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            style={{
                              background: "radial-gradient(closest-side, rgba(235,10,30,.25), rgba(235,10,30,0))",
                            }}
                            aria-hidden="true"
                          />
                        )}
                      </AnimatePresence>
                      <div
                        className={cn("flex items-center justify-center rounded-full")}
                        style={{
                          width: 36,
                          height: 36,
                          background: "linear-gradient(145deg, #ff1a1a 0%, #cc0000 100%)",
                          boxShadow:
                            "0 6px 20px rgba(235, 10, 30, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <Bolt className="text-white w-4 h-4" />
                      </div>
                    </motion.div>
                  }
                  ariaLabel="Quick actions"
                  onClick={() => {
                    navigationState.setActionsExpanded(!navigationState.isActionsExpanded);
                    if (!navigationState.isActionsExpanded) {
                      setAttractOn(false);
                      setShowCoachmark(false);
                    }
                  }}
                  isActive={navigationState.isActionsExpanded}
                  grMode={isGR}
                  deviceCategory={deviceInfo.deviceCategory}
                />
              </div>
            )}

            <NavItem
              asButton
              icon={<Search className={cn(isGR ? "text-neutral-100" : "text-gray-900", "h-4 w-4")} />}
              label="Search"
              onClick={() => handleSectionToggle("search")}
              isActive={activeItem === "search" || navigationState.activeSection === "search"}
              grMode={isGR}
              deviceCategory={deviceInfo.deviceCategory}
            />
            <NavItem
              asButton
              icon={<Menu className={cn(isGR ? "text-red-400" : "text-gray-900", "h-4 w-4")} />}
              label="Menu"
              onClick={toggleMenu}
              isActive={navigationState.isMenuOpen}
              grMode={isGR}
              deviceCategory={deviceInfo.deviceCategory}
            />
          </div>
        </div>
      </motion.nav>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label?: string;
  to?: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: number;
  grMode?: boolean;
  deviceCategory?: string;
  asButton?: boolean;
  ariaLabel?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label = "",
  to = "#",
  isActive = false,
  onClick,
  badge,
  grMode = false,
  deviceCategory = "standardMobile",
  asButton = false,
  ariaLabel,
}) => {
  // Fixed compact sizes (no shrink-on-scroll)
  const itemMinHeight = deviceCategory === "smallMobile" ? 44 : deviceCategory === "standardMobile" ? 46 : 48;
  const iconBox = deviceCategory === "smallMobile" ? 26 : 28;

  const content = (
    <>
      <div className="flex flex-col items-center justify-center relative w-full" style={{ minHeight: itemMinHeight }}>
        <motion.div
          className={cn(
            "rounded-xl relative flex items-center justify-center",
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EB0A1E]",
            isActive
              ? grMode
                ? "bg-[#141618] text-[#E6E7E9] shadow-[inset_0_0_0_1px_#17191B]"
                : "text-gray-900 bg-gray-100 dark:bg-gray-800"
              : grMode
                ? "text-[#E6E7E9] bg-[#101214] hover:bg-[#121416] shadow-[inset_0_0_0_1px_#17191B]"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300",
          )}
          style={{ minWidth: iconBox, minHeight: iconBox, padding: 6 }}
          whileHover={{ scale: isActive ? 1.05 : 1.03 }}
          whileTap={{ scale: 0.95 }}
          aria-current={isActive ? "page" : undefined}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: cn("transition-transform", "w-4 h-4"),
          })}
          {typeof badge === "number" && (
            <motion.div
              className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              style={{
                background: grMode ? "#1F2124" : "linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%)",
                border: grMode ? `1px solid ${GR_EDGE}` : undefined,
              }}
            >
              {badge > 9 ? "9+" : badge}
            </motion.div>
          )}
        </motion.div>

        {label && (
          <span
            className={cn(
              "text-center font-medium leading-tight",
              grMode ? (isActive ? "text-red-300" : "text-neutral-300") : "text-gray-900",
              "text-[10px] mt-0.5",
            )}
          >
            {label}
          </span>
        )}
      </div>
    </>
  );

  if (asButton) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="relative flex items-center justify-center px-1 py-1 rounded-lg"
        style={{ WebkitTapHighlightColor: "transparent", minHeight: itemMinHeight, minWidth: 44 }}
        aria-label={ariaLabel || label || undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className="relative flex items-center justify-center px-1 py-1 rounded-lg"
      style={{ WebkitTapHighlightColor: "transparent", minHeight: itemMinHeight, minWidth: 44 }}
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel || label || undefined}
    >
      {content}
    </Link>
  );
};

export default MobileStickyNav;
