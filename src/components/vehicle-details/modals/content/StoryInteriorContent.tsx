import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Armchair, Wind, Volume2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';

interface StoryInteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const interiorImages = [
  'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg',
  'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true'
];

const luxuryFeatures = [
  { icon: Armchair, title: 'Premium Seating', description: 'Hand-stitched leather with memory function' },
  { icon: Wind, title: 'Climate Control', description: 'Multi-zone automatic climate system' },
  { icon: Volume2, title: 'JBL Premium Audio', description: '14-speaker surround sound system' },
  { icon: Palette, title: 'Ambient Lighting', description: '64-color customizable mood lighting' }
];

export const StoryInteriorContent: React.FC<StoryInteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="space-y-8 pb-6">
      {/* Hero Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden">
        <img src={interiorImages[currentImage]} alt="Interior" className="w-full h-full object-cover" />
      </div>

      {/* Luxury Features */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Luxury Redefined</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {luxuryFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition"
            >
              <feature.icon className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onTestDrive} size="lg" className="flex-1">Book Test Drive</Button>
        <Button onClick={onBuild || onClose} variant="outline" size="lg" className="flex-1">Build & Price</Button>
      </div>
    </div>
  );
};
