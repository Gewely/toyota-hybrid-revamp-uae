/**
 * Modal Performance Utilities
 * Shared utilities for optimizing modal performance
 */

// Image preloader with abort support
export const preloadImage = (src: string, signal?: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };

    if (signal) {
      signal.addEventListener('abort', () => {
        cleanup();
        reject(new Error('Image preload aborted'));
      });
    }

    img.onload = () => {
      cleanup();
      resolve();
    };
    
    img.onerror = () => {
      cleanup();
      reject(new Error(`Failed to preload image: ${src}`));
    };
    
    img.src = src;
  });
};

// Batch preload images
export const preloadImages = async (urls: string[], signal?: AbortSignal): Promise<void> => {
  await Promise.all(urls.map(url => preloadImage(url, signal)));
};

// Animation budget manager
class AnimationBudget {
  private activeAnimations = 0;
  private maxConcurrent = 3;

  canAnimate(): boolean {
    return this.activeAnimations < this.maxConcurrent;
  }

  acquire(): () => void {
    this.activeAnimations++;
    return () => {
      this.activeAnimations = Math.max(0, this.activeAnimations - 1);
    };
  }

  reset(): void {
    this.activeAnimations = 0;
  }
}

export const animationBudget = new AnimationBudget();

// Check if reduced motion is preferred
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Get optimal image format
export const getOptimalImageSrc = (baseUrl: string, width: number): string => {
  const supportsWebP = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
  
  if (supportsWebP) {
    return `${baseUrl}?w=${width}&fm=webp&q=85`;
  }
  return `${baseUrl}?w=${width}&q=85`;
};

// Virtualization helper - check if element is in viewport
export const isInViewport = (
  element: { x: number; y: number },
  viewport: { width: number; height: number },
  buffer = 200
): boolean => {
  return (
    element.x >= -buffer &&
    element.x <= viewport.width + buffer &&
    element.y >= -buffer &&
    element.y <= viewport.height + buffer
  );
};
