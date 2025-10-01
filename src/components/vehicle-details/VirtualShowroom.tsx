import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Maximize2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface VirtualShowroomProps {
  vehicleName: string;
}

export const VirtualShowroom: React.FC<VirtualShowroomProps> = ({ vehicleName }) => {
  const [isShowroomOpen, setIsShowroomOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleOpen = () => {
    setIsShowroomOpen(true);
  };

  const handleClose = () => {
    setIsShowroomOpen(false);
  };

  return (
    <>
      {/* Teaser Section - Exciting Design to Click */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          />
        </div>

        <div className="toyota-container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full"
            >
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">
                Virtual Experience
              </span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="font-serif text-4xl lg:text-6xl font-bold text-white tracking-tight">
                Step Inside the {vehicleName}
              </h2>
              <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Experience every detail in immersive 360° – explore the interior, examine features, and get closer than ever before.
              </p>
            </motion.div>

            {/* Interactive Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group cursor-pointer"
              onClick={handleOpen}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
                {/* Preview Image */}
                <img
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2940"
                  alt="Virtual Showroom Preview"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full group-hover:bg-primary/20 transition-all duration-300">
                      <Play className="h-12 w-12 text-white fill-white" />
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <div className="flex items-center gap-3 text-white/90">
                    <Maximize2 className="h-5 w-5" />
                    <span className="font-medium">360° Interactive View</span>
                  </div>
                  <p className="text-sm text-white/60">
                    Click to launch immersive showroom experience
                  </p>
                </div>
              </div>

              {/* Glow Effect on Hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleOpen}
                size={isMobile ? "lg" : "lg"}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-6 text-lg shadow-lg shadow-primary/20"
              >
                <Eye className="mr-2 h-5 w-5" />
                Launch Virtual Showroom
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Virtual Showroom Modal */}
      <AnimatePresence>
        {isShowroomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-300"
              aria-label="Close virtual showroom"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Virtual Showroom Content */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full h-full max-w-7xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Placeholder for 360 viewer or iframe */}
                <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-8 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <Eye className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">
                      360° Virtual Showroom
                    </h3>
                    <p className="text-white/60 max-w-md">
                      Experience the {vehicleName} in full 360° interactive view. 
                      Integration with your preferred 360 viewer goes here.
                    </p>
                  </div>
                  {/* This is where you'd integrate:
                      - CloudPano
                      - Matterport
                      - Custom 360 viewer
                      - Or iframe from external service
                  */}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
