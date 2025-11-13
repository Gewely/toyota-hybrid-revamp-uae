import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HotspotPin } from './HotspotPin';
import { Hotspot } from '@/data/interior-hotspots';
import { backgroundFadeVariants } from '@/utils/hotspot-animations';

interface HotspotCanvasProps {
  backgroundImage: string;
  hotspots: Hotspot[];
  activeHotspotId: string | null;
  onHotspotClick: (hotspot: Hotspot) => void;
  currentGrade: string;
}

export const HotspotCanvas: React.FC<HotspotCanvasProps> = ({
  backgroundImage,
  hotspots,
  activeHotspotId,
  onHotspotClick,
  currentGrade
}) => {
  // Filter hotspots based on grade availability
  const visibleHotspots = hotspots.filter(hotspot => 
    hotspot.gradeAvailability.includes(currentGrade)
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Background Image with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundImage}
          className="absolute inset-0"
          variants={backgroundFadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <img 
            src={backgroundImage} 
            alt="Vehicle showcase"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Cyberpunk Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Hotspot Pins */}
      {visibleHotspots.map((hotspot) => (
        <HotspotPin
          key={hotspot.id}
          id={hotspot.id}
          position={hotspot.position}
          icon={hotspot.icon}
          title={hotspot.title}
          glowColor={hotspot.glowColor}
          pulseSpeed={hotspot.pulseSpeed}
          isActive={activeHotspotId === hotspot.id}
          onClick={() => onHotspotClick(hotspot)}
        />
      ))}

      {/* Scan Line Animation */}
      <motion.div
        className="absolute w-full h-[2px] left-0 pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
          filter: 'blur(2px)'
        }}
        animate={{
          y: ['0%', '100%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};
