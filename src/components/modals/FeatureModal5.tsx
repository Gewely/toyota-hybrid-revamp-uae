import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { FeatureModalProps } from './FeatureModal1';

const faqs = [
  {
    question: 'How does concierge scheduling work?',
    answer: 'The concierge AI syncs with your calendar, anticipating travel windows and preparing the vehicle with climate, route, and reservations pre-set.',
  },
  {
    question: 'Is the data secure?',
    answer: 'All data is encrypted end-to-end with biometric authentication for every profile, ensuring each driver enjoys personalised experiences securely.',
  },
  {
    question: 'What services are included?',
    answer: 'Five-year complimentary over-the-air updates, curated events, and global lounge access ensure your ownership experience remains elevated.',
  },
];

export const FeatureModal5: React.FC<FeatureModalProps> = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        >
          <motion.div
            className="w-[92vw] max-w-2xl rounded-[32px] border border-white/10 bg-[rgba(18,18,24,0.95)] p-8 text-white shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-light">Concierge FAQ</h3>
              <button onClick={onClose} className="text-xs uppercase tracking-[0.35em] text-white/70">
                Close
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {faqs.map((faq, index) => {
                const isOpenIndex = openIndex === index;
                return (
                  <div key={faq.question} className="rounded-[24px] border border-white/10 bg-white/5">
                    <button
                      onClick={() => setOpenIndex(isOpenIndex ? null : index)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm uppercase tracking-[0.35em]"
                    >
                      {faq.question}
                      <span>{isOpenIndex ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpenIndex && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                          className="px-5 pb-5 text-sm text-white/80"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureModal5;
