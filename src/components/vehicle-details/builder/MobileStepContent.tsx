
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Car, Palette, Cog, CheckCircle, ArrowRight } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import ModelYearEngineStep from "./steps/ModelYearEngineStep";
import GradeCarouselStep from "./steps/GradeCarouselStep";
import ColorsAccessoriesStep from "./steps/ColorsAccessoriesStep";
import ReviewStep from "./steps/ReviewStep";
import { contextualHaptic } from "@/utils/haptic";
import { enhancedVariants, springConfigs } from "@/utils/animation-configs";
import { carBuilderTokens } from "@/styles/tokens.carbuilder";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileStepContentProps {
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  vehicle: VehicleModel;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goNext: () => void;
  deviceCategory: DeviceCategory;
  onReset?: () => void;
}

const MobileStepContent: React.FC<MobileStepContentProps> = ({
  step,
  config,
  setConfig,
  vehicle,
  calculateTotalPrice,
  handlePayment,
  goNext,
  deviceCategory,
  onReset
}) => {
  const { buttonSize, mobilePadding, touchTarget } = useResponsiveSize();

  const getButtonHeight = React.useCallback(() => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-11';
      case 'standardMobile': return 'h-12';
      case 'largeMobile': 
      case 'extraLargeMobile': return 'h-13';
      case 'tablet': return 'h-14';
      default: return 'h-12';
    }
  }, [deviceCategory]);

  const getStockBadgeText = React.useCallback(() => {
    switch (deviceCategory) {
      case 'smallMobile': return 'In Stock';
      case 'standardMobile': 
      case 'largeMobile': 
      case 'extraLargeMobile': return 'Available in Stock';
      default: return 'Available in Stock - Ready for Delivery';
    }
  }, [deviceCategory]);

  const canContinue = React.useMemo(() => {
    switch (step) {
      case 1: return config.modelYear && config.engine;
      case 2: return config.grade;
      case 3: return config.exteriorColor && config.interiorColor;
      case 4: return true;
      default: return false;
    }
  }, [step, config]);

  const handleContinueClick = React.useCallback(() => {
    contextualHaptic.stepProgress();
    goNext();
  }, [goNext]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ModelYearEngineStep config={config} setConfig={setConfig} />;
      case 2:
        return <GradeCarouselStep config={config} setConfig={setConfig} vehicle={vehicle} />;
      case 3:
        return <ColorsAccessoriesStep config={config} setConfig={setConfig} />;
      case 4:
        return (
          <ReviewStep 
            config={config} 
            vehicle={vehicle} 
            calculateTotalPrice={calculateTotalPrice}
            handlePayment={handlePayment}
            onReset={onReset}
          />
        );
      default:
        return null;
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return <Car className="h-5 w-5" />;
      case 2: return <Cog className="h-5 w-5" />;
      case 3: return <Palette className="h-5 w-5" />;
      case 4: return <CheckCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Engine & Year";
      case 2: return "Grade Selection";
      case 3: return "Colors & Style";
      case 4: return "Review & Order";
      default: return "";
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={carBuilderTokens.spring.luxurious}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Continue Button - Premium Style */}
      {step < 4 && (
        <motion.div 
          className="flex-shrink-0 bg-card/95 border-t border-border/60 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={carBuilderTokens.spring.luxurious}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            {/* Premium Continue Button */}
            <motion.button
              onClick={handleContinueClick}
              disabled={!canContinue}
              className={`
                w-full ${getButtonHeight()} min-h-[48px]
                bg-primary text-primary-foreground
                hover:bg-primary/90
                disabled:bg-muted disabled:text-muted-foreground
                font-semibold rounded-xl
                transition-all duration-200
                shadow-lg hover:shadow-xl disabled:shadow-md
                flex items-center justify-center gap-3
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${touchTarget}
              `}
              whileHover={canContinue ? { 
                y: -2, 
                scale: 1.01,
                transition: carBuilderTokens.spring.snappy 
              } : {}}
              whileTap={canContinue ? { 
                scale: 0.98,
                transition: carBuilderTokens.spring.snappy
              } : {}}
              aria-label={`Continue to ${getStepTitle()}`}
              role="button"
            >
              <span className="text-base font-semibold">
                Continue to {getStepTitle()}
              </span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>

            {/* Stock Badge - Subtle */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                {getStockBadgeText()}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MobileStepContent;
