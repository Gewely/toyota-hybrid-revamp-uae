import { Variants } from 'framer-motion';

export const scrollAnimationVariants = {
  // Hero Section Animations
  heroTitle: {
    initial: { opacity: 0, y: 60, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }
    },
  },

  heroPrice: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
        delay: 0.2,
      }
    },
  },

  heroCTA: {
    initial: { opacity: 0, y: 30 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3 + i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }
    }),
  },

  // 3D Card Reveal
  card3D: {
    initial: { 
      opacity: 0, 
      rotateX: -15, 
      scale: 0.9,
      y: 50,
    },
    animate: (i: number) => ({
      opacity: 1,
      rotateX: 0,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: i * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }
    }),
  },

  // Clip Path Reveal
  clipReveal: {
    initial: { clipPath: 'inset(0 100% 0 0)' },
    animate: {
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
      }
    },
  },

  // Isometric Flip
  isometricFlip: {
    initial: (i: number) => ({
      opacity: 0,
      rotateY: i % 2 === 0 ? 90 : -90,
      rotateX: i % 3 === 0 ? 45 : -45,
    }),
    animate: {
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }
    },
  },

  // Domino Cascade
  dominoCascade: {
    initial: { 
      opacity: 0, 
      y: -100,
      rotateX: -90,
    },
    animate: (index: number) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const delay = (row + col) * 0.08;
      
      return {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
          duration: 0.6,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }
      };
    },
  },

  // Liquid Morph
  liquidMorph: {
    initial: { 
      scale: 0.8,
      borderRadius: '50%',
    },
    animate: {
      scale: 1,
      borderRadius: '12px',
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
      }
    },
  },

  // Page Flip
  pageFlip: {
    initial: { 
      rotateY: -180,
      opacity: 0,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }
    },
  },

  // Typewriter
  typewriter: {
    initial: { width: 0 },
    animate: {
      width: '100%',
      transition: {
        duration: 2,
        ease: 'linear',
      }
    },
  },

  // Blur Cascade
  blurCascade: {
    initial: { 
      opacity: 0,
      filter: 'blur(10px)',
      y: 20,
    },
    animate: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }
    }),
  },

  // Stagger Container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    },
  },
};

export const easingFunctions = {
  smooth: [0.22, 1, 0.36, 1],
  bouncy: [0.34, 1.56, 0.64, 1],
  sharp: [0.76, 0, 0.24, 1],
  gentle: [0.4, 0, 0.2, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
};

export const calculateStagger = (
  index: number,
  pattern: 'linear' | 'diagonal' | 'radial' = 'linear',
  baseDelay = 0.08,
  columns = 3
): number => {
  switch (pattern) {
    case 'diagonal':
      const row = Math.floor(index / columns);
      const col = index % columns;
      return (row + col) * baseDelay;
    
    case 'radial':
      const centerX = columns / 2;
      const centerY = columns / 2;
      const x = index % columns;
      const y = Math.floor(index / columns);
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      return distance * baseDelay;
    
    case 'linear':
    default:
      return index * baseDelay;
  }
};
