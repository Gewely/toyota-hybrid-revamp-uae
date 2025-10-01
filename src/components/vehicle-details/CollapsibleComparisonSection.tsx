
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowUpDown } from "lucide-react";
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

interface CollapsibleComparisonSectionProps {
  title: string;
  items: ComparisonItem[];
  grades: Grade[];
  showOnlyDifferences: boolean;
  defaultOpen?: boolean;
}

const CollapsibleComparisonSection: React.FC<CollapsibleComparisonSectionProps> = ({
  title,
  items,
  grades,
  showOnlyDifferences,
  defaultOpen = false
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

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
      <CollapsibleTrigger className="flex items-center justify-between w-full py-5 px-4 hover:bg-[hsl(var(--neutral-100))] rounded-2xl transition-all group border border-transparent hover:border-[hsl(var(--toyota-platinum))]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[hsl(var(--toyota-graphite))]">{title}</h3>
          {showOnlyDifferences && differenceCount > 0 && (
            <Badge variant="secondary" className="text-xs bg-[hsl(var(--luxury-champagne))] text-[hsl(var(--toyota-graphite))] border-[hsl(var(--luxury-gold))]/30 font-semibold">
              {differenceCount} differences
            </Badge>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform duration-300 text-[hsl(var(--toyota-graphite))] ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 px-2 pb-4"
          >
            {filteredItems.map(item => {
              const hasDiff = hasDifferences(item.getValue, grades);
              
              return (
                <div key={item.label} className="space-y-3">
                  <div className={`font-bold flex items-center gap-2 text-sm ${hasDiff ? 'text-[hsl(var(--toyota-graphite))]' : 'text-[hsl(var(--toyota-stone))]'}`}>
                    {item.label}
                    {hasDiff && <ArrowUpDown className="h-3 w-3 text-[hsl(var(--luxury-gold))]" />}
                  </div>
                  
                  {isMobile ? (
                    <div className="space-y-2">
                      {grades.map((grade, idx) => (
                        <div key={idx} className={`text-sm p-4 rounded-xl border ${hasDiff ? 'bg-gradient-to-br from-[hsl(var(--luxury-champagne))]/30 to-white font-semibold border-[hsl(var(--luxury-gold))]/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'bg-white border-[hsl(var(--toyota-platinum))]/20 text-[hsl(var(--toyota-stone))]'}`}>
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-[hsl(var(--toyota-graphite))]">{grade.name}:</span>
                            <span className="text-right flex-1 ml-2">{item.getValue(grade)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`grid gap-4 py-2 ${`grid-cols-${grades.length}`}`}>
                      {grades.map((grade, idx) => (
                        <div key={idx} className={`text-sm ${hasDiff ? 'font-semibold bg-gradient-to-br from-[hsl(var(--luxury-champagne))]/30 to-white p-4 rounded-xl border border-[hsl(var(--luxury-gold))]/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[hsl(var(--toyota-graphite))]' : 'text-[hsl(var(--toyota-stone))] p-3'}`}>
                          {item.getValue(grade)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleComparisonSection;
