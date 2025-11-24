
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ToyotaLayout from "@/components/ToyotaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { vehicles, preOwnedVehicles } from "@/data/vehicles";
import { Mail, Phone, ArrowLeft } from "lucide-react";

const Enquire = () => {
  const [searchParams] = useSearchParams();
  const modelParam = searchParams.get("model");
  const isPreowned = searchParams.get("preowned") === "true";
  const vehicleId = searchParams.get("id");
  
  const [selectedModel, setSelectedModel] = useState(modelParam || "");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const { toast } = useToast();

  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    message: "",
    subscribe: true
  });

  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, subscribe: checked }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus("success");
      toast({
        title: "Enquiry Submitted",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1500);
  };

  return (
    <ToyotaLayout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="toyota-container max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <a href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</a>
          </Button>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-2">Enquire Now</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedModel 
                ? `Get more information about the ${selectedModel}`
                : "Interested in a Toyota? Submit your enquiry below."
              }
            </p>
            
            {formStatus === "success" ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-green-600 dark:text-green-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Your enquiry has been submitted successfully. One of our representatives will contact you shortly.
                </p>
                <Button asChild>
                  <a href="/">Return to Home</a>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Vehicle Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="model">Vehicle Model</Label>
                    <Select 
                      value={selectedModel} 
                      onValueChange={(value) => setSelectedModel(value)}
                      required
                    >
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select a vehicle model" />
                      </SelectTrigger>
                      <SelectContent>
                        {!isPreowned ? (
                          vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.name} value={vehicle.name}>
                              {vehicle.name}
                            </SelectItem>
                          ))
                        ) : (
                          preOwnedVehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.model}>
                              {vehicle.model} ({vehicle.year})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Preferred Contact Method */}
                  <div className="space-y-2">
                    <Label>Preferred Contact Method</Label>
                    <Select 
                      value={formData.preferredContact} 
                      onValueChange={(value) => handleSelectChange("preferredContact", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Email</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="phone">
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4" />
                            <span>Phone</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={4} 
                      placeholder="Let us know any specific questions or requirements"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {/* Subscription Checkbox */}
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox 
                      id="subscribe" 
                      checked={formData.subscribe}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="subscribe" className="text-sm text-gray-600 dark:text-gray-400">
                      Keep me updated with the latest Toyota news, events, and offers
                    </Label>
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button type="submit" disabled={formStatus === "submitting"} className="w-full">
                  {formStatus === "submitting" ? "Submitting..." : "Submit Enquiry"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </ToyotaLayout>
  );
};

export default Enquire;
