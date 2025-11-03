import { useState, useCallback } from 'react';
import { VehicleModel } from '@/types/vehicle';

const MAX_COMPARISONS = 3;

export const useComparisonMode = () => {
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  const toggleVehicle = useCallback((vehicleId: string) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      }
      if (prev.length >= MAX_COMPARISONS) {
        return prev;
      }
      return [...prev, vehicleId];
    });
  }, []);

  const isSelected = useCallback((vehicleId: string) => {
    return selectedVehicles.includes(vehicleId);
  }, [selectedVehicles]);

  const clearSelection = useCallback(() => {
    setSelectedVehicles([]);
    setIsComparisonMode(false);
  }, []);

  const canAddMore = selectedVehicles.length < MAX_COMPARISONS;

  return {
    selectedVehicles,
    isComparisonMode,
    setIsComparisonMode,
    toggleVehicle,
    isSelected,
    clearSelection,
    canAddMore,
    count: selectedVehicles.length,
    max: MAX_COMPARISONS
  };
};
