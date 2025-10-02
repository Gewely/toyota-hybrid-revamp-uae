import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Heart, 
  Calendar, 
  Share2, 
  ArrowRight,
  Zap,
  Settings
} from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface MobileStickyNavProps {
  onCompare?: () => void;
  onBuild?: () => void;
  onTestDrive?: () => void;
  onShare?: () => void;
  compareCount?: number;
  className?: string;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  onCompare = () => {},
  onBuild = () => {},
  onTestDrive = () => {},
  onShare = () => {},
  compareCount = 0,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotionSafe();

  // Hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleAction = (action: string, callback: () => void) => {
    setActiveAction(action);
    callback();
    
    // Reset active state after animation
    setTimeout(() => setActiveAction(null), 200);
  };

  const navItems = [
    {
      id: 'compare',
      icon: Car,
      label: 'Compare',
      action: () => handleAction('compare', onCompare),
      badge: compareCount > 0 ? compareCount : undefined,
      color: 'bg-blue-600'
    },
    {
      id: 'build',
      icon: Settings,
      label: 'Build',
      action: () => handleAction('build', onBuild),
      color: 'bg-green-600'
    },
    {
      id: 'test-drive',
      icon: Calendar,
      label: 'Test Drive',
      action: () => handleAction('test-drive', onTestDrive),
      color: 'bg-orange-600'
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      action: () => handleAction('share', onShare),
      color: 'bg-purple-600'
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 100 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed bottom-6 left-0 right-0 z-[100] lg:hidden px-4 ${className}`}
        >
          {/* Premium rounded pill container */}
          <div 
            className="max-w-md mx-auto rounded-full px-6 py-3.5 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: `
                0 20px 60px -15px rgba(0, 0, 0, 0.4),
                0 10px 30px -10px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.9),
                inset 0 -1px 2px rgba(0, 0, 0, 0.05)
              `,
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex items-center justify-around gap-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeAction === item.id;
                const isCenterButton = item.id === 'build';
                const isModels = item.id === 'compare';
                
                return (
                  <motion.div
                    key={item.id}
                    initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                    transition={prefersReducedMotion ? {} : { 
                      delay: index * 0.1,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className="relative"
                  >
                    {isCenterButton ? (
                      // Premium center button with 3D effect
                      <Button
                        onClick={item.action}
                        size="lg"
                        className="relative h-16 w-16 rounded-full p-0 transition-all duration-200 touch-manipulation group"
                        style={{
                          minHeight: '64px',
                          minWidth: '64px',
                          background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)',
                          boxShadow: `
                            0 8px 20px -6px rgba(220, 38, 38, 0.5),
                            0 4px 12px -4px rgba(153, 27, 27, 0.4),
                            inset 0 2px 4px rgba(255, 255, 255, 0.2),
                            inset 0 -2px 4px rgba(0, 0, 0, 0.2),
                            0 0 0 4px #ffffff,
                            0 0 0 5px rgba(0, 0, 0, 0.1)
                          `,
                          transform: isActive ? 'scale(0.95)' : 'scale(1)'
                        }}
                      >
                        <div 
                          className="absolute inset-0 rounded-full transition-opacity duration-200"
                          style={{
                            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)',
                          }}
                        />
                        <Icon className="h-7 w-7 text-white relative z-10" strokeWidth={2.5} />
                        
                        {/* Haptic feedback ripple */}
                        <AnimatePresence>
                          {isActive && !prefersReducedMotion && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-white/30"
                              initial={{ scale: 0, opacity: 0.6 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                          )}
                        </AnimatePresence>
                      </Button>
                    ) : (
                      // Regular buttons - minimal design
                      <Button
                        onClick={item.action}
                        variant="ghost"
                        size="sm"
                        className={`
                          flex-col h-auto p-2 gap-1.5
                          ${isModels ? 'text-red-600 hover:text-red-700' : 'text-gray-900 hover:text-gray-700'}
                          hover:bg-gray-100/50
                          transition-all duration-200 touch-manipulation
                          ${isActive ? 'scale-95' : ''}
                        `}
                        style={{
                          minHeight: '48px',
                          minWidth: '52px'
                        }}
                      >
                        <div className="relative">
                          <Icon className="h-6 w-6" strokeWidth={isModels ? 2.5 : 2} />
                          
                          {/* Badge for compare count */}
                          {item.badge && (
                            <Badge
                              className="absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] flex items-center justify-center border-none font-semibold"
                              style={{
                                background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)',
                                color: 'white',
                                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
                              }}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        
                        <span className="text-[13px] font-medium leading-none">
                          {item.label}
                        </span>
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyNav;