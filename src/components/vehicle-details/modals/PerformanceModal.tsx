import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Gauge, Timer, Cog } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

interface PerformanceModalProps {
  onClose: () => void;
}

type DriveMode = 'eco' | 'normal' | 'sport';

const PerformanceModal: React.FC<PerformanceModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<DriveMode>('sport');

  const stats = {
    eco: { 
      hp: 200, 
      speed: 180, 
      torque: 350, 
      acceleration: 8.5,
      color: 'from-green-500 to-emerald-600'
    },
    normal: { 
      hp: 250, 
      speed: 220, 
      torque: 420, 
      acceleration: 7.2,
      color: 'from-blue-500 to-cyan-600'
    },
    sport: { 
      hp: 300, 
      speed: 260, 
      torque: 500, 
      acceleration: 6.5,
      color: 'from-red-500 to-rose-600'
    }
  };

  const current = stats[mode];

  return (
    <ModalWrapper title="Performance" onClose={onClose} background="bg-zinc-900">
      <div className="p-6 lg:p-12">
        {/* Drive Mode Selector */}
        <div className="flex justify-center gap-4 mb-12">
          {(['eco', 'normal', 'sport'] as DriveMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 lg:px-8 py-3 lg:py-4 font-bold rounded-full text-sm lg:text-base transition-all ${
                mode === m
                  ? 'bg-[hsl(var(--toyota-red))] text-white shadow-lg scale-105'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Speedometer Gauge */}
        <div className="flex justify-center mb-12">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="20"
              />
              
              {/* Progress circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={502}
                strokeDashoffset={502 - (502 * current.speed) / 300}
                initial={{ strokeDashoffset: 502 }}
                animate={{ strokeDashoffset: 502 - (502 * current.speed) / 300 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                transform="rotate(-90 100 100)"
              />
              
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EB0A1E" />
                  <stop offset="100%" stopColor="#FF6B6B" />
                </linearGradient>
              </defs>
            </svg>

            {/* Speed Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <div className="text-5xl lg:text-6xl font-bold text-white mb-1">
                    {current.speed}
                  </div>
                  <div className="text-lg lg:text-xl text-zinc-400">km/h</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          <div className="p-6 rounded-2xl bg-zinc-800 border border-zinc-700">
            <Zap className="h-8 w-8 text-[hsl(var(--toyota-red))] mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{current.hp}</div>
            <div className="text-sm text-zinc-400">Horsepower</div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-800 border border-zinc-700">
            <Cog className="h-8 w-8 text-[hsl(var(--toyota-red))] mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{current.torque}</div>
            <div className="text-sm text-zinc-400">Nm Torque</div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-800 border border-zinc-700">
            <Timer className="h-8 w-8 text-[hsl(var(--toyota-red))] mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{current.acceleration}s</div>
            <div className="text-sm text-zinc-400">0-100 km/h</div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-800 border border-zinc-700">
            <Gauge className="h-8 w-8 text-[hsl(var(--toyota-red))] mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{current.speed}</div>
            <div className="text-sm text-zinc-400">Top Speed</div>
          </div>
        </motion.div>

        {/* Mode Description */}
        <motion.div
          key={`desc-${mode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700"
        >
          <h3 className="text-xl font-bold text-white mb-2">
            {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
          </h3>
          <p className="text-zinc-400">
            {mode === 'eco' && 'Optimized for fuel efficiency with smooth power delivery and maximum range.'}
            {mode === 'normal' && 'Balanced performance and efficiency for everyday driving comfort.'}
            {mode === 'sport' && 'Maximum performance with responsive throttle and dynamic handling.'}
          </p>
        </motion.div>
      </div>
    </ModalWrapper>
  );
};

export default PerformanceModal;
