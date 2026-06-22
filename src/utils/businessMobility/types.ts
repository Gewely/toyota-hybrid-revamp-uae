export type OwnershipPreference = 'Buy' | 'Finance' | 'Drive-on-Lease' | 'Not sure';
export type LeadScore = 'Hot' | 'Warm' | 'Cold';
export interface VehicleData { model: string; category: string; startingPrice: number; businessTags: string[]; reason: string; }
export interface RecommendedVehicle extends VehicleData { quantity: number; }
export interface BusinessBuilderState {
  businessType: string; companySize: string; vehicleCount: number; emirate: string; industry: string; purchaseTimeline: string; existingFleet: string;
  useCase: string; dailyMileage: string; passengerRequirement: string; cargoRequirement: string; offRoadRequirement: string; fuelEfficiencyPriority: string; needHybrid: string; needCommercialRegistration: string;
  vehicles: RecommendedVehicle[]; ownership: OwnershipPreference; leaseDuration: string; annualMileage: string; selectedAddOns: string[];
}
export interface LeadFormData { firstName: string; lastName: string; mobile: string; email: string; companyName: string; industry: string; preferredContactMethod: string; comments: string; tradeLicense: string; existingFleetSize: string; currentBrand: string; needTradeIn: string; website: string; trn: string; }
export interface CostEstimate { vehicleMonthlyCost: number; addOnsMonthlyCost: number; totalMonthlyCost: number; totalVehicleValue: number; includedItems: string[]; optionalAddOns: string[]; }
export interface CrmLeadPayload { leadType: string; leadSource: string; customerType: string; companyName: string; industry: string; businessType: string; companySize: string; emirate: string; fleetSizeRequired: number; useCase: string; preferredModels: string[]; quantityByModel: Record<string, number>; ownershipPreference: OwnershipPreference; leaseDuration: string; mileageBand: string; selectedAddOns: string[]; estimatedMonthlyCost: number; estimatedVehicleValue: number; purchaseTimeline: string; preferredContactMethod: string; customerFirstName: string; customerLastName: string; mobile: string; email: string; comments: string; leadScore: LeadScore; routingTeam: string; createdAt: string; }
