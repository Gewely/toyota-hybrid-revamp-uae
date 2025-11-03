/**
 * GPU Acceleration Utilities
 * Centralized management for GPU layer optimization
 */

export interface GPULayerOptions {
  force?: boolean;
  properties?: string[];
}

/**
 * Styles to force GPU layer creation
 */
export const applyGPULayer = (options: GPULayerOptions = {}): React.CSSProperties => {
  const { force = true, properties = ['transform', 'opacity'] } = options;

  if (!force) return {};

  return {
    transform: 'translate3d(0, 0, 0)',
    willChange: properties.join(', '),
    backfaceVisibility: 'hidden' as const,
    perspective: 1000
  };
};

/**
 * Cleanup GPU layer after animation
 */
export const cleanupGPULayer = (): React.CSSProperties => ({
  willChange: 'auto'
});

/**
 * GPU-optimized styles for animations
 */
export const gpuOptimized = {
  forceLayer: {
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000
  },
  removeLayer: {
    willChange: 'auto'
  }
};

/**
 * Performance budget tracker
 */
class PerformanceBudget {
  private activeAnimations = 0;
  private readonly MAX_ANIMATIONS = 3;
  private readonly MAX_FRAME_TIME = 16; // ~60fps

  canAnimate(): boolean {
    return this.activeAnimations < this.MAX_ANIMATIONS;
  }

  startAnimation(): boolean {
    if (this.canAnimate()) {
      this.activeAnimations++;
      return true;
    }
    console.warn('🚗 Performance Budget: Max animations reached');
    return false;
  }

  endAnimation(): void {
    this.activeAnimations = Math.max(0, this.activeAnimations - 1);
  }

  measureFrame(callback: () => void): void {
    const start = performance.now();
    callback();
    const duration = performance.now() - start;

    if (duration > this.MAX_FRAME_TIME) {
      console.warn(`🚗 Performance Budget: Frame took ${duration.toFixed(2)}ms (target: ${this.MAX_FRAME_TIME}ms)`);
    }
  }

  getActiveCount(): number {
    return this.activeAnimations;
  }
}

export const performanceBudget = new PerformanceBudget();

/**
 * Check if GPU acceleration is supported
 */
export const isGPUAccelerationSupported = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
};

/**
 * Optimize transform for GPU
 */
export const optimizeTransform = (
  x: number = 0,
  y: number = 0,
  z: number = 0,
  scale: number = 1,
  rotate: number = 0
): string => {
  return `translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotate(${rotate}deg)`;
};

/**
 * CSS class names for GPU optimization
 */
export const gpuClassNames = {
  accelerated: 'transform-gpu will-change-transform',
  cleanup: 'will-change-auto'
};

/**
 * Hook-friendly GPU layer manager
 */
export const useGPULayer = () => {
  const enable = () => applyGPULayer();
  const disable = () => cleanupGPULayer();
  
  return { enable, disable };
};
