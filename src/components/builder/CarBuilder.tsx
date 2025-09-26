import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { builderSteps } from '../../data/vehicles';
import { colors, shadows, typography } from '../../utils/tokens';
import { createFadeInUp, staggerContainer } from '../../utils/motion';

type BuilderSelections = Record<string, string>;

const initialSelections: BuilderSelections = {
  grade: builderSteps[0]?.options[0]?.id ?? '',
  color: builderSteps[1]?.options[0]?.id ?? '',
  wheels: builderSteps[2]?.options[0]?.id ?? '',
  interior: builderSteps[3]?.options[0]?.id ?? '',
};

const getOptionPreviewStyle = (preview: string) =>
  preview.startsWith('#')
    ? { backgroundColor: preview }
    : {
        backgroundImage: `url(${preview})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

export const CarBuilder: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState<BuilderSelections>(initialSelections);
  const prefersReducedMotion = useReducedMotion();

  const activeStepData = builderSteps[activeStep];

  const summary = useMemo(() => {
    return builderSteps
      .filter((step) => step.id !== 'summary')
      .map((step) => {
        const selectedOptionId = selections[step.id];
        const option = step.options.find((opt) => opt.id === selectedOptionId);
        return {
          step: step.title,
          selection: option?.label ?? 'Not selected',
          priceImpact: option?.priceImpact ?? '',
        };
      });
  }, [selections]);

  const handleSelect = (stepId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [stepId]: optionId }));
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-8">
      <div className="mb-16 flex flex-col gap-4 text-white">
        <p className="text-xs uppercase tracking-[0.4em]" style={{ color: colors.accent }}>
          Personalisation Studio
        </p>
        <h2 className="text-3xl font-light sm:text-4xl">Compose Your GR Hybrid</h2>
        <p className="max-w-3xl text-sm sm:text-base" style={{ color: colors.textSecondary }}>
          Experience a multi-sensory configurator crafted for clarity across any device. Effortlessly glide through grade, finish,
          wheel, and interior selections before receiving a curated summary.
        </p>
      </div>

      <div className="hidden gap-10 rounded-[32px] border border-white/10 bg-[rgba(14,14,18,0.9)] p-10 text-white shadow-2xl backdrop-blur-xl lg:grid lg:grid-cols-[260px_1fr_280px]">
        <nav className="flex flex-col gap-4 text-sm uppercase tracking-[0.3em]" style={{ color: colors.textMuted }}>
          {builderSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`rounded-2xl border px-5 py-4 text-left transition ${
                activeStep === index
                  ? 'border-[#EB0A1E] bg-white/5 text-white'
                  : 'border-white/5 bg-transparent text-white/70 hover:border-white/15'
              }`}
            >
              <span className="text-[11px] tracking-[0.4em]">0{index + 1}</span>
              <div className="mt-2 text-base" style={{ fontFamily: typography.display }}>
                {step.title}
              </div>
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStepData.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[24px] border border-white/10 bg-[rgba(18,18,24,0.85)] p-8"
            >
              <h3 className="text-2xl font-light">{activeStepData.title}</h3>
              {activeStepData.id === 'summary' ? (
                <div className="mt-6 space-y-4">
                  {summary.map((item) => (
                    <div key={item.step} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
                      <div>
                        <p className="text-sm" style={{ color: colors.textMuted }}>
                          {item.step}
                        </p>
                        <p className="text-lg text-white">{item.selection}</p>
                      </div>
                      <span
                        className="text-xs uppercase tracking-[0.35em]"
                        style={{ color: colors.textSecondary }}
                      >
                        {item.priceImpact}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer(0.12)}
                  initial="hidden"
                  animate="visible"
                  className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  {activeStepData.options.map((option) => {
                    const isActive = selections[activeStepData.id] === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        variants={createFadeInUp(30)}
                        onClick={() => handleSelect(activeStepData.id, option.id)}
                        className={`group flex flex-col overflow-hidden rounded-[24px] border border-white/10 text-left transition ${
                          isActive ? 'bg-white/5' : 'bg-transparent hover:border-white/20'
                        }`}
                        style={
                          isActive
                            ? { borderColor: colors.primary, boxShadow: shadows.glow }
                            : undefined
                        }
                      >
                        <div className="relative h-40 w-full overflow-hidden rounded-[24px]">
                          <div className="h-full w-full" style={getOptionPreviewStyle(option.preview)} />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
                        </div>
                        <div className="flex flex-col gap-2 p-4">
                          <span className="text-xs uppercase tracking-[0.35em]" style={{ color: colors.textMuted }}>
                            {option.priceImpact}
                          </span>
                          <span className="text-lg text-white">{option.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="flex flex-col gap-4 text-sm" style={{ color: colors.textSecondary }}>
          <div className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.8)] p-6" style={{ boxShadow: shadows.glass }}>
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>
              Live Preview
            </p>
            <div className="mt-4 h-40 w-full overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80"
                alt="Configurator preview"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 text-sm">Signature Carbon Matte with Neon Edge pack shown.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.8)] p-6">
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>
              Current Build
            </p>
            <ul className="mt-4 space-y-3 text-white">
              {summary.map((item) => (
                <li key={item.step} className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
                  <span>{item.selection}</span>
                  <span style={{ color: colors.textMuted }}>{item.priceImpact}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-4 text-white lg:hidden">
        {builderSteps.map((step, index) => (
          <details key={step.id} className="rounded-[24px] border border-white/10 bg-[rgba(18,18,24,0.85)]" open={index === 0}>
            <summary className="cursor-pointer list-none px-5 py-4 text-sm uppercase tracking-[0.35em]">
              {step.title}
            </summary>
            <div className="px-5 pb-6">
              {step.id === 'summary' ? (
                <div className="space-y-4">
                  {summary.map((item) => (
                    <div
                      key={item.step}
                      className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-[0.3em]"
                      style={{ color: colors.textMuted }}
                    >
                      <span className="text-white">{item.selection}</span>
                      <span>{item.priceImpact}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {step.options.map((option) => {
                    const isActive = selections[step.id] === option.id;
                    return (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(step.id, option.id)}
                          className={`flex flex-col overflow-hidden rounded-[24px] border text-left transition ${
                            isActive ? 'bg-white/10' : 'border-white/10'
                          }`}
                          style={isActive ? { borderColor: colors.primary } : undefined}
                        >
                        <div className="h-36 w-full" style={getOptionPreviewStyle(option.preview)} />
                        <div className="flex flex-col gap-1 p-4">
                          <span className="text-xs uppercase tracking-[0.35em]" style={{ color: colors.textMuted }}>
                            {option.priceImpact}
                          </span>
                          <span className="text-lg">{option.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default CarBuilder;
