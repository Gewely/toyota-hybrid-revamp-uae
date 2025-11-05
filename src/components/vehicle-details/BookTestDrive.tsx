
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, MapPin, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";

interface BookTestDriveProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleModel;
}

const BookTestDrive: React.FC<BookTestDriveProps> = ({ isOpen, onClose, vehicle }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  // Available time slots
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  // Available dealership locations
  const locations = [
    "Toyota Dubai - Sheikh Zayed Road",
    "Toyota Abu Dhabi - Airport Road",
    "Toyota Sharjah - Al Wahda Street",
    "Toyota Ajman - Sheikh Rashid Bin Saeed Al Maktoum St"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      
      toast({
        title: "Test Drive Booked",
        description: `Your test drive for ${vehicle.name} has been scheduled.`,
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setStep(1);
        setDate(undefined);
        setTimeSlot(undefined);
        setLocation(undefined);
        setIsComplete(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  const handleNext = () => {
    if (step === 1 && !date) {
      toast({
        title: "Please select a date",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && !timeSlot) {
      toast({
        title: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }
    
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Book a Test Drive
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {!isComplete ? (
              <div>
                {/* Progress Indicator */}
                <div className="flex justify-between mb-8">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          s < step ? "bg-green-500 text-white" : 
                          s === step ? "bg-toyota-red text-white" : 
                          "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {s < step ? <Check className="h-5 w-5" /> : s}
                      </div>
                      <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                        {s === 1 ? "Date" : s === 2 ? "Time" : "Details"}
                      </span>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Select Date */}
                  {step === 1 && (
                    <div>
                      <h3 className="font-medium mb-4 text-gray-900 dark:text-white">
                        Select a date for your test drive
                      </h3>
                      <div className="flex justify-center mb-4">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => {
                            // Disable dates in the past and Sundays
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || date.getDay() === 0;
                          }}
                          className="rounded-md border"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                        * Sundays are not available for test drives
                      </p>
                    </div>
                  )}
                  
                  {/* Step 2: Select Time */}
                  {step === 2 && (
                    <div>
                      <h3 className="font-medium mb-4 text-gray-900 dark:text-white">
                        Select a time slot
                      </h3>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Selected date: <span className="font-medium">{date && format(date, "EEEE, MMMM d, yyyy")}</span>
                        </p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={timeSlot === time ? "default" : "outline"}
                              className={`
                                flex items-center justify-center h-12
                                ${timeSlot === time ? "bg-toyota-red hover:bg-toyota-darkred" : ""}
                              `}
                              onClick={() => setTimeSlot(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Personal Details */}
                  {step === 3 && (
                    <div>
                      <h3 className="font-medium mb-4 text-gray-900 dark:text-white">
                        Complete your booking
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" required />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" required />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" required />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" required />
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Preferred Location</Label>
                          <Select
                            value={location}
                            onValueChange={setLocation}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a dealership" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((loc) => (
                                <SelectItem key={loc} value={loc}>
                                  {loc}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">
                            Booking Summary
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex">
                              <span className="w-24 text-gray-600 dark:text-gray-400">Vehicle:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{vehicle.name}</span>
                            </li>
                            <li className="flex">
                              <span className="w-24 text-gray-600 dark:text-gray-400">Date:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{date && format(date, "MMMM d, yyyy")}</span>
                            </li>
                            <li className="flex">
                              <span className="w-24 text-gray-600 dark:text-gray-400">Time:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{timeSlot}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={handlePrevious}>
                        Back
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                    )}
                    
                    {step < 3 ? (
                      <Button type="button" onClick={handleNext}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting || !location}>
                        {isSubmitting ? "Booking..." : "Confirm Booking"}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your test drive has been scheduled for {date && format(date, "MMMM d, yyyy")} at {timeSlot}. 
                  You'll receive a confirmation email shortly.
                </p>
                <Button onClick={onClose}>
                  Done
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BookTestDrive;
