import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

interface Color {
  name: string;
  hex: string;
  finish: 'Metallic' | 'Pearlescent' | 'Matte';
  premium?: boolean;
}

const colors: Color[] = [
  { name: 'Super White', hex: '#FFFFFF', finish: 'Metallic' },
  { name: 'Silver Metallic', hex: '#C0C0C0', finish: 'Metallic' },
  { name: 'Graphite', hex: '#3A3A3A', finish: 'Metallic' },
  { name: 'Eclipse Black', hex: '#000000', finish: 'Metallic' },
  { name: 'Supersonic Red', hex: '#CC0000', finish: 'Metallic', premium: true },
  { name: 'Attitude Black', hex: '#1A1A1A', finish: 'Pearlescent', premium: true },
  { name: 'Blue Metallic', hex: '#1E3A8A', finish: 'Metallic' },
  { name: 'Desert Sand', hex: '#D4A574', finish: 'Metallic' },
];

interface ColorPickerInteractiveProps {
  onColorChange?: (color: Color) => void;
  className?: string;
}

export const ColorPickerInteractive: React.FC<ColorPickerInteractiveProps> = ({
  onColorChange,
  className,
}) => {
  const [selectedColor, setSelectedColor] = useState<Color>(colors[4]); // Default to Supersonic Red

  const handleColorSelect = (color: Color) => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Display */}
      <motion.div
        key={selectedColor.hex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-2xl overflow-hidden h-64 md:h-80 border-2 border-border"
        style={{
          background: `linear-gradient(135deg, ${selectedColor.hex} 0%, ${selectedColor.hex}dd 100%)`,
        }}
      >
        {/* Overlay Details */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <motion.h3
                key={selectedColor.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold mb-2 flex items-center gap-2"
              >
                {selectedColor.name}
                {selectedColor.premium && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-lg text-xs">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </motion.h3>
              <p className="text-sm text-muted-foreground">{selectedColor.finish} Finish</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Color Code</p>
              <p className="text-lg font-mono font-bold">{selectedColor.hex}</p>
            </div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ width: '50%' }}
        />
      </motion.div>

      {/* Color Swatches */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Available Colors</h4>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {colors.map((color) => {
            const isSelected = selectedColor.hex === color.hex;
            return (
              <motion.button
                key={color.hex}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleColorSelect(color)}
                className="relative group"
              >
                <div
                  className={`w-full aspect-square rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-primary ring-4 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </motion.div>
                  )}
                  {color.premium && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs mt-2 text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  {color.name.split(' ')[0]}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Finish Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            type: 'Metallic',
            description: 'Classic shine with subtle sparkle',
            effect: 'Reflects light beautifully',
          },
          {
            type: 'Pearlescent',
            description: 'Multi-dimensional color depth',
            effect: 'Changes hue in different angles',
          },
          {
            type: 'Matte',
            description: 'Non-reflective modern finish',
            effect: 'Sophisticated flat appearance',
          },
        ].map((finish, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className={`p-4 rounded-xl border ${
              selectedColor.finish === finish.type
                ? 'border-primary bg-primary/5'
                : 'border-border bg-accent/30'
            }`}
          >
            <h5 className="font-semibold mb-1">{finish.type}</h5>
            <p className="text-xs text-muted-foreground mb-2">{finish.description}</p>
            <p className="text-xs text-muted-foreground italic">{finish.effect}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
