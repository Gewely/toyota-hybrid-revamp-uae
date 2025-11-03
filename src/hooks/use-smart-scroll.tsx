import { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollState {
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  scrollVelocity: number;
  isScrolling: boolean;
}

export const useSmartScroll = () => {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: null,
    scrollVelocity: 0,
    isScrolling: false,
  });

  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollTimeout = useRef<number>();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastScrollTime.current;
    const scrollDelta = currentScrollY - lastScrollY.current;

    const velocity = timeDelta > 0 ? Math.abs(scrollDelta / timeDelta) * 1000 : 0;
    const direction = scrollDelta > 0 ? 'down' : scrollDelta < 0 ? 'up' : state.scrollDirection;

    setState({
      scrollY: currentScrollY,
      scrollDirection: direction,
      scrollVelocity: velocity,
      isScrolling: true,
    });

    lastScrollY.current = currentScrollY;
    lastScrollTime.current = currentTime;

    // Clear previous timeout
    if (scrollTimeout.current) {
      window.clearTimeout(scrollTimeout.current);
    }

    // Set isScrolling to false after 150ms of no scroll
    scrollTimeout.current = window.setTimeout(() => {
      setState((prev) => ({ ...prev, isScrolling: false }));
    }, 150);
  }, [state.scrollDirection]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 16); // ~60fps
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  return state;
};

// Throttle utility
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
