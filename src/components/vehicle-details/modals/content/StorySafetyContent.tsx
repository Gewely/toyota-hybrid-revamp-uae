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
}

const safetyFeatures = [
  { icon: Eye, title: 'Pre-Collision System', description: 'Detects vehicles and pedestrians ahead', active: true },
  { icon: AlertCircle, title: 'Lane Departure Alert', description: 'Warns if you drift from your lane', active: true },
  { icon: Radio, title: 'Adaptive Cruise Control', description: 'Maintains safe distance automatically', active: true },
  { icon: Camera, title: '360° Camera', description: 'Panoramic bird\'s-eye view', active: true },
  { icon: Car, title: 'Blind Spot Monitor', description: 'Detects vehicles in blind spots', active: true },
  { icon: Shield, title: 'Road Sign Assist', description: 'Recognizes traffic signs', active: true }
];

const ratings = [
  { org: 'ANCAP', score: 5, maxScore: 5 },
  { org: 'IIHS', score: 'Top Safety Pick+', maxScore: null }
];

export const StorySafetyContent: React.FC<StorySafetyContentProps> = ({
  vehicle,
  onClose,
  onTestDrive
}) => {
  return (
    <div className="space-y-8 pb-6">
      {/* Hero Safety Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
        <img
          src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg"
          alt="Safety features"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/40">
              <Shield className="w-3 h-3 mr-1" />
              Toyota Safety Sense 2.5
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Proactive Protection</h3>
          <p className="text-white/90">360° awareness for every journey</p>
        </div>
      </div>

      {/* Safety Ratings */}
      <div className="grid grid-cols-2 gap-4">
        {ratings.map((rating, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
            <div className="text-lg font-bold text-foreground mb-1">{rating.org}</div>
            {rating.maxScore ? (
              <div className="flex items-center justify-center gap-1">
                {[...Array(rating.maxScore)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-500">★</span>
                ))}
              </div>
            ) : (
              <div className="text-sm font-semibold text-primary">{rating.score}</div>
            )}
          </div>
        ))}
      </div>

      {/* Safety Features Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Advanced Safety Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
              {feature.active && (
                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Diagram */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img
          src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg"
          alt="Safety diagram"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <Shield className="w-16 h-16 text-primary mx-auto mb-3" />
            <h4 className="text-lg font-bold text-foreground mb-2">360° Protection Zone</h4>
            <p className="text-sm text-muted-foreground max-w-xs">
              Multiple sensors and cameras work together to create a protective shield around your vehicle
            </p>
          </div>
        </div>
      </div>

      {/* Insurance Savings Note */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-foreground">
          <strong>Did you know?</strong> Advanced safety features may qualify you for insurance discounts of up to 15%.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Schedule Safety Demo
        </Button>
        <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
          Learn More
        </Button>
      </div>
    </div>
  );
};
