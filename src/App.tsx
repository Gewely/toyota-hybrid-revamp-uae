
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PersonaProvider } from "@/contexts/PersonaContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ModalProvider } from "@/contexts/ModalProvider";
import Index from "./pages/Index";
import VehicleDetails from "./pages/VehicleDetails";
import TestDrive from "./pages/TestDrive";
import Enquire from "./pages/Enquire";
import PreOwned from "./pages/PreOwned";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <PersonaProvider>
        <ModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/vehicle/:vehicleName" element={<VehicleDetails />} />
                <Route path="/test-drive" element={<TestDrive />} />
                <Route path="/enquire" element={<Enquire />} />
                <Route path="/pre-owned" element={<PreOwned />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ModalProvider>
      </PersonaProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
