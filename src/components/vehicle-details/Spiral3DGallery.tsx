import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ZoomIn, Download, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { useOptimizedIntersection } from "@/hooks/use-optimized-intersection";
import { useReducedMotionSafe, motionSafeVariants } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title?: string;
}

interface Spiral3DGalleryProps {
  images: GalleryImage[];
  className?: string;
}

const Spiral3DGallery: React.FC<Spiral3DGalleryProps> = ({ images, className }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const prefersReducedMotion = useReducedMotionSafe();

  // Throttled scroll handler for performance
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        setScrollY(scrollProgress);
      }
    });
  }, []);

  // Passive scroll listener for better performance
  useEffect(() => {
    const throttledScroll = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(handleScroll);
      } else {
        handleScroll();
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Intersection observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const getImageTransform = (index: number, total: number) => {
    if (prefersReducedMotion) {
      return {
        transform: 'translateY(0) rotateY(0) scale(1)',
        opacity: 1
      };
    }

    const progress = scrollY;
    const angleStep = (Math.PI * 2) / total;
    const radius = 150;
    const baseAngle = index * angleStep;
    const spiralOffset = progress * Math.PI * 4;
    
    const angle = baseAngle + spiralOffset;
    const x = Math.cos(angle) * radius * (1 - progress * 0.3);
    const z = Math.sin(angle) * radius * (1 - progress * 0.5);
    const y = progress * index * 20;
    
    const rotateY = (angle * 180) / Math.PI;
    const scale = 1 - progress * 0.2 + Math.sin(progress * Math.PI) * 0.1;
    const opacity = 1 - progress * 0.3;

    return {
      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: Math.max(0.3, opacity)
    };
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    }
    
    setSelectedImage(images[newIndex]);
  };

  if (!isLoaded) {
    return (
      <div ref={containerRef} className={cn("min-h-[400px] flex items-center justify-center", className)}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section ref={containerRef} className={cn("relative py-20 overflow-hidden", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold mb-4"
              initial={motionSafeVariants.initial(prefersReducedMotion)}
              animate={motionSafeVariants.animate(prefersReducedMotion)}
              transition={motionSafeVariants.transition(prefersReducedMotion)}
            >
              3D Gallery Experience
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={motionSafeVariants.initial(prefersReducedMotion)}
              animate={motionSafeVariants.animate(prefersReducedMotion)}
              transition={motionSafeVariants.transition(prefersReducedMotion)}
            >
              Scroll to explore our vehicle in an immersive 3D gallery. Click any image to view in detail.
            </motion.p>
          </div>

          <div 
            className="relative h-[600px] lg:h-[800px] perspective-1000"
            style={{ 
              perspective: prefersReducedMotion ? 'none' : '1000px',
              transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d'
            }}
          >
            {images.map((image, index) => {
              const transform = getImageTransform(index, images.length);
              
              return (
                <motion.div
                  key={image.id}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  style={transform}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  onClick={() => handleImageClick(image)}
                >
                  <div className="relative group">
                    <div className="w-64 h-48 lg:w-80 lg:h-60 rounded-2xl overflow-hidden shadow-2xl border border-border">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        sizes="(max-width: 768px) 256px, 320px"
                        srcSet={`${image.src}?w=256 256w, ${image.src}?w=320 320w, ${image.src}?w=640 640w`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Badge variant="secondary" className="mb-2 bg-background/90 backdrop-blur-sm">
                          {image.category}
                        </Badge>
                        {image.title && (
                          <h3 className="text-white font-semibold text-sm lg:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {image.title}
                          </h3>
                        )}
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ZoomIn className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Scroll progress: {Math.round(scrollY * 100)}%
            </p>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeModal}>
        <DialogContent className="max-w-6xl w-full h-full max-h-[90vh] p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedImage && (
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative h-full flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{selectedImage.category}</Badge>
                    <h3 className="font-semibold text-lg">{selectedImage.title || selectedImage.alt}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={closeModal}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className="flex-1 relative bg-muted/20">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-full object-contain"
                    sizes="(max-width: 768px) 100vw, 90vw"
                    srcSet={`${selectedImage.src}?w=800 800w, ${selectedImage.src}?w=1200 1200w, ${selectedImage.src}?w=1600 1600w`}
                  />
                  
                  {/* Navigation Buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => navigateImage('prev')}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => navigateImage('next')}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Footer with image counter */}
                <div className="p-4 border-t bg-background/95 backdrop-blur-sm text-center">
                  <p className="text-sm text-muted-foreground">
                    {images.findIndex(img => img.id === selectedImage.id) + 1} of {images.length}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Spiral3DGallery;