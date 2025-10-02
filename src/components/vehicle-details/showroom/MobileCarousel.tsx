import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { ShowroomCard } from './types';

interface MobileCarouselProps {
  cards: ShowroomCard[];
  onCardClick: (id: string) => void;
}

const MobileCarousel: React.FC<MobileCarouselProps> = ({ cards, onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handleSwipeRight = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const touchHandlers = useTouchGestures({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50
  });

  const currentCard = cards[currentIndex];

  return (
    <div className="lg:hidden w-full h-[85vh] relative">
      <div 
        className="w-full h-full"
        {...touchHandlers}
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full relative rounded-2xl overflow-hidden"
        >
          <img 
            src={currentCard.image} 
            alt={currentCard.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-8 left-6 right-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentCard.title}
            </h2>
            <p className="text-white/90 text-sm mb-4">
              {currentCard.tagline}
            </p>
            <Button
              variant="ghost"
              className="text-white border-white border-2 hover:bg-white hover:text-zinc-900"
              onClick={() => onCardClick(currentCard.id)}
            >
              Experience <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;
