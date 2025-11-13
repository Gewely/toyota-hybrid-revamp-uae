import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  totalHotspots: number;
  progress: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onStop: () => void;
}

export const TourControls: React.FC<TourControlsProps> = ({
  isPlaying,
  currentIndex,
  totalHotspots,
  progress,
  onPlayPause,
  onNext,
  onPrevious,
  onStop
}) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 240, 255, 0.1))',
          borderColor: 'rgba(0, 240, 255, 0.3)',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)'
        }}
      >
        {/* Previous Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Play/Pause Button */}
        <Button
          size="icon"
          onClick={onPlayPause}
          className="w-12 h-12 rounded-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #00f0ff, #ff00ff)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)'
          }}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </Button>

        {/* Next Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onNext}
          disabled={currentIndex === totalHotspots - 1}
          className="w-10 h-10 rounded-full hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 ml-4 mr-2">
          <span className="text-sm font-mono text-cyan-400 font-bold">
            {currentIndex + 1}/{totalHotspots}
          </span>
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00f0ff, #ff00ff)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Stop Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onStop}
          className="w-10 h-10 rounded-full hover:bg-red-500/20 text-red-400"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Keyboard Hints */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs text-muted-foreground text-center whitespace-nowrap">
        <span className="font-mono">←/→ Navigate • Space Play/Pause • Esc Stop</span>
      </div>
    </motion.div>
  );
};
