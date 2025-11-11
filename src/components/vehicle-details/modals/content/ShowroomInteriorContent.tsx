import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface ShowroomInteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const tabs = [
  { id: 'front', label: 'Front Cabin', icon: Users },
  { id: 'rear', label: 'Rear Cabin', icon: Users },
  { id: 'cargo', label: 'Cargo Space', icon: Package }
];

interface Feature {
  title: string;
  badge: string;
  availableIn?: string[];
}

const allFeatures = {
  front: [
    { title: '12-way Power Seats', badge: 'Driver & Passenger', availableIn: ['XLE', 'Limited', 'Platinum'] },
    { title: 'Heated & Ventilated', badge: 'All Seasons', availableIn: ['Limited', 'Platinum'] },
    { title: 'Memory Function', badge: '3 Positions', availableIn: ['Limited', 'Platinum'] },
    { title: 'Lumbar Support', badge: '4-way Adjustable', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'] }
  ],
  rear: [
    { title: 'Reclining Seats', badge: '40° Adjustment', availableIn: ['XLE', 'Limited', 'Platinum'] },
    { title: 'Center Armrest', badge: 'With Cup Holders', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'] },
    { title: 'USB-C Ports', badge: 'Fast Charging', availableIn: ['XLE', 'Limited', 'Platinum'] },
    { title: 'Climate Control', badge: 'Independent', availableIn: ['Limited', 'Platinum'] }
  ],
  cargo: [
    { title: 'Cargo Volume', badge: '621L Standard', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'] },
    { title: 'Underfloor Storage', badge: 'Hidden Compartments', availableIn: ['XLE', 'Limited', 'Platinum'] },
    { title: '60:40 Split', badge: 'Folding Rear Seats', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'] },
    { title: 'Power Liftgate', badge: 'Hands-Free', availableIn: ['Limited', 'Platinum'] }
  ]
};

const interiorImages = [
  'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg',
  'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true',
  'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg'
];

const materialSwatches = [
  { name: 'Fabric', grade: ['Base'], color: 'bg-neutral-400' },
  { name: 'Synthetic Leather', grade: ['XLE'], color: 'bg-neutral-600' },
  { name: 'Premium Leather', grade: ['Limited', 'Platinum'], color: 'bg-neutral-800' },
];

export const ShowroomInteriorContent: React.FC<ShowroomInteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [activeTab, setActiveTab] = useState<'front' | 'rear' | 'cargo'>('front');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const currentGrade = (vehicle as any).grade || 'Base';
  
  const getFeatureStatus = (feature: Feature) => {
    if (!feature.availableIn) return { available: true, upgradeNeeded: false };
    const available = feature.availableIn.includes(currentGrade);
    return { available, upgradeNeeded: !available };
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Image Gallery */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
        <img
          src={interiorImages[currentImageIndex]}
          alt={`Interior view ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {interiorImages.map((_, idx) => (
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

      {/* Material Swatches */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Interior Materials</h4>
        <div className="flex gap-3">
          {materialSwatches.map((swatch, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${swatch.color} border-2 border-border`} />
              <div>
                <div className="text-sm font-medium text-foreground">{swatch.name}</div>
                <div className="text-xs text-muted-foreground">{swatch.grade.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-2 gap-3">
          {allFeatures[activeTab].map((feature, idx) => {
            const { available, upgradeNeeded } = getFeatureStatus(feature);
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`p-3 rounded-lg border ${
                  available 
                    ? 'border-border bg-card' 
                    : 'border-border/50 bg-muted/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                  {upgradeNeeded && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.availableIn?.[0]}+
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {feature.badge}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Seating Configurations */}
      <div className="p-4 rounded-xl bg-muted/30">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          Seating Configurations
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-lg bg-card">
            <div className="text-lg font-bold text-primary">5</div>
            <div className="text-xs text-muted-foreground">Seater</div>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <div className="text-lg font-bold text-primary">7</div>
            <div className="text-xs text-muted-foreground">Seater</div>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <div className="text-lg font-bold text-primary">8</div>
            <div className="text-xs text-muted-foreground">Seater</div>
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">1025mm</div>
          <div className="text-xs text-muted-foreground mt-1">Front Legroom</div>
        </div>
        <div className="text-center border-x border-border">
          <div className="text-2xl font-bold text-primary">950mm</div>
          <div className="text-xs text-muted-foreground mt-1">Rear Legroom</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">621L</div>
          <div className="text-xs text-muted-foreground mt-1">Cargo Volume</div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={onBuild || onTestDrive} size="lg" className="flex-1">
          Customize Interior
        </Button>
        <Button onClick={onTestDrive} variant="outline" size="lg" className="flex-1">
          Book Test Drive
        </Button>
      </div>
    </div>
  );
};
