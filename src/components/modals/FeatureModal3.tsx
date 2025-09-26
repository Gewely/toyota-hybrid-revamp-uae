import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { FeatureModalProps } from './FeatureModal1';

export const FeatureModal3: React.FC<FeatureModalProps> = ({ isOpen, onClose }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
        >
          <motion.div
            className="w-[92vw] max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-black/50 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-video w-full">
              <iframe
                title="Cockpit Studio"
                src="https://www.youtube.com/embed/bWz-7cVb8_0?autoplay=1&mute=1"
                className="h-full w-full"
                allow="autoplay; encrypted-media"
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white"
              >
                Close
              </button>
            </div>
            <div className="bg-[rgba(12,12,18,0.9)] px-8 py-6 text-sm text-white">
              Experience the immersive cockpit studio with live AR overlays, performance telemetry, and ambient lighting sequences.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureModal3;
