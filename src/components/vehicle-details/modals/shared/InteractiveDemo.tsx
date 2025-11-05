
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveDemoProps {
  title?: string;
  description?: string;
  demoSteps?: {
    id: string;
    title: string;
    description: string;
    image: string;
    duration?: number;
  }[];
  autoPlay?: boolean;
  type?: string; // Add the type prop
}

const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  title,
  description,
  demoSteps,
  autoPlay = false,
  type = "default" // Default value for type
}) => {
  // Generate default demo content based on type if no demoSteps provided
  const defaultDemoSteps = React.useMemo(() => {
    if (demoSteps && demoSteps.length > 0) return demoSteps;
    
    switch (type) {
      case "safety":
        return [
          {
            id: "1",
            title: "Pre-Collision System",
            description: "Advanced radar and camera technology detects potential collisions",
            image: "/placeholder.svg",
            duration: 3000
          },
          {
            id: "2", 
            title: "Lane Departure Alert",
            description: "Monitors lane markings and alerts when drifting without signaling",
            image: "/placeholder.svg",
            duration: 3000
          }
        ];
      case "connectivity":
        return [
          {
            id: "1",
            title: "Wireless CarPlay",
            description: "Connect your iPhone wirelessly for seamless integration",
            image: "/placeholder.svg",
            duration: 3000
          },
          {
            id: "2",
            title: "Wi-Fi Hotspot", 
            description: "Built-in 4G LTE provides internet for up to 5 devices",
            image: "/placeholder.svg",
            duration: 3000
          }
        ];
      case "hybrid":
        return [
          {
            id: "1",
            title: "Electric Motor",
            description: "Instant torque delivery for smooth acceleration",
            image: "/placeholder.svg",
            duration: 3000
          },
          {
            id: "2",
            title: "Regenerative Braking",
            description: "Captures energy during braking to recharge the battery",
            image: "/placeholder.svg",
            duration: 3000
          }
        ];
      case "interior":
        return [
          {
            id: "1",
            title: "Premium Seating",
            description: "8-way power adjustable seats with memory settings",
            image: "/placeholder.svg",
            duration: 3000
          },
          {
            id: "2",
            title: "Climate Control",
            description: "Dual-zone automatic climate control for personalized comfort",
            image: "/placeholder.svg",
            duration: 3000
          }
        ];
      default:
        return [
          {
            id: "1",
            title: "Interactive Demo",
            description: "Experience the features in action",
            image: "/placeholder.svg",
            duration: 3000
          }
        ];
    }
  }, [type, demoSteps]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  React.useEffect(() => {
    if (!isPlaying || !defaultDemoSteps.length) return;

    const currentStepData = defaultDemoSteps[currentStep];
    if (!currentStepData) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % defaultDemoSteps.length);
    }, currentStepData.duration || 3000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, defaultDemoSteps]);

  // Early return AFTER all hooks
  if (!defaultDemoSteps.length) {
    return <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
      <p className="text-muted-foreground">Demo content loading...</p>
    </div>;
  }

  const currentStepData = defaultDemoSteps[currentStep];
  
  // Safety check to prevent null/undefined animation values
  if (!currentStepData) {
    return (
      <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground">Loading demo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      <div className="relative bg-muted rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="aspect-video relative"
          >
            <img
              src={currentStepData.image}
              alt={currentStepData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h4 className="text-xl font-bold mb-2">
                {currentStepData.title}
              </h4>
              <p className="text-white/90">
                {currentStepData.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Play/Pause Control */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 h-12 w-12"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center gap-2">
        {defaultDemoSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveDemo;
