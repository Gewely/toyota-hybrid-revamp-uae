import { useRef, useState, useCallback, useEffect } from 'react';

export interface MagneticHoverOptions {
  strength?: number; // Magnetic pull strength (0-1)
  range?: number; // Distance in pixels where effect is active
  disabled?: boolean;
}

const DEFAULT_OPTIONS: Required<MagneticHoverOptions> = {
  strength: 0.3,
  range: 80,
  disabled: false
};

export const useMagneticHover = (options: MagneticHoverOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const config = { ...DEFAULT_OPTIONS, ...options };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || config.disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance < config.range) {
      setPosition({
        x: distanceX * config.strength,
        y: distanceY * config.strength
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, [config.disabled, config.range, config.strength]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || config.disabled) return;

    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, config.disabled]);

  return {
    ref,
    isHovered,
    style: {
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      transition: isHovered ? 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      willChange: isHovered ? 'transform' : 'auto'
    }
  };
};
