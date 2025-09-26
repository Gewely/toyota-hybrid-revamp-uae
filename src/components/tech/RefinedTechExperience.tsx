import { motion, useReducedMotion } from 'framer-motion';
import { colors, typography } from '../../utils/tokens';
import { createFadeInUp, fadeIn } from '../../utils/motion';

const techNarratives = [
  {
    id: 'immersive',
    title: 'Immersive Command',
    description:
      'A panoramic command centre engineered for attention with AR overlays, neural voice control, and haptic feedback tuned for dynamic driving.',
    media: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'seamless',
    title: 'Seamless Intelligence',
    description:
      'Your GR Hybrid anticipates every journey with predictive routing, intelligent charging schedules, and concierge-grade climate preconditioning.',
    media: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'sonic',
    title: 'Sonic Atmosphere',
    description:
      'Mark Levinson Atmos immerses the cabin in studio-grade audio while noise-cancelling glass preserves tranquil refinement.',
    media: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80',
  },
];

export const RefinedTechExperience: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-white py-24 text-[#0E0E11]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 sm:px-8">
        <motion.header
          variants={createFadeInUp(50)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col gap-4"
        >
          <p className="text-xs uppercase tracking-[0.4em]" style={{ color: colors.primary }}>
            Refined Technology
          </p>
          <h2
            className="text-3xl font-light sm:text-5xl"
            style={{ fontFamily: typography.display, letterSpacing: '-0.04em' }}
          >
            The Art of Intelligent Luxury
          </h2>
          <p className="max-w-3xl text-sm text-neutral-500 sm:text-base">
            Progressively reveal each story as you scroll through glassmorphic panels highlighting the technology narrative.
          </p>
        </motion.header>

        <div className="space-y-20">
          {techNarratives.map((narrative, index) => (
            <motion.article
              key={narrative.id}
              className={`flex flex-col gap-10 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={createFadeInUp(60, index * 0.12)}
            >
              <motion.div
                className="relative flex-1 overflow-hidden rounded-[32px] bg-neutral-900"
                variants={fadeIn(index * 0.15)}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              >
                <img src={narrative.media} alt={narrative.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
              </motion.div>
              <div className="flex flex-1 flex-col gap-5">
                <span className="text-xs uppercase tracking-[0.4em] text-neutral-400">0{index + 1}</span>
                <h3 className="text-3xl font-light" style={{ fontFamily: typography.display }}>
                  {narrative.title}
                </h3>
                <p className="text-base text-neutral-600">{narrative.description}</p>
                <div className="rounded-[28px] border border-neutral-200 bg-white/70 p-6 shadow-lg backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.35em]" style={{ color: colors.accent }}>
                    Signature Insight
                  </p>
                  <p className="mt-3 text-sm text-neutral-600">
                    Crafted using a monotone palette with subtle neon cues, the interface harmonises Toyota GR heritage with futurist minimalism.
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RefinedTechExperience;
