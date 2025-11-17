import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { CinematicStoryExperience } from './CinematicStoryExperience';

interface StoryTechnologyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const StoryTechnologyContent: React.FC<StoryTechnologyContentProps> = ({
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
      storyType="technology"
    />
  );
};
