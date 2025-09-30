import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, Download, Share, Eye } from 'lucide-react';
import { useReducedMotionSafe, motionSafeVariants } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';

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

export default function Spiral3DGallery({ images, className }: Spiral3DGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const prefersReducedMotion = useReducedMotionSafe();

  // Throttled scroll handler with RAF
  const handleScroll = useCallback(() => {
    const now = performance.now();
    if (now - lastScrollTime.current < 16) return; // ~60fps throttling
    
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, -rect.top / (rect.height - window.innerHeight));
      setScrollY(scrollProgress);
      lastScrollTime.current = now;
    });
  }, []);

  // Performance-optimized scroll listener
  useEffect(() => {
    setIsLoaded(true);
    if (prefersReducedMotion) return;
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, prefersReducedMotion]);

  // Calculate 3D transform for each image based on scroll
  const getImageTransform = useCallback((index: number, totalImages: number) => {
    if (prefersReducedMotion) {
      return {
        transform: 'none',
        opacity: 1,
        zIndex: totalImages - index
      };
    }

    const normalizedIndex = index / (totalImages - 1);
    const spiralProgress = scrollY * 2; // Control spiral speed
    
    // Spiral calculations
    const radius = 300 + (normalizedIndex * 200);
    const angle = (normalizedIndex * Math.PI * 4) + (spiralProgress * Math.PI * 2);
    const verticalOffset = normalizedIndex * 100 - (spiralProgress * 800);
    
    // 3D positioning
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = verticalOffset;
    
    // Dynamic scaling and rotation
    const scale = Math.max(0.3, 1 - (Math.abs(z) / 800));
    const rotateY = (angle * 180 / Math.PI) + (spiralProgress * 90);
    const rotateX = Math.sin(spiralProgress * Math.PI + normalizedIndex * Math.PI) * 15;
    
    // Opacity based on distance
    const opacity = Math.max(0.2, scale);
    
    return {
      transform: `
        translate3d(${x}px, ${y}px, ${z}px) 
        rotateY(${rotateY}deg) 
        rotateX(${rotateX}deg) 
        scale(${scale})
      `,
      opacity,
      zIndex: Math.round(scale * 100)
    };
  }, [scrollY, prefersReducedMotion]);

  // Image interaction handlers
  const handleImageClick = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    if (currentIndex === -1) return;
    
    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    
    setSelectedImage(images[nextIndex]);
  }, [selectedImage, images]);

  if (!isLoaded) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", className)}>
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-muted rounded mb-4 mx-auto" />
          <div className="h-4 w-48 bg-muted/60 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      <section 
        ref={containerRef}
        className={cn(
          "relative min-h-[200vh] overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background",
          className
        )}
        style={{ 
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        {/* Header */}
        <motion.div 
          className="sticky top-24 z-10 text-center py-12"
          initial={motionSafeVariants.initial(prefersReducedMotion)}
          animate={motionSafeVariants.animate(prefersReducedMotion)}
          transition={motionSafeVariants.transition(prefersReducedMotion)}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Immersive Gallery
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Scroll to explore our vehicle in stunning 3D detail
          </p>
        </motion.div>

        {/* 3D Gallery Container */}
        <div 
          className="relative h-screen"
          style={{
            transformStyle: 'preserve-3d',
            transform: prefersReducedMotion ? 'none' : 'translateZ(0)'
          }}
        >
          {images.map((image, index) => {
            const transforms = getImageTransform(index, images.length);
            
            return (
              <motion.div
                key={image.id}
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                style={{
                  ...transforms,
                  transformStyle: 'preserve-3d'
                }}
                whileHover={prefersReducedMotion ? {} : { 
                  scale: 1.05,
                  rotateY: transforms.transform.includes('rotateY') ? undefined : '5deg'
                }}
                onClick={() => handleImageClick(image)}
              >
                <div className="relative w-80 h-60 md:w-96 md:h-72 rounded-2xl overflow-hidden shadow-2xl bg-card border border-border/50">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge variant="secondary" className="mb-2">
                        {image.category}
                      </Badge>
                      {image.title && (
                        <h3 className="text-white font-semibold text-lg">
                          {image.title}
                        </h3>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="secondary" className="opacity-90">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll Progress Indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(100, scrollY * 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground min-w-[3ch]">
                {Math.round(Math.min(100, scrollY * 100))}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={closeModal}>
            <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="relative w-full h-full flex flex-col"
              >
                {/* Header */}
                <DialogHeader className="flex-row items-center justify-between p-6 border-b border-border/50">
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      {selectedImage.title || 'Gallery Image'}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{selectedImage.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {images.findIndex(img => img.id === selectedImage.id) + 1} of {images.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={closeModal}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>

                {/* Image Container */}
                <div className="flex-1 relative overflow-hidden">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Navigation */}
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => navigateImage('prev')}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => navigateImage('next')}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}