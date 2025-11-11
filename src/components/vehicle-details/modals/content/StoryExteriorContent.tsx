import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Wind, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';

interface StoryExteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const exteriorFeatures = [
  { title: 'LED Matrix Headlights', description: 'Adaptive beam pattern for optimal visibility' },
  { title: 'Power Liftgate', description: 'Hands-free access with kick sensor' },
  { title: 'Roof Rails', description: 'Integrated design for adventure gear' },
  { title: 'Sport Wheels', description: '20" alloy wheels with all-terrain capability' }
];

export const StoryExteriorContent: React.FC<StoryExteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  return (
    <div className="space-y-8 pb-6">
      <div className="relative aspect-video rounded-2xl overflow-hidden">
        <img src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-2160.jpg" alt="Exterior" className="w-full h-full object-cover" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Design Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exteriorFeatures.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="p-4 rounded-xl border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onTestDrive} size="lg" className="flex-1">Book Test Drive</Button>
        <Button onClick={onBuild || onClose} variant="outline" size="lg" className="flex-1">Customize Exterior</Button>
      </div>
    </div>
  );
};
