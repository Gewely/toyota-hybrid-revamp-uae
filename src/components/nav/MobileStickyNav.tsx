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
          {/* Rounded pill container */}
          <div className="max-w-md mx-auto bg-gradient-to-b from-white to-gray-50 rounded-full shadow-2xl border border-gray-200/50 px-4 py-3">
            <div className="flex items-center justify-around gap-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeAction === item.id;
                const isCenterButton = item.id === 'build';
                
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
                      // Large center button
                      <Button
                        onClick={item.action}
                        size="lg"
                        className={`
                          relative h-16 w-16 rounded-full p-0
                          bg-gradient-to-b from-red-600 to-red-700
                          hover:from-red-700 hover:to-red-800
                          shadow-xl shadow-red-600/30
                          border-4 border-white
                          transition-all duration-200 touch-manipulation
                          ${isActive ? 'scale-95' : 'scale-100'}
                        `}
                        style={{
                          minHeight: '64px',
                          minWidth: '64px'
                        }}
                      >
                        <Icon className="h-7 w-7 text-white" />
                        
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
                      // Regular buttons
                      <Button
                        onClick={item.action}
                        variant="ghost"
                        size="sm"
                        className={`
                          flex-col h-auto p-2 gap-1
                          ${item.id === 'compare' ? 'text-red-600 hover:text-red-700' : 'text-gray-900 hover:text-gray-700'}
                          hover:bg-gray-100/50
                          transition-all duration-200 touch-manipulation
                          ${isActive ? 'scale-95' : ''}
                        `}
                        style={{
                          minHeight: '44px',
                          minWidth: '44px'
                        }}
                      >
                        <div className="relative">
                          <Icon className="h-5 w-5" />
                          
                          {/* Badge for compare count */}
                          {item.badge && (
                            <Badge
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-red-600 border-none"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        
                        <span className="text-[11px] font-medium leading-none">
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