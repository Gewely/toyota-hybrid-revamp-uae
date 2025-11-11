import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, AlertCircle, Camera, Radio, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface StorySafetyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const safetyFeatures = [
  { icon: Eye, title: 'Pre-Collision System', description: 'Detects vehicles and pedestrians ahead', active: true },
  { icon: AlertCircle, title: 'Lane Departure Alert', description: 'Warns if you drift from your lane', active: true },
  { icon: Radio, title: 'Adaptive Cruise Control', description: 'Maintains safe distance automatically', active: true },
  { icon: Camera, title: '360° Camera', description: 'Panoramic bird\'s-eye view', active: true },
  { icon: Car, title: 'Blind Spot Monitor', description: 'Detects vehicles in blind spots', active: true },
  { icon: Shield, title: 'Road Sign Assist', description: 'Recognizes traffic signs', active: true }
];

export const StorySafetyContent: React.FC<StorySafetyContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  return (
    <div className="space-y-8 pb-6">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
        <img src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg" alt="Safety features" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/40 mb-3">
            <Shield className="w-3 h-3 mr-1" />
            Toyota Safety Sense 2.5
          </Badge>
          <h3 className="text-2xl font-bold text-white mb-2">Proactive Protection</h3>
          <p className="text-white/90">360° awareness for every journey</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Advanced Safety Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyFeatures.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
              {feature.active && <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-2" />}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onTestDrive} size="lg" className="flex-1">Book Test Drive</Button>
        <Button onClick={onBuild || onClose} variant="outline" size="lg" className="flex-1">Safety Packages</Button>
      </div>
    </div>
  );
};
