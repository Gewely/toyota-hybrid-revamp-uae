import { useState, useEffect, useCallback, useRef } from 'react';
import { contextualHaptic } from '@/utils/haptic';

interface TourModeOptions {
  cards: Array<{ id: string; [key: string]: any }>;
  intervalMs?: number;
  onCardHighlight?: (cardId: string, index: number) => void;
  onTourComplete?: () => void;
}

export function useTourMode({
  cards,
  intervalMs = 3000,
  onCardHighlight,
  onTourComplete
}: TourModeOptions) {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const progress = (currentIndex / cards.length) * 100;

  const startTour = useCallback(() => {
    setIsActive(true);
    setCurrentIndex(0);
    setIsPaused(false);
    contextualHaptic.stepProgress();
  }, []);

  const stopTour = useCallback(() => {
    setIsActive(false);
    setCurrentIndex(0);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pauseTour = useCallback(() => {
    setIsPaused(true);
    contextualHaptic.buttonPress();
  }, []);

  const resumeTour = useCallback(() => {
    setIsPaused(false);
    contextualHaptic.buttonPress();
  }, []);

  const skipToCard = useCallback((index: number) => {
    if (index >= 0 && index < cards.length) {
      setCurrentIndex(index);
      contextualHaptic.selectionChange();
    }
  }, [cards.length]);

  // Auto-advance logic
  useEffect(() => {
    if (!isActive || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Notify about current card
    if (onCardHighlight && cards[currentIndex]) {
      onCardHighlight(cards[currentIndex].id, currentIndex);
    }

    // Set up interval for next card
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= cards.length) {
          // Tour complete
          if (onTourComplete) {
            onTourComplete();
          }
          setIsActive(false);
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused, currentIndex, cards, intervalMs, onCardHighlight, onTourComplete]);

  return {
    isActive,
    isPaused,
    currentIndex,
    currentCard: cards[currentIndex] || null,
    progress,
    startTour,
    stopTour,
    pauseTour,
    resumeTour,
    skipToCard,
  };
}
