// src/components/vehicle-details/VehicleConfiguration.tsx
import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleModel } from "@/types/vehicle";
import { Check, Zap, Fuel, Settings, ArrowUpDown, Star, Car, Wrench, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOptimizedDeviceInfo } from "@/hooks/use-optimized-device-info";
import { contextualHaptic } from "@/utils/haptic";
import { createAdaptiveVariants, createAdaptiveMicroAnimations } from "@/utils/adaptive-animations";
import { usePerformanceConfig } from "@/utils/performance-optimization";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";
import LuxuryComparisonTool from "@/components/comparison/LuxuryComparisonTool";

interface VehicleConfigurationProps {
  vehicle: VehicleModel;
  onCarBuilder?: (grade?: string) => void;
  onTestDrive?: () => void;
  onGradeSelect?: (grade: string) => void;
}

const VehicleConfiguration: React.FC<VehicleConfigurationProps> = ({
  vehicle,
  onCarBuilder,
  onTestDrive,
  onGradeSelect,
}) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isGradeLoading, setIsGradeLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [compareSet, setCompareSet] = useState<number[]>([]);

  const isMobile = useIsMobile();
  const { isMobile: deviceIsMobile } = useOptimizedDeviceInfo();
  const prefersReducedMotion = useReducedMotion();
  const performanceConfig = usePerformanceConfig();
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.1 });

  const adaptiveVariants = useMemo(
    () =>
      createAdaptiveVariants({
        isMobile: deviceIsMobile,
        isSlowScroll: false,
        prefersReducedMotion: prefersReducedMotion || false,
      }),
    [deviceIsMobile, prefersReducedMotion]
  );

  const microAnimations = useMemo(
    () =>
      createAdaptiveMicroAnimations({
        isMobile: deviceIsMobile,
        isSlowScroll: false,
        prefersReducedMotion: prefersReducedMotion || false,
      }),
    [deviceIsMobile, prefersReducedMotion]
  );

  const engines = useMemo(
    () => [
      {
        name: "2.5L Hybrid",
        description: "Advanced hybrid powertrain with seamless electric assist",
        shortDescription: "Hybrid efficiency",
        power: "218 HP",
        efficiency: "25.2 km/L",
        icon: <Zap className="h-6 w-6" />,
        selected: selectedEngine === "2.5L Hybrid",
      },
      {
        name: "3.5L V6",
        description: "Powerful V6 engine for enhanced performance",
        shortDescription: "V6 performance",
        power: "301 HP",
        efficiency: "18.4 km/L",
        icon: <Fuel className="h-6 w-6" />,
        selected: selectedEngine === "3.5L V6",
      },
    ],
    [selectedEngine]
  );

  const grades = useMemo(() => {
    const baseGrades =
      selectedEngine === "2.5L Hybrid"
        ? [
            {
              name: "Hybrid SE",
              description: "Sport-enhanced hybrid driving experience",
              price: 94900,
              monthlyFrom: 945,
              badge: "Balanced Choice",
              badgeColor: "bg-yellow-500",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
              features: ["Hybrid Drive Modes", "18\" Alloy Wheels", "Sport Seats", "Enhanced Audio"],
              specs: {
                engine: "2.5L Hybrid",
                power: "218 HP",
                torque: "221 Nm",
                transmission: "eCVT",
                acceleration: "8.7 s",
                fuelEconomy: "25.2 km/L",
              },
            },
            {
              name: "Hybrid XLE",
              description: "Premium hybrid with advanced features",
              price: 105900,
              monthlyFrom: 1059,
              badge: "Most Popular",
              badgeColor: "bg-primary",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
              features: ["Leather Interior", "Wireless Charging", "Panoramic Moonroof", "Premium Audio"],
              specs: {
                engine: "2.5L Hybrid",
                power: "218 HP",
                torque: "221 Nm",
                transmission: "eCVT",
                acceleration: "8.7 s",
                fuelEconomy: "25.2 km/L",
              },
            },
            {
              name: "Hybrid Limited",
              description: "Top-tier luxury hybrid experience",
              price: 118900,
              monthlyFrom: 1189,
              badge: "Premium",
              badgeColor: "bg-gray-800",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
              features: ["Ventilated Seats", "Head-up Display", "Advanced Safety", "JBL Premium Audio"],
              specs: {
                engine: "2.5L Hybrid",
                power: "218 HP",
                torque: "221 Nm",
                transmission: "eCVT",
                acceleration: "8.7 s",
                fuelEconomy: "25.2 km/L",
              },
            },
          ]
        : [
            {
              name: "V6 SE",
              description: "Sport-enhanced V6 performance",
              price: 99900,
              monthlyFrom: 999,
              badge: "Performance",
              badgeColor: "bg-red-500",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
              features: ["V6 Power", "19\" Alloy Wheels", "Sport Suspension", "Performance Tires"],
              specs: {
                engine: "3.5L V6",
                power: "301 HP",
                torque: "362 Nm",
                transmission: "8-Speed Auto",
                acceleration: "6.6 s",
                fuelEconomy: "18.4 km/L",
              },
            },
            {
              name: "V6 XLE",
              description: "Premium V6 with luxury features",
              price: 110900,
              monthlyFrom: 1109,
              badge: "Most Popular",
              badgeColor: "bg-primary",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
              features: ["Leather Interior", "Performance Brakes", "Panoramic Moonroof", "Premium Sound"],
              specs: {
                engine: "3.5L V6",
                power: "301 HP",
                torque: "362 Nm",
                transmission: "8-Speed Auto",
                acceleration: "6.6 s",
                fuelEconomy: "18.4 km/L",
              },
            },
            {
              name: "V6 Limited",
              description: "Ultimate V6 luxury experience",
              price: 123900,
              monthlyFrom: 1239,
              badge: "Premium",
              badgeColor: "bg-gray-800",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
              features: ["Ventilated Seats", "Head-up Display", "Advanced Safety", "JBL Premium Audio"],
              specs: {
                engine: "3.5L V6",
                power: "301 HP",
                torque: "362 Nm",
                transmission: "8-Speed Auto",
                acceleration: "6.6 s",
                fuelEconomy: "18.4 km/L",
              },
            },
          ];
    return baseGrades;
  }, [selectedEngine]);

  const currentGrade = useMemo(() => {
    if (!grades || grades.length === 0) return null;
    const validIndex = Math.max(0, Math.min(selectedGrade, grades.length - 1));
    return grades[validIndex] || grades[0] || null;
  }, [grades, selectedGrade]);

  const handleEngineChange = useCallback(
  async (engineName: string) => {
    if (engineName === selectedEngine) return;
    setIsGradeLoading(true);
    setSelectedEngine(engineName);
    setSelectedGrade(0);
    setCompareSet([]); // reset on engine switch
    setAnimationKey((prev) => prev + 1);
    await new Promise((r) => setTimeout(r, performanceConfig.animations.duration * 1000));
    setIsGradeLoading(false);
    contextualHaptic.selectionChange();
  },
  [selectedEngine, performanceConfig.animations.duration]
);

  const handleGradeChange = useCallback(
    (gradeIndex: number) => {
      const safeIndex = Math.max(0, Math.min(gradeIndex, grades.length - 1));
      if (safeIndex !== selectedGrade) {
        setSelectedGrade(safeIndex);
        contextualHaptic.selectionChange();
      }
    },
    [grades.length, selectedGrade]
  );

  const handleConfigureGrade = useCallback(
    (grade?: any) => {
      const gradeToUse = grade || currentGrade;
      if (!gradeToUse) return;
      onCarBuilder?.(gradeToUse.name);
      contextualHaptic.buttonPress();
    },
    [currentGrade, onCarBuilder]
  );

  const handleTestDriveGrade = useCallback(
    (_grade?: any) => {
      onTestDrive?.();
      contextualHaptic.buttonPress();
    },
    [onTestDrive]
  );

  const handleCompareGrades = useCallback(() => {
    setIsCompareOpen(true);
    contextualHaptic.buttonPress();
  }, []);

  const toggleCompare = useCallback((idx: number) => {
    setCompareSet((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : prev.length < 3 ? [...prev, idx] : prev
    );
    contextualHaptic.selectionChange();
  }, []);

  const removeFromCompare = useCallback((idx: number) => {
    setCompareSet((prev) => prev.filter((i) => i !== idx));
    contextualHaptic.selectionChange();
  }, []);

  const clearCompare = useCallback(() => {
    setCompareSet([]);
    contextualHaptic.selectionChange();
  }, []);

  const renderGradesSkeleton = useCallback(
    () => (
      <div className={isMobile ? "px-4" : "grid lg:grid-cols-3 gap-6 px-4 lg:px-0"}>
        {Array.from({ length: isMobile ? 1 : 3 }).map((_, index) => (
          <Card key={index} className="h-full">
            <CardContent className="p-0">
              <Skeleton className="w-full h-56 rounded-t-lg" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    [isMobile]
  );

  if (!isIntersecting && typeof window !== "undefined") {
    return <div ref={targetRef} className="h-96" />;
  }

  return (
    <>
      <section ref={targetRef} className="py-8 lg:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="toyota-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 lg:mb-12"
            variants={adaptiveVariants.fadeInUp}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-2 rounded-full text-sm font-medium mb-4 lg:mb-6">
              <Settings className="h-4 w-4 mr-2" />
              Interactive Experience
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-black text-foreground mb-3 lg:mb-4 leading-tight">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Configuration
              </span>
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Pick a powertrain and explore trims. Clean tiles, quick comparison, faster decisions.
            </p>
          </motion.div>

          {/* Engine selection */}
          {/* Engine selection */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="mb-8 lg:mb-12"
  variants={adaptiveVariants.fadeInUp}
>
  <div className="flex items-center justify-between mb-6 lg:mb-8 px-4 lg:px-0">
    <h3 className="text-lg sm:text-xl lg:text-3xl font-bold">Step 1: Choose Your Powertrain</h3>
  </div>

  {/* Mobile: compact 2-up tiles */}
  {isMobile ? (
    <div className="grid grid-cols-2 gap-2 px-4 max-w-4xl mx-auto">
      {engines.map((engine) => {
        const selected = engine.selected;
        return (
          <motion.button
            key={engine.name}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleEngineChange(engine.name)}
            className={[
              "group relative rounded-xl border text-left transition-all",
              "p-3 min-h-0 h-auto",
              selected ? "border-primary ring-2 ring-primary/60 shadow-sm" : "border-border hover:border-primary/50",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  "inline-flex shrink-0 items-center justify-center rounded-full",
                  "h-7 w-7",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {React.cloneElement(engine.icon, { className: "h-3.5 w-3.5" })}
              </span>

              <div className="min-w-0">
                <div className="text-xs font-bold truncate">
                  {engine.name.replace("L ", "")}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {engine.power} • {engine.efficiency}
                </div>
              </div>

              {/* Tick on select */}
              {selected && (
                <span className="ml-auto inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  ) : (
    /* Desktop / tablet stays as-is */
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {engines.map((engine) => (
        <motion.div
          key={engine.name}
          whileHover={performanceConfig.animations.enabled ? microAnimations.buttonHover : undefined}
          whileTap={{ scale: 0.98 }}
          className={`relative cursor-pointer transition-all duration-200 ${
            engine.selected ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleEngineChange(engine.name)}
        >
          <Card className={`h-full ${engine.selected ? "border-primary shadow-lg" : "border-border hover:border-primary/50"}`}>
            <CardContent className="px-6 py-4">
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    engine.selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {React.cloneElement(engine.icon, { className: "h-6 w-6" })}
                </div>
                <AnimatePresence>
                  {engine.selected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: performanceConfig.animations.duration }}
                      className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <h4 className="text-lg lg:text-xl font-bold mb-1">{engine.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{engine.description}</p>

              <div className="flex justify-between text-sm">
                <div>
                  <div className="font-semibold">{engine.power}</div>
                  <div className="text-muted-foreground text-xs">POWER</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{engine.efficiency}</div>
                  <div className="text-muted-foreground text-xs">EFFICIENCY</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )}
</motion.div>

          {/* Grade selection */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 lg:mb-12" variants={adaptiveVariants.fadeInUp}>
            <div className="flex items-center justify-between mb-6 lg:mb-8 px-4 lg:px-0">
              <h3 className="text-lg sm:text-xl lg:text-3xl font-bold">Step 2: Choose Your Grade</h3>
              <Button variant="outline" className="gap-2 min-h-[44px]" onClick={handleCompareGrades} disabled={grades.length === 0}>
                <ArrowUpDown className="h-4 w-4" />
                {isMobile ? "Compare" : "Compare Grades"}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {isGradeLoading ? (
                <motion.div key={`loading-${animationKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: performanceConfig.animations.duration }}>
                  {renderGradesSkeleton()}
                </motion.div>
              ) : (
                <motion.div key={`grades-${animationKey}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: performanceConfig.animations.duration * 1.5 }}>
                  {/* Desktop grid */}
                  {!isMobile && (
                    <motion.div variants={adaptiveVariants.staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid lg:grid-cols-3 gap-6 px-4 lg:px-0">
                      {grades.map((grade, index) => {
                        const selected = index === selectedGrade;
                        const isCompared = compareSet.includes(index);
                        return (
                          <motion.div
                            key={`${grade.name}-${animationKey}`}
                            variants={adaptiveVariants.fadeInScale}
                            whileHover={performanceConfig.animations.enabled ? microAnimations.luxuryHover : undefined}
                            className={`cursor-pointer transition-all duration-200 ${selected ? "ring-2 ring-primary" : ""}`}
                            onClick={() => setSelectedGrade(index)}
                          >
                            <Card className={`h-full ${selected ? "border-primary shadow-lg" : "border-border hover:border-primary/50"}`}>
                              <CardContent className="p-0">
                                <div className="relative overflow-hidden">
                                  {grade.badge && (
                                    <Badge className={`absolute top-4 left-4 z-10 ${grade.badgeColor} text-white px-3 py-1 text-sm font-medium`}>{grade.badge}</Badge>
                                  )}
                                  <button
                                    aria-pressed={isCompared}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCompare(index);
                                    }}
                                    className={`absolute top-4 right-4 z-10 rounded-full px-3 h-8 text-xs border ${isCompared ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 border-border"}`}
                                  >
                                    {isCompared ? "Added" : "Add to compare"}
                                  </button>
                                  <motion.img
                                    whileHover={performanceConfig.animations.enabled ? { scale: 1.05 } : undefined}
                                    transition={{ duration: performanceConfig.animations.duration }}
                                    src={grade.image}
                                    alt={grade.name}
                                    className="w-full h-56 object-cover rounded-t-lg"
                                    loading="lazy"
                                  />
                                </div>

                                <div className="p-6 space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                        <h4 className="text-xl font-bold">{grade.name}</h4>
                                      </div>
                                      <div className="text-sm text-muted-foreground">{grade?.specs?.engine}</div>
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="text-2xl font-black">AED {grade.price.toLocaleString()}</div>
                                  </div>

                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {grade.features.slice(0, 2).map((f) => (
                                      <li key={f} className="flex gap-2 items-center">
                                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                          <Check className="h-2 w-2 text-primary-foreground" />
                                        </div>
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      className="flex-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleConfigureGrade(grade);
                                      }}
                                    >
                                      Build & Price
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTestDriveGrade(grade);
                                      }}
                                    >
                                      Test Drive
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Mobile: simple snap carousel */}
                  {isMobile && (
                    <div className="px-4">
                      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {grades.map((grade, index) => {
                          const isCompared = compareSet.includes(index);
                          const selected = index === selectedGrade;
                          return (
                            <div key={`${grade.name}-${animationKey}`} className="snap-center shrink-0 w-[85%]" onClick={() => setSelectedGrade(index)}>
                              <Card className={`${selected ? "border-primary shadow-lg" : "border-border"}`}>
                                <CardContent className="p-0">
                                  <div className="relative">
                                    {grade.badge && (
                                      <Badge className={`absolute top-3 left-3 z-10 ${grade.badgeColor} text-white px-2 py-0.5 text-[10px]`}>{grade.badge}</Badge>
                                    )}
                                    <button
                                      aria-pressed={isCompared}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCompare(index);
                                      }}
                                      className={`absolute top-3 right-3 z-10 rounded-full px-2 h-7 text-[11px] border ${isCompared ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 border-border"}`}
                                    >
                                      {isCompared ? "Added" : "Compare"}
                                    </button>

                                    <img src={grade.image} alt={grade.name} className="w-full h-44 object-cover rounded-t-lg" loading="lazy" />
                                  </div>

                                  <div className="p-4 space-y-3">
                                    <div>
                                      <h4 className="text-base font-bold">{grade.name}</h4>
                                      <div className="text-xs text-muted-foreground">{grade?.specs?.engine}</div>
                                    </div>

                                    <div className="text-xl font-extrabold">AED {grade.price.toLocaleString()}</div>

                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      {grade.features.slice(0, 2).map((f) => (
                                        <li key={f} className="flex gap-2 items-center">
                                          <div className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                                            <Check className="h-2 w-2 text-primary-foreground" />
                                          </div>
                                          <span>{f}</span>
                                        </li>
                                      ))}
                                    </ul>

                                    <div className="grid grid-cols-2 gap-2">
                                      <Button
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleConfigureGrade(grade);
                                        }}
                                      >
                                        Build & Price
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTestDriveGrade(grade);
                                        }}
                                      >
                                        Test Drive
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Desktop sticky compare bar */}
      {!isMobile && compareSet.length > 1 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="mx-auto max-w-6xl rounded-2xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium mr-1">{compareSet.length} grades selected</span>
              {compareSet.map((i) => (
                <span key={`${grades[i]?.name}-${i}`} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted">
                  {grades[i]?.name ?? `Grade ${i + 1}`}
                  <button aria-label="Remove" onClick={() => removeFromCompare(i)} className="ml-1 rounded p-0.5 hover:bg-background">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearCompare}>
                  Clear
                </Button>
                <Button size="sm" onClick={() => setIsCompareOpen(true)} disabled={compareSet.length < 2}>
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB compare button (safe-area aware) */}
      {isMobile && compareSet.length > 1 && (
        <div
          className="fixed z-50 right-4"
          style={{
            bottom: "max(16px, env(safe-area-inset-bottom))",
          }}
        >
          <Button
            onClick={() => setIsCompareOpen(true)}
            className="rounded-full shadow-lg h-12 px-5"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Compare ({compareSet.length})
          </Button>
        </div>
      )}

      {/* Compare Modal */}
      <LuxuryComparisonTool
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        grades={grades.map((g, i) => ({
          id: `${g.name}-${i}`,
          highlights: Array.isArray(g.features) ? g.features.slice(0, 3) : [],
          badgeColor: (g as any).badgeColor ?? 'bg-primary',
          ...g,
        }))}
        onTestDrive={() => onTestDrive?.()}
        onGetQuote={(gradeId) => onCarBuilder?.(gradeId)}
      />
    </>
  );
};

export default VehicleConfiguration;
