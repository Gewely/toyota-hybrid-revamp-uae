import React from 'react';
import PremiumMediaShowcase from './hero/PremiumMediaShowcase';
import MobileStickyNav from './MobileStickyNav';
import DesktopActionPanel from './nav/DesktopActionPanel';
import VehicleHighlights from './cards/VehicleHighlights';
import ThreeDCardCarousel from './carousel/ThreeDCardCarousel';
import { demoVehicleData, analyticsEvents } from '@/data/demo-data';

interface LuxuryShowcaseProps {
  vehicleData?: typeof demoVehicleData;
  onReserve?: () => void;
  onBuild?: () => void;
  onTestDrive?: () => void;
  onCompare?: () => void;
  onShare?: () => void;
  onFeatureLearnMore?: (id: string) => void;
  onCarouselAction?: (id: string) => void;
}

const LuxuryShowcase: React.FC<LuxuryShowcaseProps> = ({
  vehicleData = demoVehicleData,
  onReserve = () => {},
  onBuild = () => {},
  onTestDrive = () => {},
  onCompare = () => {},
  onShare = () => {},
  onFeatureLearnMore = () => {},
  onCarouselAction = () => {}
}) => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <PremiumMediaShowcase
        media={vehicleData.hero}
        title="The Future of Automotive Excellence"
        subtitle="Where luxury meets performance in perfect harmony"
        ctaPrimary={{ label: "Build & Price", action: onBuild }}
        ctaSecondary={{ label: "Book Test Drive", action: onTestDrive }}
      />

      {/* Vehicle Highlights */}
      <VehicleHighlights
        highlights={vehicleData.highlights}
        onLearnMore={onFeatureLearnMore}
      />

      {/* 3D Carousel */}
      <ThreeDCardCarousel
        items={vehicleData.carousel}
        onItemAction={onCarouselAction}
      />

      {/* Navigation */}
      <MobileStickyNav
        onBookTestDrive={onTestDrive}
        onCarBuilder={onBuild}
      />

      <DesktopActionPanel
        onReserve={onReserve}
        onBuild={onBuild}
        onCompare={onCompare}
        onTestDrive={onTestDrive}
        onShare={onShare}
        compareCount={0}
      />
    </div>
  );
};

export default LuxuryShowcase;