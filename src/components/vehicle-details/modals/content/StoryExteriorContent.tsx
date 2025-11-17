import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { CinematicStoryExperience } from './CinematicStoryExperience';

interface StoryExteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const StoryExteriorContent: React.FC<StoryExteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  return (
    <CinematicStoryExperience
      vehicle={vehicle}
      onClose={onClose}
      onTestDrive={onTestDrive}
      onBuild={onBuild}
      storyType="exterior"
    />
  );
};
