import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModalWrapperProps } from '../showroom/types';
import { useIsMobile } from '@/hooks/use-mobile';

const ModalWrapper: React.FC<ModalWrapperProps> = ({ 
  title, 
  onClose, 
  children, 
  fullScreen = false,
  maxWidth = 'max-w-6xl',
  background = 'bg-white'
}) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const mobileVariants = {
    hidden: { y: '100%' },
    visible: { 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { 
      y: '100%',
      transition: { duration: 0.2 }
    }
  };

  const desktopVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        variants={isMobile ? mobileVariants : desktopVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className={`
          ${background} rounded-3xl shadow-2xl relative
          ${isMobile ? 'w-full h-full rounded-none' : `w-[95%] ${maxWidth} max-h-[90vh]`}
          overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-border/50 p-6 flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900">{title}</h1>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-zinc-800" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {/* Footer CTAs */}
        <div className="sticky bottom-0 bg-white border-t border-border/50 p-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-[hsl(var(--toyota-red))] text-white hover:bg-[hsl(var(--toyota-red))]/90 px-8 py-6 text-lg"
          >
            Reserve Now
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-zinc-800 text-zinc-800 hover:bg-zinc-100 px-8 py-6 text-lg"
          >
            Book Test Drive
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalWrapper;
