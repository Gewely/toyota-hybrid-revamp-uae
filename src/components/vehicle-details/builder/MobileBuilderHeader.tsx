import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { carBuilderTokens } from '@/styles/tokens.carbuilder';

interface MobileBuilderHeaderProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onClose: () => void;
  onReset?: () => void;
  title?: string;
}

/**
 * Mobile header for Car Builder
 * Compact, sticky design with safe-area awareness
 */
const MobileBuilderHeader: React.FC<MobileBuilderHeaderProps> = ({
  step,
  totalSteps,
  onBack,
  onClose,
  onReset,
  title,
}) => {
  const canGoBack = step > 1;

  return (
    <motion.header 
      className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-md bg-card/95 supports-[backdrop-filter]:bg-card/80"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={carBuilderTokens.spring.luxurious}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back button */}
        <div className="flex-1">
          {canGoBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2 -ml-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Back</span>
            </Button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        {/* Center: Title or step indicator */}
        <div className="flex-shrink-0 text-center">
          {title ? (
            <h1 className="font-semibold text-base">{title}</h1>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Step {step} of {totalSteps}
              </span>
            </div>
          )}
        </div>

        {/* Right: Close and Reset */}
        <div className="flex-1 flex items-center justify-end gap-1">
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-2"
              aria-label="Reset configuration"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="gap-2 -mr-2"
            aria-label="Close builder"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default MobileBuilderHeader;
