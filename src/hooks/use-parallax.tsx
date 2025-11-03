import { useScroll, useTransform } from 'framer-motion';
import { RefObject } from 'react';

interface ParallaxConfig {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  offset?: ["start end" | "end start" | "start start" | "end end", "start end" | "end start" | "start start" | "end end"];
  disabled?: boolean;
}

export const useParallax = (
  ref: RefObject<HTMLElement>,
  config: ParallaxConfig = {}
) => {
  const { speed = 0.5, direction = 'vertical', offset = ["start end", "end start"], disabled = false } = config;
  
  const { scrollYProgress } = useScroll({ target: ref, offset });
  
  const reducedSpeed = speed * 0.6;
  const outputRange = direction === 'vertical' 
    ? [`${-50 * reducedSpeed}px`, `${50 * reducedSpeed}px`]
    : [`${-50 * reducedSpeed}px`, `${50 * reducedSpeed}px`];
  
  return useTransform(scrollYProgress, [0, 1], disabled ? ['0px', '0px'] : outputRange);
};

export const useMultiLayerParallax = (
  ref: RefObject<HTMLElement>,
  layers: number[] = [0.3, 0.6, 1.0] // Max 3 layers for performance
) => {
  // Limit to max 3 layers
  const limitedLayers = layers.slice(0, 3);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  // Use translateZ for depth instead of multiple layers
  return limitedLayers.map((speed, index) => ({
    y: useTransform(scrollYProgress, [0, 1], [`${-50 * speed}px`, `${50 * speed}px`]),
    z: useTransform(scrollYProgress, [0, 1], [0, index * 10]), // Depth effect
    speed,
  }));
};

export const useKenBurnsEffect = (
  ref: RefObject<HTMLElement>,
  config: { zoom?: [number, number]; pan?: { x: [number, number]; y: [number, number] } } = {}
) => {
  const { zoom = [1.0, 1.1], pan = { x: [0, 0], y: [0, 0] } } = config;
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], zoom);
  const x = useTransform(scrollYProgress, [0, 1], pan.x.map(v => `${v}%`));
  const y = useTransform(scrollYProgress, [0, 1], pan.y.map(v => `${v}%`));
  
  return { scale, x, y };
};
