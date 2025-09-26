import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { colors, shadows } from '../../utils/tokens';

const ACTIONS = [
  { id: 'reserve', label: 'Reserve' },
  { id: 'build', label: 'Build' },
  { id: 'compare', label: 'Compare' },
  { id: 'drive', label: 'Test Drive' },
  { id: 'share', label: 'Share' },
];

type DesktopActionPanelProps = {
  onAction: (id: string) => void;
};

export const DesktopActionPanel: React.FC<DesktopActionPanelProps> = ({ onAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.35;
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 80 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed right-6 top-1/2 hidden w-48 -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {ACTIONS.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={() => onAction(action.id)}
          className="pointer-events-auto rounded-[22px] border border-white/10 bg-[rgba(20,20,26,0.9)] px-6 py-3 text-left text-sm uppercase tracking-[0.35em] text-white/80 transition hover:border-white/20 hover:text-white"
          style={{ boxShadow: shadows.floating }}
          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        >
          <span style={{ color: colors.textSecondary }}>0{index + 1}</span>
          <div className="mt-2 text-white">{action.label}</div>
        </motion.button>
      ))}
    </motion.aside>
  );
};

export default DesktopActionPanel;
