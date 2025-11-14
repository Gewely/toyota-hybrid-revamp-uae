import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { HotspotModal } from '../hotspot/HotspotModal';
import { exteriorHotspots } from '@/data/exterior-hotspots';

interface StoryExteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const exteriorFeatures = [
  { title: 'LED Matrix Headlights', description: 'Adaptive beam pattern for optimal visibility' },
  { title: 'Power Liftgate', description: 'Hands-free access with kick sensor' },
  { title: 'Roof Rails', description: 'Integrated design for adventure gear' },
  { title: 'Sport Wheels', description: '20" alloy wheels with all-terrain capability' }
];

export const StoryExteriorContent: React.FC<StoryExteriorContentProps> = ({
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
