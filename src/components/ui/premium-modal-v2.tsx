import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ModalVariant } from '@/config/modalRegistry';
import { Z } from '@/lib/z-index';

interface PremiumModalV2Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  title: string;
  description?: string;
  imageSrc?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ModalVariant, string> = {
  gallery: 'max-w-6xl',
  specs: 'max-w-5xl',
  wizard: 'max-w-5xl',
  form: 'max-w-2xl',
};

export const PremiumModalV2: React.FC<PremiumModalV2Props> = ({
  id,
  isOpen,
  onClose,
  variant = 'specs',
  title,
  description,
  imageSrc,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0" style={{ zIndex: Z.modal }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="absolute inset-0 overflow-y-auto p-0 md:p-4">
          <div className="min-h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1],
                scale: { duration: 0.35 }
              }}
              className={`relative w-full ${variantStyles[variant]} bg-background rounded-none md:rounded-3xl shadow-2xl max-h-screen md:max-h-[95vh] flex flex-col overflow-hidden border-0 md:border md:border-border/50`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`modal-title-${id}`}
            >
              {/* Hero Image Header (if provided) */}
              {imageSrc && (
                <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                  <motion.img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  
                  {/* Floating Header Content */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <h2 id={`modal-title-${id}`} className="text-3xl md:text-4xl font-bold text-foreground mb-2 drop-shadow-lg">
                        {title}
                      </h2>
                      {description && (
                        <p className="text-muted-foreground text-base md:text-lg drop-shadow-md">
                          {description}
                        </p>
                      )}
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-background/95 backdrop-blur-xl border-2 border-border/50 hover:bg-muted hover:border-primary/50 transition-all duration-200 flex items-center justify-center shadow-lg group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>

              {/* Header (when no hero image) */}
              {!imageSrc && (
                <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-border/50">
                  <h2 id={`modal-title-${id}`} className="text-2xl md:text-3xl font-bold text-foreground pr-14">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-muted-foreground mt-2 text-base">{description}</p>
                  )}
                </div>
              )}

              {/* Content with Custom Scrollbar */}
              <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-border/80">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: imageSrc ? 0.3 : 0.1, duration: 0.5 }}
                >
                  {children}
                </motion.div>
              </div>

              {/* Optional Footer Gradient */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
