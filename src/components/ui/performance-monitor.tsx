import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory?: number;
  animationCount: number;
}
interface PerformanceMonitorProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className,
  position = 'top-right'
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 0,
    memory: undefined,
    animationCount: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Check if performance monitor should be enabled
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const perfEnabled = searchParams.get('perf') === '1' || localStorage.getItem('perf-monitor') === 'enabled' || process.env.NODE_ENV === 'development';
    setIsVisible(perfEnabled);
  }, []);

  // Measure FPS
  useEffect(() => {
    if (!isVisible) return;
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;
    let frameTimesSum = 0;
    const measureFrame = (currentTime: number) => {
      const frameDelta = currentTime - lastTime;
      frameTimesSum += frameDelta;
      frameCount++;

      // Update metrics every second
      if (frameTimesSum >= 1000) {
        const fps = Math.round(frameCount * 1000 / frameTimesSum);
        const avgFrameTime = frameTimesSum / frameCount;

        // Get memory if available
        const memory = (performance as any).memory?.usedJSHeapSize ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) // Convert to MB
        : undefined;
        setMetrics({
          fps,
          frameTime: avgFrameTime,
          memory,
          animationCount: document.querySelectorAll('[data-animating="true"]').length
        });
        frameCount = 0;
        frameTimesSum = 0;
      }
      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(measureFrame);
    };
    animationFrameId = requestAnimationFrame(measureFrame);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);
  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);
  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 45) return 'text-yellow-500';
    return 'text-red-500';
  };
  const getFrameTimeColor = (time: number): string => {
    if (time <= 16) return 'text-green-500';
    if (time <= 22) return 'text-yellow-500';
    return 'text-red-500';
  };
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };
  if (!isVisible) return null;
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0.9
    }} className={cn("fixed z-[9999] font-mono text-xs", positionClasses[position], className)}>
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          

          {/* Metrics */}
          <AnimatePresence>
            {!isMinimized && <motion.div initial={{
            height: 0
          }} animate={{
            height: 'auto'
          }} exit={{
            height: 0
          }} className="overflow-hidden">
                
              </motion.div>}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>;
};

// Export a simple toggle function
export const enablePerformanceMonitor = () => {
  localStorage.setItem('perf-monitor', 'enabled');
  window.location.reload();
};
export const disablePerformanceMonitor = () => {
  localStorage.removeItem('perf-monitor');
  window.location.reload();
};