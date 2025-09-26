
import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';
import { Persona } from '@/types/persona';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

interface QuickViewModalProps {
  vehicle: VehicleModel;
  onClose: () => void;
  personaData?: Persona | null;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ vehicle, onClose, personaData }) => {
  useBodyScrollLock(true);

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Create URL-friendly version of the vehicle name
  const vehicleSlug = vehicle.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={handleModalClick}
      >
        <div className="relative">
          <img 
            src={vehicle.image} 
            alt={vehicle.name} 
            className="w-full h-64 object-cover rounded-t-xl" 
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{vehicle.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.category}</p>
            </div>
            <div className="text-xl font-bold text-toyota-red">
              AED {vehicle.price.toLocaleString()}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Key Features</h3>
            <ul className="space-y-2">
              {vehicle.features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center justify-center bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2 flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
              <li className="flex items-start text-gray-700 dark:text-gray-300">
                <span className="inline-flex items-center justify-center bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2 flex-shrink-0 mt-0.5">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Fuel Efficiency: 17.5 km/L
              </li>
              <li className="flex items-start text-gray-700 dark:text-gray-300">
                <span className="inline-flex items-center justify-center bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2 flex-shrink-0 mt-0.5">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Warranty: 5 years / 100,000 km
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="bg-toyota-red hover:bg-toyota-darkred">
              <Link to={`/vehicle/${vehicleSlug}`} onClick={onClose}>
                View Full Details
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href={vehicle.configureUrl}>Configure Vehicle</a>
            </Button>
            <Button asChild variant="outline">
              <a href={vehicle.mmeUrl}>Book Test Drive</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
