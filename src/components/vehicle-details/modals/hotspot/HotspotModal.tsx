import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HotspotCanvas } from './HotspotCanvas';
import { DetailPanel } from './DetailPanel';
import { TourControls } from './TourControls';
import { Hotspot } from '@/data/interior-hotspots';
import { useHotspotTour } from '@/hooks/use-hotspot-tour';
import { prefersReducedMotion } from '@/utils/modal-performance';

interface HotspotModalProps {
  hotspots: Hotspot[];
  defaultBackgroundImage: string;
  currentGrade: string;
  onTestDrive?: () => void;
  onBuild?: () => void;
  modalType: 'interior' | 'exterior';
}

export const HotspotModal: React.FC<HotspotModalProps> = ({
  hotspots,
  defaultBackgroundImage,
  currentGrade,
  onTestDrive,
  onBuild,
  modalType
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(defaultBackgroundImage);
  const reducedMotion = prefersReducedMotion();

  // Memoize filtered hotspots to avoid recalculation
  const filteredHotspots = useMemo(() => 
    hotspots.filter(h => h.gradeAvailability.includes(currentGrade)),
    [hotspots, currentGrade]
  );

  const tour = useHotspotTour({ 
    hotspots: filteredHotspots,
    autoAdvance: false 
  });

  // Sync tour with active hotspot
  React.useEffect(() => {
    if (tour.currentHotspot) {
      setActiveHotspot(tour.currentHotspot);
      // Update background if hotspot has media
      if (tour.currentHotspot.media[0]) {
        setBackgroundImage(tour.currentHotspot.media[0].url);
      }
    }
  }, [tour.currentHotspot]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    setActiveHotspot(hotspot);
    tour.stopTour();
    // Update background image
    if (hotspot.media[0]) {
      setBackgroundImage(hotspot.media[0].url);
    }
  };

  const handleCloseDetail = () => {
    setActiveHotspot(null);
    setBackgroundImage(defaultBackgroundImage);
  };

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-2xl">
      {/* Hotspot Canvas */}
      <HotspotCanvas
        backgroundImage={backgroundImage}
        hotspots={hotspots}
        activeHotspotId={activeHotspot?.id || null}
        onHotspotClick={handleHotspotClick}
        currentGrade={currentGrade}
      />

      {/* Floating Header */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between">
        <div className="px-4 py-2 rounded-full backdrop-blur-xl border"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            borderColor: 'rgba(0, 240, 255, 0.3)'
          }}
        >
          <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
            {modalType === 'interior' ? 'Interior Showcase' : 'Exterior Design'}
          </span>
        </div>

        {!tour.isTourActive && (
          <Button
            onClick={tour.startTour}
            className="rounded-full gap-2"
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #ff00ff)',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)'
            }}
          >
            <Play className="w-4 h-4" />
            Start Tour
          </Button>
        )}
      </div>

      {/* Hotspot Counter */}
      <div className="absolute bottom-6 left-6 z-30 px-4 py-2 rounded-full backdrop-blur-xl border"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          borderColor: 'rgba(0, 240, 255, 0.3)'
        }}
      >
        <span className="text-sm font-mono text-cyan-400">
          {filteredHotspots.length} Features Available
        </span>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        hotspot={activeHotspot}
        currentGrade={currentGrade}
        onClose={handleCloseDetail}
        onTestDrive={onTestDrive}
        onBuild={onBuild}
      />

      {/* Tour Controls */}
      <AnimatePresence>
        {tour.isTourActive && (
          <TourControls
            isPlaying={tour.isPlaying}
            currentIndex={tour.currentIndex || 0}
            totalHotspots={tour.totalHotspots}
            progress={tour.progress}
            onPlayPause={tour.togglePlayPause}
            onNext={tour.nextHotspot}
            onPrevious={tour.previousHotspot}
            onStop={tour.stopTour}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
