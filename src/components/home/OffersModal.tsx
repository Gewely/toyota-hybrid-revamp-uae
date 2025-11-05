
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Phone, Mail, MapPin, Calendar, Gift, Star } from "lucide-react";

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOffer?: any;
}

const OffersModal: React.FC<OffersModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedOffer 
}) => {
  const defaultOffer = {
    id: 1,
    title: "0% Interest Rate",
    subtitle: "On Selected Models",
    description: "Get 0% interest rate financing on selected Toyota models. Perfect opportunity to drive home your dream car with no additional interest charges.",
    discount: "0% APR",
    validUntil: "Dec 31, 2024",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-beccb-74f1e08d092e?binary=true&mformat=true",
    terms: [
      "Available on selected Toyota models",
      "Minimum down payment required",
      "Subject to credit approval",
      "Cannot be combined with other offers"
    ],
    benefits: [
      "No interest charges for the entire loan period",
      "Flexible payment terms up to 60 months",
      "Quick approval process",
      "Professional customer service"
    ]
  };

  const offer = selectedOffer || defaultOffer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Offer inquiry submitted");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Hero Image Section */}
              <div className="relative h-64 lg:h-80 overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all min-h-[44px] min-w-[44px]"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
                
                {/* Offer Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Gift className="h-4 w-4 mr-1" />
                    Limited Time Offer
                  </Badge>
                </div>
                
                {/* Offer Title */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-3xl lg:text-4xl font-black mb-2">{offer.title}</h1>
                    <p className="text-lg text-white/90 mb-2">{offer.subtitle}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-primary bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                        {offer.discount}
                      </span>
                      <span className="text-sm text-white/80">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Valid until {offer.validUntil}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content Section */}
              <div className="max-h-[40vh] overflow-y-auto p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Offer Details */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-4">Offer Details</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {offer.description}
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Star className="h-5 w-5 text-primary mr-2" />
                        Key Benefits
                      </h3>
                      <ul className="space-y-2">
                        {offer.benefits?.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-start text-sm text-muted-foreground">
                            <span className="text-primary mr-2 mt-0.5">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Terms & Conditions</h3>
                      <ul className="space-y-1">
                        {offer.terms?.map((term: string, index: number) => (
                          <li key={index} className="text-xs text-muted-foreground">
                            • {term}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Contact Form */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Get This Offer</h2>
                        <p className="text-muted-foreground mb-6 text-sm">
                          Fill out the form below and our sales team will contact you with more details about this exclusive offer.
                        </p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                              <Input id="firstName" required className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                              <Input id="lastName" required className="mt-1" />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input id="email" type="email" required className="mt-1" />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                            <Input id="phone" type="tel" required className="mt-1" />
                          </div>
                          
                          <div>
                            <Label htmlFor="model" className="text-sm font-medium">Interested Model (Optional)</Label>
                            <Input id="model" placeholder="e.g., Camry Hybrid" className="mt-1" />
                          </div>
                          
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 min-h-[44px]">
                            <Phone className="h-4 w-4 mr-2" />
                            Request Callback
                          </Button>
                        </form>
                        
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              +971 4 123 4567
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              offers@toyota.ae
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default OffersModal;
