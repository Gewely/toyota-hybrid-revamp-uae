import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useVehicleData } from '@/hooks/use-vehicle-data';
import MobileCarousel from './showroom/MobileCarousel';
import DesktopGrid from './showroom/DesktopGrid';
import { ShowroomCard } from './showroom/types';
import InteriorModal from './modals/InteriorModal';
import ExteriorModal from './modals/ExteriorModal';
import PerformanceModal from './modals/PerformanceModal';
import SafetyModal from './modals/SafetyModal';
import TechnologyModal from './modals/TechnologyModal';

type ModalType = 'interior' | 'exterior' | 'performance' | 'safety' | 'technology' | null;

const SeamlessCinematicShowroom: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { galleryImages } = useVehicleData();

  const showroomCards: ShowroomCard[] = [
    {
      id: 'interior',
      title: 'Refined Interior',
      tagline: 'Crafted for luxury and functionality',
      image: galleryImages[0] || 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_01_800x447.jpg',
      layout: 'tall',
      gridSpan: { row: 'row-span-2' },
      contentPosition: 'top'
    },
    {
      id: 'exterior',
      title: 'Commanding Presence',
      tagline: 'Bold design meets rugged capability',
      image: galleryImages[1] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80',
      layout: 'square',
      gridSpan: {},
      contentPosition: 'overlay'
    },
    {
      id: 'performance',
      title: 'Unstoppable Power',
      tagline: 'Legendary performance and capability',
      image: galleryImages[2] || 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80',
      layout: 'wide',
      gridSpan: { col: 'col-span-2' },
      contentPosition: 'bottom'
    },
    {
      id: 'safety',
      title: 'Toyota Safety Sense',
      tagline: 'Advanced protection for every journey',
      image: galleryImages[0] || 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80',
      layout: 'tall',
      gridSpan: { row: 'row-span-2' },
      contentPosition: 'top'
    },
    {
      id: 'technology',
      title: 'Connected Experience',
      tagline: 'Intuitive infotainment and connectivity',
      image: galleryImages[1] || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80',
      layout: 'wide',
      gridSpan: { col: 'col-span-2' },
      contentPosition: 'bottom'
    }
  ];

  const handleCardClick = (id: string) => {
    setActiveModal(id as ModalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <section className="w-full bg-[hsl(var(--neutral-50))] min-h-screen">
      {/* Mobile Carousel */}
      <MobileCarousel 
        cards={showroomCards} 
        onCardClick={handleCardClick}
      />

      {/* Desktop Grid */}
      <DesktopGrid 
        cards={showroomCards}
        onCardClick={handleCardClick}
      />

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'interior' && (
          <InteriorModal onClose={handleCloseModal} />
        )}
        {activeModal === 'exterior' && (
          <ExteriorModal onClose={handleCloseModal} />
        )}
        {activeModal === 'performance' && (
          <PerformanceModal onClose={handleCloseModal} />
        )}
        {activeModal === 'safety' && (
          <SafetyModal onClose={handleCloseModal} />
        )}
        {activeModal === 'technology' && (
          <TechnologyModal onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default SeamlessCinematicShowroom;
