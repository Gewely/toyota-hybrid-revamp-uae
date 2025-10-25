import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ParallaxBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Different layers move at different speeds for parallax effect
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky Layer */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"
      />
      
      {/* Mountain Layer */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-0 left-0 right-0 h-1/3"
      >
        <svg 
          viewBox="0 0 1200 300" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,300 L0,150 Q300,50 600,150 T1200,150 L1200,300 Z" 
            fill="hsl(var(--muted))"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Foreground Layer */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute bottom-0 left-0 right-0 h-1/4"
      >
        <svg 
          viewBox="0 0 1200 200" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,200 L0,100 Q300,20 600,100 T1200,100 L1200,200 Z" 
            fill="hsl(var(--muted))"
            opacity="0.5"
          />
        </svg>
      </motion.div>
    </div>
  );
};