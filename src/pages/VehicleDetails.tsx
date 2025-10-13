
import React, { useState, useCallback, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GradeComparisonModal from '@/components/vehicle-details/GradeComparisonModal';

import ToyotaLayout from "@/components/ToyotaLayout";
import ActionPanel from "@/components/vehicle-details/ActionPanel";
import PremiumHeroSection from "@/components/vehicle-details/PremiumHeroSection";
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
import { useCleanup } from "@/hooks/use-cleanup";
import { useNetworkAware } from "@/hooks/use-network-aware";
import { useEnhancedGestures } from "@/hooks/use-enhanced-gestures";
import { useImageCarousel } from "@/hooks/use-image-carousel";
import { useOptimizedDeviceInfo } from "@/hooks/use-optimized-device-info";
import { useWebVitalsOptimized, useMemoryPressure } from "@/utils/performance-web-vitals";
import { useCoreWebVitals } from "@/utils/performance-core-vitals";
import { createLazyComponent, preloadOnFastNetwork } from "@/utils/lazy-components";
import { cn } from "@/lib/utils";
import { UnifiedPerformanceMonitor } from '@/components/ui/unified-performance-monitor';
import { OptimizedModalProvider } from '@/components/ui/optimized-modal-manager';
import { SkipLinks } from '@/components/ui/enhanced-accessibility';
import { ProgressiveLoader } from '@/components/ui/enhanced-loading-states';

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

// Remove PremiumGallery as it's replaced by Spiral3DGallery

// Preload components on fast networks
preloadOnFastNetwork(() => import("@/components/vehicle-details/VehicleGallery"));
preloadOnFastNetwork(() => import("@/components/vehicle-details/StorytellingSection"));

const VehicleDetails = () => {
  // Modal states - memoized to prevent unnecessary re-renders
  const [modals, setModals] = useState({
    isBookingOpen: false,
    isFinanceOpen: false,
    isCarBuilderOpen: false,
    isOffersModalOpen: false,
    isSafetyModalOpen: false,
    isConnectivityModalOpen: false,
    isHybridTechModalOpen: false,
    isInteriorModalOpen: false,
    isGradeComparisonOpen: false
  });
  
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [carBuilderInitialGrade, setCarBuilderInitialGrade] = useState<string>();
  const [selectedGrade, setSelectedGrade] = useState<string>();

  // Hooks with performance optimizations
  const { personaData } = usePersona();
  const { isMobile, deviceCategory } = useOptimizedDeviceInfo();
  const { addCleanup } = useCleanup();
  const { shouldPreloadContent, isSlowConnection, isFastConnection } = useNetworkAware();
  const { vehicle, galleryImages, monthlyEMI, navigate, isLoading, error } = useVehicleData();
  const { reportMetric } = useWebVitalsOptimized();
  const { isLowMemory } = useMemoryPressure();
  const { getMetricsSummary } = useCoreWebVitals();

  const { currentImageIndex, nextImage, previousImage, setCurrentImageIndex } = useImageCarousel({
    images: galleryImages
  });

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
    handleSafetyExplore: () => setModals(prev => ({ ...prev, isSafetyModalOpen: true })),
    handleConnectivityExplore: () => setModals(prev => ({ ...prev, isConnectivityModalOpen: true })),
    handleHybridTechExplore: () => setModals(prev => ({ ...prev, isHybridTechModalOpen: true })),
    handleInteriorExplore: () => setModals(prev => ({ ...prev, isInteriorModalOpen: true })),
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

  // Performance monitoring with Core Web Vitals
  React.useEffect(() => {
    const startTime = performance.now();
    reportMetric({
      name: 'vehicle-details-mount',
      value: 0,
      rating: 'good',
      delta: 0
    });

    // Initialize page load monitoring
    import('@/utils/performance-optimization').then(({ performanceMonitor }) => {
      performanceMonitor.measurePageLoad();
    });
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      reportMetric({
        name: 'vehicle-details-unmount',
        value: duration,
        rating: duration < 1000 ? 'good' : 'needs-improvement',
        delta: 0
      });

      // Log performance summary on unmount
      const summary = getMetricsSummary();
      console.log('🚗 Vehicle Details Performance Summary:', summary);
    };
  }, [reportMetric, getMetricsSummary]);

  // Enhanced gesture handlers with performance optimization
  const gesturesRef = useEnhancedGestures({
    onSwipeLeft: nextImage,
    onSwipeRight: previousImage,
    hapticFeedback: isMobile && 'vibrate' in navigator
  });

  // Cleanup on unmount
  React.useEffect(() => {
    addCleanup(() => {
      console.log('VehicleDetails cleanup');
    });
  }, [addCleanup]);

  // Determine what content to render based on device capabilities
  const shouldRenderHeavyContent = !isSlowConnection && !isLowMemory();
  const shouldUseSuspense = isFastConnection && !isLowMemory();

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
    <OptimizedModalProvider>
      <PerformanceErrorBoundary>
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
        ref={gesturesRef as React.RefObject<HTMLDivElement>}
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
              <PremiumHeroSection
                vehicle={vehicle}
                galleryImages={galleryImages}
                onBookTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
                onCarBuilder={() => modalHandlers.updateModal('isCarBuilderOpen', true)}
              />
            </section>
          </PerformanceErrorBoundary>

          {/* Seamless Cinematic Showroom - Immersive Gallery Experience */}
          {shouldRenderHeavyContent && (
            <Suspense fallback={<ComponentLoading />}>
              <section id="seamless-showroom">
               <SeamlessCinematicShowroom />
              </section>
            </Suspense>
          )}

          {shouldRenderHeavyContent ? (
            shouldUseSuspense ? (
              <PerformanceErrorBoundary>
                <Suspense fallback={<ComponentLoading height="400px" />}>
                  <section id="media-showcase">
                    <PremiumMediaShowcase vehicle={vehicle} />
                  </section>

                  <StorytellingSection
                    galleryImages={galleryImages}
                    monthlyEMI={monthlyEMI}
                    setIsBookingOpen={(value: boolean) => modalHandlers.updateModal('isBookingOpen', value)}
                    navigate={navigate}
                    setIsFinanceOpen={(value: boolean) => modalHandlers.updateModal('isFinanceOpen', value)}
                    onSafetyExplore={modalHandlers.handleSafetyExplore}
                    onConnectivityExplore={modalHandlers.handleConnectivityExplore}
                    onHybridTechExplore={modalHandlers.handleHybridTechExplore}
                    onInteriorExplore={modalHandlers.handleInteriorExplore}
                  />

                  {/* Virtual Showroom - Under Storytelling */}
                  <section id="virtual-showroom">
                    <VirtualShowroom vehicleName={vehicle.name} />
                  </section>

                  <section id="offers">
                    <OffersSection onOfferClick={modalHandlers.handleOfferClick} />
                  </section>
                </Suspense>
              </PerformanceErrorBoundary>
            ) : (
              <PerformanceErrorBoundary>
                <Suspense fallback={<ComponentLoading />}>
                  <StorytellingSection
                    galleryImages={galleryImages}
                    monthlyEMI={monthlyEMI}
                    setIsBookingOpen={(value: boolean) => modalHandlers.updateModal('isBookingOpen', value)}
                    navigate={navigate}
                    setIsFinanceOpen={(value: boolean) => modalHandlers.updateModal('isFinanceOpen', value)}
                    onSafetyExplore={modalHandlers.handleSafetyExplore}
                    onConnectivityExplore={modalHandlers.handleConnectivityExplore}
                    onHybridTechExplore={modalHandlers.handleHybridTechExplore}
                    onInteriorExplore={modalHandlers.handleInteriorExplore}
                  />

                  {/* Virtual Showroom - Under Storytelling */}
                  <section id="virtual-showroom">
                    <VirtualShowroom vehicleName={vehicle.name} />
                  </section>
                </Suspense>

                <section id="offers">
                  <OffersSection onOfferClick={modalHandlers.handleOfferClick} />
                </section>
              </PerformanceErrorBoundary>
            )
          ) : (
            // Lightweight version for slow connections/low memory
            <>
              <section className="py-8 lg:py-16 bg-muted/30">
                <div className="toyota-container">
                  <h2 className="text-2xl font-bold mb-8">Vehicle Overview</h2>
                  <p className="text-muted-foreground mb-4">
                    Detailed content optimized for your connection speed.
                  </p>
                </div>
              </section>
              <OffersSection onOfferClick={modalHandlers.handleOfferClick} />
            </>
          )}
          
          <section id="configuration">
            <EngineGradeSelection
              vehicle={vehicle}
              onCarBuilder={modalHandlers.handleConfigureWithGrade}
              onTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
              onGradeSelect={modalHandlers.handleGradeSelect}
              onGradeComparison={() => modalHandlers.handleGradeComparison()}
            />
          </section>

          {shouldRenderHeavyContent && (
            <Suspense fallback={<ComponentLoading />}>
              <section id="related" aria-labelledby="related-vehicles-heading">
                <h2 id="related-vehicles-heading" className="sr-only">Related Vehicles</h2>
                <CinematicRelatedVehicles currentVehicle={vehicle} />
              </section>
              
              {/* Pre-Owned Similar - Above FAQ */}
              <section id="pre-owned">
                <PreOwnedSimilar />
              </section>
              
              <section id="faq">
                <VehicleFAQ vehicle={vehicle} />
              </section>
            </Suspense>
          )}

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
        isSafetyModalOpen={modals.isSafetyModalOpen}
        setIsSafetyModalOpen={(value) => modalHandlers.updateModal('isSafetyModalOpen', value)}
        isConnectivityModalOpen={modals.isConnectivityModalOpen}
        setIsConnectivityModalOpen={(value) => modalHandlers.updateModal('isConnectivityModalOpen', value)}
        isHybridTechModalOpen={modals.isHybridTechModalOpen}
        setIsHybridTechModalOpen={(value) => modalHandlers.updateModal('isHybridTechModalOpen', value)}
        isInteriorModalOpen={modals.isInteriorModalOpen}
        setIsInteriorModalOpen={(value) => modalHandlers.updateModal('isInteriorModalOpen', value)}
        carBuilderInitialGrade={carBuilderInitialGrade}
      />
        </ToyotaLayout>
      </PerformanceErrorBoundary>
    </OptimizedModalProvider>
  );
};

export default React.memo(VehicleDetails); // Cache cleared
