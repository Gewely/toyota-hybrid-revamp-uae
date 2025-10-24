import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Gauge, Zap } from 'lucide-react';

interface DriveMode {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  power: string;
  torque: string;
  description: string;
  efficiency: number;
}

const driveModes: DriveMode[] = [
  {
    id: 'eco',
    name: 'ECO',
    icon: Leaf,
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-green-500/20',
    power: '180 HP',
    torque: '250 Nm',
    description: 'Optimized for fuel efficiency and range',
    efficiency: 95,
  },
  {
    id: 'normal',
    name: 'NORMAL',
    icon: Gauge,
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    power: '220 HP',
    torque: '320 Nm',
    description: 'Balanced performance for daily driving',
    efficiency: 75,
  },
  {
    id: 'sport',
    name: 'SPORT',
    icon: Zap,
    color: '#ef4444',
    gradient: 'from-red-500/20 to-orange-500/20',
    power: '280 HP',
    torque: '400 Nm',
    description: 'Maximum performance and responsiveness',
    efficiency: 55,
  },
];

interface DriveModeSelectorAnimatedProps {
  onModeChange?: (mode: string) => void;
}

export const DriveModeSelectorAnimated: React.FC<DriveModeSelectorAnimatedProps> = ({
  onModeChange,
}) => {
  const [selectedMode, setSelectedMode] = useState<DriveMode>(driveModes[1]);

  const handleModeChange = (mode: DriveMode) => {
    setSelectedMode(mode);
    onModeChange?.(mode.id);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {driveModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = selectedMode.id === mode.id;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeChange(mode)}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                isActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-accent/30 hover:bg-accent/50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={isActive ? { rotate: 360 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <Icon
                    className="w-8 h-8"
                    style={{ color: isActive ? mode.color : undefined }}
                  />
                </motion.div>
                <span className="font-bold text-sm">{mode.name}</span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br"
                  style={{
                    background: `linear-gradient(135deg, ${mode.color}15, ${mode.color}05)`,
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mode Details Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-2xl bg-gradient-to-br ${selectedMode.gradient} border border-border`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">{selectedMode.name} Mode</h3>
              <p className="text-sm text-muted-foreground">{selectedMode.description}</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {React.createElement(selectedMode.icon, {
                className: 'w-10 h-10',
                style: { color: selectedMode.color },
              })}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-background/50 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Power Output</p>
              <motion.p
                key={selectedMode.power}
                initial={{ scale: 1.2, color: selectedMode.color }}
                animate={{ scale: 1, color: 'inherit' }}
                className="text-2xl font-bold"
              >
                {selectedMode.power}
              </motion.p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Torque</p>
              <motion.p
                key={selectedMode.torque}
                initial={{ scale: 1.2, color: selectedMode.color }}
                animate={{ scale: 1, color: 'inherit' }}
                className="text-2xl font-bold"
              >
                {selectedMode.torque}
              </motion.p>
            </div>
          </div>

          {/* Efficiency Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Efficiency Rating</p>
              <p className="text-xs font-semibold">{selectedMode.efficiency}%</p>
            </div>
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${selectedMode.efficiency}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: selectedMode.color }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Animated Dashboard Visualization */}
      <div className="bg-accent/30 rounded-2xl p-6 border border-border">
        <h4 className="text-sm font-semibold mb-4">Real-Time Dashboard</h4>
        <div className="relative h-40 flex items-center justify-center">
          {/* Speedometer */}
          <svg className="w-full h-full" viewBox="0 0 200 120">
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Active Arc */}
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={selectedMode.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{
                strokeDashoffset: 251.2 - (251.2 * selectedMode.efficiency) / 100,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            {/* Center Text */}
            <text
              x="100"
              y="90"
              textAnchor="middle"
              className="text-3xl font-bold fill-foreground"
            >
              {selectedMode.power.split(' ')[0]}
            </text>
            <text
              x="100"
              y="105"
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {selectedMode.power.split(' ')[1]}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};
