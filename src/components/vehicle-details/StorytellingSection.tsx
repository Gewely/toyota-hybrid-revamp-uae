
import React from "react";
import AppleStyleStorytellingSection from "./AppleStyleStorytellingSection";

interface StorytellingProps {
  galleryImages: string[];
  monthlyEMI?: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
}

const StorytellingSection: React.FC<StorytellingProps> = ({
  galleryImages,
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen,
}) => {
  return (
    <AppleStyleStorytellingSection
      monthlyEMI={monthlyEMI || 0}
      setIsBookingOpen={setIsBookingOpen}
      navigate={navigate}
      setIsFinanceOpen={setIsFinanceOpen}
      galleryImages={galleryImages}
    />
  );
};

export default StorytellingSection;
