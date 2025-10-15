import { useState, useEffect } from 'react';

/**
 * Hook to track visual viewport changes (iOS browser chrome)
 * Returns viewport height and safe-area-inset-bottom
 * Critical for sticky nav positioning on mobile browsers
 */
export function useVisualViewport() {
  const [viewportHeight, setViewportHeight] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return window.visualViewport?.height || window.innerHeight;
  });

  const [safeAreaBottom, setSafeAreaBottom] = useState(() => {
    if (typeof window === 'undefined') return 0;
    // Get computed safe area inset
    const computed = window.getComputedStyle(document.documentElement);
    const safeArea = computed.getPropertyValue('--safe-area-inset-bottom');
    return parseInt(safeArea) || 0;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const vv = window.visualViewport;
    
    const handleResize = () => {
      setViewportHeight(vv.height);
      
      // Update CSS custom property for use in components
      document.documentElement.style.setProperty(
        '--viewport-height',
        `${vv.height}px`
      );
    };

    const handleScroll = () => {
      // iOS browser chrome affects viewport on scroll
      setViewportHeight(vv.height);
    };

    // Initial set
    handleResize();

    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleScroll);

    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { viewportHeight, safeAreaBottom };
}
