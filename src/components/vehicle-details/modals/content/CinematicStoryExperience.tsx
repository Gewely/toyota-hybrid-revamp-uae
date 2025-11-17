import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';
import { prefersReducedMotion } from '@/utils/modal-performance';

interface CinematicStoryExperienceProps {
  vehicle: VehicleModel;
  onClose: () => void;
  onTestDrive: () => void;
  onBuild?: () => void;
  storyType?: 'interior' | 'exterior' | 'performance' | 'technology' | 'safety';
}

const stories = {
  interior: [
    {
      image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true',
      title: 'Your Sanctuary of Comfort',
      subtitle: 'Where luxury meets functionality',
      quote: 'Every journey becomes an experience worth savoring'
    },
    {
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1600',
      title: 'Premium Craftsmanship',
      subtitle: 'Hand-selected materials',
      quote: 'Attention to detail that speaks volumes'
    },
    {
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600',
      title: 'Technology Meets Elegance',
      subtitle: 'Intuitive controls at your fingertips',
      quote: 'Innovation designed around you'
    }
  ],
  exterior: [
    {
      image: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-005-2160.jpg',
      title: 'Commanding Presence',
      subtitle: 'Bold design that turns heads',
      quote: 'Make an entrance wherever you go'
    },
    {
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600',
      title: 'Sculpted Perfection',
      subtitle: 'Every line tells a story',
      quote: 'Form follows function in perfect harmony'
    },
    {
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600',
      title: 'Ready for Adventure',
      subtitle: 'Built to conquer any terrain',
      quote: 'Your gateway to endless possibilities'
    }
  ],
  performance: [
    {
      image: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg',
      title: 'Power Unleashed',
      subtitle: 'Feel the thrill of raw performance',
      quote: 'Every mile is an exhilarating adventure'
    },
    {
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600',
      title: 'Precision Engineering',
      subtitle: 'Technology that responds to you',
      quote: 'Control that inspires confidence'
    }
  ],
  technology: [
    {
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600',
      title: 'Connected Living',
      subtitle: 'Your digital life, seamlessly integrated',
      quote: 'Technology that enhances every moment'
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600',
      title: 'Intelligent Features',
      subtitle: 'Innovation at your service',
      quote: 'Smart solutions for modern life'
    }
  ],
  safety: [
    {
      image: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg',
      title: 'Protected & Confident',
      subtitle: 'Advanced safety for peace of mind',
      quote: 'Your safety is our priority'
    },
    {
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1600',
      title: 'Always Watching',
      subtitle: 'Technology that keeps you safe',
      quote: 'Drive with complete confidence'
    }
  ]
};

export const CinematicStoryExperience: React.FC<CinematicStoryExperienceProps> = ({
  vehicle,
  onTestDrive,
  onBuild,
  storyType = 'exterior'
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = stories[storyType];
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full min-h-[70vh] bg-black rounded-2xl overflow-hidden">
      {/* Image Carousel with Ken Burns Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1 }}
          animate={reducedMotion ? { opacity: 1 } : { 
            opacity: 1, 
            scale: 1.1,
            transition: { 
              scale: { duration: 5, ease: 'linear' },
              opacity: { duration: 0.5 }
            }
          }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative h-full min-h-[70vh] flex flex-col justify-end p-8 lg:p-12 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {/* Subtitle */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary text-sm uppercase tracking-widest mb-3"
            >
              {slides[currentSlide].subtitle}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold text-white mb-6"
            >
              {slides[currentSlide].title}
            </motion.h2>

            {/* Quote */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4 mb-8"
            >
              <Quote className="w-8 h-8 text-primary flex-shrink-0" />
              <p className="text-xl text-white/90 italic">
                {slides[currentSlide].quote}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button onClick={onTestDrive} size="lg" variant="default">
                Book Test Drive
              </Button>
              {onBuild && (
                <Button onClick={onBuild} size="lg" variant="outline" className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20">
                  Build Yours
                </Button>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all ${
                idx === currentSlide 
                  ? 'w-8 bg-primary' 
                  : 'w-1 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
