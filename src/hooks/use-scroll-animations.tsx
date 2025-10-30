import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { RefObject, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

interface ScrollAnimationConfig {
  ref: RefObject<HTMLElement>;
  offset?: ["start end" | "end start" | "start start" | "end end", "start end" | "end start" | "start start" | "end end"];
}

export const useScrollAnimation = ({ ref, offset = ["start end", "end start"] }: ScrollAnimationConfig) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  return { scrollProgress: scrollYProgress };
};

export const useScrollVelocity = () => {
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime;
      const scrollDelta = currentScrollY - lastScrollY;
      
      if (timeDelta > 0) {
        const currentVelocity = Math.abs(scrollDelta / timeDelta);
        setVelocity(currentVelocity);
        setDirection(scrollDelta > 0 ? 'down' : 'up');
      }
      
      lastScrollY = currentScrollY;
      lastTime = currentTime;
    };
    
    const throttledScroll = throttle(handleScroll, 16);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);
  
  return { velocity, direction };
};

export const useInViewAnimation = (threshold = 0.3, once = true) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  
  return {
    initial: { opacity: 0, y: 40 },
    animate: (isInView: boolean) => ({
      opacity: isInView ? 1 : 0,
      y: isInView ? 0 : 40,
    }),
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    onAnimationComplete: () => {
      if (once) setHasAnimated(true);
    },
  };
};

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const createScrollTransforms = (
  scrollProgress: MotionValue<number>,
  ranges: { input: number[], output: any[] }[]
) => {
  return ranges.map(({ input, output }) => 
    useTransform(scrollProgress, input, output)
  );
};
