import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { HotspotModal } from '../hotspot/HotspotModal';
import { safetyHotspots } from '@/data/safety-hotspots';

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
  const currentGrade = (vehicle as any).grade || 'Base';
  
  return (
    <HotspotModal
      hotspots={safetyHotspots}
      defaultBackgroundImage="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg"
      currentGrade={currentGrade}
      onTestDrive={onTestDrive}
      onBuild={onBuild}
      modalType="exterior"
    />
  );
};
