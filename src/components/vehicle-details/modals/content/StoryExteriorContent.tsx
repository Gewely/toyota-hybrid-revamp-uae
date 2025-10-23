import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Wind, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface StoryExteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
}

const colors = [
  { name: 'Pearl White', code: '#f8f8f8', popular: true },
  { name: 'Graphite Gray', code: '#4a4a4a', popular: true },
  { name: 'Midnight Black', code: '#0a0a0a', popular: false },
  { name: 'Silver Metallic', code: '#c0c0c0', popular: false },
  { name: 'Dark Red', code: '#8b0000', popular: false },
  { name: 'Desert Beige', code: '#d2b48c', popular: false }
];

const exteriorFeatures = [
  { title: 'LED Matrix Headlights', description: 'Adaptive beam pattern for optimal visibility' },
  { title: 'Power Liftgate', description: 'Hands-free access with kick sensor' },
  { title: 'Roof Rails', description: 'Integrated design for adventure gear' },
  { title: 'Sport Wheels', description: '20" alloy wheels with all-terrain capability' }
];

const awards = [
  { title: 'Best Design Award', year: '2024' },
  { title: 'iF Design Award', year: '2024' }
];

export const StoryExteriorContent: React.FC<StoryExteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive
}) => {
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="space-y-8 pb-6">
      {/* Hero Exterior Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
        <img
          src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg"
          alt="Exterior design"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-3xl font-bold text-white mb-2">Sculpted for Performance</h3>
          <p className="text-white/90">Every curve designed with purpose</p>
        </div>
      </div>

      {/* Color Selector */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Exterior Colors</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColor(idx)}
              className="relative group"
            >
              <div
                className={`w-full aspect-square rounded-xl border-4 transition ${
                  selectedColor === idx
                    ? 'border-primary scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: color.code }}
              />
              {color.popular && (
                <Badge className="absolute -top-2 -right-2 text-xs">Popular</Badge>
              )}
              <p className="text-xs text-center mt-2 text-foreground font-medium group-hover:text-primary transition">
                {color.name}
              </p>
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-semibold text-foreground">{colors[selectedColor].name}</span>
        </p>
      </div>

      {/* Design Features */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Design Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exteriorFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <h4 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Aerodynamics */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">Aerodynamic Excellence</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Advanced wind tunnel testing results in a 0.32 drag coefficient for improved efficiency and reduced wind noise.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0.32</div>
                <div className="text-xs text-muted-foreground">Drag Coefficient</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">68dB</div>
                <div className="text-xs text-muted-foreground">Cabin Noise (100km/h)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Awards */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Design Recognition
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {awards.map((award, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-muted/50 text-center">
              <div className="text-sm font-semibold text-foreground">{award.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{award.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-muted/30">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">4950</div>
          <div className="text-xs text-muted-foreground mt-1">Length (mm)</div>
        </div>
        <div className="text-center border-x border-border">
          <div className="text-2xl font-bold text-primary">1980</div>
          <div className="text-xs text-muted-foreground mt-1">Width (mm)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">1895</div>
          <div className="text-xs text-muted-foreground mt-1">Height (mm)</div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          See in Showroom
        </Button>
        <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
          View All Colors
        </Button>
      </div>
    </div>
  );
};
