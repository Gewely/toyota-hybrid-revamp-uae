import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Wrench, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PerformantParallax } from '@/components/ui/performant-parallax';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CinematicScene {
  id: string;
  title: string;
  subtitle: string;
  mood: string;
  image: string;
  lighting: 'urban-night' | 'desert-gold' | 'showroom-gloss' | 'mountain-blue' | 'city-dawn';
  microInteraction?: 'headlights' | 'dashboard' | 'reflections';
}

interface CinematicFlagshipGalleryProps {
  vehicleName: string;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
}

const cinematicScenes: CinematicScene[] = [
  {
    id: 'urban-night',
    title: 'Urban Dominance',
    subtitle: 'Where luxury meets the cityscape',
    mood: 'Bold & Powerful',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2940',
    lighting: 'urban-night',
    microInteraction: 'headlights'
  },
  {
    id: 'showroom',
    title: 'Crafted Perfection',
    subtitle: 'Every detail, masterfully designed',
    mood: 'Refined & Elegant',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2940',
    lighting: 'showroom-gloss',
    microInteraction: 'reflections'
  },
  {
    id: 'desert',
    title: 'Unstoppable Spirit',
    subtitle: 'Adventure without boundaries',
    mood: 'Adventurous & Free',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2940',
    lighting: 'desert-gold'
  },
  {
    id: 'mountain',
    title: 'Elevated Excellence',
    subtitle: 'Peak performance, elevated presence',
    mood: 'Majestic & Bold',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940',
    lighting: 'mountain-blue'
  },
  {
    id: 'dawn',
    title: 'New Horizons',
    subtitle: 'Every journey begins here',
    mood: 'Inspiring & Premium',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2940',
    lighting: 'city-dawn',
    microInteraction: 'dashboard'
  }
];

export const CinematicFlagshipGallery: React.FC<CinematicFlagshipGalleryProps> = ({
  vehicleName,
  onBookTestDrive,
  onCarBuilder
}) => {
  const [activeScene, setActiveScene] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showInteraction, setShowInteraction] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentScene = cinematicScenes[activeScene];

  // Auto-advance scenes
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    
    const timer = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % cinematicScenes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, prefersReducedMotion]);

  // Trigger micro-interactions
  useEffect(() => {
    setShowInteraction(false);
    const timer = setTimeout(() => setShowInteraction(true), 500);
    return () => clearTimeout(timer);
  }, [activeScene]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveScene((prev) => (prev + 1) % cinematicScenes.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveScene((prev) => (prev - 1 + cinematicScenes.length) % cinematicScenes.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const lightingStyles = {
    'urban-night': 'from-slate-900/95 via-slate-800/80 to-slate-900/95',
    'desert-gold': 'from-amber-900/90 via-orange-900/70 to-amber-900/90',
    'showroom-gloss': 'from-zinc-900/95 via-zinc-800/85 to-zinc-900/95',
    'mountain-blue': 'from-blue-950/90 via-slate-900/80 to-blue-950/90',
    'city-dawn': 'from-rose-950/85 via-slate-900/75 to-indigo-950/85'
  };

  return (
    <section 
      className="relative w-full h-screen overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Scene with Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <img
              src={currentScene.image}
              alt={currentScene.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Lighting Overlay */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b",
              lightingStyles[currentScene.lighting]
            )} />

            {/* Micro-interactions */}
            {showInteraction && currentScene.microInteraction === 'headlights' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl"
              />
            )}

            {showInteraction && currentScene.microInteraction === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl"
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 lg:p-12">
        {/* Top: Scene Info */}
        <motion.div
          key={`info-${activeScene}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-2"
        >
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <span className="text-xs font-medium text-white/90 tracking-wider uppercase">
              {currentScene.mood}
            </span>
          </div>
        </motion.div>

        {/* Center: Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeScene}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="text-center space-y-6 max-w-4xl mx-auto"
            >
              <h2 className="font-serif text-5xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-none">
                {currentScene.title}
              </h2>
              <p className="text-xl lg:text-2xl text-white/80 font-light tracking-wide max-w-2xl mx-auto">
                {currentScene.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom: Navigation & CTA */}
        <div className="space-y-6">
          {/* Scene Indicators */}
          <div className="flex justify-center items-center gap-2">
            {cinematicScenes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveScene(index);
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === activeScene
                    ? "w-12 bg-white"
                    : "w-8 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to scene ${index + 1}`}
              />
            ))}
          </div>

          {/* Glassmorphic CTA Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
          >
            <Button
              onClick={onBookTestDrive}
              size={isMobile ? "default" : "lg"}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-lg shadow-primary/20"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Reserve Test Drive
            </Button>
            <Button
              onClick={onCarBuilder}
              size={isMobile ? "default" : "lg"}
              variant="outline"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold px-8 backdrop-blur-sm"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Configure Your {vehicleName}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-300"
        aria-label="Previous scene"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-300"
        aria-label="Next scene"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </section>
  );
};
