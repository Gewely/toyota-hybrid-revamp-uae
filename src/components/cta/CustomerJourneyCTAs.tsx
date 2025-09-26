import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Calendar, 
  Wrench, 
  ArrowRightLeft, 
  CreditCard,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

interface CTAAction {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  primaryColor: string;
  benefits: string[];
  estimatedTime: string;
  buttonText: string;
  modalComponent: React.ComponentType<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }>;
}

// Modal Components
const ReserveModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({
  isOpen, onClose, onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    depositAmount: '1000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  useBodyScrollLock(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-brand-primary" />
            Reserve Your Vehicle
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Deposit Amount</label>
            <select
              value={formData.depositAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, depositAmount: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="500">$500 - Hold Vehicle</option>
              <option value="1000">$1,000 - Standard Deposit</option>
              <option value="2000">$2,000 - Priority Reservation</option>
            </select>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Your deposit is fully refundable and will be applied to your final purchase.
            </p>
          </div>
          
          <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90">
            Reserve with ${formData.depositAmount} Deposit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TestDriveModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({
  isOpen, onClose, onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    experience: 'standard'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  useBodyScrollLock(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-primary" />
            Book Test Drive
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Date</label>
              <Input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Time</label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Experience Type</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="standard"
                  checked={formData.experience === 'standard'}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="mr-2"
                />
                <span className="text-sm">Standard Test Drive (30 min)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="extended"
                  checked={formData.experience === 'extended'}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="mr-2"
                />
                <span className="text-sm">Extended Experience (2 hours)</span>
              </label>
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90">
            Schedule Test Drive
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ServiceModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({
  isOpen, onClose, onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleYear: '',
    vehicleModel: '',
    serviceType: '',
    description: '',
    preferredDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  useBodyScrollLock(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-brand-primary" />
            Schedule Service
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Vehicle Year</label>
              <select
                value={formData.vehicleYear}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select year</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Model</label>
              <Input
                value={formData.vehicleModel}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                placeholder="e.g., Camry"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Service Type</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select service</option>
              <option value="maintenance">Regular Maintenance</option>
              <option value="repair">Repair Service</option>
              <option value="inspection">Inspection</option>
              <option value="warranty">Warranty Service</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the service needed..."
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90">
            Schedule Service
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TradeInModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({
  isOpen, onClose, onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentYear: '',
    currentMake: '',
    currentModel: '',
    mileage: '',
    condition: '',
    newVehicleInterest: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  useBodyScrollLock(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-brand-primary" />
            Trade-In Evaluation
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Current Vehicle Information</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium mb-1 block">Year</label>
                <select
                  value={formData.currentYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentYear: e.target.value }))}
                  className="w-full p-2 border rounded-md text-sm"
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1 block">Make</label>
                <Input
                  value={formData.currentMake}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentMake: e.target.value }))}
                  placeholder="Make"
                  className="text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1 block">Model</label>
                <Input
                  value={formData.currentModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentModel: e.target.value }))}
                  placeholder="Model"
                  className="text-sm"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Mileage</label>
                <Input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                  placeholder="Miles"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Interested in New Vehicle?</label>
            <Input
              value={formData.newVehicleInterest}
              onChange={(e) => setFormData(prev => ({ ...prev, newVehicleInterest: e.target.value }))}
              placeholder="e.g., Camry Hybrid, RAV4..."
            />
          </div>
          
          <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90">
            Get Trade-In Value
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ctaActions: CTAAction[] = [
  {
    id: 'reserve',
    title: 'Reserve Online',
    subtitle: 'Secure Your Vehicle',
    description: 'Reserve your preferred vehicle with a refundable deposit. Priority delivery and exclusive benefits included.',
    icon: Car,
    primaryColor: 'bg-brand-primary',
    benefits: ['Priority Delivery', 'Refundable Deposit', 'Price Protection', 'VIP Treatment'],
    estimatedTime: '5 minutes',
    buttonText: 'Reserve Now',
    modalComponent: ReserveModal
  },
  {
    id: 'test-drive',
    title: 'Book Test Drive',
    subtitle: 'Experience Excellence',
    description: 'Schedule a personalized test drive at your convenience. Standard or extended experience available.',
    icon: Calendar,
    primaryColor: 'bg-blue-600',
    benefits: ['Flexible Scheduling', 'Extended Options', 'Expert Guidance', 'Multiple Locations'],
    estimatedTime: '3 minutes',
    buttonText: 'Schedule Drive',
    modalComponent: TestDriveModal
  },
  {
    id: 'service',
    title: 'Service Booking',
    subtitle: 'Expert Care',
    description: 'Keep your Toyota in perfect condition with our certified service technicians and genuine parts.',
    icon: Wrench,
    primaryColor: 'bg-green-600',
    benefits: ['Certified Technicians', 'Genuine Parts', 'Express Service', 'Warranty Protection'],
    estimatedTime: '4 minutes',
    buttonText: 'Book Service',
    modalComponent: ServiceModal
  },
  {
    id: 'trade-in',
    title: 'Trade-In Value',
    subtitle: 'Get Top Dollar',
    description: 'Get an instant estimate for your current vehicle and apply the value toward your new Toyota.',
    icon: ArrowRightLeft,
    primaryColor: 'bg-purple-600',
    benefits: ['Instant Estimate', 'Fair Market Value', 'Seamless Process', 'Tax Benefits'],
    estimatedTime: '2 minutes',
    buttonText: 'Get Value',
    modalComponent: TradeInModal
  }
];

interface CustomerJourneyCTAsProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const CustomerJourneyCTAs: React.FC<CustomerJourneyCTAsProps> = ({
  title = "Your Toyota Journey Starts Here",
  subtitle = "Choose your next step and let us guide you through a seamless experience",
  className = ""
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { toast } = useToast();
  const reduceMotion = useReducedMotionSafe();

  const handleSubmit = (actionId: string, data: any) => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Request Submitted Successfully",
        description: "We'll contact you shortly to confirm your request.",
      });
    }, 1000);
  };

  const openModal = (actionId: string) => {
    setActiveModal(actionId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <section className={cn("py-16 lg:py-24 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-light tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* CTA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ctaActions.map((action, index) => {
            const Icon = action.icon;
            const ModalComponent = action.modalComponent;
            
            return (
              <motion.div
                key={action.id}
                initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group border-2 hover:border-brand-primary/20">
                  <CardHeader className="text-center pb-4">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110",
                      action.primaryColor
                    )}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{action.title}</CardTitle>
                    <Badge variant="secondary" className="mb-3">
                      {action.subtitle}
                    </Badge>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Benefits */}
                    <div className="space-y-2">
                      {action.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Time estimate */}
                    <div className="flex items-center text-xs text-muted-foreground pt-2 border-t">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Takes {action.estimatedTime}</span>
                    </div>
                    
                    {/* CTA Button */}
                    <Button 
                      className={cn(
                        "w-full mt-4 text-white transition-all duration-300",
                        action.primaryColor,
                        "hover:shadow-lg hover:-translate-y-0.5"
                      )}
                      onClick={() => openModal(action.id)}
                    >
                      {action.buttonText}
                    </Button>
                  </CardContent>
                </Card>

                {/* Modal */}
                <ModalComponent
                  isOpen={activeModal === action.id}
                  onClose={closeModal}
                  onSubmit={(data) => handleSubmit(action.id, data)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 pt-8 border-t"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>Call: 1-800-GO-TOYOTA</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>Email: support@toyota.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Find Dealer Nearby</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerJourneyCTAs;