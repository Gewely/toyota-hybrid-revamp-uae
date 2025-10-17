import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { carBuilderTokens } from '@/styles/tokens.carbuilder';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AccessoryToggleProps {
  name: string;
  description: string;
  price: number;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  infoContent?: string;
  image?: string;
}

/**
 * Accessory toggle card component
 * Features checkbox visual, price display, and info tooltip
 */
const AccessoryToggle: React.FC<AccessoryToggleProps> = ({
  name,
  description,
  price,
  selected,
  onToggle,
  disabled = false,
  infoContent,
  image,
}) => {
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      onClick={disabled ? undefined : onToggle}
      className={cn(
        'p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200',
        selected
          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
          : 'border-border hover:border-primary/30 hover:bg-accent/50 shadow-sm hover:shadow-md',
        disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-card'
      )}
      whileHover={!disabled ? { scale: 1.01, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      transition={carBuilderTokens.spring.snappy}
      role="checkbox"
      aria-checked={selected}
      aria-disabled={disabled}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox visual */}
        <motion.div
          className={cn(
            'mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0',
            selected ? 'border-primary bg-primary' : 'border-border bg-background'
          )}
          animate={{ 
            scale: selected ? [1, 1.2, 1] : 1,
            backgroundColor: selected ? 'hsl(var(--primary))' : 'hsl(var(--background))'
          }}
          transition={carBuilderTokens.spring.snappy}
        >
          {selected && <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />}
        </motion.div>

        {/* Image thumbnail (if provided) */}
        {image && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-semibold text-base leading-tight">{name}</h4>
            <span className="text-sm font-bold text-primary flex-shrink-0">
              +AED {price.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Info button */}
        {infoContent && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleInfoClick}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label={`More information about ${name}`}
                >
                  <Info className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{infoContent}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </motion.div>
  );
};

export default AccessoryToggle;
