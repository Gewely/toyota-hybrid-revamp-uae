import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { carBuilderTokens } from '@/styles/tokens.carbuilder';
import { cn } from '@/lib/utils';

interface MobileActionBarProps {
  canContinue: boolean;
  onContinue: () => void;
  primaryText?: string;
  secondaryText?: string;
  onSecondary?: () => void;
  isLastStep?: boolean;
  className?: string;
}

/**
 * Sticky bottom action bar for mobile Car Builder
 * Safe-area aware with primary CTA
 */
const MobileActionBar: React.FC<MobileActionBarProps> = ({
  canContinue,
  onContinue,
  primaryText = 'Continue',
  secondaryText,
  onSecondary,
  isLastStep = false,
  className,
}) => {
  return (
    <motion.div 
      className={cn(
        "sticky bottom-0 z-40 bg-card border-t border-border backdrop-blur-md bg-card/95 supports-[backdrop-filter]:bg-card/80",
        className
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={carBuilderTokens.spring.luxurious}
    >
      <div className="px-4 py-3 flex flex-col gap-3">
        <Button
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full rounded-xl py-6 text-base font-semibold shadow-lg hover:shadow-xl disabled:shadow-md transition-shadow"
          size="lg"
        >
          <span>{isLastStep ? 'Complete Configuration' : primaryText}</span>
          {isLastStep ? (
            <Check className="w-5 h-5 ml-2" />
          ) : (
            <ArrowRight className="w-5 h-5 ml-2" />
          )}
        </Button>

        {secondaryText && onSecondary && (
          <Button
            onClick={onSecondary}
            variant="outline"
            className="w-full rounded-xl py-3 text-sm"
          >
            {secondaryText}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default MobileActionBar;
