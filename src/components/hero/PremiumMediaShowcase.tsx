import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { heroMedia } from '../../data/vehicles';
import { colors, layout, shadows, typography } from '../../utils/tokens';
import { createFadeInUp } from '../../utils/motion';

const overlayGradient =
  'linear-gradient(180deg, rgba(8, 8, 12, 0.82) 0%, rgba(8, 8, 12, 0.78) 35%, rgba(8, 8, 12, 0.65) 55%, rgba(8, 8, 12, 0.4) 100%)';

type CTA = {
  label: string;
  action: () => void;
};

type PremiumMediaShowcaseProps = {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

const CTA_BUTTONS: CTA[] = [
  { label: 'Reserve Your Build', action: () => {} },
  { label: 'Download Specification', action: () => {} },
];

export const PremiumMediaShowcase: React.FC<PremiumMediaShowcaseProps> = ({
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const prefersReducedMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  const [ctaButtons] = useState(() =>
    CTA_BUTTONS.map((cta, index) => ({ ...cta, action: index === 0 ? onPrimaryAction ?? cta.action : onSecondaryAction ?? cta.action }))
  );

  const scale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 120]);

  useMotionValueEvent(scrollYProgress, 'change', () => {
    if (!isLoaded && heroMedia.type === 'video') {
      setIsLoaded(true);
    }
  });

  useEffect(() => {
    if (heroMedia.type === 'image') {
      const image = new Image();
      image.src = heroMedia.src;
      image.onload = () => setIsLoaded(true);
    }
  }, []);

  const renderBackground = useMemo(() => {
    if (heroMedia.type === 'video') {
      return (
        <motion.video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={heroMedia.poster}
          style={{ scale, y }}
        >
          <source src={heroMedia.src} type="video/mp4" />
        </motion.video>
      );
    }

    return (
      <motion.img
        src={heroMedia.src}
        alt={heroMedia.headline}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ scale, y }}
      />
    );
  }, [scale, y]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[90vh] w-full items-end justify-center overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0" aria-hidden="true" style={{ backgroundImage: overlayGradient }} />
      {renderBackground}

      <div
        className="relative z-10 mx-auto flex w-full flex-col px-4 pb-14 pt-32 sm:px-8 lg:px-12"
        style={{ maxWidth: layout.maxWidth }}
      >
        <motion.div
          className="flex max-w-4xl flex-col gap-6 text-left"
          variants={createFadeInUp(60)}
          initial="hidden"
          animate="visible"
        >
          <p className="text-sm uppercase tracking-[0.5em]" style={{ color: colors.accent }}>
            Electrified Performance Studio
          </p>
          <h1
            className="font-medium"
            style={{
              fontFamily: typography.display,
              fontSize: 'clamp(2.75rem, 5vw, 4.8rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            {heroMedia.headline}
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl" style={{ fontFamily: typography.body, color: colors.textSecondary }}>
            {heroMedia.subheadline}
          </p>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row">
            {ctaButtons.map((cta, index) => (
              <motion.button
                key={cta.label}
                onClick={cta.action}
                className="rounded-full border border-white/10 bg-white/10 px-8 py-3 text-sm uppercase tracking-[0.3em] text-white transition hover:border-[#CC0000] hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB0A1E]"
                style={{ boxShadow: index === 0 ? shadows.glow : shadows.glass }}
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              >
                {cta.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
        <div
          className="mt-16 grid w-full gap-6 text-xs uppercase tracking-[0.35em] sm:grid-cols-3"
          style={{ color: colors.textMuted }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p>0-100 km/h</p>
            <p className="mt-2 text-2xl text-white">3.8s*</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p>Electric Range</p>
            <p className="mt-2 text-2xl text-white">620 km</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p>Charging</p>
            <p className="mt-2 text-2xl text-white">80% in 18 min</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumMediaShowcase;
