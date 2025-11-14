import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { HotspotModal } from '../hotspot/HotspotModal';
import { technologyHotspots } from '@/data/technology-hotspots';

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
  const currentGrade = (vehicle as any).grade || 'Base';
  
  return (
    <HotspotModal
      hotspots={technologyHotspots}
      defaultBackgroundImage="https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true"
      currentGrade={currentGrade}
      onTestDrive={onTestDrive}
      onBuild={onBuild}
      modalType="interior"
    />
  );
};
