import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, Download, Zap, Radio, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface StoryTechnologyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const techFeatures = [
  { icon: Smartphone, title: 'Wireless CarPlay & Android Auto', description: 'Seamless smartphone integration' },
  { icon: Wifi, title: 'Wireless Charging', description: '15W fast charging pad' },
  { icon: Download, title: 'OTA Updates', description: 'Over-the-air software updates' },
  { icon: Zap, title: 'Voice Control', description: 'Natural language commands' },
  { icon: Radio, title: 'Digital Key', description: 'Phone-as-key technology' },
  { icon: Cloud, title: 'Cloud Services', description: 'Remote climate & diagnostics' }
];

const packages = [
  { name: 'Standard Tech', features: ['8" Display', 'Bluetooth', '6 Speakers'], price: 'Included' },
  { name: 'Premium Tech', features: ['9" Display', 'Wireless CarPlay', 'JBL Audio'], price: '+5,000 AED', popular: true }
];

export const StoryTechnologyContent: React.FC<StoryTechnologyContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [selectedPackage, setSelectedPackage] = useState(1);

  return (
    <div className="space-y-8 pb-6">
      {/* Video Demo */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
        <img
          src="https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg"
          alt="Technology showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold text-white mb-2">Innovation at Your Fingertips</h3>
          <p className="text-white/90">Advanced technology that anticipates your needs</p>
        </div>
      </div>

      {/* Feature Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Connected Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {techFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Package Comparison */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Technology Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPackage(idx)}
              className={`p-6 rounded-2xl border-2 transition text-left relative ${
                selectedPackage === idx
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute top-4 right-4">Most Popular</Badge>
              )}
              <h4 className="font-bold text-lg text-foreground mb-1">{pkg.name}</h4>
              <p className="text-sm font-semibold text-primary mb-3">{pkg.price}</p>
              <ul className="space-y-2">
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* App Integration */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">Toyota Connect App</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Start, lock, locate your vehicle from anywhere. Get vehicle health reports and schedule service with one tap.
            </p>
            <Button variant="outline" size="sm">Download App</Button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Book Test Drive
        </Button>
        <Button onClick={onBuild || onClose} variant="outline" size="lg" className="flex-1">
          Tech Packages
        </Button>
      </div>
    </div>
  );
};
