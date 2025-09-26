import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { colors } from '../../utils/tokens';
import type { FeatureModalProps } from './FeatureModal1';

const powerMetrics = [
  { label: 'Total System Output', value: '540 hp' },
  { label: 'Instant Torque', value: '780 Nm' },
  { label: 'Battery Architecture', value: '800V Solid-State' },
  { label: 'Boost Mode', value: 'Overboost +80 hp / 10s' },
];

export const FeatureModal2: React.FC<FeatureModalProps> = ({ isOpen, onClose }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
        >
          <motion.div
            className="mb-8 w-[92vw] max-w-4xl overflow-hidden rounded-[36px] border border-white/10 bg-[rgba(16,16,22,0.95)] p-8 text-white shadow-xl"
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 120 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-light">Performance Metrics</h3>
              <button
                onClick={onClose}
                className="text-xs uppercase tracking-[0.4em]"
                style={{ color: colors.textSecondary }}
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {powerMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : index * 0.08 }}
                >
                  <p className="text-xs uppercase tracking-[0.35em]" style={{ color: colors.textMuted }}>
                    {metric.label}
                  </p>
                  <p className="mt-3 text-2xl">{metric.value}</p>
                </motion.div>
              ))}
            </div>
            <div
              className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm"
              style={{ color: colors.textSecondary }}
            >
              Launch the overboost paddle to unlock 80 hp for rapid overtakes while intelligent torque vectoring ensures absolute stability.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureModal2;
