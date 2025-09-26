import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { grades } from '../../data/grades';
import { specCategories } from '../../data/specs';
import { colors } from '../../utils/tokens';
import { createFadeInUp, staggerContainer } from '../../utils/motion';

export const GradeCompare: React.FC = () => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const differenceMap = useMemo(() => {
    if (!highlightDifferences) return new Set<string>();
    const diffs = new Set<string>();
    specCategories.forEach((category) => {
      category.rows.forEach((row) => {
        const values = grades.map((grade) => row[grade.id as keyof typeof row]);
        if (new Set(values).size > 1) {
          grades.forEach((grade) => diffs.add(`${row.label}-${grade.id}`));
        }
      });
    });
    return diffs;
  }, [highlightDifferences]);

  return (
    <section className="relative mx-auto w-full max-w-[1100px] px-4 py-24 sm:px-8">
      <motion.div
        className="flex flex-col gap-4 text-white"
        variants={createFadeInUp(40)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <p className="text-xs uppercase tracking-[0.4em]" style={{ color: colors.accent }}>
          Grade Comparison
        </p>
        <h2 className="text-3xl font-light sm:text-4xl">Select Your Signature</h2>
        <p className="max-w-3xl text-sm sm:text-base" style={{ color: colors.textSecondary }}>
          Compare the essence of each GR Hybrid grade. Toggle differences to spotlight exclusive enhancements per trim.
        </p>
        <label
          className="mt-4 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.4em]"
          style={{ color: colors.textSecondary }}
        >
          <input
            type="checkbox"
            checked={highlightDifferences}
            onChange={(event) => setHighlightDifferences(event.target.checked)}
            className="h-4 w-4"
          />
          Highlight Differences
        </label>
      </motion.div>

      <div className="mt-12 hidden grid-cols-4 gap-6 text-white lg:grid">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-4 gap-6"
        >
          {grades.map((grade, index) => (
            <motion.div
              key={grade.id}
              variants={createFadeInUp(30, index * 0.08)}
              className="rounded-[28px] border border-white/10 bg-[rgba(15,15,20,0.9)] p-6"
            >
              <div className="text-xs uppercase tracking-[0.4em]" style={{ color: colors.textMuted }}>
                Grade
              </div>
              <h3 className="mt-2 text-2xl font-light">{grade.name}</h3>
              <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
                {grade.price}
              </p>
              <ul
                className="mt-6 space-y-3 text-xs uppercase tracking-[0.35em]"
                style={{ color: colors.textSecondary }}
              >
                {grade.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-12 overflow-x-auto">
        <table className="min-w-[780px] w-full table-fixed border-separate border-spacing-0 text-left text-sm text-white">
          <thead>
            <tr className="text-xs uppercase tracking-[0.35em]" style={{ color: colors.textMuted }}>
              <th className="w-48 border-b border-white/10 bg-white/5 px-4 py-3">Specification</th>
              {grades.map((grade) => (
                <th key={grade.id} className="border-b border-white/10 bg-white/5 px-4 py-3">
                  {grade.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specCategories.map((category) => (
              <motion.tr key={category.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <td
                  colSpan={grades.length + 1}
                  className="px-4 pb-3 pt-8 text-xs uppercase tracking-[0.4em]"
                  style={{ color: colors.accent }}
                >
                  {category.title}
                </td>
              </motion.tr>
            ))}
            {specCategories.flatMap((category) =>
              category.rows.map((row) => (
                <tr key={`${category.id}-${row.label}`} className="border-b border-white/5 last:border-none">
                  <td
                    className="px-4 py-4 text-xs uppercase tracking-[0.35em]"
                    style={{ color: colors.textMuted }}
                  >
                    {row.label}
                  </td>
                  {grades.map((grade) => {
                    const cellKey = `${row.label}-${grade.id}`;
                    const value = row[grade.id as keyof typeof row];
                    const highlight = differenceMap.has(cellKey);
                    return (
                      <td
                        key={cellKey}
                        className={`px-4 py-4 text-sm transition ${highlight ? 'bg-[rgba(204,0,0,0.12)] text-[#CC0000]' : 'text-white'}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex flex-col gap-3 text-xs" style={{ color: colors.textSecondary }}>
        <span>*Data based on internal pre-production testing. Final homologation pending.</span>
        <span>Toggle differences to highlight exclusives for each grade.</span>
      </div>
    </section>
  );
};

export default GradeCompare;
