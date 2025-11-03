import { useEffect, useState, RefObject } from 'react';
import { useReducedMotion } from 'framer-motion';

interface KenBurnsOptions {
  duration?: number;
  zoom?: [number, number];
  pan?: { x: [number, number]; y: [number, number] };
}

export const useKenBurns = (
  ref: RefObject<HTMLElement>,
  options: KenBurnsOptions = {}
) => {
  const {
    duration = 10000,
    zoom = [1, 1.1],
    pan = { x: [0, 2], y: [0, 2] },
  } = options;

  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [duration, prefersReducedMotion, ref]);

  const scale = zoom[0] + (zoom[1] - zoom[0]) * progress;
  const x = pan.x[0] + (pan.x[1] - pan.x[0]) * progress;
  const y = pan.y[0] + (pan.y[1] - pan.y[0]) * progress;

  return {
    transform: prefersReducedMotion
      ? 'none'
      : `scale(${scale}) translate(${x}%, ${y}%)`,
    transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease-out',
  };
};
