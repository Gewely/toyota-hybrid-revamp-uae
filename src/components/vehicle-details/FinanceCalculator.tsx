import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Car, Calendar, CreditCard, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { VehicleModel } from "@/types/vehicle";

interface FinanceCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleModel;
}

const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({ 
  isOpen, 
  onClose, 
  vehicle 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [vehiclePrice, setVehiclePrice] = useState<number>(vehicle.price);
  const [downPayment, setDownPayment] = useState<number>(vehicle.price * 0.2);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  
  // Balloon payment states
  const [balloonAmount, setBalloonAmount] = useState<number>(vehicle.price * 0.3);
  const [balloonMonthlyPayment, setBalloonMonthlyPayment] = useState<number>(0);
  
  // Lease states
  const [residualValue, setResidualValue] = useState<number>(vehicle.price * 0.4);
  const [leaseMonthlyPayment, setLeaseMonthlyPayment] = useState<number>(0);

  const tabs = [
    { id: 0, title: "Standard Loan", icon: <Calendar className="h-4 w-4" /> },
    { id: 1, title: "Balloon Payment", icon: <Target className="h-4 w-4" /> },
    { id: 2, title: "Lease", icon: <Car className="h-4 w-4" /> },
    { id: 3, title: "Islamic Finance", icon: <CreditCard className="h-4 w-4" /> }
  ];

  useEffect(() => {
    // Standard Loan Calculation
    const loanAmount = vehiclePrice - downPayment;
    
    if (loanAmount <= 0) {
      setMonthlyPayment(0);
      setTotalPayment(downPayment);
      setTotalInterest(0);
    } else {
      const monthlyRate = interestRate / 100 / 12;
      const payment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
        (Math.pow(1 + monthlyRate, loanTerm) - 1);
      
      const calculatedPayment = isNaN(payment) || !isFinite(payment) ? 0 : payment;
      
      setMonthlyPayment(calculatedPayment);
      setTotalPayment(calculatedPayment * loanTerm + downPayment);
      setTotalInterest(calculatedPayment * loanTerm - loanAmount);
    }

    // Balloon Payment Calculation
    const balloonLoanAmount = vehiclePrice - downPayment - balloonAmount;
    if (balloonLoanAmount > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const balloonPayment = balloonLoanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
        (Math.pow(1 + monthlyRate, loanTerm) - 1);
      
      setBalloonMonthlyPayment(isNaN(balloonPayment) || !isFinite(balloonPayment) ? 0 : balloonPayment);
    } else {
      setBalloonMonthlyPayment(0);
    }

    // Lease Calculation
    const depreciationAmount = vehiclePrice - residualValue;
    const monthlyDepreciation = depreciationAmount / loanTerm;
    const monthlyFinanceCharge = (vehiclePrice + residualValue) * (interestRate / 100 / 12);
    const leasePayment = monthlyDepreciation + monthlyFinanceCharge;
    
    setLeaseMonthlyPayment(isNaN(leasePayment) || !isFinite(leasePayment) ? 0 : leasePayment);
  }, [vehiclePrice, downPayment, interestRate, loanTerm, balloonAmount, residualValue]);

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentPercentage((value / vehiclePrice) * 100);
  };

  const handleDownPaymentPercentageChange = (value: number[]) => {
    const percentage = value[0];
    setDownPaymentPercentage(percentage);
    setDownPayment((percentage / 100) * vehiclePrice);
  };

  const handleLoanTermChange = (value: number[]) => {
    setLoanTerm(value[0]);
  };

  const handleInterestRateChange = (value: number[]) => {
    setInterestRate(value[0]);
  };

  const nextTab = () => {
    setActiveTab((prev) => (prev + 1) % tabs.length);
  };

  const prevTab = () => {
    setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calculator Inputs */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="vehiclePrice" className="flex justify-between mb-2">
                  <span>Vehicle Price</span>
                  <span>AED {vehiclePrice.toLocaleString()}</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="vehiclePrice"
                    type="number"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="downPayment" className="flex justify-between mb-2">
                  <span>Down Payment ({downPaymentPercentage.toFixed(0)}%)</span>
                  <span>AED {downPayment.toLocaleString()}</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                    className="pl-10 mb-3"
                  />
                </div>
                <Slider
                  value={[downPaymentPercentage]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={handleDownPaymentPercentageChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="interestRate" className="flex justify-between mb-2">
                  <span>Interest Rate</span>
                  <span>{interestRate.toFixed(2)}%</span>
                </Label>
                <Slider
                  id="interestRate"
                  value={[interestRate]}
                  min={1}
                  max={10}
                  step={0.1}
                  onValueChange={handleInterestRateChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1.00%</span>
                  <span>10.00%</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="loanTerm" className="flex justify-between mb-2">
                  <span>Loan Term</span>
                  <span>{loanTerm} months ({Math.floor(loanTerm / 12)} years)</span>
                </Label>
                <Slider
                  id="loanTerm"
                  value={[loanTerm]}
                  min={12}
                  max={84}
                  step={12}
                  onValueChange={handleLoanTermChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>7 years</span>
                </div>
              </div>
            </div>
            
            {/* Results */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                Estimated Payments
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Monthly Payment
                  </h4>
                  <div className="text-3xl font-bold text-toyota-red">
                    AED {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Loan Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      AED {(vehiclePrice - downPayment).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Down Payment:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      AED {downPayment.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Interest:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      AED {totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-gray-600 dark:text-gray-300">Total Cost:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      AED {totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    * This is only an estimate. Contact our finance team for a personalized offer.
                  </p>
                </div>
                
                <Button className="w-full bg-toyota-red hover:bg-toyota-darkred">
                  Apply for Financing
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  <Target className="h-5 w-5 inline mr-2" />
                  Balloon Payment Finance
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Lower monthly payments with a larger final payment at the end of the term.
                </p>
              </div>

              <div>
                <Label htmlFor="balloonAmount" className="flex justify-between mb-2">
                  <span>Balloon Amount (Final Payment)</span>
                  <span>AED {balloonAmount.toLocaleString()}</span>
                </Label>
                <Input
                  id="balloonAmount"
                  type="number"
                  value={balloonAmount}
                  onChange={(e) => setBalloonAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <Label className="mb-2 block">Down Payment: AED {downPayment.toLocaleString()}</Label>
                <Label className="mb-2 block">Interest Rate: {interestRate}%</Label>
                <Label className="mb-2 block">Term: {loanTerm} months</Label>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-6">Balloon Payment Estimate</h3>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm text-gray-500 mb-1">Monthly Payment</h4>
                  <div className="text-2xl font-bold text-toyota-red">
                    AED {balloonMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm text-gray-500 mb-1">Final Balloon Payment</h4>
                  <div className="text-2xl font-bold text-orange-600">
                    AED {balloonAmount.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Financed Amount:</span>
                    <span>AED {(vehiclePrice - downPayment - balloonAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Monthly Payments:</span>
                    <span>AED {(balloonMonthlyPayment * loanTerm).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <Button className="w-full bg-toyota-red hover:bg-toyota-darkred">
                  Apply for Balloon Finance
                </Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  <Car className="h-5 w-5 inline mr-2" />
                  Vehicle Lease
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Drive a new car with lower monthly payments. Perfect for business use.
                </p>
              </div>

              <div>
                <Label htmlFor="residualValue" className="flex justify-between mb-2">
                  <span>Residual Value (End of Lease)</span>
                  <span>AED {residualValue.toLocaleString()}</span>
                </Label>
                <Input
                  id="residualValue"
                  type="number"
                  value={residualValue}
                  onChange={(e) => setResidualValue(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Estimated value of the vehicle at the end of the lease term
                </p>
              </div>

              <div>
                <Label className="mb-2 block">Vehicle Price: AED {vehiclePrice.toLocaleString()}</Label>
                <Label className="mb-2 block">Interest Rate: {interestRate}%</Label>
                <Label className="mb-2 block">Lease Term: {loanTerm} months</Label>
                <Label className="mb-2 block">Mileage Limit: 20,000 km/year</Label>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-6">Lease Payment Estimate</h3>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm text-gray-500 mb-1">Monthly Lease Payment</h4>
                  <div className="text-2xl font-bold text-toyota-red">
                    AED {leaseMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Depreciation:</span>
                    <span>AED {(vehiclePrice - residualValue).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Lease Payments:</span>
                    <span>AED {(leaseMonthlyPayment * loanTerm).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Residual Value:</span>
                    <span>AED {residualValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-xs">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    At lease end, you can return the vehicle, purchase it for the residual value, or lease a new one.
                  </p>
                </div>

                <Button className="w-full bg-toyota-red hover:bg-toyota-darkred">
                  Apply for Lease
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-6 text-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Islamic Finance (Sharia-Compliant)
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Experience ethical financing that aligns with Islamic principles. Our Sharia-compliant 
                finance solutions offer transparent, interest-free options including Murabaha and Ijarah.
              </p>
              
              <div className="space-y-3 text-sm text-left mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No interest (Riba) charges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sharia-compliant profit sharing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Transparent fee structure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Flexible payment terms</span>
                </div>
              </div>
              
              <Button className="w-full bg-toyota-red hover:bg-toyota-darkred">
                Learn About Islamic Finance
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Finance Calculator - {vehicle.name}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Swipe Navigation */}
            <div className="relative mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevTab}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  disabled={activeTab === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {tabs[activeTab].icon}
                    <h3 className="text-lg font-semibold">{tabs[activeTab].title}</h3>
                  </div>
                  <div className="flex space-x-1">
                    {tabs.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 w-8 rounded-full ${
                          index === activeTab ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={nextTab}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  disabled={activeTab === tabs.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FinanceCalculator;
