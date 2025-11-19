import React from "react";
import { motion } from "framer-motion";
import { Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CertificationBadgeProps {
  qualityScore?: number; // 1-5
  className?: string;
}

const CertificationBadge: React.FC<CertificationBadgeProps> = ({
  qualityScore = 5,
  className = "",
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className={`relative inline-block ${className}`}
          >
            <Badge className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg px-3 py-1.5 cursor-pointer">
              <Shield className="w-4 h-4 mr-1.5" />
              <span className="font-semibold">Certified</span>
            </Badge>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold">Quality Score</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < qualityScore
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This vehicle has passed our rigorous 160-point inspection covering
              engine, transmission, safety systems, and more.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Engine Check</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Brake Test</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Safety Suite</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Interior Check</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CertificationBadge;
