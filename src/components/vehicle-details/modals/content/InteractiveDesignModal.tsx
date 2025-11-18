import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleModel } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Maximize2, Zap } from 'lucide-react';
import { EXTERIOR_COLORS, WHEEL_OPTIONS, EXTERIOR_ZONES, DESIGN_PHILOSOPHY } from '@/data/design-data';
import { contextualHaptic } from '@/utils/haptic';

interface InteractiveDesignModalProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const InteractiveDesignModal: React.FC<InteractiveDesignModalProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [selectedColor, setSelectedColor] = useState(EXTERIOR_COLORS[0]);
  const [selectedWheel, setSelectedWheel] = useState(WHEEL_OPTIONS[0]);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  const vehicleImage = useMemo(() => {
    return vehicle.image || 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg';
  }, [vehicle]);

  const handleColorChange = (color: typeof EXTERIOR_COLORS[0]) => {
    setSelectedColor(color);
    contextualHaptic.selectionChange();
  };

  const handleWheelChange = (wheel: typeof WHEEL_OPTIONS[0]) => {
    setSelectedWheel(wheel);
    contextualHaptic.selectionChange();
  };

  const handleZoneClick = (zoneId: string) => {
    setActiveZone(activeZone === zoneId ? null : zoneId);
    contextualHaptic.buttonPress();
  };

  return (
    <div className="w-full h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Explore Design</h2>
            <p className="text-sm text-muted-foreground">Customize and explore every detail</p>
          </div>
          <Badge variant="secondary" className="gap-2">
            <Palette className="w-3 h-3" />
            Interactive 3D View
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
        {/* 3D Viewer Section */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted rounded-2xl overflow-hidden group">
            {/* Vehicle Image with Color Filter */}
            <motion.div
              key={selectedColor.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
              style={{
                filter: selectedColor.category === 'metallic' ? 'contrast(1.1) saturate(1.2)' : 'none'
              }}
            >
              <img
                src={vehicleImage}
                alt={`${vehicle.name} in ${selectedColor.name}`}
                className="w-full h-full object-contain p-8"
              />
            </motion.div>

            {/* Clickable Zones */}
            {EXTERIOR_ZONES.map((zone) => (
              <motion.button
                key={zone.id}
                className="absolute w-8 h-8 rounded-full bg-primary/80 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                style={{
                  left: `${zone.position.x}%`,
                  top: `${zone.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleZoneClick(zone.id)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Maximize2 className="w-4 h-4 text-primary-foreground" />
              </motion.button>
            ))}

            {/* Zone Detail Overlay */}
            <AnimatePresence>
              {activeZone && EXTERIOR_ZONES.find(z => z.id === activeZone) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-xl rounded-xl p-4 border border-border shadow-2xl"
                >
                  {(() => {
                    const zone = EXTERIOR_ZONES.find(z => z.id === activeZone)!;
                    return (
                      <>
                        <h3 className="font-semibold text-lg text-foreground mb-1">{zone.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{zone.description}</p>
                        <ul className="space-y-1">
                          {zone.specs.map((spec, i) => (
                            <li key={i} className="text-xs text-foreground flex items-center gap-2">
                              <Zap className="w-3 h-3 text-primary" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Color Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Exterior Color</h3>
            <div className="flex gap-3 flex-wrap">
              {EXTERIOR_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color)}
                  className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                    selectedColor.id === color.id
                      ? 'border-primary ring-4 ring-primary/20 scale-110'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor.id === color.id && (
                    <motion.div
                      layoutId="color-check"
                      className="absolute inset-0 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedColor.name} • {selectedColor.category}
            </p>
          </div>

          {/* Wheel Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Wheel Options</h3>
            <div className="grid grid-cols-3 gap-3">
              {WHEEL_OPTIONS.map((wheel) => (
                <button
                  key={wheel.id}
                  onClick={() => handleWheelChange(wheel)}
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                    selectedWheel.id === wheel.id
                      ? 'border-primary ring-4 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img src={wheel.image} alt={wheel.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs font-semibold text-white">{wheel.size}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedWheel.name} • {selectedWheel.size}
              {selectedWheel.price > 0 && ` • +AED ${selectedWheel.price.toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Design Philosophy Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Design Philosophy</h3>
            <p className="text-sm text-muted-foreground">
              Every element crafted for purpose and beauty
            </p>
          </div>

          <div className="space-y-4">
            {DESIGN_PHILOSOPHY.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-xl p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="pt-4 space-y-3">
            <Button
              onClick={onBuild || onTestDrive}
              className="w-full"
              size="lg"
            >
              Build Your {vehicle.name}
            </Button>
            <Button
              onClick={onTestDrive}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Schedule Test Drive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
