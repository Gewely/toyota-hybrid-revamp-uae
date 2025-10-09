import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Shield, AlertTriangle, Eye, Navigation } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

interface SafetyModalProps {
  onClose: () => void;
}

const SafetyModal: React.FC<SafetyModalProps> = ({ onClose }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const safetyFeatures = [
    {
      id: 'pcs',
      icon: Shield,
      title: 'Pre-Collision System',
      tagline: 'Proactive collision prevention',
      description: 'Advanced radar and camera system detects potential collisions with vehicles and pedestrians. Automatically applies brakes if collision is imminent.',
      features: [
        'Pedestrian detection',
        'Automatic emergency braking',
        'Visual and audio warnings',
        'Works day and night'
      ]
    },
    {
      id: 'lane',
      icon: Navigation,
      title: 'Lane Departure Alert & Assist',
      tagline: 'Stay centered with confidence',
      description: 'Monitors lane markings and alerts you if the vehicle begins to drift. Provides gentle steering assistance to help keep you in your lane.',
      features: [
        'Visual lane markers on display',
        'Steering wheel vibration alert',
        'Automatic steering correction',
        'Works on highways and roads'
      ]
    },
    {
      id: 'blind',
      icon: Eye,
      title: 'Blind Spot Monitor',
      tagline: 'See what you can\'t see',
      description: 'Radar sensors detect vehicles in your blind spots and warn you when it\'s unsafe to change lanes. Includes rear cross-traffic alert.',
      features: [
        'Side mirror indicators',
        'Rear cross-traffic detection',
        'Multi-zone monitoring',
        'Adjustable sensitivity'
      ]
    },
    {
      id: 'adaptive',
      icon: AlertTriangle,
      title: 'Adaptive Cruise Control',
      tagline: 'Intelligent distance management',
      description: 'Maintains a preset distance from the vehicle ahead, automatically adjusting speed in traffic. Reduces driver fatigue on long journeys.',
      features: [
        'Auto speed adjustment',
        'Stop-and-go traffic support',
        'Lane centering assistance',
        'Customizable following distance'
      ]
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ModalWrapper title="Safety Features" onClose={onClose}>
      <div className="p-6 lg:p-12">
        {/* Mobile Layout - Accordion */}
        <div className="lg:hidden space-y-4">
          {safetyFeatures.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`border-2 rounded-2xl overflow-hidden transition-colors ${
                expandedId === feature.id
                  ? 'border-foreground bg-accent'
                  : 'border-border bg-background'
              }`}
            >
              <button
                onClick={() => toggleExpand(feature.id)}
                className="w-full p-6 flex items-start gap-4 text-left min-h-touch-target"
                aria-expanded={expandedId === feature.id}
                aria-label={`Toggle ${feature.title} details`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  expandedId === feature.id
                    ? 'bg-foreground text-background'
                    : 'bg-accent text-foreground'
                }`}>
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feature.tagline}</p>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === feature.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.15 : 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="pl-12 sm:pl-16">
                      <p className="text-sm sm:text-base text-foreground/80 mb-3 sm:mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.features.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-foreground/70">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Desktop Layout - 2x2 Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {safetyFeatures.map((feature, idx) => (
            <motion.button
              key={feature.id}
              onClick={() => toggleExpand(feature.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-2xl border-2 text-left transition-all ${
                expandedId === feature.id
                  ? 'border-foreground bg-accent shadow-lg'
                  : 'border-border bg-background hover:border-foreground/50'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                expandedId === feature.id
                  ? 'bg-foreground text-background'
                  : 'bg-accent text-foreground'
              }`}>
                <feature.icon className="h-8 w-8" />
              </div>

              <h3 className="font-bold text-xl text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4">{feature.tagline}</p>

              <AnimatePresence>
                {expandedId === feature.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <p className="text-foreground/80 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                          <span className="text-foreground/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* TSS Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-12 p-6 sm:p-8 rounded-2xl bg-foreground text-center"
        >
          <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-background mx-auto mb-3 sm:mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-background mb-2">
            Toyota Safety Sense™
          </h3>
          <p className="text-sm sm:text-base text-background/80 max-w-2xl mx-auto">
            A comprehensive suite of active safety technologies designed to protect you and your passengers on every journey.
          </p>
        </motion.div>
      </div>
    </ModalWrapper>
  );
};

export default SafetyModal;
