import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Heart, 
  Calendar, 
  Share2, 
  Phone,
  Settings,
  ChevronRight,
  X
} from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { usePassiveScroll } from '@/hooks/use-passive-scroll';
import { Z } from '@/lib/z-index';

interface DesktopActionPanelProps {
  onReserve?: () => void;
  onBuild?: () => void;
  onCompare?: () => void;
  onTestDrive?: () => void;
  onShare?: () => void;
  compareCount?: number;
  className?: string;
}

const DesktopActionPanel: React.FC<DesktopActionPanelProps> = ({
  onReserve = () => {},
  onBuild = () => {},
  onCompare = () => {},
  onTestDrive = () => {},
  onShare = () => {},
  compareCount = 0,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotionSafe();

  // Show after scrolling down - using passive scroll hook
  usePassiveScroll(() => {
    const scrolled = window.scrollY > 300;
    setIsVisible(scrolled);
  }, []);

  const actions = [
    {
      id: 'reserve',
      icon: Heart,
      label: 'Reserve Now',
      action: onReserve,
      primary: true,
      description: 'Secure your vehicle today'
    },
    {
      id: 'build',
      icon: Settings,
      label: 'Build & Price',
      action: onBuild,
      description: 'Customize your perfect vehicle'
    },
    {
      id: 'compare',
      icon: Car,
      label: 'Compare',
      action: onCompare,
      badge: compareCount > 0 ? compareCount : undefined,
      description: 'Compare with other models'
    },
    {
      id: 'test-drive',
      icon: Calendar,
      label: 'Test Drive',
      action: onTestDrive,
      description: 'Book a test drive appointment'
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      action: onShare,
      description: 'Share with friends'
    }
  ];

  return (
    <div className="hidden lg:block">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed right-8 top-1/2 transform -translate-y-1/2 ${className}`}
            style={{ zIndex: Z.floatingActions }}
          >
            {/* Glass panel */}
            <div className="bg-black/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl min-w-[280px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-white/60 hover:text-white hover:bg-white/10 p-1"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </Button>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  
                  return (
                    <motion.div
                      key={action.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={prefersReducedMotion ? {} : { 
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      <Button
                        onClick={action.action}
                        variant={action.primary ? "default" : "ghost"}
                        className={`
                          w-full justify-start text-left p-4 h-auto
                          ${action.primary 
                            ? 'bg-white text-black hover:bg-white/90' 
                            : 'text-white hover:bg-white/10'
                          }
                          transition-all duration-200 group
                        `}
                      >
                        <div className="flex items-center w-full">
                          <div className="relative">
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center mr-3
                              ${action.primary ? 'bg-black/10' : 'bg-white/10'}
                              group-hover:scale-110 transition-transform duration-200
                            `}>
                              <Icon className="h-5 w-5" />
                            </div>
                            
                            {/* Badge */}
                            {action.badge && (
                              <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                              >
                                {action.badge}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">
                              {action.label}
                            </div>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-xs opacity-70 mt-1"
                                >
                                  {action.description}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center text-white/60 text-xs">
                  <Phone className="h-3 w-3 mr-2" />
                  <span>Call: +971 800 TOYOTA</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopActionPanel;