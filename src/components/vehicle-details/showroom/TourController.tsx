import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, X } from 'lucide-react';

interface TourControllerProps {
  isActive: boolean;
  isPaused: boolean;
  progress: number;
  currentIndex: number;
  totalCards: number;
  currentCardTitle?: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSkip: () => void;
}

export const TourController: React.FC<TourControllerProps> = ({
  isActive,
  isPaused,
  progress,
  currentIndex,
  totalCards,
  currentCardTitle,
  onStart,
  onPause,
  onResume,
  onStop,
  onSkip
}) => {
  if (!isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6"
      >
        <Button
          onClick={onStart}
          size="lg"
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          Start Guided Tour
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={isPaused ? onResume : onPause}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </Button>

              <Button
                onClick={onSkip}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold text-foreground">{currentIndex + 1}</span>
                <span className="text-muted-foreground"> / {totalCards}</span>
                {currentCardTitle && (
                  <span className="text-foreground ml-2">• {currentCardTitle}</span>
                )}
              </div>

              <Button
                onClick={onStop}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
