import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, Armchair, Wind, Volume2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';
import { ColorPickerInteractive } from '../interactive/ColorPickerInteractive';
import { ImageViewer360 } from '../interactive/ImageViewer360';

interface StoryInteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const interiorImages = [
  'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg',
  'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true',
  'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg'
];

const luxuryFeatures = [
  { icon: Armchair, title: 'Premium Seating', description: 'Hand-stitched leather with memory function' },
  { icon: Wind, title: 'Climate Control', description: 'Multi-zone automatic climate system' },
  { icon: Volume2, title: 'JBL Premium Audio', description: '14-speaker surround sound system' },
  { icon: Palette, title: 'Ambient Lighting', description: '64-color customizable mood lighting' }
];

const materials = [
  { name: 'Black Leather', color: '#1a1a1a', available: true },
  { name: 'Tan Leather', color: '#c19a6b', available: true },
  { name: 'Gray Fabric', color: '#808080', available: true },
  { name: 'Brown Leather', color: '#654321', available: false }
];

export const StoryInteriorContent: React.FC<StoryInteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % interiorImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + interiorImages.length) % interiorImages.length);

  return (
    <div className="space-y-8 pb-6">
      {/* 360 Interior Viewer */}
      <div className="mb-6">
        <ImageViewer360 images={interiorImages} title="Interior 360° View" />
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

      {/* Interactive Color Picker */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Interior Materials</h3>
        <ColorPickerInteractive onColorChange={(color) => console.log('Selected:', color)} />
      </div>

      {/* Comfort Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-muted/50">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">95cm</div>
          <div className="text-sm text-muted-foreground mt-1">Rear Legroom</div>
        </div>
        <div className="text-center border-x border-border">
          <div className="text-3xl font-bold text-primary">14</div>
          <div className="text-sm text-muted-foreground mt-1">JBL Speakers</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">64</div>
          <div className="text-sm text-muted-foreground mt-1">LED Colors</div>
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
