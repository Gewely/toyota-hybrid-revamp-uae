
export interface Vehicle {
  id: string;
  model: string;
  image: string;
  description: string;
  price: number;
  engine: string;
  power: string;
  acceleration: string;
  topSpeed: string;
  fuelConsumption: string;
}

export interface VehicleModel {
  id?: string; // Add optional id property
  name: string;
  image: string;
  mmeUrl: string;
  configureUrl: string;
  price: number;
  priceFrom?: number | string; // For hero section price display
  modelYear?: number; // For displaying model year
  videoId?: string; // For YouTube video background
  category: string;
  features: string[];
  specifications?: {
    engine?: string;
    transmission?: string;
    fuelEconomy?: string;
    safetyRating?: string;
    warranty?: string;
  };
  // Add optional pre-owned properties
  year?: number;
  mileage?: string;
  location?: string;
  certification?: string;
  rating?: number;
  originalPrice?: number;
  warranty?: string;
  owners?: number;
  condition?: string;
}

export interface PreOwnedVehicle {
  id: string;
  model: string;
  make: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  image: string;
  certified: boolean;
  bodyType: string;
  color: string;
  transmission?: string;
  features?: string[];
}
