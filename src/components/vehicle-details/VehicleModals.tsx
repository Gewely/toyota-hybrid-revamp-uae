
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import BookTestDrive from "./BookTestDrive";
import FinanceCalculator from "./FinanceCalculator";
import CarBuilder from "./CarBuilder";
import OffersModal from "@/components/home/OffersModal";
import SafetySuiteModal from "./modals/SafetySuiteModal";
import ConnectivityModal from "./modals/ConnectivityModal";
import HybridTechModal from "./modals/HybridTechModal";
// import InteriorExperienceModal from "./modals/InteriorExperienceModal"; // Removed temporarily
import { 
  useOptimizedModal, 
  MODAL_PRIORITIES,
  useModalKeyboardHandler 
} from "@/components/ui/optimized-modal-manager";

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
  const { isModalActive } = useOptimizedModal();
  
  // Enable keyboard handling for modal stack
  useModalKeyboardHandler();

  const handleModalClose = (modalSetter: (open: boolean) => void) => {
    modalSetter(false);
  };

  const handleTestDriveFromModal = (modalSetter: (open: boolean) => void) => {
    modalSetter(false);
    setIsBookingOpen(true);
  };

  return (
    <>
      <OffersModal
        isOpen={isOffersModalOpen}
        onClose={() => {
          setIsOffersModalOpen(false);
          setSelectedOffer(null);
        }}
        selectedOffer={selectedOffer}
      />

      <BookTestDrive
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        vehicle={vehicle}
      />

      <FinanceCalculator
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
        vehicle={vehicle}
      />

      <CarBuilder
        isOpen={isCarBuilderOpen}
        onClose={() => setIsCarBuilderOpen(false)}
        vehicle={vehicle}
      />

      <SafetySuiteModal
        isOpen={isSafetyModalOpen}
        onClose={() => handleModalClose(setIsSafetyModalOpen)}
        onBookTestDrive={() => handleTestDriveFromModal(setIsSafetyModalOpen)}
      />

      <ConnectivityModal
        isOpen={isConnectivityModalOpen}
        onClose={() => handleModalClose(setIsConnectivityModalOpen)}
        onBookTestDrive={() => handleTestDriveFromModal(setIsConnectivityModalOpen)}
      />

      <HybridTechModal
        isOpen={isHybridTechModalOpen}
        onClose={() => handleModalClose(setIsHybridTechModalOpen)}
        onBookTestDrive={() => handleTestDriveFromModal(setIsHybridTechModalOpen)}
      />

      {/* InteriorExperienceModal temporarily disabled
      <InteriorExperienceModal
        isOpen={isInteriorModalOpen}
        onClose={() => handleModalClose(setIsInteriorModalOpen)}
        onBookTestDrive={() => handleTestDriveFromModal(setIsInteriorModalOpen)}
      />
      */}
    </>
  );
};

export default VehicleModals;
