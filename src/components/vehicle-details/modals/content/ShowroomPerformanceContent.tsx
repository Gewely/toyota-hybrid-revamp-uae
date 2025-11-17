import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { PerformanceDashboard } from './PerformanceDashboard';

interface ShowroomPerformanceContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const ShowroomPerformanceContent: React.FC<ShowroomPerformanceContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  return (
    <PerformanceDashboard
      vehicle={vehicle}
      onClose={onClose}
      onTestDrive={onTestDrive}
      onBuild={onBuild}
    />
  );
};
