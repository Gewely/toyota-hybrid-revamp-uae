import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useModalDeepLink } from "@/hooks/use-modal-deep-link";
import { useIsMobile } from "@/hooks/use-mobile";

export type ModalVariant = 'plain' | 'gallery' | 'form' | 'specs' | 'cta' | 'wizard';

interface PremiumModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  title?: string;
  description?: string;
  imageSrc?: string;
  children: React.ReactNode;
  maxWidth?: string;
  footerActions?: React.ReactNode;
  showBackdropBlur?: boolean;
  enableDeepLink?: boolean;
  className?: string;
}

const variantStyles: Record<ModalVariant, string> = {
  plain: "max-w-2xl",
  gallery: "max-w-6xl",
  form: "max-w-2xl",
  specs: "max-w-4xl",
  cta: "max-w-5xl",
  wizard: "max-w-4xl",
};

export const PremiumModal: React.FC<PremiumModalProps> = ({
  id,
  isOpen,
  onClose,
  variant = 'plain',
  title,
  description,
  imageSrc,
  children,
  maxWidth,
  footerActions,
  showBackdropBlur = true,
  enableDeepLink = true,
  className,
}) => {
  const isMobile = useIsMobile();
  
  useBodyScrollLock(isOpen);
  useModalDeepLink({
    modalId: id,
    isOpen,
    onOpen: () => {},
    onClose,
    enabled: enableDeepLink,
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const modalMotion = {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    },
    desktop: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 },
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    mobile: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      transition: { type: 'spring', damping: 30, stiffness: 350 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            {...modalMotion.backdrop}
            className={cn(
              "fixed inset-0 z-50 bg-background/80",
              showBackdropBlur && "backdrop-blur-sm"
            )}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? `${id}-title` : undefined}
            aria-describedby={description ? `${id}-description` : undefined}
          >
            <motion.div
              {...(isMobile ? modalMotion.mobile : modalMotion.desktop)}
              className={cn(
                "relative w-full bg-background rounded-lg shadow-xl overflow-hidden",
                "border border-border/50",
                isMobile ? "h-[90vh] max-h-[90vh]" : variantStyles[variant],
                maxWidth,
                className
              )}
            >
              {/* Image Header (if provided) */}
              {imageSrc && (
                <div className={cn(
                  "relative w-full overflow-hidden",
                  variant === 'gallery' ? "h-64" : "h-48"
                )}>
                  <img
                    src={imageSrc}
                    alt={title || ''}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className={cn(
                  "absolute top-4 right-4 z-10",
                  "w-10 h-10 rounded-full",
                  "bg-background/80 backdrop-blur-sm",
                  "border border-border/50",
                  "flex items-center justify-center",
                  "text-foreground hover:bg-accent",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className={cn(
                "overflow-y-auto",
                isMobile ? "h-full pb-20" : "max-h-[80vh]"
              )}>
                {(title || description) && (
                  <div className="p-6 pb-4">
                    {title && (
                      <h2 id={`${id}-title`} className="text-2xl font-bold text-foreground mb-2">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p id={`${id}-description`} className="text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </div>
                )}

                <div className="px-6 pb-6">
                  {children}
                </div>
              </div>

              {/* Footer Actions */}
              {footerActions && (
                <div className={cn(
                  "border-t border-border/50 p-4 bg-muted/30",
                  isMobile && "fixed bottom-0 left-0 right-0"
                )}>
                  {footerActions}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
