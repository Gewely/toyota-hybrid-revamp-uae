import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, RotateCcw, Eye } from 'lucide-react';

interface Color {
  name: string;
  hex: string;
  finish: 'Metallic' | 'Pearlescent' | 'Matte' | 'Solid';
  premium?: boolean;
  popular?: boolean;
}

const colors: Color[] = [
  { name: 'Supersonic Red', hex: '#DC143C', finish: 'Metallic', premium: true, popular: true },
  { name: 'Pearl White', hex: '#F8F8F8', finish: 'Pearlescent' },
  { name: 'Attitude Black', hex: '#0D0D0D', finish: 'Metallic', popular: true },
  { name: 'Platinum Silver', hex: '#C0C0C0', finish: 'Metallic' },
  { name: 'Nebula Blue', hex: '#1E3A8A', finish: 'Pearlescent', premium: true },
  { name: 'Graphite Storm', hex: '#52525B', finish: 'Matte', premium: true },
  { name: 'Bronze Age', hex: '#CD7F32', finish: 'Metallic', premium: true },
  { name: 'Midnight Blue', hex: '#191970', finish: 'Pearlescent' },
];

interface ColorPickerInteractiveProps {
  onColorChange?: (color: string) => void;
  className?: string;
}

export const ColorPickerInteractive: React.FC<ColorPickerInteractiveProps> = ({
  onColorChange,
  className = ''
}) => {
  const [selectedColor, setSelectedColor] = useState('Supersonic Red');
  const [rotation, setRotation] = useState(0);

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    setRotation(prev => prev + 45); // Rotate car on color change
    if (onColorChange) {
      onColorChange(colorName);
    }
  };

  const currentColor = colors.find(c => c.name === selectedColor) || colors[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Exterior Showroom - 3D Car with Selected Color */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/30 to-background border border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Showroom Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-muted/20 via-background to-background" />
        
        {/* 3D Car Visualization */}
        <div className="relative h-64 flex items-center justify-center p-8">
          <motion.div
            key={selectedColor}
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            {/* Car Silhouette with Selected Color */}
            <motion.div
              animate={{ rotateY: rotation }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Main Car Shape */}
              <div 
                className="relative mx-auto h-32 rounded-[30px] shadow-2xl"
                style={{ 
                  width: '85%',
                  backgroundColor: currentColor.hex,
                  filter: currentColor.finish === 'Metallic' 
                    ? 'brightness(1.1) saturate(1.2)' 
                    : currentColor.finish === 'Pearlescent'
                    ? 'brightness(1.15) saturate(1.3)'
                    : 'brightness(0.95) saturate(0.9)'
                }}
              >
                {/* Windshield */}
                <div className="absolute top-4 left-8 right-8 h-12 bg-gradient-to-b from-sky-300/40 to-sky-500/60 rounded-t-xl border border-white/20" />
                
                {/* Windows */}
                <div className="absolute top-4 left-4 w-16 h-10 bg-gradient-to-br from-sky-200/30 to-sky-400/50 rounded-tl-lg border-l border-t border-white/20" />
                <div className="absolute top-4 right-4 w-16 h-10 bg-gradient-to-bl from-sky-200/30 to-sky-400/50 rounded-tr-lg border-r border-t border-white/20" />
                
                {/* Light Reflections */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-[30px] pointer-events-none" />
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-8 left-0 right-0 h-3 bg-black/20 rounded-full" />
              </div>
              
              {/* Wheels */}
              <div className="absolute -bottom-3 left-[15%] w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 shadow-xl">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-600 to-gray-800" />
              </div>
              <div className="absolute -bottom-3 right-[15%] w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 shadow-xl">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-600 to-gray-800" />
              </div>
              
              {/* Shadow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-6 bg-black/20 rounded-full blur-lg" />
            </motion.div>
          </motion.div>

          {/* Floating Info Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedColor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <span className="text-sm font-semibold text-foreground">{currentColor.name}</span>
                </div>
                {currentColor.premium && (
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                )}
                {currentColor.popular && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Popular</span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRotation(prev => prev + 45)}
            className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 transition"
            title="Rotate view"
          >
            <RotateCcw className="w-4 h-4 text-foreground" />
          </motion.button>
        </div>
      </motion.div>

      {/* Color Swatches - Mobile Optimized */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">Available Colors</h4>
          <span className="text-xs text-muted-foreground">{colors.length} options</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {colors.map((color) => {
            const isSelected = color.name === selectedColor;
            return (
              <motion.button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
                title={color.name}
              >
                <div
                  className={`
                    aspect-square rounded-xl border-2 transition-all
                    ${isSelected 
                      ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-110' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                  style={{ 
                    backgroundColor: color.hex,
                    filter: color.finish === 'Metallic' 
                      ? 'brightness(1.1)' 
                      : color.finish === 'Matte'
                      ? 'brightness(0.95)'
                      : 'brightness(1.15)'
                  }}
                >
                  {/* Selected Check */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl"
                    >
                      <div className="bg-white rounded-full p-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    </motion.div>
                  )}

                  {/* Premium Badge */}
                  {color.premium && !isSelected && (
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-3 h-3 text-yellow-500 drop-shadow-lg" />
                    </div>
                  )}

                  {/* Popular Badge */}
                  {color.popular && !isSelected && (
                    <div className="absolute -top-1 -left-1 bg-primary text-white text-[8px] px-1 rounded">
                      HOT
                    </div>
                  )}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg border border-border">
                    {color.name}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Finish Details */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`p-3 rounded-lg text-center border transition ${
          currentColor.finish === 'Metallic' ? 'border-primary bg-primary/5' : 'border-border bg-card'
        }`}>
          <div className="text-xs font-semibold text-foreground mb-1">Metallic</div>
          <div className="text-[10px] text-muted-foreground">Classic shine</div>
        </div>
        <div className={`p-3 rounded-lg text-center border transition ${
          currentColor.finish === 'Pearlescent' ? 'border-primary bg-primary/5' : 'border-border bg-card'
        }`}>
          <div className="text-xs font-semibold text-foreground mb-1">Pearlescent</div>
          <div className="text-[10px] text-muted-foreground">Color-shifting</div>
        </div>
        <div className={`p-3 rounded-lg text-center border transition ${
          currentColor.finish === 'Matte' ? 'border-primary bg-primary/5' : 'border-border bg-card'
        }`}>
          <div className="text-xs font-semibold text-foreground mb-1">Matte</div>
          <div className="text-[10px] text-muted-foreground">Modern look</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            {currentColor.premium ? 'Premium finish available' : 'Standard finish included'}
          </span>
        </div>
        <span className="text-sm font-semibold text-foreground">
          {currentColor.finish}
        </span>
      </div>
    </div>
  );
};
