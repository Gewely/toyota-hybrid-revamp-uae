
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import LuxuryComparisonTool from "../comparison/LuxuryComparisonTool";
import { Persona } from "@/types/persona";

const useFlyInAnimation = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("animate-flyin-comparison");
    }
  }, []);

  return ref;
};

const useSlideInAnimation = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("animate-slidein-mobile");
    }
  }, []);

  return ref;
};

interface ComparisonTableProps {
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
  onClearAll?: () => void;
  personaData?: Persona | null;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  vehicles,
  onRemove,
  onClearAll,
  personaData,
}) => {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const isMobile = useIsMobile();
  const flyInRef = useFlyInAnimation();
  const slideInRef = useSlideInAnimation();

  const sections = [
    {
      title: "Pricing",
      items: [
        { label: "Vehicle Price", getValue: (v: VehicleModel) => `AED ${v.price.toLocaleString()}` },
        { label: "Cash Price", getValue: (v: VehicleModel) => `AED ${(v.price * 0.93).toLocaleString()}` },
      ]
    },
    {
      title: "Specifications",
      items: [
        { label: "Engine", getValue: (v: VehicleModel) => v.specifications?.engine || v.features[0] || "N/A" },
        {
          label: "Power",
          getValue: (v: VehicleModel) =>
            (v.specifications && "power" in v.specifications && v.specifications.power)
              ? (v.specifications as any).power
              : "308 hp"
        },
        {
          label: "Range",
          getValue: (v: VehicleModel) =>
            (v.specifications && "range" in v.specifications && v.specifications.range)
              ? (v.specifications as any).range
              : "482 km"
        },
        {
          label: "Acceleration",
          getValue: (v: VehicleModel) =>
            (v.specifications && "acceleration" in v.specifications && v.specifications.acceleration)
              ? (v.specifications as any).acceleration
              : "0-100 km/h in 4.5s"
        },
      ]
    },
    {
      title: "Features",
      items: [
        { label: "Seats", getValue: (v: VehicleModel) => v.features[1] || "Leather seats" },
        { label: "Safety", getValue: (v: VehicleModel) => v.features[2] || "Advanced safety features" },
        { label: "Technology", getValue: (v: VehicleModel) => v.features[3] || "Smart technology package" },
      ]
    }
  ];

  // Convert VehicleModel to Grade format for LuxuryComparisonTool
  const convertToGrades = (vehicles: VehicleModel[]) => {
    return vehicles.map(vehicle => ({
      id: vehicle.name.toLowerCase().replace(/\s+/g, '-'),
      name: vehicle.name,
      description: 'Premium Toyota vehicle',
      price: vehicle.price || 150000,
      monthlyFrom: Math.round((vehicle.price || 150000) / 60),
      badge: 'Premium',
      badgeColor: 'bg-primary',
      image: vehicle.image,
      features: vehicle.features || ['Premium Features', 'Advanced Safety', 'Luxury Interior'],
      specs: {
        engine: vehicle.specifications?.engine || 'V6 Engine',
        power: (vehicle.specifications as any)?.power || '300 HP',
        torque: '400 Nm',
        transmission: 'Automatic',
        acceleration: (vehicle.specifications as any)?.acceleration || '7.2s',
        fuelEconomy: '8.5L/100km'
      },
      highlights: vehicle.features?.slice(0, 3) || ['Premium', 'Advanced', 'Luxury']
    }));
  };

  // Only render if there are vehicles to compare
  if (vehicles.length === 0) {
    return null;
  }

  const grades = convertToGrades(vehicles);

  return (
    <LuxuryComparisonTool
      grades={grades}
      isOpen={vehicles.length > 0}
      onClose={() => onClearAll?.()}
      onTestDrive={(gradeId) => {
        console.log('Test drive for:', gradeId);
        // Navigate to test drive page
      }}
      onGetQuote={(gradeId) => {
        console.log('Get quote for:', gradeId);
        // Navigate to quote page
      }}
    />
  );
};

export default ComparisonTable;
