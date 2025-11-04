
import React, { useState, useCallback, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GradeComparisonModal from '@/components/vehicle-details/GradeComparisonModal';

import ToyotaLayout from "@/components/ToyotaLayout";
import ActionPanel from "@/components/vehicle-details/ActionPanel";
import MinimalistVideoHero from "@/components/vehicle-details/MinimalistVideoHero";
import EngineGradeSelection from "@/components/vehicle-details/EngineGradeSelection";
import VehicleModals from "@/components/vehicle-details/VehicleModals";
// import ModernSectionNavigation from "@/components/vehicle-details/ModernSectionNavigation"; // Removed
import { PageLoading, ComponentLoading } from "@/components/ui/enhanced-loading";
import { PerformanceErrorBoundary } from "@/components/ui/performance-error-boundary";
import { HeroSkeleton } from "@/components/ui/performance-skeleton";
import OffersSection from "@/components/home/OffersSection";
import VehicleGradeComparison from '@/components/vehicle-details/VehicleGradeComparison';
import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVehicleData } from "@/hooks/use-vehicle-data";
import { createLazyComponent } from "@/utils/lazy-components";
import { cn } from "@/lib/utils";
import { UnifiedPerformanceMonitor } from '@/components/ui/unified-performance-monitor';

import { SkipLinks } from '@/components/ui/enhanced-accessibility';
import { ProgressiveLoader } from '@/components/ui/enhanced-loading-states';
import { ModalProvider } from '@/contexts/ModalProvider';
import { ScrollProgressBar } from '@/components/animations/ScrollProgressBar';
import { SectionTransition } from '@/components/animations/SectionTransition';

// Lazy load heavy components with intelligent preloading
const CinematicRelatedVehicles = createLazyComponent(
  () => import("@/components/vehicle-details/CinematicRelatedVehicles")
);

const TechnologyShowcase = createLazyComponent(
  () => import("@/components/vehicle-details/TechnologyShowcase")
);

const StorytellingSection = createLazyComponent(
  () => import("@/components/vehicle-details/StorytellingSection")
);

const VehicleFAQ = createLazyComponent(
  () => import("@/components/vehicle-details/VehicleFAQ")
);

const PremiumMediaShowcase = createLazyComponent(
  () => import("@/components/vehicle-details/PremiumMediaShowcase")
);

const SeamlessCinematicShowroom = createLazyComponent(
  () => import("@/components/vehicle-details/SeamlessCinematicShowroom")
);

const VirtualShowroom = createLazyComponent(
  () => import("@/components/vehicle-details/PremiumVirtualShowroom")
);

const PreOwnedSimilar = createLazyComponent(
  () => import("@/components/vehicle-details/PreOwnedSimilar")
);

const SplitSystemADAS = createLazyComponent(
  () => import("@/components/vehicle-details/SplitSystemADAS")
);

