import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { carBuilderTokens } from '@/styles/tokens.carbuilder';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ColorSwatchProps {
  name: string;
  colorCode: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Color swatch component with tooltip
 * Features selection ring and smooth animations
 */
const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  colorCode,
  selected,
  onClick,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const swatchSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'group relative rounded-xl border-2 transition-all duration-200 flex items-center justify-center',
              selected
                ? 'border-primary shadow-lg shadow-primary/20'
                : 'border-transparent hover:border-border',
              disabled && 'opacity-40 cursor-not-allowed',
              sizeClasses[size]
            )}
            whileHover={!disabled ? { scale: 1.1 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            transition={carBuilderTokens.spring.snappy}
            aria-label={name}
            aria-pressed={selected}
            aria-disabled={disabled}
          >
            {/* Color circle */}
            <div
              className={cn(
                'rounded-lg shadow-md ring-1 ring-black/10 transition-transform group-hover:scale-105',
                swatchSizes[size]
              )}
              style={{ backgroundColor: colorCode }}
            />

            {/* Checkmark overlay */}
            {selected && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={carBuilderTokens.spring.luxurious}
              >
                <div className="w-6 h-6 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                </div>
              </motion.div>
            )}

            {/* Disabled overlay */}
            {disabled && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-destructive rotate-45 origin-center" />
              </div>
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ColorSwatch;
