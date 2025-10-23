import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, Armchair, Wind, Volume2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface StoryInteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
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
  onTestDrive
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % interiorImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + interiorImages.length) % interiorImages.length);

  return (
    <div className="space-y-8 pb-6">
      {/* Hero Image Gallery */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900">
        <motion.img
          key={currentImage}
          src={interiorImages[currentImage]}
          alt={`Interior view ${currentImage + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur transition"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur transition"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {interiorImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentImage ? 'bg-white w-8' : 'bg-white/60'
              }`}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
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

      {/* Material Selector */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Interior Materials</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {materials.map((material, idx) => (
            <button
              key={idx}
              disabled={!material.available}
              className={`p-4 rounded-xl border-2 transition ${
                material.available
                  ? 'border-border hover:border-primary cursor-pointer'
                  : 'border-border opacity-50 cursor-not-allowed'
              }`}
            >
              <div
                className="w-full aspect-square rounded-lg mb-2"
                style={{ backgroundColor: material.color }}
              />
              <p className="text-sm font-medium text-foreground">{material.name}</p>
              {!material.available && (
                <Badge variant="secondary" className="mt-1 text-xs">Coming Soon</Badge>
              )}
            </button>
          ))}
        </div>
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
          Book Interior Experience
        </Button>
        <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
          Explore More
        </Button>
      </div>
    </div>
  );
};
