import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, Usb, Radio, Cloud, Bluetooth } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';
import { InfotainmentSimulator } from '../interactive/InfotainmentSimulator';

interface ShowroomTechnologyContentProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

const techEcosystem = [
  { name: 'Vehicle', features: ['Infotainment', 'Climate', 'Diagnostics'], icon: Radio },
  { name: 'Smartphone App', features: ['Remote Start', 'Lock/Unlock', 'Location'], icon: Smartphone },
  { name: 'Cloud Services', features: ['OTA Updates', 'Data Sync', 'Analytics'], icon: Cloud }
];

const connectivity = [
  { icon: Bluetooth, name: 'Bluetooth 5.0', description: 'Multi-device pairing' },
  { icon: Wifi, name: 'Wi-Fi Hotspot', description: '4G LTE connectivity' },
  { icon: Usb, name: 'USB-C Ports', description: 'Fast charging (4x)' },
  { icon: Smartphone, name: 'Wireless CarPlay', description: 'iOS & Android' }
];

const softwareVersions = [
  { version: 'v2.5.0', date: 'Dec 2024', features: ['Enhanced voice control', 'New UI themes'] },
  { version: 'v2.4.0', date: 'Oct 2024', features: ['Performance improvements', 'Bug fixes'] },
  { version: 'v2.3.0', date: 'Aug 2024', features: ['New navigation features', 'Added integrations'] }
];

export const ShowroomTechnologyContent: React.FC<ShowroomTechnologyContentProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [selectedVersion, setSelectedVersion] = useState(0);

  return (
    <div className="space-y-6 pb-6">
      {/* Interactive Infotainment Simulator */}
      <InfotainmentSimulator />

      {/* Tech Ecosystem Diagram */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Connected Ecosystem</h4>
        <div className="grid grid-cols-3 gap-3">
          {techEcosystem.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 rounded-xl border border-border bg-card text-center"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">{item.name}</div>
              <div className="space-y-1">
                {item.features.map((feature, fIdx) => (
                  <div key={fIdx} className="text-xs text-muted-foreground">{feature}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Connectivity Options */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Connectivity Features</h4>
        <div className="grid grid-cols-2 gap-3">
          {connectivity.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Software Version History */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">OTA Update History</h4>
        <div className="space-y-2">
          {softwareVersions.map((version, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedVersion(idx)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                selectedVersion === idx
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{version.version}</span>
                <span className="text-xs text-muted-foreground">{version.date}</span>
              </div>
              {selectedVersion === idx && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1 mt-2"
                >
                  {version.features.map((feature, fIdx) => (
                    <li key={fIdx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </motion.ul>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Integration */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1 text-sm">Smart Home Integration</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Connect with Alexa, Google Home, and SmartThings
            </p>
            <div className="flex gap-2">
              <div className="text-xs bg-background px-2 py-1 rounded">Alexa</div>
              <div className="text-xs bg-background px-2 py-1 rounded">Google</div>
              <div className="text-xs bg-background px-2 py-1 rounded">SmartThings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Specs */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/30">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">9"</div>
          <div className="text-xs text-muted-foreground">Display Size</div>
        </div>
        <div className="text-center border-x border-border">
          <div className="text-2xl font-bold text-primary">15W</div>
          <div className="text-xs text-muted-foreground">Wireless Charging</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">100+</div>
          <div className="text-xs text-muted-foreground">Compatible Apps</div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={onTestDrive} size="lg" className="flex-1">
          Book Test Drive
        </Button>
        <Button onClick={onBuild || onClose} variant="outline" size="lg" className="flex-1">
          Explore Tech Package
        </Button>
      </div>
    </div>
  );
};
