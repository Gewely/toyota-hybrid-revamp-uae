import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleModel } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Sparkles, Wind, Music, Armchair } from 'lucide-react';
import { contextualHaptic } from '@/utils/haptic';

interface ImmersiveInteriorModalProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const AMBIENT_COLORS = [
  { id: 'white', name: 'Pure White', color: '#FFFFFF' },
  { id: 'blue', name: 'Ocean Blue', color: '#3B82F6' },
  { id: 'purple', name: 'Royal Purple', color: '#8B5CF6' },
  { id: 'amber', name: 'Warm Amber', color: '#F59E0B' },
  { id: 'red', name: 'Sunset Red', color: '#EF4444' },
  { id: 'green', name: 'Forest Green', color: '#10B981' },
];

const MATERIALS = [
  {
    id: 'leather',
    name: 'Premium Leather',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    description: 'Hand-stitched with diamond quilting'
  },
  {
    id: 'wood',
    name: 'Natural Wood',
    image: 'https://images.unsplash.com/photo-1611532736573-032b2f06c967?w=400&q=80',
    description: 'Sustainable bamboo accents'
  },
  {
    id: 'carbon',
    name: 'Carbon Fiber',
    image: 'https://images.unsplash.com/photo-1585206637224-5e29629b88b4?w=400&q=80',
    description: 'Lightweight performance trim'
  },
];

const HOTSPOTS = [
  { id: 'dashboard', name: 'Digital Display', x: 50, y: 35, icon: '📊' },
  { id: 'seats', name: 'Heated Seats', x: 30, y: 60, icon: '💺' },
  { id: 'audio', name: 'Premium Audio', x: 70, y: 45, icon: '🔊' },
  { id: 'climate', name: 'Climate Control', x: 50, y: 55, icon: '❄️' },
];

export const ImmersiveInteriorModal: React.FC<ImmersiveInteriorModalProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [isNightMode, setIsNightMode] = useState(false);
  const [selectedAmbient, setSelectedAmbient] = useState(AMBIENT_COLORS[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
    contextualHaptic.toggleMode();
  };

  const handleAmbientChange = (color: typeof AMBIENT_COLORS[0]) => {
    setSelectedAmbient(color);
    contextualHaptic.selectionChange();
  };

  const interiorImage = isNightMode
    ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80'
    : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80';

  return (
    <div className="w-full h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Experience Interior</h2>
            <p className="text-sm text-muted-foreground">Immersive virtual cockpit</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isNightMode ? "default" : "outline"}
              size="sm"
              onClick={toggleNightMode}
              className="gap-2"
            >
              {isNightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {isNightMode ? 'Night' : 'Day'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6 p-6 lg:p-8">
        {/* Panoramic View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-[16/9] bg-black rounded-2xl overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div
                key={isNightMode ? 'night' : 'day'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <img
                  src={interiorImage}
                  alt="Interior View"
                  className="w-full h-full object-cover"
                />
                
                {/* Ambient Lighting Overlay */}
                {isNightMode && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="absolute inset-0 mix-blend-overlay"
                    style={{
                      background: `radial-gradient(ellipse at 50% 80%, ${selectedAmbient.color} 0%, transparent 60%)`
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Interactive Hotspots */}
            {HOTSPOTS.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                className="absolute w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                {hotspot.icon}
              </motion.button>
            ))}

            {/* Hotspot Detail */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-4 left-4 right-4 bg-background/95 backdrop-blur-xl rounded-xl p-4 border border-border shadow-2xl"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {HOTSPOTS.find(h => h.id === activeHotspot)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click to explore this feature in detail
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ambient Lighting Control */}
          {isNightMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Ambient Lighting
              </h3>
              <div className="flex gap-3 flex-wrap">
                {AMBIENT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleAmbientChange(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedAmbient.id === color.id
                        ? 'border-primary ring-4 ring-primary/20 scale-110'
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{selectedAmbient.name}</p>
            </motion.div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="climate">Climate</TabsTrigger>
              <TabsTrigger value="seats">Seats</TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="space-y-3 mt-4">
              {MATERIALS.map((material) => (
                <button
                  key={material.id}
                  onClick={() => setSelectedMaterial(material)}
                  className={`w-full text-left rounded-lg border-2 overflow-hidden transition-all ${
                    selectedMaterial.id === material.id
                      ? 'border-primary ring-4 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="aspect-video">
                    <img src={material.image} alt={material.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-foreground">{material.name}</p>
                    <p className="text-xs text-muted-foreground">{material.description}</p>
                  </div>
                </button>
              ))}
            </TabsContent>

            <TabsContent value="climate" className="space-y-4 mt-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wind className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Dual Zone Climate</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">22°C</p>
                    <p className="text-xs text-muted-foreground">Driver</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">24°C</p>
                    <p className="text-xs text-muted-foreground">Passenger</p>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="w-full justify-center py-2">
                Air Purification Active
              </Badge>
            </TabsContent>

            <TabsContent value="seats" className="space-y-3 mt-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-primary" />
                    Heating
                  </span>
                  <Badge>Level 2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground flex items-center gap-2">
                    <Music className="w-4 h-4 text-primary" />
                    Massage
                  </span>
                  <Badge variant="outline">Off</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Memory Position</span>
                  <Badge variant="secondary">Saved</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTAs */}
          <div className="pt-4 space-y-3">
            <Button onClick={onBuild || onTestDrive} className="w-full" size="lg">
              Configure Interior
            </Button>
            <Button onClick={onTestDrive} variant="outline" className="w-full" size="lg">
              Experience In Person
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
