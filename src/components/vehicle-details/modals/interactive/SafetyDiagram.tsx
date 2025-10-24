import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Camera, AlertTriangle, Radio, Eye } from 'lucide-react';

interface SafetyFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  position: { x: string; y: string };
  color: string;
}

const safetyFeatures: SafetyFeature[] = [
  {
    id: 'front',
    name: 'Pre-Collision System',
    description: 'Detects vehicles and pedestrians ahead, automatically applies brakes if collision is imminent',
    icon: AlertTriangle,
    position: { x: '50%', y: '15%' },
    color: '#ef4444',
  },
  {
    id: 'side-left',
    name: 'Blind Spot Monitor',
    description: 'Alerts you when a vehicle is detected in your blind spot during lane changes',
    icon: Eye,
    position: { x: '15%', y: '50%' },
    color: '#f59e0b',
  },
  {
    id: 'side-right',
    name: 'Blind Spot Monitor',
    description: 'Alerts you when a vehicle is detected in your blind spot during lane changes',
    icon: Eye,
    position: { x: '85%', y: '50%' },
    color: '#f59e0b',
  },
  {
    id: 'rear',
    name: 'Rear Cross Traffic Alert',
    description: 'Warns of approaching vehicles when reversing out of parking spaces',
    icon: Radio,
    position: { x: '50%', y: '85%' },
    color: '#8b5cf6',
  },
  {
    id: 'camera',
    name: '360° Camera System',
    description: 'Provides a bird\'s-eye view of your surroundings for easier parking and maneuvering',
    icon: Camera,
    position: { x: '50%', y: '50%' },
    color: '#10b981',
  },
];

interface SafetyDiagramProps {
  className?: string;
}

export const SafetyDiagram: React.FC<SafetyDiagramProps> = ({ className }) => {
  const [activeFeature, setActiveFeature] = useState<SafetyFeature | null>(null);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Interactive Diagram */}
      <div className="relative bg-gradient-to-br from-accent/30 to-background rounded-2xl border-2 border-border overflow-hidden aspect-[4/3]">
        {/* Vehicle Top-Down View */}
        <svg
          className="absolute inset-0 w-full h-full p-8"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vehicle Body */}
          <motion.rect
            x="120"
            y="80"
            width="160"
            height="140"
            rx="20"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Vehicle Windows */}
          <rect x="140" y="100" width="120" height="30" rx="5" fill="hsl(var(--accent))" />
          <rect x="140" y="170" width="120" height="30" rx="5" fill="hsl(var(--accent))" />

          {/* Detection Zones */}
          <AnimatePresence>
            {safetyFeatures.map((feature) => {
              const isActive = activeFeature?.id === feature.id;
              
              // Front zone
              if (feature.id === 'front') {
                return (
                  <motion.path
                    key={feature.id}
                    d="M 150 80 L 200 20 L 250 80 Z"
                    fill={feature.color}
                    opacity={isActive ? 0.4 : 0.2}
                    animate={isActive ? { opacity: [0.2, 0.4, 0.2] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                );
              }
              
              // Rear zone
              if (feature.id === 'rear') {
                return (
                  <motion.path
                    key={feature.id}
                    d="M 150 220 L 200 280 L 250 220 Z"
                    fill={feature.color}
                    opacity={isActive ? 0.4 : 0.2}
                    animate={isActive ? { opacity: [0.2, 0.4, 0.2] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                );
              }
              
              // Left blind spot
              if (feature.id === 'side-left') {
                return (
                  <motion.path
                    key={feature.id}
                    d="M 120 120 L 60 100 L 60 180 L 120 160 Z"
                    fill={feature.color}
                    opacity={isActive ? 0.4 : 0.2}
                    animate={isActive ? { opacity: [0.2, 0.4, 0.2] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                );
              }
              
              // Right blind spot
              if (feature.id === 'side-right') {
                return (
                  <motion.path
                    key={feature.id}
                    d="M 280 120 L 340 100 L 340 180 L 280 160 Z"
                    fill={feature.color}
                    opacity={isActive ? 0.4 : 0.2}
                    animate={isActive ? { opacity: [0.2, 0.4, 0.2] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                );
              }
              
              // 360 camera coverage
              if (feature.id === 'camera') {
                return (
                  <motion.circle
                    key={feature.id}
                    cx="200"
                    cy="150"
                    r="120"
                    fill="none"
                    stroke={feature.color}
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    opacity={isActive ? 0.6 : 0.3}
                    animate={isActive ? { rotate: 360 } : {}}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '200px 150px' }}
                  />
                );
              }
              
              return null;
            })}
          </AnimatePresence>
        </svg>

        {/* Interactive Hotspots */}
        {safetyFeatures.map((feature) => (
          <motion.button
            key={feature.id}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveFeature(activeFeature?.id === feature.id ? null : feature)}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: feature.position.x,
              top: feature.position.y,
            }}
          >
            <motion.div
              animate={
                activeFeature?.id === feature.id
                  ? { scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{ duration: 1, repeat: Infinity }}
              className="relative"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-background shadow-lg"
                style={{ backgroundColor: feature.color }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              {activeFeature?.id === feature.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 rounded-full border-2 border-current"
                  style={{ color: feature.color }}
                />
              )}
            </motion.div>
          </motion.button>
        ))}

        {/* Feature Description Panel */}
        <AnimatePresence>
          {activeFeature && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-xl border-2 shadow-lg"
              style={{ borderColor: activeFeature.color }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: activeFeature.color }}
                >
                  <activeFeature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{activeFeature.name}</h4>
                  <p className="text-sm text-muted-foreground">{activeFeature.description}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {safetyFeatures.map((feature) => {
          const isActive = activeFeature?.id === feature.id;
          return (
            <motion.button
              key={feature.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveFeature(isActive ? null : feature)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                isActive
                  ? 'bg-accent border-primary'
                  : 'bg-accent/30 border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm">{feature.name}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
