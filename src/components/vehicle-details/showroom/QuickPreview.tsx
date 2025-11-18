import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Eye, Zap } from 'lucide-react';

interface QuickPreviewProps {
  title: string;
  preview: React.ReactNode;
}

export const QuickPreview: React.FC<QuickPreviewProps> = ({ title, preview }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-10 flex flex-col justify-end p-6 rounded-2xl"
    >
      <div className="space-y-3">
        <Badge variant="secondary" className="gap-2 mb-2">
          <Eye className="w-3 h-3" />
          Quick Preview
        </Badge>
        
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        
        <div className="text-white/90 space-y-2">
          {preview}
        </div>

        <div className="flex items-center gap-2 text-white/70 text-sm mt-4">
          <Zap className="w-4 h-4" />
          <span>Click to explore in detail</span>
        </div>
      </div>
    </motion.div>
  );
};
