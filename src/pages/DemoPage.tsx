import { useCallback, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import PremiumMediaShowcase from '../components/hero/PremiumMediaShowcase';
import MobileStickyNav from '../components/nav/MobileStickyNav';
import DesktopActionPanel from '../components/nav/DesktopActionPanel';
import FeatureCards from '../components/cards/FeatureCards';
import ThreeDCardCarousel from '../components/carousel/ThreeDCardCarousel';
import CarBuilder from '../components/builder/CarBuilder';
import GradeCompare from '../components/compare/GradeCompare';
import RefinedTechExperience from '../components/tech/RefinedTechExperience';
import FeatureModal1 from '../components/modals/FeatureModal1';
import FeatureModal2 from '../components/modals/FeatureModal2';
import FeatureModal3 from '../components/modals/FeatureModal3';
import FeatureModal4 from '../components/modals/FeatureModal4';
import FeatureModal5 from '../components/modals/FeatureModal5';
import FeatureModal6 from '../components/modals/FeatureModal6';
import PrimaryCTAs from '../components/cta/PrimaryCTAs';

const sections = {
  highlights: 'section-highlights',
  carousel: 'section-carousel',
  builder: 'section-builder',
  compare: 'section-compare',
  tech: 'section-tech',
  cta: 'section-cta',
};

type FeatureModalId = 'feature1' | 'feature2' | 'feature3' | 'feature4' | 'feature5' | 'feature6';

export const DemoPage: React.FC = () => {
  const [activeFeatureModal, setActiveFeatureModal] = useState<FeatureModalId | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const behavior = prefersReducedMotion ? 'auto' : 'smooth';
        element.scrollIntoView({ behavior, block: 'start' });
      }
    },
    [prefersReducedMotion]
  );

  const handleNavSelect = useCallback(
    (action: string) => {
      switch (action) {
        case 'compare':
          scrollToSection(sections.compare);
          break;
        case 'build':
          scrollToSection(sections.builder);
          break;
        case 'drive':
          scrollToSection(sections.cta);
          break;
        case 'share':
          setActiveFeatureModal('feature6');
          break;
        default:
          break;
      }
    },
    [scrollToSection]
  );

  const handleHeroPrimary = useCallback(() => {
    scrollToSection(sections.builder);
  }, [scrollToSection]);

  const handleHeroSecondary = useCallback(() => {
    setActiveFeatureModal('feature2');
  }, []);

  const modalComponents = useMemo(
    () => ({
      feature1: FeatureModal1,
      feature2: FeatureModal2,
      feature3: FeatureModal3,
      feature4: FeatureModal4,
      feature5: FeatureModal5,
      feature6: FeatureModal6,
    }),
    []
  );

  const ActiveModalComponent = activeFeatureModal ? modalComponents[activeFeatureModal] : null;

  return (
    <div className="min-h-screen bg-[#07070A] text-white">
      <MobileStickyNav onSelect={handleNavSelect} />
      <DesktopActionPanel onAction={handleNavSelect} />

      <main className="flex flex-col gap-0">
        <PremiumMediaShowcase onPrimaryAction={handleHeroPrimary} onSecondaryAction={handleHeroSecondary} />

        <div id={sections.highlights}>
          <FeatureCards onOpenModal={(id) => setActiveFeatureModal(id as FeatureModalId)} />
        </div>

        <div id={sections.carousel}>
          <ThreeDCardCarousel />
        </div>

        <div id={sections.builder}>
          <CarBuilder />
        </div>

        <div id={sections.compare}>
          <GradeCompare />
        </div>

        <div id={sections.tech}>
          <RefinedTechExperience />
        </div>

        <div id={sections.cta}>
          <PrimaryCTAs />
        </div>
      </main>

      {ActiveModalComponent && (
        <ActiveModalComponent isOpen onClose={() => setActiveFeatureModal(null)} />
      )}
    </div>
  );
};

export default DemoPage;
