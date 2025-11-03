import { useState, useEffect, useRef, useCallback } from 'react';

export type ScrollDirection = 'up' | 'down' | 'none';
export type VelocityCategory = 'slow' | 'medium' | 'fast';

export interface ScrollVelocityData {
  velocity: number;
  direction: ScrollDirection;
  category: VelocityCategory;
  isScrolling: boolean;
}

const VELOCITY_THRESHOLDS = {
  slow: 100,
  medium: 400
};

const SCROLL_STOP_DELAY = 150;

export const useScrollVelocity = (): ScrollVelocityData => {
  const [velocityData, setVelocityData] = useState<ScrollVelocityData>({
    velocity: 0,
    direction: 'none',
    category: 'slow',
    isScrolling: false
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const rafId = useRef<number>();

  const getVelocityCategory = useCallback((velocity: number): VelocityCategory => {
    if (velocity < VELOCITY_THRESHOLDS.slow) return 'slow';
    if (velocity < VELOCITY_THRESHOLDS.medium) return 'medium';
    return 'fast';
  }, []);

  const updateVelocity = useCallback(() => {
    const currentScrollY = window.scrollY;
    const currentTime = Date.now();
    
    const timeDelta = currentTime - lastTime.current;
    const scrollDelta = currentScrollY - lastScrollY.current;

    if (timeDelta > 0) {
      const velocity = Math.abs(scrollDelta / timeDelta) * 1000; // px per second
      const direction: ScrollDirection = scrollDelta > 0 ? 'down' : scrollDelta < 0 ? 'up' : 'none';
      const category = getVelocityCategory(velocity);

      setVelocityData({
        velocity,
        direction,
        category,
        isScrolling: true
      });

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set scroll stop timeout
      scrollTimeout.current = setTimeout(() => {
        setVelocityData(prev => ({
          ...prev,
          velocity: 0,
          isScrolling: false,
          direction: 'none'
        }));
      }, SCROLL_STOP_DELAY);
    }

    lastScrollY.current = currentScrollY;
    lastTime.current = currentTime;
  }, [getVelocityCategory]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastScrollY.current = window.scrollY;
    lastTime.current = Date.now();

    const handleScroll = () => {
      // Cancel previous RAF
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      // Schedule update on next frame
      rafId.current = requestAnimationFrame(updateVelocity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [updateVelocity]);

  return velocityData;
};

// Utility hook for adaptive animation duration based on scroll velocity
export const useVelocityAwareDuration = (
  baseDuration: number = 0.6
): number => {
  const { category, isScrolling } = useScrollVelocity();

  if (!isScrolling) return baseDuration;

  switch (category) {
    case 'slow':
      return baseDuration; // Full animation
    case 'medium':
      return baseDuration * 0.7; // 30% faster
    case 'fast':
      return baseDuration * 0.4; // 60% faster
    default:
      return baseDuration;
  }
};
