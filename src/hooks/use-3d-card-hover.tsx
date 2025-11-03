import { useState, useCallback, RefObject } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CardTiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

export const use3DCardHover = (
  ref: RefObject<HTMLElement>,
  options: { maxTilt?: number; scale?: number } = {}
) => {
  const { maxTilt = 15, scale: hoverScale = 1.02 } = options;
  const prefersReducedMotion = useReducedMotion();

  const [tilt, setTilt] = useState<CardTiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion || !ref.current) return;

      const card = ref.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTilt({
        rotateX,
        rotateY,
        scale: hoverScale,
      });
    },
    [maxTilt, hoverScale, prefersReducedMotion, ref]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
  }, []);

  const style = prefersReducedMotion
    ? {}
    : {
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
        transition: 'transform 0.3s ease-out',
      };

  return {
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};
