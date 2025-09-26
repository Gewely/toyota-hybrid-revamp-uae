import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { FeatureModalProps } from './FeatureModal1';

const hotspots = [
  { id: 'concierge', label: 'Concierge AI', description: 'Predictive concierge orchestrates reservations, charging, and itinerary updates in real-time.' },
  { id: 'sync', label: 'Device Sync', description: 'Seamless device syncing with biometric authentication ensures private access to vehicle modes.' },
  { id: 'wellness', label: 'Wellness', description: 'Ambient modes adapt fragrance, lighting, and seat kinetics for revitalising journeys.' },
];

export const FeatureModal4: React.FC<FeatureModalProps> = ({ isOpen, onClose }) => {
  const [activeHotspot, setActiveHotspot] = useState(hotspots[0]);
  const prefersReducedMotion = useReducedMotion();

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
            className="w-[94vw] max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[rgba(15,15,22,0.95)] text-white shadow-2xl"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-6 p-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80"
                  alt="Concierge"
                  className="h-full w-full rounded-[28px] object-cover"
                />
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Concierge Ecosystem</p>
                <h3 className="text-3xl font-light">Cloud-Personalised Services</h3>
                <div className="flex flex-wrap gap-3">
                  {hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => setActiveHotspot(spot)}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.35em] transition ${
                        activeHotspot.id === spot.id ? 'border-white bg-white/10' : 'border-white/20 text-white/70'
                      }`}
                    >
                      {spot.label}
                    </button>
                  ))}
                </div>
                <motion.div
                  key={activeHotspot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm text-white/80"
                >
                  {activeHotspot.description}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureModal4;
