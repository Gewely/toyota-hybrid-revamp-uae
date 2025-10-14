import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Monitor, Sofa, Sparkles, Volume2 } from 'lucide-react';
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
      icon: <Monitor className="h-6 w-6" />,
      features: [
        '12.3" Digital Instrument Cluster',
        'Heads-Up Display with Navigation',
        'Premium Material Finishes',
        'Customizable Ambient Lighting System'
      ]
    },
    {
      title: 'Advanced Infotainment',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80',
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        '10.5" HD Touchscreen Display',
        'Wireless Apple CarPlay & Android Auto',
        'Premium JBL 9-Speaker Audio System',
        'Voice Recognition & Smart Assistant'
      ]
    },
    {
      title: 'Luxury Comfort',
      image: 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_02_800x447.jpg',
      icon: <Sofa className="h-6 w-6" />,
      features: [
        'Ventilated Leather Seats with Massage',
        '8-Way Power Memory Settings',
        'Tri-Zone Automatic Climate Control',
        'Panoramic Glass Moonroof'
      ]
    },
    {
      title: 'Cargo Versatility',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&q=80',
      icon: <Volume2 className="h-6 w-6" />,
      features: [
        '60/40 Split Folding Rear Seats',
        'Power Hands-Free Liftgate',
        'LED Cargo Area Lighting',
        'Underfloor Storage Compartment'
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
          {/* Tab Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === idx
                    ? 'bg-foreground text-background shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={step}
                src={currentStep.image}
                alt={currentStep.title}
                className="w-full h-full object-cover"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                loading="lazy"
                decoding="async"
              />
            </AnimatePresence>
            
            {/* Loading shimmer placeholder */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {currentStep.icon}
              </div>
              <h2 className="text-2xl font-bold text-foreground">{currentStep.title}</h2>
            </div>
            
            <ul className="space-y-3">
              {currentStep.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-base text-foreground/90">{feature}</span>
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
              className="rounded-full text-foreground min-w-[56px] min-h-[56px] hover:bg-accent"
              aria-label="Previous interior feature"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === step ? 'w-8 bg-foreground' : 'w-2 bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextStep}
              className="rounded-full text-foreground min-w-[56px] min-h-[56px] hover:bg-accent"
              aria-label="Next interior feature"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:block">
          {/* Tab Navigation */}
          <div className="flex gap-3 mb-8">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
                  step === idx
                    ? 'bg-foreground text-background shadow-lg scale-105'
                    : 'bg-accent text-foreground hover:bg-accent/80'
                }`}
              >
                {s.icon}
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[55%_45%] gap-8">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={step}
                  src={currentStep.image}
                  alt={currentStep.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  loading="lazy"
                />
              </AnimatePresence>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-4xl font-bold text-foreground">{currentStep.title}</h2>
              
              <ul className="space-y-4">
                {currentStep.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-accent hover:bg-accent/70 transition-colors"
                  >
                    <span className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-lg text-foreground/90">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background h-12"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-12"
                >
                  Next <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default InteriorModal;
