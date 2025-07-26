import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useState, useEffect } from "react";

interface PackageData {
  type: "basic" | "premium";
  currentLimit: number;
  newLimit: number;
  price: number;
}

export default function Payment() {
  const [, setLocation] = useLocation();
  const { user, updateEvaluationLimit } = useAppState();
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedPackage = localStorage.getItem("selectedPackage");
    if (storedPackage) {
      setPackageData(JSON.parse(storedPackage));
    } else {
      setLocation("/main");
    }
  }, [setLocation]);

  const handleBack = () => {
    setLocation("/limit-upgrade");
  };

  const handleExternalPayment = async () => {
    if (!packageData || !user) return;
    
    setIsProcessing(true);
    
    try {
      // Create URL with package data for return
      const returnUrl = `${window.location.origin}/payment-success?type=${packageData.type}&current=${packageData.currentLimit}&new=${packageData.newLimit}&price=${packageData.price}`;
      
      // Redirect to SpeedSellX payment links based on package type
      let externalPaymentUrl;
      if (packageData.type === "basic") {
        // +5 evaluations for $9.99
        externalPaymentUrl = "https://pay.speedsellx.com/688455C60E2C9";
      } else {
        // +10 evaluations for $19.99
        externalPaymentUrl = "https://pay.speedsellx.com/688455997C4B2";
      }
      
      console.log("Redirecting to SpeedSellX:", externalPaymentUrl);
      console.log("Return URL will be:", returnUrl);
      
      // Store return URL in localStorage for SpeedSellX to use
      localStorage.setItem("paymentReturnUrl", returnUrl);
      
      window.location.href = externalPaymentUrl;
    } catch (error) {
      console.error("Payment redirect error:", error);
      alert("Failed to redirect to payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!user || !packageData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-neutral-600 hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-neutral-800">Payment</h2>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* Package Summary */}
        <Card className="border border-neutral-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Package:</span>
                <span className="font-semibold">
                  {packageData.type === "basic" ? "Basic Upgrade" : "Premium Upgrade"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Current Limit:</span>
                <span>{packageData.currentLimit} evaluations/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">New Limit:</span>
                <span className="font-semibold text-primary">
                  {packageData.newLimit} evaluations/day
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    ${packageData.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border border-green-200 bg-green-50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm font-medium">Secure External Payment</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              You will be redirected to our secure payment partner.
            </p>
          </CardContent>
        </Card>

        {/* Pay Button */}
        <Button
          onClick={handleExternalPayment}
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary/90 py-3 text-lg font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 animate-spin" />
              Redirecting...
            </div>
          ) : (
            `Pay $${packageData.price.toFixed(2)}`
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-neutral-500 text-center mt-4">
          By completing this purchase, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
} 