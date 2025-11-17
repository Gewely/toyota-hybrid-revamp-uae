import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Wifi, Radio, Navigation, Music, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';
import { prefersReducedMotion } from '@/utils/modal-performance';

interface InfotainmentDemoProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const screens = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    title: '12.3" HD Touchscreen',
    description: 'Intuitive interface with customizable widgets and multi-touch gestures'
  },
  { 
    id: 'navigation', 
    label: 'Navigation', 
    icon: Navigation,
    image: 'https://images.unsplash.com/photo-1569144157596-e28a4e4e2c6f?w=800',
    title: 'Advanced GPS Navigation',
    description: 'Real-time traffic updates, 3D landmarks, and offline maps'
  },
  { 
    id: 'media', 
    label: 'Media', 
    icon: Music,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    title: 'Premium Audio System',
    description: '12-speaker surround sound with acoustic tuning'
  },
  { 
    id: 'connectivity', 
    label: 'Connect', 
    icon: Wifi,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    title: 'Seamless Connectivity',
    description: 'Wireless Apple CarPlay, Android Auto, and WiFi hotspot'
  }
];

const features = [
  { icon: Smartphone, label: 'Apple CarPlay', sublabel: 'Wireless' },
  { icon: Phone, label: 'Android Auto', sublabel: 'Wireless' },
  { icon: Wifi, label: 'WiFi Hotspot', sublabel: '4G LTE' },
  { icon: Radio, label: 'DAB+ Radio', sublabel: 'Digital' },
  { icon: MessageSquare, label: 'Voice Control', sublabel: 'Hands-free' }
];

export const InfotainmentDemo: React.FC<InfotainmentDemoProps> = ({
  vehicle,
  onTestDrive,
  onBuild
}) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const reducedMotion = prefersReducedMotion();

  return (
    <div className="grid lg:grid-cols-5 gap-6 p-6 bg-background min-h-[70vh]">
      {/* Left: Screen Demo */}
      <div className="lg:col-span-3 space-y-4">
        {/* Device Frame */}
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-black p-4 shadow-2xl">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeScreen}
                src={screens[activeScreen].image}
                alt={screens[activeScreen].title}
                className="w-full h-full object-cover"
                initial={reducedMotion ? {} : { opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Screen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Screen Title */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <motion.h3
                key={`title-${activeScreen}`}
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold mb-1"
              >
                {screens[activeScreen].title}
              </motion.h3>
              <motion.p
                key={`desc-${activeScreen}`}
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/80 text-sm"
              >
                {screens[activeScreen].description}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Screen Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {screens.map((screen, idx) => {
            const Icon = screen.icon;
            return (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(idx)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  activeScreen === idx
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 bg-card'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  activeScreen === idx ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <div className={`text-xs font-medium ${
                  activeScreen === idx ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {screen.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Features & Specs */}
      <div className="lg:col-span-2 space-y-4">
        {/* Screen Size */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">Display</h4>
          <div className="text-4xl font-bold text-foreground mb-2">12.3"</div>
          <div className="text-sm text-muted-foreground mb-4">High-Definition Touchscreen</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resolution</span>
              <span className="text-foreground font-medium">1920 × 720</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="text-foreground font-medium">LCD Multi-touch</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brightness</span>
              <span className="text-foreground font-medium">800 nits</span>
            </div>
          </div>
        </div>

        {/* Connectivity Features */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">Connectivity</h4>
          <div className="space-y-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.label}
                  initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{feature.label}</div>
                    <div className="text-xs text-muted-foreground">{feature.sublabel}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button onClick={onTestDrive} variant="default" className="w-full">
            Experience in Person
          </Button>
          {onBuild && (
            <Button onClick={onBuild} variant="outline" className="w-full">
              Configure System
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
