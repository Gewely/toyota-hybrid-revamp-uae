import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { useParallax } from '@/hooks/use-parallax';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useVelocityAwareDuration } from '@/hooks/use-scroll-velocity';

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  parallaxSpeed?: number;
  disableParallax?: boolean;
}

export const SectionTransition = ({ 
  children, 
  className = '',
  parallaxSpeed = 0.2,
  disableParallax = false
}: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotionSafe();
  const duration = useVelocityAwareDuration(0.6);
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: '-50px' });

  // Always call hook - use disabled flag instead of conditional
  const y = useParallax(ref, { 
    speed: parallaxSpeed,
    disabled: disableParallax || prefersReducedMotion 
  });

  const variants = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 },
    animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.section
      ref={ref}
      className={`relative lazy-section ${className}`}
      style={{ y, transform: 'translate3d(0, 0, 0)' }}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={variants}
      transition={prefersReducedMotion ? { duration: 0.1 } : { duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
};
