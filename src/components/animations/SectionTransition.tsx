import { motion } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { useParallax } from '@/hooks/use-parallax';

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  parallaxSpeed?: number;
}

export const SectionTransition = ({ 
  children, 
  className = '',
  parallaxSpeed = 0.2 
}: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const y = useParallax(ref, { speed: parallaxSpeed });

  return (
    <motion.section
      ref={ref}
      className={`relative ${className}`}
      style={{ y }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
};
