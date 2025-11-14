import React from 'react';
import { VehicleModel } from '@/types/vehicle';
import { HotspotModal } from '../hotspot/HotspotModal';
import { performanceHotspots } from '@/data/performance-hotspots';

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
  const currentGrade = (vehicle as any).grade || 'Base';
  
  return (
    <HotspotModal
      hotspots={performanceHotspots}
      defaultBackgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600"
      currentGrade={currentGrade}
      onTestDrive={onTestDrive}
      onBuild={onBuild}
      modalType="exterior"
    />
  );
};
