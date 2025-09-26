import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { colors, shadows } from '../../utils/tokens';

type CtaModal = {
  id: string;
  title: string;
  description: string;
};

const CTAS: CtaModal[] = [
  { id: 'reserve', title: 'Reserve Online', description: 'Lock in your GR Hybrid with a fully refundable 5,000 AED deposit.' },
  { id: 'test-drive', title: 'Book Test Drive', description: 'Choose your preferred studio for an immersive track-inspired experience.' },
  { id: 'service', title: 'Service', description: 'Schedule curated maintenance with personalised concierge pick-up.' },
  { id: 'trade', title: 'Trade-In', description: 'Receive an instant valuation with loyalty enhancements for GR owners.' },
];

export const PrimaryCTAs: React.FC = () => {
  const [activeModal, setActiveModal] = useState<CtaModal | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-8">
      <div className="flex flex-col gap-4 text-white">
        <p className="text-xs uppercase tracking-[0.4em]" style={{ color: colors.accent }}>
          Experience
        </p>
        <h2 className="text-3xl font-light sm:text-4xl">Tailor Your Journey</h2>
        <p className="max-w-2xl text-sm sm:text-base" style={{ color: colors.textSecondary }}>
          Explore curated calls-to-action crafted for the UAE experience. Each opens a sleek demo modal.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CTAS.map((cta, index) => (
          <motion.button
            key={cta.id}
            className="rounded-[28px] border border-white/10 bg-[rgba(16,16,22,0.9)] px-6 py-8 text-left text-white shadow-xl transition hover:border-[#EB0A1E]"
            whileHover={prefersReducedMotion ? undefined : { y: -6 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setActiveModal(cta)}
            style={{ boxShadow: shadows.glass }}
          >
            <span className="text-xs uppercase tracking-[0.4em]" style={{ color: colors.textMuted }}>
              0{index + 1}
            </span>
            <h3 className="mt-4 text-2xl font-light">{cta.title}</h3>
            <p className="mt-3 text-sm" style={{ color: colors.textSecondary }}>
              {cta.description}
            </p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          >
            <motion.div
              className="w-[90vw] max-w-md rounded-[28px] border border-white/10 bg-[rgba(12,12,16,0.95)] p-8 text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            >
              <h3 className="text-2xl font-light">{activeModal.title}</h3>
              <p className="mt-4 text-sm" style={{ color: colors.textSecondary }}>
                {activeModal.description}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.35em] text-white/80"
                >
                  Close
                </button>
                <button className="rounded-full border border-[#EB0A1E] bg-[#EB0A1E] px-5 py-2 text-xs uppercase tracking-[0.35em] text-white">
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PrimaryCTAs;
