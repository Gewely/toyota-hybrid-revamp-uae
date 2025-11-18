import React from 'react';
import { motion } from 'framer-motion';
import { Drawer } from 'vaul';
import { Button } from '@/components/ui/button';
import { Eye, Play, Heart, ChevronUp } from 'lucide-react';

interface QuickActionDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onViewDetails: () => void;
  onStartTour: () => void;
  cardTitle: string;
}

export const QuickActionDrawer: React.FC<QuickActionDrawerProps> = ({
  isOpen,
  onOpenChange,
  onViewDetails,
  onStartTour,
  cardTitle
}) => {
  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors">
          <ChevronUp className="w-6 h-6" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-3xl h-[40vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
          <div className="p-4 bg-background rounded-t-3xl flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">{cardTitle}</h3>
                <p className="text-sm text-muted-foreground">Quick Actions</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={onViewDetails}
                  className="w-full justify-start gap-3"
                  size="lg"
                >
                  <Eye className="w-5 h-5" />
                  View Full Details
                </Button>

                <Button
                  onClick={onStartTour}
                  variant="outline"
                  className="w-full justify-start gap-3"
                  size="lg"
                >
                  <Play className="w-5 h-5" />
                  Start Guided Tour
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  size="lg"
                >
                  <Heart className="w-5 h-5" />
                  Save to Favorites
                </Button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
