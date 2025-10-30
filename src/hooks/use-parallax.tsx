import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { RefObject } from 'react';

interface ParallaxConfig {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  offset?: ["start end" | "end start" | "start start" | "end end", "start end" | "end start" | "start start" | "end end"];
}

export const useParallax = (
  ref: RefObject<HTMLElement>,
  config: ParallaxConfig = {}
) => {
  const { speed = 0.5, direction = 'vertical', offset = ["start end", "end start"] } = config;
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });
  
  const outputRange = direction === 'vertical' 
    ? [`${-100 * speed}px`, `${100 * speed}px`]
    : [`${-100 * speed}px`, `${100 * speed}px`];
  
  const transform = useTransform(scrollYProgress, [0, 1], outputRange);
  
  return transform;
};

export const useMultiLayerParallax = (
  ref: RefObject<HTMLElement>,
  layers: number[] = [0.3, 0.6, 1.0]
) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  return layers.map(speed => ({
    y: useTransform(scrollYProgress, [0, 1], [`${-100 * speed}px`, `${100 * speed}px`]),
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
