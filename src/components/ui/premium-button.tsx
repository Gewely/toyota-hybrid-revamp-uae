import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';

interface PremiumButtonProps extends ButtonProps {
  withRipple?: boolean;
  hapticFeedback?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  withRipple = true,
  hapticFeedback = true,
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Ripple effect
    if (withRipple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  return (
    <Button
      className={`luxury-button relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {/* Ripple effect */}
      {withRipple && ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </Button>
  );
};
