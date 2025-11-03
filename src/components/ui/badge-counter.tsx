import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeCounterProps {
  count: number;
  isGRMode?: boolean;
  className?: string;
}

export const BadgeCounter: React.FC<BadgeCounterProps> = ({ 
  count, 
  isGRMode = false,
  className 
}) => {
  if (count === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className={cn(
          "absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold",
          isGRMode 
            ? "bg-[#EB0A1E] text-white border border-[#FF2A3C] shadow-[0_0_8px_rgba(235,10,30,0.6)]"
            : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border border-primary/20",
          className
        )}
      >
        {count > 99 ? '99+' : count}
      </motion.div>
    </AnimatePresence>
  );
};
