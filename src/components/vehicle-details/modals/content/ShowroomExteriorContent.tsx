import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { HotspotModal } from '../hotspot/HotspotModal';
import { exteriorHotspots } from '@/data/exterior-hotspots';

interface ShowroomExteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const ShowroomExteriorContent: React.FC<ShowroomExteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const currentGrade = (vehicle as any).grade || 'Base';
  
  return (
    <HotspotModal
      hotspots={exteriorHotspots}
      defaultBackgroundImage="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg"
      currentGrade={currentGrade}
      onTestDrive={onTestDrive}
      onBuild={onBuild}
      modalType="exterior"
    />
  );
};
