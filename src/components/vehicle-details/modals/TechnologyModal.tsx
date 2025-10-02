import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Navigation as NavIcon, Wifi, Monitor } from 'lucide-react';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import ModalWrapper from './ModalWrapper';

interface TechnologyModalProps {
  onClose: () => void;
}

const TechnologyModal: React.FC<TechnologyModalProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const techFeatures = [
    {
      id: 'display',
      icon: Monitor,
      title: '12.3" Digital Instrument Cluster',
      tagline: 'Command center at your fingertips',
      description: 'Fully customizable digital display with multiple layout options, real-time vehicle information, and intuitive controls.',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80',
      highlights: [
        'High-resolution TFT display',
        'Multiple display modes',
        'Navigation integration',
        'Driver assistance visuals'
      ]
    },
    {
      id: 'carplay',
      icon: Smartphone,
      title: 'Wireless Connectivity',
      tagline: 'Seamlessly connected',
      description: 'Wireless Apple CarPlay and Android Auto for effortless smartphone integration. Access your apps, music, and messages hands-free.',
      image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?w=1200&q=80',
      highlights: [
        'Wireless Apple CarPlay',
        'Wireless Android Auto',
        'Bluetooth multi-device',
        'USB-C charging ports'
      ]
    },
    {
      id: 'navigation',
      icon: NavIcon,
      title: 'Advanced Navigation',
      tagline: 'Always on the right path',
      description: 'Cloud-based navigation with live traffic updates, voice guidance, and predictive routing to get you there faster.',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80',
      highlights: [
        'Real-time traffic updates',
        'Voice-guided directions',
        'Points of interest',
        'Over-the-air map updates'
      ]
    },
    {
      id: 'connected',
      icon: Wifi,
      title: 'Toyota Connected Services',
      tagline: 'Your vehicle, always connected',
      description: 'Remote vehicle control, emergency assistance, maintenance alerts, and vehicle health reports accessible from your smartphone.',
      image: 'https://images.unsplash.com/photo-1581093588401-22f82f2f09c2?w=1200&q=80',
      highlights: [
        'Remote start & climate',
        'Vehicle finder',
        'Service scheduling',
        'Emergency assistance'
      ]
    }
  ];

  const handleSwipeLeft = () => {
    setCurrentIndex((prev) => (prev + 1) % techFeatures.length);
  };

  const handleSwipeRight = () => {
    setCurrentIndex((prev) => (prev - 1 + techFeatures.length) % techFeatures.length);
  };

  const touchHandlers = useTouchGestures({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50
  });

  const currentFeature = techFeatures[currentIndex];

  return (
    <ModalWrapper title="Technology" onClose={onClose}>
      <div className="p-6 lg:p-12">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8">
          <img
            src="https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_01_800x447.jpg"
            alt="Technology dashboard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Connected Innovation
            </h2>
            <p className="text-white/90 text-lg">
              Advanced technology for the modern driver
            </p>
          </div>
        </div>

        {/* Mobile Swipeable Cards */}
        <div className="lg:hidden" {...touchHandlers}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden"
            >
              <div className="aspect-[16/9]">
                <img
                  src={currentFeature.image}
                  alt={currentFeature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="w-14 h-14 rounded-full bg-[hsl(var(--toyota-red))] text-white flex items-center justify-center mb-4">
                  <currentFeature.icon className="h-7 w-7" />
                </div>
                
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                  {currentFeature.title}
                </h3>
                <p className="text-zinc-600 mb-4">{currentFeature.tagline}</p>
                <p className="text-zinc-700 mb-6">{currentFeature.description}</p>
                
                <ul className="space-y-3">
                  {currentFeature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--toyota-red))] mt-2 flex-shrink-0" />
                      <span className="text-zinc-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {techFeatures.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-8 bg-[hsl(var(--toyota-red))]'
                    : 'w-2 bg-zinc-300'
                }`}
                aria-label={`Go to feature ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {techFeatures.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden hover:border-[hsl(var(--toyota-red))] transition-all cursor-pointer"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <div className="w-14 h-14 rounded-full bg-zinc-100 group-hover:bg-[hsl(var(--toyota-red))] text-zinc-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                  <feature.icon className="h-7 w-7" />
                </div>
                
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 mb-3">{feature.tagline}</p>
                <p className="text-zinc-700 text-sm mb-4">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--toyota-red))] mt-2 flex-shrink-0" />
                      <span className="text-sm text-zinc-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default TechnologyModal;
