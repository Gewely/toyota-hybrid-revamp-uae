import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

const TOYOTA_RED = "#CC0000";
const TOYOTA_GRADIENT = "linear-gradient(90deg, #EB0A1E, #CC0000, #8B0000)";
const GR_RED = "#EB0A1E";
const GR_SURFACE = "#0B0B0C";
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
  "bg-gradient-to-b from-[#EB0A1E] to-[#B10D19] text-white shadow-[0_6px_18px_rgba(235,10,30,.25)] hover:from-[#FF2A3C] hover:to-[#D21320] focus-visible:ring-2 focus-visible:ring-red-600";
const GR_BTN_SURFACE =
  "bg-[#111315] border border-[#17191B] text-[#E6E7E9] hover:bg-[#141618] focus-visible:ring-2 focus-visible:ring-red-700";

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
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 200000]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isGR, toggleGR } = useGRMode();
  const [userTouchedCategory, setUserTouchedCategory] = useState(false);

  const shouldShowNav =
    deviceInfo.isInitialized && (deviceInfo.isMobile || (typeof window !== "undefined" && window.innerWidth <= 500));

  useEffect(() => {
    if (shouldShowNav) {
      document.body.classList.add("has-mobile-nav");
    }
    return () => {
      document.body.classList.remove("has-mobile-nav");
    };
  }, [shouldShowNav]);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (isGR && !userTouchedCategory) setSelectedCategory("performance");
  }, [isGR, userTouchedCategory]);

  const fmt = useMemo(() => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"), []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const threshold = 100;
      setIsScrolled(y > threshold);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((v) => selectedCategory === "all" || v.category.toLowerCase() === selectedCategory).slice(0, 12),
    [selectedCategory],
  );

  const searchResults = useMemo(
    () => vehicles.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8),
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
    }
  }, [navigationState]);

  const getCardBasis = () => {
    switch (deviceInfo.deviceCategory) {
      case "smallMobile":
        return "basis-4/5";
      case "standardMobile":
        return "basis-2/3";
      case "largeMobile":
      case "extraLargeMobile":
      case "tablet":
        return "basis-1/2";
      default:
        return "basis-2/3";
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
    if (!vehicle) return;
    contextualHaptic.buttonPress();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this amazing ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "Vehicle link has been copied to clipboard." });
      }
    } catch {}
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

  const spring = isGR
    ? { type: "spring", stiffness: 420, damping: 28, mass: 0.7 }
    : { type: "spring", stiffness: 260, damping: 20 };

  const navRef = useRef<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);
  const initialHeightRef = useRef<number>(0);

  const updateNavMetrics = useCallback(() => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      const h = navRef.current?.getBoundingClientRect().height;
      if (h) document.documentElement.style.setProperty("--mobile-nav-height", `${Math.round(h)}px`);
      const vv = window.visualViewport;
      if (vv) {
        if (initialHeightRef.current === 0) initialHeightRef.current = vv.height;
        const currentHeight = vv.height;
        const heightDiff = initialHeightRef.current - currentHeight;
        const isKeyboardOpen = heightDiff > 120;
        if (isKeyboardOpen) {
          const keyboardOffset = Math.max(0, window.innerHeight - currentHeight - vv.offsetTop);
          document.documentElement.style.setProperty("--vv-bottom-offset", `${keyboardOffset}px`);
        } else {
          const offset = Math.max(0, vv.offsetTop);
          document.documentElement.style.setProperty("--vv-bottom-offset", `${offset}px`);
        }
        document.documentElement.style.setProperty("--vvh", `${currentHeight}px`);
      }
      rafId.current = null;
    });
  }, []);

  useEffect(() => {
    updateNavMetrics();
    let resizeObserver: ResizeObserver | null = null;
    if (navRef.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updateNavMetrics);
      resizeObserver.observe(navRef.current);
    }
    window.addEventListener("resize", updateNavMetrics, { passive: true });
    window.addEventListener("orientationchange", updateNavMetrics, { passive: true });
    const vv = window.visualViewport;
    vv?.addEventListener("resize", updateNavMetrics);
    vv?.addEventListener("scroll", updateNavMetrics);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateNavMetrics);
      window.removeEventListener("orientationchange", updateNavMetrics);
      vv?.removeEventListener("resize", updateNavMetrics);
      vv?.removeEventListener("scroll", updateNavMetrics);
    };
  }, [updateNavMetrics]);

  if (!shouldShowNav) return null;

  return (
    <motion.nav
      ref={navRef}
      className={cn("fixed left-0 right-0 z-[100]", "mobile-force-visible backdrop-blur-xl")}
      style={{
        bottom: "max(env(safe-area-inset-bottom), var(--vv-bottom-offset, 0px))",
        transform: "translateZ(0)",
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduceMotion ? { duration: 0.1 } : spring}
    >
      <div
        className={cn("rounded-t-2xl", "py-0.5 sm:py-1")}
        style={
          isGR
            ? { ...carbonMatte, borderColor: GR_EDGE, boxShadow: "0 -12px 30px rgba(0,0,0,.45)" }
            : {
                background: "linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)",
                boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.12), 0 -2px 8px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                borderBottom: "none",
              }
        }
      >
        <div
          className={cn(
            "grid items-center transition-all duration-500",
            vehicle ? "grid-cols-5" : "grid-cols-4",
            "gap-1 px-2 sm:gap-1.5 sm:px-3 md:gap-2 md:px-4",
          )}
        >
          <NavItem
            icon={<Car className={cn(isGR ? "text-neutral-100" : "text-red-600", "h-4 w-4")} />}
            label="Models"
            to="#"
            onClick={() => handleSectionToggle("models")}
            isActive={activeItem === "models" || navigationState.activeSection === "models"}
            isScrolled={isScrolled}
            grMode={isGR}
            deviceCategory={deviceInfo.deviceCategory}
          />
          <NavItem
            icon={<ShoppingBag className={cn(isGR ? "text-neutral-100" : "text-gray-900", "h-4 w-4")} />}
            label="Pre-Owned"
            to="#"
            onClick={() => handleSectionToggle("pre-owned")}
            isActive={activeItem === "pre-owned" || navigationState.activeSection === "pre-owned"}
            isScrolled={isScrolled}
            grMode={isGR}
            deviceCategory={deviceInfo.deviceCategory}
          />
          {vehicle && (
            <NavItem
              icon={
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-transform",
                    "w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11",
                  )}
                  style={{
                    background: "linear-gradient(145deg, #ff1a1a 0%, #cc0000 100%)",
                    boxShadow: "0 6px 20px rgba(235, 10, 30, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Bolt className="text-white w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </div>
              }
              label=""
              to="#"
              onClick={() => navigationState.setActionsExpanded(!navigationState.isActionsExpanded)}
              isActive={navigationState.isActionsExpanded}
              isScrolled={isScrolled}
              grMode={isGR}
              deviceCategory={deviceInfo.deviceCategory}
            />
          )}
          <NavItem
            icon={<Search className={cn(isGR ? "text-neutral-100" : "text-gray-900", "h-4 w-4")} />}
            label="Search"
            to="#"
            onClick={() => handleSectionToggle("search")}
            isActive={activeItem === "search" || navigationState.activeSection === "search"}
            isScrolled={isScrolled}
            grMode={isGR}
            deviceCategory={deviceInfo.deviceCategory}
          />
          <NavItem
            icon={<Menu className={cn(isGR ? "text-red-400" : "text-gray-900", "h-4 w-4")} />}
            label="Menu"
            to="#"
            onClick={toggleMenu}
            isActive={navigationState.isMenuOpen}
            isScrolled={isScrolled}
            grMode={isGR}
            deviceCategory={deviceInfo.deviceCategory}
          />
        </div>
      </div>
    </motion.nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: number;
  isScrolled?: boolean;
  grMode?: boolean;
  deviceCategory?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  to,
  isActive = false,
  onClick,
  badge,
  isScrolled = false,
  grMode = false,
  deviceCategory = "standardMobile",
}) => {
  const getNavItemHeight = () => {
    if (isScrolled) {
      switch (deviceCategory) {
        case "smallMobile":
          return "32px";
        case "standardMobile":
          return "36px";
        default:
          return "40px";
      }
    } else {
      switch (deviceCategory) {
        case "smallMobile":
          return "38px";
        case "standardMobile":
          return "42px";
        default:
          return "46px";
      }
    }
  };
  const content = (
    <div
      className="flex flex-col items-center justify-center relative w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ minHeight: getNavItemHeight() }}
    >
      <motion.div
        className={cn(
          "p-2 rounded-xl transition-all relative flex items-center justify-center",
          isActive
            ? grMode
              ? "bg-[#141618] text-[#E6E7E9] scale-110"
              : "text-gray-900 bg-gray-100 dark:bg-gray-800 scale-110"
            : grMode
              ? "text-[#E6E7E9] bg-[#101214] hover:bg-[#121416]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300",
        )}
        animate={{
          padding: isScrolled ? "6px" : "8px",
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: isActive ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-current={isActive ? "page" : undefined}
        style={{ WebkitTapHighlightColor: "transparent", minHeight: "44px", minWidth: "44px" }}
      >
        {icon}
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
      {!isScrolled && label && (
        <span
          className={cn(
            "text-center font-medium mt-0.5 leading-tight transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            grMode ? (isActive ? "text-red-300" : "text-neutral-300") : "text-gray-900",
            "text-[8px] sm:text-[9px] md:text-[10px]",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="relative flex items-center justify-center px-1 py-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          WebkitTapHighlightColor: "transparent",
          minHeight: getNavItemHeight(),
          minWidth: "44px",
        }}
      >
        {content}
      </button>
    );
  }
  return (
    <Link
      to={to}
      className="relative flex items-center justify-center px-1 py-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        WebkitTapHighlightColor: "transparent",
        minHeight: getNavItemHeight(),
        minWidth: "44px",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
};

export default MobileStickyNav;
