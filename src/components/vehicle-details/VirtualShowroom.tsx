import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { 
  Monitor, 
  Smartphone, 
  Maximize2, 
  ExternalLink, 
  Eye, 
  X,
  Loader2, 
  AlertCircle 
} from "lucide-react";

interface VirtualShowroomProps {
  vehicle: VehicleModel;
}

const VirtualShowroom: React.FC<VirtualShowroomProps> = ({ vehicle }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const showroomUrl = "https://www.virtualshowroom.toyota.ae/configurator/land-cruiser/en";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Handle orientation changes
  useEffect(() => {
    const handleOrientation = () => {
      setOrientation(
        window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape'
      );
    };

    handleOrientation(); // Initial check
    window.addEventListener('orientationchange', handleOrientation);
    window.addEventListener('resize', handleOrientation);

    return () => {
      window.removeEventListener('orientationchange', handleOrientation);
      window.removeEventListener('resize', handleOrientation);
    };
  }, []);

  // Handle iframe loading states
  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load virtual showroom. Please try again.");
  };

  // Fullscreen handling with error boundary
  const requestTrueFullscreen = useCallback(async () => {
    const el = containerRef.current ?? document.documentElement;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      // Fallback to CSS fullscreen
    }
  }, []);

  // Debounced fullscreen toggle
  const handleToggleFullscreen = useCallback(async () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    if (next) {
      await requestTrueFullscreen();
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }, [isFullscreen, requestTrueFullscreen]);

  // Responsive iframe container styles
  const getIframeContainerStyle = () => ({
    height: orientation === 'portrait' ? '60vh' : '80vh',
    transition: 'height 0.3s ease',
  });

  return (
    <section className="py-8 lg:py-16 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        {/* Header Section - Same as before */}
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Card className="overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Controls header */}
              <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
                <div className="flex items-center space-x-4">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium hidden sm:inline">
                    Interactive Configurator
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFullscreen}
                    className="h-8 w-8 p-0"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(showroomUrl, "_blank", "noopener,noreferrer")}
                    className="h-8 w-8 p-0"
                    aria-label="Open in new window"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Iframe container with loading state */}
              <div
                ref={containerRef}
                style={getIframeContainerStyle()}
                className="relative w-full"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10">
                    <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsLoading(true);
                        setError(null);
                        if (iframeRef.current) {
                          iframeRef.current.src = showroomUrl;
                        }
                      }}
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  src={showroomUrl}
                  title={`${vehicle.name} Virtual Showroom`}
                  className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
                />
              </div>

              {/* Mobile helper tip */}
              <div className="lg:hidden p-3 bg-muted/30 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {orientation === 'portrait' 
                      ? 'Rotate device for fullscreen experience' 
                      : 'Tap & drag • Pinch to zoom'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature sections remain the same */}
        </motion.div>
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
            role="dialog"
            aria-modal="true"
            aria-label="Virtual Showroom Fullscreen"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFullscreen}
              className="absolute top-3 right-3 text-white/90 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exit Fullscreen</span>
            </Button>

            <iframe
              src={showroomUrl}
              title={`${vehicle.name} Virtual Showroom (Fullscreen)`}
              className="w-full h-full border-0"
              allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
              allowFullScreen
              loading="eager"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VirtualShowroom;
