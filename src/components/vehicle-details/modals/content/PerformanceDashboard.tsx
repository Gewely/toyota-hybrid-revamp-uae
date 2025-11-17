import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Zap, Fuel, Wind, Timer, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';
import { prefersReducedMotion } from '@/utils/modal-performance';

interface PerformanceDashboardProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const driveMode = [
  { id: 'eco', label: 'ECO', color: 'hsl(var(--success))' },
  { id: 'normal', label: 'NORMAL', color: 'hsl(var(--primary))' },
  { id: 'sport', label: 'SPORT', color: 'hsl(var(--destructive))' }
];

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  vehicle,
  onTestDrive,
  onBuild
}) => {
  const [selectedMode, setSelectedMode] = useState('normal');
  const [animatedPower, setAnimatedPower] = useState(0);
  const [animatedTorque, setAnimatedTorque] = useState(0);
  const reducedMotion = prefersReducedMotion();

  const modeStats = {
    eco: { power: 250, torque: 320, efficiency: 9.2, acceleration: 8.5 },
    normal: { power: 295, torque: 356, efficiency: 11.8, acceleration: 6.8 },
    sport: { power: 305, torque: 380, efficiency: 13.5, acceleration: 6.2 }
  };

  const stats = modeStats[selectedMode as keyof typeof modeStats];

  useEffect(() => {
    if (reducedMotion) {
      setAnimatedPower(stats.power);
      setAnimatedTorque(stats.torque);
      return;
    }

    const duration = 800;
    const steps = 30;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedPower(Math.round(stats.power * progress));
      setAnimatedTorque(Math.round(stats.torque * progress));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [selectedMode, stats.power, stats.torque, reducedMotion]);

  return (
    <div className="grid lg:grid-cols-2 gap-6 p-6 bg-background min-h-[70vh]">
      {/* Left: Engine Visualization */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 p-8 flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={reducedMotion ? {} : { 
              rotateY: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className="w-64 h-64 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500"
              alt="Engine"
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
          </motion.div>
          
          {/* Mode Indicator Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: driveMode.find(m => m.id === selectedMode)?.color }}
            animate={reducedMotion ? {} : { 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity }
            }}
          />
        </div>

        {/* Drive Mode Selector */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex gap-2 bg-background/80 backdrop-blur-xl rounded-full p-2 border border-border">
            {driveMode.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                  selectedMode === mode.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Performance Stats */}
      <div className="space-y-4">
        {/* Main Power Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            key={`power-${selectedMode}`}
            initial={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Power</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-1">{animatedPower}</div>
            <div className="text-sm text-muted-foreground">Horsepower</div>
          </motion.div>

          <motion.div
            key={`torque-${selectedMode}`}
            initial={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Gauge className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Torque</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-1">{animatedTorque}</div>
            <div className="text-sm text-muted-foreground">Nm</div>
          </motion.div>
        </div>

        {/* Acceleration */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Timer className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">0-100 km/h</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.acceleration}s</div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/60"
              initial={{ width: 0 }}
              animate={{ width: `${(10 - stats.acceleration) * 10}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Fuel Economy */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Fuel className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Fuel Economy</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.efficiency}</div>
          </div>
          <div className="text-sm text-muted-foreground">L/100km (combined)</div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Wind className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-foreground">210</div>
            <div className="text-xs text-muted-foreground">km/h Top Speed</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-foreground">8-Spd</div>
            <div className="text-xs text-muted-foreground">Automatic</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Gauge className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-foreground">4WD</div>
            <div className="text-xs text-muted-foreground">All-Terrain</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onTestDrive} variant="default" className="flex-1">
            Book Test Drive
          </Button>
          {onBuild && (
            <Button onClick={onBuild} variant="outline" className="flex-1">
              Build Yours
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
