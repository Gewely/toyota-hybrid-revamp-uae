import React, { Suspense, lazy } from "react";
import { VehicleModel } from "@/types/vehicle";
import { useModal } from "@/contexts/ModalProvider";
import { PremiumModal } from "@/components/ui/premium-modal";
import { modalRegistry } from "@/config/modalRegistry";

// Lazy load modal components
const SafetySuiteModal = lazy(() => import("./modals/SafetySuiteModal"));
const ConnectivityModal = lazy(() => import("./modals/ConnectivityModal"));
const HybridTechModal = lazy(() => import("./modals/HybridTechModal"));
const InteriorModal = lazy(() => import("./modals/InteriorModal"));
const OffersModal = lazy(() => import("@/components/home/OffersModal"));
const BookTestDrive = lazy(() => import("./BookTestDrive"));
const FinanceCalculator = lazy(() => import("./FinanceCalculator"));
const CarBuilder = lazy(() => import("./CarBuilder"));

interface VehicleModalsProps {
  vehicle: VehicleModel;
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  isFinanceOpen: boolean;
  setIsFinanceOpen: (open: boolean) => void;
  isCarBuilderOpen: boolean;
  setIsCarBuilderOpen: (open: boolean) => void;
  isOffersModalOpen: boolean;
  setIsOffersModalOpen: (open: boolean) => void;
  selectedOffer: any;
  setSelectedOffer: (offer: any) => void;
  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;
  isConnectivityModalOpen: boolean;
  setIsConnectivityModalOpen: (open: boolean) => void;
  isHybridTechModalOpen: boolean;
  setIsHybridTechModalOpen: (open: boolean) => void;
  isInteriorModalOpen: boolean;
  setIsInteriorModalOpen: (open: boolean) => void;
  carBuilderInitialGrade?: string;
}

