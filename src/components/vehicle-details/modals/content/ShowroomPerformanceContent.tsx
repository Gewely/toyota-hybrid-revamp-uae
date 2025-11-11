import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Zap, Fuel, TrendingUp, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';

interface ShowroomPerformanceContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const performanceMetrics = [
  { icon: Gauge, label: '0-100 km/h', value: '7.1s', color: 'text-red-600 dark:text-red-400' },
  { icon: TrendingUp, label: 'Top Speed', value: '180 km/h', color: 'text-blue-600 dark:text-blue-400' },
  { icon: Fuel, label: 'Fuel Economy', value: '8.5L/100km', color: 'text-green-600 dark:text-green-400' },
  { icon: Zap, label: 'Max Power', value: '268 HP', color: 'text-purple-600 dark:text-purple-400' }
];

const engineSpecs = [
  { label: 'Engine Type', value: '3.5L V6 Twin-Turbo' },
  { label: 'Max Power', value: '268 HP @ 6,000 rpm' },
  { label: 'Max Torque', value: '420 Nm @ 4,000 rpm' },
  { label: 'Transmission', value: '10-Speed Automatic' },
  { label: 'Drive Type', value: 'AWD with Torque Vectoring' },
  { label: 'Fuel Type', value: 'Petrol Premium' }
];

const driveModes = [
  { name: 'Eco', description: 'Maximize fuel efficiency', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  { name: 'Normal', description: 'Balanced performance', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { name: 'Sport', description: 'Enhanced responsiveness', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  { name: 'Off-Road', description: 'Maximum traction', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' }
];

export const ShowroomPerformanceContent: React.FC<ShowroomPerformanceContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [selectedMode, setSelectedMode] = React.useState('Normal');

  return (
    <div className="space-y-6 pb-6">
      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {performanceMetrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 rounded-xl border border-border bg-card"
          >
            <metric.icon className={`w-8 h-8 mb-2 ${metric.color}`} />
            <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
            <div className="text-xs text-muted-foreground">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Engine Specs Table */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Engine Specifications</h4>
        <div className="space-y-2">
          {engineSpecs.map((spec, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition"
            >
              <span className="text-sm text-muted-foreground">{spec.label}</span>
              <span className="text-sm font-semibold text-foreground">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drive Modes */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Drive Mode Selector</h4>
        <div className="grid grid-cols-2 gap-3">
          {driveModes.map((mode, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMode(mode.name)}
              className={`p-3 rounded-lg border-2 transition ${
                selectedMode === mode.name
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={`text-sm font-bold mb-1 ${mode.color}`}>{mode.name}</div>
              <div className="text-xs text-muted-foreground">{mode.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Towing Capacity */}
      <div className="p-4 rounded-xl bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Towing Capacity</h4>
            <p className="text-xs text-muted-foreground">Braked trailer weight</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">3500</div>
            <div className="text-xs text-muted-foreground">kg</div>
          </div>
        </div>
      </div>

      {/* Fuel Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Mountain className="w-4 h-4 text-green-600 dark:text-green-400" />
            <div className="text-sm font-semibold text-foreground">Highway</div>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">7.2L</div>
          <div className="text-xs text-muted-foreground">/100km</div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Fuel className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm font-semibold text-foreground">City</div>
          </div>
          <div className="text-2xl font-bold text-muted-foreground">9.8L</div>
          <div className="text-xs text-muted-foreground">/100km</div>
        </div>
      </div>

      {/* Performance Note */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
        <p className="text-sm text-foreground">
          <strong>Performance Tip:</strong> Sport mode provides sharper throttle response and optimized transmission shift points for spirited driving.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
