import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { CinematicStoryExperience } from './CinematicStoryExperience';

interface StoryPerformanceContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const StoryPerformanceContent: React.FC<StoryPerformanceContentProps> = ({
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
      storyType="performance"
    />
  );
};
