import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpDown, Check, X, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Grade {
  name: string;
  description: string;
  price: number;
  monthlyFrom: number;
  badge: string;
  badgeColor: string;
  image: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
  };
}

interface ComparisonItem {
  label: string;
  getValue: (grade: Grade) => string;
}

interface PremiumComparisonSectionProps {
  title: string;
  items: ComparisonItem[];
  grades: Grade[];
  showOnlyDifferences: boolean;
  defaultOpen?: boolean;
}

const PremiumComparisonSection: React.FC<PremiumComparisonSectionProps> = ({
  title,
  items,
  grades,
  showOnlyDifferences,
  defaultOpen = false
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const hasDifferences = (getValue: (grade: Grade) => string, selectedGrades: Grade[]) => {
    const values = selectedGrades.map(getValue);
    return new Set(values).size > 1;
  };

  const filteredItems = showOnlyDifferences 
    ? items.filter(item => hasDifferences(item.getValue, grades))
    : items;

  if (showOnlyDifferences && filteredItems.length === 0) return null;

  const differenceCount = items.filter(item => hasDifferences(item.getValue, grades)).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="group flex items-center justify-between w-full py-6 px-6 hover:bg-accent/5 rounded-2xl transition-all border-2 border-transparent hover:border-primary/10 hover:shadow-lg">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            {showOnlyDifferences && differenceCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {differenceCount} key {differenceCount === 1 ? 'difference' : 'differences'}
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-primary" />
        </motion.div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 px-6 pb-6 pt-2"
        >
          {filteredItems.map(item => {
            const hasDiff = hasDifferences(item.getValue, grades);
            
            return (
              <motion.div 
                key={item.label} 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`flex items-center gap-3 font-semibold text-base ${hasDiff ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {hasDiff && <ArrowUpDown className="h-4 w-4 text-primary" />}
                  {item.label}
                </div>
                
                {isMobile ? (
                  <div className="space-y-3">
                    {grades.map((grade, idx) => (
                      <motion.div 
                        key={idx} 
                        className={`p-5 rounded-xl border-2 transition-all ${
                          hasDiff 
                            ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-md' 
                            : 'bg-card/50 border-border/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <span className="font-bold text-base text-foreground block mb-2">
                              {grade.name}
                            </span>
                            <span className="text-sm text-foreground/80">
                              {item.getValue(grade)}
                            </span>
                          </div>
                          {hasDiff && (
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={`grid gap-4 ${`grid-cols-${grades.length}`}`}>
                    {grades.map((grade, idx) => (
                      <motion.div 
                        key={idx} 
                        className={`p-5 rounded-xl border-2 text-center transition-all ${
                          hasDiff 
                            ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-md font-semibold' 
                            : 'bg-card/30 border-border/20 text-muted-foreground'
                        }`}
                        whileHover={{ scale: 1.03, y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-sm font-medium">
                          {item.getValue(grade)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PremiumComparisonSection;
