import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Disc, Droplets, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';
import { ImageViewer360 } from '../interactive/ImageViewer360';
import { ColorPickerInteractive } from '../interactive/ColorPickerInteractive';

interface ShowroomExteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
}

const wheels = [
  { size: '18"', type: 'Alloy', finish: 'Silver', image: '#c0c0c0' },
  { size: '20"', type: 'Sport', finish: 'Black', image: '#2a2a2a', popular: true },
  { size: '20"', type: 'Premium', finish: 'Chrome', image: '#e8e8e8' }
];

const paints = [
  { name: 'Solid', premium: false },
  { name: 'Metallic', premium: true },
  { name: 'Pearl', premium: true },
  { name: 'Matte', premium: true }
];

export const ShowroomExteriorContent: React.FC<ShowroomExteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive
}) => {
  const [selectedWheel, setSelectedWheel] = useState(1);
  const [rotation, setRotation] = useState(0);

  return (
    <div className="space-y-6 pb-6">
      {/* Interactive 360° Viewer with Color Picker */}
      <ImageViewer360 
        images={[
          'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg',
          'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1440w.jpg',
          'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg'
        ]}
        title="Exterior 360° View"
        description="Drag horizontally to rotate"
      />

      {/* Interactive Color Picker */}
      <ColorPickerInteractive onColorChange={(color) => console.log('Color changed:', color)} />

      {/* Dimensions */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold text-foreground">4950</div>
          <div className="text-xs text-muted-foreground">Length</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold text-foreground">1980</div>
          <div className="text-xs text-muted-foreground">Width</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold text-foreground">1895</div>
          <div className="text-xs text-muted-foreground">Height</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold text-foreground">2850</div>
          <div className="text-xs text-muted-foreground">Wheelbase</div>
        </div>
      </div>

      {/* Wheel Options */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Disc className="w-4 h-4" />
          Wheel Options
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {wheels.map((wheel, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWheel(idx)}
              className={`p-3 rounded-lg border-2 transition ${
                selectedWheel === idx
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div
                className="w-full aspect-square rounded-full mb-2 border-4 border-neutral-300 dark:border-neutral-700"
                style={{ backgroundColor: wheel.image }}
              />
              <div className="text-sm font-semibold text-foreground">{wheel.size}</div>
              <div className="text-xs text-muted-foreground">{wheel.type} - {wheel.finish}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Paint Finishes */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          Paint Finishes
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {paints.map((paint, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{paint.name}</span>
              {paint.premium && (
                <span className="text-xs text-primary font-semibold">+Premium</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Aerodynamic Efficiency */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1 text-sm">Aerodynamic Design</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Wind-tunnel tested for optimal efficiency and reduced noise
            </p>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">0.32</div>
                <div className="text-xs text-muted-foreground">Cd Coefficient</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Customize Exterior
        </Button>
        <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
          Compare Models
        </Button>
      </div>
    </div>
  );
};
