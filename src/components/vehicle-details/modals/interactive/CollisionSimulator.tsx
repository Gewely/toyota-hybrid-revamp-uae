import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Play, RotateCcw } from 'lucide-react';

interface CollisionSimulatorProps {
  className?: string;
}

type SimulationState = 'ready' | 'approaching' | 'braking' | 'avoided';

export const CollisionSimulator: React.FC<CollisionSimulatorProps> = ({ className }) => {
  const [state, setState] = useState<SimulationState>('ready');
  const [distance, setDistance] = useState(100);

  const runSimulation = () => {
    setState('approaching');
    setDistance(100);
  };

  const resetSimulation = () => {
    setState('ready');
    setDistance(100);
  };

  useEffect(() => {
    if (state === 'approaching') {
      const interval = setInterval(() => {
        setDistance((prev) => {
          if (prev <= 30) {
            setState('braking');
            return prev;
          }
          return prev - 5;
        });
      }, 100);
      return () => clearInterval(interval);
    } else if (state === 'braking') {
      const timeout = setTimeout(() => {
        setState('avoided');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Simulation Canvas */}
      <div className="relative bg-gradient-to-b from-accent/30 to-background rounded-2xl border-2 border-border overflow-hidden h-64">
        {/* Road */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-muted/30">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border border-dashed" />
        </div>

        {/* Your Vehicle */}
        <motion.div
          animate={{
            left: state === 'braking' ? '15%' : '10%',
          }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-8 w-20 h-12 z-10"
        >
          <div className="relative">
            <div className="w-full h-full bg-primary rounded-lg shadow-lg" />
            <div className="absolute top-1 left-2 right-2 h-6 bg-primary-foreground/20 rounded" />
            {state === 'braking' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="absolute -left-1 top-1/2 -translate-y-1/2"
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-1 h-6 bg-red-500 rounded" />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Obstacle */}
        <motion.div
          animate={{
            right: state === 'ready' ? '-10%' : `${distance}%`,
          }}
          transition={{ duration: 0.1 }}
          className="absolute bottom-8 w-16 h-10"
        >
          <div className="w-full h-full bg-destructive rounded shadow-lg" />
        </motion.div>

        {/* Warning Indicators */}
        <AnimatePresence>
          {state === 'approaching' && distance < 50 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Collision Warning!</span>
            </motion.div>
          )}
          {state === 'braking' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Pre-Collision System Active</span>
            </motion.div>
          )}
          {state === 'avoided' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Collision Avoided!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Distance Indicator */}
        {state !== 'ready' && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">Distance to Obstacle</p>
            <motion.p
              key={distance}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
            >
              {Math.max(0, distance).toFixed(0)}m
            </motion.p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runSimulation}
          disabled={state !== 'ready' && state !== 'avoided'}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          {state === 'avoided' ? 'Run Again' : 'Start Simulation'}
        </motion.button>
        {state !== 'ready' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetSimulation}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </motion.button>
        )}
      </div>

      {/* Information Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Detection Range',
            value: '150m',
            description: 'Advanced radar and camera system',
          },
          {
            title: 'Reaction Time',
            value: '0.1s',
            description: 'Faster than human reflexes',
          },
          {
            title: 'Brake Force',
            value: 'Auto',
            description: 'Maximum braking applied',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="bg-accent/50 p-4 rounded-xl border border-border"
          >
            <h4 className="font-semibold mb-1">{stat.title}</h4>
            <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
