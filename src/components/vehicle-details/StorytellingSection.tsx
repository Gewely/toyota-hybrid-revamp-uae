
import React from "react";
import AppleStyleStorytellingSection from "./AppleStyleStorytellingSection";

interface StorytellingProps {
  galleryImages: string[];
  monthlyEMI?: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
  onSafetyExplore: () => void;
  onConnectivityExplore: () => void;
  onHybridTechExplore: () => void;
  onInteriorExplore: () => void;
}

const StorytellingSection: React.FC<StorytellingProps> = ({
  galleryImages,
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen,
  onSafetyExplore,
  onConnectivityExplore,
  onHybridTechExplore,
  onInteriorExplore
}) => {
  return (
    <AppleStyleStorytellingSection
      monthlyEMI={monthlyEMI || 0}
      setIsBookingOpen={setIsBookingOpen}
      navigate={navigate}
      setIsFinanceOpen={setIsFinanceOpen}
      onSafetyExplore={onSafetyExplore}
      onConnectivityExplore={onConnectivityExplore}
      onHybridTechExplore={onHybridTechExplore}
      onInteriorExplore={onInteriorExplore}
      galleryImages={galleryImages}
    />
  );
};

export default StorytellingSection;
