import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SpecCard } from './SpecCard';
import { Hotspot } from '@/data/interior-hotspots';
import { detailPanelVariants, detailPanelMobileVariants } from '@/utils/hotspot-animations';
import { useGradeAvailability } from '@/hooks/use-grade-availability';
import { useIsMobile } from '@/hooks/use-mobile';

interface DetailPanelProps {
  hotspot: Hotspot | null;
  currentGrade: string;
  onClose: () => void;
  onTestDrive?: () => void;
  onBuild?: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  hotspot,
  currentGrade,
  onClose,
  onTestDrive,
  onBuild
}) => {
  const isMobile = useIsMobile();
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);

  const { isAvailable, gradeStatus } = useGradeAvailability({
    currentGrade,
    requiredGrades: hotspot?.gradeAvailability || []
  });

  if (!hotspot) return null;

  const categoryColors: Record<string, string> = {
    comfort: '#ff6600',
    technology: '#00f0ff',
    safety: '#ff0044',
    design: '#00ff88'
  };

  const categoryColor = categoryColors[hotspot.category] || '#00f0ff';

  const variants = isMobile ? detailPanelMobileVariants : detailPanelVariants;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed ${isMobile ? 'bottom-0 left-0 right-0 max-h-[80vh]' : 'top-0 right-0 h-full w-full md:w-[500px]'} z-40 overflow-y-auto`}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.85))',
          backdropFilter: 'blur(20px)',
          borderLeft: isMobile ? 'none' : `2px solid ${categoryColor}40`,
          borderTop: isMobile ? `2px solid ${categoryColor}40` : 'none',
          boxShadow: isMobile 
            ? `0 -10px 60px ${categoryColor}20`
            : `0 0 60px ${categoryColor}20`
        }}
      >
        {/* Drag Handle (Mobile) */}
        {isMobile && (
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 rounded-full bg-white/30" />
          </div>
        )}

        {/* Header */}
        <div className="sticky top-0 z-10 p-6 pb-4 border-b"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: `${categoryColor}20`
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${categoryColor}30, ${categoryColor}10)`,
                  border: `1px solid ${categoryColor}60`,
                  boxShadow: `0 0 20px ${categoryColor}30`
                }}
              >
                <hotspot.icon className="w-5 h-5" style={{ color: categoryColor }} />
              </div>
              <div>
                <Badge 
                  variant="outline" 
                  className="mb-2 text-xs font-mono uppercase"
                  style={{ borderColor: categoryColor, color: categoryColor }}
                >
                  {hotspot.category}
                </Badge>
                <h3 className="text-xl font-bold text-foreground">{hotspot.title}</h3>
              </div>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Grade Availability Banner */}
          {!isAvailable && gradeStatus.upgradeToGrade && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg border"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 166, 0, 0.1), rgba(255, 166, 0, 0.05))',
                borderColor: 'rgba(255, 166, 0, 0.3)'
              }}
            >
              <div className="text-sm font-semibold text-orange-400">
                Upgrade to {gradeStatus.upgradeToGrade} to unlock this feature
              </div>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Media Carousel */}
          {hotspot.media.length > 0 && (
            <div className="relative aspect-video rounded-xl overflow-hidden border"
              style={{ borderColor: `${categoryColor}40` }}
            >
              <img
                src={hotspot.media[currentMediaIndex].url}
                alt={`${hotspot.title} view ${currentMediaIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {hotspot.media.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full"
                    onClick={() => setCurrentMediaIndex(Math.max(0, currentMediaIndex - 1))}
                    disabled={currentMediaIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full"
                    onClick={() => setCurrentMediaIndex(Math.min(hotspot.media.length - 1, currentMediaIndex + 1))}
                    disabled={currentMediaIndex === hotspot.media.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {hotspot.media.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentMediaIndex(idx)}
                        className="w-2 h-2 rounded-full transition"
                        style={{
                          background: idx === currentMediaIndex ? categoryColor : 'rgba(255, 255, 255, 0.3)'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">{hotspot.description}</p>
          </div>

          {/* Specs Grid */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 font-mono uppercase tracking-wider">
              Specifications
            </h4>
            <motion.div 
              className="grid grid-cols-2 gap-3"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {hotspot.specs.map((spec, idx) => (
                <SpecCard key={idx} spec={spec} glowColor={categoryColor} />
              ))}
            </motion.div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onBuild && (
              <Button 
                onClick={onBuild} 
                className="flex-1 relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}cc)`,
                  border: 'none'
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Customize This Feature
                  <ExternalLink className="w-4 h-4" />
                </span>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${categoryColor}dd, ${categoryColor}aa)`
                  }}
                />
              </Button>
            )}
            {onTestDrive && (
              <Button 
                onClick={onTestDrive} 
                variant="outline" 
                className="flex-1"
                style={{
                  borderColor: `${categoryColor}60`,
                  color: categoryColor
                }}
              >
                Experience in Person
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
