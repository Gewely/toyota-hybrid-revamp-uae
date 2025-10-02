import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Eye, Navigation } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

interface SafetyModalProps {
  onClose: () => void;
}

const SafetyModal: React.FC<SafetyModalProps> = ({ onClose }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
                  ? 'border-[hsl(var(--toyota-red))] bg-zinc-50'
                  : 'border-zinc-200 bg-white'
              }`}
            >
              <button
                onClick={() => toggleExpand(feature.id)}
                className="w-full p-6 flex items-start gap-4 text-left"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  expandedId === feature.id
                    ? 'bg-[hsl(var(--toyota-red))] text-white'
                    : 'bg-zinc-100 text-zinc-600'
                }`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-zinc-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-600">{feature.tagline}</p>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === feature.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="pl-16">
                      <p className="text-zinc-700 mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.features.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--toyota-red))] mt-2 flex-shrink-0" />
                            <span className="text-sm text-zinc-600">{item}</span>
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
                  ? 'border-[hsl(var(--toyota-red))] bg-zinc-50 shadow-lg'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                expandedId === feature.id
                  ? 'bg-[hsl(var(--toyota-red))] text-white'
                  : 'bg-zinc-100 text-zinc-600'
              }`}>
                <feature.icon className="h-8 w-8" />
              </div>

              <h3 className="font-bold text-xl text-zinc-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-600 mb-4">{feature.tagline}</p>

              <AnimatePresence>
                {expandedId === feature.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-zinc-200"
                  >
                    <p className="text-zinc-700 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-[hsl(var(--toyota-red))] mt-2 flex-shrink-0" />
                          <span className="text-zinc-700">{item}</span>
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
          className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-center"
        >
          <Shield className="h-12 w-12 text-[hsl(var(--toyota-red))] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Toyota Safety Sense™
          </h3>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            A comprehensive suite of active safety technologies designed to protect you and your passengers on every journey.
          </p>
        </motion.div>
      </div>
    </ModalWrapper>
  );
};

export default SafetyModal;
