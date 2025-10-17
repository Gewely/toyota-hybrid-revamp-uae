
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, ChevronDown, Edit2, Share2 } from "lucide-react";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import { carBuilderTokens } from "@/styles/tokens.carbuilder";
import { cn } from "@/lib/utils";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileSummaryProps {
  config: BuilderConfig;
  totalPrice: number;
  step: number;
  reserveAmount: number;
  deviceCategory: DeviceCategory;
  showPaymentButton?: boolean;
}

const MobileSummary: React.FC<MobileSummaryProps> = ({
  config,
  totalPrice,
  step,
  reserveAmount,
  deviceCategory,
  showPaymentButton = true
}) => {
  const { containerPadding, buttonSize, textSize, touchTarget } = useResponsiveSize();
  const monthlyPayment = Math.round((totalPrice * 0.8 * 0.035) / 12);

  const getGridLayout = () => {
    // Use 2-column layout for very small screens to prevent truncation
    if (deviceCategory === 'smallMobile') {
      return 'grid-cols-2';
    }
    return 'grid-cols-3';
  };

  const getCardPadding = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'p-1';
      case 'standardMobile': return 'p-1.5';
      case 'largeMobile': return 'p-2';
      case 'extraLargeMobile': return 'p-2';
      default: return 'p-2.5';
    }
  };

  const getTextSizes = () => {
    switch (deviceCategory) {
      case 'smallMobile': return { 
        label: 'text-[10px] leading-tight', 
        value: 'text-xs font-bold leading-tight' 
      };
      case 'standardMobile': return { 
        label: 'text-xs leading-tight', 
        value: 'text-sm font-bold leading-tight' 
      };
      default: return { 
        label: 'text-xs leading-tight', 
        value: 'text-sm font-bold leading-tight' 
      };
    }
  };

  const getButtonHeight = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-8';
      case 'standardMobile': return 'h-9';
      case 'largeMobile': return 'h-10';
      default: return 'h-11';
    }
  };

  const textSizes = getTextSizes();
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div 
      className="sticky bottom-0 z-40 bg-card border-t border-border backdrop-blur-md bg-card/95 supports-[backdrop-filter]:bg-card/80"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={carBuilderTokens.spring.luxurious}
    >
      {/* Collapsible summary drawer */}
      <div className="px-4 py-3">
        {/* Compact header - always visible */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between mb-3"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="text-lg font-bold text-foreground">
                AED {totalPrice.toLocaleString()}
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Monthly</p>
              <p className="text-sm font-semibold text-primary">
                AED {monthlyPayment.toLocaleString()}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={carBuilderTokens.spring.snappy}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.button>

        {/* Expanded details */}
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0 
          }}
          transition={carBuilderTokens.spring.smooth}
          className="overflow-hidden"
        >
          <div className="space-y-3 pb-3">
            {/* Selected options recap */}
            <div className="grid grid-cols-2 gap-2">
              {config.grade && (
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Grade</p>
                  <p className="text-sm font-semibold">{config.grade}</p>
                </div>
              )}
              {config.exteriorColor && (
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Exterior</p>
                  <p className="text-sm font-semibold truncate">{config.exteriorColor}</p>
                </div>
              )}
              {config.interiorColor && (
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Interior</p>
                  <p className="text-sm font-semibold truncate">{config.interiorColor}</p>
                </div>
              )}
              {config.engine && (
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Engine</p>
                  <p className="text-sm font-semibold truncate">{config.engine}</p>
                </div>
              )}
            </div>

            {/* Accessories count */}
            {config.accessories.length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <p className="text-xs text-primary font-medium">
                  {config.accessories.length} {config.accessories.length === 1 ? 'Accessory' : 'Accessories'} Added
                </p>
              </div>
            )}

            {/* Quick actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl gap-2"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl gap-2"
              >
                <Share2 className="w-3 h-3" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Primary CTA */}
        {showPaymentButton && step === 4 && (
          <Button 
            className={cn(
              "w-full rounded-xl py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "flex items-center justify-center gap-2"
            )}
          >
            <CreditCard className="w-5 h-5" />
            Reserve Now - AED {reserveAmount.toLocaleString()}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default MobileSummary;
