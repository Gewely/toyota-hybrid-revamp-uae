import React, { Suspense } from "react";
import { VehicleModel } from "@/types/vehicle";
import BookTestDrive from "./BookTestDrive";
import FinanceCalculator from "./FinanceCalculator";
import CarBuilder from "./CarBuilder";
import OffersModal from "@/components/home/OffersModal";
import SafetySuiteModal from "./modals/SafetySuiteModal";
import ConnectivityModal from "./modals/ConnectivityModal";
import HybridTechModal from "./modals/HybridTechModal";
import InteriorModal from "./modals/InteriorModal";
import ExteriorModal from "./modals/ExteriorModal";
import PerformanceModal from "./modals/PerformanceModal";
import { useModal } from "@/contexts/ModalProvider";
import { PremiumModal } from "@/components/ui/premium-modal";
import { modalRegistry } from "@/config/modalRegistry";

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
  const { isOpen, close, getProps, pageContext } = useModal();

  const handleModalClose = (modalSetter: (open: boolean) => void) => {
    modalSetter(false);
  };

  const handleTestDriveFromModal = (modalSetter: (open: boolean) => void) => {
    modalSetter(false);
    setIsBookingOpen(true);
  };

  return (
    <>
      {/* Legacy boolean-based modals - keep for now */}
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
        initialGrade={carBuilderInitialGrade}
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

      {isInteriorModalOpen && (
        <InteriorModal
          onClose={() => handleModalClose(setIsInteriorModalOpen)}
        />
      )}

      {/* Registry-driven modals from ModalProvider */}
      {Object.entries(modalRegistry).map(([id, entry]) => {
        if (!isOpen(id)) return null;

        const ModalComponent = entry.component as any;
        const imageSrc = typeof entry.imageSrc === 'function' 
          ? entry.imageSrc(pageContext) 
          : entry.imageSrc;

        return (
          <PremiumModal
            key={id}
            id={id}
            isOpen={isOpen(id)}
            onClose={() => close(id)}
            variant={entry.variant}
            title={entry.title}
            description={entry.description}
            imageSrc={imageSrc}
            enableDeepLink={entry.deepLinkEnabled}
          >
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <ModalComponent 
                vehicle={vehicle}
                onClose={() => close(id)}
                {...getProps(id)}
              />
            </Suspense>
          </PremiumModal>
        );
      })}
    </>
  );
};

export default VehicleModals;