const VehicleModals: React.FC<VehicleModalsProps> = ({
  vehicle,
  isBookingOpen,
  setIsBookingOpen,
  isFinanceOpen,
  setIsFinanceOpen,
  isCarBuilderOpen,
  setIsCarBuilderOpen,
  isOffersModalOpen,
  setIsOffersModalOpen,
  selectedOffer,
  setSelectedOffer,
  isSafetyModalOpen,
  setIsSafetyModalOpen,
  isConnectivityModalOpen,
  setIsConnectivityModalOpen,
  isHybridTechModalOpen,
  setIsHybridTechModalOpen,
  isInteriorModalOpen,
  setIsInteriorModalOpen,
  carBuilderInitialGrade
}) => {
  const { isOpen, close, pageContext } = useModal();

  const handleModalClose = (modalSetter: (open: boolean) => void) => {
    modalSetter(false);
  };

  const handleTestDriveFromModal = (modalSetter: (open: boolean) => void) => {
    modalSetter(false);
    setIsBookingOpen(true);
  };

  return (
    <Suspense fallback={null}>
      {/* Offers Modal */}
      <PremiumModal
        id="offers"
        isOpen={isOffersModalOpen}
        onClose={() => {
          setIsOffersModalOpen(false);
          setSelectedOffer(null);
        }}
        variant="cta"
        title={modalRegistry['offers']?.title}
        description={modalRegistry['offers']?.description}
        imageSrc={typeof modalRegistry['offers']?.imageSrc === 'function' 
          ? modalRegistry['offers'].imageSrc(pageContext) 
          : modalRegistry['offers']?.imageSrc}
        enableDeepLink={false}
      >
        <OffersModal
          isOpen={isOffersModalOpen}
          onClose={() => {
            setIsOffersModalOpen(false);
            setSelectedOffer(null);
          }}
          selectedOffer={selectedOffer}
        />
      </PremiumModal>

      {/* Test Drive Modal */}
      <PremiumModal
        id="test-drive"
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        variant="form"
        title={modalRegistry['test-drive']?.title}
        description={modalRegistry['test-drive']?.description}
        imageSrc={vehicle.image}
        enableDeepLink={true}
      >
        <BookTestDrive
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          vehicle={vehicle}
        />
      </PremiumModal>

      {/* Finance Calculator Modal */}
      <PremiumModal
        id="finance"
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
        variant="form"
        title={modalRegistry['finance']?.title}
        description={modalRegistry['finance']?.description}
        imageSrc={vehicle.image}
        enableDeepLink={true}
      >
        <FinanceCalculator
          isOpen={isFinanceOpen}
          onClose={() => setIsFinanceOpen(false)}
          vehicle={vehicle}
        />
      </PremiumModal>

      {/* Car Builder Modal */}
      <PremiumModal
        id="car-builder"
        isOpen={isCarBuilderOpen}
        onClose={() => setIsCarBuilderOpen(false)}
        variant="wizard"
        title={modalRegistry['car-builder']?.title}
        description={modalRegistry['car-builder']?.description}
        imageSrc={vehicle.image}
        enableDeepLink={true}
        maxWidth="max-w-7xl"
      >
        <CarBuilder
          isOpen={isCarBuilderOpen}
          onClose={() => setIsCarBuilderOpen(false)}
          vehicle={vehicle}
          initialGrade={carBuilderInitialGrade}
        />
      </PremiumModal>

      {/* Safety Suite Modal */}
      <PremiumModal
        id="safety-suite"
        isOpen={isSafetyModalOpen}
        onClose={() => handleModalClose(setIsSafetyModalOpen)}
        variant="gallery"
        title={modalRegistry['safety-suite']?.title}
        description={modalRegistry['safety-suite']?.description}
        imageSrc={typeof modalRegistry['safety-suite']?.imageSrc === 'function' 
          ? modalRegistry['safety-suite'].imageSrc(pageContext) 
          : modalRegistry['safety-suite']?.imageSrc}
        enableDeepLink={true}
      >
        <SafetySuiteModal
          isOpen={isSafetyModalOpen}
          onClose={() => handleModalClose(setIsSafetyModalOpen)}
          onBookTestDrive={() => handleTestDriveFromModal(setIsSafetyModalOpen)}
        />
      </PremiumModal>

      {/* Connectivity Modal */}
      <PremiumModal
        id="connectivity"
        isOpen={isConnectivityModalOpen}
        onClose={() => handleModalClose(setIsConnectivityModalOpen)}
        variant="gallery"
        title={modalRegistry['connectivity']?.title}
        description={modalRegistry['connectivity']?.description}
        imageSrc={typeof modalRegistry['connectivity']?.imageSrc === 'function' 
          ? modalRegistry['connectivity'].imageSrc(pageContext) 
          : modalRegistry['connectivity']?.imageSrc}
        enableDeepLink={true}
      >
        <ConnectivityModal
          isOpen={isConnectivityModalOpen}
          onClose={() => handleModalClose(setIsConnectivityModalOpen)}
          onBookTestDrive={() => handleTestDriveFromModal(setIsConnectivityModalOpen)}
        />
      </PremiumModal>

      {/* Hybrid Tech Modal */}
      <PremiumModal
        id="hybrid-tech"
        isOpen={isHybridTechModalOpen}
        onClose={() => handleModalClose(setIsHybridTechModalOpen)}
        variant="gallery"
        title={modalRegistry['hybrid-tech']?.title}
        description={modalRegistry['hybrid-tech']?.description}
        imageSrc={typeof modalRegistry['hybrid-tech']?.imageSrc === 'function' 
          ? modalRegistry['hybrid-tech'].imageSrc(pageContext) 
          : modalRegistry['hybrid-tech']?.imageSrc}
        enableDeepLink={true}
      >
        <HybridTechModal
          isOpen={isHybridTechModalOpen}
          onClose={() => handleModalClose(setIsHybridTechModalOpen)}
          onBookTestDrive={() => handleTestDriveFromModal(setIsHybridTechModalOpen)}
        />
      </PremiumModal>

      {/* Interior Modal */}
      {isInteriorModalOpen && (
        <PremiumModal
          id="interior"
          isOpen={isInteriorModalOpen}
          onClose={() => handleModalClose(setIsInteriorModalOpen)}
          variant="gallery"
          title={modalRegistry['interior']?.title}
          description={modalRegistry['interior']?.description}
          imageSrc={typeof modalRegistry['interior']?.imageSrc === 'function' 
            ? modalRegistry['interior'].imageSrc(pageContext) 
            : modalRegistry['interior']?.imageSrc}
          enableDeepLink={true}
        >
          <InteriorModal onClose={() => handleModalClose(setIsInteriorModalOpen)} />
        </PremiumModal>
      )}
    </Suspense>
  );
};

export default VehicleModals;
