import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface MiniStickyPriceBarProps {
  vehicleName: string;
  price: number;
  scrollThreshold?: number;
  onTestDrive?: () => void;
  onFinance?: () => void;
}

export const MiniStickyPriceBar: React.FC<MiniStickyPriceBarProps> = ({
  vehicleName,
  price,
  scrollThreshold = 600,
  onTestDrive,
  onFinance,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-semibold truncate max-w-[200px]">
                  {vehicleName}
                </h2>
                <div className="text-lg font-bold">
                  <AnimatedCounter value={price} prefix="AED " duration={1} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={onFinance}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Finance
                </Button>
                <Button size="sm" onClick={onTestDrive}>
                  <Car className="h-4 w-4 mr-2" />
                  Test Drive
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
