import { RecommendedVehicle, VehicleData } from './types';
export const mockVehicleData: VehicleData[] = [
{model:'Yaris',category:'Sedan',startingPrice:63900,businessTags:['Sales team','Rental','Fuel efficient'],reason:'Efficient city mobility for business users and sales teams.'},
{model:'Corolla',category:'Sedan',startingPrice:74900,businessTags:['Sales team','Corporate','Reliable'],reason:'Balanced business sedan for corporate and fleet usage.'},
{model:'Camry',category:'Sedan',startingPrice:109900,businessTags:['Executive','Corporate','Comfort'],reason:'Comfort-focused sedan suitable for executives and business mobility.'},
{model:'Raize',category:'SUV',startingPrice:61900,businessTags:['SME','Delivery','City'],reason:'Compact SUV for city movement and small business operations.'},
{model:'Urban Cruiser',category:'SUV',startingPrice:79900,businessTags:['SME','Sales','Business owner'],reason:'Practical SUV for SMEs and business owners.'},
{model:'Hilux',category:'Commercial',startingPrice:114900,businessTags:['Construction','Field service','Heavy duty'],reason:'Durable commercial pickup for site, field, and operational use.'},
{model:'LiteAce',category:'Commercial',startingPrice:69900,businessTags:['Delivery','Cargo','SME'],reason:'Practical light commercial vehicle for cargo and delivery operations.'},
{model:'Hiace',category:'Commercial',startingPrice:119900,businessTags:['Staff transport','Fleet','Passenger'],reason:'Reliable people mover for staff transport and fleet requirements.'},
{model:'Coaster',category:'Commercial',startingPrice:219900,businessTags:['Staff transport','School','Large passenger'],reason:'Large passenger transport solution for companies and institutions.'},
{model:'Granvia',category:'Van',startingPrice:209900,businessTags:['Executive','Hospitality','Premium transport'],reason:'Premium passenger vehicle for executive and hospitality transport.'},
{model:'Land Cruiser',category:'SUV',startingPrice:238900,businessTags:['Executive','Government','Premium'],reason:'Premium SUV suitable for executive and high-value business usage.'},
{model:'Land Cruiser 70',category:'Commercial',startingPrice:169900,businessTags:['Construction','Off-road','Site operations'],reason:'Heavy-duty off-road vehicle for demanding operational environments.'},
{model:'Crown',category:'Sedan',startingPrice:199900,businessTags:['Executive','Premium','Corporate'],reason:'Premium executive mobility option for senior business users.'}
];
export const recommendationRules: Record<string,string[]> = {
'Sales team':['Yaris','Corolla','Camry'], 'Delivery / light cargo':['Raize','LiteAce','Hilux'], 'Construction / site operations':['Hilux','Land Cruiser 70'], 'Staff transport':['Hiace','Coaster','Granvia'], 'Executive mobility':['Camry','Crown','Land Cruiser'], 'Rental fleet':['Yaris','Corolla','Raize'], 'Field service':['Hilux','LiteAce'], 'Mixed fleet':['Yaris','Hilux','Hiace']
};
export function recommendVehicles(useCase: string, totalQuantity = 1): RecommendedVehicle[] { const models = recommendationRules[useCase] || recommendationRules['Mixed fleet']; const base = Math.max(1, Math.floor(totalQuantity / models.length)); let rem = Math.max(0,totalQuantity - base*models.length); return models.map((m)=>({...mockVehicleData.find(v=>v.model===m)!, quantity: base + (rem-- > 0 ? 1 : 0)})); }
