import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Circle, Grip } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

interface ExteriorModalProps {
  onClose: () => void;
}

const ExteriorModal: React.FC<ExteriorModalProps> = ({ onClose }) => {
  const [selectedColor, setSelectedColor] = useState('white');

  const colors = [
    { 
      id: 'white', 
      name: 'Pearl White', 
      hex: '#FFFFFF',
      description: 'Elegant and timeless',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80'
    },
    { 
      id: 'black', 
      name: 'Midnight Black', 
      hex: '#1A1A1A',
      description: 'Bold and sophisticated',
      image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=1400&q=80'
    },
    { 
      id: 'red', 
      name: 'Supersonic Red', 
      hex: '#CC0000',
      description: 'Dynamic and powerful',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&q=80'
    }
  ];

  const hotspots = [
    { 
      id: 'lights', 
      label: 'LED Headlights', 
      icon: Lightbulb,
      description: 'Bi-LED projector headlights with auto high beam',
      x: '70%', 
      y: '35%' 
    },
    { 
      id: 'wheels', 
      label: '20" Alloy Wheels', 
      icon: Circle,
      description: 'Premium forged alloy design',
      x: '25%', 
      y: '70%' 
    },
    { 
      id: 'roof', 
      label: 'Roof Rails', 
      icon: Grip,
      description: 'Integrated aluminum roof rails',
      x: '50%', 
      y: '15%' 
    }
  ];

  const currentColor = colors.find(c => c.id === selectedColor) || colors[0];

  return (
    <ModalWrapper title="Exterior Design" onClose={onClose}>
      <div className="p-6 lg:p-12 space-y-8">
        {/* Color Selector */}
        <div className="flex flex-wrap items-center gap-4 justify-center">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`group flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all ${
                selectedColor === color.id
                  ? 'border-[hsl(var(--toyota-red))] bg-zinc-50'
                  : 'border-zinc-300 hover:border-zinc-400'
              }`}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-zinc-900">{color.name}</div>
                <div className="text-xs text-zinc-600">{color.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Vehicle Image with Hotspots */}
        <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden bg-zinc-100">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedColor}
              src={currentColor.image}
              alt={`${currentColor.name} exterior`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Hotspots - Desktop Only */}
          <div className="hidden lg:block">
            {hotspots.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                className="absolute group"
                style={{ top: hotspot.y, left: hotspot.x }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--toyota-red))] text-white flex items-center justify-center shadow-lg">
                    <hotspot.icon className="h-5 w-5" />
                  </div>
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-white rounded-lg shadow-xl p-4 w-56">
                      <div className="font-bold text-zinc-900 mb-1">{hotspot.label}</div>
                      <div className="text-sm text-zinc-600">{hotspot.description}</div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Feature Cards - Mobile */}
        <div className="lg:hidden grid grid-cols-1 gap-4">
          {hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-zinc-200 bg-white"
            >
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--toyota-red))] text-white flex items-center justify-center flex-shrink-0">
                <hotspot.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 mb-1">{hotspot.label}</div>
                <div className="text-sm text-zinc-600">{hotspot.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {hotspots.map((hotspot, idx) => (
            <motion.div
              key={hotspot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="p-6 rounded-2xl border-2 border-zinc-200 bg-white hover:border-[hsl(var(--toyota-red))] transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <hotspot.icon className="h-7 w-7 text-[hsl(var(--toyota-red))]" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-2">{hotspot.label}</h3>
              <p className="text-zinc-600">{hotspot.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ExteriorModal;
