import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VehicleModel } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Smartphone, Shield, Zap, Wifi, CheckCircle2, Star } from 'lucide-react';
import { INFOTAINMENT_SCREENS, CONNECTIVITY_FEATURES, SAFETY_LAYERS, PERFORMANCE_METRICS } from '@/data/tech-demos';
import { contextualHaptic } from '@/utils/haptic';

interface TechCommandCenterModalProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
}

export const TechCommandCenterModal: React.FC<TechCommandCenterModalProps> = ({
  vehicle,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [activeDriveMode, setActiveDriveMode] = useState(PERFORMANCE_METRICS.driveModes[1]);

  const handleScreenSwipe = (direction: 'left' | 'right') => {
    contextualHaptic.swipeNavigation();
    if (direction === 'left') {
      setActiveScreen((prev) => (prev + 1) % INFOTAINMENT_SCREENS.length);
    } else {
      setActiveScreen((prev) => (prev - 1 + INFOTAINMENT_SCREENS.length) % INFOTAINMENT_SCREENS.length);
    }
  };

  return (
    <div className="w-full h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Technology Suite</h2>
            <p className="text-sm text-muted-foreground">Innovation at your fingertips</p>
          </div>
          <Badge variant="secondary" className="gap-2">
            <Smartphone className="w-3 h-3" />
            Interactive Demos
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="infotainment" className="w-full">
        <div className="border-b border-border bg-muted/30">
          <TabsList className="w-full justify-start h-auto p-2 bg-transparent gap-2 overflow-x-auto">
            <TabsTrigger value="infotainment" className="gap-2">
              <Smartphone className="w-4 h-4" />
              Infotainment
            </TabsTrigger>
            <TabsTrigger value="safety" className="gap-2">
              <Shield className="w-4 h-4" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="connectivity" className="gap-2">
              <Wifi className="w-4 h-4" />
              Connectivity
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Infotainment Tab */}
        <TabsContent value="infotainment" className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Device Frame Simulator */}
            <div className="space-y-4">
              <div className="relative mx-auto max-w-md">
                {/* Device Frame */}
                <div className="relative bg-black rounded-3xl p-3 shadow-2xl">
                  <div className="aspect-[16/10] bg-gray-900 rounded-2xl overflow-hidden">
                    <motion.img
                      key={activeScreen}
                      src={INFOTAINMENT_SCREENS[activeScreen].image}
                      alt={INFOTAINMENT_SCREENS[activeScreen].title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {/* Swipe Indicators */}
                  <div className="absolute top-1/2 left-4 -translate-y-1/2">
                    <button
                      onClick={() => handleScreenSwipe('right')}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      ‹
                    </button>
                  </div>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2">
                    <button
                      onClick={() => handleScreenSwipe('left')}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Screen Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {INFOTAINMENT_SCREENS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveScreen(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === activeScreen ? 'w-8 bg-primary' : 'w-2 bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {INFOTAINMENT_SCREENS[activeScreen].title}
                </h3>
                <ul className="space-y-2">
                  {INFOTAINMENT_SCREENS[activeScreen].features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3">Display Specifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Screen Size</span>
                    <span className="text-foreground font-medium">12.3" Digital</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution</span>
                    <span className="text-foreground font-medium">1920 x 720</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Touch Response</span>
                    <span className="text-foreground font-medium">Haptic Feedback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="p-6 lg:p-8">
          <div className="space-y-6 max-w-4xl mx-auto">
            {SAFETY_LAYERS.map((layer, index) => (
              <motion.div
                key={layer.layer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/30 rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${layer.color}20` }}
                  >
                    <Shield className="w-6 h-6" style={{ color: layer.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{layer.title}</h3>
                    <Badge variant="outline" style={{ borderColor: layer.color, color: layer.color }}>
                      {layer.features.length} Features
                    </Badge>
                  </div>
                </div>
                <ul className="space-y-2">
                  {layer.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Gauges */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">Power Output</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-foreground">Horsepower</span>
                      <span className="text-2xl font-bold text-foreground">{PERFORMANCE_METRICS.horsepower} HP</span>
                    </div>
                    <Progress value={(PERFORMANCE_METRICS.horsepower / 400) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-foreground">Torque</span>
                      <span className="text-2xl font-bold text-foreground">{PERFORMANCE_METRICS.torque} lb-ft</span>
                    </div>
                    <Progress value={(PERFORMANCE_METRICS.torque / 350) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{PERFORMANCE_METRICS.acceleration}s</p>
                  <p className="text-xs text-muted-foreground mt-1">0-60 mph</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{PERFORMANCE_METRICS.fuelEconomy.combined}</p>
                  <p className="text-xs text-muted-foreground mt-1">MPG Combined</p>
                </div>
              </div>
            </div>

            {/* Drive Modes */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Drive Modes</h3>
              <div className="grid grid-cols-2 gap-3">
                {PERFORMANCE_METRICS.driveModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setActiveDriveMode(mode);
                      contextualHaptic.selectionChange();
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      activeDriveMode.id === mode.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{mode.icon}</div>
                    <p className="font-semibold text-sm text-foreground">{mode.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
                  </button>
                ))}
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mt-6">
                <h4 className="font-semibold text-foreground mb-3">Power Distribution</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{PERFORMANCE_METRICS.powerDistribution.front}%</p>
                    <p className="text-xs text-muted-foreground">Front</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{PERFORMANCE_METRICS.powerDistribution.rear}%</p>
                    <p className="text-xs text-muted-foreground">Rear</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Connectivity Tab */}
        <TabsContent value="connectivity" className="p-6 lg:p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {CONNECTIVITY_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-muted/30 rounded-xl p-6 hover:bg-muted/50 transition-colors border border-border"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <Badge
                  variant={feature.status === 'Standard' ? 'default' : feature.status === 'Available' ? 'secondary' : 'outline'}
                >
                  {feature.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* CTAs */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button onClick={onBuild || onTestDrive} className="flex-1" size="lg">
            Configure Technology
          </Button>
          <Button onClick={onTestDrive} variant="outline" className="flex-1" size="lg">
            Test Drive
          </Button>
        </div>
      </div>
    </div>
  );
};