const VehicleDetails = () => {
  // Modal states - memoized to prevent unnecessary re-renders
  const [modals, setModals] = useState({
    isBookingOpen: false,
    isFinanceOpen: false,
    isCarBuilderOpen: false,
    isOffersModalOpen: false,
    isGradeComparisonOpen: false
  });
  
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [carBuilderInitialGrade, setCarBuilderInitialGrade] = useState<string>();
  const [selectedGrade, setSelectedGrade] = useState<string>();

  // Hooks with performance optimizations
  const { personaData } = usePersona();
  const isMobile = useIsMobile();
  const { vehicle, galleryImages, monthlyEMI, navigate, isLoading, error } = useVehicleData();

  // Vehicle configuration is now handled by EngineGradeSelection component

  // Memoized modal handlers to prevent re-renders
  const modalHandlers = useMemo(() => ({
    updateModal: (key: string, value: boolean) => {
      setModals(prev => ({ ...prev, [key]: value }));
    },
    handleOfferClick: (offer: any) => {
      setSelectedOffer(offer);
      setModals(prev => ({ ...prev, isOffersModalOpen: true }));
    },
    handleConfigureWithGrade: (grade?: string) => {
      setCarBuilderInitialGrade(grade);
      setModals(prev => ({ ...prev, isCarBuilderOpen: true }));
    },
    handleGradeSelect: (grade: string) => {
      setSelectedGrade(grade);
      setCarBuilderInitialGrade(grade);
      setModals(prev => ({ ...prev, isCarBuilderOpen: true }));
    },
    handleGradeComparison: () => {
      setModals(prev => ({ ...prev, isGradeComparisonOpen: true }));
    }
  }), []);

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <ToyotaLayout>
        <div className="min-h-screen">
          <div className="h-screen bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="h-8 w-64 bg-muted rounded mx-auto animate-pulse" />
              <div className="h-4 w-48 bg-muted/60 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </ToyotaLayout>
    );
  }

  // Error state
  if (error || !vehicle) {
    return (
      <ToyotaLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Vehicle Not Found</h1>
            <p className="text-muted-foreground max-w-md">
              {error || "The vehicle you're looking for doesn't exist or has been moved."}
            </p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </ToyotaLayout>
    );
  }

  return (
    <ModalProvider pageContext={{
      heroImage: vehicle.image,
      galleryImages: galleryImages,
      vehicleName: vehicle.name,
      vehiclePrice: vehicle.price
    }}>
        <PerformanceErrorBoundary>
        <ScrollProgressBar />
        <UnifiedPerformanceMonitor />
        <SkipLinks />
        <ToyotaLayout
          activeNavItem="models"
          vehicle={vehicle}
          onBookTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
          onCarBuilder={() => modalHandlers.updateModal('isCarBuilderOpen', true)}
          onFinanceCalculator={() => modalHandlers.updateModal('isFinanceOpen', true)}
        >
      <div
        className={cn(
          `relative overflow-hidden ${isMobile ? "pb-28" : "pb-32"}`,
          'motion-reduce:transition-none motion-reduce:transform-none'
        )}
        role="main"
        aria-label="Vehicle details page"
      >
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <div id="main-content">
          <PerformanceErrorBoundary fallback={<HeroSkeleton />}>
            <section id="hero">
              <MinimalistVideoHero
                vehicle={vehicle}
                onBookTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
                onCarBuilder={() => modalHandlers.updateModal('isCarBuilderOpen', true)}
              />
            </section>
          </PerformanceErrorBoundary>

          {/* Seamless Cinematic Showroom - Immersive Gallery Experience */}
          <Suspense fallback={<ComponentLoading />}>
            <SectionTransition>
              <SeamlessCinematicShowroom />
            </SectionTransition>
          </Suspense>

          {/* ADAS Safety Section */}
          <Suspense fallback={<ComponentLoading />}>
            <SectionTransition>
              <div id="adas-section">
                <SplitSystemADAS />
              </div>
            </SectionTransition>
          </Suspense>

          <PerformanceErrorBoundary>
            <Suspense fallback={<ComponentLoading height="400px" />}>
              <SectionTransition parallaxSpeed={0.3}>
                <PremiumMediaShowcase vehicle={vehicle} />
              </SectionTransition>

              <SectionTransition parallaxSpeed={0.15}>
                <StorytellingSection
                  galleryImages={galleryImages}
                  monthlyEMI={monthlyEMI}
                  setIsBookingOpen={(value: boolean) => modalHandlers.updateModal('isBookingOpen', value)}
                  navigate={navigate}
                  setIsFinanceOpen={(value: boolean) => modalHandlers.updateModal('isFinanceOpen', value)}
                />
              </SectionTransition>

              {/* Virtual Showroom - Under Storytelling */}
              <SectionTransition parallaxSpeed={0.25}>
                <VirtualShowroom vehicleName={vehicle.name} />
              </SectionTransition>

              <SectionTransition>
                <OffersSection onOfferClick={modalHandlers.handleOfferClick} />
              </SectionTransition>
            </Suspense>
          </PerformanceErrorBoundary>
          
          <SectionTransition parallaxSpeed={0.2}>
            <EngineGradeSelection
              vehicle={vehicle}
              onCarBuilder={modalHandlers.handleConfigureWithGrade}
              onTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
              onGradeSelect={modalHandlers.handleGradeSelect}
              onGradeComparison={() => modalHandlers.handleGradeComparison()}
            />
          </SectionTransition>

          <Suspense fallback={<ComponentLoading />}>
            <SectionTransition parallaxSpeed={0.3}>
              <CinematicRelatedVehicles currentVehicle={vehicle} />
            </SectionTransition>
            
            {/* Pre-Owned Similar - Above FAQ */}
            <SectionTransition>
              <PreOwnedSimilar />
            </SectionTransition>
              
            <SectionTransition>
              <VehicleFAQ vehicle={vehicle} />
            </SectionTransition>
          </Suspense>

          <ActionPanel
            vehicle={vehicle}
            onBookTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
            onCarBuilder={() => modalHandlers.updateModal('isCarBuilderOpen', true)}
            onFinanceCalculator={() => modalHandlers.updateModal('isFinanceOpen', true)}
          />
        </div>

        {/* ModernSectionNavigation temporarily disabled */}
        {/* <ModernSectionNavigation /> */}
      </div>

      {/* Vehicle Modals */}
      <VehicleModals
        vehicle={vehicle}
        isBookingOpen={modals.isBookingOpen}
        setIsBookingOpen={(value) => modalHandlers.updateModal('isBookingOpen', value)}
        isFinanceOpen={modals.isFinanceOpen}
        setIsFinanceOpen={(value) => modalHandlers.updateModal('isFinanceOpen', value)}
        isCarBuilderOpen={modals.isCarBuilderOpen}
        setIsCarBuilderOpen={(value) => modalHandlers.updateModal('isCarBuilderOpen', value)}
        isOffersModalOpen={modals.isOffersModalOpen}
        setIsOffersModalOpen={(value) => modalHandlers.updateModal('isOffersModalOpen', value)}
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
        carBuilderInitialGrade={carBuilderInitialGrade}
      />
        </ToyotaLayout>
      </PerformanceErrorBoundary>
  </ModalProvider>
  );
};

export default React.memo(VehicleDetails); // Cache cleared
