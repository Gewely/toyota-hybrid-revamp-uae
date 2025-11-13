import { Variants } from 'framer-motion';

export const hotspotPinVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 0.8,
  },
  hover: {
    scale: 1.2,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  active: {
    scale: 1.3,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1] // Overshoot easing
    }
  }
};

export const pulseRingVariants: Variants = {
  pulse: (speed: number = 2) => ({
    scale: [1, 1.5, 1],
    opacity: [0.6, 0, 0.6],
    transition: {
      duration: speed,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  })
};

export const detailPanelVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // Smooth cubic-bezier
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

export const detailPanelMobileVariants: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

export const specCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const backgroundFadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
};

export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

export const glowVariants: Variants = {
  idle: {
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
  },
  active: {
    boxShadow: '0 0 40px rgba(0, 240, 255, 0.8)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const scanLineVariants: Variants = {
  animate: {
    y: ['0%', '100%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};
