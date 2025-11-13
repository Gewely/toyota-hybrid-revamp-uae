import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { hotspotPinVariants, pulseRingVariants, tooltipVariants } from '@/utils/hotspot-animations';

interface HotspotPinProps {
  id: string;
  position: { x: number; y: number };
  icon: LucideIcon;
  title: string;
  glowColor: string;
  pulseSpeed: number;
  isActive: boolean;
  onClick: () => void;
  showTooltip?: boolean;
}

export const HotspotPin: React.FC<HotspotPinProps> = ({
  id,
  position,
  icon: Icon,
  title,
  glowColor,
  pulseSpeed,
  isActive,
  onClick,
  showTooltip = true
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="absolute z-10 cursor-pointer group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      initial="idle"
      animate={isActive ? 'active' : isHovered ? 'hover' : 'idle'}
      variants={hotspotPinVariants}
      role="button"
      aria-label={`View ${title} details`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Pulse Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: glowColor,
          width: '48px',
          height: '48px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        custom={pulseSpeed}
        variants={pulseRingVariants}
        animate="pulse"
      />

      {/* Main Pin */}
      <motion.div
        className="relative w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border-2"
        style={{
          background: `linear-gradient(135deg, ${glowColor}15, ${glowColor}30)`,
          borderColor: glowColor,
          boxShadow: isActive || isHovered 
            ? `0 0 30px ${glowColor}80, inset 0 0 20px ${glowColor}40`
            : `0 0 15px ${glowColor}40, inset 0 0 10px ${glowColor}20`
        }}
      >
        <Icon 
          className="w-6 h-6" 
          style={{ color: glowColor }}
        />
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (isHovered || isActive) && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-14 px-3 py-2 rounded-lg backdrop-blur-xl border whitespace-nowrap pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            borderColor: glowColor,
            boxShadow: `0 0 20px ${glowColor}40`
          }}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <div 
            className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              borderRight: `1px solid ${glowColor}`,
              borderBottom: `1px solid ${glowColor}`
            }}
          />
        </motion.div>
      )}

      {/* Scan Line Effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute w-full h-[2px] left-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
              filter: 'blur(1px)'
            }}
            animate={{
              y: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
