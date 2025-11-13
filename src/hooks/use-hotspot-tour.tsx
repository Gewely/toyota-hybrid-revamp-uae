import { useState, useCallback, useEffect } from 'react';
import { Hotspot } from '@/data/interior-hotspots';

interface UseHotspotTourProps {
  hotspots: Hotspot[];
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

export const useHotspotTour = ({ 
  hotspots, 
  autoAdvance = false, 
  autoAdvanceDelay = 4000 
}: UseHotspotTourProps) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startTour = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, []);

  const stopTour = useCallback(() => {
    setCurrentIndex(null);
    setIsPlaying(false);
  }, []);

  const nextHotspot = useCallback(() => {
    if (currentIndex === null) return;
    
    if (currentIndex < hotspots.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      stopTour();
    }
  }, [currentIndex, hotspots.length, stopTour]);

  const previousHotspot = useCallback(() => {
    if (currentIndex === null) return;
    
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const goToHotspot = useCallback((index: number) => {
    if (index >= 0 && index < hotspots.length) {
      setCurrentIndex(index);
      setIsPlaying(false);
    }
  }, [hotspots.length]);

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying || !autoAdvance || currentIndex === null) return;

    const timer = setTimeout(() => {
      nextHotspot();
    }, autoAdvanceDelay);

    return () => clearTimeout(timer);
  }, [isPlaying, autoAdvance, autoAdvanceDelay, currentIndex, nextHotspot]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextHotspot();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousHotspot();
          break;
        case 'Escape':
          e.preventDefault();
          stopTour();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPlaying, nextHotspot, previousHotspot, stopTour]);

  return {
    currentIndex,
    currentHotspot: currentIndex !== null ? hotspots[currentIndex] : null,
    isPlaying,
    isTourActive: currentIndex !== null,
    startTour,
    stopTour,
    nextHotspot,
    previousHotspot,
    goToHotspot,
    togglePlayPause: () => setIsPlaying(!isPlaying),
    progress: currentIndex !== null ? ((currentIndex + 1) / hotspots.length) * 100 : 0,
    totalHotspots: hotspots.length
  };
};
