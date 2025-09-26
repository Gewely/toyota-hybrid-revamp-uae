import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { colors } from '../../utils/tokens';

export type FeatureModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const baseVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -40, scale: 0.98 },
};

export const FeatureModal1: React.FC<FeatureModalProps> = ({ isOpen, onClose }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative w-[90vw] max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(20,20,26,0.95)] p-0 text-white shadow-2xl"
            variants={baseVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
            >
              Close
            </button>
            <div className="grid gap-6 p-8 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5">
                <h3 className="text-3xl font-light">Carbon Aero Suite</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Explore a close-up of the adaptive aero system with zoomable details. Crafted in forged carbon, the GR Hybrid alters its stance seamlessly across drive modes.
                </p>
                <div
                  className="rounded-[24px] border border-white/10 bg-black/40 p-4 text-xs uppercase tracking-[0.35em]"
                  style={{ color: colors.textSecondary }}
                >
                  Active aero vanes deploy at 110 km/h, reducing drag by 12% while channeling cooling to performance battery modules.
                </div>
              </div>
              <motion.div className="relative h-60 overflow-hidden rounded-[24px]" whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}>
                <img
                  src="https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80"
                  alt="Carbon aero"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureModal1;
