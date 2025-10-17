
import React from "react";
import { motion } from "framer-motion";
import { useResponsiveSize } from "@/hooks/use-device-info";
import { carBuilderTokens } from "@/styles/tokens.carbuilder";
import { Check } from "lucide-react";

interface MobileProgressProps {
  currentStep: number;
  totalSteps?: number;
  stepLabels?: string[];
}

/**
 * Premium segmented progress bar for mobile Car Builder
 * Features step indicators with completion checkmarks
 */
const MobileProgress: React.FC<MobileProgressProps> = ({ 
  currentStep, 
  totalSteps = 3,
  stepLabels = ['Year & Engine', 'Grade & Style', 'Accessories']
}) => {
  const { containerPadding } = useResponsiveSize();
  
  return (
    <div className={`${containerPadding} py-3`}>
      {/* Segmented progress bar */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step indicator */}
              <motion.div
                className="relative flex-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, ...carBuilderTokens.spring.snappy }}
              >
                <div className="flex items-center gap-2">
                  {/* Circle indicator */}
                  <motion.div
                    className={`
                      relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${isCompleted ? 'bg-primary' : isCurrent ? 'bg-primary border-2 border-primary-foreground' : 'bg-muted border-2 border-border'}
                      transition-all duration-300
                    `}
                    animate={{
                      scale: isCurrent ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: isCurrent ? 1.5 : 0.3,
                      repeat: isCurrent ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                    ) : (
                      <span className={`text-xs font-bold ${isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                        {stepNumber}
                      </span>
                    )}
                  </motion.div>

                  {/* Progress bar between steps */}
                  {i < totalSteps - 1 && (
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>

                {/* Step label (optional, hidden on xs screens) */}
                {stepLabels[i] && (
                  <div className="mt-1 hidden xs:block">
                    <p className={`text-[10px] font-medium truncate ${isCurrent ? 'text-foreground' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                      {stepLabels[i]}
                    </p>
                  </div>
                )}
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default MobileProgress;
