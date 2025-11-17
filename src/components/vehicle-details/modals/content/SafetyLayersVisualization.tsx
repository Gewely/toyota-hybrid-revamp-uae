import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, AlertTriangle, Radio, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';
import { prefersReducedMotion } from '@/utils/modal-performance';

interface SafetyLayersVisualizationProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const safetyLayers = [
  {
    id: 'active',
    title: 'Active Safety',
    icon: Eye,
    color: 'hsl(var(--primary))',
    features: [
      'Pre-Collision System with Pedestrian Detection',
      'Lane Departure Alert with Steering Assist',
      'Adaptive Cruise Control',
      'Blind Spot Monitoring'
    ]
  },
  {
    id: 'passive',
    title: 'Passive Safety',
    icon: Shield,
    color: 'hsl(var(--success))',
    features: [
      '10 Airbags including Knee Airbags',
      'Reinforced Safety Cell Structure',
      'Energy-Absorbing Crumple Zones',
      'Active Headrests'
    ]
  },
  {
    id: 'driver-assist',
    title: 'Driver Assistance',
    icon: Radio,
    color: 'hsl(var(--warning))',
    features: [
      '360° Panoramic View Monitor',
      'Rear Cross-Traffic Alert',
      'Parking Sensors (Front & Rear)',
      'Automatic High Beam'
    ]
  }
];

const crashRatings = [
  { category: 'Adult Occupant', score: 97, maxScore: 100 },
  { category: 'Child Occupant', score: 89, maxScore: 100 },
  { category: 'Pedestrian', score: 85, maxScore: 100 },
  { category: 'Safety Assist', score: 94, maxScore: 100 }
];

export const SafetyLayersVisualization: React.FC<SafetyLayersVisualizationProps> = ({
  vehicle,
  onTestDrive,
  onBuild
}) => {
  const [activeLayer, setActiveLayer] = useState(0);
  const reducedMotion = prefersReducedMotion();

  return (
    <div className="grid lg:grid-cols-2 gap-6 p-6 bg-background min-h-[70vh]">
      {/* Left: Visual Layers */}
      <div className="space-y-4">
        {/* Car Outline with Layers */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 p-8">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Car Silhouette */}
            <img
              src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg"
              alt="Vehicle Safety"
              className="w-full h-full object-contain opacity-40"
            />

            {/* Safety Layer Rings */}
            {safetyLayers.map((layer, idx) => (
              <motion.div
                key={layer.id}
                className="absolute inset-0 rounded-full border-4"
                style={{
                  borderColor: layer.color,
                  scale: 0.5 + idx * 0.2,
                  opacity: activeLayer === idx ? 1 : 0.3
                }}
                initial={reducedMotion ? {} : { scale: 0.5 + idx * 0.2, opacity: 0 }}
                animate={{ 
                  scale: 0.5 + idx * 0.2,
                  opacity: activeLayer === idx ? 1 : 0.3
                }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              />
            ))}

            {/* Layer Icon */}
            <motion.div
              key={activeLayer}
              initial={reducedMotion ? {} : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute p-6 rounded-full bg-background/80 backdrop-blur-xl border-4"
              style={{ borderColor: safetyLayers[activeLayer].color }}
            >
              {React.createElement(safetyLayers[activeLayer].icon, {
                className: 'w-12 h-12',
                style: { color: safetyLayers[activeLayer].color }
              })}
            </motion.div>
          </div>
        </div>

        {/* Layer Selector */}
        <div className="grid grid-cols-3 gap-3">
          {safetyLayers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(idx)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeLayer === idx
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50 bg-card'
                }`}
              >
                <Icon
                  className={`w-6 h-6 mx-auto mb-2`}
                  style={{ color: activeLayer === idx ? layer.color : 'hsl(var(--muted-foreground))' }}
                />
                <div className={`text-xs font-medium ${
                  activeLayer === idx ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {layer.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Features & Ratings */}
      <div className="space-y-4">
        {/* Active Layer Features */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(safetyLayers[activeLayer].icon, {
              className: 'w-6 h-6',
              style: { color: safetyLayers[activeLayer].color }
            })}
            <h4 className="text-lg font-semibold text-foreground">
              {safetyLayers[activeLayer].title}
            </h4>
          </div>
          <div className="space-y-3">
            {safetyLayers[activeLayer].features.map((feature, idx) => (
              <motion.div
                key={feature}
                initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Crash Test Ratings */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Safety Rating</h4>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {crashRatings.map((rating, idx) => (
              <div key={rating.category}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{rating.category}</span>
                  <span className="text-foreground font-medium">{rating.score}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${rating.score}%` }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-primary/10 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-xs text-foreground">
              5-Star Euro NCAP Safety Rating
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button onClick={onTestDrive} variant="default" className="w-full">
            Experience Safety Features
          </Button>
          {onBuild && (
            <Button onClick={onBuild} variant="outline" className="w-full">
              Build with Safety Package
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
