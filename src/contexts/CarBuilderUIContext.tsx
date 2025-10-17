import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * UI state management for Car Builder
 * Manages non-configuration state like hover effects, open sheets, and animation preferences
 */
interface CarBuilderUIState {
  hoveredOption: string | null;
  setHoveredOption: (id: string | null) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
  animationPreference: 'full' | 'reduced';
  setAnimationPreference: (pref: 'full' | 'reduced') => void;
}

const CarBuilderUIContext = createContext<CarBuilderUIState | undefined>(undefined);

interface CarBuilderUIProviderProps {
  children: ReactNode;
  initialAnimationPreference?: 'full' | 'reduced';
}

export const CarBuilderUIProvider: React.FC<CarBuilderUIProviderProps> = ({ 
  children, 
  initialAnimationPreference = 'full' 
}) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const [animationPreference, setAnimationPreference] = useState<'full' | 'reduced'>(
    initialAnimationPreference
  );

  const value: CarBuilderUIState = {
    hoveredOption,
    setHoveredOption,
    openSheet,
    setOpenSheet,
    animationPreference,
    setAnimationPreference,
  };

  return (
    <CarBuilderUIContext.Provider value={value}>
      {children}
    </CarBuilderUIContext.Provider>
  );
};

export const useCarBuilderUI = (): CarBuilderUIState => {
  const context = useContext(CarBuilderUIContext);
  if (!context) {
    throw new Error('useCarBuilderUI must be used within CarBuilderUIProvider');
  }
  return context;
};
