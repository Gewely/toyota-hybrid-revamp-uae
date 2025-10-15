import { useEffect, useRef, useCallback } from 'react';

/**
 * Passive scroll listener with requestAnimationFrame throttling
 * Prevents scroll jank and layout thrash
 * @param callback - Function to call on scroll (receives no parameters)
 * @param deps - Dependencies array for useCallback
 */
export function usePassiveScroll(
  callback: () => void,
  deps: React.DependencyList = []
) {
  const ticking = useRef(false);
  const rafId = useRef<number>();

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      rafId.current = requestAnimationFrame(() => {
        callback();
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [callback, ...deps]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll]);
}
