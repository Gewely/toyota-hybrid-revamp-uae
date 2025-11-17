import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { CinematicStoryExperience } from './CinematicStoryExperience';

interface StorySafetyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const StorySafetyContent: React.FC<StorySafetyContentProps> = ({
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
      storyType="safety"
    />
  );
};
