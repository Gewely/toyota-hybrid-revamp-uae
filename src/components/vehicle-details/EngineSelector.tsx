import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface EngineOption {
  id: string;
  name: string;
  size: string;
  power: string;
  torque: string;
  badge?: string;
  description: string;
}

interface EngineSelectorProps {
  selectedEngine: string;
  onEngineSelect: (engineId: string) => void;
  className?: string;
}

const engineOptions: EngineOption[] = [
  {
    id: "3.5L",
    name: "3.5L V6 Engine",
    size: "3.5L",
    power: "295 HP",
    torque: "263 lb-ft",
    badge: "Most Popular",
    description: "Perfect balance of power and efficiency"
  },
  {
    id: "4.0L",
    name: "4.0L V6 Engine",
    size: "4.0L", 
    power: "270 HP",
    torque: "278 lb-ft",
    badge: "Performance",
    description: "Maximum torque for demanding conditions"
  }
];

const EngineSelector: React.FC<EngineSelectorProps> = ({
  selectedEngine,
  onEngineSelect,
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Car className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Choose Your Engine</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engineOptions.map((engine) => (
          <motion.div
            key={engine.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-lg",
                selectedEngine === engine.id 
                  ? "ring-2 ring-primary border-primary shadow-md" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onEngineSelect(engine.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">{engine.size}</span>
                  </div>
                  {engine.badge && (
                    <Badge 
                      variant={engine.badge === "Most Popular" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {engine.badge}
                    </Badge>
                  )}
                </div>

                <h4 className="font-medium text-foreground mb-2">{engine.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{engine.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground">Power</div>
                    <div className="font-semibold text-sm text-foreground">{engine.power}</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground">Torque</div>
                    <div className="font-semibold text-sm text-foreground">{engine.torque}</div>
                  </div>
                </div>

                <Button
                  variant={selectedEngine === engine.id ? "default" : "outline"}
                  className="w-full mt-3 text-sm"
                  size="sm"
                >
                  {selectedEngine === engine.id ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EngineSelector;