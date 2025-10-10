import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight,
  Sparkles,
  Car,
  Settings,
  Image,
  Award,
  HelpCircle
} from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface SectionNavPanelProps {
  className?: string;
}

const sections = [
  { 
    id: 'hero', 
    label: 'Overview', 
    icon: Sparkles,
    description: 'Vehicle highlights'
  },
  { 
    id: 'seamless-showroom', 
    label: 'Gallery', 
    icon: Image,
    description: 'Immersive visuals'
  },
  { 
    id: 'configuration', 
    label: 'Grades', 
    icon: Award,
    description: 'Choose your trim'
  },
  { 
    id: 'virtual-showroom', 
    label: '3D Showroom', 
    icon: Car,
    description: '360° experience'
  },
  { 
    id: 'related', 
    label: 'Similar Models', 
    icon: Settings,
    description: 'Explore more'
  },
  { 
    id: 'faq', 
    label: 'FAQ', 
    icon: HelpCircle,
    description: 'Get answers'
  }
];

const SectionNavPanel: React.FC<SectionNavPanelProps> = ({ className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const prefersReducedMotion = useReducedMotionSafe();

  // Show after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (!element) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        },
        { threshold: 0.3 }
      );
      
      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="hidden lg:block">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-50 ${className}`}
          >
            {/* Premium glass panel */}
            <div className="bg-background/95 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-2xl min-w-[280px] max-w-[320px] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div>
                  <h3 className="font-bold text-lg">Quick Navigation</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Jump to section</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hover:bg-accent/10 p-2"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                </Button>
              </div>

              {/* Navigation items */}
              <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.div
                      key={section.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={prefersReducedMotion ? {} : { 
                        delay: index * 0.08,
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      <Button
                        onClick={() => scrollToSection(section.id)}
                        variant="ghost"
                        className={`
                          w-full justify-start text-left p-4 h-auto rounded-xl
                          transition-all duration-200 group
                          ${isActive 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'hover:bg-accent/10'
                          }
                        `}
                      >
                        <div className="flex items-center w-full gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                            ${isActive ? 'bg-primary-foreground/10' : 'bg-accent/10'}
                            group-hover:scale-110 transition-transform duration-200
                          `}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">
                              {section.label}
                            </div>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-xs opacity-80 mt-0.5"
                                >
                                  {section.description}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="w-2 h-2 rounded-full bg-primary-foreground"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer - scroll progress */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-1.5 flex-1 bg-accent/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(sections.findIndex(s => s.id === activeSection) + 1) / sections.length * 100}%` 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="shrink-0">
                    {sections.findIndex(s => s.id === activeSection) + 1}/{sections.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionNavPanel;
