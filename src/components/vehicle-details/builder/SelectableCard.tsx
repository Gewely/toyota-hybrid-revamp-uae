import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { carBuilderTokens } from '@/styles/tokens.carbuilder';

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  badge?: ReactNode;
  showCheckmark?: boolean;
}

/**
 * Premium selectable card component
 * Features soft shadows, smooth transitions, and hover effects
 */
const SelectableCard: React.FC<SelectableCardProps> = ({
  selected,
  onClick,
  children,
  className,
  disabled = false,
  badge,
  showCheckmark = true,
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative w-full text-left rounded-2xl border-2 transition-all duration-300',
        'bg-card hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary shadow-lg shadow-primary/10'
          : 'border-border/60 hover:border-primary/30 shadow-md hover:shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed hover:border-border/60 hover:bg-card',
        className
      )}
      whileHover={!disabled ? { y: -4, scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={carBuilderTokens.spring.snappy}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {/* Selection indicator */}
      {selected && showCheckmark && (
        <motion.div
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={carBuilderTokens.spring.luxurious}
        >
          <Check className="w-5 h-5 text-primary-foreground" strokeWidth={3} />
        </motion.div>
      )}

      {/* Badge overlay */}
      {badge && (
        <div className="absolute top-4 left-4 z-10">
          {badge}
        </div>
      )}

      {/* Content */}
      {children}
    </motion.button>
  );
};

export default SelectableCard;
