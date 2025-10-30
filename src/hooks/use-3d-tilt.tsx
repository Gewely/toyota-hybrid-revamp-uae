import { useState, useEffect, RefObject } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

interface Tilt3DConfig {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
}

export const use3DTilt = (
  ref: RefObject<HTMLElement>,
  config: Tilt3DConfig = {}
) => {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    glare = false,
  } = config;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), { stiffness: speed, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: speed, damping: 30 });
  const glareX = useSpring(useMotionValue(50), { stiffness: speed, damping: 30 });
  const glareY = useSpring(useMotionValue(50), { stiffness: speed, damping: 30 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateXValue = (mouseY / (rect.height / 2)) * maxTilt;
      const rotateYValue = (mouseX / (rect.width / 2)) * maxTilt;
      
      rotateX.set(-rotateXValue);
      rotateY.set(rotateYValue);
      
      if (glare) {
        const glareXValue = ((e.clientX - rect.left) / rect.width) * 100;
        const glareYValue = ((e.clientY - rect.top) / rect.height) * 100;
        glareX.set(glareXValue);
        glareY.set(glareYValue);
      }
    };

    const handleMouseLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
      if (glare) {
        glareX.set(50);
        glareY.set(50);
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, maxTilt, glare, rotateX, rotateY, glareX, glareY]);

  return {
    style: {
      perspective,
      transform: 'preserve-3d',
    },
    cardStyle: {
      rotateX,
      rotateY,
      scale,
    },
    glareStyle: glare ? {
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
    } : {},
  };
};

export const useScrollTilt = (
  ref: RefObject<HTMLElement>,
  maxRotation = 15
) => {
  const { scrollYProgress } = require('framer-motion').useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = require('framer-motion').useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [maxRotation, 0, -maxRotation]
  );

  return { rotateX, style: { transformStyle: 'preserve-3d' as const } };
};
