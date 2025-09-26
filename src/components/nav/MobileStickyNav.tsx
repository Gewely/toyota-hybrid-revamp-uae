import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { colors, shadows } from '../../utils/tokens';

type NavItem = {
  id: string;
  label: string;
  icon: JSX.Element;
};

type MobileStickyNavProps = {
  onSelect: (id: string) => void;
};

const iconStyles = 'h-6 w-6';

const icons: Record<string, JSX.Element> = {
  compare: (
    <svg className={iconStyles} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h6m-6 4h6m-6 4h6m6 0h6m-6-4h6m-6-4h6" />
    </svg>
  ),
  build: (
    <svg className={iconStyles} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7l7.89 5.26a2 2 0 002.22 0L21 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  drive: (
    <svg className={iconStyles} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 16a4 4 0 118 0m6 0a4 4 0 11-8 0m8 0h1a1 1 0 001-1v-3a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-2.828-2.828A1 1 0 009.586 7H6a2 2 0 00-2 2v6a1 1 0 001 1h1"
      />
    </svg>
  ),
  share: (
    <svg className={iconStyles} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4m4-4v14"
      />
    </svg>
  ),
};

const NAV_ITEMS: NavItem[] = [
  { id: 'compare', label: 'Compare', icon: icons.compare },
  { id: 'build', label: 'Build', icon: icons.build },
  { id: 'drive', label: 'Test Drive', icon: icons.drive },
  { id: 'share', label: 'Share', icon: icons.share },
];

export const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ onSelect }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-xl -translate-x-1/2 rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.85)]/80 px-4 py-3 shadow-lg backdrop-blur"
          style={{ boxShadow: shadows.glass }}
        >
          <div
            className="grid grid-cols-4 gap-2 text-center text-[11px] font-medium uppercase tracking-[0.3em]"
            style={{ color: colors.textSecondary }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="group flex flex-col items-center gap-2 rounded-2xl px-3 py-2 text-white/80 transition hover:bg-white/5"
              >
                <motion.span whileHover={prefersReducedMotion ? undefined : { y: -3 }} className="rounded-full bg-white/5 p-2 text-white">
                  {item.icon}
                </motion.span>
                {item.label}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyNav;
