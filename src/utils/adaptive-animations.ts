
import { Variants, Transition } from 'framer-motion';

interface DeviceCapabilities {
  isMobile: boolean;
  isSlowScroll: boolean;
  prefersReducedMotion: boolean;
}

export const createAdaptiveVariants = (capabilities: DeviceCapabilities): Record<string, Variants> => {
  const { isMobile, isSlowScroll, prefersReducedMotion } = capabilities;

  // Faster mobile timing configurations
  const fastTiming = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };
  const mediumTiming = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };
  const slowTiming = { duration: 0.5, ease: [0.4, 0, 0.2, 1] };

  // Choose timing based on device and scroll speed
  const baseTiming = prefersReducedMotion 
    ? { duration: 0.15, ease: "linear" } 
    : isMobile 
      ? (isSlowScroll ? mediumTiming : fastTiming)
      : slowTiming;

  const staggerDelay = isMobile ? 0.05 : 0.12;
  const initialDelay = isMobile ? 0.05 : 0.2;

  return {
    fadeInUp: {
      hidden: { 
        opacity: 0, 
        y: isMobile ? 20 : 40,
        transform: `translate3d(0, ${isMobile ? 20 : 40}px, 0)`,
        willChange: 'transform, opacity'
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'auto',
        transition: baseTiming
      }
    },
    fadeInScale: {
      hidden: { 
        opacity: 0, 
        scale: isMobile ? 0.97 : 0.95,
        transform: `translate3d(0, 0, 0) scale(${isMobile ? 0.97 : 0.95})`,
        willChange: 'transform, opacity'
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
        willChange: 'auto',
        transition: baseTiming
      }
    },
    slideInLeft: {
      hidden: { 
        opacity: 0, 
        x: isMobile ? -30 : -60,
        transform: `translate3d(${isMobile ? -30 : -60}px, 0, 0)`,
        willChange: 'transform, opacity'
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'auto',
        transition: baseTiming
      }
    },
    slideInRight: {
      hidden: { 
        opacity: 0, 
        x: isMobile ? 30 : 60,
        transform: `translate3d(${isMobile ? 30 : 60}px, 0, 0)`,
        willChange: 'transform, opacity'
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'auto',
        transition: baseTiming
      }
    },
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: initialDelay,
          ease: "easeOut"
        }
      }
    }
  };
};

export const createAdaptiveMicroAnimations = (capabilities: DeviceCapabilities) => {
  const { isMobile, prefersReducedMotion } = capabilities;

  if (prefersReducedMotion) {
    return {
      luxuryHover: { transition: { duration: 0.1 } },
      buttonHover: { transition: { duration: 0.1 } }
    };
  }

  return {
    luxuryHover: {
      scale: isMobile ? 1.01 : 1.02,
      y: isMobile ? -2 : -4,
      transform: `translate3d(0, ${isMobile ? -2 : -4}px, 0) scale(${isMobile ? 1.01 : 1.02})`,
      boxShadow: isMobile 
        ? "0 4px 12px -2px rgba(0, 0, 0, 0.08)" 
        : "0 12px 24px -4px rgba(0, 0, 0, 0.12)",
      transition: { duration: isMobile ? 0.15 : 0.25, ease: [0.4, 0, 0.2, 1] }
    },
    buttonHover: {
      scale: isMobile ? 1.01 : 1.02,
      y: isMobile ? -1 : -2,
      transform: `translate3d(0, ${isMobile ? -1 : -2}px, 0) scale(${isMobile ? 1.01 : 1.02})`,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
    }
  };
};
