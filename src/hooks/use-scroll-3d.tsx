import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, RefObject } from 'react';

interface UseScroll3DOptions {
  rotationRange?: [number, number];
  scaleRange?: [number, number];
  offsetRange?: [number, number];
}

interface UseScroll3DReturn {
  containerRef: RefObject<HTMLDivElement>;
  rotation: MotionValue<number>;
  scale: MotionValue<number>;
  scrollProgress: MotionValue<number>;
}

export const useScroll3D = (options: UseScroll3DOptions = {}): UseScroll3DReturn => {
  const {
    rotationRange = [0, 360],
    scaleRange = [1.2, 1],
    offsetRange = [0, 1]
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform scroll progress to rotation (with spring for smoothness)
  const rotationRaw = useTransform(scrollYProgress, [0, 1], rotationRange);
  const rotation = useSpring(rotationRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress to scale
  const scaleRaw = useTransform(scrollYProgress, [0, 1], scaleRange);
  const scale = useSpring(scaleRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return {
    containerRef,
    rotation,
    scale,
    scrollProgress: scrollYProgress
  };
};