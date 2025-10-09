import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import MobileStickyNav from "./MobileStickyNav";
import LanguageSwitcher from "./LanguageSwitcher";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { useLanguage } from "@/contexts/LanguageContext";
import { VehicleModel } from "@/types/vehicle";
import { cn } from "@/lib/utils";

interface ToyotaLayoutProps {
  children: React.ReactNode;
  activeNavItem?: string;
  // Vehicle action props (optional, for vehicle detail pages)
  vehicle?: VehicleModel;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
}

const ToyotaLayout: React.FC<ToyotaLayoutProps> = ({ 
  children, 
  activeNavItem,
  vehicle,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator
}) => {
  const { isMobile, isInitialized, deviceCategory, screenSize, deviceModel } = useDeviceInfo();
  const { isRTL } = useLanguage();

  useEffect(() => {
    // Enhanced mobile layout debugging with device model info
    console.log('📱 ToyotaLayout Enhanced Mobile Debug:', {
      isMobile,
      isInitialized,
      deviceCategory,
      deviceModel,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screenSize,
      shouldShowMobileNav: isMobile || window.innerWidth <= 500,
      userAgent: navigator.userAgent.substring(0, 50)
    });

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Add PWA install prompt handling
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install banner after 30 seconds
      setTimeout(() => {
        if (deferredPrompt) {
          const installBanner = document.createElement('div');
          installBanner.innerHTML = `
            <div style="position: fixed; bottom: 80px; ${isRTL ? 'right' : 'left'}: 16px; ${isRTL ? 'left' : 'right'}: 16px; background: #eb0a1e; color: white; padding: 16px; border-radius: 12px; z-index: 1000; display: flex; justify-content: space-between; align-items: center; direction: ${isRTL ? 'rtl' : 'ltr'};">
              <div>
                <div style="font-weight: bold;">Install Toyota UAE App</div>
                <div style="font-size: 14px; opacity: 0.9;">Get the full experience</div>
              </div>
              <button id="install-btn" style="background: white; color: #eb0a1e; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold;">Install</button>
              <button id="dismiss-btn" style="background: transparent; color: white; border: none; padding: 8px; margin-${isRTL ? 'right' : 'left'}: 8px;">×</button>
            </div>
          `;
          document.body.appendChild(installBanner);
          
          document.getElementById('install-btn')?.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
              deferredPrompt = null;
              document.body.removeChild(installBanner);
            });
          });
          
          document.getElementById('dismiss-btn')?.addEventListener('click', () => {
            document.body.removeChild(installBanner);
          });
        }
      }, 30000);
    });
  }, [isRTL, isMobile, isInitialized, deviceModel]);

  // Add viewport meta validation
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      console.warn('⚠️ Missing viewport meta tag - adding dynamically');
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);
// Track iOS Safari visual viewport changes
useEffect(() => {
  const vv = window.visualViewport;

  const update = () => {
    if (!vv) return;
    document.documentElement.style.setProperty("--vvh", `${vv.height}px`);
    console.debug("📏 Updated --vvh:", vv.height);
  };

  update();
  vv?.addEventListener("resize", update);
  vv?.addEventListener("scroll", update);

  return () => {
    vv?.removeEventListener("resize", update);
    vv?.removeEventListener("scroll", update);
  };
}, []);

  
  // Enhanced mobile detection for sticky nav
  const shouldShowMobileNav = isInitialized && (isMobile || window.innerWidth <= 500);

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-white dark:bg-gray-900",
      isRTL ? 'rtl' : 'ltr',
      // Add mobile-specific body classes
      shouldShowMobileNav && "touch-manipulation overscroll-none"
    )}>
      {/* Language Switcher - Fixed Position (desktop only) */}
<div className="hidden md:block fixed top-4 right-4 z-50">
  <LanguageSwitcher />
</div>
      
      <Header />
      
      <main 
  className={cn(
    "flex-1",
    shouldShowMobileNav && "mobile-main-with-nav"
  )}
  style={{
    minHeight: shouldShowMobileNav 
      ? 'min(100svh, 100dvh)' 
      : '100vh'
  }}
>
  {children}
</main>
      
      <Footer />
      
      {/* Enhanced Mobile Sticky Nav - Always render for mobile devices */}
      <MobileStickyNav 
        activeItem={activeNavItem}
        vehicle={vehicle}
        onBookTestDrive={onBookTestDrive}
        onCarBuilder={onCarBuilder}
        onFinanceCalculator={onFinanceCalculator}
      />
      
      <Toaster />
    </div>
  );
};

export default ToyotaLayout;
