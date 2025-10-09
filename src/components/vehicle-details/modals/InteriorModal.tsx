import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import ModalWrapper from './ModalWrapper';

interface InteriorModalProps {
  onClose: () => void;
}

const InteriorModal: React.FC<InteriorModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  
  const steps = [
    {
      title: 'Premium Dashboard',
      image: 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_01_800x447.jpg',
      features: [
        '12.3" Digital Instrument Cluster',
        'Heads-Up Display',
        'Premium Material Finishes',
        'Ambient Lighting System'
      ]
    },
    {
      title: 'Advanced Infotainment',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80',
      features: [
        '10" Touchscreen Display',
        'Wireless Apple CarPlay & Android Auto',
        'Premium JBL Audio System',
        'Voice Recognition'
      ]
    },
    {
      title: 'Luxury Comfort',
      image: 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_02_800x447.jpg',
      features: [
        'Ventilated Leather Seats',
        'Memory Position Settings',
        'Dual-Zone Climate Control',
        'Panoramic Moonroof'
      ]
    },
    {
      title: 'Cargo Versatility',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&q=80',
      features: [
        '60/40 Split Folding Seats',
        'Power Liftgate',
        'Cargo Area Lighting',
        'Underfloor Storage'
      ]
    }
  ];

  const currentStep = steps[step];

  const nextStep = () => setStep((prev) => (prev + 1) % steps.length);
  const prevStep = () => setStep((prev) => (prev - 1 + steps.length) % steps.length);

  const touchHandlers = useTouchGestures({
    onSwipeLeft: nextStep,
    onSwipeRight: prevStep,
    threshold: 60
  });

  return (
    <ModalWrapper title="Interior Experience" onClose={onClose}>
      <div className="p-6 lg:p-12">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-6" {...touchHandlers}>
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden touch-pan-y">
            <AnimatePresence mode="wait">
              <motion.img
                key={step}
                src={currentStep.image}
                alt={currentStep.title}
                className="w-full h-full object-cover"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: prefersReducedMotion ? 0.15 : 0.3 }}
                loading="lazy"
                decoding="async"
              />
            </AnimatePresence>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{currentStep.title}</h2>
            <ul className="space-y-2 sm:space-y-3">
              {currentStep.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/80">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Mobile Progress & Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              className="rounded-full text-foreground min-w-touch-target min-h-touch-target"
              aria-label="Previous interior feature"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === step ? 'w-8 bg-foreground' : 'w-2 bg-muted'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextStep}
              className="rounded-full text-foreground min-w-touch-target min-h-touch-target"
              aria-label="Next interior feature"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:grid lg:grid-cols-[60%_40%] gap-8">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={step}
                src={currentStep.image}
                alt={currentStep.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-6">
                {steps.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStep(idx)}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      idx === step ? 'bg-foreground' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-6">{currentStep.title}</h2>
              
              <ul className="space-y-4">
                {currentStep.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    <span className="text-lg text-foreground/80">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1 border-foreground text-foreground"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default InteriorModal;
