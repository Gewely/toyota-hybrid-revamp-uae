import { useState, useEffect, useCallback } from 'react';
import { useDeviceInfo } from './use-device-info';

export type QualityTier = 'ultra' | 'high' | 'medium' | 'low';

export interface AdaptiveQualitySettings {
  tier: QualityTier;
  animations: {
    enabled: boolean;
    parallax: boolean;
    blur: boolean;
    complexity: 'full' | 'reduced' | 'minimal';
  };
  images: {
    quality: 'high' | 'medium' | 'low';
    lazyThreshold: number;
  };
  effects: {
    kenBurns: boolean;
    magnetic: boolean;
    shimmer: boolean;
  };
  fps: {
    target: number;
    current: number;
  };
}

const DEFAULT_SETTINGS: Record<QualityTier, Omit<AdaptiveQualitySettings, 'tier' | 'fps'>> = {
  ultra: {
    animations: { enabled: true, parallax: true, blur: true, complexity: 'full' },
    images: { quality: 'high', lazyThreshold: 0.1 },
    effects: { kenBurns: true, magnetic: true, shimmer: true }
  },
  high: {
    animations: { enabled: true, parallax: true, blur: false, complexity: 'reduced' },
    images: { quality: 'medium', lazyThreshold: 0.2 },
    effects: { kenBurns: true, magnetic: false, shimmer: true }
  },
  medium: {
    animations: { enabled: true, parallax: false, blur: false, complexity: 'minimal' },
    images: { quality: 'medium', lazyThreshold: 0.3 },
    effects: { kenBurns: false, magnetic: false, shimmer: true }
  },
  low: {
    animations: { enabled: false, parallax: false, blur: false, complexity: 'minimal' },
    images: { quality: 'low', lazyThreshold: 0.5 },
    effects: { kenBurns: false, magnetic: false, shimmer: false }
  }
};

export const useAdaptiveQuality = (): AdaptiveQualitySettings => {
  const { isMobile, deviceCategory } = useDeviceInfo();
  const [currentFPS, setCurrentFPS] = useState(60);
  const [qualityTier, setQualityTier] = useState<QualityTier>('ultra');

  // Detect device capabilities
  const getInitialTier = useCallback((): QualityTier => {
    if (typeof window === 'undefined') return 'medium';

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2;
    
    // Check memory (if available)
    const memory = (navigator as any).deviceMemory || 4;

    // Mobile devices
    if (isMobile) {
      if (deviceCategory === 'smallMobile' || cores < 4 || memory < 3) {
        return 'medium';
      }
      return 'high';
    }

    // Desktop devices
    if (cores >= 8 && memory >= 8) {
      return 'ultra';
    } else if (cores >= 4 && memory >= 4) {
      return 'high';
    } else {
      return 'medium';
    }
  }, [isMobile, deviceCategory]);

  // Monitor FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = (currentTime: number) => {
      frameCount++;
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setCurrentFPS(fps);
        
        // Auto-adjust quality based on FPS
        if (fps < 45 && qualityTier !== 'low') {
          setQualityTier(prev => {
            if (prev === 'ultra') return 'high';
            if (prev === 'high') return 'medium';
            return 'low';
          });
        } else if (fps >= 58 && qualityTier !== 'ultra') {
          setQualityTier(prev => {
            if (prev === 'low') return 'medium';
            if (prev === 'medium') return 'high';
            if (prev === 'high') return 'ultra';
            return prev;
          });
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [qualityTier]);

  // Initialize tier
  useEffect(() => {
    setQualityTier(getInitialTier());
  }, [getInitialTier]);

  const settings = DEFAULT_SETTINGS[qualityTier];

  return {
    tier: qualityTier,
    ...settings,
    fps: {
      target: qualityTier === 'ultra' ? 60 : qualityTier === 'high' ? 55 : 45,
      current: currentFPS
    }
  };
};
