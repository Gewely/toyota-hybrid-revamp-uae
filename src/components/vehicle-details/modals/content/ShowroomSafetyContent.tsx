import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, AlertCircle, Camera, Radio, Car, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface ShowroomSafetyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

interface SafetyFeature {
  icon: any;
  title: string;
  description: string;
  availableIn: string[];
  active: boolean;
}

const safetyFeatures: SafetyFeature[] = [
  { icon: Eye, title: 'Pre-Collision System', description: 'Detects vehicles and pedestrians', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'], active: true },
  { icon: AlertCircle, title: 'Lane Departure Alert', description: 'Warns if drifting from lane', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'], active: true },
  { icon: Radio, title: 'Adaptive Cruise Control', description: 'Maintains safe distance automatically', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'], active: true },
  { icon: Camera, title: 'Rear Camera', description: 'Clear rear view when reversing', availableIn: ['Base', 'XLE', 'Limited', 'Platinum'], active: true },
  { icon: Camera, title: '360° Camera', description: 'Panoramic bird\'s-eye view', availableIn: ['Limited', 'Platinum'], active: true },
  { icon: Car, title: 'Blind Spot Monitor', description: 'Detects vehicles in blind spots', availableIn: ['XLE', 'Limited', 'Platinum'], active: true },
  { icon: Shield, title: 'Road Sign Assist', description: 'Recognizes traffic signs', availableIn: ['XLE', 'Limited', 'Platinum'], active: true },
  { icon: AlertCircle, title: 'Parking Sensors', description: 'Front and rear proximity alerts', availableIn: ['Limited', 'Platinum'], active: true }
];

const ratings = [
  { org: 'ANCAP', score: 5, maxScore: 5, year: '2024' },
  { org: 'IIHS', score: 'Top Safety Pick+', maxScore: null, year: '2024' }
];

export const ShowroomSafetyContent: React.FC<ShowroomSafetyContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const currentGrade = (vehicle as any).grade || 'Base';

  const getFeatureStatus = (feature: SafetyFeature) => {
    const available = feature.availableIn.includes(currentGrade);
    return { available, upgradeNeeded: !available };
  };

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
              Toyota Safety Sense 2.5+
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Proactive Protection</h3>
          <p className="text-white/90">Advanced safety systems for peace of mind</p>
        </div>
      </div>

      {/* Safety Ratings */}
      <div className="grid grid-cols-2 gap-4">
        {ratings.map((rating, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-primary" />
              <div className="text-lg font-bold text-foreground">{rating.org}</div>
            </div>
            {rating.maxScore ? (
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(rating.maxScore)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-500">★</span>
                ))}
              </div>
            ) : (
              <div className="text-sm font-semibold text-primary mb-1">{rating.score}</div>
            )}
            <div className="text-xs text-muted-foreground">{rating.year}</div>
          </div>
        ))}
      </div>

      {/* Safety Features Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Advanced Safety Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyFeatures.map((feature, idx) => {
            const { available, upgradeNeeded } = getFeatureStatus(feature);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-start gap-3 p-4 rounded-xl border ${
                  available
                    ? 'border-border bg-card hover:border-primary/50'
                    : 'border-border/50 bg-muted/50 opacity-60'
                } transition`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  available ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <feature.icon className={`w-5 h-5 ${available ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                    {upgradeNeeded && (
                      <Badge variant="secondary" className="text-xs">
                        {feature.availableIn[0]}+
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                  {feature.active && available && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Airbag Count */}
      <div className="p-4 rounded-xl bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Airbag System</h4>
            <p className="text-xs text-muted-foreground">Advanced SRS airbag protection</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">10</div>
            <div className="text-xs text-muted-foreground">Airbags</div>
          </div>
        </div>
      </div>

      {/* Insurance Savings Note */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-foreground">
          <strong>Insurance Benefit:</strong> Advanced safety features may qualify for insurance discounts up to 15%.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Book Safety Demo
        </Button>
        <Button onClick={onBuild || onClose} variant="outline" size="lg" className="flex-1">
          Safety Packages
        </Button>
      </div>
    </div>
  );
};
