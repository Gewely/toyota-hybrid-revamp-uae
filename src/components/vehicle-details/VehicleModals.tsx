import React, { Suspense } from "react";
import { VehicleModel } from "@/types/vehicle";
import BookTestDrive from "./BookTestDrive";
import FinanceCalculator from "./FinanceCalculator";
import CarBuilder from "./CarBuilder";
import OffersModal from "@/components/home/OffersModal";
import { useModal } from "@/contexts/ModalProvider";
import { PremiumModalV2 } from "@/components/ui/premium-modal-v2";
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
  carBuilderInitialGrade
}) => {
  const { isOpen, close, getProps, pageContext } = useModal();

  return (
    <>
      {/* Legacy boolean-based modals */}
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

      {/* Registry-driven modals from ModalProvider */}
      {Object.entries(modalRegistry).map(([id, entry]) => {
        if (!isOpen(id)) return null;

        const ModalComponent = entry.component as any;

        return (
          <PremiumModalV2
            key={id}
            id={id}
            isOpen={isOpen(id)}
            onClose={() => close(id)}
            variant={entry.variant}
            title={entry.title}
            description={entry.description}
          >
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <ModalComponent 
                vehicle={vehicle}
                onClose={() => close(id)}
                onTestDrive={() => {
                  close(id);
                  setIsBookingOpen(true);
                }}
                onBuild={() => {
                  close(id);
                  setIsCarBuilderOpen(true);
                }}
                onFinance={() => {
                  close(id);
                  setIsFinanceOpen(true);
                }}
                {...getProps(id)}
              />
            </Suspense>
          </PremiumModalV2>
        );
      })}
    </>
  );
};

export default VehicleModals;
