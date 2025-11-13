import React from 'react';
import { motion } from 'framer-motion';
import { specCardVariants } from '@/utils/hotspot-animations';
import { HotspotSpec } from '@/data/interior-hotspots';

interface SpecCardProps {
  spec: HotspotSpec;
  glowColor: string;
}

export const SpecCard: React.FC<SpecCardProps> = ({ spec, glowColor }) => {
  return (
    <motion.div
      variants={specCardVariants}
      className="p-3 rounded-lg backdrop-blur-sm border transition-all hover:scale-105"
      style={{
        background: spec.highlight 
          ? `linear-gradient(135deg, ${glowColor}15, ${glowColor}05)` 
          : 'rgba(255, 255, 255, 0.03)',
        borderColor: spec.highlight ? `${glowColor}60` : 'rgba(255, 255, 255, 0.1)',
      }}
      whileHover={{
        borderColor: glowColor,
        boxShadow: `0 0 20px ${glowColor}40`
      }}
    >
      <div className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">
        {spec.label}
      </div>
      <div 
        className="text-base font-bold"
        style={{ color: spec.highlight ? glowColor : 'hsl(var(--foreground))' }}
      >
        {spec.value}
      </div>
    </motion.div>
  );
};
