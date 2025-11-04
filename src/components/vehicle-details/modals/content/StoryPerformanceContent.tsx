import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Zap, Mountain, Waves, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';

interface StoryPerformanceContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const driveModes = [
  { id: 'eco', name: 'ECO', icon: Leaf, color: 'from-green-500 to-emerald-600', description: 'Maximum efficiency', power: 180, torque: 300 },
  { id: 'normal', name: 'NORMAL', icon: Gauge, color: 'from-blue-500 to-cyan-600', description: 'Balanced performance', power: 268, torque: 420 },
  { id: 'sport', name: 'SPORT', icon: Zap, color: 'from-red-500 to-orange-600', description: 'Maximum power', power: 305, torque: 480 }
];

const terrainCapability = [
  { icon: Waves, title: 'Water Wading', depth: '70cm' },
  { icon: Mountain, title: 'Approach Angle', angle: '32°' },
  { icon: Gauge, title: 'Ground Clearance', height: '225mm' }
];

export const StoryPerformanceContent: React.FC<StoryPerformanceContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [selectedMode, setSelectedMode] = useState(1);

  return (
    <div className="space-y-8 pb-6">
      {/* Hero Performance Visual */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
        <img
          src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-005-2160.jpg"
          alt="Performance showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-3xl font-bold text-white mb-2">Unstoppable Performance</h3>
          <p className="text-white/90">Power meets precision in every journey</p>
        </div>
      </div>

      {/* Drive Mode Selector */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Drive Modes</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {driveModes.map((mode, idx) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(idx)}
              className={`p-4 rounded-xl border-2 transition ${
                selectedMode === idx
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <mode.icon className={`w-8 h-8 mx-auto mb-2 ${selectedMode === idx ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="font-semibold text-sm text-foreground">{mode.name}</div>
            </button>
          ))}
        </div>

        {/* Selected Mode Stats */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${driveModes[selectedMode].color} text-white`}
          >
            <h4 className="text-lg font-bold mb-2">{driveModes[selectedMode].name} Mode</h4>
            <p className="text-white/90 text-sm mb-4">{driveModes[selectedMode].description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold">{driveModes[selectedMode].power}</div>
                <div className="text-white/80 text-sm">Horsepower</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{driveModes[selectedMode].torque}</div>
                <div className="text-white/80 text-sm">Nm Torque</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-xl border border-border bg-card text-center">
          <div className="text-4xl font-bold text-primary mb-2">7.1s</div>
          <div className="text-sm text-muted-foreground">0-100 km/h</div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card text-center">
          <div className="text-4xl font-bold text-primary mb-2">180</div>
          <div className="text-sm text-muted-foreground">km/h Top Speed</div>
        </div>
      </div>

      {/* Terrain Capability */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Terrain Capability</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {terrainCapability.map((terrain, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-muted/50 text-center">
              <terrain.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-foreground mb-1 text-sm">{terrain.title}</h4>
              <p className="text-lg font-bold text-primary">
                {'depth' in terrain && terrain.depth}
                {'angle' in terrain && terrain.angle}
                {'height' in terrain && terrain.height}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Economy */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Hybrid Efficiency</h4>
            <p className="text-sm text-muted-foreground">Save fuel without compromising performance</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">4.5L</div>
            <div className="text-sm text-muted-foreground">/100km</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Book Test Drive
        </Button>
        <Button onClick={onBuild || onClose} variant="outline" size="lg" className="flex-1">
          Build & Price
        </Button>
      </div>
    </div>
  );
};
