import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';

interface ShowroomInteriorContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
}

const tabs = [
  { id: 'front', label: 'Front Cabin', icon: Users },
  { id: 'rear', label: 'Rear Cabin', icon: Users },
  { id: 'cargo', label: 'Cargo Space', icon: Package }
];

const features = {
  front: [
    { title: '12-way Power Seats', badge: 'Driver & Passenger' },
    { title: 'Heated & Ventilated', badge: 'All Seasons' },
    { title: 'Memory Function', badge: '3 Positions' },
    { title: 'Lumbar Support', badge: '4-way Adjustable' }
  ],
  rear: [
    { title: 'Reclining Seats', badge: '40° Adjustment' },
    { title: 'Center Armrest', badge: 'With Cup Holders' },
    { title: 'USB-C Ports', badge: 'Fast Charging' },
    { title: 'Climate Control', badge: 'Independent' }
  ],
  cargo: [
    { title: 'Cargo Volume', badge: '621L Standard' },
    { title: 'Underfloor Storage', badge: 'Hidden Compartments' },
    { title: '60:40 Split', badge: 'Folding Rear Seats' },
    { title: 'Power Liftgate', badge: 'Hands-Free' }
  ]
};

export const ShowroomInteriorContent: React.FC<ShowroomInteriorContentProps> = ({
  vehicle,
  onClose,
  onTestDrive
}) => {
  const [activeTab, setActiveTab] = useState<'front' | 'rear' | 'cargo'>('front');

  return (
    <div className="space-y-6 pb-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="aspect-video rounded-xl overflow-hidden mb-4">
          <img
            src="https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg"
            alt={`Interior ${activeTab}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {features[activeTab].map((feature, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-border bg-card">
              <h4 className="font-semibold text-sm text-foreground mb-1">{feature.title}</h4>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {feature.badge}
              </span>
            </div>
          ))}
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

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Build Your Interior
        </Button>
        <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
          Download Specs
        </Button>
      </div>
    </div>
  );
};
