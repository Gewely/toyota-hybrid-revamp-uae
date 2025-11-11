import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Disc, Droplets, Wind, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface ShowroomExteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const exteriorImages = [
  'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg',
  'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1440w.jpg',
  'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg'
];

const colors = [
  { name: 'Pearl White', hex: '#FFFFFF', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'] },
  { name: 'Midnight Black', hex: '#1a1a1a', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'] },
  { name: 'Silver Metallic', hex: '#c0c0c0', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'], premium: true },
  { name: 'Graphite Gray', hex: '#4a4a4a', availableIn: ['XLE', 'Limited', 'Platinum'], premium: true },
  { name: 'Deep Blue', hex: '#003366', availableIn: ['Limited', 'Platinum'], premium: true },
  { name: 'Ruby Red', hex: '#8b0000', availableIn: ['Limited', 'Platinum'], premium: true }
];

const wheels = [
  { size: '17"', type: 'Steel', finish: 'Silver', availableIn: ['Base'], image: '#a8a8a8' },
  { size: '18"', type: 'Alloy', finish: 'Silver', availableIn: ['Base', 'XLE'], image: '#c0c0c0' },
  { size: '20"', type: 'Sport', finish: 'Black', availableIn: ['XLE', 'Limited'], image: '#2a2a2a', popular: true },
  { size: '20"', type: 'Premium', finish: 'Chrome', availableIn: ['Limited', 'Platinum'], image: '#e8e8e8' }
];

const paints = [
  { name: 'Solid', premium: false, availableIn: ['Base', 'XLE', 'Limited', 'Platinum'] },
  { name: 'Metallic', premium: true, availableIn: ['Base', 'XLE', 'Limited', 'Platinum'] },
  { name: 'Pearl', premium: true, availableIn: ['XLE', 'Limited', 'Platinum'] },
  { name: 'Matte', premium: true, availableIn: ['Limited', 'Platinum'] }
];

export const ShowroomExteriorContent: React.FC<ShowroomExteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [selectedWheel, setSelectedWheel] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  
  const currentGrade = (vehicle as any).grade || 'Base';

  return (
    <div className="space-y-6 pb-6">
      {/* Image Gallery */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
        <img
          src={exteriorImages[currentImageIndex]}
          alt={`Exterior view ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {exteriorImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Exterior Colors
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {colors.map((color, idx) => {
            const available = color.availableIn.includes(currentGrade);
            return (
              <button
                key={idx}
                onClick={() => available && setSelectedColor(idx)}
                disabled={!available}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg transition ${
                  selectedColor === idx && available
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'hover:bg-muted'
                } ${!available ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-border"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-center">
                  <div className="text-xs font-medium text-foreground">{color.name}</div>
                  {color.premium && (
                    <div className="text-xs text-primary">+Premium</div>
                  )}
                  {!available && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {color.availableIn[0]}+
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold text-foreground">4950</div>
          <div className="text-xs text-muted-foreground">Length (mm)</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold text-foreground">1980</div>
          <div className="text-xs text-muted-foreground">Width (mm)</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold text-foreground">1895</div>
          <div className="text-xs text-muted-foreground">Height (mm)</div>
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {wheels.map((wheel, idx) => {
            const available = wheel.availableIn.includes(currentGrade);
            return (
              <button
                key={idx}
                onClick={() => available && setSelectedWheel(idx)}
                disabled={!available}
                className={`p-3 rounded-lg border-2 transition ${
                  selectedWheel === idx && available
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${!available ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div
                  className="w-full aspect-square rounded-full mb-2 border-4 border-neutral-300 dark:border-neutral-700"
                  style={{ backgroundColor: wheel.image }}
                />
                <div className="text-sm font-semibold text-foreground">{wheel.size}</div>
                <div className="text-xs text-muted-foreground">{wheel.type} - {wheel.finish}</div>
                {!available && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {wheel.availableIn[0]}+
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Paint Finishes */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          Paint Finishes
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {paints.map((paint, idx) => {
            const available = paint.availableIn.includes(currentGrade);
            return (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border border-border bg-card flex items-center justify-between ${
                  !available ? 'opacity-40' : ''
                }`}
              >
                <span className="text-sm font-medium text-foreground">{paint.name}</span>
                <div className="flex items-center gap-2">
                  {paint.premium && (
                    <span className="text-xs text-primary font-semibold">+Premium</span>
                  )}
                  {!available && (
                    <Badge variant="secondary" className="text-xs">
                      {paint.availableIn[0]}+
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
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
        <Button onClick={onBuild || onTestDrive} size="lg" className="flex-1">
          Build Your Vehicle
        </Button>
        <Button onClick={onTestDrive} variant="outline" size="lg" className="flex-1">
          Book Test Drive
        </Button>
      </div>
    </div>
  );
};
