import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Zap, Fuel, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';

interface ShowroomPerformanceContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
}

const engineSpecs = [
  { label: 'Engine Type', value: '3.5L V6 Twin-Turbo Hybrid' },
  { label: 'Max Power', value: '268 HP @ 6,000 rpm' },
  { label: 'Max Torque', value: '420 Nm @ 4,000 rpm' },
  { label: 'Transmission', value: '10-Speed Automatic' },
  { label: 'Drive Type', value: 'AWD with Torque Vectoring' },
  { label: 'Fuel Type', value: 'Petrol + Electric Hybrid' }
];

const performanceMetrics = [
  { icon: Gauge, label: '0-100 km/h', value: '7.1s', color: 'text-red-600 dark:text-red-400' },
  { icon: TrendingUp, label: 'Top Speed', value: '180 km/h', color: 'text-blue-600 dark:text-blue-400' },
  { icon: Fuel, label: 'Fuel Economy', value: '4.5L/100km', color: 'text-green-600 dark:text-green-400' },
  { icon: Zap, label: 'EV Range', value: '65 km', color: 'text-purple-600 dark:text-purple-400' }
];

export const ShowroomPerformanceContent: React.FC<ShowroomPerformanceContentProps> = ({
  vehicle,
  onClose,
  onTestDrive
}) => {
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

      {/* Power Curve Visualization */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
        <h4 className="font-semibold text-foreground mb-3">Power & Torque Curves</h4>
        <div className="aspect-[2/1] rounded-lg bg-card flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-2 text-primary" />
            <p className="text-sm">Interactive power curve visualization</p>
          </div>
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
          <div className="text-sm font-semibold text-foreground mb-1">Hybrid Mode</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">4.5L</div>
          <div className="text-xs text-muted-foreground">/100km combined</div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="text-sm font-semibold text-foreground mb-1">Standard Engine</div>
          <div className="text-2xl font-bold text-muted-foreground">8.2L</div>
          <div className="text-xs text-muted-foreground">/100km combined</div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Test Performance
        </Button>
        <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
          Spec Comparison
        </Button>
      </div>
    </div>
  );
};
