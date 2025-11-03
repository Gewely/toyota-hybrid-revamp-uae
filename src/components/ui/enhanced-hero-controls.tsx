import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Zap, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EnhancedHeroControlsProps {
  onShare?: () => void;
  onPremiumMode?: () => void;
  isPremiumMode?: boolean;
}

export const EnhancedHeroControls: React.FC<EnhancedHeroControlsProps> = ({
  onShare,
  onPremiumMode,
  isPremiumMode = false,
}) => {
  const [ambientGlow, setAmbientGlow] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* Premium Mode Toggle */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={isPremiumMode ? "default" : "outline"}
          size="sm"
          onClick={onPremiumMode}
          className="gap-2"
          onMouseEnter={() => setAmbientGlow(true)}
          onMouseLeave={() => setAmbientGlow(false)}
        >
          <Star className="h-4 w-4" />
          Premium Mode
        </Button>
        {ambientGlow && isPremiumMode && (
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-lg blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>

      {/* Share Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="ghost" size="icon" onClick={onShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Quick Stats Badges */}
      <div className="hidden md:flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <Zap className="h-3 w-3" />
          Fast Delivery
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <TrendingUp className="h-3 w-3" />
          Best Value
        </Badge>
      </div>
    </div>
  );
};
