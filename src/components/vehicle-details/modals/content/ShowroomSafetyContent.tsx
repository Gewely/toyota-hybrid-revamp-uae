import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { SafetyLayersVisualization } from './SafetyLayersVisualization';

interface ShowroomSafetyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const ShowroomSafetyContent: React.FC<ShowroomSafetyContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  return (
    <SafetyLayersVisualization
      vehicle={vehicle}
      onClose={onClose}
      onTestDrive={onTestDrive}
      onBuild={onBuild}
    />
  );
};
