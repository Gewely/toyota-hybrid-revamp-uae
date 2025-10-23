import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';

interface ShowroomSafetyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
}

const safetyMatrix = [
  { category: 'Active Safety', features: [
    { name: 'Pre-Collision System (PCS)', standard: true, premium: true },
    { name: 'Lane Departure Alert (LDA)', standard: true, premium: true },
    { name: 'Adaptive Cruise Control (ACC)', standard: false, premium: true },
    { name: 'Blind Spot Monitor (BSM)', standard: false, premium: true },
    { name: 'Rear Cross Traffic Alert', standard: false, premium: true }
  ]},
  { category: 'Passive Safety', features: [
    { name: '10 Airbags', standard: true, premium: true },
    { name: 'Anti-lock Braking (ABS)', standard: true, premium: true },
    { name: 'Vehicle Stability Control', standard: true, premium: true },
    { name: 'Traction Control', standard: true, premium: true },
    { name: 'Hill Start Assist', standard: true, premium: true }
  ]}
];

const certifications = [
  { name: 'ANCAP', rating: '5 Stars', image: '⭐⭐⭐⭐⭐' },
  { name: 'IIHS', rating: 'Top Safety Pick+', image: '🏆' },
  { name: 'Euro NCAP', rating: '5 Stars', image: '⭐⭐⭐⭐⭐' }
];

export const ShowroomSafetyContent: React.FC<ShowroomSafetyContentProps> = ({
  vehicle,
  onClose,
  onTestDrive
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'standard' | 'premium'>('premium');

  return (
    <div className="space-y-6 pb-6">
      {/* Safety Video/Image */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <img
          src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg"
          alt="Safety features"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-semibold">Toyota Safety Sense 2.5</span>
          </div>
          <h3 className="text-xl font-bold text-white">Advanced Protection</h3>
        </div>
      </div>

      {/* Certifications */}
      <div className="grid grid-cols-3 gap-3">
        {certifications.map((cert, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-border bg-card text-center">
            <div className="text-2xl mb-1">{cert.image}</div>
            <div className="text-xs font-semibold text-foreground">{cert.name}</div>
            <div className="text-xs text-muted-foreground">{cert.rating}</div>
          </div>
        ))}
      </div>

      {/* Grade Selector */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setSelectedGrade('standard')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
            selectedGrade === 'standard'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Standard
        </button>
        <button
          onClick={() => setSelectedGrade('premium')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
            selectedGrade === 'premium'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Premium
        </button>
      </div>

      {/* Safety Feature Matrix */}
      <div className="space-y-4">
        {safetyMatrix.map((category, catIdx) => (
          <div key={catIdx}>
            <h4 className="font-semibold text-foreground mb-2 text-sm">{category.category}</h4>
            <div className="space-y-1">
              {category.features.map((feature, fIdx) => {
                const included = selectedGrade === 'standard' ? feature.standard : feature.premium;
                return (
                  <motion.div
                    key={fIdx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: fIdx * 0.03 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition"
                  >
                    <span className="text-sm text-foreground">{feature.name}</span>
                    {included ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Crash Test Visualization */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1 text-sm">Crash Test Ratings</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Exceeded safety standards in all crash test scenarios
            </p>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">98%</div>
                <div className="text-xs text-muted-foreground">Adult</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">92%</div>
                <div className="text-xs text-muted-foreground">Child</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">89%</div>
                <div className="text-xs text-muted-foreground">Pedestrian</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">95%</div>
                <div className="text-xs text-muted-foreground">Assist</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Book Safety Demo
        </Button>
        <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
          Explore More
        </Button>
      </div>
    </div>
  );
};
