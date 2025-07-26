import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { user, updateEvaluationLimit } = useAppState();
  const [isUpdating, setIsUpdating] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [packageInfo, setPackageInfo] = useState<any>(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!user) {
        setLocation("/main");
        return;
      }

      try {
        // Get package info from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");
        const current = urlParams.get("current");
        const newLimit = urlParams.get("new");
        const price = urlParams.get("price");

        if (!type || !current || !newLimit || !price) {
          console.error("Missing package parameters");
          setLocation("/main");
          return;
        }

        const packageData = {
          type,
          currentLimit: parseInt(current),
          newLimit: parseInt(newLimit),
          price: parseFloat(price),
        };

        setPackageInfo(packageData);

        // Update user's evaluation limit
        await updateEvaluationLimit(packageData.newLimit);
        
        // Clear stored package data
        localStorage.removeItem("selectedPackage");
        
        setUpdateSuccess(true);
        setIsUpdating(false);

        // Show success message
        setTimeout(() => {
          alert(`Payment successful! Your daily limit has been increased to ${packageData.newLimit} evaluations.`);
        }, 1000);

      } catch (error) {
        console.error("Error updating evaluation limit:", error);
        setIsUpdating(false);
        alert("Failed to update your evaluation limit. Please contact support.");
      }
    };

    handlePaymentSuccess();
  }, [user, updateEvaluationLimit, setLocation]);

  const handleBackToMain = () => {
    setLocation("/main");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col justify-center p-6">
      <div className="max-w-md mx-auto w-full text-center">
        {isUpdating && (
          <>
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Processing Payment...</h1>
            <p className="text-xl text-white/80 mb-8">
              Please wait while we update your account.
            </p>
          </>
        )}

        {updateSuccess && packageInfo && (
          <>
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="text-green-600 h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-xl text-white mb-2">Your daily limit has been increased to</p>
            <p className="text-4xl font-bold text-white mb-8">
              {packageInfo.newLimit} evaluations
            </p>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
              <CardContent className="p-4">
                <div className="space-y-2 text-white/90">
                  <div className="flex justify-between items-center">
                    <span>Package:</span>
                    <span className="font-semibold">
                      {packageInfo.type === "basic" ? "Basic Upgrade" : "Premium Upgrade"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Amount Paid:</span>
                    <span className="font-semibold">${packageInfo.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Previous Limit:</span>
                    <span>{packageInfo.currentLimit} evaluations/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>New Limit:</span>
                    <span className="font-semibold text-green-400">
                      {packageInfo.newLimit} evaluations/day
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleBackToMain}
              className="w-full bg-white text-primary py-3 px-6 rounded-lg font-semibold text-lg hover:bg-neutral-100 shadow-lg"
            >
              Continue Evaluating
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 