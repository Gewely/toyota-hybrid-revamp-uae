import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { InfotainmentDemo } from './InfotainmentDemo';

interface ShowroomTechnologyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const ShowroomTechnologyContent: React.FC<ShowroomTechnologyContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  return (
    <InfotainmentDemo
      vehicle={vehicle}
      onClose={onClose}
      onTestDrive={onTestDrive}
      onBuild={onBuild}
    />
  );
};
