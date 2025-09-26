import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ToyotaLayout from "@/components/ToyotaLayout";
import LuxuryShowcase from "@/components/LuxuryShowcase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const ctaSectionRef = useRef<HTMLDivElement | null>(null);
  const reserveButtonRef = useRef<HTMLButtonElement | null>(null);
  const [screenReaderMessage, setScreenReaderMessage] = useState<string>("");

  const focusReserveButton = useCallback(() => {
    window.setTimeout(() => {
      reserveButtonRef.current?.focus({ preventScroll: true });
    }, 250);
  }, []);

  const handleNavSelect = useCallback((action: string) => {
    setScreenReaderMessage("");

    switch (action) {
      case "reserve": {
        if (ctaSectionRef.current) {
          ctaSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          focusReserveButton();
          setScreenReaderMessage("Reserve section focused");
        } else {
          focusReserveButton();
        }

        toast({
          title: "Reserve your vehicle",
          description: "Complete the reservation form below to secure this configuration.",
        });
        break;
      }
      case "build": {
        toast({
          title: "Build & Price",
          description: "Launching the configuration experience.",
        });
        setScreenReaderMessage("Build and price experience opened in a new section.");
        break;
      }
      case "compare": {
        toast({
          title: "Compare vehicles",
          description: "Use the comparison view to evaluate specifications side by side.",
        });
        setScreenReaderMessage("Comparison tools ready.");
        break;
      }
      case "test-drive": {
        navigate("/test-drive");
        toast({
          title: "Test drive",
          description: "Redirecting you to schedule a test drive.",
        });
        setScreenReaderMessage("Navigating to the test drive booking page.");
        break;
      }
      case "share": {
        const shareData = {
          title: "Toyota Hybrid Experience",
          text: "Check out this Toyota Hybrid experience.",
          url: window.location.href,
        };

        if (navigator.share) {
          setScreenReaderMessage("Native share sheet opened.");
          navigator.share(shareData).catch(() => {
            toast({
              title: "Share",
              description: "Sharing was cancelled.",
            });
            setScreenReaderMessage("Share action cancelled.");
          });
        } else if (navigator.clipboard?.writeText) {
          navigator.clipboard
            .writeText(shareData.url)
            .then(() => {
              toast({
                title: "Link copied",
                description: "The page link has been copied to your clipboard.",
              });
              setScreenReaderMessage("Page link copied to clipboard.");
            })
            .catch(() => {
              toast({
                title: "Share",
                description: "Unable to copy the link automatically.",
                variant: "destructive",
              });
              setScreenReaderMessage("Sharing failed. Copy the link manually.");
            });
        } else {
          toast({
            title: "Share",
            description: "Sharing is not supported on this browser.",
            variant: "destructive",
          });
          setScreenReaderMessage("Sharing is not supported on this browser.");
        }
        break;
      }
      default:
        break;
    }
  }, [focusReserveButton, navigate, toast]);

  return (
    <ToyotaLayout>
      <LuxuryShowcase
        onReserve={() => handleNavSelect("reserve")}
        onBuild={() => handleNavSelect("build")}
        onCompare={() => handleNavSelect("compare")}
        onTestDrive={() => handleNavSelect("test-drive")}
        onShare={() => handleNavSelect("share")}
      />

      <section
        ref={ctaSectionRef}
        className="toyota-container py-16"
        aria-labelledby="reserve-cta-heading"
      >
        <div className="bg-gray-900 text-white p-10 rounded-3xl shadow-xl">
          <h2 id="reserve-cta-heading" className="text-3xl font-semibold">
            Reserve your Toyota Hybrid experience
          </h2>
          <p className="mt-4 text-base text-white/80">
            Provide your details to secure your build and we will contact you to complete the reservation.
          </p>
          <Button
            ref={reserveButtonRef}
            size="lg"
            className="mt-8 bg-white text-black hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-describedby="reserve-helptext"
            onClick={() =>
              toast({
                title: "Reservation started",
                description: "A Toyota representative will follow up with you shortly.",
              })
            }
          >
            Reserve now
          </Button>
          <p id="reserve-helptext" className="sr-only">
            Press Enter to start your reservation. A representative will contact you.
          </p>
        </div>
      </section>

      <div role="status" aria-live="polite" className="sr-only">
        {screenReaderMessage}
      </div>
    </ToyotaLayout>
  );
};

export default DemoPage;
