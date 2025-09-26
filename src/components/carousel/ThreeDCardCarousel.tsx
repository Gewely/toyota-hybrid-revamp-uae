import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { carouselItems } from '../../data/vehicles';
import { colors } from '../../utils/tokens';
import { createFadeInUp } from '../../utils/motion';

export const ThreeDCardCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-[#0E0E12] py-24 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-8">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.4em]" style={{ color: colors.accent }}>
            Immersive Carousel
          </p>
          <h2 className="text-3xl font-light sm:text-4xl">Grand Touring Dimensions</h2>
          <p className="max-w-2xl text-sm sm:text-base" style={{ color: colors.textSecondary }}>
            Swipe through a cinematic gallery engineered with depth, perspective, and intelligent spec callouts.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-12"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {carouselItems.map((item, index) => (
              <motion.article
                key={item.id}
                variants={createFadeInUp(40, index * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                className="group relative h-[26rem] w-[85vw] max-w-[22rem] shrink-0 snap-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-transparent p-[1px]"
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] bg-[rgba(12,12,16,0.92)]">
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={item.media}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <h3 className="text-2xl font-light">{item.title}</h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {item.description}
                    </p>
                    <ul
                      className="mt-auto flex flex-col gap-2 text-xs uppercase tracking-[0.35em]"
                      style={{ color: colors.textMuted }}
                    >
                      {item.specs.map((spec) => (
                        <li key={spec} className="rounded-full border border-white/5 bg-white/5 px-4 py-2">
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-3">
            {carouselItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  if (!scrollContainerRef.current) return;
                  const child = scrollContainerRef.current.children[index] as HTMLElement | undefined;
                  child?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', inline: 'center' });
                }}
                className="h-2 w-6 rounded-full border border-white/20 bg-white/10 transition hover:bg-[#EB0A1E]"
                aria-label={`View slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCardCarousel;
