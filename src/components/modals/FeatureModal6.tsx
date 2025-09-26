import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { FeatureModalProps } from './FeatureModal1';

const frames = [
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
];

export const FeatureModal6: React.FC<FeatureModalProps> = ({ isOpen, onClose }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const nextFrame = () => setFrameIndex((prev) => (prev + 1) % frames.length);
  const prevFrame = () => setFrameIndex((prev) => (prev - 1 + frames.length) % frames.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
        >
          <motion.div
            className="w-[94vw] max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(14,14,18,0.95)] text-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <img src={frames[frameIndex]} alt="360 view" className="h-[60vh] w-full object-cover" />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.35em]"
              >
                Close
              </button>
              <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6">
                <button
                  onClick={prevFrame}
                  className="rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.35em]"
                >
                  Prev
                </button>
                <div className="flex gap-2">
                  {frames.map((_, index) => (
                    <span key={index} className={`h-2 w-8 rounded-full ${index === frameIndex ? 'bg-white' : 'bg-white/30'}`} />
                  ))}
                </div>
                <button
                  onClick={nextFrame}
                  className="rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.35em]"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureModal6;
