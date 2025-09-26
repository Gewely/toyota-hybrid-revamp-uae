import { motion, useReducedMotion } from 'framer-motion';
import { vehicleHighlights } from '../../data/vehicles';
import { colors, typography } from '../../utils/tokens';
import { createFadeInUp, staggerContainer } from '../../utils/motion';

type FeatureCardsProps = {
  onOpenModal: (id: string) => void;
};

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onOpenModal }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-8">
      <div className="mb-12 flex flex-col gap-4 text-white">
        <p className="text-xs uppercase tracking-[0.4em]" style={{ color: colors.accent }}>
          Highlights
        </p>
        <h2
          className="font-light"
          style={{
            fontFamily: typography.display,
            fontSize: 'clamp(2.2rem, 3.8vw, 3.6rem)',
            letterSpacing: '-0.03em',
          }}
        >
          Crafted to Command Attention
        </h2>
        <p className="max-w-2xl text-base" style={{ color: colors.textSecondary }}>
          Every surface, stitch, and kilowatt has been orchestrated for touring indulgence and track-capable poise.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {vehicleHighlights.map((highlight) => (
          <motion.article
            key={highlight.id}
            variants={createFadeInUp(50)}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(18,18,22,0.95)] shadow-xl transition hover:border-[#EB0A1E]/40"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={highlight.image}
                alt={highlight.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />
            </div>
            <div className="flex h-full flex-col gap-4 p-6">
              <div>
                <h3 className="text-xl text-white">{highlight.title}</h3>
                <p className="mt-3 text-sm" style={{ color: colors.textSecondary }}>
                  {highlight.description}
                </p>
              </div>
              <button
                onClick={() => onOpenModal(highlight.modalId)}
                className="mt-auto inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[#EB0A1E] transition hover:text-[#CC0000]"
              >
                {highlight.ctaLabel}
                <motion.span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10"
                  whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                >
                  →
                </motion.span>
              </button>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default FeatureCards;
