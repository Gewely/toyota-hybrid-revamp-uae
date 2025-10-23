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
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
          <div className="min-h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className={`relative w-full ${variantStyles[variant]} bg-background rounded-2xl shadow-2xl max-h-[90vh] flex flex-col`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`modal-title-${id}`}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border hover:bg-muted transition flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <h2 id={`modal-title-${id}`} className="text-2xl font-bold text-foreground pr-12">
                  {title}
                </h2>
                {description && (
                  <p className="text-muted-foreground mt-1">{description}</p>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
