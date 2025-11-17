import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { CinematicStoryExperience } from './CinematicStoryExperience';

interface StoryInteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const StoryInteriorContent: React.FC<StoryInteriorContentProps> = ({
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
      storyType="interior"
    />
  );
};
