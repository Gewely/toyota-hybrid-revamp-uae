import React from "react";
import { motion } from "framer-motion";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Sparkles, TrendingUp } from "lucide-react";
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
      <CollapsibleTrigger className="flex items-center justify-between w-full py-6 px-6 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent rounded-2xl transition-all duration-300 group border border-transparent hover:border-primary/10 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
            isOpen ? 'from-primary to-primary/70' : 'from-muted to-muted/70'
          } flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20`}>
            <Sparkles className={`w-6 h-6 ${isOpen ? 'text-primary-foreground' : 'text-foreground/70'}`} />
          </div>
          
          <div className="text-left">
            <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h3>
            {showOnlyDifferences && differenceCount > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {differenceCount} key {differenceCount === 1 ? 'difference' : 'differences'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors"
        >
          <ChevronDown className="h-5 w-5 text-foreground/70 group-hover:text-primary transition-colors" />
        </motion.div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 px-4 md:px-6 pb-6"
        >
          {filteredItems.map((item, idx) => {
            const hasDiff = hasDifferences(item.getValue, grades);
            
            return (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-1 h-8 rounded-full ${
                    hasDiff 
                      ? 'bg-gradient-to-b from-primary to-primary/50' 
                      : 'bg-muted'
                  }`} />
                  <div className={`font-semibold text-sm md:text-base ${
                    hasDiff ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {item.label}
                    {hasDiff && (
                      <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20 text-xs">
                        Varies
                      </Badge>
                    )}
                  </div>
                </div>
                
                {isMobile ? (
                  <div className="space-y-2 ml-4">
                    {grades.map((grade, idx) => (
                      <div 
                        key={idx} 
                        className={`text-sm p-4 rounded-xl border transition-all ${
                          hasDiff 
                            ? 'bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm hover:shadow-md hover:shadow-primary/10 hover:border-primary/30' 
                            : 'bg-muted/30 border-muted text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground">{grade.name}</span>
                          <span className={hasDiff ? 'font-medium' : ''}>{item.getValue(grade)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`grid gap-4 py-2 ml-4 ${`grid-cols-${grades.length}`}`}>
                    {grades.map((grade, idx) => (
                      <div 
                        key={idx} 
                        className={`text-sm p-4 rounded-xl border transition-all ${
                          hasDiff 
                            ? 'bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm hover:shadow-md hover:shadow-primary/10 hover:border-primary/30 font-medium' 
                            : 'bg-muted/30 border-muted/20 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {item.getValue(grade)}
                      </div>
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
